'use strict'
const monogo = require('mongoose');
const { ObjectId } = monogo.Types;

// Chama o objeto de modelo para ter acesso a coleção (tabela) no banco de dados
const mongoose = require('mongoose');

class RepositoryBase {

	constructor(model) { 
		this._model = mongoose.model(model);
	}

	async create(data) {
		let modelo = new this._model(data);
		let resultado = await modelo.save();

		return resultado;
	}

	async update(id, data) {
        let resultado = await this._model.findById(id);
		await this._model.findByIdAndUpdate(id, { $set: data });

		return resultado;
	}

	async getAll() {
		return await this._model.find({ deletado: false });
	}

	async getById(id) {
        const idObj = new ObjectId(id);
		return await this._model.find({ _id: idObj, deletado: false });
	}

	async markAsDelete(id) {
		return await this._model.findByIdAndUpdate(id, { $set: { deletado: true, ativo: false } });
    }
    
    async delete(id) {
		return await this._model.findByIdAndRemove(id);
	}
}

module.exports = RepositoryBase;