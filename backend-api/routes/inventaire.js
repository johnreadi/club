const express = require('express');
const pool = require('../db');
const { verifierToken } = require('../middleware/auth');
const router = express.Router();

router.use(verifierToken);

router.get('/', async (req, res) => {
  const { club_id } = req.utilisateur;
  const result = await pool.query(
    'SELECT * FROM produits WHERE club_id = $1 ORDER BY categorie, nom',
    [club_id]
  );
  res.json(result.rows);
});

router.post('/ajuster', async (req, res) => {
  const { club_id } = req.utilisateur;
  const { produit_id, nouvelle_quantite, motif } = req.body;
  const result = await pool.query(
    'UPDATE produits SET quantite_stock = $1 WHERE id = $2 AND club_id = $3 RETURNING *',
    [nouvelle_quantite, produit_id, club_id]
  );
  res.json(result.rows[0]);
});

module.exports = router;
