import {ethers} from 'ethers';
import {KeyClient} from '@azure/keyvault-keys';
import {ClientSecretCredential} from '@azure/identity';
import {AzureKeyVaultCredentials} from '../index';

/**
 *
 * @param {AzureKeyVaultCredentials} keyVaultCredentials
 */
export async function getPublicKey(keyVaultCredentials:
  AzureKeyVaultCredentials) {
  const credentials = new ClientSecretCredential(
      keyVaultCredentials.tenantId, keyVaultCredentials.clientId,
      keyVaultCredentials.clientSecret);
  const keyVaultUrl = `https://${keyVaultCredentials.vaultName}.vault.azure.net`;
  const client = new KeyClient(keyVaultUrl, credentials);

  const keyObject = await client.getKey(keyVaultCredentials.keyName);
  const publicKey = Buffer.concat([Uint8Array.from([4]),
    keyObject.key.x, keyObject.key.y]);

  return publicKey;
}
/**
 *
 * @param {Buffer} publicKey
 * @return {string}
 */
export async function getEthereumAddress(publicKey: Buffer): Promise<string> {
  const publicKeyWithoutPrefix = publicKey.slice(1, publicKey.length);

  const address = ethers.utils.keccak256(publicKeyWithoutPrefix);
  const ethereumAddress = `0x${address.slice(-40)}`;
  return Promise.resolve(ethereumAddress);
}
