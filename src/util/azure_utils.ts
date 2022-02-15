import {ethers} from 'ethers';
import {KeyClient, CryptographyClient, SignResult} from '@azure/keyvault-keys';
import {ClientSecretCredential} from '@azure/identity';
import BN from 'bn.js';
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

/**
 *
 * @param {Buffer} digest
 * @param {AzureKeyVaultCredentials} keyVaultCredentials
 * @return {SignResult}
 */
export async function sign(digest: Buffer,
    keyVaultCredentials: AzureKeyVaultCredentials): Promise<SignResult> {
  const credentials = new ClientSecretCredential(
      keyVaultCredentials.tenantId, keyVaultCredentials.clientId,
      keyVaultCredentials.clientSecret);

  const keyVaultUrl = `https://${keyVaultCredentials.vaultName}.vault.azure.net`;
  const client = new KeyClient(keyVaultUrl, credentials);
  const keyObject = await client.getKey(keyVaultCredentials.keyName);
  const cryptographyClient = new CryptographyClient(keyObject, credentials);

  const signedDigest = await cryptographyClient.sign('ES256K', digest);
  return signedDigest;
}

/**
 *
 * @param {Buffer} msg
 * @param {BN} r
 * @param {BN} s
 * @param {number} v
 * @return {any}
 */
function recoverPubKeyFromSig(msg: Buffer, r: BN, s: BN, v: number) {
  return ethers.utils.recoverAddress(`0x${msg.toString('hex')}`, {
    r: `0x${r.toString('hex')}`,
    s: `0x${s.toString('hex')}`,
    v,
  });
}

/**
 *
 * @param {Buffer} msg
 * @param {BN} r
 * @param {BN} s
 * @param {string} expectedEthAddr
 * @return {any}
 */
export function determineCorrectV(
    msg: Buffer, r: BN, s: BN, expectedEthAddr: string) {
  // This is the wrapper function to find the right v value
  // There are two matching signatues on the elliptic curve
  // we need to find the one that matches to our public key
  // it can be v = 27 or v = 28
  let v = 27;
  let pubKey = recoverPubKeyFromSig(msg, r, s, v);
  if (pubKey.toLowerCase() !== expectedEthAddr.toLowerCase()) {
    // if the pub key for v = 27 does not match
    // it has to be v = 28
    v = 28;
    pubKey = recoverPubKeyFromSig(msg, r, s, v);
  }
  return {pubKey, v};
}
