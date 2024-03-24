/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

/**
 * Returns a persistent hash for the provided `timestamp` rounded by
 * the provided `timestep` value (in ms).
 */
export function getHashtime(
  timestamp: number,
  timestep: number,
): string {
  return Math.floor(timestamp / timestep).toString(32);
}

/**
 * Returns a timestamp (number) fetched from the provided `hashtime`
 * value.
 */
export function parseHashtime(
  hashtime: string,
  timestep: number,
): number {
  return parseInt(hashtime, 32) * timestep;
}
