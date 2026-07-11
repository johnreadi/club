// ── Réglage Site — version unifiée ────────────────────────────────────────────
const SITE_DEFAULTS = {
  // Identité
  nom: 'READI.Fr', slogan: 'La gestion de club simplifiée',
  email: 'contact@readi.fr', tel: '',
  logoTexte: 'READI', logoSuffix: '.Fr', logoUrl: '',
  // Couleurs
  colorPrimary: '#165DFF', colorSidebar: '#1e3a5f',
  colorAccent: '#60A5FA', colorText: '#1f2937', colorBg: '#f8fafc',
  // Typographie
  font: 'Inter, sans-serif', fontSize: 14, lineHeight: 1.5, radius: '8px',
  // Hero / Landing (onglet Page d'accueil)
  landHeroTitre: 'Gérez votre club comme un pro',
  landHeroSous: 'La solution tout-en-un pour gérer votre stock, votre caisse et vos membres.',
  landCta1: 'Créer mon espace gratuit', landCta2: 'Découvrir',
  landFinalTitre: 'Prêt à booster votre club ?', landFinalCta: 'Créer mon espace gratuit',
  landFeatures: [
    { icone: 'fa-cube',       titre: 'Gestion du stock',   desc: 'Suivez vos produits en temps réel' },
    { icone: 'fa-calculator', titre: 'Caisse intégrée',    desc: 'Encaissez rapidement et simplement' },
    { icone: 'fa-bar-chart',  titre: 'Rapports détaillés', desc: 'Analysez vos performances' }
  ],
  // Navigation app (sidebar)
  navItems: [
    { section: 'accueil',      label: 'Tableau de bord',    icone: 'fa-home',      visible: true },
    { section: 'stock',        label: 'Stock & Étiquettes', icone: 'fa-cube',      visible: true },
    { section: 'caisse',       label: 'Caisse & Ventes',    icone: 'fa-calculator',visible: true },
    { section: 'inventaire',   label: 'Inventaire',         icone: 'fa-list-alt',  visible: true },
    { section: 'rapports',     label: 'Rapports',           icone: 'fa-bar-chart', visible: true },
    { section: 'utilisateurs', label: 'Utilisateurs',       icone: 'fa-users',     visible: true },
    { section: 'parametres',   label: 'Paramètres',         icone: 'fa-sliders',   visible: true }
  ],
  navShowLogo: true, navSidebarCollapsed: false,
  // Footer
  footerCopyright: '© 2026 READI.Fr — Tous droits réservés',
  footerMentions: '', footerCgu: '', footerPrivacy: '',
  footerFacebook: '', footerTwitter: '', footerInstagram: '', footerLinkedin: '',
  // Pages légales
  pageMentions: '<h1>Mentions légales</h1><p>Contenu des mentions légales à personnaliser.</p>',
  pageCgu: '<h1>Conditions générales d\'utilisation</h1><p>Contenu des CGU à personnaliser.</p>',
  pagePrivacy: '<h1>Politique de confidentialité</h1><p>Contenu de la politique de confidentialité à personnaliser.</p>',
  // Navbar landing
  navbarBtnConnexion: 'Connexion', navbarBtnCta: 'Essai gratuit',
  navbarBgColor: '#ffffff', navbarShowLogo: true, navbarSticky: true,
  navbarLinks: [
    { label: 'Fonctionnalités',    href: '#fonctionnalites' },
    { label: 'Comment ça marche',  href: '#comment-ca-marche' },
    { label: 'Tarifs',             href: '#tarifs' }
  ],
  // Slideshow
  slideSpeed: 5000, slideAutoplay: true, slideShowDots: true, slideShowStats: true,
  slides: [
    { gradient: 'linear-gradient(135deg,#0f2d6b 0%,#165DFF 55%,#0ea5e9 100%)', imageUrl: '' },
    { gradient: 'linear-gradient(135deg,#1a1a2e 0%,#16213e 40%,#0f3460 100%)', imageUrl: '' },
    { gradient: 'linear-gradient(135deg,#064e3b 0%,#065f46 45%,#059669 100%)', imageUrl: '' },
    { gradient: 'linear-gradient(135deg,#4c1d95 0%,#5b21b6 45%,#7c3aed 100%)', imageUrl: '' }
  ],
  typewriterPhrases: [
    'Gérez votre stock en temps réel.',
    'Créez vos étiquettes avec codes-barres.',
    'Encaissez vos ventes facilement.',
    'Suivez vos performances en un clic.'
  ],
  heroStats: [
    { valeur: '+200', label: 'Clubs' },
    { valeur: '50k+', label: 'Étiquettes' },
    { valeur: '100%', label: 'En ligne' }
  ],
  // Sections landing
  sectFonctVisible: true, sectFonctBadge: 'Tout-en-un',
  sectFonctTitre: 'Tout ce dont votre club a besoin',
  sectFonctSous: 'Une plateforme complète pour professionnaliser la gestion de votre boutique sportive.',
  fonctCards: [
    { icone: 'fa-cubes',      titre: 'Gestion du stock',            desc: 'Ajoutez vos produits, suivez les quantités en temps réel.',    points: ['Ajout par douchette ou manuel', 'Catégories personnalisées', 'Alertes de seuil automatiques'] },
    { icone: 'fa-barcode',    titre: 'Étiquettes professionnelles', desc: 'Générez et imprimez vos étiquettes avec code-barres.',         points: ['Code-barres CODE128 intégré',   'Personnalisation couleurs',   'Impression par lot'] },
    { icone: 'fa-calculator', titre: 'Caisse enregistreuse',        desc: 'Encaissez vos ventes, gérez le rendu monnaie.',               points: ['Recherche produit live',        'Rendu monnaie automatique',   'Ticket & facture imprimables'] },
    { icone: 'fa-bar-chart',  titre: 'Rapports & statistiques',     desc: 'Visualisez vos performances de vente à tout moment.',        points: ['CA mensuel et annuel',          'Top produits vendus',         'Export des données'] },
    { icone: 'fa-users',      titre: 'Multi-utilisateurs',          desc: 'Invitez bénévoles et gérants avec des droits configurables.', points: ['Rôles admin / vendeur',         'Historique par utilisateur',  'Connexion JWT sécurisée'] },
    { icone: 'fa-mobile',     titre: 'Application mobile (PWA)',    desc: 'Installez l\'app sur votre téléphone sans l\'App Store.',    points: ['iOS, Android, PC',              'Compatible douchette Bluetooth','Interface responsive'] }
  ],
  sectHowVisible: true, sectHowBadge: 'Simple & rapide', sectHowTitre: 'Opérationnel en 3 étapes',
  howSteps: [
    { titre: 'Créez votre compte',    desc: 'Cliquez sur « Connexion » puis « S\'inscrire ». Votre espace est actif immédiatement.' },
    { titre: 'Ajoutez vos produits',  desc: 'Importez votre catalogue, scannez les codes-barres ou saisissez vos articles manuellement.' },
    { titre: 'Gérez & vendez',        desc: 'Imprimez vos étiquettes, encaissez vos ventes et consultez vos rapports en temps réel.' }
  ],
  sectTarifsVisible: true, sectTarifsBadge: 'Tarification', sectTarifsTitre: 'Gratuit pour commencer',
  sectTarifsSous: 'Profitez de toutes les fonctionnalités sans limitation.',
  sectTarifsPrix: '0 €', sectTarifsBadgeLabel: 'LANCEMENT GRATUIT', sectTarifsCta: 'Commencer gratuitement',
  sectCtaVisible: true,
  sectCtaTitre: 'Prêt à professionnaliser votre boutique ?',
  sectCtaSous: 'Rejoignez des centaines de clubs qui gèrent leur stock avec READI.Fr.',
  sectCtaBtn: 'Créer mon espace gratuitement',
  sectCtaNote: 'Aucune carte bancaire · Activation immédiate'
};

