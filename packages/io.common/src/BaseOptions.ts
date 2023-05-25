/**
 * Options service.
 */
export class BaseOptions {
  /**
   * Returns the Gateway port.
   */
  public getGatewayPort(): number {
    return 8888;
  }

  /**
   * Returns the Hideway port.
   */
  public getHidewayPort(): number {
    return 8887;
  }

  /**
   * Returns tenant's environment file name.
   */
  public getTenantEnvName(): string {
    return ".env";
  }

  /**
   * Returns tenant's keys directory path.
   */
  public getTenantKeysPath(): string {
    return "keys";
  }

  /**
   * Returns tenant's private key name.
   */
  public getTenantPrivateKeyName(): string {
    return "key";
  }

  /**
   * Returns tenant's public key name.
   */
  public getTenantPublicKeyName(): string {
    return "key.pub";
  }

  /**
   * Returns tenant's middlewares directory path.
   */
  public getTenantMiddlewaresPath(): string {
    return "middlewares";
  }

  /**
   * Returns tenant's `hdml` documents root directory path.
   */
  public getTenantDocumentsPath(): string {
    return "hdml";
  }

  /**
   * Returns tenant's `hdml` documents files extension.
   */
  public getTenantDocumentsExt(): string {
    return "html";
  }

  /**
   * Returns keys import algorythm.
   */
  public getKeysImportAlg(): string {
    return "ES256";
  }

  /**
   * Returns tokens algorythm.
   */
  public getTokensAlg(): string {
    return "RSA-OAEP-256";
  }

  /**
   * Returns token encryption.
   */
  public getTokensEnc(): string {
    return "A256GCM";
  }

  /**
   * Returns token issuer.
   */
  public getTokensIss(): string {
    return "TokensSvc";
  }

  /**
   * Returns access token subject.
   */
  public getTokenAccessSub(): string {
    return "Access Token";
  }

  /**
   * Returns session token subject.
   */
  public getTokenSessionSub(): string {
    return "Session Token";
  }

  /**
   * Returns session length in seconds.
   */
  public getSessionLength(): number {
    return 24 * 60;
  }

  /**
   * Returns compiler min pages pool size.
   */
  public getCompilerPoolMin(): number {
    return 2;
  }

  /**
   * Returns compiler max pages pool size.
   */
  public getCompilerPoolMax(): number {
    return 10;
  }

  /**
   * Returns compiler pool max waiting clients number.
   */
  public getCompilerPoolQueueSize(): number {
    return 50;
  }

  /**
   * Returns max frame depth to break compiler loop.
   */
  public getCompilerFramesDepth(): number {
    return 50;
  }

  /**
   * Returns queue host.
   */
  public getQueueHost(): string {
    return "localhost";
  }

  /**
   * Returns queue port.
   */
  public getQueuePort(): number {
    return 6650;
  }

  /**
   * Returns queue REST API port.
   */
  public getQueueRestPort(): number {
    return 9090;
  }

  /**
   * Returns queue tenant name.
   */
  public getQueueTenant(): string {
    return "public";
  }

  /**
   * Returns queue namespace.
   */
  public getQueueNamespace(): string {
    return "default";
  }

  /**
   * Returns queue cache timeout in ms.
   */
  public getQueueCacheTimeout(): number {
    return 10000;
  }
}
