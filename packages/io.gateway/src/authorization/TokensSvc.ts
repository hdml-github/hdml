import {
  importSPKI,
  importPKCS8,
  KeyLike,
  CompactEncrypt,
  jwtDecrypt,
} from "jose";
import { Injectable, Logger } from "@nestjs/common";
import { OptionsSvc } from "../options/OptionsSvc";

export { KeyLike };

/**
 * JWE tokens service.
 */
@Injectable()
export class TokensSvc {
  /**
   * Service logger.
   */
  private readonly _logger = new Logger(TokensSvc.name, {
    timestamp: true,
  });

  /**
   * Class constructor.
   */
  constructor(private readonly _options: OptionsSvc) {}

  /**
   * Returns `KeyLike` object for the private key `content`.
   */
  public async getPrivateKey(content: string): Promise<KeyLike> {
    return await importPKCS8(
      content,
      this._options.getKeysImportAlg(),
    );
  }

  /**
   * Returns `KeyLike` object for the public key `content`.
   */
  public async getPublicKey(content: string): Promise<KeyLike> {
    return await importSPKI(
      content,
      this._options.getKeysImportAlg(),
    );
  }

  /**
   * Returns token string.
   */
  public async getToken(pub: KeyLike, data: object): Promise<string> {
    const payload = Buffer.from(
      JSON.stringify({
        // with the following scope
        ...data,
        // current service produced token
        iss: "Token service",
        // for session initialization
        sub: "HDMLDocument session",
        // at
        iat: Date.now() / 1000,
        // which can be used from
        nbf: Date.now() / 1000 - 1,
        // up to
        exp: Date.now() / 1000 + 60,
      }),
      "utf8",
    );
    const ce = new CompactEncrypt(payload).setProtectedHeader({
      alg: "RSA-OAEP-256",
      enc: "A256GCM",
    });
    return await ce.encrypt(pub);
  }

  /**
   * Decrypt token and returns decripted payload.
   */
  public async decryptToken(
    key: KeyLike,
    token: string,
  ): Promise<object> {
    const jwt = await jwtDecrypt(decodeURIComponent(token), key);
    return jwt.payload;
  }
}