const THEMES = [
  { nom: 'Bleu Océan',  primary: '#165DFF', sidebar: '#0f2d6b', accent: '#60A5FA', text: '#1f2937', bg: '#f8fafc' },
  { nom: 'Vert Nature', primary: '#10B981', sidebar: '#064e3b', accent: '#34D399', text: '#1f2937', bg: '#f0fdf4' },
  { nom: 'Violet Pro',  primary: '#8B5CF6', sidebar: '#2e1065', accent: '#A78BFA', text: '#1f2937', bg: '#faf5ff' },
  { nom: 'Rouge Vif',   primary: '#EF4444', sidebar: '#450a0a', accent: '#FCA5A5', text: '#1f2937', bg: '#fff1f2' },
  { nom: 'Ardoise',     primary: '#64748B', sidebar: '#0f172a', accent: '#94A3B8', text: '#1e293b', bg: '#f1f5f9' },
  { nom: 'Orange Club', primary: '#F97316', sidebar: '#431407', accent: '#FDBA74', text: '#1f2937', bg: '#fff7ed' }
];

let siteConfig = {};

// ── Point d'entrée principal ──────────────────────────────────────────────────
async function chargerReglagesSite() {
  siteConfig = { ...SITE_DEFAULTS };
  try {
    const data = await apiFetch('/admin/config');
    if (data && data.site_config_json) {
      const saved = typeof data.site_config_json === 'string'
        ? JSON.parse(data.site_config_json)
        : data.site_config_json;
      siteConfig = { ...SITE_DEFAULTS, ...saved };
    }
  } catch (e) {
    console.warn('[reglage-site] Chargement BDD échoué, valeurs par défaut', e);
  }
  _remplirFormulaires();
  _rendreToutes();
  _previewToutes();
}

// ── Remplissage complet des formulaires ───────────────────────────────────────
function _remplirFormulaires() {
  const set = (id, val) => { const el = document.getElementById(id); if (el && val !== undefined && val !== null) el.value = val; };
  const chk = (id, val) => { const el = document.getElementById(id); if (el) el.checked = !!val; };

  // Identité
  set('site-nom', siteConfig.nom);
  set('site-slogan', siteConfig.slogan);
  set('site-email', siteConfig.email);
  set('site-tel', siteConfig.tel);
  set('site-logo-texte', siteConfig.logoTexte);
  set('site-logo-suffix', siteConfig.logoSuffix);
  if (siteConfig.logoUrl) {
    const prev = document.getElementById('site-logo-preview');
    if (prev) prev.innerHTML = `<img src="${siteConfig.logoUrl}" class="w-full h-full object-contain rounded-lg">`;
  }
  // Couleurs
  ['primary','sidebar','accent','text','bg'].forEach(k => {
    const key = 'color' + k.charAt(0).toUpperCase() + k.slice(1);
    set('site-color-' + k, siteConfig[key]);
    set('site-color-' + k + '-hex', siteConfig[key]);
  });
  // Typo
  set('site-font', siteConfig.font);
  set('site-font-size', siteConfig.fontSize);
  set('site-line-height', siteConfig.lineHeight);
  set('site-radius', siteConfig.radius);
  const bv = document.getElementById('typo-base-val'); if (bv) bv.textContent = siteConfig.fontSize;
  const lv = document.getElementById('typo-line-val'); if (lv) lv.textContent = parseFloat(siteConfig.lineHeight).toFixed(1);
  // Landing (page accueil)
  set('land-hero-titre', siteConfig.landHeroTitre);
  set('land-hero-sous', siteConfig.landHeroSous);
  set('land-cta1', siteConfig.landCta1);
  set('land-cta2', siteConfig.landCta2);
  set('land-final-titre', siteConfig.landFinalTitre);
  set('land-final-cta', siteConfig.landFinalCta);
  // Navigation app
  chk('nav-show-logo', siteConfig.navShowLogo);
  chk('nav-sidebar-collapsed', siteConfig.navSidebarCollapsed);
  // Footer
  set('footer-copyright', siteConfig.footerCopyright);
  set('footer-mentions', siteConfig.footerMentions);
  set('footer-cgu', siteConfig.footerCgu);
  set('footer-privacy', siteConfig.footerPrivacy);
  set('footer-facebook', siteConfig.footerFacebook);
  set('footer-twitter', siteConfig.footerTwitter);
  set('footer-instagram', siteConfig.footerInstagram);
  set('footer-linkedin', siteConfig.footerLinkedin);
  // Pages légales
  set('page-mentions', siteConfig.pageMentions);
  set('page-cgu', siteConfig.pageCgu);
  set('page-privacy', siteConfig.pagePrivacy);
  // Navbar landing
  set('nav-btn-connexion', siteConfig.navbarBtnConnexion);
  set('nav-btn-cta', siteConfig.navbarBtnCta);
  set('navbar-bg-color', siteConfig.navbarBgColor);
  chk('navbar-show-logo', siteConfig.navbarShowLogo);
  chk('navbar-sticky', siteConfig.navbarSticky);
  // Slideshow
  set('slide-speed', siteConfig.slideSpeed);
  chk('slide-autoplay', siteConfig.slideAutoplay !== false);
  chk('slide-show-dots', siteConfig.slideShowDots !== false);
  chk('slide-show-stats', siteConfig.slideShowStats !== false);
  // Sections
  chk('sect-fonct-visible', siteConfig.sectFonctVisible !== false);
  set('sect-fonct-badge', siteConfig.sectFonctBadge);
  set('sect-fonct-titre', siteConfig.sectFonctTitre);
  set('sect-fonct-sous', siteConfig.sectFonctSous);
  chk('sect-how-visible', siteConfig.sectHowVisible !== false);
  set('sect-how-badge', siteConfig.sectHowBadge);
  set('sect-how-titre', siteConfig.sectHowTitre);
  chk('sect-tarifs-visible', siteConfig.sectTarifsVisible !== false);
  set('sect-tarifs-badge', siteConfig.sectTarifsBadge);
  set('sect-tarifs-titre', siteConfig.sectTarifsTitre);
  set('sect-tarifs-sous', siteConfig.sectTarifsSous);
  set('sect-tarifs-prix', siteConfig.sectTarifsPrix);
  set('sect-tarifs-badge-label', siteConfig.sectTarifsBadgeLabel);
  set('sect-tarifs-cta', siteConfig.sectTarifsCta);
  chk('sect-cta-visible', siteConfig.sectCtaVisible !== false);
  set('sect-cta-titre', siteConfig.sectCtaTitre);
  set('sect-cta-sous', siteConfig.sectCtaSous);
  set('sect-cta-btn', siteConfig.sectCtaBtn);
  set('sect-cta-note', siteConfig.sectCtaNote);
}

