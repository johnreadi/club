const express = require('express');
const pool = require('../db');
const { verifierToken } = require('../middleware/auth');
const router = express.Router();

router.use(verifierToken);

router.get('/ventes', async (req, res) => {
  try {
    const { club_id } = req.utilisateur;
    const { debut, fin } = req.query;
    const result = await pool.query(
      `SELECT DATE(date_vente) as jour, COUNT(*) as nb_ventes, SUM(montant_total) as ca
       FROM ventes WHERE club_id = $1
       AND ($2::date IS NULL OR DATE(date_vente) >= $2::date)
       AND ($3::date IS NULL OR DATE(date_vente) <= $3::date)
       GROUP BY DATE(date_vente) ORDER BY jour DESC`,
      [club_id, debut || null, fin || null]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ erreur: 'Erreur serveur' });
  }
});

router.get('/stock', async (req, res) => {
  try {
    const { club_id } = req.utilisateur;
    const result = await pool.query(
      `SELECT COUNT(*) as nb_produits, SUM(quantite_stock) as total_stock,
       SUM(quantite_stock * prix_vente) as valeur_stock
       FROM produits WHERE club_id = $1 AND actif = true`,
      [club_id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ erreur: 'Erreur serveur' });
  }
});

module.exports = router;
