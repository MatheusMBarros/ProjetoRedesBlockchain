const { Gateway, Wallets } = require('fabric-network');
const path = require('path');
const fs = require('fs');

async function main() {
    try {
        // Caminho para o arquivo connection.json
        const ccpPath = path.resolve(__dirname, '../fabric-samples/test-network/organizations/peerOrganizations/org1.example.com/connection-org1.json');
        const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
        const ccp = JSON.parse(ccpJSON);

        // Criar a carteira e adicionar a identidade 'user1'
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);

        const identityLabel = 'user1';
        const identity = await wallet.get(identityLabel);
        if (!identity) {
            console.log(`Adicionando a identidade ${identityLabel} à carteira...`);
            const certificatePath = path.resolve(__dirname, '../fabric-samples/test-network/organizations/peerOrganizations/org1.example.com/users/User1@org1.example.com/msp/signcerts/User1@org1.example.com-cert.pem');
            const privateKeyPath = path.resolve(__dirname, '../fabric-samples/test-network/organizations/peerOrganizations/org1.example.com/users/User1@org1.example.com/msp/keystore/priv_sk');

            const certificate = fs.readFileSync(certificatePath, 'utf8');
            const privateKey = fs.readFileSync(privateKeyPath, 'utf8');

            await wallet.put(identityLabel, {
                credentials: {
                    certificate,
                    privateKey,
                },
                type: 'X.509',
            });

            console.log(`Identidade ${identityLabel} adicionada à carteira.`);
        }

        // Conectar ao gateway usando a carteira
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: identityLabel, discovery: { enabled: true, asLocalhost: true } });

        const network = await gateway.getNetwork('mychannel');
        const contract = network.getContract('transfer');

        // Exemplo de chamada de função no contrato
        const result = await contract.submitTransaction('criarAtleta', 'ID11', 'Atleta11', '28', 'ClubeK');

        console.log(result.toString());
    } catch (error) {
        console.error(`Erro na execução do cliente: ${error.message}`);
    }
}

main();
