'use strict'

const mongoose = require('mongoose');
const schema = mongoose.Schema;

// Definições do schema, configuração dos campos e seus tipos
const informativoModel = new schema({
    mes: { type: String, index: true, required: true, trim: true },
    ano: { type: Number, required: true },
    versiculoMes: { type: String },
    avisos: [{
        tituloPrincipal: { type: String, required: true },
        tituloSecundario: { type: String },
        aviso: { type: String, required: true },
        foto: { type: String }
    }],
    deletado: { type: Boolean, default: false },
    ativo: { type: Boolean, default: true },
    dataCriacao: { type: Date, default: Date.now },
    dataAtualizacao: { type: Date, default: Date.now },
    idUsuario: { type: schema.Types.ObjectId, ref: 'Usuario' },
}, { versionKey: false });


informativoModel.pre('save', next => {
    let agora = new Date();
    if (this.dataCriacao) {
        this.dataCriacao = agora;
    }
    next();
});

module.exports = mongoose.model('Informativo', informativoModel);
