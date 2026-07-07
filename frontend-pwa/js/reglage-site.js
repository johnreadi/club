// ── Réglage Site ──────────────────────────────────────────────────────────────
const SITE_DEFAULTS = {
  nom: 'READI.Fr', slogan: 'La gestion de club simplifiée',
  email: 'contact@readi.fr', tel: '',
  logoTexte: 'READI', logoSuffix: '.Fr',
  colorPrimary: '#3B82F6', colorSidebar: '#1e3a5f',
  colorAccent: '#60A5FA', colorText: '#1f2937', colorBg: '#f8fafc',
  font: 'Inter, sans-serif', fontSize: 14, lineHeight: 1.5, radius: '8px',
  landHeroTitre: 'Gérez votre club comme un pro',
  landHeroSous: 'La solution tout-en-un pour gérer votre stock, votre caisse et vos membres.',
  landCta1: 'Commencer gratuitement', landCta2: 'Voir la démo',
  landFinalTitre: 'Prêt à booster votre club ?', landFinalCta: 'Créer mon espace gratuit',
  landFeatures: [
    { icone: 'fa-cube',       titre: 'Gestion du stock',   desc: 'Suivez vos produits en temps réel' },
    { icone: 'fa-calculator', titre: 'Caisse intégrée',    desc: 'Encaissez rapidement et simplement' },
    { icone: 'fa-bar-chart',  titre: 'Rapports détaillés', desc: 'Analysez vos performances' }
  ],
  navItems: [
    { section: 'accueil',      label: 'Tableau de bord', icone: 'fa-home',        visible: true },
    { section: 'stock',        label: 'Stock & Étiquettes', icone: 'fa-cube',     visible: true },
    { section: 'caisse',       label: 'Caisse & Ventes', icone: 'fa-calculator',  visible: true },
    { section: 'inventaire',   label: 'Inventaire',      icone: 'fa-list-alt',    visible: true },
    { section: 'rapports',     label: 'Rapports',        icone: 'fa-bar-chart',   visible: true },
    { section: 'utilisateurs', label: 'Utilisateurs',    icone: 'fa-users',       visible: true },
    { section: 'parametres',   label: 'Paramètres',      icone: 'fa-sliders',     visible: true }
  ],
  navShowLogo: true, navSidebarCollapsed: false,
  footerCopyright: '\u00a9 2026 READI.Fr \u2014 Tous droits r\u00e9serv\u00e9s',
  footerMentions: '', footerCgu: '', footerPrivacy: '',
  footerFacebook: '', footerTwitter: '', footerInstagram: '', footerLinkedin: '',
  // Navbar landing
  navbarBtnConnexion: 'Connexion', navbarBtnCta: 'Essai gratuit',
  navbarBgColor: '#ffffff', navbarShowLogo: true, navbarSticky: true,
  navbarLinks: [
    { label: 'Fonctionnalit\u00e9s', href: '#fonctionnalites' },
    { label: 'Comment \u00e7a marche', href: '#comment-ca-marche' },
    { label: 'Tarifs', href: '#tarifs' }
  ],
  // Slideshow
  slideSpeed: 5000, slideAutoplay: true, slideShowDots: true, slideShowStats: true,
  slides: [
    { gradient: 'linear-gradient(135deg,#0f2d6b 0%,#165DFF 55%,#0ea5e9 100%)' },
    { gradient: 'linear-gradient(135deg,#1a1a2e 0%,#16213e 40%,#0f3460 100%)' },
    { gradient: 'linear-gradient(135deg,#064e3b 0%,#065f46 45%,#059669 100%)' },
    { gradient: 'linear-gradient(135deg,#4c1d95 0%,#5b21b6 45%,#7c3aed 100%)' }
  ],
  typewriterPhrases: [
    'G\u00e9rez votre stock en temps r\u00e9el.',
    'Cr\u00e9ez vos \u00e9tiquettes avec codes-barres.',
    'Encaissez vos ventes facilement.',
    'Suivez vos performances en un clic.'
  ],
  heroStats: [
    { valeur: '+200', label: 'Clubs' },
    { valeur: '50k+', label: '\u00c9tiquettes' },
    { valeur: '100%', label: 'En ligne' }
  ],
  // Sections landing
  sectFonctVisible: true, sectFonctBadge: 'Tout-en-un',
  sectFonctTitre: 'Tout ce dont votre club a besoin',
  sectFonctSous: 'Une plateforme compl\u00e8te pour professionnaliser la gestion de votre boutique sportive.',
  fonctCards: [
    { icone: 'fa-cubes',      titre: 'Gestion du stock',            desc: 'Ajoutez vos produits, suivez les quantit\u00e9s en temps r\u00e9el.', points: ['Ajout par douchette ou manuel','Cat\u00e9gories personnalis\u00e9es','Alertes de seuil automatiques'] },
    { icone: 'fa-barcode',    titre: '\u00c9tiquettes professionnelles', desc: 'G\u00e9n\u00e9rez et imprimez vos \u00e9tiquettes avec code-barres.', points: ['Code-barres CODE128 int\u00e9gr\u00e9','Personnalisation couleurs','Impression par lot'] },
    { icone: 'fa-calculator', titre: 'Caisse enregistreuse',         desc: 'Encaissez vos ventes, g\u00e9rez le rendu monnaie.', points: ['Recherche produit live','Rendu monnaie automatique','Ticket & facture imprimables'] },
    { icone: 'fa-bar-chart',  titre: 'Rapports & statistiques',      desc: 'Visualisez vos performances de vente \u00e0 tout moment.', points: ['CA mensuel et annuel','Top produits vendus','Export des donn\u00e9es'] },
    { icone: 'fa-users',      titre: 'Multi-utilisateurs',           desc: 'Invitez b\u00e9n\u00e9voles et g\u00e9rants avec des droits configurables.', points: ['R\u00f4les admin / vendeur','Historique par utilisateur','Connexion JWT s\u00e9curis\u00e9e'] },
    { icone: 'fa-mobile',     titre: 'Application mobile (PWA)',     desc: 'Installez l\u2019app sur votre t\u00e9l\u00e9phone sans passer par l\u2019App Store.', points: ['iOS, Android, PC','Compatible douchette Bluetooth','Interface responsive'] }
  ],
  sectHowVisible: true, sectHowBadge: 'Simple & rapide', sectHowTitre: 'Op\u00e9rationnel en 3 \u00e9tapes',
  howSteps: [
    { titre: 'Cr\u00e9ez votre compte', desc: 'Cliquez sur \u00ab\u00a0Connexion\u00a0\u00bb puis \u00ab\u00a0S\u2019inscrire\u00a0\u00bb. Votre espace est actif imm\u00e9diatement.' },
    { titre: 'Ajoutez vos produits', desc: 'Importez votre catalogue, scannez les codes-barres ou saisissez vos articles manuellement.' },
    { titre: 'G\u00e9rez & vendez', desc: 'Imprimez vos \u00e9tiquettes, encaissez vos ventes et consultez vos rapports en temps r\u00e9el.' }
  ],
  sectTarifsVisible: true, sectTarifsBadge: 'Tarification', sectTarifsTitre: 'Gratuit pour commencer',
  sectTarifsSous: 'Profitez de toutes les fonctionnalit\u00e9s sans limitation.',
  sectTarifsPrix: '0 \u20ac', sectTarifsBadgeLabel: 'LANCEMENT GRATUIT', sectTarifsCta: 'Commencer gratuitement',
  sectCtaVisible: true,
  sectCtaTitre: 'Pr\u00eat \u00e0 professionnaliser votre boutique\u00a0?',
  sectCtaSous: 'Rejoignez des centaines de clubs qui g\u00e8rent leur stock avec READI.Fr.',
  sectCtaBtn: 'Cr\u00e9er mon espace gratuitement',
  sectCtaNote: 'Aucune carte bancaire \u00b7 Activation imm\u00e9diate'
};

