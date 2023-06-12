/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

/**
 * `BaseOptions` class. Provides access to basic configuration
 * options.
 */
export class BaseOptions {
  /**
   * Returns the `Gateway` port.
   */
  public getGatewayPort(): number {
    return 8888;
  }

  /**
   * Returns the `Hideway` port.
   */
  public getHidewayPort(): number {
    return 8887;
  }

  /**
   * Returns the `Querier` port.
   */
  public getQuerierPort(): number {
    return 8886;
  }

  /**
   * Returns the name of the tenant environment file.
   */
  public getTenantEnvName(): string {
    return ".env";
  }

  /**
   * Returns the pathname of the tenant keys.
   */
  public getTenantKeysPath(): string {
    return "keys";
  }

  /**
   * Returns the name of the tenant private key file.
   */
  public getTenantPrivateKeyName(): string {
    return "key";
  }

  /**
   * Returns the name of the tenant public key file.
   */
  public getTenantPublicKeyName(): string {
    return "key.pub";
  }

  /**
   * Returns the name of the tenant hook directory.
   */
  public getTenantHookPath(): string {
    return "hook";
  }

  /**
   * Returns the root directory name of the tenant's `hdml` documents.
   */
  public getTenantDocumentsPath(): string {
    return "hdml";
  }

  /**
   * Returns the tenant's `hdml` document file extension.
   */
  public getTenantDocumentsExt(): string {
    return "html";
  }

  /**
   * Returns the key import algorithm.
   */
  public getKeysImportAlg(): string {
    return "ES256";
  }

  /**
   * Returns the token encryption algorithm.
   */
  public getTokensAlg(): string {
    return "RSA-OAEP-256";
  }

  /**
   * Returns the encryption of the token.
   */
  public getTokensEnc(): string {
    return "A256GCM";
  }

  /**
   * Returns the issuer of the token.
   */
  public getTokensIss(): string {
    return "TokensSvc";
  }

  /**
   * Returns the subject of the access token.
   */
  public getTokenAccessSub(): string {
    return "Access Token";
  }

  /**
   * Returns the subject of the session token.
   */
  public getTokenSessionSub(): string {
    return "Session Token";
  }

  /**
   * Returns the duration of the session in seconds.
   */
  public getSessionLength(): number {
    return 24 * 60;
  }

  /**
   * Returns the queue host.
   */
  public getQueueHost(): string {
    return "localhost";
  }

  /**
   * Returns the queue port for the driver.
   */
  public getQueuePort(): number {
    return 6650;
  }

  /**
   * Returns the queue port for the REST API calls.
   */
  public getQueueRestPort(): number {
    return 9090;
  }

  /**
   * Returns the queue tenant name.
   */
  public getQueueTenant(): string {
    return "public";
  }

  /**
   * Returns the queue namespace.
   */
  public getQueueNamespace(): string {
    return "default";
  }

  /**
   * Returns the queue cache timeout in ms.
   */
  public getQueueCacheTimeout(): number {
    return 10000;
  }
}
