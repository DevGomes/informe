
// exports é uma palavra chave expor os métodos internos de uma classe JS

exports.post = async(repository, validationContract, req, res) => {
	try {
		let data = req.body;
		
		if (!validationContract.isValid()) {
			res.status(400).send({
				message: "Existe dados inválidos na sua requisição",
				validation: validationContract.errors()
			}).end(); // Encerra a resposta
			return;
		}

		let resultado = await repository.create(data);
		res.status(201).send(resultado);

	} catch(err) {
		console.log('post com error, motivo: ', err)
		res.status(500).send({message: 'Erro no processamento', error: err});
	}
};

exports.put = async(repository, validationContract, req, res) => {
	try {
		let data = req.body;
        data.dataAtualizacao = Date.now();
        
		if (!validationContract.isValid()) {
			res.status(400).send({
				message: "Existe dados inválidos na sua requisição",
				validation: validationContract.errors()
			}).end(); // Encerra a resposta
			return;
		}

		let resultado = await repository.update(req.params.id, data);
		res.status(202).send(resultado);

	} catch(err) {
		console.log('put com error, motivo: ', err)
		res.status(500).send({message: 'Erro no processamento', error: err});
	}
};

exports.get = async(repository, req, res) => {
	try {
		let data = await repository.getAll();
		res.status(200).send(data);
	} catch(err) {
		console.log('get com error, motivo: ', err)
		res.status(500).send({message: 'Erro no processamento', error: err});
	}
}

exports.getById = async(repository, req, res) => {
	try {
		let id = req.params.id
		if (id) {
			let data = await repository.getById(id);
			res.status(200).send(data);
		} else {
			res.status(400).send({message: 'O parâmetro Id precisa ser informado.'});
		}
		
	} catch(err) {
		console.log('getById com error, motivo: ', err)
		res.status(500).send({message: 'Erro no processamento', error: err});
	}
}

exports.delete = async(repository, req, res) => {
	try {
		let id = req.params.id
		if (id) {
			let data = await repository.delete(id);
			res.status(200).send({message: 'Registro excluido com sucesso!'});
		} else {
			res.status(400).send({message: 'O parâmetro Id precisa ser informado.'});
		}
		
	} catch(err) {
		console.log('delete com error, motivo: ', err)
		res.status(500).send({message: 'Erro no processamento', error: err});
	}
}
