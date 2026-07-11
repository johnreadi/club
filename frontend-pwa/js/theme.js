// ============================================================
// theme.js — Bibliothèque de thèmes & dispositions
// ============================================================

// ── Thèmes prédéfinis ────────────────────────────────────────
const THEMES_PREDEFINIS = [
  {
    id: 'bleu-pro',
    nom: 'Bleu Professionnel',
    emoji: '🔵',
    couleurPrimaire: '#165DFF',
    couleurSidebar: '#0f2d6b',
    couleurTexte: '#ffffff',
    couleurFond: '#F8FAFC',
    couleurCarte: '#ffffff',
    police: 'Inter, sans-serif',
    arrondi: '0.75rem',
    sombre: false
  },
  {
    id: 'vert-sport',
    nom: 'Vert Sport',
    emoji: '🟢',
    couleurPrimaire: '#10B981',
    couleurSidebar: '#064e3b',
    couleurTexte: '#ffffff',
    couleurFond: '#F0FDF4',
    couleurCarte: '#ffffff',
    police: 'Inter, sans-serif',
    arrondi: '0.75rem',
    sombre: false
  },
  {
    id: 'rouge-energie',
    nom: 'Rouge Énergie',
    emoji: '🔴',
    couleurPrimaire: '#EF4444',
    couleurSidebar: '#7f1d1d',
    couleurTexte: '#ffffff',
    couleurFond: '#FFF5F5',
    couleurCarte: '#ffffff',
    police: 'Inter, sans-serif',
    arrondi: '0.75rem',
    sombre: false
  },
  {
    id: 'orange-dynamique',
    nom: 'Orange Dynamique',
    emoji: '🟠',
    couleurPrimaire: '#F59E0B',
    couleurSidebar: '#78350f',
    couleurTexte: '#ffffff',
    couleurFond: '#FFFBEB',
    couleurCarte: '#ffffff',
    police: 'Inter, sans-serif',
    arrondi: '0.5rem',
    sombre: false
  },
  {
    id: 'violet-prestige',
    nom: 'Violet Prestige',
    emoji: '🟣',
    couleurPrimaire: '#8B5CF6',
    couleurSidebar: '#4c1d95',
    couleurTexte: '#ffffff',
    couleurFond: '#F5F3FF',
    couleurCarte: '#ffffff',
    police: 'Georgia, serif',
    arrondi: '1rem',
    sombre: false
  },
  {
    id: 'sombre-elite',
    nom: 'Sombre Élite',
    emoji: '⚫',
    couleurPrimaire: '#60A5FA',
    couleurSidebar: '#0f172a',
    couleurTexte: '#e2e8f0',
    couleurFond: '#1e293b',
    couleurCarte: '#1e3a5f',
    police: 'Inter, sans-serif',
    arrondi: '0.75rem',
    sombre: true
  },
  {
    id: 'cyan-moderne',
    nom: 'Cyan Moderne',
    emoji: '🩵',
    couleurPrimaire: '#0EA5E9',
    couleurSidebar: '#0c4a6e',
    couleurTexte: '#ffffff',
    couleurFond: '#F0F9FF',
    couleurCarte: '#ffffff',
    police: "'Roboto', sans-serif",
    arrondi: '0.5rem',
    sombre: false
  },
  {
    id: 'rose-pastel',
    nom: 'Rose Pastel',
    emoji: '🩷',
    couleurPrimaire: '#EC4899',
    couleurSidebar: '#831843',
    couleurTexte: '#ffffff',
    couleurFond: '#FDF2F8',
    couleurCarte: '#ffffff',
    police: 'Inter, sans-serif',
    arrondi: '1.25rem',
    sombre: false
  }
];

