const jwt = require('jsonwebtoken');
const variables = require('../bin/configuration/variables');

module.exports = async (req, res, next) => {
	const token = req.body.token || req.query.query || req.header('x-access-token');

	if (token) {
		
		try {
			const decoded = await jwt.verify(token, variables.Security.secretyKey); // Verifica o token
			req.usuarioLogado = decoded;
			next(); // Autoriza a continuação da requisição
		} catch(error) {
			res.status(401).send({message: 'Token informado é inválido'});
			return;
		}

	} else {
		res.status(401).send({message: 'Acesso negado, você precisa informar um token para acessar esse recurso.'});
		return;
	}

};