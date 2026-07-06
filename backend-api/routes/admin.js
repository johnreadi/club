const express = require('express');
const pool = require('../db');
const { verifierToken, estAdminPlateforme } = require('../middleware/auth');
const router = express.Router();

router.use(verifierToken, estAdminPlateforme);

router.get('/clubs', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM clubs ORDER BY nom');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ erreur: 'Erreur serveur' });
  }
});

router.post('/clubs', async (req, res) => {
  try {
    const { nom, adresse, code_postal, ville, telephone, email_contact, niveau_abonnement } = req.body;
    const result = await pool.query(
      `INSERT INTO clubs (nom, adresse, code_postal, ville, telephone, email_contact, niveau_abonnement)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [nom, adresse, code_postal, ville, telephone, email_contact, niveau_abonnement]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ erreur: 'Erreur serveur' });
  }
});

module.exports = router;