const THEMES = [
  { nom: 'Bleu Océan',  primary: '#3B82F6', sidebar: '#1e3a5f', accent: '#60A5FA', text: '#1f2937', bg: '#f8fafc' },
  { nom: 'Vert Nature', primary: '#10B981', sidebar: '#064e3b', accent: '#34D399', text: '#1f2937', bg: '#f0fdf4' },
  { nom: 'Violet Pro',  primary: '#8B5CF6', sidebar: '#2e1065', accent: '#A78BFA', text: '#1f2937', bg: '#faf5ff' },
  { nom: 'Rouge Vif',   primary: '#EF4444', sidebar: '#450a0a', accent: '#FCA5A5', text: '#1f2937', bg: '#fff1f2' },
  { nom: 'Ardoise',     primary: '#64748B', sidebar: '#0f172a', accent: '#94A3B8', text: '#1e293b', bg: '#f1f5f9' },
  { nom: 'Orange Club', primary: '#F97316', sidebar: '#431407', accent: '#FDBA74', text: '#1f2937', bg: '#fff7ed' }
];

let siteConfig = {};

function chargerReglagesSite() {
  const saved = localStorage.getItem('siteConfig');
  siteConfig = saved ? { ...SITE_DEFAULTS, ...JSON.parse(saved) } : { ...SITE_DEFAULTS };
  chargerFormulairesSite();
  rendreLandingFeatures();
  rendreNavItems();
  rendreThemes();
  previewSite();
  previewCouleurs();
  previewTypo();
  previewLanding();
  previewNav();
}

