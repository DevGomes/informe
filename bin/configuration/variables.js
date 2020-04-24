const variables = {
	API: { 
		port: process.env.port || 3000
	},
	Database: {
		conection: process.env.conection || '[URL_ACCESS_DATA_BASE]'
	},
	Security: {
		secretyKey: 'ce2252b75903922613f784e8f75f14c4&&93e33544d6f4f12066ce384c56cdefe33'
	}
};

module.exports = variables; // Exporta a variavel para ser usada em outras parte do projeto