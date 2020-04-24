'use strict'

const validation = require('../bin/helpers/validation');
const repository = require('../repositories/igreja-repository');
const controllerBase = require('../bin/base/controller-base');

const _validationContract = new validation();
const _igrejaRepository = new repository();


class IgrejaController {
    
    constructor() { }
    
    // todo Criar uma middleware para apenas administrador acessar esse recurso
    async post(req, res) {
        IgrejaController.prototype.genericValidation(req);
        controllerBase.post(_igrejaRepository, _validationContract, req, res);
    }

    async put(req, res) {
        IgrejaController.prototype.genericValidation(req);
        const { id: idIgreja } = req.params;
        const igrejaFound = await _igrejaRepository.getById(idIgreja);
        
        _validationContract.isTrue(igrejaFound.length === 0, "Não foi possível atualizar, igreja não encontrada.");
        
        controllerBase.put(_igrejaRepository, _validationContract, req, res);
    }

    async get(req, res) {
        controllerBase.get(_igrejaRepository, req, res);
    }

    async getById(req, res) {
        controllerBase.getById(_igrejaRepository, req, res);
    }

    async delete(req, res) {
        controllerBase.delete(_igrejaRepository, req, res);
    }

    genericValidation(req) {
        const { nome, cidade, uf, bairro, rua, numero, complemento, cep, telefone, whatsApp } = req.body;
        _validationContract.clear();
        _validationContract.isRequired(nome, 'O nome da igreja é obrigatório');
        _validationContract.isRequired(cidade, 'O nome da cidade é obrigatória');
        _validationContract.isRequired(uf, 'A unidade federativa é obrigatória');
        _validationContract.isRequired(bairro, 'O bairro é obrigatório');
        _validationContract.isRequired(rua, 'O nome da rua é obrigatório');
        _validationContract.isRequired(numero, 'O número é obrigatório');
        _validationContract.isRequired(complemento, 'O complemento é obrigatório');
        _validationContract.isRequired(cep, 'O CEP é obrigatório');
        _validationContract.isRequired(telefone, 'O número de telefone é obrigatório');
        _validationContract.isRequired(whatsApp, 'O número do whatsApp é obrigatório');
    }
}

module.exports = IgrejaController;
