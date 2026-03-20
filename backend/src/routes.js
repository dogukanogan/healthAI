const express = require('express');
const router = express.Router();
const db = require('./db');

// E-posta dogrulamasi icin temel regex
const valEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
};

// Tum kisileri getir (GET)
router.get('/people', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM people ORDER BY id ASC');
    res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'INTERNAL_SERVER_ERROR' });
  }
});

// Tek bir kisiyi getir (GET)
router.get('/people/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await db.query('SELECT * FROM people WHERE id = $1', [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'NOT_FOUND' });
    }
    
    res.status(200).json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'INTERNAL_SERVER_ERROR' });
  }
});

// Yeni kisi olustur (POST)
router.post('/people', async (req, res) => {
  try {
    const { full_name, email } = req.body;
    
    if (!full_name || full_name.trim() === '') {
      return res.status(400).json({ error: 'INVALID_NAME' });
    }
    
    if (!email || !valEmail(email)) {
      return res.status(400).json({ error: 'INVALID_EMAIL' });
    }
    
    const { rows } = await db.query(
      'INSERT INTO people (full_name, email) VALUES ($1, $2) RETURNING *',
      [full_name, email]
    );
    
    res.status(201).json(rows[0]);
  } catch (error) {
    if (error.code === '23505') { // PostgreSQL unique kisitlama hatasi
      return res.status(409).json({ error: 'EMAIL_ALREADY_EXISTS' });
    }
    console.error(error);
    res.status(500).json({ error: 'INTERNAL_SERVER_ERROR' });
  }
});

// Mevcut kisiyi guncelle (PUT)
router.put('/people/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { full_name, email } = req.body;
    
    if (!full_name || full_name.trim() === '') {
      return res.status(400).json({ error: 'INVALID_NAME' });
    }
    
    if (!email || !valEmail(email)) {
      return res.status(400).json({ error: 'INVALID_EMAIL' });
    }
    
    const { rows } = await db.query(
      'UPDATE people SET full_name = $1, email = $2 WHERE id = $3 RETURNING *',
      [full_name, email, id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'NOT_FOUND' });
    }
    
    res.status(200).json(rows[0]);
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ error: 'EMAIL_ALREADY_EXISTS' });
    }
    console.error(error);
    res.status(500).json({ error: 'INTERNAL_SERVER_ERROR' });
  }
});

// Kisiyi sil (DELETE)
router.delete('/people/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { rowCount } = await db.query('DELETE FROM people WHERE id = $1', [id]);
    
    if (rowCount === 0) {
      return res.status(404).json({ error: 'NOT_FOUND' });
    }
    
    res.status(200).json({ message: 'DELETED' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'INTERNAL_SERVER_ERROR' });
  }
});

module.exports = router;
