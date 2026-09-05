const express = require('express');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

const pets = [];
let nextId = 1;

const requiredFields = ['nome', 'especie', 'idade', 'raca', 'dono'];

router.use(authenticateToken);

function validatePet(data) {
	if (!data || typeof data !== 'object' || Array.isArray(data)) {
		return 'O corpo da requisição deve ser um objeto JSON.';
	}

	const missingFields = requiredFields.filter((field) => {
		return data[field] === undefined || data[field] === null || data[field] === '';
	});

	if (missingFields.length > 0) {
		return `Os campos obrigatórios são: ${requiredFields.join(', ')}.`;
	}

	if (!Number.isInteger(data.idade) || data.idade < 0) {
		return 'O campo idade deve ser um número inteiro maior ou igual a zero.';
	}

	return null;
}

function getPetData(data) {
	return {
		nome: data.nome,
		especie: data.especie,
		idade: data.idade,
		raca: data.raca,
		dono: data.dono
	};
}

router.post('/', (req, res) => {
	const validationError = validatePet(req.body);

	if (validationError) {
		return res.status(400).json({ erro: validationError });
	}

	const pet = {
		id: nextId++,
		...getPetData(req.body)
	};

	pets.push(pet);

	return res.status(201).json(pet);
});

router.get('/', (req, res) => {
	return res.status(200).json(pets);
});

router.get('/:id', (req, res) => {
	const pet = pets.find((item) => item.id === Number(req.params.id));

	if (!pet) {
		return res.status(404).json({ erro: 'Pet não encontrado.' });
	}

	return res.status(200).json(pet);
});

router.put('/:id', (req, res) => {
	const petIndex = pets.findIndex((item) => item.id === Number(req.params.id));

	if (petIndex === -1) {
		return res.status(404).json({ erro: 'Pet não encontrado.' });
	}

	const validationError = validatePet(req.body);

	if (validationError) {
		return res.status(400).json({ erro: validationError });
	}

	pets[petIndex] = {
		id: pets[petIndex].id,
		...getPetData(req.body)
	};

	return res.status(200).json(pets[petIndex]);
});

router.delete('/:id', (req, res) => {
	const petIndex = pets.findIndex((item) => item.id === Number(req.params.id));

	if (petIndex === -1) {
		return res.status(404).json({ erro: 'Pet não encontrado.' });
	}

	const [deletedPet] = pets.splice(petIndex, 1);

	return res.status(200).json({
		mensagem: 'Pet removido com sucesso.',
		pet: deletedPet
	});
});

module.exports = router;
