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

function validateFile(action) {
  const fileInput = document.getElementById(`${action}File`);
  const file = fileInput.files[0];

  if (file && !file.name.endsWith('.txt')) {
    alert('Будь ласка, завантажте файл у форматі .txt');
    fileInput.value = '';
  }

  return true;
}

function validateInputs(action) {
  const textInput = document.getElementById(`${action}Text`);
  const fileInput = document.getElementById(`${action}File`);
  const keyInput = document.getElementById(`${action}Key`);

  if (!textInput.value && fileInput.files.length === 0) {
    alert('Будь ласка, введіть текст або завантажте файл.');
    return false;
  }

  if (!validateFile(action)) return false;

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
  document.getElementById(`${action}Key`).value = '';
  document.getElementById(`${action}Output`).textContent = '';
  document.getElementById(`${action}Text`).disabled = false;
}

async function processRequest(action) {
  if (!validateInputs(action)) return;

  const textInput = document.getElementById(`${action}Text`);
  const fileInput = document.getElementById(`${action}File`);
  const keyInput = document.getElementById(`${action}Key`);

  let text = '';
  let key = keyInput.value.trim();

  if (fileInput.files.length > 0) {
    const file = fileInput.files[0];
    text = await file.text();
  } else {
    text = textInput.value;
  }

  const response = await fetch(`/cipher/${action}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, key: key || null }),
  });

  const result = await response.json();

  if (action === 'encrypt' && result.gamma) {
    document.getElementById(
      'gammaOutput',
    ).textContent = `Генерована гамма: ${result.gamma}`;
  }

  document.getElementById(`${action}Output`).textContent = result.output;
}

function saveFile(content, fileName) {
  const blob = new Blob([content], { type: 'text/plain' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  link.click();
}
