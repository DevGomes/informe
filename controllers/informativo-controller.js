'use-strict'

const validation = require('../bin/helpers/validation');
const repository = require('../repositories/informativo-repository');
const controllerBase = require('../bin/base/controller-base');

const _validationContract = new validation();
const _informativoRepository = new repository();


class InformativoController {

    constructor() { }

    async post(req, res) {
        InformativoController.prototype._genericValidation(req);
        controllerBase.post(_informativoRepository, _validationContract, req, res);
    }

    async put(req, res) {
        InformativoController.prototype._genericValidation(req);

        const { id: idInformativo } = req.params;
        const informativoFound = await _informativoRepository.getById(idInformativo);
        
        _validationContract.isTrue(informativoFound.length === 0, "Não foi possível atualizar, informativo não encontrado.");

        controllerBase.put(_informativoRepository, _validationContract, req, res);
    }

    async get(req, res) {
        controllerBase.get(_informativoRepository, req, res);
    }

    async getById(req, res) {
        controllerBase.getById(_informativoRepository, req, res);
    }

    async delete(req, res) {
        controllerBase.delete(_informativoRepository, req, res);
    }

    async _genericValidation(req) {
        _validationContract.clear();
        const { mes, ano, versiculoMes, avisos } = req.body;
        _validationContract.isRequired(mes, 'O mês do informativo é obrigatório');
        _validationContract.isRequired(ano, 'O ano do informativo é obrigatório');
        _validationContract.isRequired(versiculoMes, "O versículo do mês é obrigatório");
        _validationContract.isNotArray(avisos, "Os avisos são obrigatórios");

        _validationContract.isRequiredPropertiesArray(avisos, ['tituloPrincipal', 'aviso'], "Existe campos obrigatório dos avisos que não foram preenchidos");
    }
}

module.exports = InformativoController;
