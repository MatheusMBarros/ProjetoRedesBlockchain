// meu_contrato.js

const { Contract } = require('fabric-contract-api');

class TransferContract extends Contract {

    async init(ctx) {
        console.log('Inicializando o contrato e alocando 10 atletas...');

        // Alocar 10 atletas
        const atletas = [
            { atletaID: 'ID1', nome: 'Atleta1', idade: 25, clube: 'ClubeA', proprietario: 'Proprietario1' },
            { atletaID: 'ID2', nome: 'Atleta2', idade: 28, clube: 'ClubeB', proprietario: 'Proprietario2' },
            { atletaID: 'ID3', nome: 'Atleta3', idade: 22, clube: 'ClubeC', proprietario: 'Proprietario3' },
            { atletaID: 'ID4', nome: 'Atleta4', idade: 30, clube: 'ClubeD', proprietario: 'Proprietario4' },
            { atletaID: 'ID5', nome: 'Atleta5', idade: 26, clube: 'ClubeE', proprietario: 'Proprietario5' },
            { atletaID: 'ID6', nome: 'Atleta6', idade: 24, clube: 'ClubeF', proprietario: 'Proprietario6' },
            { atletaID: 'ID7', nome: 'Atleta7', idade: 29, clube: 'ClubeG', proprietario: 'Proprietario7' },
            { atletaID: 'ID8', nome: 'Atleta8', idade: 27, clube: 'ClubeH', proprietario: 'Proprietario8' },
            { atletaID: 'ID9', nome: 'Atleta9', idade: 23, clube: 'ClubeI', proprietario: 'Proprietario9' },
            { atletaID: 'ID10', nome: 'Atleta10', idade: 31, clube: 'ClubeJ', proprietario: 'Proprietario10' },
        ];

        // Armazenar os atletas no ledger
        for (const atleta of atletas) {
            await ctx.stub.putState(atleta.atletaID, Buffer.from(JSON.stringify(atleta)));
        }

        console.log('Alocação de 10 atletas concluída.');
    }

    async criarAtleta(ctx, atletaID, nome, idade, clube) {
        // Lógica para criar um atleta
        const atleta = {
            atletaID,
            nome,
            idade,
            clube,
            proprietario: ctx.clientIdentity.getID() 
        };
        await ctx.stub.putState(atletaID, Buffer.from(JSON.stringify(atleta)));
        return JSON.stringify(atleta);
    }

    async transferirAtleta(ctx, atletaID, novoProprietario) {
        // Lógica para transferir um atleta para um novo proprietário
        const atletaAsBytes = await ctx.stub.getState(atletaID);
        if (!atletaAsBytes || atletaAsBytes.length === 0) {
            throw new Error(`O atleta com ID ${atletaID} não foi encontrado.`);
        }

        const atleta = JSON.parse(atletaAsBytes.toString());

        // Verificar se quem está fazendo a transferência é o proprietário atual
        if (atleta.proprietario !== ctx.clientIdentity.getID()) {
            throw new Error(`Você não tem permissão para transferir o atleta com ID ${atletaID}.`);
        }

        // Transferir para o novo proprietário
        atleta.proprietario = novoProprietario;
        await ctx.stub.putState(atletaID, Buffer.from(JSON.stringify(atleta)));

        return JSON.stringify(atleta);
    }

    async consultarAtleta(ctx, atletaID) {
      // Lógica para consultar informações de um atleta
      const atletaAsBytes = await ctx.stub.getState(atletaID);
      if (!atletaAsBytes || atletaAsBytes.length === 0) {
          throw new Error(`O atleta com ID ${atletaID} não foi encontrado.`);
      }
      const atleta = JSON.parse(atletaAsBytes.toString());
      return JSON.stringify(atleta);
  }

  async listarAtletas(ctx) {
    // Lógica para listar todos os atletas registrados
    const startKey = '';
    const endKey = '';
    const iterator = await ctx.stub.getStateByRange(startKey, endKey);

    const atletas = [];
    for await (const result of iterator) {
        const atleta = JSON.parse(result.value.toString());
        atletas.push(atleta);
    }

    return JSON.stringify(atletas);
}

}

module.exports = TransferContract;
