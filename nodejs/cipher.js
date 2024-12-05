const alphabets = {
  en: 'abcdefghijklmnopqrstuvwxyz',
  uk: 'абвгґдеєжзиіїйклмнопрстуфхцчшщьюя',
};

function caesarCipher(text, shift, language) {
  const alphabet = alphabets[language];
  if (!alphabet) throw new Error('Unsupported language');

  const shiftChar = (char, shiftAmount) => {
    const isUpper = char === char.toUpperCase();
    const charLower = char.toLowerCase();
    const idx = alphabet.indexOf(charLower);

    if (idx === -1) return char;

    const shiftedIdx = (idx + shiftAmount + alphabet.length) % alphabet.length;
    const shiftedChar = alphabet[shiftedIdx];
    return isUpper ? shiftedChar.toUpperCase() : shiftedChar;
  };

  return text
    .split('')
    .map(char => shiftChar(char, shift))
    .join('');
}

function encrypt(text, shift, language) {
  return caesarCipher(text, shift, language);
}

function decrypt(text, shift, language) {
  return caesarCipher(text, -shift, language);
}

module.exports = { encrypt, decrypt };
