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

router.get('/detail', async (req, res) => {
  try {
    const { club_id } = req.utilisateur;
    const { debut, fin } = req.query;
    const result = await pool.query(
      `SELECT v.id, v.date_vente, v.montant_total, v.mode_paiement, v.client_nom, v.client_tel,
              lv.quantite, lv.prix_unitaire,
              p.nom as produit_nom, p.reference, p.code_barre, p.description
       FROM ventes v
       LEFT JOIN lignes_vente lv ON lv.vente_id = v.id
       LEFT JOIN produits p ON p.id = lv.produit_id
       WHERE v.club_id = $1
         AND ($2::date IS NULL OR DATE(v.date_vente) >= $2::date)
         AND ($3::date IS NULL OR DATE(v.date_vente) <= $3::date)
       ORDER BY v.date_vente DESC`,
      [club_id, debut || null, fin || null]
    );
    // Regrouper par vente
    const ventesMap = new Map();
    result.rows.forEach(row => {
      if (!ventesMap.has(row.id)) {
        ventesMap.set(row.id, {
          id: row.id, date_vente: row.date_vente, montant_total: row.montant_total,
          mode_paiement: row.mode_paiement, client_nom: row.client_nom, client_tel: row.client_tel,
          lignes: []
        });
      }
      if (row.produit_nom || row.quantite) {
        ventesMap.get(row.id).lignes.push({
          produit_nom: row.produit_nom, reference: row.reference,
          code_barre: row.code_barre, description: row.description,
          quantite: row.quantite, prix_unitaire: row.prix_unitaire
        });
      }
    });
    res.json([...ventesMap.values()]);
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
