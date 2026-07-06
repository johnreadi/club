const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db');
const router = express.Router();

router.post('/inscription', async (req, res) => {
  const { nom_club, ville, email, mot_de_passe, nom, prenom, telephone } = req.body;
  if (!nom_club || !email || !mot_de_passe || !nom || !prenom) {
    return res.status(400).json({ erreur: 'Champs obligatoires manquants' });
  }
  if (mot_de_passe.length < 6) {
    return res.status(400).json({ erreur: 'Le mot de passe doit contenir au moins 6 caractères' });
  }
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    // Vérifier email unique
    const exist = await client.query('SELECT id FROM utilisateurs WHERE email = $1', [email]);
    if (exist.rows.length > 0) {
      await client.query('ROLLBACK');
      return res.status(409).json({ erreur: 'Cet email est déjà utilisé' });
    }
    // Créer le club
    const clubRes = await client.query(
      `INSERT INTO clubs (nom, ville, telephone, email_contact, niveau_abonnement, actif)
       VALUES ($1, $2, $3, $4, 'gratuit', true) RETURNING id`,
      [nom_club, ville || null, telephone || null, email]
    );
    const club_id = clubRes.rows[0].id;
    // Créer l'utilisateur admin du club
    const hash = await bcrypt.hash(mot_de_passe, 10);
    const userRes = await client.query(
      `INSERT INTO utilisateurs (club_id, nom, prenom, email, mot_de_passe_hash, role, actif)
       VALUES ($1, $2, $3, $4, $5, 'admin', true) RETURNING id`,
      [club_id, nom, prenom, email, hash]
    );
    const user_id = userRes.rows[0].id;
    // Paramètres par défaut du club
    await client.query(
      `INSERT INTO parametres_club (club_id) VALUES ($1) ON CONFLICT DO NOTHING`,
      [club_id]
    );
    await client.query('COMMIT');
    // Token de connexion immédiat
    const token = jwt.sign(
      { id: user_id, email, role: 'admin', club_id },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );
    res.status(201).json({
      token,
      utilisateur: { id: user_id, email, role: 'admin', club_id, nom, prenom, club_nom: nom_club }
    });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ erreur: 'Erreur lors de la création du compte' });
  } finally {
    client.release();
  }
});

router.post('/connexion', async (req, res) => {
  try {
    const { email, mot_de_passe } = req.body;
    let user = await pool.query('SELECT * FROM admins_plateforme WHERE email = $1', [email]);
    let role = 'admin_plateforme';
    let club_id = null;

    if (user.rows.length === 0) {
      user = await pool.query('SELECT * FROM utilisateurs WHERE email = $1 AND actif = true', [email]);
      if (user.rows.length === 0) return res.status(401).json({ erreur: 'Identifiants incorrects' });
      role = user.rows[0].role;
      club_id = user.rows[0].club_id;
    }

    const valide = await bcrypt.compare(mot_de_passe, user.rows[0].mot_de_passe_hash);
    if (!valide) return res.status(401).json({ erreur: 'Identifiants incorrects' });

    const token = jwt.sign(
      { id: user.rows[0].id, email, role, club_id },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({ token, utilisateur: { id: user.rows[0].id, email, role, club_id } });
  } catch (err) {
    res.status(500).json({ erreur: 'Erreur serveur' });
  }
});

module.exports = router;