// ── Rendu de tous les éditeurs dynamiques ─────────────────────────────────────
function _rendreToutes() {
  rendreThemes();
  rendreLandingFeatures();
  rendreNavItems();
  rendreNavbarLinks();
  rendreSlidesEditor();
  rendreTypewriterEditor();
  rendreHeroStatsEditor();
  rendreFonctCardsEditor();
  rendreHowStepsEditor();
}

// ── Toutes les previews ───────────────────────────────────────────────────────
function _previewToutes() {
  previewSite();
  previewCouleurs();
  previewTypo();
  previewLanding();
  previewNav();
  previewNavbar();
  previewSlideshow();
}

// ── Onglets ───────────────────────────────────────────────────────────────────
function ongletSite(onglet) {
  document.querySelectorAll('.site-panel').forEach(p => p.classList.add('hidden'));
  document.querySelectorAll('.site-tab').forEach(t => {
    t.classList.remove('active-site-tab', 'bg-white');
    t.classList.add('bg-gray-100');
  });
  const panel = document.getElementById('site-panel-' + onglet);
  if (panel) panel.classList.remove('hidden');
  const tab = document.getElementById('site-tab-' + onglet);
  if (tab) { tab.classList.add('active-site-tab', 'bg-white'); tab.classList.remove('bg-gray-100'); }
}

// ── THÈMES PRÉDÉFINIS ─────────────────────────────────────────────────────────
function rendreThemes() {
  const cont = document.getElementById('themes-predefinis');
  if (!cont) return;
  cont.innerHTML = THEMES.map((th, i) => `
    <button onclick="appliquerTheme(${i})" title="${th.nom}"
      class="flex flex-col items-center gap-1 p-2 border rounded-lg hover:shadow-md transition-shadow group">
      <div class="flex gap-0.5">
        <div class="w-5 h-5 rounded-l" style="background:${th.sidebar}"></div>
        <div class="w-5 h-5 rounded-r" style="background:${th.primary}"></div>
      </div>
      <span class="text-xs text-gray-500 group-hover:text-gray-700">${th.nom}</span>
    </button>`).join('');
}

function appliquerTheme(idx) {
  const th = THEMES[idx];
  if (!th) return;
  const colors = { primary: th.primary, sidebar: th.sidebar, accent: th.accent, text: th.text, bg: th.bg };
  Object.entries(colors).forEach(([k, v]) => {
    const key = 'color' + k.charAt(0).toUpperCase() + k.slice(1);
    siteConfig[key] = v;
    const el = document.getElementById('site-color-' + k); if (el) el.value = v;
    const hex = document.getElementById('site-color-' + k + '-hex'); if (hex) hex.value = v;
  });
  _previewToutes();
  afficherMessage(`Thème "${th.nom}" appliqué — cliquez Appliquer pour sauvegarder`, 'info');
}

// ── IDENTITÉ ─────────────────────────────────────────────────────────────────
function previewSite() {
  const nom    = document.getElementById('site-nom')?.value || siteConfig.nom || 'READI.Fr';
  const texte  = document.getElementById('site-logo-texte')?.value || siteConfig.logoTexte || 'READI';
  const suffix = document.getElementById('site-logo-suffix')?.value || siteConfig.logoSuffix || '.Fr';
  const color  = document.getElementById('site-color-primary')?.value || siteConfig.colorPrimary;
  const accent = document.getElementById('site-color-accent')?.value || siteConfig.colorAccent;
  const slogan = document.getElementById('site-slogan')?.value || siteConfig.slogan || '';
  const el = document.getElementById('prev-nom');
  if (el) el.innerHTML = `<span style="color:${color}">${texte}</span><span style="color:${accent}">${suffix}</span>`;
  const nomEl = document.getElementById('prev-nom-plateforme');
  if (nomEl) nomEl.textContent = nom;
  const sl = document.getElementById('prev-slogan'); if (sl) sl.textContent = slogan;
  const cta = document.getElementById('prev-btn-cta'); if (cta) cta.style.background = color;
}

function previewLogo(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    const prev = document.getElementById('site-logo-preview');
    if (prev) prev.innerHTML = `<img src="${e.target.result}" class="w-full h-full object-contain rounded-lg">`;
    siteConfig.logoUrl = e.target.result;
    previewSite();
  };
  reader.readAsDataURL(file);
}

// ── COULEURS ──────────────────────────────────────────────────────────────────
function previewCouleurs() {
  const g = id => document.getElementById(id)?.value;
  const p = g('site-color-primary') || siteConfig.colorPrimary;
  const s = g('site-color-sidebar') || siteConfig.colorSidebar;
  const a = g('site-color-accent')  || siteConfig.colorAccent;
  const t = g('site-color-text')    || siteConfig.colorText;
  const b = g('site-color-bg')      || siteConfig.colorBg;
  const set = (id, prop, val) => { const el = document.getElementById(id); if (el) el.style[prop] = val; };
  set('prev-sidebar-bg',   'background', s);
  set('prev-sidebar-logo', 'color',      a);
  set('prev-menu-active',  'background', p);
  set('prev-main-bg',      'background', b);
  set('prev-heading',      'background', t);
  set('prev-card1',        'background', p);
  set('prev-btn',          'background', p);
  set('prev-badge',        'color',      p);
  set('prev-badge',        'borderColor',p);
  // Sync hex
  [['primary','p'],[p,'primary'],['sidebar','s'],[s,'sidebar'],['accent','a'],[a,'accent'],['text','t'],[t,'text'],['bg','b'],[b,'bg']].forEach(() => {});
  [['primary',p],['sidebar',s],['accent',a],['text',t],['bg',b]].forEach(([k, v]) => {
    const hex = document.getElementById('site-color-' + k + '-hex'); if (hex) hex.value = v;
  });
  previewSite();
}

function syncColorPicker(type) {
  const hex = document.getElementById('site-color-' + type + '-hex')?.value;
  if (hex && /^#[0-9A-Fa-f]{6}$/.test(hex)) {
    const picker = document.getElementById('site-color-' + type);
    if (picker) picker.value = hex;
    previewCouleurs();
  }
}

