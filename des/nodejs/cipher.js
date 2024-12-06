const crypto = require('crypto');

function adjustKeyLength(key, algorithm) {
  const targetLength =
    algorithm === 'des' ? 8 : algorithm === '3des' ? 24 : null;

  if (!targetLength) {
    throw new Error('Unsupported algorithm');
  }

  const bufferKey = Buffer.from(key, 'utf-8');

  if (bufferKey.length < targetLength) {
    return Buffer.concat(
      [bufferKey, Buffer.alloc(targetLength - bufferKey.length)],
      targetLength,
    );
  } else if (bufferKey.length > targetLength) {
    return bufferKey.slice(0, targetLength);
  }

  return bufferKey;
}
function desEncryptDecrypt(text, key, isEncrypt = true, algorithm = 'des') {
  const iv = Buffer.alloc(8, 0); // 8 байтів ініціалізації
  const cipherKey = adjustKeyLength(key, algorithm); // Нормалізуємо довжину ключа

  try {
    const cipher = isEncrypt
      ? crypto.createCipheriv(
          algorithm === 'des' ? 'des-cbc' : 'des-ede3-cbc',
          cipherKey,
          iv,
        )
      : crypto.createDecipheriv(
          algorithm === 'des' ? 'des-cbc' : 'des-ede3-cbc',
          cipherKey,
          iv,
        );

    let result = cipher.update(
      text,
      isEncrypt ? 'utf8' : 'base64',
      isEncrypt ? 'base64' : 'utf8',
    );
    result += cipher.final(isEncrypt ? 'base64' : 'utf8');
    return result;
  } catch (err) {
    console.error('Error in desEncryptDecrypt:', err);
    throw err;
  }
}

function encrypt(text, key, algorithm) {
  return desEncryptDecrypt(text, key, true, algorithm);
}

function decrypt(text, key, algorithm) {
  return desEncryptDecrypt(text, key, false, algorithm);
}

module.exports = { encrypt, decrypt };
