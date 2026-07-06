const express = require('express');
const pool = require('../db');
const { verifierToken } = require('../middleware/auth');
const router = express.Router();

router.use(verifierToken);

router.get('/', async (req, res) => {
  const result = await pool.query('SELECT * FROM clubs WHERE actif = true ORDER BY nom');
  res.json(result.rows);
});

module.exports = router;