function chargerFormulairesSite() {
  const set = (id, val) => { const el = document.getElementById(id); if (el) el.value = val; };
  const chk = (id, val) => { const el = document.getElementById(id); if (el) el.checked = val; };
  set('site-nom', siteConfig.nom);
  set('site-slogan', siteConfig.slogan);
  set('site-email', siteConfig.email);
  set('site-tel', siteConfig.tel);
  set('site-logo-texte', siteConfig.logoTexte);
  set('site-logo-suffix', siteConfig.logoSuffix);
  set('site-color-primary', siteConfig.colorPrimary);
  set('site-color-primary-hex', siteConfig.colorPrimary);
  set('site-color-sidebar', siteConfig.colorSidebar);
  set('site-color-sidebar-hex', siteConfig.colorSidebar);
  set('site-color-accent', siteConfig.colorAccent);
  set('site-color-accent-hex', siteConfig.colorAccent);
  set('site-color-text', siteConfig.colorText);
  set('site-color-text-hex', siteConfig.colorText);
  set('site-color-bg', siteConfig.colorBg);
  set('site-color-bg-hex', siteConfig.colorBg);
  set('site-font', siteConfig.font);
  set('site-font-size', siteConfig.fontSize);
  set('site-line-height', siteConfig.lineHeight);
  set('site-radius', siteConfig.radius);
  set('land-hero-titre', siteConfig.landHeroTitre);
  set('land-hero-sous', siteConfig.landHeroSous);
  set('land-cta1', siteConfig.landCta1);
  set('land-cta2', siteConfig.landCta2);
  set('land-final-titre', siteConfig.landFinalTitre);
  set('land-final-cta', siteConfig.landFinalCta);
  set('footer-copyright', siteConfig.footerCopyright);
  set('footer-mentions', siteConfig.footerMentions);
  set('footer-cgu', siteConfig.footerCgu);
  set('footer-privacy', siteConfig.footerPrivacy);
  set('footer-facebook', siteConfig.footerFacebook);
  set('footer-twitter', siteConfig.footerTwitter);
  set('footer-instagram', siteConfig.footerInstagram);
  set('footer-linkedin', siteConfig.footerLinkedin);
  chk('nav-show-logo', siteConfig.navShowLogo);
  chk('nav-sidebar-collapsed', siteConfig.navSidebarCollapsed);
  const bv = document.getElementById('typo-base-val');
  if (bv) bv.textContent = siteConfig.fontSize;
  const lv = document.getElementById('typo-line-val');
  if (lv) lv.textContent = parseFloat(siteConfig.lineHeight).toFixed(1);
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

// ── Aperçus ───────────────────────────────────────────────────────────────────
function previewSite() {
  const nom = document.getElementById('site-nom')?.value || 'READI.Fr';
  const slogan = document.getElementById('site-slogan')?.value || '';
  const texte = document.getElementById('site-logo-texte')?.value || 'READI';
  const suffix = document.getElementById('site-logo-suffix')?.value || '.Fr';
  const color = document.getElementById('site-color-primary')?.value || '#3B82F6';
  const accent = document.getElementById('site-color-accent')?.value || '#60A5FA';
  const el = document.getElementById('prev-nom');
  if (el) el.innerHTML = `<span style="color:${color}">${texte}</span><span style="color:${accent}">${suffix}</span>`;
  const sl = document.getElementById('prev-slogan');
  if (sl) sl.textContent = slogan;
  const cta = document.getElementById('prev-btn-cta');
  if (cta) cta.style.background = color;
}

function previewCouleurs() {
  const p = document.getElementById('site-color-primary')?.value || '#3B82F6';
  const s = document.getElementById('site-color-sidebar')?.value || '#1e3a5f';
  const a = document.getElementById('site-color-accent')?.value || '#60A5FA';
  const t = document.getElementById('site-color-text')?.value || '#1f2937';
  const b = document.getElementById('site-color-bg')?.value || '#f8fafc';
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
  // Sync hex inputs
  const sync = (colorId, hexId) => {
    const hex = document.getElementById(hexId);
    const col = document.getElementById(colorId);
    if (hex && col) hex.value = col.value;
  };
  sync('site-color-primary', 'site-color-primary-hex');
  sync('site-color-sidebar', 'site-color-sidebar-hex');
  sync('site-color-accent',  'site-color-accent-hex');
  sync('site-color-text',    'site-color-text-hex');
  sync('site-color-bg',      'site-color-bg-hex');
}

function syncColorPicker(type) {
  const hex = document.getElementById('site-color-' + type + '-hex')?.value;
  if (hex && /^#[0-9A-Fa-f]{6}$/.test(hex)) {
    const picker = document.getElementById('site-color-' + type);
    if (picker) picker.value = hex;
    previewCouleurs();
  }
}

function previewTypo() {
  const font = document.getElementById('site-font')?.value || 'Inter, sans-serif';
  const size = document.getElementById('site-font-size')?.value || 14;
  const lh   = document.getElementById('site-line-height')?.value || 1.5;
  const rad  = document.getElementById('site-radius')?.value || '8px';
  const color = document.getElementById('site-color-primary')?.value || '#3B82F6';
  ['prev-typo-h2','prev-typo-h3','prev-typo-p'].forEach(id => {
    const el = document.getElementById(id);
    if (el) { el.style.fontFamily = font; el.style.lineHeight = lh; }
  });
  const btn = document.getElementById('prev-typo-btn');
  if (btn) { btn.style.fontFamily = font; btn.style.fontSize = size + 'px'; btn.style.borderRadius = rad; btn.style.background = color; }
  const inp = document.getElementById('prev-typo-input');
  if (inp) { inp.style.fontFamily = font; inp.style.fontSize = size + 'px'; inp.style.borderRadius = rad; }
}

function previewLanding() {
  const titre = document.getElementById('land-hero-titre')?.value || '';
  const sous  = document.getElementById('land-hero-sous')?.value || '';
  const cta1  = document.getElementById('land-cta1')?.value || '';
  const cta2  = document.getElementById('land-cta2')?.value || '';
  const primary = document.getElementById('site-color-primary')?.value || '#3B82F6';
  const sidebar = document.getElementById('site-color-sidebar')?.value || '#1e3a5f';
  const set = (id, txt) => { const el = document.getElementById(id); if (el) el.textContent = txt; };
  set('prev-land-titre', titre);
  set('prev-land-sous', sous);
  set('prev-land-cta1', cta1);
  set('prev-land-cta2', cta2);
  const hero = document.getElementById('prev-land-hero-bg');
  if (hero) hero.style.background = `linear-gradient(135deg,${sidebar} 0%,${primary} 100%)`;
  const c1 = document.getElementById('prev-land-cta1');
  if (c1) c1.style.color = primary;
  rendrePrevFeatures();
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

// ── Features landing ──────────────────────────────────────────────────────────
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
        <i class="fa ${f.icone} text-primary text-xl mt-1"></i>
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
  const primary = document.getElementById('site-color-primary')?.value || '#3B82F6';
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
  rendreLandingFeatures();
  rendrePrevFeatures();
}

function supprimerFeature(idx) {
  siteConfig.landFeatures.splice(idx, 1);
  rendreLandingFeatures();
  rendrePrevFeatures();
}

// ── Nav items ────────────────────────────────────────────────────────────────
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

// ── Thèmes prédéfinis ─────────────────────────────────────────────────────────
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
  const set = (id, val) => { const el = document.getElementById(id); if (el) el.value = val; };
  set('site-color-primary', th.primary); set('site-color-primary-hex', th.primary);
  set('site-color-sidebar', th.sidebar); set('site-color-sidebar-hex', th.sidebar);
  set('site-color-accent',  th.accent);  set('site-color-accent-hex',  th.accent);
  set('site-color-text',    th.text);    set('site-color-text-hex',    th.text);
  set('site-color-bg',      th.bg);      set('site-color-bg-hex',      th.bg);
  previewCouleurs();
  previewSite();
  previewLanding();
  previewNav();
  afficherMessage('Thème "' + th.nom + '" appliqué — cliquez sur Appliquer pour sauvegarder', 'info');
}