// ── TYPOGRAPHIE ───────────────────────────────────────────────────────────────
function previewTypo() {
  const font  = document.getElementById('site-font')?.value || siteConfig.font;
  const size  = document.getElementById('site-font-size')?.value || siteConfig.fontSize;
  const lh    = document.getElementById('site-line-height')?.value || siteConfig.lineHeight;
  const rad   = document.getElementById('site-radius')?.value || siteConfig.radius;
  const color = document.getElementById('site-color-primary')?.value || siteConfig.colorPrimary;
  ['prev-typo-h2','prev-typo-h3','prev-typo-p'].forEach(id => {
    const el = document.getElementById(id);
    if (el) { el.style.fontFamily = font; el.style.lineHeight = lh; }
  });
  const btn = document.getElementById('prev-typo-btn');
  if (btn) { btn.style.fontFamily = font; btn.style.fontSize = size + 'px'; btn.style.borderRadius = rad; btn.style.background = color; }
  const inp = document.getElementById('prev-typo-input');
  if (inp) { inp.style.fontFamily = font; inp.style.fontSize = size + 'px'; inp.style.borderRadius = rad; }
  const bv = document.getElementById('typo-base-val'); if (bv) bv.textContent = size;
  const lv = document.getElementById('typo-line-val'); if (lv) lv.textContent = parseFloat(lh).toFixed(1);
}

// ── LANDING (onglet Page d'accueil) ──────────────────────────────────────────
function previewLanding() {
  const titre   = document.getElementById('land-hero-titre')?.value || siteConfig.landHeroTitre;
  const sous    = document.getElementById('land-hero-sous')?.value  || siteConfig.landHeroSous;
  const cta1    = document.getElementById('land-cta1')?.value       || siteConfig.landCta1;
  const cta2    = document.getElementById('land-cta2')?.value       || siteConfig.landCta2;
  const primary = document.getElementById('site-color-primary')?.value || siteConfig.colorPrimary;
  const sidebar = document.getElementById('site-color-sidebar')?.value || siteConfig.colorSidebar;
  const set = (id, txt) => { const el = document.getElementById(id); if (el) el.textContent = txt; };
  set('prev-land-titre', titre); set('prev-land-sous', sous);
  set('prev-land-cta1', cta1);  set('prev-land-cta2', cta2);
  const hero = document.getElementById('prev-land-hero-bg');
  if (hero) hero.style.background = `linear-gradient(135deg,${sidebar} 0%,${primary} 100%)`;
  const c1 = document.getElementById('prev-land-cta1'); if (c1) c1.style.color = primary;
  rendrePrevFeatures();
}

// ── FEATURES landing (onglet Page d'accueil) ──────────────────────────────────
function rendreLandingFeatures() {
  const cont = document.getElementById('landing-features');
  if (!cont) return;
  cont.innerHTML = (siteConfig.landFeatures || []).map((f, i) => `
    <div class="flex items-start gap-3 bg-gray-50 border rounded-lg p-3">
      <div class="flex flex-col gap-1 items-center">
        <select class="border rounded p-1 text-xs" onchange="editFeature(${i},'icone',this.value)">
          ${['fa-cube','fa-calculator','fa-bar-chart','fa-users','fa-star','fa-bolt','fa-heart','fa-shield','fa-globe','fa-mobile'].map(ic =>
            `<option value="${ic}" ${f.icone===ic?'selected':''}>${ic.replace('fa-','')}</option>`).join('')}
        </select>
        <i class="fa ${f.icone} text-primary text-xl mt-1" style="color:${siteConfig.colorPrimary}"></i>
      </div>
      <div class="flex-1 space-y-1">
        <input type="text" value="${f.titre}" placeholder="Titre" class="w-full border p-1.5 rounded text-sm font-medium" oninput="editFeature(${i},'titre',this.value)">
        <input type="text" value="${f.desc}"  placeholder="Description" class="w-full border p-1.5 rounded text-xs text-gray-500" oninput="editFeature(${i},'desc',this.value)">
      </div>
      <button onclick="supprimerFeature(${i})" class="text-red-400 hover:text-red-600 text-xs mt-1"><i class="fa fa-trash"></i></button>
    </div>`).join('');
}

function rendrePrevFeatures() {
  const cont = document.getElementById('prev-land-features');
  if (!cont) return;
  const primary = document.getElementById('site-color-primary')?.value || siteConfig.colorPrimary;
  cont.innerHTML = (siteConfig.landFeatures || []).map(f => `
    <div class="text-center p-2 border rounded-lg bg-white">
      <i class="fa ${f.icone} text-lg mb-1 block" style="color:${primary}"></i>
      <div class="font-semibold text-xs">${f.titre}</div>
      <div class="text-gray-400 text-xs">${f.desc}</div>
    </div>`).join('');
}

function editFeature(idx, champ, val) {
  if (!siteConfig.landFeatures[idx]) return;
  siteConfig.landFeatures[idx][champ] = val;
  if (champ === 'icone') rendreLandingFeatures();
  rendrePrevFeatures();
}
function ajouterFeature() {
  siteConfig.landFeatures = siteConfig.landFeatures || [];
  siteConfig.landFeatures.push({ icone: 'fa-star', titre: 'Nouveau point fort', desc: 'Description...' });
  rendreLandingFeatures(); rendrePrevFeatures();
}
function supprimerFeature(idx) {
  siteConfig.landFeatures.splice(idx, 1);
  rendreLandingFeatures(); rendrePrevFeatures();
}

// ── NAVIGATION APP (sidebar) ──────────────────────────────────────────────────
function rendreNavItems() {
  const cont = document.getElementById('nav-items');
  if (!cont) return;
  cont.innerHTML = (siteConfig.navItems || []).map((item, i) => `
    <div class="flex items-center gap-2 bg-gray-50 border rounded-lg px-3 py-2">
      <input type="checkbox" ${item.visible ? 'checked' : ''} onchange="toggleNavItem(${i},this.checked)" class="rounded">
      <i class="fa ${item.icone} text-gray-400 w-4 text-center text-sm"></i>
      <input type="text" value="${item.label}" class="flex-1 text-sm bg-transparent focus:outline-none border-b border-transparent focus:border-gray-300" oninput="editNavItem(${i},this.value)">
      <span class="text-xs text-gray-400 font-mono">${item.section}</span>
    </div>`).join('');
}
function toggleNavItem(idx, visible) {
  if (siteConfig.navItems[idx]) siteConfig.navItems[idx].visible = visible;
  previewNav();
}
function editNavItem(idx, label) {
  if (siteConfig.navItems[idx]) siteConfig.navItems[idx].label = label;
  previewNav();
}
function previewNav() {
  const sidebar = document.getElementById('site-color-sidebar')?.value || siteConfig.colorSidebar;
  const accent  = document.getElementById('site-color-accent')?.value  || siteConfig.colorAccent;
  const el = document.getElementById('prev-nav-sidebar');
  if (el) el.style.background = sidebar;
  const logo = el?.querySelector('.font-bold');
  if (logo) logo.style.color = accent;
  const cont = document.getElementById('prev-nav-items');
  if (!cont) return;
  cont.innerHTML = (siteConfig.navItems || []).filter(i => i.visible).map(i =>
    `<div class="flex items-center gap-1.5 px-2 py-1 rounded text-white opacity-70 text-xs">
      <i class="fa ${i.icone} w-4 text-center"></i><span>${i.label}</span>
    </div>`
  ).join('');
}

