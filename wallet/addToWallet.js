const { Wallets } = require('fabric-network');
const path = require('path');
const fs = require('fs');  // Adicione esta linha

async function addToWallet() {
    const walletPath = path.join(process.cwd(), 'wallet');
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    const identityLabel = 'user1';
    const certificatePath = 'fabric-samples/test-network/organizations/peerOrganizations/org1.example.com/users/User1@org1.example.com/msp/signcerts/';
    const privateKeyPath = '/Users/barros/hyperledger/fabric-samples/test-network-nano-bash/crypto-config/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp/priv_sk'; 

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

addToWallet();
