const API_URL = '';
const TOKEN_KEY = 'petcare_api_token';

const elements = {
	tokenInput: document.querySelector('#token-input'),
	tokenStatus: document.querySelector('#token-status'),
	saveToken: document.querySelector('#save-token'),
	form: document.querySelector('#pet-form'),
	formTitle: document.querySelector('#form-title'),
	submitPet: document.querySelector('#submit-pet'),
	cancelEdit: document.querySelector('#cancel-edit'),
	refreshPets: document.querySelector('#refresh-pets'),
	petsList: document.querySelector('#pets-list'),
	feedback: document.querySelector('#feedback')
};

let editingPetId = null;

function normalizeToken(rawToken = '') {
	return String(rawToken || '').trim().replace(/^Bearer\s+/i, '');
}

function getToken() {
	return normalizeToken(localStorage.getItem(TOKEN_KEY));
}

function setFeedback(message, type = 'success') {
	elements.feedback.innerHTML = message ? `<div class="feedback-message feedback-${type}">${message}</div>` : '';
}

function updateTokenStatus() {
	const token = getToken();
	elements.tokenInput.value = token;
	elements.tokenStatus.textContent = token ? 'Token salvo. A área de pets está pronta para uso.' : 'Nenhum token salvo neste navegador.';
}

function authHeaders(json = false) {
	const token = getToken();
	const headers = {};
	if (token) headers.Authorization = `Bearer ${token}`;
	if (json) headers['Content-Type'] = 'application/json';
	return headers;
}

async function request(path, options = {}) {
	const response = await fetch(`${API_URL}${path}`, options);
	let data = null;
	try { data = await response.json(); } catch (_error) { data = {}; }
	if (!response.ok) throw new Error(data.erro || 'Não foi possível concluir a operação.');
	return data;
}

function petCard(pet) {
	return `
		<article class="pet-card">
			<div class="pet-card-top">
				<h3>${escapeHtml(pet.nome)}</h3>
				<span class="species-badge">${escapeHtml(pet.especie)}</span>
			</div>
			<dl class="pet-info">
				<div><dt>Idade</dt><dd>${pet.idade} ${pet.idade === 1 ? 'ano' : 'anos'}</dd></div>
				<div><dt>Raça</dt><dd title="${escapeHtml(pet.raca)}">${escapeHtml(pet.raca)}</dd></div>
				<div><dt>Dono</dt><dd title="${escapeHtml(pet.dono)}">${escapeHtml(pet.dono)}</dd></div>
			</dl>
			<div class="card-actions">
				<button class="card-button" data-action="edit" data-id="${pet.id}" type="button">Editar</button>
				<button class="card-button delete" data-action="delete" data-id="${pet.id}" type="button">Excluir</button>
			</div>
		</article>`;
}

function escapeHtml(value) {
	return String(value).replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#039;', '"': '&quot;' }[character]));
}

async function loadPets() {
	if (!getToken()) {
		elements.petsList.innerHTML = '<div class="empty-state"><span>🔐</span><h3>Token necessário</h3><p>Informe o token Bearer acima para visualizar os pets.</p></div>';
		setFeedback('Informe o token Bearer para usar as operações protegidas da API.', 'error');
		return;
	}

	try {
		const pets = await request('/pets', { headers: authHeaders() });
		elements.petsList.innerHTML = pets.length ? pets.map(petCard).join('') : '<div class="empty-state"><span>🐾</span><h3>Nenhum pet cadastrado ainda</h3><p>Use a ficha acima para adicionar o primeiro companheiro.</p></div>';
	} catch (error) {
		elements.petsList.innerHTML = `<div class="empty-state"><span>⚠️</span><h3>Não foi possível carregar os pets</h3><p>${escapeHtml(error.message)}</p></div>`;
		setFeedback(error.message, 'error');
	}
}

function formData() {
	return {
		nome: document.querySelector('#nome').value.trim(),
		especie: document.querySelector('#especie').value.trim(),
		idade: Number(document.querySelector('#idade').value),
		raca: document.querySelector('#raca').value.trim(),
		dono: document.querySelector('#dono').value.trim()
	};
}

function fillForm(pet) {
	Object.entries(pet).forEach(([key, value]) => {
		const field = document.querySelector(`#${key}`);
		if (field) field.value = value;
	});
	 editingPetId = pet.id;
	elements.formTitle.textContent = 'Editar cadastro';
	elements.submitPet.innerHTML = 'Salvar alterações <span aria-hidden="true">→</span>';
	elements.cancelEdit.classList.remove('hidden');
	document.querySelector('#cadastro').scrollIntoView({ behavior: 'smooth' });
}

function resetForm() {
	elements.form.reset();
	editingPetId = null;
	elements.formTitle.textContent = 'Novo cadastro';
	elements.submitPet.innerHTML = 'Cadastrar <span aria-hidden="true">→</span>';
	elements.cancelEdit.classList.add('hidden');
}

async function submitPet(event) {
	event.preventDefault();
	if (!getToken()) return setFeedback('Informe um token Bearer antes de cadastrar um pet.', 'error');

	try {
		const path = editingPetId ? `/pets/${editingPetId}` : '/pets';
		const method = editingPetId ? 'PUT' : 'POST';
		await request(path, { method, headers: authHeaders(true), body: JSON.stringify(formData()) });
		setFeedback(editingPetId ? 'Pet atualizado com sucesso! 🐾' : 'Pet cadastrado com sucesso! 🐾');
		resetForm();
		await loadPets();
	} catch (error) {
		setFeedback(error.message, 'error');
	}
}

async function deletePet(id) {
	if (!window.confirm('Deseja realmente excluir este pet?')) return;
	try {
		await request(`/pets/${id}`, { method: 'DELETE', headers: authHeaders() });
		setFeedback('Pet excluído com sucesso.');
		await loadPets();
	} catch (error) {
		setFeedback(error.message, 'error');
	}
}

elements.saveToken.addEventListener('click', () => {
	const token = normalizeToken(elements.tokenInput.value);
	if (token) {
		localStorage.setItem(TOKEN_KEY, token);
		setFeedback('Token salvo. Agora você pode gerenciar seus pets!');
	} else {
		localStorage.removeItem(TOKEN_KEY);
		setFeedback('Informe um token válido para acessar os pets.', 'error');
	}
	updateTokenStatus();
	loadPets();
});

elements.form.addEventListener('submit', submitPet);
elements.cancelEdit.addEventListener('click', resetForm);
elements.refreshPets.addEventListener('click', loadPets);
elements.petsList.addEventListener('click', async (event) => {
	const button = event.target.closest('button[data-action]');
	if (!button) return;
	const pets = await request('/pets', { headers: authHeaders() });
	const pet = pets.find((item) => item.id === Number(button.dataset.id));
	if (!pet) return setFeedback('Pet não encontrado.', 'error');
	if (button.dataset.action === 'edit') fillForm(pet);
	if (button.dataset.action === 'delete') await deletePet(pet.id);
});

updateTokenStatus();
loadPets();