// ── Layouts disponibles ──────────────────────────────────────
const LAYOUTS = [
  {
    id: 'sidebar-gauche',
    nom: 'Sidebar gauche',
    description: 'Menu latéral fixe à gauche (classique)',
    icone: '▐▌',
    preview: `<div style="display:flex;gap:4px;height:40px">
      <div style="width:30%;background:var(--th-sidebar);border-radius:3px"></div>
      <div style="flex:1;background:#e5e7eb;border-radius:3px;padding:4px;display:flex;flex-direction:column;gap:2px">
        <div style="height:6px;background:#d1d5db;border-radius:2px;width:60%"></div>
        <div style="height:6px;background:#d1d5db;border-radius:2px;width:80%"></div>
        <div style="height:6px;background:#d1d5db;border-radius:2px;width:50%"></div>
      </div>
    </div>`
  },
  {
    id: 'topbar',
    nom: 'Barre du haut',
    description: 'Navigation horizontale en haut de page',
    icone: '▀▀',
    preview: `<div style="display:flex;flex-direction:column;gap:4px;height:40px">
      <div style="height:30%;background:var(--th-sidebar);border-radius:3px;display:flex;align-items:center;padding:0 4px;gap:3px">
        <div style="width:20px;height:4px;background:rgba(255,255,255,0.5);border-radius:1px"></div>
        <div style="width:20px;height:4px;background:rgba(255,255,255,0.5);border-radius:1px"></div>
        <div style="width:20px;height:4px;background:rgba(255,255,255,0.5);border-radius:1px"></div>
      </div>
      <div style="flex:1;background:#e5e7eb;border-radius:3px;padding:4px;display:flex;gap:2px">
        <div style="flex:1;background:#d1d5db;border-radius:2px"></div>
        <div style="flex:1;background:#d1d5db;border-radius:2px"></div>
      </div>
    </div>`
  },
  {
    id: 'cartes',
    nom: 'Mode Cartes',
    description: 'Accueil avec tuiles navigables, sidebar réduite',
    icone: '⊞',
    preview: `<div style="display:flex;gap:4px;height:40px">
      <div style="width:20%;background:var(--th-sidebar);border-radius:3px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px">
        <div style="width:10px;height:2px;background:rgba(255,255,255,0.5);border-radius:1px"></div>
        <div style="width:10px;height:2px;background:rgba(255,255,255,0.5);border-radius:1px"></div>
        <div style="width:10px;height:2px;background:rgba(255,255,255,0.5);border-radius:1px"></div>
      </div>
      <div style="flex:1;background:#e5e7eb;border-radius:3px;padding:3px;display:grid;grid-template-columns:1fr 1fr;gap:2px">
        <div style="background:var(--th-primary);border-radius:2px;opacity:0.7"></div>
        <div style="background:#10B981;border-radius:2px;opacity:0.7"></div>
        <div style="background:#F59E0B;border-radius:2px;opacity:0.7"></div>
        <div style="background:#8B5CF6;border-radius:2px;opacity:0.7"></div>
      </div>
    </div>`
  }
];

// ── État courant ─────────────────────────────────────────────
let _themeActuel = {
  themeId: 'bleu-pro',
  layout: 'sidebar-gauche',
  couleurPrimaire: '#165DFF',
  couleurSidebar: '#0f2d6b',
  couleurTexte: '#ffffff',
  couleurFond: '#F8FAFC',
  couleurCarte: '#ffffff',
  police: 'Inter, sans-serif',
  arrondi: '0.75rem',
  sombre: false
};

// ── Clé de stockage ──────────────────────────────────────────
const THEME_KEY = 'readi_theme_v1';

// ── Chargement au démarrage ──────────────────────────────────
function themeInit() {
  try {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved) _themeActuel = { ..._themeActuel, ...JSON.parse(saved) };
  } catch {}
  _themeAppliquer(_themeActuel);
}

// ── Application du thème ─────────────────────────────────────
function _themeAppliquer(t) {
  const root = document.documentElement;
  root.style.setProperty('--th-primary',  t.couleurPrimaire);
  root.style.setProperty('--th-sidebar',  t.couleurSidebar);
  root.style.setProperty('--th-txt',      t.couleurTexte);
  root.style.setProperty('--th-fond',     t.couleurFond);
  root.style.setProperty('--th-carte',    t.couleurCarte);
  root.style.setProperty('--th-arrondi',  t.arrondi);
  root.style.setProperty('--th-police',   t.police);

  // Police sur body
  document.body.style.fontFamily = t.police;
  document.body.style.backgroundColor = t.couleurFond;

  // Mode sombre
  document.body.classList.toggle('theme-sombre', !!t.sombre);

  // Layout
  document.body.setAttribute('data-layout', t.layout || 'sidebar-gauche');
  _themeAppliquerLayout(t.layout || 'sidebar-gauche');
}

