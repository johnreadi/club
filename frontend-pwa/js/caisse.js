// === Caisse & Ventes ===
let panier = [];
let produitsCaisse = [];
let scanCaisseBuffer = '';
let scanCaisseTimer = null;
let categorieActive = '';

// Couleurs par catégorie (auto-générées au besoin)
const COULEURS_CAT = ['bg-blue-100 text-blue-800','bg-purple-100 text-purple-800',
  'bg-green-100 text-green-800','bg-orange-100 text-orange-800',
  'bg-pink-100 text-pink-800','bg-teal-100 text-teal-800','bg-yellow-100 text-yellow-800'];
const mapCouleurCat = {};

function couleurCat(cat) {
  if (!cat) return 'bg-gray-100 text-gray-600';
  if (!mapCouleurCat[cat]) {
    const idx = Object.keys(mapCouleurCat).length % COULEURS_CAT.length;
    mapCouleurCat[cat] = COULEURS_CAT[idx];
  }
  return mapCouleurCat[cat];
}

document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('scan-produit');
  if (input) {
    input.addEventListener('keydown', gererScanManuel);
    input.addEventListener('input', rechercheLive);
    input.addEventListener('blur', () => setTimeout(() => fermerDropdown(), 200));
  }
  document.addEventListener('keydown', intercepterScanCaisse);
  afficherPanier();
});

// ── Recherche live avec dropdown ──────────────────────────────────────────────
function rechercheLive(e) {
  const q = e.target.value.trim().toLowerCase();
  const dd = document.getElementById('caisse-dropdown');
  if (!dd) return;
  if (q.length < 1) { fermerDropdown(); afficherGrille(); return; }

  const resultats = produitsCaisse.filter(p =>
    p.nom.toLowerCase().includes(q) ||
    (p.reference || '').toLowerCase().includes(q) ||
    (p.code_barre || '').includes(q) ||
    (p.categorie || '').toLowerCase().includes(q) ||
    (p.description || '').toLowerCase().includes(q)
  ).slice(0, 8);

  if (resultats.length === 0) {
    dd.innerHTML = `<div class="p-3 text-gray-400 text-sm text-center">Aucun produit trouvé</div>`;
  } else {
    dd.innerHTML = resultats.map(p => {
      const stock = p.quantite_stock <= 0
        ? `<span class="text-red-500 text-xs">Rupture</span>`
        : `<span class="text-green-600 text-xs">${p.quantite_stock} en stock</span>`;
      const cat = p.categorie ? `<span class="text-xs px-1.5 py-0.5 rounded ${couleurCat(p.categorie)} mr-1">${p.categorie}</span>` : '';
      return `<div class="flex items-center gap-2 px-3 py-2 hover:bg-primary/10 cursor-pointer border-b last:border-0 transition-colors"
               onclick="selectionnerProduitDropdown(${p.id})">
        <div class="flex-1 min-w-0">
          <div class="font-medium text-sm truncate">${p.nom}</div>
          <div class="text-xs text-gray-400 flex items-center gap-1 mt-0.5">${cat}${p.description ? `<span class="truncate">${p.description}</span>` : ''}</div>
        </div>
        <div class="text-right shrink-0">
          <div class="font-bold text-primary">${parseFloat(p.prix_vente).toFixed(2)} €</div>
          ${stock}
        </div>
      </div>`;
    }).join('');
  }
  dd.classList.remove('hidden');
}

function fermerDropdown() {
  document.getElementById('caisse-dropdown')?.classList.add('hidden');
}

function selectionnerProduitDropdown(id) {
  const p = produitsCaisse.find(x => x.id === id);
  if (!p) return;
  fermerDropdown();
  document.getElementById('scan-produit').value = '';
  afficherGrille();
  if (p.quantite_stock <= 0) { afficherMessage(`⚠️ Stock épuisé : ${p.nom}`, 'warning'); return; }
  ajouterAuPanier(p);
}

// ── Grille produits ───────────────────────────────────────────────────────────
function afficherFiltresCategories() {
  const cats = [...new Set(produitsCaisse.map(p => p.categorie).filter(Boolean))].sort();
  const div = document.getElementById('cat-filtres');
  if (!div) return;
  div.innerHTML = cats.map(c =>
    `<button onclick="filtrerCategorie('${c}')" id="cat-btn-${c.replace(/\s+/g,'-')}"
      class="cat-btn px-3 py-1 rounded-full text-sm border ${couleurCat(c)} hover:opacity-80 transition-opacity">${c}</button>`
  ).join('');
}

