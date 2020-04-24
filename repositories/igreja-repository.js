require('../models/igreja-model'); // Registar o modelo para o repositorio ter acesso ao banco de dados;
const repositoryBase = require('../bin/base/repository-base');

/**
 * * Acesso a esse recurso apenas para adminsitrador do sistema
 */
class IgrejaRepository {
    
    constructor() {
        // Nome do modelo dado no mapeamento da entidade
        this._repositoryBase = new repositoryBase('Igreja');
    }

    async create(data) {
        return await this._repositoryBase.create(data);
    }

    async update(id, data) {
        return await this._repositoryBase.update(id, data);
    }

    async getAll() {
        return await this._repositoryBase.getAll();
    }

    async getById(id) {
        return await this._repositoryBase.getById(id);
    }

    async delete(id) {
        return await this._repositoryBase.markAsDelete(id);
    }
}

module.exports = IgrejaRepository;