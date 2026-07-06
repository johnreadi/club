const express = require('express');
const pool = require('../db');
const { verifierToken } = require('../middleware/auth');
const router = express.Router();

router.use(verifierToken);

router.post('/ventes', async (req, res) => {
  const { club_id, id: utilisateur_id } = req.utilisateur;
  const { ventes_offline } = req.body;
  const results = [];
  for (const v of ventes_offline || []) {
    try {
      const vente = await pool.query(
        'INSERT INTO ventes (club_id, utilisateur_id, montant_total, mode_paiement, date_vente) VALUES ($1,$2,$3,$4,$5) RETURNING *',
        [club_id, utilisateur_id, v.montant_total, v.mode_paiement || 'especes', v.date_vente || new Date()]
      );
      results.push({ offline_id: v.offline_id, id: vente.rows[0].id, synced: true });
    } catch {
      results.push({ offline_id: v.offline_id, synced: false });
    }
  }
  res.json({ resultats: results });
});

module.exports = router;
