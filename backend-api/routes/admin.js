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

router.put('/clubs/:id', async (req, res) => {
  try {
    const { actif, niveau_abonnement, date_fin_abonnement } = req.body;
    const fields = [];
    const vals = [];
    let i = 1;
    if (actif !== undefined) { fields.push(`actif=$${i++}`); vals.push(actif); }
    if (niveau_abonnement !== undefined) { fields.push(`niveau_abonnement=$${i++}`); vals.push(niveau_abonnement); }
    if (date_fin_abonnement !== undefined) { fields.push(`date_fin_abonnement=$${i++}`); vals.push(date_fin_abonnement); }
    if (fields.length === 0) return res.status(400).json({ erreur: 'Aucun champ à modifier' });
    vals.push(req.params.id);
    const result = await pool.query(`UPDATE clubs SET ${fields.join(',')} WHERE id=$${i} RETURNING *`, vals);
    if (result.rows.length === 0) return res.status(404).json({ erreur: 'Club non trouvé' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error('[ADMIN PUT club]', err.message);
    res.status(500).json({ erreur: 'Erreur serveur', detail: err.message });
  }
});

router.get('/messages', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT m.*, c.nom AS club_nom FROM messages_plateforme m
       LEFT JOIN clubs c ON c.id = m.club_id
       ORDER BY m.cree_le DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error('[ADMIN GET messages]', err.message);
    res.status(500).json({ erreur: 'Erreur serveur', detail: err.message });
  }
});

router.post('/messages', async (req, res) => {
  try {
    const { club_id, sujet, contenu, urgent } = req.body;
    if (!club_id || !contenu) return res.status(400).json({ erreur: 'club_id et contenu requis' });
    const result = await pool.query(
      `INSERT INTO messages_plateforme (club_id, sujet, contenu, urgent, direction)
       VALUES ($1, $2, $3, $4, 'sortant') RETURNING *`,
      [club_id, sujet || null, contenu, urgent || false]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('[ADMIN POST message]', err.message);
    res.status(500).json({ erreur: 'Erreur serveur', detail: err.message });
  }
});

// GET /admin/config — lire la configuration globale de la plateforme
router.get('/config', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT cle, valeur FROM plateforme_config`
    );
    const config = {};
    result.rows.forEach(row => { config[row.cle] = row.valeur; });
    res.json(config);
  } catch (err) {
    console.error('[GET /admin/config]', err.message);
    res.status(500).json({ erreur: 'Erreur serveur' });
  }
});

// PATCH /admin/config — mettre à jour une ou plusieurs clés
router.patch('/config', async (req, res) => {
  try {
    const updates = Object.entries(req.body);
    if (updates.length === 0) return res.json({ ok: true });
    for (const [cle, valeur] of updates) {
      const v = valeur === null ? null
        : (typeof valeur === 'string' ? valeur : JSON.stringify(valeur));
      await pool.query(
        `INSERT INTO plateforme_config (cle, valeur, mis_a_jour_le)
         VALUES ($1, $2, CURRENT_TIMESTAMP)
         ON CONFLICT (cle) DO UPDATE SET valeur = EXCLUDED.valeur, mis_a_jour_le = CURRENT_TIMESTAMP`,
        [cle, v]
      );
    }
    res.json({ ok: true });
  } catch (err) {
    console.error('[PATCH /admin/config]', err.message);
    res.status(500).json({ erreur: 'Erreur serveur', detail: err.message });
  }
});

module.exports = router;
