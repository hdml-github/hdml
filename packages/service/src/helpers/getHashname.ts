/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import * as crypto from "crypto";

/**
 * Returns a persistent hash for the provided string.
 */
export function getHashname(content: string): string {
  const charset = "abcdefghijklmnopqrstuvwxyz0123456789";
  const buffer = crypto
    .createHash("md5")
    .update(JSON.stringify(content))
    .digest();
  let hashname = "";
  let residue = 0;
  let counter = 0;
  for (let i = 0; i < 5; i++) {
    const byte = buffer.readUInt8(i);
    counter += 8;
    residue = (byte << (counter - 8)) | residue;
    while (residue >> 5) {
      hashname += charset.charAt(residue % 32);
      counter -= 5;
      residue = residue >> 5;
    }
  }
  hashname += charset.charAt(residue % 32);
  return hashname;
}