// ── FOOTER ────────────────────────────────────────────────────────────────────
function previewFooter() {
  const copy = document.getElementById('footer-copyright')?.value || siteConfig.footerCopyright;
  const fb   = document.getElementById('footer-facebook')?.value || '';
  const tw   = document.getElementById('footer-twitter')?.value || '';
  const ig   = document.getElementById('footer-instagram')?.value || '';
  const li   = document.getElementById('footer-linkedin')?.value || '';
  const copyEl = document.getElementById('prev-footer-copy'); if (copyEl) copyEl.textContent = copy;
  const socEl  = document.getElementById('prev-footer-social');
  if (socEl) {
    const links = [['fa-facebook',fb],['fa-twitter',tw],['fa-instagram',ig],['fa-linkedin',li]]
      .filter(([,url]) => url).map(([ic,url]) => `<a href="${url}" target="_blank" class="text-gray-400 hover:text-white"><i class="fa ${ic}"></i></a>`).join('');
    socEl.innerHTML = links || '<span class="text-gray-600 text-xs">Aucun réseau</span>';
  }
}

// ── NAVBAR LANDING ────────────────────────────────────────────────────────────
function rendreNavbarLinks() {
  const cont = document.getElementById('navbar-links');
  if (!cont) return;
  cont.innerHTML = (siteConfig.navbarLinks || []).map((l, i) => `
    <div class="flex items-center gap-2 bg-gray-50 border rounded-lg px-3 py-2">
      <input type="text" value="${l.label}" placeholder="Label" class="flex-1 text-sm bg-transparent focus:outline-none border-b border-transparent focus:border-gray-300" oninput="editNavbarLink(${i},'label',this.value)">
      <input type="text" value="${l.href}" placeholder="#section" class="w-28 text-xs text-gray-400 bg-transparent focus:outline-none font-mono border-b border-transparent focus:border-gray-300" oninput="editNavbarLink(${i},'href',this.value)">
      <button onclick="supprimerNavbarLink(${i})" class="text-red-400 hover:text-red-600 text-xs"><i class="fa fa-trash"></i></button>
    </div>`).join('');
}
function editNavbarLink(idx, champ, val) {
  if (siteConfig.navbarLinks[idx]) siteConfig.navbarLinks[idx][champ] = val;
  previewNavbar();
}
function supprimerNavbarLink(idx) {
  siteConfig.navbarLinks.splice(idx, 1);
  rendreNavbarLinks(); previewNavbar();
}
function ajouterLienNavbar() {
  siteConfig.navbarLinks = siteConfig.navbarLinks || [];
  siteConfig.navbarLinks.push({ label: 'Nouveau lien', href: '#section' });
  rendreNavbarLinks(); previewNavbar();
}
function previewNavbar() {
  const connexion = document.getElementById('nav-btn-connexion')?.value || siteConfig.navbarBtnConnexion;
  const cta       = document.getElementById('nav-btn-cta')?.value       || siteConfig.navbarBtnCta;
  const primary   = document.getElementById('site-color-primary')?.value || siteConfig.colorPrimary;
  const sidebar   = document.getElementById('site-color-sidebar')?.value || siteConfig.colorSidebar;
  const elConn = document.getElementById('prev-nav-connexion');
  if (elConn) elConn.textContent = connexion;
  const elCta = document.getElementById('prev-nav-cta');
  if (elCta) { elCta.textContent = cta; elCta.style.color = primary; }
  const bg = document.getElementById('prev-navbar-bg');
  if (bg) bg.style.background = `linear-gradient(135deg,${sidebar},${primary})`;
  const linksEl = document.getElementById('prev-navbar-links');
  if (linksEl) linksEl.innerHTML = (siteConfig.navbarLinks || []).map(l => `<span>${l.label}</span>`).join('');
}

// ── SLIDESHOW ─────────────────────────────────────────────────────────────────
function rendreSlidesEditor() {
  const cont = document.getElementById('slides-editor');
  if (!cont) return;
  if (!siteConfig.slides || siteConfig.slides.length === 0) {
    cont.innerHTML = '<p class="text-xs text-gray-400 text-center py-2">Aucune slide. Cliquez + Ajouter.</p>';
    return;
  }
  cont.innerHTML = (siteConfig.slides).map((s, i) => {
    const bg = s.imageUrl ? `url(${s.imageUrl}) center/cover no-repeat` : s.gradient;
    return `
    <div class="border rounded-xl p-3 mb-2 bg-white shadow-sm">
      <div class="flex items-center gap-3 mb-2">
        <div class="w-14 h-10 rounded flex-shrink-0 border" style="background:${bg}"></div>
        <span class="text-xs font-semibold text-gray-600">Slide ${i+1}</span>
        <button onclick="supprimerSlide(${i})" class="ml-auto text-red-400 hover:text-red-600 text-xs px-2"><i class="fa fa-trash"></i> Supprimer</button>
      </div>
      <!-- Image -->
      <div class="mb-2">
        <label class="block text-xs text-gray-500 mb-1"><i class="fa fa-image mr-1"></i>Image (URL)</label>
        <div class="flex gap-2">
          <input type="text" value="${s.imageUrl || ''}" placeholder="https://... ou laisser vide pour dégradé"
            class="flex-1 border p-1.5 rounded text-xs font-mono" oninput="editSlideImageUrl(${i},this.value)">
          <button onclick="document.getElementById('slide-file-${i}').click()"
            class="px-2 py-1 border rounded text-xs hover:bg-gray-50" title="Choisir fichier local">
            <i class="fa fa-folder-open"></i>
          </button>
          <input type="file" id="slide-file-${i}" accept="image/*" class="hidden" onchange="editSlideFile(${i},this)">
        </div>
        <!-- Zone drag & drop -->
        <div class="mt-1 border-2 border-dashed border-gray-200 rounded-lg p-2 text-center text-xs text-gray-400 hover:border-primary transition-colors cursor-pointer"
          ondragover="event.preventDefault();this.classList.add('border-primary')"
          ondragleave="this.classList.remove('border-primary')"
          ondrop="dropSlideImage(event,${i});this.classList.remove('border-primary')"
          onclick="document.getElementById('slide-file-${i}').click()">
          <i class="fa fa-cloud-upload mr-1"></i>Glisser-déposer ou cliquer pour choisir une image
        </div>
      </div>
      <!-- Dégradé -->
      <div>
        <label class="block text-xs text-gray-500 mb-1"><i class="fa fa-paint-brush mr-1"></i>Dégradé CSS (si pas d'image)</label>
        <div class="flex items-center gap-2">
          <input type="text" value="${s.gradient}" placeholder="linear-gradient(...)"
            class="flex-1 border p-1 rounded text-xs font-mono" oninput="editSlide(${i},'gradient',this.value)">
          <input type="color" value="#165DFF" class="w-8 h-7 cursor-pointer rounded border flex-shrink-0"
            title="Couleur rapide" oninput="editSlideColor(${i},this.value)">
        </div>
      </div>
    </div>`;
  }).join('');
}

