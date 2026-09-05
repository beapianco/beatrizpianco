const { usuarios } = require('../data/usuarios');

function authenticateToken(req, res, next) {
	const authorization = req.get('Authorization') || '';
	const [scheme, token] = authorization.split(' ');

	if (scheme !== 'Bearer' || !token) {
		return res.status(401).json({ erro: 'Token de autenticação não informado.' });
	}

	const usuario = usuarios.find((item) => item.token === token);

	if (!usuario) {
		return res.status(401).json({ erro: 'Token de autenticação inválido.' });
	}

	req.usuario = usuario;
	return next();
}

module.exports = authenticateToken;