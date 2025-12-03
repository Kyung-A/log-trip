import * as Crypto from "expo-crypto";

export function generateRawNonce(len = 32) {
  const bytes = Crypto.getRandomBytes(len / 2);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function sha256Hex(str: string) {
  return Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, str, {
    encoding: Crypto.CryptoEncoding.HEX,
  });
}