function editSlide(idx, champ, val) {
  if (siteConfig.slides[idx]) { siteConfig.slides[idx][champ] = val; rendreSlidesEditor(); previewSlideshow(); }
}
function editSlideImageUrl(idx, url) {
  if (siteConfig.slides[idx]) { siteConfig.slides[idx].imageUrl = url; rendreSlidesEditor(); previewSlideshow(); }
}
function editSlideFile(idx, input) {
  const file = input.files[0]; if (!file) return;
  const reader = new FileReader();
  reader.onload = e => { editSlideImageUrl(idx, e.target.result); };
  reader.readAsDataURL(file);
}
function dropSlideImage(event, idx) {
  event.preventDefault();
  const file = event.dataTransfer.files[0];
  if (!file || !file.type.startsWith('image/')) return;
  const reader = new FileReader();
  reader.onload = e => { editSlideImageUrl(idx, e.target.result); };
  reader.readAsDataURL(file);
}
function editSlideColor(idx, color) {
  if (siteConfig.slides[idx]) {
    siteConfig.slides[idx].gradient = `linear-gradient(135deg,${color}cc 0%,${color} 100%)`;
    siteConfig.slides[idx].imageUrl = '';
    rendreSlidesEditor(); previewSlideshow();
  }
}
function supprimerSlide(idx) {
  if (siteConfig.slides.length <= 1) { afficherMessage('Minimum 1 slide requis', 'warning'); return; }
  siteConfig.slides.splice(idx, 1);
  rendreSlidesEditor(); previewSlideshow();
}
function ajouterSlide() {
  siteConfig.slides.push({ gradient: 'linear-gradient(135deg,#1e3a5f 0%,#3B82F6 100%)', imageUrl: '' });
  rendreSlidesEditor(); previewSlideshow();
}

function rendreTypewriterEditor() {
  const cont = document.getElementById('typewriter-phrases');
  if (!cont) return;
  if (!siteConfig.typewriterPhrases || siteConfig.typewriterPhrases.length === 0) {
    cont.innerHTML = '<p class="text-xs text-gray-400 text-center py-2">Aucune phrase. Cliquez + Ajouter.</p>';
    return;
  }
  cont.innerHTML = (siteConfig.typewriterPhrases).map((p, i) => `
    <div class="flex items-center gap-2">
      <span class="text-xs text-gray-400 font-mono w-5 text-center">${i+1}</span>
      <input type="text" value="${p}" class="flex-1 border p-2 rounded-lg text-sm"
        oninput="editPhrase(${i},this.value)" placeholder="Phrase d'animation...">
      <button onclick="supprimerPhrase(${i})" class="text-red-400 hover:text-red-600 text-xs px-2" title="Supprimer">
        <i class="fa fa-trash"></i>
      </button>
    </div>`).join('');
}
function editPhrase(idx, val) {
  if (siteConfig.typewriterPhrases[idx] !== undefined) { siteConfig.typewriterPhrases[idx] = val; previewSlideshow(); }
}
function supprimerPhrase(idx) {
  siteConfig.typewriterPhrases.splice(idx, 1);
  rendreTypewriterEditor(); previewSlideshow();
}
function ajouterPhrase() {
  siteConfig.typewriterPhrases = siteConfig.typewriterPhrases || [];
  siteConfig.typewriterPhrases.push('Nouvelle phrase...');
  rendreTypewriterEditor(); previewSlideshow();
}

function rendreHeroStatsEditor() {
  const cont = document.getElementById('hero-stats-editor');
  if (!cont) return;
  if (!siteConfig.heroStats || siteConfig.heroStats.length === 0) {
    cont.innerHTML = '<p class="text-xs text-gray-400 text-center py-2">Aucune stat. Cliquez + Ajouter.</p>';
    return;
  }
  cont.innerHTML = (siteConfig.heroStats).map((s, i) => `
    <div class="flex items-center gap-2 bg-gray-50 border rounded-lg px-3 py-2">
      <input type="text" value="${s.valeur}" placeholder="Valeur" class="w-20 border p-1.5 rounded text-sm font-bold text-center"
        oninput="editStat(${i},'valeur',this.value)">
      <input type="text" value="${s.label}" placeholder="Label" class="flex-1 border p-1.5 rounded text-sm"
        oninput="editStat(${i},'label',this.value)">
      <button onclick="supprimerStat(${i})" class="text-red-400 hover:text-red-600 text-xs"><i class="fa fa-trash"></i></button>
    </div>`).join('');
}
function editStat(idx, champ, val) {
  if (siteConfig.heroStats[idx]) { siteConfig.heroStats[idx][champ] = val; previewSlideshow(); }
}
function supprimerStat(idx) {
  siteConfig.heroStats.splice(idx, 1);
  rendreHeroStatsEditor(); previewSlideshow();
}
function ajouterStat() {
  siteConfig.heroStats = siteConfig.heroStats || [];
  siteConfig.heroStats.push({ valeur: '+0', label: 'Nouveau' });
  rendreHeroStatsEditor(); previewSlideshow();
}

function previewSlideshow() {
  const slide0 = siteConfig.slides?.[0];
  const bg = document.getElementById('prev-slide-bg');
  if (bg && slide0) {
    bg.style.background = slide0.imageUrl
      ? `url(${slide0.imageUrl}) center/cover no-repeat`
      : slide0.gradient;
  }
  const tw = document.getElementById('prev-slide-typewriter');
  if (tw) tw.textContent = siteConfig.typewriterPhrases?.[0] || '';
  const c1 = document.getElementById('prev-slide-cta1');
  if (c1) c1.textContent = document.getElementById('land-cta1')?.value || siteConfig.landCta1;
  const c2 = document.getElementById('prev-slide-cta2');
  if (c2) c2.textContent = document.getElementById('land-cta2')?.value || siteConfig.landCta2;
  // Dots
  const dotsEl = document.getElementById('prev-slide-dots');
  if (dotsEl) {
    const show = document.getElementById('slide-show-dots')?.checked ?? siteConfig.slideShowDots;
    dotsEl.style.display = show ? 'flex' : 'none';
    dotsEl.innerHTML = (siteConfig.slides || []).map((_, i) =>
      `<div class="w-2 h-2 rounded-full ${i===0?'bg-white':'bg-white/40'}"></div>`).join('');
  }
  // Stats
  const statsEl = document.getElementById('prev-slide-stats');
  if (statsEl) {
    const show = document.getElementById('slide-show-stats')?.checked ?? siteConfig.slideShowStats;
    statsEl.style.display = show ? 'flex' : 'none';
    statsEl.innerHTML = (siteConfig.heroStats || []).map(s =>
      `<div class="text-white text-center text-xs"><div class="font-black">${s.valeur}</div><div class="opacity-50">${s.label}</div></div>`).join('');
  }
}

// ── SECTIONS LANDING ──────────────────────────────────────────────────────────
let dragIndex = null;