// ── Logo preview ───────────────────────────────────────────────────────────────
function previewLogo(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    const prev = document.getElementById('site-logo-preview');
    if (prev) prev.innerHTML = `<img src="${e.target.result}" class="w-full h-full object-contain rounded-lg">`;
    siteConfig.logoUrl = e.target.result;
  };
  reader.readAsDataURL(file);
}

// ── Sauvegarde ────────────────────────────────────────────────────────────────
function sauvegarderSite() {
  siteConfig.nom       = document.getElementById('site-nom')?.value || siteConfig.nom;
  siteConfig.slogan    = document.getElementById('site-slogan')?.value || '';
  siteConfig.email     = document.getElementById('site-email')?.value || '';
  siteConfig.tel       = document.getElementById('site-tel')?.value || '';
  siteConfig.logoTexte = document.getElementById('site-logo-texte')?.value || 'READI';
  siteConfig.logoSuffix= document.getElementById('site-logo-suffix')?.value || '.Fr';
  siteConfig.colorPrimary = document.getElementById('site-color-primary')?.value || siteConfig.colorPrimary;
  siteConfig.colorSidebar = document.getElementById('site-color-sidebar')?.value || siteConfig.colorSidebar;
  siteConfig.colorAccent  = document.getElementById('site-color-accent')?.value  || siteConfig.colorAccent;
  siteConfig.colorText    = document.getElementById('site-color-text')?.value    || siteConfig.colorText;
  siteConfig.colorBg      = document.getElementById('site-color-bg')?.value      || siteConfig.colorBg;
  siteConfig.font         = document.getElementById('site-font')?.value          || siteConfig.font;
  siteConfig.fontSize     = parseInt(document.getElementById('site-font-size')?.value)   || 14;
  siteConfig.lineHeight   = parseFloat(document.getElementById('site-line-height')?.value) || 1.5;
  siteConfig.radius       = document.getElementById('site-radius')?.value        || '8px';
  siteConfig.landHeroTitre= document.getElementById('land-hero-titre')?.value    || '';
  siteConfig.landHeroSous = document.getElementById('land-hero-sous')?.value     || '';
  siteConfig.landCta1     = document.getElementById('land-cta1')?.value          || '';
  siteConfig.landCta2     = document.getElementById('land-cta2')?.value          || '';
  siteConfig.landFinalTitre = document.getElementById('land-final-titre')?.value || '';
  siteConfig.landFinalCta   = document.getElementById('land-final-cta')?.value   || '';
  siteConfig.footerCopyright = document.getElementById('footer-copyright')?.value || '';
  siteConfig.footerMentions  = document.getElementById('footer-mentions')?.value  || '';
  siteConfig.footerCgu       = document.getElementById('footer-cgu')?.value       || '';
  siteConfig.footerPrivacy   = document.getElementById('footer-privacy')?.value   || '';
  siteConfig.footerFacebook  = document.getElementById('footer-facebook')?.value  || '';
  siteConfig.footerTwitter   = document.getElementById('footer-twitter')?.value   || '';
  siteConfig.footerInstagram = document.getElementById('footer-instagram')?.value || '';
  siteConfig.footerLinkedin  = document.getElementById('footer-linkedin')?.value  || '';
  siteConfig.navShowLogo        = document.getElementById('nav-show-logo')?.checked        || false;
  siteConfig.navSidebarCollapsed= document.getElementById('nav-sidebar-collapsed')?.checked|| false;

  localStorage.setItem('siteConfig', JSON.stringify(siteConfig));
  appliquerSiteEnDirect(siteConfig);
  afficherMessage('✅ Réglages du site sauvegardés et appliqués', 'success');
}