function filtrerCategorie(cat) {
  categorieActive = cat;
  document.querySelectorAll('.cat-btn').forEach(b => {
    b.classList.remove('ring-2', 'ring-offset-1', 'ring-primary');
  });
  const btn = cat ? document.getElementById(`cat-btn-${cat.replace(/\s+/g,'-')}`)
                  : document.getElementById('cat-btn-tous');
  btn?.classList.add('ring-2', 'ring-offset-1', 'ring-primary');
  afficherGrille();
}

function afficherGrille() {
  const grille = document.getElementById('grille-produits');
  if (!grille) return;
  const liste = categorieActive
    ? produitsCaisse.filter(p => p.categorie === categorieActive)
    : produitsCaisse;

  if (liste.length === 0) {
    grille.innerHTML = `<div class="col-span-3 text-center py-6 text-gray-400 text-sm">
      <i class="fa fa-box-open text-2xl mb-1 block"></i>Aucun produit${categorieActive ? ` dans "${categorieActive}"` : ''}</div>`;
    return;
  }
  grille.innerHTML = liste.map(p => {
    const rupture = p.quantite_stock <= 0;
    const alerte = p.quantite_stock > 0 && p.quantite_stock <= (p.seuil_alerte || 5);
    const badgeStock = rupture
      ? `<span class="absolute top-1 right-1 bg-red-500 text-white text-xs px-1.5 rounded-full">Rupture</span>`
      : alerte
        ? `<span class="absolute top-1 right-1 bg-orange-400 text-white text-xs px-1.5 rounded-full">${p.quantite_stock}</span>`
        : `<span class="absolute top-1 right-1 bg-green-500 text-white text-xs px-1.5 rounded-full">${p.quantite_stock}</span>`;
    const catBadge = p.categorie
      ? `<span class="text-xs px-1.5 py-0.5 rounded ${couleurCat(p.categorie)}">${p.categorie}</span>` : '';
    return `<button onclick="cliquerProduitGrille(${p.id})"
      class="card p-3 text-left relative hover:shadow-md hover:border-primary/50 border-2 border-transparent transition-all ${rupture ? 'opacity-50 cursor-not-allowed' : 'active:scale-95'}"
      ${rupture ? 'disabled' : ''}>
      ${badgeStock}
      <div class="font-semibold text-sm leading-tight mb-1">${p.nom}</div>
      ${p.description ? `<div class="text-xs text-gray-400 italic truncate mb-1">${p.description}</div>` : ''}
      <div class="flex items-center justify-between mt-1">
        ${catBadge}
        <span class="font-bold text-primary ml-auto">${parseFloat(p.prix_vente).toFixed(2)} €</span>
      </div>
    </button>`;
  }).join('');
}

function cliquerProduitGrille(id) {
  const p = produitsCaisse.find(x => x.id === id);
  if (!p || p.quantite_stock <= 0) return;
  ajouterAuPanier(p);
  // Flash visuel sur la carte
  const btns = document.querySelectorAll('#grille-produits button');
  btns.forEach(b => { if (b.onclick?.toString().includes(`(${id})`)) {
    b.classList.add('border-green-400', 'bg-green-50');
    setTimeout(() => b.classList.remove('border-green-400', 'bg-green-50'), 400);
  }});
}

// ── Douchette ─────────────────────────────────────────────────────────────────
function intercepterScanCaisse(e) {
  const sectionCaisse = document.getElementById('caisse');
  if (!sectionCaisse || sectionCaisse.classList.contains('hidden')) return;
  const focused = document.activeElement;
  if (focused && focused.id === 'scan-produit') return;
  const tag = focused?.tagName;
  if (tag === 'BUTTON' || tag === 'SELECT') return;

  if (e.key === 'Enter') {
    if (scanCaisseBuffer.length > 2) traiterScanCaisse(scanCaisseBuffer);
    scanCaisseBuffer = '';
    clearTimeout(scanCaisseTimer);
    return;
  }
  if (e.key.length === 1) {
    scanCaisseBuffer += e.key;
    clearTimeout(scanCaisseTimer);
    scanCaisseTimer = setTimeout(() => { scanCaisseBuffer = ''; }, 500);
  }
}

async function gererScanManuel(e) {
  if (e.key !== 'Enter') return;
  e.preventDefault();
  const code = e.target.value.trim();
  if (!code) return;
  e.target.value = '';
  fermerDropdown();
  await traiterScanCaisse(code);
}

