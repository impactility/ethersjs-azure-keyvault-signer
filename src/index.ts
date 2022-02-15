import {ethers} from 'ethers';
import {getEthereumAddress, getPublicKey} from './util/azure_utils';

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
   *
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
   *
   * @param {string | ethers.utils.Bytes} message
   * @return {string}
   */
  async signMessage(message: string | ethers.utils.Bytes): Promise<string> {
  }

  /**
   * @param {ethers.utils.Deferrable<ethers.providers.
   * TransactionRequest>} transaction
   * @return {string}
   */
  async signTransaction(transaction:
  ethers.utils.Deferrable<ethers.providers.TransactionRequest>):
  Promise<string> {
  }

  /**
   * @param {ethers.providers.Provider} provider
   * @return {AzureKeyVaultSigner}
   */
  connect(provider: ethers.providers.Provider): AzureKeyVaultSigner {
    return new AzureKeyVaultSigner(this.keyVaultCredentials, provider);
  }
}
