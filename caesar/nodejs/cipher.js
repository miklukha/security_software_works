const alphabets = {
  en: 'abcdefghijklmnopqrstuvwxyz',
  uk: 'абвгґдеєжзиіїйклмнопрстуфхцчшщьюя',
};

function caesarCipher(text, shift, language, action) {
  const alphabet = alphabets[language];
  if (!alphabet) throw new Error('Unsupported language');

  const n = alphabet.length; // Потужність алфавіту

  const processChar = (char, shiftAmount) => {
    const isUpper = char === char.toUpperCase();
    const charLower = char.toLowerCase();
    const idx = alphabet.indexOf(charLower);

    if (idx === -1) return char; // Символ не в алфавіті

    const newIdx =
      action === 'encrypt'
        ? (idx + shiftAmount) % n
        : (idx + n - (shiftAmount % n)) % n;

    const newChar = alphabet[newIdx];
    return isUpper ? newChar.toUpperCase() : newChar;
  };

  return text
    .split('')
    .map(char => processChar(char, shift))
    .join('');
}

function encrypt(text, shift, language) {
  return caesarCipher(text, shift, language, 'encrypt');
}

function decrypt(text, shift, language) {
  return caesarCipher(text, shift, language, 'decrypt');
}

module.exports = { encrypt, decrypt };
