const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db');
const router = express.Router();

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
