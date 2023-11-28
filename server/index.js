const express = require('express');
const { Gateway, Wallets } = require('fabric-network');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

const ccpPath = path.resolve(__dirname, '../fabric-samples/test-network/organizations/peerOrganizations/org1.example.com/connection-org1.json');
const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
const ccp = JSON.parse(ccpJSON);

app.use(express.json());

app.post('/criarAtleta', async (req, res) => {
    try {
        const { atletaID, nome, idade, clube } = req.body;

        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'user1', discovery: { enabled: true, asLocalhost: true } });

        const network = await gateway.getNetwork('mychannel');
        const contract = network.getContract('transfer');

        const result = await contract.submitTransaction('criarAtleta', atletaID, nome, idade, clube);

        res.json({ result: result.toString() });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ...

app.post('/transferirAtleta', async (req, res) => {
  try {
      const { atletaID, novoProprietario } = req.body;

      const gateway = new Gateway();
      await gateway.connect(ccp, { wallet, identity: 'user1', discovery: { enabled: true, asLocalhost: true } });

      const network = await gateway.getNetwork('mychannel');
      const contract = network.getContract('transfer');

      const result = await contract.submitTransaction('transferirAtleta', atletaID, novoProprietario);

      res.json({ result: result.toString() });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

app.get('/consultarAtleta/:atletaID', async (req, res) => {
  try {
      const { atletaID } = req.params;

      const gateway = new Gateway();
      await gateway.connect(ccp, { wallet, identity: 'user1', discovery: { enabled: true, asLocalhost: true } });

      const network = await gateway.getNetwork('mychannel');
      const contract = network.getContract('transfer');

      const result = await contract.evaluateTransaction('consultarAtleta', atletaID);

      res.json(JSON.parse(result.toString()));
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

app.get('/listarAtletas', async (req, res) => {
  try {
      const gateway = new Gateway();
      await gateway.connect(ccp, { wallet, identity: 'user1', discovery: { enabled: true, asLocalhost: true } });

      const network = await gateway.getNetwork('mychannel');
      const contract = network.getContract('transfer');

      const result = await contract.evaluateTransaction('listarAtletas');

      res.json(JSON.parse(result.toString()));
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

app.delete('/excluirAtleta/:atletaID', async (req, res) => {
  try {
      const { atletaID } = req.params;

      const gateway = new Gateway();
      await gateway.connect(ccp, { wallet, identity: 'user1', discovery: { enabled: true, asLocalhost: true } });

      const network = await gateway.getNetwork('mychannel');
      const contract = network.getContract('transfer');

      await contract.submitTransaction('excluirAtleta', atletaID);

      res.json({ message: `Atleta com ID ${atletaID} excluído com sucesso.` });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

// ...

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