function appliquerSiteEnDirect(cfg) {
  // Couleur primaire en CSS variable
  document.documentElement.style.setProperty('--color-primary', cfg.colorPrimary);
  // Police
  document.body.style.fontFamily = cfg.font;
  document.body.style.fontSize   = cfg.fontSize + 'px';
  // Logo sidebar
  const h1 = document.querySelector('aside h1');
  if (h1) h1.innerHTML = `<span style="color:${cfg.colorPrimary}">${cfg.logoTexte}</span><span style="color:${cfg.colorAccent}">${cfg.logoSuffix}</span>`;
  // Fond général
  const main = document.querySelector('#interface-principale');
  if (main) main.style.background = cfg.colorBg;
  // Sidebar
  const aside = document.querySelector('aside');
  if (aside) aside.style.background = cfg.colorSidebar !== '#1e3a5f' ? cfg.colorSidebar : '';
  // Labels menu
  if (cfg.navItems) {
    cfg.navItems.forEach(item => {
      const el = document.querySelector(`[data-section="${item.section}"]`);
      if (el) {
        const icon = el.querySelector('i');
        const iconHtml = icon ? icon.outerHTML : '';
        el.innerHTML = iconHtml + ' ' + item.label;
        if (icon) el.prepend(icon);
        el.style.display = item.visible ? '' : 'none';
      }
    });
  }
}

function reinitialiserSite() {
  if (!confirm('Réinitialiser tous les réglages aux valeurs par défaut ?')) return;
  localStorage.removeItem('siteConfig');
  siteConfig = { ...SITE_DEFAULTS };
  chargerFormulairesSite();
  rendreLandingFeatures();
  rendreNavItems();
  rendreThemes();
  previewSite();
  previewCouleurs();
  previewTypo();
  previewLanding();
  previewNav();
  appliquerSiteEnDirect(siteConfig);
  afficherMessage('Réglages réinitialisés', 'info');
}

// ── Navbar landing ────────────────────────────────────────────────────────────
function rendreNavbarLinks() {
  const cont = document.getElementById('navbar-links');
  if (!cont) return;
  cont.innerHTML = (siteConfig.navbarLinks || []).map((l, i) => `
    <div class="flex items-center gap-2 bg-gray-50 border rounded-lg px-3 py-2">
      <input type="text" value="${l.label}" placeholder="Label" class="flex-1 text-sm bg-transparent focus:outline-none border-b border-transparent focus:border-gray-300" oninput="editNavbarLink(${i},'label',this.value)">
      <input type="text" value="${l.href}" placeholder="#section" class="w-28 text-xs text-gray-400 bg-transparent focus:outline-none border-b border-transparent focus:border-gray-300 font-mono" oninput="editNavbarLink(${i},'href',this.value)">
      <button onclick="supprimerNavbarLink(${i})" class="text-red-400 hover:text-red-600 text-xs"><i class="fa fa-trash"></i></button>
    </div>`).join('');
}

function editNavbarLink(idx, champ, val) {
  if (siteConfig.navbarLinks[idx]) siteConfig.navbarLinks[idx][champ] = val;
  previewNavbar();
}
function supprimerNavbarLink(idx) {
  siteConfig.navbarLinks.splice(idx, 1);
  rendreNavbarLinks();
  previewNavbar();
}
function ajouterLienNavbar() {
  siteConfig.navbarLinks = siteConfig.navbarLinks || [];
  siteConfig.navbarLinks.push({ label: 'Nouveau lien', href: '#section' });
  rendreNavbarLinks();
  previewNavbar();
}

function previewNavbar() {
  const connexion = document.getElementById('nav-btn-connexion')?.value || 'Connexion';
  const cta = document.getElementById('nav-btn-cta')?.value || 'Essai gratuit';
  const primary = document.getElementById('site-color-primary')?.value || '#3B82F6';
  const sidebar = document.getElementById('site-color-sidebar')?.value || '#1e3a5f';
  const el = document.getElementById('prev-nav-connexion');
  if (el) el.textContent = connexion;
  const elCta = document.getElementById('prev-nav-cta');
  if (elCta) { elCta.textContent = cta; elCta.style.color = primary; }
  const bg = document.getElementById('prev-navbar-bg');
  if (bg) bg.style.background = `linear-gradient(135deg,${sidebar},${primary})`;
  const linksEl = document.getElementById('prev-navbar-links');
  if (linksEl) linksEl.innerHTML = (siteConfig.navbarLinks || []).map(l => `<span>${l.label}</span>`).join('');
}

// ── Slideshow ─────────────────────────────────────────────────────────────────
function rendreSlidesEditor() {
  const cont = document.getElementById('slides-editor');
  if (!cont) return;
  cont.innerHTML = (siteConfig.slides || []).map((s, i) => `
    <div class="flex items-center gap-3 bg-gray-50 border rounded-lg px-3 py-2">
      <div class="w-8 h-8 rounded flex-shrink-0 border" style="background:${s.gradient}"></div>
      <div class="flex-1">
        <label class="block text-xs text-gray-400 mb-1">Dégradé CSS (gradient)</label>
        <input type="text" value="${s.gradient}" class="w-full text-xs border p-1 rounded font-mono" oninput="editSlide(${i},'gradient',this.value)">
      </div>
      <div class="flex flex-col gap-1">
        <input type="color" value="#165DFF" class="w-8 h-5 cursor-pointer rounded border" title="Couleur de fin rapide" oninput="editSlideColor(${i},this.value)">
        <button onclick="supprimerSlide(${i})" class="text-red-400 hover:text-red-600 text-xs"><i class="fa fa-trash"></i></button>
      </div>
    </div>`).join('');
}

