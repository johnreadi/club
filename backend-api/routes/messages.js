const express = require('express');
const pool = require('../db');
const { verifierToken } = require('../middleware/auth');
const router = express.Router();

router.use(verifierToken);

// GET — messages du club (reçus de l'admin + envoyés vers l'admin)
router.get('/', async (req, res) => {
  try {
    const { club_id } = req.utilisateur;
    const result = await pool.query(
      `SELECT id, sujet, contenu, urgent, direction, lu, cree_le
       FROM messages_plateforme
       WHERE club_id = $1
       ORDER BY cree_le DESC`,
      [club_id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('[GET /messages]', err.message);
    res.status(500).json({ erreur: 'Erreur serveur' });
  }
});

// POST — le club envoie un message à l'admin
router.post('/', async (req, res) => {
  try {
    const { club_id } = req.utilisateur;
    const { sujet, contenu, urgent } = req.body;
    if (!contenu || !contenu.trim()) return res.status(400).json({ erreur: 'Contenu requis' });
    const result = await pool.query(
      `INSERT INTO messages_plateforme (club_id, sujet, contenu, urgent, direction, lu)
       VALUES ($1, $2, $3, $4, 'entrant', false) RETURNING *`,
      [club_id, sujet || null, contenu.trim(), urgent || false]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('[POST /messages]', err.message);
    res.status(500).json({ erreur: 'Erreur serveur' });
  }
});

// DELETE — supprimer un message
router.delete('/:id', async (req, res) => {
  try {
    const { club_id } = req.utilisateur;
    const result = await pool.query(
      `DELETE FROM messages_plateforme WHERE id = $1 AND club_id = $2 RETURNING id`,
      [req.params.id, club_id]
    );
    if (result.rowCount === 0) return res.status(404).json({ erreur: 'Message introuvable' });
    res.json({ ok: true });
  } catch (err) {
    console.error('[DELETE /messages/:id]', err.message);
    res.status(500).json({ erreur: 'Erreur serveur' });
  }
});

// PATCH — marquer un message comme lu
router.patch('/:id/lu', async (req, res) => {
  try {
    const { club_id } = req.utilisateur;
    await pool.query(
      `UPDATE messages_plateforme SET lu = true WHERE id = $1 AND club_id = $2`,
      [req.params.id, club_id]
    );
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ erreur: 'Erreur serveur' });
  }
});

module.exports = router;
