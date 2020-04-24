'use strict' // Para a minificação

const app = require('./bin/express');
const variables = require('./bin/configuration/variables');

// Ponto de inicialização da API
app.listen(variables.API.port, () => {
	console.info(`API inicializada com sucesso na porta ${variables.API.port}.`);
});

module.exports = app;
