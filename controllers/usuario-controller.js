'use strict'

const repository = require('../repositories/usuario-repository');
const validation = require('../bin/helpers/validation');
const controllerBase = require('../bin/base/controller-base');
const _validationContract = new validation();
const _repository = new repository();

// Dependências para a geração do Token
const md5 = require('md5');
const jwt = require('jsonwebtoken');
const variables = require('../bin/configuration/variables');


class UsuarioController {

    constructor() { }

    // Inseri dentro da classe o método post e definie que esse método será assíncrono
    async post(req, res) {
        _validationContract.clear();

        let data = req.body;

        _validationContract.isRequired(req.body.nome, 'Informe seu nome');
        _validationContract.isRequired(req.body.email, 'Informe seu email');
        _validationContract.isEmail(req.body.email, 'E-mail informado é inválido');
        _validationContract.isRequired(req.body.senha, 'A senha informada é obrigatória');
        _validationContract.isRequired(req.body.senhaConfirmacao, 'A senha de confirmação é obrigatória');
        _validationContract.isTrue(req.body.senha !== req.body.senhaConfirmacao, 'A senha e a confirmação não são iguais');
        
        if (req.body.email) {
            let usuarioIsEmailExiste = await _repository.isEmailExiste(req.body.email);
            if (usuarioIsEmailExiste) {
                _validationContract.isTrue(usuarioIsEmailExiste.nome != undefined, `Já existe o e-mail ${req.body.email} cadastrado em nossa base.`);
            }
        }
        
        if (req.body.senha) {
            // Criptografa a senha do usuário 
            data.senha = md5(req.body.senha);
        }
        
        controllerBase.post(_repository, _validationContract, req, res);
    }

    async put(req, res) {
        _validationContract.clear();
        _validationContract.isRequired(req.body.nome, 'Informe seu nome');
        _validationContract.isRequired(req.body.email, 'Informe seu email');
        _validationContract.isEmail(req.body.email, 'E-mail informado é inválido');
        _validationContract.isRequired(req.params.id, 'Informe o Id do usuário que será editado');
        
        let usuarioIsEmailExiste = await _repository.isEmailExiste(req.body.email);
        
        if (usuarioIsEmailExiste) {
            _validationContract.isTrue(usuarioIsEmailExiste.nome != undefined &&
                (usuarioIsEmailExiste._id != req.params.id), `Já existe o e-mail ${req.body.email} cadastrado em nossa base.`);
        }
        controllerBase.put(_repository, _validationContract, req, res);
    }

    async get(req, res) {
        controllerBase.get(_repository, req, res);
    }

    async getById(req, res) {
        controllerBase.getById(_repository, req, res);
    }

    async delete(req, res) {
        controllerBase.delete(_repository, req, res);
    }

    async autenticar(req, res) {
        _validationContract.clear();
        _validationContract.isRequired(req.body.email, 'Informe seu e-mail');
        _validationContract.isRequired(req.body.senha, 'Informe sua senha');
        _validationContract.isEmail(req.body.email, 'E-mail informado é inválido');
        
        if (!_validationContract.isValid()) {
            res.status(400).send({ message: 'Não for possível efetuar o login.', validation: _validationContract.errors() });
            return;
        }

        let usuarioEncontrado = await _repository.authenticate(req.body.email, req.body.senha);
        // console.log(usuarioEncontrado);
        
        // Gera o token e devolve para o usuário se autenticar
        if (usuarioEncontrado) {
            res.status(200).send({
                usuario: usuarioEncontrado,
                token: jwt.sign({ user: usuarioEncontrado }, variables.Security.secretyKey)
            });
        }
        else {
            res.status(404).send({ message: 'Usuário e senha informado são inválidos!' });
        }
    }
}

// Exporta a classe para ser usada em outras partes do sistema
module.exports = UsuarioController;
