require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const fs = require('fs');
const path = require('path');
const pool = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

// Attendre que PostgreSQL soit prêt avant d'initialiser
async function waitForDB(retries = 10, delay = 3000) {
  for (let i = 0; i < retries; i++) {
    try {
      await pool.query('SELECT 1');
      return true;
    } catch (err) {
      console.log(`⏳ Attente de PostgreSQL... (${i + 1}/${retries})`);
      await new Promise(r => setTimeout(r, delay));
    }
  }
  throw new Error('Impossible de se connecter à PostgreSQL après plusieurs tentatives');
}

// Initialisation BDD
async function initDB() {
  await waitForDB();
  console.log('⚙️  Application du schéma SQL...');
  const sql = fs.readFileSync(path.join(__dirname, 'models/database.sql'), 'utf8');
  await pool.query(sql);
  console.log('✅ Schéma appliqué avec succès');
}

// Middlewares
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Health check (avant auth)
app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  } catch {
    res.status(503).json({ status: 'error', message: 'Base de données indisponible' });
  }
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/clubs', require('./routes/clubs'));
app.use('/api/stock', require('./routes/stock'));
app.use('/api/ventes', require('./routes/ventes'));
app.use('/api/inventaire', require('./routes/inventaire'));
app.use('/api/rapports', require('./routes/rapports'));
app.use('/api/sync', require('./routes/sync'));
app.use('/api/utilisateurs', require('./routes/utilisateurs'));
app.use('/api/parametres', require('./routes/parametres'));

// 404 pour routes API inconnues
app.use('/api/*', (req, res) => {
  res.status(404).json({ erreur: 'Route API introuvable' });
});

// Gestionnaire d'erreurs global
app.use((err, req, res, next) => {
  console.error('Erreur serveur:', err.message);
  res.status(500).json({ erreur: 'Erreur interne du serveur' });
});

// Éviter les crashes sur erreurs non catchées
process.on('uncaughtException', (err) => {
  console.error('⚠️  Erreur non catchée (ignorée):', err.message);
});
process.on('unhandledRejection', (err) => {
  console.error('⚠️  Promesse rejetée (ignorée):', err?.message || err);
});

// Démarrage
initDB()
  .then(() => {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 API Gestion des Clubs démarrée sur le port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ Erreur au démarrage :', err.message);
    process.exit(1);
  });
