const express = require('express');
const bcrypt = require('bcryptjs');
const pool = require('../db');
const { verifierToken } = require('../middleware/auth');
const router = express.Router();

router.use(verifierToken);

router.get('/', async (req, res) => {
  try {
    const { club_id, role } = req.utilisateur;
    let result;
    if (role === 'admin_plateforme') {
      result = await pool.query('SELECT id, nom, prenom, email, role, actif, derniere_connexion, club_id FROM utilisateurs ORDER BY nom');
    } else {
      result = await pool.query('SELECT id, nom, prenom, email, role, actif, derniere_connexion FROM utilisateurs WHERE club_id = $1 ORDER BY nom', [club_id]);
    }
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ erreur: 'Erreur serveur' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { club_id } = req.utilisateur;
    const { nom, prenom, email, mot_de_passe, role } = req.body;
    if (!nom || !prenom || !email || !mot_de_passe || !role) {
      return res.status(400).json({ erreur: 'Tous les champs sont requis' });
    }
    const hash = await bcrypt.hash(mot_de_passe, 10);
    const result = await pool.query(
      'INSERT INTO utilisateurs (club_id, nom, prenom, email, mot_de_passe_hash, role) VALUES ($1,$2,$3,$4,$5,$6) RETURNING id, nom, prenom, email, role, actif',
      [club_id, nom, prenom, email, hash, role]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({ erreur: 'Email déjà utilisé' });
    res.status(500).json({ erreur: 'Erreur serveur' });
  }
});

router.put('/:id/actif', async (req, res) => {
  try {
    const { club_id } = req.utilisateur;
    const { actif } = req.body;
    const result = await pool.query(
      'UPDATE utilisateurs SET actif = $1 WHERE id = $2 AND club_id = $3 RETURNING id, actif',
      [actif, req.params.id, club_id]
    );
    if (result.rows.length === 0) return res.status(404).json({ erreur: 'Utilisateur non trouvé' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ erreur: 'Erreur serveur' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { club_id } = req.utilisateur;
    await pool.query('DELETE FROM utilisateurs WHERE id = $1 AND club_id = $2', [req.params.id, club_id]);
    res.json({ succes: true });
  } catch (err) {
    res.status(500).json({ erreur: 'Erreur serveur' });
  }
});

module.exports = router;
