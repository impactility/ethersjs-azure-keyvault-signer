import {ethers, UnsignedTransaction} from 'ethers';
import {getEthereumAddress,
  getPublicKey,
  requestAKVSignature,
  determineCorrectV,
} from './util/azure_utils';

export interface AzureKeyVaultCredentials {
  keyName: string;
  vaultName: string;
  clientId: string;
  clientSecret: string;
  tenantId: string;
  keyVersion?: string
}

/**
 *
 */
export class AzureKeyVaultSigner extends ethers.Signer {
  keyVaultCredentials: AzureKeyVaultCredentials;
  ethereumAddress: string;

  /**
   *
   * @param {AzureKeyVaultCredentials} keyVaultCredentials
   * @param {ethers.providers.Provider} provider
   */
  constructor(keyVaultCredentials: AzureKeyVaultCredentials,
      provider?: ethers.providers.Provider) {
    super();
    ethers.utils.defineReadOnly(this, 'provider', provider);
    ethers.utils.defineReadOnly(this, 'keyVaultCredentials',
        keyVaultCredentials);
  }

  /**
   * Returns Ethereum address for an azure key-vault SECP256-K1 key
   * @return {string}
   */
  async getAddress(): Promise<string> {
    if (!this.ethereumAddress) {
      const key = await getPublicKey(this.keyVaultCredentials);
      this.ethereumAddress = await getEthereumAddress(key);
    }
    return Promise.resolve(this.ethereumAddress);
  }

  /**
   * Sings the digest buffer with an azure key-vault SECP-256K1 key
   * and returns signature
   * @param {string} digestString
   * @return {any}
   */
  async _signDigest(digestString: string): Promise<string> {
    const digestBuffer = Buffer.from(ethers.utils.arrayify(digestString));
    const sig = await requestAKVSignature(
        digestBuffer, this.keyVaultCredentials);
    const ethAddr = await this.getAddress();
    const {v} = determineCorrectV(digestBuffer, sig.r, sig.s, ethAddr);
    return ethers.utils.joinSignature({
      v,
      r: `0x${sig.r.toString('hex')}`,
      s: `0x${sig.s.toString('hex')}`,
    });
  }

  /**
   * Signs a string or byte array with an azure keyvault SECP-256K1 key
   * @param {string | ethers.utils.Bytes} message
   * @return {string}
   */
  async signMessage(message: string | ethers.utils.Bytes): Promise<string> {
    return this._signDigest(ethers.utils.hashMessage(message));
  }

  /**
   * Signs and serializes a transaction with an azure keyvault SECP-256K1 key
   * @param {ethers.utils.Deferrable<ethers.providers.
   * TransactionRequest>} transaction
   * @return {string}
   */
  async signTransaction(transaction:
  ethers.utils.Deferrable<ethers.providers.TransactionRequest>):
  Promise<string> {
    const unsignedTx = await ethers.utils.resolveProperties(transaction);
    const serializedTx = ethers.utils.serializeTransaction(
        <UnsignedTransaction>unsignedTx);
    const transactionSignature = await this._signDigest(
        ethers.utils.keccak256(serializedTx));
    return ethers.utils.serializeTransaction(
        <UnsignedTransaction>unsignedTx, transactionSignature);
  }

  /**
   * Connects to a ethers provider
   * @param {ethers.providers.Provider} provider
   * @return {AzureKeyVaultSigner}
   */
  connect(provider: ethers.providers.Provider): AzureKeyVaultSigner {
    return new AzureKeyVaultSigner(this.keyVaultCredentials, provider);
  }
}