async function traiterScanCaisse(code) {
  try {
    let produit = produitsCaisse.find(p =>
      p.code_barre === code || p.reference === code ||
      p.nom.toLowerCase() === code.toLowerCase()
    );
    if (!produit) {
      produit = await apiFetch('/stock/scan/' + encodeURIComponent(code));
      const idx = produitsCaisse.findIndex(p => p.id === produit.id);
      if (idx >= 0) produitsCaisse[idx] = produit; else produitsCaisse.push(produit);
    }
    if (produit.quantite_stock <= 0) {
      afficherMessage(`⚠️ Stock épuisé : ${produit.nom}`, 'warning'); return;
    }
    ajouterAuPanier(produit);
    afficherMessage(`✅ ${produit.nom} ajouté`, 'success');
  } catch {
    afficherMessage('❌ Produit non trouvé : ' + code, 'danger');
  }
}

// ── Chargement ────────────────────────────────────────────────────────────────
async function chargerVentesCaisse() {
  demarrerHorloge();
  try {
    produitsCaisse = await apiFetch('/stock') || [];
    afficherFiltresCategories();
    filtrerCategorie('');
    const ventes = await apiFetch('/ventes') || [];
    const conteneur = document.getElementById('dernieres-ventes-caisse');
    if (conteneur) {
      conteneur.innerHTML = ventes.slice(0, 15).map(v =>
        `<div class="flex justify-between items-center border-b py-1.5 last:border-0">
          <div>
            <div class="text-gray-700">${new Date(v.date_vente).toLocaleString('fr-FR',{day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'})}</div>
            <div class="text-gray-400">${v.mode_paiement}</div>
          </div>
          <span class="font-semibold text-primary">${parseFloat(v.montant_total).toFixed(2)} €</span>
        </div>`
      ).join('') || '<p class="text-gray-400 text-center py-2">Aucune vente</p>';
    }
  } catch {}
}

// ── Panier ────────────────────────────────────────────────────────────────────
function ajouterAuPanier(produit) {
  const ligne = panier.find(l => l.produit_id === produit.id);
  if (ligne) {
    ligne.quantite++;
  } else {
    panier.push({ produit_id: produit.id, nom: produit.nom, description: produit.description || '', prix_unitaire: parseFloat(produit.prix_vente), quantite: 1 });
  }
  afficherPanier();
}

function afficherPanier() {
  const conteneur = document.getElementById('panier');
  if (!conteneur) return;
  const total = panier.reduce((s, l) => s + l.prix_unitaire * l.quantite, 0);
  const nbArticles = panier.reduce((s, l) => s + l.quantite, 0);

  conteneur.innerHTML = panier.length === 0
    ? `<div class="text-center py-8 text-gray-400"><i class="fa fa-shopping-cart text-3xl mb-2 block opacity-30"></i>Panier vide<br><span class="text-xs">Cliquer sur un produit ou scanner</span></div>`
    : panier.map((l, i) => `
      <div class="flex items-center gap-2 py-2 border-b last:border-0">
        <div class="flex-1 min-w-0">
          <div class="font-medium text-sm leading-tight">${l.nom}</div>
          ${l.description ? `<div class="text-xs text-gray-400 italic truncate">${l.description}</div>` : ''}
        </div>
        <div class="flex items-center gap-1 shrink-0">
          <button onclick="changerQte(${i},-1)" class="w-7 h-7 rounded-full bg-gray-100 hover:bg-red-100 hover:text-red-600 font-bold text-base leading-none transition-colors">−</button>
          <span class="w-8 text-center font-semibold">${l.quantite}</span>
          <button onclick="changerQte(${i},1)" class="w-7 h-7 rounded-full bg-gray-100 hover:bg-green-100 hover:text-green-600 font-bold text-base leading-none transition-colors">+</button>
        </div>
        <span class="w-16 text-right font-semibold text-sm text-primary shrink-0">${(l.prix_unitaire * l.quantite).toFixed(2)} €</span>
        <button onclick="supprimerLigne(${i})" class="text-gray-300 hover:text-red-500 transition-colors text-lg leading-none shrink-0">×</button>
      </div>`).join('');

  document.getElementById('montant-total').textContent = total.toFixed(2) + ' €';
  const totalEnc = document.getElementById('total-encaissement');
  if (totalEnc) totalEnc.textContent = total.toFixed(2) + ' €';
  const nb = document.getElementById('panier-nb-articles');
  if (nb) nb.textContent = nbArticles;
}

