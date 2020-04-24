'use strict'

/** Configurações de Schema */
const mongoose = require('mongoose');
const schema = mongoose.Schema;

// Definições do schema, configurações dos campos e seus tipos
const igrejaModel = new schema({
    nome: { trim: true, index: true, required: true, type: String },
    cidade: { type: String, required: true },
    uf: { type: String, required: true },
    bairro: { type: String, required: true },
    rua: { type: String, required: true },
    numero: { type: Number, required: true },
    complemento: { type: String, required: false },
    cep: { type: String, required: false },
    telefone: { type: String, required: false },
    whatsApp: { type: String, required: true },
    foto: { type: String },
    dataCriacao: { type: Date, default: Date.now },
    dataAtualizacao: { type: Date, default: Date.now },
    ativo: { type: Boolean, default: true },
    deletado: { type: Boolean, default: false }
}, { versionKey: false });

igrejaModel.pre('save', next => {
    let agora = new Date();
    if (this.dataCriacao) {
        this.dataCriacao = agora;
    }
    next();
});

module.exports = mongoose.model('Igreja', igrejaModel);
