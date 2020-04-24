const express = require('express'); // Importa o ExpressJS do node modules
const bodyParser = require('body-parser'); // Importa o Body Parser do node modules
const mongoose = require('mongoose'); // Importa a bibloteca Mongoose do node modules
const variables = require('../bin/configuration/variables');

// Criando/Invocando a API/Server Web do Express
const app = express(); // Invoca o express

// Configuração do parse do JSON
app.use(bodyParser.json({ limit: '10mb' })); // Configura o Express para converter o body em objeto JSON.
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }));

// Configurando a conexão com o banco de dados
/** No primeiro parâmetro você informa que o mongoose deve usar o novo formato de conexão por url, 
 * e no segundo que ele deve criar criar index das coleções. 
 * */
mongoose.connect(variables.Database.conection, { useNewUrlParser: true, useCreateIndex: true });

// routers
const usuarioRouter = require('../routes/usuario-router');
const igrejaRouter = require('../routes/igreja-router');
const informativoRouter = require('../routes/informativo-router');


// Configuração das rotas
app.use('/api/igreja', igrejaRouter);
app.use('/api/usuario', usuarioRouter);
app.use('/api/informativo', informativoRouter);


module.exports = app; // Exporta nossa API

// API -> MIDDLEWARES -> Rotas -> Controller -> Repository -> Banco