function rendreFonctCardsEditor() {
  const cont = document.getElementById('fonct-cards-editor');
  if (!cont) return;
  if (!siteConfig.fonctCards || siteConfig.fonctCards.length === 0) {
    cont.innerHTML = '<p class="text-xs text-gray-400 text-center py-2">Aucune carte.</p>';
    return;
  }
  cont.innerHTML = (siteConfig.fonctCards).map((c, i) => `
    <div class="border rounded-xl p-3 mb-2 bg-gray-50 draggable-item cursor-move"
      draggable="true" data-index="${i}"
      ondragstart="handleDragStart(event, 'fonctCards')"
      ondragover="handleDragOver(event)"
      ondragenter="handleDragEnter(event)"
      ondragleave="handleDragLeave(event)"
      ondrop="handleDrop(event, 'fonctCards')">
      <div class="flex items-center gap-2 mb-2">
        <i class="fa fa-grip-vertical text-gray-400"></i>
        <select class="border rounded px-1 py-1 text-xs" onchange="editFonctCard(${i},'icone',this.value)">
          ${['fa-cubes','fa-barcode','fa-calculator','fa-bar-chart','fa-users','fa-mobile','fa-star','fa-globe','fa-shield','fa-bolt'].map(ic =>
            `<option value="${ic}" ${c.icone===ic?'selected':''}>${ic.replace('fa-','')}</option>`).join('')}
        </select>
        <input type="text" value="${c.titre}" placeholder="Titre" class="flex-1 border p-1.5 rounded text-sm font-medium"
          oninput="editFonctCard(${i},'titre',this.value)">
        <button onclick="supprimerFonctCard(${i})" class="text-red-400 hover:text-red-600 text-xs px-1"><i class="fa fa-trash"></i></button>
      </div>
      <input type="text" value="${c.desc}" placeholder="Description" class="w-full border p-1.5 rounded text-xs text-gray-500 mb-2"
        oninput="editFonctCard(${i},'desc',this.value)">
      <div class="space-y-1">
        ${(c.points||[]).map((pt, j) => `
          <div class="flex items-center gap-1">
            <input type="text" value="${pt}" class="flex-1 border p-1 rounded text-xs"
              oninput="editFonctPoint(${i},${j},this.value)">
            <button onclick="supprimerFonctPoint(${i},${j})" class="text-red-400 text-xs px-1"><i class="fa fa-minus"></i></button>
          </div>`).join('')}
      </div>
      <button onclick="ajouterFonctPoint(${i})" class="mt-1 text-xs text-primary hover:underline">
        <i class="fa fa-plus mr-1"></i>Ajouter un point
      </button>
    </div>`).join('');
}

function handleDragStart(e, type) {
  dragIndex = parseInt(e.target.closest('.draggable-item').dataset.index);
  e.target.closest('.draggable-item').classList.add('opacity-50', 'border-primary');
  e.dataTransfer.setData('text/plain', dragIndex.toString());
}

function handleDragOver(e) {
  e.preventDefault();
}

function handleDragEnter(e) {
  e.preventDefault();
  const el = e.target.closest('.draggable-item');
  if (el) el.classList.add('border-dashed', 'border-primary');
}

function handleDragLeave(e) {
  const el = e.target.closest('.draggable-item');
  if (el) el.classList.remove('border-dashed', 'border-primary');
}

function handleDrop(e, type) {
  e.preventDefault();
  const dropIndex = parseInt(e.target.closest('.draggable-item').dataset.index);
  const allItems = document.querySelectorAll('.draggable-item');
  allItems.forEach(el => el.classList.remove('opacity-50', 'border-primary', 'border-dashed'));

  if (dragIndex !== dropIndex) {
    const array = siteConfig[type];
    const movedItem = array.splice(dragIndex, 1)[0];
    array.splice(dropIndex, 0, movedItem);

    if (type === 'fonctCards') rendreFonctCardsEditor();
    if (type === 'howSteps') rendreHowStepsEditor();
  }
  dragIndex = null;
}
function editFonctCard(idx, champ, val) {
  if (siteConfig.fonctCards[idx]) {
    siteConfig.fonctCards[idx][champ] = val;
    if (champ === 'icone') rendreFonctCardsEditor();
  }
}
function supprimerFonctCard(idx) { siteConfig.fonctCards.splice(idx, 1); rendreFonctCardsEditor(); }
function ajouterCartefonct() {
  siteConfig.fonctCards = siteConfig.fonctCards || [];
  siteConfig.fonctCards.push({ icone: 'fa-star', titre: 'Nouvelle fonctionnalité', desc: 'Description...', points: [] });
  rendreFonctCardsEditor();
}
function editFonctPoint(ci, pi, val) {
  if (siteConfig.fonctCards[ci]?.points[pi] !== undefined) siteConfig.fonctCards[ci].points[pi] = val;
}
function supprimerFonctPoint(ci, pi) {
  siteConfig.fonctCards[ci]?.points.splice(pi, 1);
  rendreFonctCardsEditor();
}
function ajouterFonctPoint(ci) {
  if (siteConfig.fonctCards[ci]) { siteConfig.fonctCards[ci].points = siteConfig.fonctCards[ci].points || []; siteConfig.fonctCards[ci].points.push('Nouveau point'); rendreFonctCardsEditor(); }
}

function rendreHowStepsEditor() {
  const cont = document.getElementById('how-steps-editor');
  if (!cont) return;
  if (!siteConfig.howSteps || siteConfig.howSteps.length === 0) {
    cont.innerHTML = '<p class="text-xs text-gray-400 text-center py-2">Aucune étape.</p>';
    return;
  }
  cont.innerHTML = (siteConfig.howSteps).map((s, i) => `
    <div class="flex items-start gap-2 bg-gray-50 border rounded-lg px-3 py-2 draggable-item cursor-move"
      draggable="true" data-index="${i}"
      ondragstart="handleDragStart(event, 'howSteps')"
      ondragover="handleDragOver(event)"
      ondragenter="handleDragEnter(event)"
      ondragleave="handleDragLeave(event)"
      ondrop="handleDrop(event, 'howSteps')">
      <i class="fa fa-grip-vertical text-gray-400 mt-2"></i>
      <div class="w-7 h-7 rounded-full bg-primary text-white text-xs font-black flex items-center justify-center flex-shrink-0 mt-1"
        style="background:${siteConfig.colorPrimary}">${i+1}</div>
      <div class="flex-1 space-y-1">
        <input type="text" value="${s.titre}" placeholder="Titre étape" class="w-full border p-1.5 rounded text-sm font-medium"
          oninput="editStep(${i},'titre',this.value)">
        <textarea rows="2" class="w-full border p-1.5 rounded text-xs text-gray-500 resize-none"
          oninput="editStep(${i},'desc',this.value)">${s.desc}</textarea>
      </div>
      <button onclick="supprimerStep(${i})" class="text-red-400 hover:text-red-600 text-xs mt-1"><i class="fa fa-trash"></i></button>
    </div>`).join('');
}
function editStep(idx, champ, val) { if (siteConfig.howSteps[idx]) siteConfig.howSteps[idx][champ] = val; }
function supprimerStep(idx) { siteConfig.howSteps.splice(idx, 1); rendreHowStepsEditor(); }
function ajouterStep() {
  siteConfig.howSteps = siteConfig.howSteps || [];
  siteConfig.howSteps.push({ titre: 'Nouvelle étape', desc: 'Description...' });
  rendreHowStepsEditor();
}