function changerQte(index, delta) {
  panier[index].quantite += delta;
  if (panier[index].quantite <= 0) panier.splice(index, 1);
  afficherPanier();
}

function supprimerLigne(index) {
  panier.splice(index, 1);
  afficherPanier();
}

function viderPanier() {
  if (panier.length === 0) return;
  if (!confirm('Vider le panier ?')) return;
  panier = [];
  annulerEspeces();
  afficherPanier();
}

// ── Horloge ───────────────────────────────────────────────────────────────────
let _horlogeTimer = null;
function demarrerHorloge() {
  const el = document.getElementById('caisse-horloge');
  if (!el) return;
  const tick = () => { el.textContent = new Date().toLocaleTimeString('fr-FR'); };
  tick();
  clearInterval(_horlogeTimer);
  _horlogeTimer = setInterval(tick, 1000);
}

// ── Encaissement espèces ──────────────────────────────────────────────────────
const BILLETS = [5, 10, 20, 50, 100, 200];

function ouvrirEncaissement(mode) {
  if (panier.length === 0) return afficherMessage('⚠️ Panier vide', 'warning');
  if (mode !== 'Espèces') { validerVente(mode); return; }

  const total = panier.reduce((s, l) => s + l.prix_unitaire * l.quantite, 0);
  const bloc = document.getElementById('bloc-monnaie');
  const input = document.getElementById('montant-remis');
  const rendu = document.getElementById('rendu-monnaie');
  const raccourcis = document.getElementById('raccourcis-billets');

  // Raccourcis billets arrondi sup
  const billetsUtiles = BILLETS.filter(b => b >= total);
  if (billetsUtiles.length === 0) billetsUtiles.push(...BILLETS.slice(-2));
  raccourcis.innerHTML = billetsUtiles.slice(0, 4).map(b =>
    `<button onclick="definirMontantRemis(${b})"
      class="border rounded-lg py-1.5 text-sm font-semibold hover:bg-green-50 hover:border-green-400 transition-colors">${b} €</button>`
  ).join('');

  input.value = '';
  rendu.classList.add('hidden');
  bloc.classList.remove('hidden');
  document.getElementById('btn-valider-especes').classList.remove('hidden');
  document.getElementById('btn-annuler-especes').classList.remove('hidden');
  input.focus();
}

function definirMontantRemis(val) {
  document.getElementById('montant-remis').value = val;
  calculerMonnaie();
}

function calculerMonnaie() {
  const total = panier.reduce((s, l) => s + l.prix_unitaire * l.quantite, 0);
  const remis = parseFloat(document.getElementById('montant-remis').value) || 0;
  const renduEl = document.getElementById('rendu-monnaie');
  const montantRenduEl = document.getElementById('montant-rendu');
  if (remis <= 0) { renduEl.classList.add('hidden'); return; }
  const rendu = remis - total;
  montantRenduEl.textContent = (rendu >= 0 ? rendu : 0).toFixed(2) + ' €';
  montantRenduEl.className = rendu >= 0
    ? 'text-2xl font-bold text-green-600'
    : 'text-2xl font-bold text-red-500';
  if (rendu < 0) {
    montantRenduEl.textContent = '⚠️ Insuffisant : ' + Math.abs(rendu).toFixed(2) + ' € manquants';
  }
  renduEl.classList.remove('hidden');
}

function annulerEspeces() {
  document.getElementById('bloc-monnaie')?.classList.add('hidden');
  document.getElementById('btn-valider-especes')?.classList.add('hidden');
  document.getElementById('btn-annuler-especes')?.classList.add('hidden');
  document.getElementById('rendu-monnaie')?.classList.add('hidden');
  const i = document.getElementById('montant-remis');
  if (i) i.value = '';
}

function validerEspeces() {
  const total = panier.reduce((s, l) => s + l.prix_unitaire * l.quantite, 0);
  const remis = parseFloat(document.getElementById('montant-remis').value) || 0;
  if (remis < total) return afficherMessage('⚠️ Montant insuffisant', 'warning');
  const rendu = (remis - total).toFixed(2);
  validerVente('Espèces', remis, rendu);
}

// ── Validation vente ──────────────────────────────────────────────────────────
let derniereVente = null;

