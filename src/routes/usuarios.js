const express = require('express');
const bcrypt = require('bcrypt');
const { usuarios, gerarId } = require('../data/usuarios');

const router = express.Router();

const requiredFields = ['nome', 'email', 'senha'];

function validateUser(data) {
	if (!data || typeof data !== 'object' || Array.isArray(data)) {
		return 'O corpo da requisição deve ser um objeto JSON.';
	}

	const missingFields = requiredFields.filter((field) => {
		return data[field] === undefined || data[field] === null || data[field] === '';
	});

	if (missingFields.length > 0) {
		return `Os campos obrigatórios são: ${requiredFields.join(', ')}.`;
	}

	return null;
}

function toPublicUser(usuario) {
	return {
		id: usuario.id,
		nome: usuario.nome,
		email: usuario.email
	};
}

router.post('/', async (req, res) => {
	const validationError = validateUser(req.body);

	if (validationError) {
		return res.status(400).json({ erro: validationError });
	}

	if (usuarios.some((usuario) => usuario.email === req.body.email)) {
		return res.status(409).json({ erro: 'Email já cadastrado.' });
	}

	const senhaHash = await bcrypt.hash(req.body.senha, 10);

	if (usuarios.some((usuario) => usuario.email === req.body.email)) {
		return res.status(409).json({ erro: 'Email já cadastrado.' });
	}

	const usuario = {
		id: gerarId(),
		nome: req.body.nome,
		email: req.body.email,
		senha: senhaHash
	};

	usuarios.push(usuario);

	return res.status(201).json(toPublicUser(usuario));
});

module.exports = router;