function editSlide(idx, champ, val) {
  if (siteConfig.slides[idx]) { siteConfig.slides[idx][champ] = val; previewSlideshow(); }
}
function editSlideColor(idx, color) {
  if (siteConfig.slides[idx]) {
    siteConfig.slides[idx].gradient = `linear-gradient(135deg,${color}cc 0%,${color} 100%)`;
    rendreSlidesEditor();
    previewSlideshow();
  }
}
function supprimerSlide(idx) {
  if (siteConfig.slides.length <= 1) return;
  siteConfig.slides.splice(idx, 1);
  rendreSlidesEditor();
  previewSlideshow();
}
function ajouterSlide() {
  siteConfig.slides.push({ gradient: 'linear-gradient(135deg,#1e3a5f 0%,#3B82F6 100%)' });
  rendreSlidesEditor();
  previewSlideshow();
}

function rendreTypewriterEditor() {
  const cont = document.getElementById('typewriter-phrases');
  if (!cont) return;
  cont.innerHTML = (siteConfig.typewriterPhrases || []).map((p, i) => `
    <div class="flex items-center gap-2">
      <input type="text" value="${p}" class="flex-1 border p-2 rounded-lg text-sm" oninput="editPhrase(${i},this.value)">
      <button onclick="supprimerPhrase(${i})" class="text-red-400 hover:text-red-600 text-xs px-2"><i class="fa fa-trash"></i></button>
    </div>`).join('');
}
function editPhrase(idx, val) { if (siteConfig.typewriterPhrases[idx] !== undefined) { siteConfig.typewriterPhrases[idx] = val; previewSlideshow(); } }
function supprimerPhrase(idx) { siteConfig.typewriterPhrases.splice(idx, 1); rendreTypewriterEditor(); previewSlideshow(); }
function ajouterPhrase() { siteConfig.typewriterPhrases.push('Nouvelle phrase...'); rendreTypewriterEditor(); previewSlideshow(); }

function rendreHeroStatsEditor() {
  const cont = document.getElementById('hero-stats-editor');
  if (!cont) return;
  cont.innerHTML = (siteConfig.heroStats || []).map((s, i) => `
    <div class="flex items-center gap-2 bg-gray-50 border rounded-lg px-3 py-2">
      <input type="text" value="${s.valeur}" placeholder="Valeur" class="w-20 border p-1.5 rounded text-sm font-bold text-center" oninput="editStat(${i},'valeur',this.value)">
      <input type="text" value="${s.label}" placeholder="Label" class="flex-1 border p-1.5 rounded text-sm" oninput="editStat(${i},'label',this.value)">
      <button onclick="supprimerStat(${i})" class="text-red-400 hover:text-red-600 text-xs"><i class="fa fa-trash"></i></button>
    </div>`).join('');
}
function editStat(idx, champ, val) { if (siteConfig.heroStats[idx]) { siteConfig.heroStats[idx][champ] = val; previewSlideshow(); } }
function supprimerStat(idx) { siteConfig.heroStats.splice(idx, 1); rendreHeroStatsEditor(); previewSlideshow(); }

function previewSlideshow() {
  const slide0 = siteConfig.slides?.[0];
  const bg = document.getElementById('prev-slide-bg');
  if (bg && slide0) bg.style.background = slide0.gradient;
  const tw = document.getElementById('prev-slide-typewriter');
  if (tw) tw.textContent = siteConfig.typewriterPhrases?.[0] || '';
  const c1 = document.getElementById('prev-slide-cta1');
  if (c1) c1.textContent = document.getElementById('land-cta1')?.value || siteConfig.landCta1;
  const c2 = document.getElementById('prev-slide-cta2');
  if (c2) c2.textContent = document.getElementById('land-cta2')?.value || siteConfig.landCta2;
  const dotsEl = document.getElementById('prev-slide-dots');
  if (dotsEl) {
    const show = document.getElementById('slide-show-dots')?.checked ?? siteConfig.slideShowDots;
    dotsEl.style.display = show ? 'flex' : 'none';
    dotsEl.innerHTML = (siteConfig.slides || []).map((_, i) =>
      `<div class="w-2 h-2 rounded-full ${i===0?'bg-white':'bg-white/40'}"></div>`).join('');
  }
  const statsEl = document.getElementById('prev-slide-stats');
  if (statsEl) {
    const show = document.getElementById('slide-show-stats')?.checked ?? siteConfig.slideShowStats;
    statsEl.style.display = show ? 'flex' : 'none';
    statsEl.innerHTML = (siteConfig.heroStats || []).map(s =>
      `<div class="text-white text-center text-xs"><div class="font-black">${s.valeur}</div><div class="opacity-50">${s.label}</div></div>`).join('');
  }
}

