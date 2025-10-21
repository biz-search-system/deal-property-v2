import { customAlphabet, nanoid } from "nanoid";

export const generateId = (chars?: number) => {
  return customAlphabet(
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
    chars || 10 // 10-character random string by default
  )();
};

export function generateNanoid() {
  return nanoid(10);
}
