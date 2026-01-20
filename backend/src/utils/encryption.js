import CryptoJS from 'crypto-js';
import dotenv from 'dotenv';

dotenv.config();

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;

if (!ENCRYPTION_KEY || ENCRYPTION_KEY.length < 32) {
    throw new Error('ENCRYPTION_KEY must be at least 32 characters long');
}

/**
 * Encrypt sensitive data (like OAuth tokens)
 * @param {string} text - Plain text to encrypt
 * @returns {string} - Encrypted text
 */
export const encrypt = (text) => {
    if (!text) return null;
    const encrypted = CryptoJS.AES.encrypt(text, ENCRYPTION_KEY).toString();
    console.log('[ENCRYPT] Input length:', text.length, 'Output length:', encrypted.length);
    return encrypted;
};

/**
 * Decrypt sensitive data
 * @param {string} encryptedText - Encrypted text
 * @returns {string} - Decrypted plain text
 */
export const decrypt = (encryptedText) => {
    if (!encryptedText) return null;
    const bytes = CryptoJS.AES.decrypt(encryptedText, ENCRYPTION_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    console.log('[DECRYPT] Input length:', encryptedText.length, 'Output length:', decrypted.length);
    return decrypted;
};

/**
 * Hash password using SHA256 (for additional security layer)
 * Note: bcrypt is used for password hashing in auth, this is for additional use cases
 * @param {string} text - Text to hash
 * @returns {string} - Hashed text
 */
export const hash = (text) => {
    return CryptoJS.SHA256(text).toString();
};
