require('../models/usuario-model');
const base = require('../bin/base/repository-base');
const md5 = require('md5');

class UsuarioRepository {

	constructor() { 
		this._base = new base('Usuario');
		this._projection = 'nome email _id'; // Usado no mongoose para apenas retornar esses campos especificos
	}

	async isEmailExiste(Email) {
		return await this._base._model.findOne({ email: Email }, this._projection);
	}

	async authenticate(Email, Senha) {
		let _hasSenha = md5(Senha);
		return await this._base._model.findOne({ email: Email, senha: _hasSenha }, this._projection);
	}

	async create(data) {
		let usuarioCriado = await this._base.create(data);
		return await this._base._model.findById(usuarioCriado._id, this._projection)
	}

	async update(id, data) {
		let usuarioAtualizado = await this._base.update(id, 
			{
				nome: data.nome,
				email: data.email,
                foto: data.foto,
                telefone: data.telefone
			});
		return await this._base._model.findById(usuarioAtualizado._id, this._projection);
	}

	async getAll() {
		return await this._base._model.find({}, this._projection);
	}

	async getById(id) {
		return await this._base._model.findById(id, 'nome email _id foto');
	}

	async delete(id) {
		return await this._base.markAsDelete(id);
	}
}

module.exports = UsuarioRepository;