async function validerVente(modePaiement, montantRemis, montantRendu) {
  if (panier.length === 0) return afficherMessage('⚠️ Panier vide', 'warning');
  const montant_total = panier.reduce((s, l) => s + l.prix_unitaire * l.quantite, 0);
  const articles = panier.map(l => ({ produit_id: l.produit_id, quantite: l.quantite, prix_unitaire: l.prix_unitaire }));
  try {
    const vente = await apiFetch('/ventes', {
      method: 'POST',
      body: JSON.stringify({ articles, montant_total, mode_paiement: modePaiement })
    });
    derniereVente = {
      ...vente,
      lignes: panier.map(l => ({ ...l })),
      montant_total,
      mode_paiement: modePaiement,
      montant_remis: montantRemis || null,
      montant_rendu: montantRendu || null
    };
    articles.forEach(a => {
      const p = produitsCaisse.find(x => x.id === a.produit_id);
      if (p) p.quantite_stock = Math.max(0, p.quantite_stock - a.quantite);
    });
    afficherGrille();
    annulerEspeces();
    panier = [];
    afficherPanier();
    afficherMessage('✅ Vente enregistrée', 'success');
    imprimerTicket(derniereVente);
    await chargerVentesCaisse();
  } catch {}
}

function imprimerDernierTicket() {
  if (!derniereVente) return afficherMessage('⚠️ Aucune vente en cours de session', 'warning');
  imprimerTicket(derniereVente);
}

// ── Aperçu modal ──────────────────────────────────────────────────────────────
function fermerApercu() {
  document.getElementById('modal-apercu')?.classList.add('hidden');
}

function apercuTicket() {
  const vente = derniereVente || { lignes: panier.map(l => ({...l})), montant_total: panier.reduce((s,l)=>s+l.prix_unitaire*l.quantite,0), mode_paiement:'—', montant_remis: null, montant_rendu: null };
  const utilisateur = JSON.parse(localStorage.getItem('utilisateur') || '{}');
  const clubNom = utilisateur.club_nom || 'Club Sportif';
  const lignesHtml = (vente.lignes || []).map(l =>
    `<div style="border-bottom:1px dashed #ddd;padding:5px 0;font-size:13px;">
      <div style="font-weight:600;">${l.nom}</div>
      ${l.description ? `<div style="font-size:11px;color:#888;font-style:italic;">${l.description}</div>` : ''}
      <div style="display:flex;justify-content:space-between;margin-top:2px;">
        <span style="color:#666;">${l.quantite} × ${parseFloat(l.prix_unitaire).toFixed(2)} €</span>
        <strong>${(l.quantite * parseFloat(l.prix_unitaire)).toFixed(2)} €</strong>
      </div>
    </div>`
  ).join('');
  const renduHtml = vente.montant_remis
    ? `<div style="margin-top:6px;font-size:12px;color:#555;">Remis : <strong>${parseFloat(vente.montant_remis).toFixed(2)} €</strong> — Rendu : <strong style="color:#16a34a;">${parseFloat(vente.montant_rendu||0).toFixed(2)} €</strong></div>` : '';

  document.getElementById('modal-apercu-titre').textContent = 'Aperçu ticket thermique';
  document.getElementById('modal-apercu-contenu').innerHTML = `
    <div style="font-family:monospace;font-size:12px;max-width:280px;margin:0 auto;">
      <div style="text-align:center;font-size:16px;font-weight:bold;margin-bottom:4px;">${clubNom}</div>
      <div style="text-align:center;font-size:10px;color:#888;margin-bottom:8px;">${new Date().toLocaleString('fr-FR')}</div>
      <hr style="border:none;border-top:1px dashed #ccc;margin:4px 0;">
      ${lignesHtml}
      <hr style="border:none;border-top:1px dashed #ccc;margin:8px 0 4px;">
      <div style="display:flex;justify-content:space-between;font-size:15px;font-weight:bold;">
        <span>TOTAL</span><span>${parseFloat(vente.montant_total).toFixed(2)} €</span>
      </div>
      <div style="font-size:12px;color:#555;margin-top:2px;">Règlement : ${vente.mode_paiement}</div>
      ${renduHtml}
      <div style="text-align:center;margin-top:12px;font-size:11px;color:#888;">Merci de votre visite !</div>
    </div>`;
  document.getElementById('modal-btn-imprimer').onclick = () => { fermerApercu(); imprimerDernierTicket(); };
  document.getElementById('modal-apercu').classList.remove('hidden');
}

