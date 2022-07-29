import {TokenCredential, AccessToken} from '@azure/identity';

/**
 * class implementing StaticTokenCredential for AccessToken compatibility
 */
export class StaticTokenCredential implements TokenCredential {
  /**
   * @param {AccessToken} accessToken
   */
  constructor(private accessToken: AccessToken) {}

  /**
   * override getToken function from Token Credentials
   * to get the access token object
   */
  async getToken(): Promise<AccessToken> {
    return this.accessToken;
  }
}
