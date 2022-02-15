import {ethers} from 'ethers';

export interface AzureKeyVaultKey {
    id: string;
    key?: object;
    keyType?: string
    name: string;
}

/**
 *
 */
export class AzureKeyVaultSigner extends ethers.Signer {
  azureKeyVaultKey: AzureKeyVaultKey;
  ethereumAddress: string;

  /**
   *
   * @param {AzureKeyVaultKey} azureKeyVaultKey
   * @param {ethers.providers.Provider} provider
   */
  constructor(azureKeyVaultKey: AzureKeyVaultKey,
      provider?: ethers.providers.Provider) {
    super();
    ethers.utils.defineReadOnly(this, 'provider', provider);
    ethers.utils.defineReadOnly(this, 'azureKeyVaultKey', azureKeyVaultKey);
  }

  /**
   *
   * @return {string}
   */
  async getAddress(): Promise<string> {
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
    return new AzureKeyVaultSigner(this.azureKeyVaultKey, provider);
  }
}
