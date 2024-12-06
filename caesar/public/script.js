document
  .getElementById('encryptButton')
  .addEventListener('click', () => processRequest('encrypt'));
document
  .getElementById('decryptButton')
  .addEventListener('click', () => processRequest('decrypt'));

document.getElementById('saveEncrypt').addEventListener('click', () => {
  const content = document.getElementById('encryptOutput').textContent;
  if (!content) {
    alert('Немає результату для збереження');
    return;
  }
  saveFile(content, 'encrypted.txt');
});

document.getElementById('saveDecrypt').addEventListener('click', () => {
  const content = document.getElementById('decryptOutput').textContent;
  if (!content) {
    alert('Немає результату для збереження');
    return;
  }
  saveFile(content, 'decrypted.txt');
});

document
  .getElementById('encryptFile')
  .addEventListener('change', () => handleFileSelection('encrypt'));
document
  .getElementById('decryptFile')
  .addEventListener('change', () => handleFileSelection('decrypt'));

document
  .getElementById('clearEncrypt')
  .addEventListener('click', () => clearInputs('encrypt'));
document
  .getElementById('clearDecrypt')
  .addEventListener('click', () => clearInputs('decrypt'));

document
  .getElementById('encryptLanguage')
  .addEventListener('change', () => updateShiftMax('encrypt'));
document
  .getElementById('decryptLanguage')
  .addEventListener('change', () => updateShiftMax('decrypt'));

updateShiftMax('encrypt');
updateShiftMax('decrypt');

function validateFile(action) {
  const fileInput = document.getElementById(`${action}File`);
  const file = fileInput.files[0];

  if (file && !file.name.endsWith('.txt')) {
    alert('Будь ласка, завантажте файл у форматі .txt');
    fileInput.value = '';
  }

  return true;
}

function updateShiftMax(action) {
  const language = document.getElementById(`${action}Language`).value;
  const shiftInput = document.getElementById(`${action}Shift`);
  const maxShift = language === 'en' ? '25' : '32';
  shiftInput.max = maxShift;
  shiftInput.placeholder = `Введіть зсув (0-${maxShift})`;
}

function validateInputs(action) {
  const textInput = document.getElementById(`${action}Text`);
  const fileInput = document.getElementById(`${action}File`);
  const shiftInput = document.getElementById(`${action}Shift`);
  const maxShift = parseInt(shiftInput.max, 10);
  if (!textInput.value && fileInput.files.length === 0) {
    alert('Будь ласка, введіть текст або завантажте файл.');
    return false;
  }

  if (!validateFile(action)) return false;

  const shift = parseInt(shiftInput.value, 10);
  if (isNaN(shift) || shift < 0 || shift > maxShift) {
    alert(`Будь ласка, введіть коректний зсув (від 0 до ${maxShift}).`);
    return false;
  }

  return true;
}

function handleFileSelection(action) {
  const fileInput = document.getElementById(`${action}File`);
  const textInput = document.getElementById(`${action}Text`);

  if (fileInput.files.length > 0) {
    textInput.disabled = true;
  } else {
    textInput.disabled = false;
  }
}

function clearInputs(action) {
  document.getElementById(`${action}Text`).value = '';
  document.getElementById(`${action}File`).value = '';
  document.getElementById(`${action}Shift`).value = '';
  document.getElementById(`${action}Output`).textContent = '';
  document.getElementById(`${action}Text`).disabled = false;
}

async function processRequest(action) {
  if (!validateInputs(action)) return;

  const textInput = document.getElementById(`${action}Text`);
  const fileInput = document.getElementById(`${action}File`);
  const shift = parseInt(document.getElementById(`${action}Shift`).value, 10);
  const language = document.getElementById(`${action}Language`).value;

  if (isNaN(shift)) {
    alert('Будь ласка, введіть коректний зсув');
    return;
  }

  let text = '';

  if (fileInput.files.length > 0) {
    const file = fileInput.files[0];
    text = await file.text();
  } else {
    text = textInput.value;
  }

  const response = await fetch(`/cipher/${action}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, shift, language }),
  });

  const result = await response.json();
  document.getElementById(`${action}Output`).textContent = result.output;
}

function saveFile(content, fileName) {
  const blob = new Blob([content], { type: 'text/plain' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  link.click();
}
