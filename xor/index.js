const express = require('express');
const bodyParser = require('body-parser');
const cipher = require('./nodejs/cipher');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

app.post('/cipher/:action', (req, res) => {
  const { text, key } = req.body;
  const action = req.params.action;

  if (!text) {
    return res
      .status(400)
      .json({ error: "Некоректні дані. Текст обов'язковий." });
  }

  let result;
  try {
    if (action === 'encrypt') {
      const gamma = key || cipher.generateGamma(text.length);
      result = {
        output: cipher.encrypt(text, gamma),
        gamma,
      };
    } else if (action === 'decrypt') {
      if (!key) {
        return res
          .status(400)
          .json({ error: 'Для розшифрування потрібен ключ (гамма).' });
      }
      result = { output: cipher.decrypt(text, key) };
    } else {
      return res.status(400).json({ error: 'Некоректна дія' });
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Сервер запущено на http://localhost:${PORT}`);
});