// ── Sections ──────────────────────────────────────────────────────────────────
function rendreFonctCardsEditor() {
  const cont = document.getElementById('fonct-cards-editor');
  if (!cont) return;
  cont.innerHTML = (siteConfig.fonctCards || []).map((c, i) => `
    <div class="border rounded-xl p-3 mb-2 bg-gray-50">
      <div class="flex items-center gap-2 mb-2">
        <select class="border rounded px-1 py-1 text-xs" onchange="editFonctCard(${i},'icone',this.value)">
          ${['fa-cubes','fa-barcode','fa-calculator','fa-bar-chart','fa-users','fa-mobile','fa-star','fa-globe','fa-shield','fa-bolt'].map(ic =>
            `<option value="${ic}" ${c.icone===ic?'selected':''}>${ic.replace('fa-','')}</option>`).join('')}
        </select>
        <input type="text" value="${c.titre}" placeholder="Titre" class="flex-1 border p-1.5 rounded text-sm font-medium" oninput="editFonctCard(${i},'titre',this.value)">
        <button onclick="supprimerFonctCard(${i})" class="text-red-400 hover:text-red-600 text-xs px-1"><i class="fa fa-trash"></i></button>
      </div>
      <input type="text" value="${c.desc}" placeholder="Description" class="w-full border p-1.5 rounded text-xs text-gray-500 mb-2" oninput="editFonctCard(${i},'desc',this.value)">
      <div class="space-y-1" id="fonct-points-${i}">
        ${(c.points||[]).map((pt,j) => `
          <div class="flex items-center gap-1">
            <input type="text" value="${pt}" class="flex-1 border p-1 rounded text-xs" oninput="editFonctPoint(${i},${j},this.value)">
            <button onclick="supprimerFonctPoint(${i},${j})" class="text-red-400 text-xs px-1"><i class="fa fa-minus"></i></button>
          </div>`).join('')}
      </div>
      <button onclick="ajouterFonctPoint(${i})" class="mt-1 text-xs text-primary hover:underline"><i class="fa fa-plus mr-1"></i>Point</button>
    </div>`).join('');
}
function editFonctCard(idx, champ, val) { if (siteConfig.fonctCards[idx]) { siteConfig.fonctCards[idx][champ] = val; if (champ==='icone') rendreFonctCardsEditor(); } }
function supprimerFonctCard(idx) { siteConfig.fonctCards.splice(idx, 1); rendreFonctCardsEditor(); }
function ajouterCartefonct() { siteConfig.fonctCards.push({ icone: 'fa-star', titre: 'Nouvelle fonctionnalit\u00e9', desc: 'Description...', points: [] }); rendreFonctCardsEditor(); }
function editFonctPoint(ci, pi, val) { if (siteConfig.fonctCards[ci]?.points[pi] !== undefined) siteConfig.fonctCards[ci].points[pi] = val; }
function supprimerFonctPoint(ci, pi) { siteConfig.fonctCards[ci]?.points.splice(pi, 1); rendreFonctCardsEditor(); }
function ajouterFonctPoint(ci) { siteConfig.fonctCards[ci]?.points.push('Nouveau point'); rendreFonctCardsEditor(); }

function rendreHowStepsEditor() {
  const cont = document.getElementById('how-steps-editor');
  if (!cont) return;
  cont.innerHTML = (siteConfig.howSteps || []).map((s, i) => `
    <div class="flex items-start gap-2 bg-gray-50 border rounded-lg px-3 py-2">
      <div class="w-7 h-7 rounded-full bg-primary text-white text-xs font-black flex items-center justify-center flex-shrink-0 mt-1">${i+1}</div>
      <div class="flex-1 space-y-1">
        <input type="text" value="${s.titre}" placeholder="Titre étape" class="w-full border p-1.5 rounded text-sm font-medium" oninput="editStep(${i},'titre',this.value)">
        <textarea rows="2" class="w-full border p-1.5 rounded text-xs text-gray-500 resize-none" oninput="editStep(${i},'desc',this.value)">${s.desc}</textarea>
      </div>
      <button onclick="supprimerStep(${i})" class="text-red-400 hover:text-red-600 text-xs mt-1"><i class="fa fa-trash"></i></button>
    </div>`).join('');
}
function editStep(idx, champ, val) { if (siteConfig.howSteps[idx]) siteConfig.howSteps[idx][champ] = val; }
function supprimerStep(idx) { siteConfig.howSteps.splice(idx, 1); rendreHowStepsEditor(); }

