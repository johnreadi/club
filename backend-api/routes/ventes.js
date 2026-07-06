const express = require('express');
const pool = require('../db');
const { verifierToken } = require('../middleware/auth');
const router = express.Router();

router.use(verifierToken);

router.get('/', async (req, res) => {
  const { club_id } = req.utilisateur;
  const result = await pool.query(
    'SELECT * FROM ventes WHERE club_id = $1 ORDER BY date_vente DESC LIMIT 100',
    [club_id]
  );
  res.json(result.rows);
});

router.post('/', async (req, res) => {
  const { club_id, id: utilisateur_id } = req.utilisateur;
  const { articles, montant_total, mode_paiement } = req.body;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const vente = await client.query(
      'INSERT INTO ventes (club_id, utilisateur_id, montant_total, mode_paiement) VALUES ($1,$2,$3,$4) RETURNING *',
      [club_id, utilisateur_id, montant_total, mode_paiement || 'especes']
    );
    for (const art of articles) {
      await client.query(
        'INSERT INTO lignes_vente (vente_id, produit_id, quantite, prix_unitaire) VALUES ($1,$2,$3,$4)',
        [vente.rows[0].id, art.produit_id, art.quantite, art.prix_unitaire]
      );
      await client.query(
        'UPDATE produits SET quantite_stock = quantite_stock - $1 WHERE id = $2',
        [art.quantite, art.produit_id]
      );
    }
    await client.query('COMMIT');
    res.status(201).json(vente.rows[0]);
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ erreur: 'Erreur lors de la vente' });
  } finally {
    client.release();
  }
});

module.exports = router;
