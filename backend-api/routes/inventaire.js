const express = require('express');
const pool = require('../db');
const { verifierToken } = require('../middleware/auth');
const router = express.Router();

router.use(verifierToken);

router.get('/', async (req, res) => {
  try {
    const { club_id } = req.utilisateur;
    const result = await pool.query(
      'SELECT * FROM produits WHERE club_id = $1 ORDER BY nom',
      [club_id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ erreur: 'Erreur serveur' });
  }
});

router.post('/ajuster', async (req, res) => {
  try {
    const { club_id } = req.utilisateur;
    const { produit_id, nouvelle_quantite } = req.body;
    const result = await pool.query(
      'UPDATE produits SET quantite_stock = $1, mis_a_jour_le = CURRENT_TIMESTAMP WHERE id = $2 AND club_id = $3 RETURNING *',
      [nouvelle_quantite, produit_id, club_id]
    );
    if (result.rows.length === 0) return res.status(404).json({ erreur: 'Produit non trouvé' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ erreur: 'Erreur serveur' });
  }
});

module.exports = router;
