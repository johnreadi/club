const express = require('express');
const pool = require('../db');
const { verifierToken } = require('../middleware/auth');
const router = express.Router();

router.use(verifierToken);

router.get('/', async (req, res) => {
  try {
    const { club_id } = req.utilisateur;
    const result = await pool.query(
      'SELECT * FROM ventes WHERE club_id = $1 ORDER BY date_vente DESC LIMIT 100',
      [club_id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ erreur: 'Erreur serveur' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { club_id } = req.utilisateur;
    const vente = await pool.query(
      'SELECT v.*, u.nom as vendeur_nom, u.prenom as vendeur_prenom FROM ventes v LEFT JOIN utilisateurs u ON u.id = v.utilisateur_id WHERE v.id = $1 AND v.club_id = $2',
      [req.params.id, club_id]
    );
    if (vente.rows.length === 0) return res.status(404).json({ erreur: 'Vente non trouvée' });
    const lignes = await pool.query(
      'SELECT lv.*, p.nom as produit_nom, p.reference, p.code_barre, p.description FROM lignes_vente lv LEFT JOIN produits p ON p.id = lv.produit_id WHERE lv.vente_id = $1',
      [req.params.id]
    );
    res.json({ ...vente.rows[0], lignes: lignes.rows });
  } catch (err) {
    res.status(500).json({ erreur: 'Erreur serveur' });
  }
});

router.post('/', async (req, res) => {
  const { club_id, id: utilisateur_id } = req.utilisateur;
  const { articles, montant_total, mode_paiement, client_nom, client_tel } = req.body;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const vente = await client.query(
      'INSERT INTO ventes (club_id, utilisateur_id, montant_total, mode_paiement, client_nom, client_tel) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *',
      [club_id, utilisateur_id, montant_total, mode_paiement || 'especes', client_nom || null, client_tel || null]
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
