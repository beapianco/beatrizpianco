const crypto = require('crypto');
const express = require('express');
const bcrypt = require('bcrypt');
const { usuarios } = require('../data/usuarios');

const router = express.Router();

router.post('/', async (req, res) => {
	const { email, senha } = req.body || {};

	if (!email || !senha) {
		return res.status(400).json({ erro: 'Email e senha são obrigatórios.' });
	}

	const usuario = usuarios.find((item) => item.email === email);
	const senhaValida = usuario && await bcrypt.compare(senha, usuario.senha);

	if (!usuario || !senhaValida) {
		return res.status(401).json({ erro: 'Email ou senha inválidos.' });
	}

	const token = crypto.randomBytes(32).toString('hex');
	usuario.token = token;

	return res.status(200).json({
		mensagem: 'Login realizado com sucesso.',
		token,
		usuario: {
			id: usuario.id,
			nome: usuario.nome,
			email: usuario.email
		}
	});
});

module.exports = router;