function _themeAppliquerLayout(layout) {
  const iface = document.getElementById('interface-principale');
  const aside = iface?.querySelector('aside');
  const main  = iface?.querySelector('main');
  if (!iface || !aside || !main) return;

  // Nettoyer
  iface.classList.remove('layout-topbar', 'layout-cartes', 'layout-sidebar');
  aside.classList.remove('topbar-aside', 'cartes-aside', 'sidebar-aside');

  if (layout === 'topbar') {
    iface.classList.add('layout-topbar');
    aside.classList.add('topbar-aside');
  } else if (layout === 'cartes') {
    iface.classList.add('layout-cartes');
    aside.classList.add('cartes-aside');
    _themeInjecterDashboardCartes();
  } else {
    iface.classList.add('layout-sidebar');
  }
}

// ── Dashboard cartes (mode cartes) ───────────────────────────
const _MENU_CARTES = [
  { section: 'accueil',      nom: 'Tableau de bord', icone: 'fa-home',       couleur: '#165DFF' },
  { section: 'stock',        nom: 'Stock & Étiquettes', icone: 'fa-cube',    couleur: '#10B981' },
  { section: 'caisse',       nom: 'Caisse & Ventes', icone: 'fa-calculator', couleur: '#F59E0B' },
  { section: 'inventaire',   nom: 'Inventaire',      icone: 'fa-list-alt',   couleur: '#6366F1' },
  { section: 'rapports',     nom: 'Rapports',        icone: 'fa-bar-chart',  couleur: '#8B5CF6' },
  { section: 'utilisateurs', nom: 'Utilisateurs',    icone: 'fa-users',      couleur: '#EC4899' },
  { section: 'parametres',   nom: 'Paramètres',      icone: 'fa-sliders',    couleur: '#64748B' },
  { section: 'messagerie',   nom: 'Messagerie',      icone: 'fa-envelope',   couleur: '#0EA5E9' },
];

function _themeInjecterDashboardCartes() {
  const accueil = document.getElementById('accueil');
  if (!accueil || accueil.dataset.cartesInjecte) return;

  const existing = accueil.querySelector('.cartes-dashboard');
  if (existing) { existing.classList.remove('hidden'); accueil.dataset.cartesInjecte = '1'; return; }

  const grid = document.createElement('div');
  grid.className = 'cartes-dashboard grid grid-cols-2 md:grid-cols-4 gap-4 mb-6';
  grid.innerHTML = _MENU_CARTES.map(m => `
    <button onclick="afficherSection('${m.section}')"
      class="cartes-tuile flex flex-col items-center justify-center gap-3 p-6 rounded-2xl text-white font-semibold text-sm shadow-lg hover:scale-105 active:scale-95 transition-transform"
      style="background:linear-gradient(135deg,${m.couleur}dd,${m.couleur}99)">
      <i class="fa ${m.icone} text-2xl"></i>
      <span>${m.nom}</span>
    </button>
  `).join('');

  accueil.insertBefore(grid, accueil.firstChild);
  accueil.dataset.cartesInjecte = '1';
}

// ── Sauvegarde ───────────────────────────────────────────────
function themeSauvegarder() {
  localStorage.setItem(THEME_KEY, JSON.stringify(_themeActuel));
  // Sauvegarder aussi via l'API paramètres si disponible
  try {
    apiFetch('/parametres', {
      method: 'POST',
      body: JSON.stringify({ interface_theme: JSON.stringify(_themeActuel) })
    }).catch(() => {});
  } catch {}
  if (typeof afficherMessage === 'function')
    afficherMessage('✅ Thème sauvegardé', 'success');
}

// ── API publique appelée depuis l'UI ─────────────────────────

function themeAppliquerPredefini(id) {
  const t = THEMES_PREDEFINIS.find(x => x.id === id);
  if (!t) return;
  _themeActuel = {
    ..._themeActuel,
    themeId: t.id,
    couleurPrimaire: t.couleurPrimaire,
    couleurSidebar:  t.couleurSidebar,
    couleurTexte:    t.couleurTexte,
    couleurFond:     t.couleurFond,
    couleurCarte:    t.couleurCarte,
    police:          t.police,
    arrondi:         t.arrondi,
    sombre:          t.sombre
  };
  _themeAppliquer(_themeActuel);
  _themeRefreshUI();
}

function themeAppliquerLayout(layout) {
  _themeActuel.layout = layout;
  _themeAppliquerLayout(layout);
  _themeRefreshUI();
}

function themeCouleurPrimaire(val) {
  _themeActuel.couleurPrimaire = val;
  _themeActuel.themeId = 'custom';
  document.documentElement.style.setProperty('--th-primary', val);
  const hex = document.getElementById('th-hex-primaire');
  if (hex) hex.textContent = val;
}

