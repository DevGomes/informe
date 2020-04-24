'use strict'

/** Configuração de Schema */

const mongoose = require('mongoose');
const schema = mongoose.Schema;

// Definições do schema, configuração dos campos e seus tipos.
const usuarioModel = new schema({
	nome: { trim: true, index: true, required: true, type: String },
    email: { type: String, required: true },
    telefone: { type: String, required: false },
	senha: { type: String, required: true },
    foto: { type: String },
    isAdmin: { type: Boolean, default: false },
	ativo: { type: Boolean, required: true, default: true },
    dataCriacao: { type: Date, default: Date.now },
    dataAtualizacao: { type: Date, default: Date.now },
    deletado: { type: Boolean, required: false, default: false }
}, { versionKey: false });

// Antes de salvar categoria
usuarioModel.pre('save', next => {
	let agora = new Date();
	if (this.dataCriacao)
		this.dataCriacao = agora;
	next();
});

module.exports = mongoose.model('Usuario', usuarioModel);