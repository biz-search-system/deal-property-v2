import { customAlphabet } from "nanoid";

/**
 * Generate a random string of a given length
 * @param chars - The length of the random string
 * @returns The random string
 * @example
 * generateId(10); // "a1b2c3d4e5"
 */
export const customNanoid = (chars?: number) => {
  return customAlphabet(
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
    chars || 7, // 7-character random string by default
  )();
};