async function apercuFactureA4() {
  const vente = derniereVente;
  if (!vente) return afficherMessage('⚠️ Aucune vente enregistrée en session', 'warning');
  const utilisateur = JSON.parse(localStorage.getItem('utilisateur') || '{}');
  const clubNom = utilisateur.club_nom || 'Club Sportif';
  const now = new Date(vente.date_vente || Date.now());
  const dateStr = now.toLocaleDateString('fr-FR');
  const numFacture = 'FAC-' + (vente.id || '?') + '-' + now.getFullYear();
  let lignes = vente.lignes || [];
  try {
    const d = await apiFetch('/ventes/' + vente.id);
    if (d?.lignes) lignes = d.lignes.map(l => ({ nom: l.produit_nom, description: l.description||'', reference: l.reference||'', quantite: l.quantite, prix_unitaire: l.prix_unitaire }));
  } catch {}

  const lignesHtml = lignes.map((l,i) => {
    const tot = (parseFloat(l.prix_unitaire)*parseInt(l.quantite||1)).toFixed(2);
    return `<tr style="border-bottom:1px solid #eee;">
      <td style="padding:5px 4px;font-size:11px;color:#aaa;">${i+1}</td>
      <td style="padding:5px 4px;"><strong>${l.nom||''}</strong>${l.description?`<br><em style="font-size:10px;color:#888;">${l.description}</em>`:''}<br><span style="font-size:10px;color:#bbb;">Réf: ${l.reference||'-'}</span></td>
      <td style="padding:5px 4px;text-align:right;">${parseFloat(l.prix_unitaire).toFixed(2)} €</td>
      <td style="padding:5px 4px;text-align:center;">${l.quantite}</td>
      <td style="padding:5px 4px;text-align:right;font-weight:bold;">${tot} €</td>
    </tr>`;
  }).join('');
  const sousTotal = lignes.reduce((s,l) => s + parseFloat(l.prix_unitaire)*parseInt(l.quantite||1), 0);
  const renduHtml = vente.montant_remis ? `<p style="margin-top:8px;font-size:11px;color:#555;">Remis : <strong>${parseFloat(vente.montant_remis).toFixed(2)} €</strong> — Monnaie rendue : <strong style="color:#16a34a;">${parseFloat(vente.montant_rendu||0).toFixed(2)} €</strong></p>` : '';

  document.getElementById('modal-apercu-titre').textContent = 'Aperçu Facture A4';
  document.getElementById('modal-apercu-contenu').innerHTML = `
    <div style="font-family:Arial,sans-serif;font-size:11px;">
      <div style="display:flex;justify-content:space-between;border-bottom:3px solid #165DFF;padding-bottom:10px;margin-bottom:12px;">
        <div><strong style="font-size:16px;color:#165DFF;">${clubNom}</strong><br><span style="color:#888;">${utilisateur.email||''}</span></div>
        <div style="text-align:right;"><strong style="font-size:14px;">FACTURE</strong><br><span style="color:#666;">N° ${numFacture}</span><br><span style="color:#666;">${dateStr}</span></div>
      </div>
      <table style="width:100%;border-collapse:collapse;margin-bottom:10px;">
        <thead><tr style="background:#165DFF;color:white;">
          <th style="padding:5px 4px;text-align:left;font-size:10px;">#</th>
          <th style="padding:5px 4px;text-align:left;font-size:10px;">Désignation</th>
          <th style="padding:5px 4px;text-align:right;font-size:10px;">P.U.</th>
          <th style="padding:5px 4px;text-align:center;font-size:10px;">Qté</th>
          <th style="padding:5px 4px;text-align:right;font-size:10px;">Total</th>
        </tr></thead>
        <tbody>${lignesHtml}</tbody>
      </table>
      <div style="text-align:right;">
        <table style="display:inline-table;min-width:200px;border-collapse:collapse;">
          <tr><td style="padding:3px 6px;">HT</td><td style="padding:3px 6px;text-align:right;">${(sousTotal/1.2).toFixed(2)} €</td></tr>
          <tr><td style="padding:3px 6px;">TVA 20%</td><td style="padding:3px 6px;text-align:right;">${(sousTotal*0.2/1.2).toFixed(2)} €</td></tr>
          <tr style="background:#165DFF;color:white;font-weight:bold;"><td style="padding:5px 6px;">TOTAL TTC</td><td style="padding:5px 6px;text-align:right;">${sousTotal.toFixed(2)} €</td></tr>
        </table>
      </div>
      <p style="margin-top:6px;font-size:11px;color:#555;">Règlement : <strong>${vente.mode_paiement}</strong></p>
      ${renduHtml}
    </div>`;
  document.getElementById('modal-btn-imprimer').onclick = () => { fermerApercu(); genererFactureA4(); };
  document.getElementById('modal-apercu').classList.remove('hidden');
}

