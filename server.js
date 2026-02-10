const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());  // JSON Body parser
app.use(express.static(path.join(__dirname, 'public')));  // Statische Dateien

// Daten aus daten.json auslesen
app.get('/api/daten', (req, res) => {
  const data = JSON.parse(fs.readFileSync('daten.json', 'utf-8'));
  res.json(data);
});

// Daten in daten.json speichern
app.post('/api/daten', (req, res) => {
  fs.writeFileSync('daten.json', JSON.stringify(req.body, null, 2));
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
});