// ── Chargement étendu ─────────────────────────────────────────────────────────
const _origChargerFormulairesSite = chargerFormulairesSite;
function chargerFormulairesSite() {
  _origChargerFormulairesSite();
  const set = (id, val) => { const el = document.getElementById(id); if (el) el.value = val; };
  const chk = (id, val) => { const el = document.getElementById(id); if (el) el.checked = val; };
  // Navbar
  set('nav-btn-connexion', siteConfig.navbarBtnConnexion || 'Connexion');
  set('nav-btn-cta', siteConfig.navbarBtnCta || 'Essai gratuit');
  set('navbar-bg-color', siteConfig.navbarBgColor || '#ffffff');
  chk('navbar-show-logo', siteConfig.navbarShowLogo !== false);
  chk('navbar-sticky', siteConfig.navbarSticky !== false);
  rendreNavbarLinks();
  // Slideshow
  set('slide-speed', siteConfig.slideSpeed || 5000);
  chk('slide-autoplay', siteConfig.slideAutoplay !== false);
  chk('slide-show-dots', siteConfig.slideShowDots !== false);
  chk('slide-show-stats', siteConfig.slideShowStats !== false);
  rendreSlidesEditor();
  rendreTypewriterEditor();
  rendreHeroStatsEditor();
  // Sections
  chk('sect-fonct-visible', siteConfig.sectFonctVisible !== false);
  set('sect-fonct-badge', siteConfig.sectFonctBadge || '');
  set('sect-fonct-titre', siteConfig.sectFonctTitre || '');
  set('sect-fonct-sous', siteConfig.sectFonctSous || '');
  rendreFonctCardsEditor();
  chk('sect-how-visible', siteConfig.sectHowVisible !== false);
  set('sect-how-badge', siteConfig.sectHowBadge || '');
  set('sect-how-titre', siteConfig.sectHowTitre || '');
  rendreHowStepsEditor();
  chk('sect-tarifs-visible', siteConfig.sectTarifsVisible !== false);
  set('sect-tarifs-badge', siteConfig.sectTarifsBadge || '');
  set('sect-tarifs-titre', siteConfig.sectTarifsTitre || '');
  set('sect-tarifs-sous', siteConfig.sectTarifsSous || '');
  set('sect-tarifs-prix', siteConfig.sectTarifsPrix || '');
  set('sect-tarifs-badge-label', siteConfig.sectTarifsBadgeLabel || '');
  set('sect-tarifs-cta', siteConfig.sectTarifsCta || '');
  chk('sect-cta-visible', siteConfig.sectCtaVisible !== false);
  set('sect-cta-titre', siteConfig.sectCtaTitre || '');
  set('sect-cta-sous', siteConfig.sectCtaSous || '');
  set('sect-cta-btn', siteConfig.sectCtaBtn || '');
  set('sect-cta-note', siteConfig.sectCtaNote || '');
  previewNavbar();
  previewSlideshow();
}

// ── Sauvegarde étendue ────────────────────────────────────────────────────────
const _origSauvegarderSite = sauvegarderSite;
function sauvegarderSite() {
  // Navbar
  siteConfig.navbarBtnConnexion = document.getElementById('nav-btn-connexion')?.value || 'Connexion';
  siteConfig.navbarBtnCta       = document.getElementById('nav-btn-cta')?.value || 'Essai gratuit';
  siteConfig.navbarBgColor      = document.getElementById('navbar-bg-color')?.value || '#ffffff';
  siteConfig.navbarShowLogo     = document.getElementById('navbar-show-logo')?.checked ?? true;
  siteConfig.navbarSticky       = document.getElementById('navbar-sticky')?.checked ?? true;
  // Slideshow
  siteConfig.slideSpeed    = parseInt(document.getElementById('slide-speed')?.value) || 5000;
  siteConfig.slideAutoplay = document.getElementById('slide-autoplay')?.checked ?? true;
  siteConfig.slideShowDots = document.getElementById('slide-show-dots')?.checked ?? true;
  siteConfig.slideShowStats= document.getElementById('slide-show-stats')?.checked ?? true;
  // Sections
  siteConfig.sectFonctVisible = document.getElementById('sect-fonct-visible')?.checked ?? true;
  siteConfig.sectFonctBadge   = document.getElementById('sect-fonct-badge')?.value || '';
  siteConfig.sectFonctTitre   = document.getElementById('sect-fonct-titre')?.value || '';
  siteConfig.sectFonctSous    = document.getElementById('sect-fonct-sous')?.value || '';
  siteConfig.sectHowVisible   = document.getElementById('sect-how-visible')?.checked ?? true;
  siteConfig.sectHowBadge     = document.getElementById('sect-how-badge')?.value || '';
  siteConfig.sectHowTitre     = document.getElementById('sect-how-titre')?.value || '';
  siteConfig.sectTarifsVisible    = document.getElementById('sect-tarifs-visible')?.checked ?? true;
  siteConfig.sectTarifsBadge      = document.getElementById('sect-tarifs-badge')?.value || '';
  siteConfig.sectTarifsTitre      = document.getElementById('sect-tarifs-titre')?.value || '';
  siteConfig.sectTarifsSous       = document.getElementById('sect-tarifs-sous')?.value || '';
  siteConfig.sectTarifsPrix       = document.getElementById('sect-tarifs-prix')?.value || '';
  siteConfig.sectTarifsBadgeLabel = document.getElementById('sect-tarifs-badge-label')?.value || '';
  siteConfig.sectTarifsCta        = document.getElementById('sect-tarifs-cta')?.value || '';
  siteConfig.sectCtaVisible  = document.getElementById('sect-cta-visible')?.checked ?? true;
  siteConfig.sectCtaTitre    = document.getElementById('sect-cta-titre')?.value || '';
  siteConfig.sectCtaSous     = document.getElementById('sect-cta-sous')?.value || '';
  siteConfig.sectCtaBtn      = document.getElementById('sect-cta-btn')?.value || '';
  siteConfig.sectCtaNote     = document.getElementById('sect-cta-note')?.value || '';
  // Appel original
  _origSauvegarderSite();
}

// Appliquer au démarrage si config sauvegardée
(function() {
  try {
    const saved = localStorage.getItem('siteConfig');
    if (saved) appliquerSiteEnDirect({ ...SITE_DEFAULTS, ...JSON.parse(saved) });
  } catch(e) {}
})();