async function genererFactureA4() {
  if (!derniereVente) return afficherMessage('⚠️ Aucune vente en cours de session', 'warning');
  const utilisateur = JSON.parse(localStorage.getItem('utilisateur') || '{}');
  const clubNom = utilisateur.club_nom || 'Club Sportif';
  const now = new Date();
  const dateStr = now.toLocaleDateString('fr-FR');
  const heureStr = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  const numFacture = 'FAC-' + derniereVente.id + '-' + now.getFullYear();

  // Récupérer les lignes détaillées depuis l'API si possible
  let lignes = derniereVente.lignes || [];
  try {
    const detail = await apiFetch('/ventes/' + derniereVente.id);
    if (detail && detail.lignes) lignes = detail.lignes.map(l => ({
      nom: l.produit_nom,
      description: l.description || '',
      reference: l.reference || '',
      quantite: l.quantite,
      prix_unitaire: l.prix_unitaire,
      code_barre: l.code_barre || ''
    }));
  } catch {}

  const lignesHtml = lignes.map((l, i) => {
    const total = (parseFloat(l.prix_unitaire) * parseInt(l.quantite || 1)).toFixed(2);
    const desc = l.description ? `<br><span style="font-size:10px;color:#666;font-style:italic;">${l.description}</span>` : '';
    return `<tr style="border-bottom:1px solid #eee;">
      <td style="padding:6px 4px;font-size:11px;color:#999;">${i + 1}</td>
      <td style="padding:6px 4px;">
        <strong>${l.nom || l.produit_nom || ''}</strong>${desc}
        <div style="font-size:10px;color:#aaa;">Réf: ${l.reference || '-'}</div>
      </td>
      <td style="padding:6px 4px;text-align:right;">${parseFloat(l.prix_unitaire).toFixed(2)} €</td>
      <td style="padding:6px 4px;text-align:center;">${l.quantite}</td>
      <td style="padding:6px 4px;text-align:right;font-weight:bold;">${total} €</td>
    </tr>`;
  }).join('');

  const sousTotal = lignes.reduce((s, l) => s + parseFloat(l.prix_unitaire) * parseInt(l.quantite || 1), 0);
  const tva = sousTotal * 0.20;
  const ttc = sousTotal;

  const fenetre = window.open('', '_blank', 'width=820,height=1100');
  if (!fenetre) return;
  fenetre.document.write(`<!DOCTYPE html><html><head>
    <meta charset="UTF-8">
    <style>
      * { margin:0; padding:0; box-sizing:border-box; }
      body { font-family: Arial, sans-serif; font-size:12px; color:#222; padding:20px 30px; }
      .header { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:30px; border-bottom:3px solid #165DFF; padding-bottom:16px; }
      .club-nom { font-size:22px; font-weight:bold; color:#165DFF; }
      .facture-titre { font-size:18px; font-weight:bold; color:#333; text-align:right; }
      .facture-num { font-size:11px; color:#666; text-align:right; margin-top:4px; }
      .infos { display:flex; justify-content:space-between; margin-bottom:24px; }
      .bloc { background:#f7f9fc; border-radius:6px; padding:10px 14px; min-width:200px; }
      .bloc-titre { font-size:10px; color:#999; text-transform:uppercase; margin-bottom:4px; }
      table { width:100%; border-collapse:collapse; margin-bottom:16px; }
      thead tr { background:#165DFF; color:white; }
      thead th { padding:8px 6px; font-size:11px; text-align:left; }
      thead th:last-child, thead th:nth-child(3), thead th:nth-child(4) { text-align:right; }
      .total-bloc { display:flex; justify-content:flex-end; margin-top:8px; }
      .total-table { width:260px; }
      .total-table td { padding:4px 6px; font-size:12px; }
      .total-ttc { font-size:15px; font-weight:bold; background:#165DFF; color:white; }
      .total-ttc td { padding:8px 6px; }
      .footer { margin-top:40px; border-top:1px solid #eee; padding-top:10px; font-size:10px; color:#aaa; text-align:center; }
      @media print { body { padding:10px 20px; } }
    </style>
  </head><body>
    <div class="header">
      <div>
        <div class="club-nom">${clubNom}</div>
        <div style="font-size:11px;color:#666;margin-top:4px;">${utilisateur.email || ''}</div>
      </div>
      <div>
        <div class="facture-titre">FACTURE</div>
        <div class="facture-num">N° ${numFacture}</div>
        <div class="facture-num">Date : ${dateStr} à ${heureStr}</div>
      </div>
    </div>

    <div class="infos">
      <div class="bloc">
        <div class="bloc-titre">Vendeur</div>
        <strong>${utilisateur.prenom || ''} ${utilisateur.nom || ''}</strong><br>
        <span style="font-size:11px;">${clubNom}</span>
      </div>
      <div class="bloc">
        <div class="bloc-titre">Paiement</div>
        <strong>${derniereVente.mode_paiement}</strong><br>
        <span style="font-size:11px;color:#666;">Réglé le ${dateStr}</span>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th style="width:30px;">#</th>
          <th>Désignation</th>
          <th style="width:90px;text-align:right;">P.U. TTC</th>
          <th style="width:60px;text-align:center;">Qté</th>
          <th style="width:90px;text-align:right;">Total</th>
        </tr>
      </thead>
      <tbody>${lignesHtml}</tbody>
    </table>

    <div class="total-bloc">
      <table class="total-table">
        <tr><td>Sous-total HT</td><td style="text-align:right;">${(sousTotal / 1.2).toFixed(2)} €</td></tr>
        <tr><td>TVA 20%</td><td style="text-align:right;">${tva.toFixed(2)} €</td></tr>
        <tr class="total-ttc"><td>TOTAL TTC</td><td style="text-align:right;">${ttc.toFixed(2)} €</td></tr>
      </table>
    </div>

    <div class="footer">
      Document généré le ${dateStr} à ${heureStr} — ${clubNom} — Merci de votre confiance
    </div>

    <script>window.onload = function(){ window.print(); };<\/script>
  </body></html>`);
  fenetre.document.close();
}

