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

// Valeurs par défaut du site (même que dans reglage-site.js)
const DEFAULT_SITE_CONFIG = {
  logoTexte:'READI', logoSuffix:'.Fr',
  colorPrimary:'#165DFF', colorSidebar:'#0f2d6b', colorAccent:'#60a5fa',
  navbarBtnConnexion:'Connexion', navbarBtnCta:'Essai gratuit',
  navbarBgColor:'#ffffff', navbarShowLogo:true, navbarSticky:true,
  navbarLinks:[{label:'Fonctionnalités',href:'#fonctionnalites'},{label:'Comment ça marche',href:'#comment-ca-marche'},{label:'Tarifs',href:'#tarifs'}],
  slideSpeed:5000, slideAutoplay:true, slideShowDots:true, slideShowStats:true,
  slides:[
    {gradient:'linear-gradient(135deg,#0f2d6b 0%,#165DFF 55%,#0ea5e9 100%)'},
    {gradient:'linear-gradient(135deg,#1a1a2e 0%,#16213e 40%,#0f3460 100%)'},
    {gradient:'linear-gradient(135deg,#064e3b 0%,#065f46 45%,#059669 100%)'},
    {gradient:'linear-gradient(135deg,#4c1d95 0%,#5b21b6 45%,#7c3aed 100%)'}
  ],
  typewriterPhrases:['Gerez votre stock en temps reel.','Creez vos etiquettes avec codes-barres.','Encaissez vos ventes facilement.','Suivez vos performances en un clic.'],
  heroStats:[{valeur:'+200',label:'Clubs'},{valeur:'50k+',label:'Étiquettes'},{valeur:'100%',label:'En ligne'}],
  sectFonctVisible:true, sectFonctBadge:'Tout-en-un',
  sectFonctTitre:'Tout ce dont votre club a besoin',
  sectFonctSous:'Une plateforme complète pour professionnaliser la gestion de votre boutique sportive.',
  fonctCards:null,
  sectHowVisible:true, sectHowBadge:'Simple & rapide', sectHowTitre:'Opérationnel en 3 étapes',
  howSteps:null,
  sectTarifsVisible:true, sectTarifsBadge:'Tarification', sectTarifsTitre:'Gratuit pour commencer',
  sectTarifsSous:'Profitez de toutes les fonctionnalités sans limitation.',
  sectTarifsPrix:'0 €', sectTarifsBadgeLabel:'LANCEMENT GRATUIT', sectTarifsCta:'Commencer gratuitement',
  sectCtaVisible:true, sectCtaTitre:'Prêt à professionnaliser votre boutique ?',
  sectCtaSous:'Rejoignez des centaines de clubs qui gèrent leur stock avec READI.Fr.',
  sectCtaBtn:'Créer mon espace gratuitement', sectCtaNote:'Aucune carte bancaire · Activation immédiate',
  landCta1:'Créer mon espace gratuit', landCta2:'Découvrir',
  font:'Inter, sans-serif', fontSize:14,
  pageMentions: '<h1>Mentions légales</h1><p>Contenu des mentions légales à personnaliser.</p>',
  pageCgu: '<h1>Conditions générales d\'utilisation</h1><p>Contenu des CGU à personnaliser.</p>',
  pagePrivacy: '<h1>Politique de confidentialité</h1><p>Contenu de la politique de confidentialité à personnaliser.</p>'
};

// Helper pour charger la config du site
async function loadSiteConfig() {
  try {
    const result = await pool.query('SELECT cle, valeur FROM plateforme_config');
    const config = {};
    result.rows.forEach(row => { config[row.cle] = row.valeur; });

    // Parse site_config_json et merge avec defaults
    let siteConfigFromDB = {};
    if (config.site_config_json) {
      try {
        siteConfigFromDB = typeof config.site_config_json === 'string' 
          ? JSON.parse(config.site_config_json) 
          : config.site_config_json;
      } catch (err) {
        console.warn('Failed to parse site_config_json from DB, using defaults');
      }
    }
    
    config.site_config_merged = Object.assign({}, DEFAULT_SITE_CONFIG, siteConfigFromDB);
    return config;
  } catch (err) {
    console.error('[loadSiteConfig]', err.message);
    // Return default config if everything fails
    return { site_config_merged: DEFAULT_SITE_CONFIG };
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

// API publique pour récupérer la config du site
app.get('/api/config', async (req, res) => {
  try {
    const config = await loadSiteConfig();
    res.json(config.site_config_merged); // Return the merged config directly
  } catch (err) {
    console.error('GET /api/config error:', err.message);
    res.status(500).json({ erreur: 'Erreur serveur' });
  }
});

// Routes pour les pages légales
app.get('/mentions-legales.html', async (req, res) => {
  const config = await loadSiteConfig();
  const content = config.site_config_merged.pageMentions;
  res.send(renderLegalPage('Mentions légales', content));
});

app.get('/cgu.html', async (req, res) => {
  const config = await loadSiteConfig();
  const content = config.site_config_merged.pageCgu;
  res.send(renderLegalPage('Conditions générales d\'utilisation', content));
});

app.get('/politique-confidentialite.html', async (req, res) => {
  const config = await loadSiteConfig();
  const content = config.site_config_merged.pagePrivacy;
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
