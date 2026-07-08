const express = require('express');
const pool = require('../db');
const { verifierToken } = require('../middleware/auth');
const router = express.Router();

router.use(verifierToken);

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM clubs WHERE actif = true ORDER BY nom');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ erreur: 'Erreur serveur' });
  }
});

router.get('/mon-club', async (req, res) => {
  try {
    const { club_id } = req.utilisateur;
    const result = await pool.query('SELECT id, nom, ville, adresse, code_postal, telephone, email_contact FROM clubs WHERE id = $1', [club_id]);
    if (result.rows.length === 0) return res.status(404).json({ erreur: 'Club non trouvé' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ erreur: 'Erreur serveur' });
  }
});

module.exports = router;