// ── SAUVEGARDE ────────────────────────────────────────────────────────────────
async function sauvegarderSite() {
  const get  = id => document.getElementById(id)?.value ?? '';
  const getN = id => parseFloat(document.getElementById(id)?.value) || 0;
  const getI = id => parseInt(document.getElementById(id)?.value) || 0;
  const getC = id => document.getElementById(id)?.checked ?? false;

  // Update form fields, keep existing array/object fields (heroStats, slides, etc.)
  Object.assign(siteConfig, {
    // Identité
    nom: get('site-nom'), slogan: get('site-slogan'),
    email: get('site-email'), tel: get('site-tel'),
    logoTexte: get('site-logo-texte'), logoSuffix: get('site-logo-suffix'),
    logoUrl: siteConfig.logoUrl, // Preserve existing logoUrl
    // Couleurs
    colorPrimary: get('site-color-primary'), colorSidebar: get('site-color-sidebar'),
    colorAccent: get('site-color-accent'), colorText: get('site-color-text'), colorBg: get('site-color-bg'),
    // Typo
    font: get('site-font'), fontSize: getI('site-font-size') || 14,
    lineHeight: getN('site-line-height') || 1.5, radius: get('site-radius'),
    // Landing
    landHeroTitre: get('land-hero-titre'), landHeroSous: get('land-hero-sous'),
    landCta1: get('land-cta1'), landCta2: get('land-cta2'),
    landFinalTitre: get('land-final-titre'), landFinalCta: get('land-final-cta'),
    // Nav app
    navShowLogo: getC('nav-show-logo'), navSidebarCollapsed: getC('nav-sidebar-collapsed'),
    // Footer
    footerCopyright: get('footer-copyright'), footerMentions: get('footer-mentions'),
    footerCgu: get('footer-cgu'), footerPrivacy: get('footer-privacy'),
    footerFacebook: get('footer-facebook'), footerTwitter: get('footer-twitter'),
    footerInstagram: get('footer-instagram'), footerLinkedin: get('footer-linkedin'),
    // Pages légales
    pageMentions: get('page-mentions'), pageCgu: get('page-cgu'), pagePrivacy: get('page-privacy'),
    // Navbar landing
    navbarBtnConnexion: get('nav-btn-connexion'), navbarBtnCta: get('nav-btn-cta'),
    navbarBgColor: get('navbar-bg-color'),
    navbarShowLogo: getC('navbar-show-logo'), navbarSticky: getC('navbar-sticky'),
    // Slideshow
    slideSpeed: getI('slide-speed') || 5000,
    slideAutoplay: getC('slide-autoplay'), slideShowDots: getC('slide-show-dots'), slideShowStats: getC('slide-show-stats'),
    // Sections
    sectFonctVisible: getC('sect-fonct-visible'), sectFonctBadge: get('sect-fonct-badge'),
    sectFonctTitre: get('sect-fonct-titre'), sectFonctSous: get('sect-fonct-sous'),
    sectHowVisible: getC('sect-how-visible'), sectHowBadge: get('sect-how-badge'), sectHowTitre: get('sect-how-titre'),
    sectTarifsVisible: getC('sect-tarifs-visible'), sectTarifsBadge: get('sect-tarifs-badge'),
    sectTarifsTitre: get('sect-tarifs-titre'), sectTarifsSous: get('sect-tarifs-sous'),
    sectTarifsPrix: get('sect-tarifs-prix'), sectTarifsBadgeLabel: get('sect-tarifs-badge-label'), sectTarifsCta: get('sect-tarifs-cta'),
    sectCtaVisible: getC('sect-cta-visible'), sectCtaTitre: get('sect-cta-titre'),
    sectCtaSous: get('sect-cta-sous'), sectCtaBtn: get('sect-cta-btn'), sectCtaNote: get('sect-cta-note')
  });

  try {
    await apiFetch('/admin/config', {
      method: 'PATCH',
      body: JSON.stringify({ site_config_json: JSON.stringify(siteConfig) })
    });
    appliquerSiteEnDirect(siteConfig);
    afficherMessage('✅ Réglages sauvegardés en base de données', 'success');
  } catch (e) {
    console.error('[reglage-site] Erreur sauvegarde', e);
    afficherMessage('❌ Erreur lors de la sauvegarde', 'danger');
  }
}

// ── APPLICATION EN DIRECT ─────────────────────────────────────────────────────
function appliquerSiteEnDirect(cfg) {
  document.documentElement.style.setProperty('--color-primary', cfg.colorPrimary);
  if (cfg.font) document.body.style.fontFamily = cfg.font;
  if (cfg.fontSize) document.body.style.fontSize = cfg.fontSize + 'px';
  const h1 = document.querySelector('aside h1');
  if (h1) h1.innerHTML = `<span style="color:${cfg.colorPrimary}">${cfg.logoTexte}</span><span style="color:${cfg.colorAccent}">${cfg.logoSuffix}</span>`;
  const main = document.querySelector('#interface-principale');
  if (main) main.style.background = cfg.colorBg;
  const aside = document.querySelector('aside');
  if (aside) aside.style.background = cfg.colorSidebar;
  if (cfg.navItems) {
    cfg.navItems.forEach(item => {
      const el = document.querySelector(`[data-section="${item.section}"]`);
      if (el) { el.style.display = item.visible ? '' : 'none'; }
    });
  }
}

// ── RÉINITIALISATION ──────────────────────────────────────────────────────────
async function reinitialiserSite() {
  if (!confirm('Réinitialiser tous les réglages aux valeurs par défaut ?')) return;
  siteConfig = { ...SITE_DEFAULTS };
  try {
    await apiFetch('/admin/config', {
      method: 'PATCH',
      body: JSON.stringify({ site_config_json: null })
    });
  } catch (e) { console.warn('[reglage-site] Erreur réinit BDD', e); }
  _remplirFormulaires();
  _rendreToutes();
  _previewToutes();
  appliquerSiteEnDirect(siteConfig);
  afficherMessage('Réglages réinitialisés aux valeurs par défaut', 'info');
}

// ── AUTO-APPLY AU DÉMARRAGE (depuis BDD, non bloquant) ───────────────────────
(function() {
  if (typeof apiFetch === 'function') {
    apiFetch('/admin/config').then(data => {
      if (data && data.site_config_json) {
        try {
          const saved = typeof data.site_config_json === 'string'
            ? JSON.parse(data.site_config_json)
            : data.site_config_json;
          appliquerSiteEnDirect({ ...SITE_DEFAULTS, ...saved });
        } catch(e) {}
      }
    }).catch(() => {});
  }
})();
