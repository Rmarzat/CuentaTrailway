import express from 'express';
import { db } from '../db.js';

const router = express.Router();

router.get('/', (req, res) => {
  db.all('SELECT * FROM Enterprises', (err, enterprises) => {
    if (err) {
      return res.status(500).json({ error: 'Error en la base de datos' });
    }
    res.json(enterprises);
  });
});

router.post('/', (req, res) => {
  const { name, rut, logo } = req.body;
  const id = crypto.randomUUID();

  db.run(
    'INSERT INTO Enterprises (id, name, rut, logo) VALUES (?, ?, ?, ?)',
    [id, name, rut, logo],
    (err) => {
      if (err) {
        if (err.message.includes('UNIQUE constraint failed')) {
          return res.status(400).json({ error: 'El RUT ya existe' });
        }
        return res.status(500).json({ error: 'Error en la base de datos' });
      }
      res.json({ id, name, rut, logo });
    }
  );
});

export default router;