function themeCouleurSidebar(val) {
  _themeActuel.couleurSidebar = val;
  _themeActuel.themeId = 'custom';
  document.documentElement.style.setProperty('--th-sidebar', val);
  const hex = document.getElementById('th-hex-sidebar');
  if (hex) hex.textContent = val;
}

function themeCouleurFond(val) {
  _themeActuel.couleurFond = val;
  _themeActuel.themeId = 'custom';
  document.documentElement.style.setProperty('--th-fond', val);
  document.body.style.backgroundColor = val;
}

function themePolice(val) {
  _themeActuel.police = val;
  _themeActuel.themeId = 'custom';
  document.documentElement.style.setProperty('--th-police', val);
  document.body.style.fontFamily = val;
}

function themeArrondi(val) {
  const map = { 'aucun': '0', 'leger': '0.375rem', 'moyen': '0.75rem', 'fort': '1.25rem', 'complet': '9999px' };
  const r = map[val] || val;
  _themeActuel.arrondi = r;
  _themeActuel.themeId = 'custom';
  document.documentElement.style.setProperty('--th-arrondi', r);
}

// ── Rafraîchir l'UI du panneau ───────────────────────────────
function _themeRefreshUI() {
  // Surbrillance thème actif
  document.querySelectorAll('.th-predefini-btn').forEach(b => {
    b.classList.toggle('th-actif', b.dataset.thid === _themeActuel.themeId);
  });
  // Surbrillance layout actif
  document.querySelectorAll('.th-layout-btn').forEach(b => {
    b.classList.toggle('th-layout-actif', b.dataset.layout === _themeActuel.layout);
  });
  // Sync inputs couleur
  const ip = document.getElementById('th-input-primaire');
  const is = document.getElementById('th-input-sidebar');
  const iff = document.getElementById('th-input-fond');
  if (ip) ip.value = _themeActuel.couleurPrimaire;
  if (is) is.value = _themeActuel.couleurSidebar;
  if (iff) iff.value = _themeActuel.couleurFond;
  // Hex labels
  const hp = document.getElementById('th-hex-primaire');
  const hs = document.getElementById('th-hex-sidebar');
  if (hp) hp.textContent = _themeActuel.couleurPrimaire;
  if (hs) hs.textContent = _themeActuel.couleurSidebar;
  // Police
  const selPol = document.getElementById('th-select-police');
  if (selPol) selPol.value = _themeActuel.police;
  // Arrondi
  const selArr = document.getElementById('th-select-arrondi');
  if (selArr) {
    const revMap = { '0':'aucun','0.375rem':'leger','0.75rem':'moyen','1.25rem':'fort','9999px':'complet' };
    selArr.value = revMap[_themeActuel.arrondi] || 'moyen';
  }
}

