const express = require('express');
const pool = require('../db');
const { verifierToken } = require('../middleware/auth');
const router = express.Router();

router.use(verifierToken);

function genererCodeBarre(clubId, ref) {
  const base = String(clubId).padStart(3, '0') + Date.now().toString().slice(-8) + Math.floor(Math.random() * 100).toString().padStart(2, '0');
  return base.slice(0, 12);
}

router.get('/', async (req, res) => {
  try {
    const { club_id } = req.utilisateur;
    const result = await pool.query('SELECT * FROM produits WHERE club_id = $1 ORDER BY nom', [club_id]);
    res.json(result.rows);
  } catch (err) {
    console.error('[STOCK GET]', err.message);
    res.status(500).json({ erreur: 'Erreur serveur', detail: err.message });
  }
});

router.get('/scan/:code', async (req, res) => {
  try {
    const { club_id } = req.utilisateur;
    const { code } = req.params;
    const result = await pool.query(
      'SELECT * FROM produits WHERE club_id = $1 AND (code_barre = $2 OR reference = $2)',
      [club_id, code]
    );
    if (result.rows.length === 0) return res.status(404).json({ erreur: 'Produit non trouvé', code });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ erreur: 'Erreur serveur' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { club_id } = req.utilisateur;
    const { reference, nom, categorie, description, code_barre, prix_achat, prix_vente, quantite_stock, seuil_alerte, image_url } = req.body;
    if (!nom || !prix_vente) return res.status(400).json({ erreur: 'Nom et prix de vente requis' });
    const codeBarreFinal = code_barre || genererCodeBarre(club_id, reference);
    const result = await pool.query(
      'INSERT INTO produits (club_id, reference, nom, categorie, description, code_barre, prix_achat, prix_vente, quantite_stock, seuil_alerte, image_url) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *',
      [club_id, reference || null, nom, categorie || null, description || null, codeBarreFinal, prix_achat || 0, prix_vente, quantite_stock || 0, seuil_alerte || 5, image_url || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('[STOCK POST]', err.message);
    res.status(500).json({ erreur: 'Erreur serveur', detail: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { club_id } = req.utilisateur;
    const { reference, nom, categorie, description, code_barre, prix_achat, prix_vente, quantite_stock, seuil_alerte, image_url } = req.body;
    const result = await pool.query(
      `UPDATE produits SET reference=$1, nom=$2, categorie=$3, description=$4, code_barre=$5, prix_achat=$6, prix_vente=$7,
       quantite_stock=$8, seuil_alerte=$9, image_url=$10, mis_a_jour_le=CURRENT_TIMESTAMP
       WHERE id=$11 AND club_id=$12 RETURNING *`,
      [reference || null, nom, categorie || null, description || null, code_barre || null, prix_achat || 0, prix_vente, quantite_stock, seuil_alerte || 5, image_url || null, req.params.id, club_id]
    );
    if (result.rows.length === 0) return res.status(404).json({ erreur: 'Produit non trouvé' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error('[STOCK PUT]', err.message);
    res.status(500).json({ erreur: 'Erreur serveur', detail: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { club_id } = req.utilisateur;
    await pool.query('DELETE FROM produits WHERE id=$1 AND club_id=$2', [req.params.id, club_id]);
    res.json({ succes: true });
  } catch (err) {
    console.error('[STOCK DELETE]', err.message);
    res.status(500).json({ erreur: 'Erreur serveur', detail: err.message });
  }
});

module.exports = router;
