import CryptoJS from 'crypto-js';

const secretKey = process.env.NEXT_PUBLIC_SECRET_WEBSITE!;

interface EncryptedKeyParams {
  userId: number;
  expirationTime: number;
}

export function generateEncryptedKey({
  userId,
  expirationTime,
}: EncryptedKeyParams): string {
  const expirationDate = Date.now() + expirationTime;
  const data = { userId, expirationDate };

  const encryptedJson = CryptoJS.AES.encrypt(
    JSON.stringify(data),
    secretKey,
  ).toString();
  const encryptedData = CryptoJS.enc.Base64.stringify(
    CryptoJS.enc.Utf8.parse(encryptedJson),
  );
  return encryptedData;
}

export function decryptKey(
  encryptedKey: string,
): { userId: number; expirationDate: number } | null {
  try {
    const decryptedData = CryptoJS.enc.Base64.parse(encryptedKey).toString(
      CryptoJS.enc.Utf8,
    );

    const bytes = CryptoJS.AES.decrypt(decryptedData, secretKey).toString(
      CryptoJS.enc.Utf8,
    );

    return JSON.parse(bytes);
  } catch (error) {
    return null;
  }
}
