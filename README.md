[![npm](https://img.shields.io/npm/v/ethersjs-azure-keyvault-signer)](https://www.npmjs.com/package/ethersjs-azure-keyvault-signer)
[![Build and Test](https://github.com/impactility-dev/ethersjs-azure-keyvault-signer/actions/workflows/build.yml/badge.svg)](https://github.com/impactility-dev/ethersjs-azure-keyvault-signer/actions/workflows/build.yml)
[![Publish](https://github.com/impactility-dev/ethersjs-azure-keyvault-signer/actions/workflows/publish.yml/badge.svg)](https://github.com/impactility-dev/ethersjs-azure-keyvault-signer/actions/workflows/publish.yml)
# ethersjs-azure-keyvault-signer
An Ethers.js compatible signer that connects to Azure Key Vault

# Installation
Install the azure keyvault signer library using npm

`npm install ethersjs-azure-keyvault-signer`

# Background
- Current web3 signers only support keys managed by the users directly in the form of browser wallets like Metamask, WalletConnect, Hardware wallets or self managed keys.
- Enterprises prefer to maintain the private keys in a secured key store like Azure Key Vault rather than letting their employees handle their private keys.
- Private keys generated and stored in key stores like Azure Key Vault/HSM are never exposed directly to the users. Interaction with such keys is done via SDKs developed by the respective key stores.
- Our library allows enterprise users to interact with dapps without having to deal with browser wallets or the hassle of managing keys
- It enables the user to perform cryptographic operations like signing messages and transactions stored in their enterprises' Azure Key Vault or Managed HSM

## Azure Key Vault Credentials Interface

Authentication to Azure Key Vault can be done either using client secret or client certificate.

> Note: The client certificate should be a .pem encoded file with unencrypted private key included.

```ts
interface AzureKeyVaultCredentials {
  keyName: string;
  vaultName: string;
  clientId: string;
  tenantId: string;
  clientSecret?: string;
  clientCertificatePath?: string;
  keyVersion?: string
}
```


# Sample Usage

You need to provide the Azure Key Vault credentials to instantiate an instance of `AzureKeyVaultSigner` shown below:


```ts
import {AzureKeyVaultCredentials, AzureKeyVaultSigner} from 'ethersjs-azure-keyvault-signer';
import {ethers} from 'ethers';

const keyVaultCredentials : AzureKeyVaultCredentials = {
    keyName: 'my-key',
    vaultUrl: 'https://my-vault.vault.azure.net',
    clientId: 'ACIXXXXXXXXXXXX',
    clientSecret: 'XXXXXXXXXXXXXXXXX',
    tenantId: 'ATIXXXXXXXXXXXXXXXX',
    keyVersion: '610f2XXXXXXXXXXX' //optional; if not included, latest version of the key is fetched
};

let azureKeyVaultSigner = new AzureKeyVaultSigner(keyVaultCredentials);

const provider = ethers.providers.getDefaultProvider('rinkeby');
azureKeyVaultSigner = azureKeyVaultSigner.connect(provider);

const tx = await azureKeyVaultSigner.sendTransaction({ to: '0x19De7137aEba698D5970d0B2d41eB03e0F97fA56', value: 2 });
console.log(tx);
```

# Examples
The following section provides code snippets that cover functionalities offered by ethersjs-azure-keyvault-signer package.
- Connect to a web3 provider
- Get Ethereum Address
- Sign a message
- Sign a transaction

## Connect to a web3 provider
connect function helps the Azure Key Vault signer connect to an ethers provider.

```ts
import {AzureKeyVaultCredentials, AzureKeyVaultSigner} from 'ethersjs-azure-keyvault-signer';
import {ethers} from 'ethers';

const keyVaultCredentials : AzureKeyVaultCredentials = {
    keyName: 'my-key',
    vaultUrl: 'https://my-vault.vault.azure.net',
    clientId: 'ACIXXXXXXXXXXXX',
    clientSecret: 'XXXXXXXXXXXXXXXXX',
    tenantId: 'ATIXXXXXXXXXXXXXXXX',
    keyVersion: '610f2XXXXXXXXXXX' //optional; if not included, latest version of the key is fetched
};

let azureKeyVaultSigner = new AzureKeyVaultSigner(keyVaultCredentials);

const provider = ethers.providers.getDefaultProvider('rinkeby');
azureKeyVaultSigner = azureKeyVaultSigner.connect(provider);

console.log(azureKeyVaultSigner);
```

## Get Ethereum Address
getAddress returns the Ethereum address for a SECP-256K1 key

```ts
import {AzureKeyVaultCredentials, AzureKeyVaultSigner} from 'ethersjs-azure-keyvault-signer';
import {ethers} from 'ethers';

const keyVaultCredentials : AzureKeyVaultCredentials = {
    keyName: 'my-key',
    vaultUrl: 'https://my-vault.vault.azure.net',
    clientId: 'ACIXXXXXXXXXXXX',
    clientSecret: 'XXXXXXXXXXXXXXXXX',
    tenantId: 'ATIXXXXXXXXXXXXXXXX',
    keyVersion: '610f2XXXXXXXXXXX' //optional; if not included, latest version of the key is fetched
};

let azureKeyVaultSigner = new AzureKeyVaultSigner(keyVaultCredentials);

const ethereumAddress = await azureKeyVaultSigner.getAddress();
console.log(ethereumAddress);
```

## Sign a message
signMessage signs a digest string with an Azure Key Vault SECP-256K1 private key using ES256K1 signing algorithm.

```ts
import {AzureKeyVaultCredentials, AzureKeyVaultSigner} from 'ethersjs-azure-keyvault-signer';
import {ethers} from 'ethers';

const keyVaultCredentials : AzureKeyVaultCredentials = {
    keyName: 'my-key',
    vaultUrl: 'https://my-vault.vault.azure.net',
    clientId: 'ACIXXXXXXXXXXXX',
    clientSecret: 'XXXXXXXXXXXXXXXXX',
    tenantId: 'ATIXXXXXXXXXXXXXXXX',
    keyVersion: '610f2XXXXXXXXXXX' //optional; if not included, latest version of the key is fetched
};

let azureKeyVaultSigner = new AzureKeyVaultSigner(keyVaultCredentials);

const message = 'Hello World!';

const signedMessage = await azureKeyVaultSigner.signMessage(message);
console.log(signedMessage);
```

## Sign a transaction
signTransaction will sign a raw Ethereum transaction using an Azure Key Vault SECP-256K1 private key. 

```ts
import {AzureKeyVaultCredentials, AzureKeyVaultSigner} from 'ethersjs-azure-keyvault-signer';
import {ethers} from 'ethers';

const keyVaultCredentials : AzureKeyVaultCredentials = {
    keyName: 'my-key',
    vaultUrl: 'https://my-vault.vault.azure.net',
    clientId: 'ACIXXXXXXXXXXXX',
    clientSecret: 'XXXXXXXXXXXXXXXXX',
    tenantId: 'ATIXXXXXXXXXXXXXXXX',
    keyVersion: '610f2XXXXXXXXXXX' //optional; if not included, latest version of the key is fetched
};

let azureKeyVaultSigner = new AzureKeyVaultSigner(keyVaultCredentials);

const transaction : ethers.providers.TransactionRequest = {
to: '0x19De7137aEba698D5970d0B2d41eB03e0F97fA56',
      value: 2
};

const signedTransaction = await azureKeyVaultSigner.signTransaction(transaction);
console.log(signedTransaction);
```

# LICENSE
MIT © [Impactility](https://github.com/impactility-dev)
