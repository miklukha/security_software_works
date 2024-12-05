const express = require('express');
const bodyParser = require('body-parser');
const cipher = require('./nodejs/cipher');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

app.post('/cipher/:action', (req, res) => {
  const { text, shift, language } = req.body;
  const action = req.params.action;

  if (!text || isNaN(shift) || !language) {
    return res.status(400).json({ error: 'Некоректні дані' });
  }

  let result;
  try {
    if (action === 'encrypt') {
      result = cipher.encrypt(text, shift, language);
    } else if (action === 'decrypt') {
      result = cipher.decrypt(text, shift, language);
    } else {
      return res.status(400).json({ error: 'Некоректна дія' });
    }

    res.json({ output: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Сервер запущено на http://localhost:${PORT}`);
});
