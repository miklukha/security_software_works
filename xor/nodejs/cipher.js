function xorEncryptDecrypt(text, key) {
  if (!text || !key) {
    throw new Error('Текст і ключ не можуть бути порожніми.');
  }

  const textBuffer = Buffer.from(text, 'utf-8');
  const keyBuffer = Buffer.from(key, 'utf-8');
  const result = Buffer.alloc(textBuffer.length);

  for (let i = 0; i < textBuffer.length; i++) {
    result[i] = textBuffer[i] ^ keyBuffer[i % keyBuffer.length];
  }

  return result;
}

function generateGamma(length) {
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charsLength = chars.length;
  let gamma = '';

  for (let i = 0; i < length; i += 1) {
    const randomIndex = Math.floor(Math.random() * charsLength);
    gamma += chars[randomIndex];
  }

  return gamma;
}

function encrypt(text, key = null) {
  const textBuffer = Buffer.from(text, 'utf-8');
  const encryptedBuffer = xorEncryptDecrypt(textBuffer, key);
  return encryptedBuffer.toString('base64');
}

function decrypt(text, key) {
  const encryptedBuffer = Buffer.from(text, 'base64');
  const decryptedBuffer = xorEncryptDecrypt(encryptedBuffer, key);
  return decryptedBuffer.toString('utf-8');
}

module.exports = { encrypt, decrypt, generateGamma };