function imprimerTicket(vente) {
  const utilisateur = JSON.parse(localStorage.getItem('utilisateur') || '{}');
  const clubNom = utilisateur.club_nom || 'GESTION DES CLUBS';
  const lignesHtml = (vente.lignes || []).map(l => {
    const p = produitsCaisse.find(x => x.id === l.produit_id);
    const code = p?.code_barre || '';
    const codeBarreHtml = code
      ? `<div style="text-align:center;margin:2px 0;"><svg class="bc-ticket" data-code="${code}" style="max-width:180px;"></svg></div>`
      : '';
    return `<div style="border-bottom:1px dashed #ccc;padding:4px 0;margin:2px 0;">
      <p style="margin:0;font-weight:bold;">${l.nom}</p>
      <p style="margin:0;">${l.quantite} × ${parseFloat(l.prix_unitaire).toFixed(2)} € = <strong>${(l.quantite * parseFloat(l.prix_unitaire)).toFixed(2)} €</strong></p>
      ${codeBarreHtml}
    </div>`;
  }).join('');

  const fenetre = window.open('', '_blank', 'width=340,height=620');
  if (!fenetre) return;
  fenetre.document.write(`<!DOCTYPE html><html><head>
    <script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.6/dist/JsBarcode.all.min.js"><\/script>
    </head><body style="margin:0;padding:8px;font-family:monospace;font-size:12px;width:280px;">
    <h3 style="text-align:center;margin:0 0 2px 0;">${clubNom}</h3>
    <p style="text-align:center;margin:2px 0;font-size:10px;">${new Date().toLocaleString('fr-FR')}</p>
    <hr style="margin:4px 0;">
    ${lignesHtml}
    <hr style="margin:4px 0;">
    <p style="text-align:right;font-size:14px;font-weight:bold;">TOTAL : ${parseFloat(vente.montant_total).toFixed(2)} €</p>
    <p style="margin:2px 0;">Règlement : ${vente.mode_paiement}</p>
    <p style="text-align:center;margin-top:8px;font-size:11px;">Merci de votre visite !</p>
    <script>
      document.querySelectorAll('.bc-ticket').forEach(function(svg){
        var code = svg.getAttribute('data-code');
        if(code) JsBarcode(svg, code, {format:'CODE128',width:1.2,height:30,displayValue:false,margin:1});
      });
      window.onload = function(){ window.print(); window.close(); };
    <\/script>
  </body></html>`);
  fenetre.document.close();
}
