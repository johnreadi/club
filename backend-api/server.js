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

// Helper pour charger la config du site
async function loadSiteConfig() {
  try {
    const result = await pool.query('SELECT cle, valeur FROM plateforme_config');
    const config = {};
    result.rows.forEach(row => { config[row.cle] = row.valeur; });
    return config;
  } catch (err) {
    console.error('[loadSiteConfig]', err.message);
    return {};
  }
}

// Helper pour générer la page HTML légale avec style
function renderLegalPage(title, content) {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} - READI.Fr</title>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin:0; padding:2rem; background-color:#f8fafc; color:#1f2937; }
    .container { max-width: 800px; margin: 0 auto; background: white; padding: 2rem; border-radius: 0.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    h1 { color: #165DFF; margin-top:0; }
    a { color: #165DFF; text-decoration: none; }
    a:hover { text-decoration: underline; }
    .back-link { margin-bottom:1rem; display:inline-block; }
  </style>
</head>
<body>
  <div class="container">
    <a href="/" class="back-link">&larr; Retour à l'accueil</a>
    ${content}
  </div>
</body>
</html>`;
}

// Routes pour les pages légales
app.get('/mentions-legales.html', async (req, res) => {
  const config = await loadSiteConfig();
  let content = '<h1>Mentions légales</h1><p>Contenu des mentions légales à personnaliser.</p>';
  if (config.site_config_json) {
    try {
      const siteConfig = typeof config.site_config_json === 'string' 
        ? JSON.parse(config.site_config_json) 
        : config.site_config_json;
      if (siteConfig.pageMentions) content = siteConfig.pageMentions;
    } catch (err) { /* use default */ }
  }
  res.send(renderLegalPage('Mentions légales', content));
});

app.get('/cgu.html', async (req, res) => {
  const config = await loadSiteConfig();
  let content = '<h1>Conditions générales d\'utilisation</h1><p>Contenu des CGU à personnaliser.</p>';
  if (config.site_config_json) {
    try {
      const siteConfig = typeof config.site_config_json === 'string' 
        ? JSON.parse(config.site_config_json) 
        : config.site_config_json;
      if (siteConfig.pageCgu) content = siteConfig.pageCgu;
    } catch (err) { /* use default */ }
  }
  res.send(renderLegalPage('Conditions générales d\'utilisation', content));
});

app.get('/politique-confidentialite.html', async (req, res) => {
  const config = await loadSiteConfig();
  let content = '<h1>Politique de confidentialité</h1><p>Contenu de la politique de confidentialité à personnaliser.</p>';
  if (config.site_config_json) {
    try {
      const siteConfig = typeof config.site_config_json === 'string' 
        ? JSON.parse(config.site_config_json) 
        : config.site_config_json;
      if (siteConfig.pagePrivacy) content = siteConfig.pagePrivacy;
    } catch (err) { /* use default */ }
  }
  res.send(renderLegalPage('Politique de confidentialité', content));
});

// Routes API
app.use('/api/auth', require('./routes/auth'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/clubs', require('./routes/clubs'));
app.use('/api/stock', require('./routes/stock'));
app.use('/api/ventes', require('./routes/ventes'));
app.use('/api/inventaire', require('./routes/inventaire'));
app.use('/api/rapports', require('./routes/rapports'));

app.use('/api/utilisateurs', require('./routes/utilisateurs'));
app.use('/api/parametres', require('./routes/parametres'));
app.use('/api/messages', require('./routes/messages'));

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
