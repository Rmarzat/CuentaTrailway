import express from 'express';
import { db } from '../db';
import { randomUUID } from 'crypto';

const router = express.Router();

router.get('/', (req, res) => {
  try {
    const enterprises = db.prepare('SELECT * FROM Enterprises').all();
    res.json(enterprises);
  } catch (error) {
    console.error('Error fetching enterprises:', error);
    res.status(500).json({ error: 'Error en la base de datos' });
  }
});

router.post('/', (req, res) => {
  const { name, rut, logo } = req.body;
  const id = randomUUID();

  try {
    const stmt = db.prepare(
      'INSERT INTO Enterprises (id, name, rut, logo) VALUES (?, ?, ?, ?)'
    );

    try {
      stmt.run(id, name, rut, logo);
      res.json({ id, name, rut, logo });
    } catch (err: any) {
      if (err.message.includes('UNIQUE constraint failed')) {
        return res.status(400).json({ error: 'El RUT ya existe' });
      }
      throw err;
    }
  } catch (error) {
    console.error('Error creating enterprise:', error);
    res.status(500).json({ error: 'Error en la base de datos' });
  }
});

export default router;