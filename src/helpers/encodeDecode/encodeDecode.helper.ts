import { Config, ConfigKey } from "../../config";
import * as crypto from "crypto";

const algorithm = "aes-256-cbc";
const secretKey = Config.getConfig<string>(ConfigKey.CLIENT_SECRET) || "default-secret-key";

if (!secretKey) {
  throw new Error("CLIENT_SECRET is not defined in the configuration.");
}

const key = crypto.createHash("sha256").update(secretKey).digest();
const ivLength = 16; // For AES, this is always 16

export function encrypt(text: string): string {
  const iv = crypto.randomBytes(ivLength);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return `${iv.toString("hex")}:${encrypted}`;
}

export function decrypt(text: string): string {
  const [ivHex, encryptedText] = text.split(":");
  if (!ivHex || !encryptedText) {
    throw new Error("Invalid encrypted text format.");
  }

  const iv = Buffer.from(ivHex, "hex");
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encryptedText, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}