// ── Génère le HTML du panneau (appelé depuis ongletParam) ────
function themeRendreUI() {
  const conteneur = document.getElementById('param-apparence');
  if (!conteneur || conteneur.dataset.rendu) { _themeRefreshUI(); return; }
  conteneur.dataset.rendu = '1';

  conteneur.innerHTML = `
    <!-- Disposition -->
    <div class="card mb-4">
      <h3 class="text-lg font-semibold mb-4 flex items-center gap-2">
        <i class="fa fa-th-large text-primary"></i> Disposition de l'interface
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        ${LAYOUTS.map(l => `
          <button class="th-layout-btn border-2 rounded-xl p-4 text-left hover:shadow-md transition-all ${_themeActuel.layout === l.id ? 'th-layout-actif' : 'border-gray-200'}"
            data-layout="${l.id}" onclick="themeAppliquerLayout('${l.id}')">
            <div class="mb-3 rounded-lg overflow-hidden" style="--th-primary:${_themeActuel.couleurPrimaire};--th-sidebar:${_themeActuel.couleurSidebar}">
              ${l.preview}
            </div>
            <div class="font-semibold text-sm text-gray-800">${l.nom}</div>
            <div class="text-xs text-gray-400 mt-0.5">${l.description}</div>
          </button>
        `).join('')}
      </div>
    </div>

    <!-- Thèmes prédéfinis -->
    <div class="card mb-4">
      <h3 class="text-lg font-semibold mb-4 flex items-center gap-2">
        <i class="fa fa-paint-brush text-primary"></i> Thèmes prédéfinis
      </h3>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
        ${THEMES_PREDEFINIS.map(t => `
          <button class="th-predefini-btn border-2 rounded-xl p-3 text-left hover:shadow-md transition-all ${_themeActuel.themeId === t.id ? 'th-actif' : 'border-gray-200'}"
            data-thid="${t.id}" onclick="themeAppliquerPredefini('${t.id}')">
            <div class="flex items-center gap-2 mb-2">
              <div class="w-8 h-8 rounded-full shadow flex items-center justify-center text-sm" style="background:${t.couleurSidebar}">${t.emoji}</div>
              <div class="flex gap-1">
                <div class="w-4 h-4 rounded-full" style="background:${t.couleurPrimaire}"></div>
                <div class="w-4 h-4 rounded-full" style="background:${t.couleurFond};border:1px solid #e5e7eb"></div>
              </div>
            </div>
            <div class="text-xs font-semibold text-gray-700">${t.nom}</div>
          </button>
        `).join('')}
      </div>
    </div>

    <!-- Personnalisation fine -->
    <div class="grid md:grid-cols-2 gap-4">
      <div class="card">
        <h3 class="text-lg font-semibold mb-4 flex items-center gap-2">
          <i class="fa fa-sliders text-primary"></i> Couleurs personnalisées
        </h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-600 mb-1">Couleur principale</label>
            <div class="flex items-center gap-3">
              <input type="color" id="th-input-primaire" value="${_themeActuel.couleurPrimaire}"
                class="w-12 h-10 rounded cursor-pointer border" oninput="themeCouleurPrimaire(this.value)">
              <span id="th-hex-primaire" class="text-sm font-mono text-gray-500">${_themeActuel.couleurPrimaire}</span>
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-600 mb-1">Couleur sidebar / barre</label>
            <div class="flex items-center gap-3">
              <input type="color" id="th-input-sidebar" value="${_themeActuel.couleurSidebar}"
                class="w-12 h-10 rounded cursor-pointer border" oninput="themeCouleurSidebar(this.value)">
              <span id="th-hex-sidebar" class="text-sm font-mono text-gray-500">${_themeActuel.couleurSidebar}</span>
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-600 mb-1">Couleur de fond</label>
            <div class="flex items-center gap-3">
              <input type="color" id="th-input-fond" value="${_themeActuel.couleurFond}"
                class="w-12 h-10 rounded cursor-pointer border" oninput="themeCouleurFond(this.value)">
            </div>
          </div>
        </div>
      </div>

      <div class="card">
        <h3 class="text-lg font-semibold mb-4 flex items-center gap-2">
          <i class="fa fa-font text-primary"></i> Typographie & Style
        </h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-600 mb-1">Police</label>
            <select id="th-select-police" class="w-full border rounded-lg p-2 text-sm" onchange="themePolice(this.value)">
              <option value="Inter, sans-serif">Inter (défaut)</option>
              <option value="'Roboto', sans-serif">Roboto</option>
              <option value="'Poppins', sans-serif">Poppins</option>
              <option value="Georgia, serif">Georgia (sérif)</option>
              <option value="'Courier New', monospace">Courier (mono)</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-600 mb-1">Arrondi des éléments</label>
            <select id="th-select-arrondi" class="w-full border rounded-lg p-2 text-sm" onchange="themeArrondi(this.value)">
              <option value="aucun">Aucun (carré)</option>
              <option value="leger">Léger</option>
              <option value="moyen" selected>Moyen (défaut)</option>
              <option value="fort">Fort</option>
              <option value="complet">Complet (pilule)</option>
            </select>
          </div>
          <div class="bg-gray-50 rounded-xl p-3">
            <p class="text-xs font-medium text-gray-500 mb-2">Aperçu</p>
            <div class="flex gap-2 items-center">
              <div class="px-3 py-1.5 text-white text-xs font-medium" style="background:var(--th-primary,#165DFF);border-radius:var(--th-arrondi,0.75rem)">Bouton</div>
              <div class="w-6 h-6" style="background:var(--th-sidebar,#0f2d6b);border-radius:var(--th-arrondi,0.75rem)"></div>
              <div class="px-2 py-1 text-xs border" style="border-radius:var(--th-arrondi,0.75rem)">Carte</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bouton sauvegarde -->
    <div class="mt-4 flex justify-end">
      <button onclick="themeSauvegarder()" class="bg-primary text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-primary/90 flex items-center gap-2 shadow">
        <i class="fa fa-save"></i> Sauvegarder le thème
      </button>
    </div>
  `;

  _themeRefreshUI();
}
