import Cryptr from "cryptr";

const cryptr = new Cryptr("myTotalySecretKey");

export function encryptIt(password: string): string {
  const encryptedString = cryptr.encrypt(password);

  return encryptedString;
}

export function decryptIt(encryptedString: string): string {
  const decryptedString = cryptr.decrypt(encryptedString);

  return decryptedString;
}
