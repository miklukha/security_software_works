const express = require('express');
const bodyParser = require('body-parser');
const cipher = require('./nodejs/cipher');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

app.post('/cipher/:action', (req, res) => {
  const { text, key, algorithm } = req.body;
  const action = req.params.action;

  if (!text) {
    return res
      .status(400)
      .json({ error: "Некоректні дані. Текст обов'язковий." });
  }

  if (
    !key ||
    (algorithm === 'des' && key.length !== 8) ||
    (algorithm === '3des' && key.length !== 16 && key.length !== 24)
  ) {
    return res.status(400).json({
      error:
        'Ключ має бути відповідної довжини (8 символів для DES, 16 або 24 символи для 3DES).',
    });
  }

  try {
    let result;
    if (action === 'encrypt') {
      result = { output: cipher.encrypt(text, key, algorithm) };
    } else if (action === 'decrypt') {
      result = { output: cipher.decrypt(text, key, algorithm) };
    } else {
      return res.status(400).json({ error: 'Некоректна дія' });
    }

    res.json(result);
  } catch (error) {
    console.error('Error during processing:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Сервер запущено на http://localhost:${PORT}`);
});
