const mongoose = require('mongoose');
const usuarioModel = require('../models/usuario-model');

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const md5 = require('md5');

// Configura o chai para usar o should.
const should = chai.should();

// Configura o chai para usar o chaiHttp.
chai.use(chaiHttp);


describe('Api Usuários', () => {

    let token = '';
    let _idUsuarioRegistrado = '';

    before((done) => {

        // Deleta os usuarios de teste
        usuarioModel.deleteMany({ nome: /.*Usuario Mocha*/i }, () => {

            // Cria um novo usuario para teste
            let usuario = new usuarioModel({
                nome: 'Usuario Mocha',
                email: 'usuariomocha@nofood.com',
                senha: md5('123'),
                telefone: '(00) 0000-0000'
            });

            // Salva no banco de dados o novo usuario
            usuario.save().then(() => {

                // Obtém autenticação com o usuário recém cadastrado
                chai.request(server)
                    .post('/api/usuario/autenticar')
                    .send({ email: usuario.email, senha: '123' })
                    .end((error, response) => {
                        token = response.body.token;
                        done(); // Indica que essa parte do codigo esta concluída
                    });

            });
        });

    });

    describe('/POST', () => {

        it('Registra novo usuário', (done) => {
            chai.request(server)
                .post('/api/usuario/register')
                .send({
                    nome: 'Usuario Mocha',
                    email: 'usuariomocha1@nofood.com',
                    senha: '123',
                    senhaConfirmacao: '123',
                    telefone: '(00) 0000-0000'
                })
                .end((err, res) => {
                    _idUsuarioRegistrado = res.body._id;
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    res.body.should.have.property('email').eql('usuariomocha1@nofood.com');
                    done();
                });
        });

        it('Autentica o novo usuário cadastrado', (done) => {
            chai.request(server)
                .post('/api/usuario/autenticar')
                .send({ email: 'usuariomocha1@nofood.com', senha: '123' })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('token');
                    done(); // Indica que essa parte do codigo esta concluída
                });
        });
    });

    describe('/GET', () => {

        it('Lista os usuários da api', (done) => {
            chai.request(server)
                .get('/api/usuario')
                .set('x-access-token', token)
                .end((error, response) => {
                    console.error(response.body);
                    response.body.should.be.a('array');
                    response.should.have.status(200);
                    done();
                });
        });

        it('Verifica os dados do usuário já cadastrado', (done) => {
            chai.request(server)
                .get(`/api/usuario/${_idUsuarioRegistrado}`)
                .set('x-access-token', token)
                .end((err, res) => {
                    res.body.should.have.be.a('object');
                    res.should.have.status(200);
                    res.body.should.have.property('email').eql('usuariomocha1@nofood.com');
                    res.body.should.have.property('nome').eql('Usuario Mocha');
                    done();
                });
        });
    });

    describe('/PUT', () => {

        it('Alteraçao de usuário cadastrado', (done) => {
            chai.request(server)
                .put(`/api/usuario/${_idUsuarioRegistrado}`)
                .set('x-access-token', token)
                .send({
                    nome: 'Usuario Mocha | TESTE ALTERADO',
                    email: 'usuariomocha1@nofood.com'
                })
                .end((err, res) => {
                    _idUsuarioRegistrado = res.body._id;
                    res.should.have.status(202);
                    res.body.should.be.a('object');
                    res.body.should.have.property('nome').eql('Usuario Mocha | TESTE ALTERADO');
                    done();
                });
        })
    });

    describe('/DELETE', () => {

        it('Deleta usuário cadastrado', (done) => {
            chai.request(server)
                .del(`/api/usuario/${_idUsuarioRegistrado}`)
                .set('x-access-token', token)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('Registro excluido com sucesso!');
                    done();
                });
        })
    });

});