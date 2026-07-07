// === Gestion du Stock ===
let produits = [];
let produitEnEdition = null;
let scanStockBuffer = '';
let scanStockTimer = null;

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('form-produit')?.addEventListener('submit', enregistrerProduit);
  document.getElementById('recherche-produit')?.addEventListener('input', e => {
    const q = e.target.value.toLowerCase();
    document.querySelectorAll('#liste-produits tr').forEach(tr => {
      tr.style.display = tr.textContent.toLowerCase().includes(q) ? '' : 'none';
    });
  });

  // Douchette globale sur la page Stock : saisie rapide clavier
  document.addEventListener('keydown', intercepterScanStock);
});

// Interception douchette : accumule les touches, détecte Enter (fin de scan)
function intercepterScanStock(e) {
  const sectionStock = document.getElementById('stock');
  if (!sectionStock || sectionStock.classList.contains('hidden')) return;
  // Ignorer si focus sur un input/textarea
  const tag = document.activeElement?.tagName;
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

  if (e.key === 'Enter') {
    if (scanStockBuffer.length > 2) {
      traiterScanStock(scanStockBuffer);
    }
    scanStockBuffer = '';
    clearTimeout(scanStockTimer);
    return;
  }
  if (e.key.length === 1) {
    scanStockBuffer += e.key;
    clearTimeout(scanStockTimer);
    scanStockTimer = setTimeout(() => { scanStockBuffer = ''; }, 500);
  }
}

async function traiterScanStock(code) {
  try {
    const produit = await apiFetch('/stock/scan/' + encodeURIComponent(code));
    // Produit trouvé → ouvrir édition
    afficherMessage(`📦 Produit scanné : ${produit.nom} (stock: ${produit.quantite_stock})`, 'info');
    editerProduit(produit.id);
  } catch (err) {
    if (err.message && err.message.includes('404')) {
      // Produit non trouvé → pré-remplir le formulaire avec le code scanné
      afficherMessage(`🔍 Code ${code} non trouvé — créez le produit`, 'warning');
      const form = document.getElementById('form-produit');
      if (form) {
        form.code_barre.value = code;
        form.nom.focus();
        form.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }
}

async function chargerStock() {
  const tbody = document.getElementById('liste-produits');
  if (tbody) tbody.innerHTML = `<tr><td colspan="6" class="text-center py-4 text-gray-400"><i class="fa fa-spinner fa-spin mr-1"></i> Chargement...</td></tr>`;
  try {
    produits = await apiFetch('/stock') || [];
    afficherListeProduits();
  } catch (err) {
    if (tbody) tbody.innerHTML =
      `<tr><td colspan="6" class="text-center py-6 text-red-500">❌ Impossible de charger le stock — ${err.message || 'Erreur réseau'}</td></tr>`;
  }
}

function afficherListeProduits() {
  const conteneur = document.getElementById('liste-produits');
  if (!conteneur) return;
  if (produits.length === 0) {
    conteneur.innerHTML = `<tr><td colspan="7" class="text-center py-6 text-gray-500">Aucun produit enregistré</td></tr>`;
    return;
  }
  conteneur.innerHTML = produits.map(p => `
    <tr class="border-b hover:bg-gray-50">
      <td class="p-2">
        <input type="checkbox" class="chk-produit rounded" data-id="${p.id}" onchange="majBoutonImpression()">
      </td>
      <td class="p-2 text-xs">${p.reference || '-'}</td>
      <td class="p-2 text-xs font-mono">${p.code_barre || '-'}</td>
      <td class="p-2 font-medium">${p.nom}</td>
      <td class="p-2 text-right">${parseFloat(p.prix_vente).toFixed(2)} €</td>
      <td class="p-2 text-right font-medium ${p.quantite_stock <= (p.seuil_alerte || 5) ? 'text-red-600' : 'text-green-700'}">${p.quantite_stock}</td>
      <td class="p-2 text-center whitespace-nowrap">
        <button onclick="editerProduit(${p.id})" class="text-blue-600 hover:text-blue-800 mr-1" title="Modifier">✏️</button>
        <button onclick="ouvrirApercuEtiquette([${p.id}])" class="text-green-600 hover:text-green-800 mr-1" title="Aperçu &amp; imprimer étiquette">🖨️</button>
        <button onclick="supprimerProduit(${p.id})" class="text-red-600 hover:text-red-800" title="Supprimer">🗑️</button>
      </td>
    </tr>
  `).join('');
  // reset checkbox global
  const chkAll = document.getElementById('chk-all');
  if (chkAll) chkAll.checked = false;
  majBoutonImpression();
}

function toggleTousCheckbox(val) {
  document.querySelectorAll('.chk-produit').forEach(c => c.checked = val);
  majBoutonImpression();
}

function majBoutonImpression() {
  const sel = document.querySelectorAll('.chk-produit:checked');
  const btn = document.getElementById('btn-imprimer-selection');
  const txt = document.getElementById('txt-imprimer-selection');
  if (!btn) return;
  if (sel.length > 0) {
    btn.classList.remove('hidden');
    if (txt) txt.textContent = `Imprimer sélection (${sel.length})`;
  } else {
    btn.classList.add('hidden');
  }
}

function imprimerSelection() {
  const ids = Array.from(document.querySelectorAll('.chk-produit:checked')).map(c => parseInt(c.dataset.id));
  if (ids.length === 0) return;
  ouvrirApercuEtiquette(ids);
}

async function enregistrerProduit(e) {
  e.preventDefault();
  const form = e.target;
  const donnees = {
    reference: form.reference.value.trim(),
    code_barre: form.code_barre.value.trim() || null,
    nom: form.nom.value.trim(),
    description: form.description.value.trim() || null,
    prix_achat: parseFloat(form.prix_achat.value) || 0,
    prix_vente: parseFloat(form.prix_vente.value) || 0,
    quantite_stock: parseInt(form.quantite.value) || 0,
    seuil_alerte: parseInt(form.seuil.value) || 5
  };
  try {
    let produitSauvegarde;
    if (produitEnEdition) {
      produitSauvegarde = await apiFetch(`/stock/${produitEnEdition}`, { method: 'PUT', body: JSON.stringify(donnees) });
      afficherMessage('✅ Produit mis à jour en base', 'success');
      produitEnEdition = null;
    } else {
      produitSauvegarde = await apiFetch('/stock', { method: 'POST', body: JSON.stringify(donnees) });
      afficherMessage('✅ Produit enregistré en base — code-barres : ' + produitSauvegarde.code_barre, 'success');
    }
    form.reset();
    document.querySelector('#form-produit button[type="submit"]').textContent = 'Enregistrer';
    await chargerStock();
  } catch {}
}

function editerProduit(id) {
  const p = produits.find(x => x.id === id);
  if (!p) return;
  produitEnEdition = id;
  const form = document.getElementById('form-produit');
  form.reference.value = p.reference || '';
  form.code_barre.value = p.code_barre || '';
  form.nom.value = p.nom;
  form.description.value = p.description || '';
  form.prix_achat.value = p.prix_achat || 0;
  form.prix_vente.value = p.prix_vente;
  form.quantite.value = p.quantite_stock;
  form.seuil.value = p.seuil_alerte || 5;
  form.querySelector('button[type="submit"]').textContent = 'Modifier le produit';
  form.scrollIntoView({ behavior: 'smooth' });
}

// ── Aperçu étiquettes ──────────────────────────────────────────────────────────
let _idsEnCours = [];

function _getCfgLive() {
  const base = window.parametresActuels || {};
  const g = (id, fb) => { const el = document.getElementById(id); return el ? el.value : (fb !== undefined ? fb : base[id]); };
  const c = (id, fb) => { const el = document.getElementById(id); return el ? el.checked : (fb !== undefined ? fb : base[id]); };
  return {
    etiquette_largeur:              parseFloat(g('etiq-largeur'))      || base.etiquette_largeur       || 60,
    etiquette_hauteur:              parseFloat(g('etiq-hauteur'))      || base.etiquette_hauteur       || 40,
    etiquette_police:               g('etiq-police')                   || base.etiquette_police        || 'Arial',
    etiquette_taille_nom:           parseInt(g('etiq-taille-nom'))     || base.etiquette_taille_nom    || 12,
    etiquette_taille_prix:          parseInt(g('etiq-taille-prix'))    || base.etiquette_taille_prix   || 16,
    etiquette_taille_code:          parseInt(g('etiq-taille-code'))    || base.etiquette_taille_code   || 9,
    etiquette_couleur_texte:        g('etiq-couleur-texte')            || base.etiquette_couleur_texte || '#000000',
    etiquette_couleur_fond:         g('etiq-couleur-fond')             || base.etiquette_couleur_fond  || '#ffffff',
    etiquette_alignement:           window.alignementActuel            || base.etiquette_alignement    || 'center',
    etiquette_afficher_prix:        c('etiq-show-prix',   base.etiquette_afficher_prix   !== false),
    etiquette_afficher_description: c('etiq-show-desc',   base.etiquette_afficher_description !== false),
    etiquette_afficher_reference:   c('etiq-show-ref',    base.etiquette_afficher_reference   !== false),
    etiquette_afficher_codebarre:   c('etiq-show-code',   base.etiquette_afficher_codebarre   !== false),
    etiquette_afficher_logo:        c('etiq-show-logo',   !!base.etiquette_afficher_logo),
    etiquette_logo_url:             g('etiq-logo-url')                 || base.etiquette_logo_url      || null,
  };
}

function ouvrirApercuEtiquette(ids) {
  _idsEnCours = ids;
  const modal = document.getElementById('modal-apercu-etiquette');
  if (modal) modal.classList.remove('hidden');
  document.getElementById('etiq-copies').value = 1;
  document.getElementById('etiq-par-ligne').value = 3;
  rafraichirApercuEtiquette();
}

function fermerApercuEtiquette() {
  const modal = document.getElementById('modal-apercu-etiquette');
  if (modal) modal.classList.add('hidden');
}

function _construireHtmlEtiquette(p, cfg) {
  const code = (p.code_barre || '').trim();
  const police = cfg.etiquette_police || 'Arial, sans-serif';
  const tNom   = parseInt(cfg.etiquette_taille_nom)  || 12;
  const tPrix  = parseInt(cfg.etiquette_taille_prix) || 16;
  const tCode  = parseInt(cfg.etiquette_taille_code) || 9;
  const coulTexte = cfg.etiquette_couleur_texte || '#000000';
  const coulFond  = cfg.etiquette_couleur_fond  || '#ffffff';
  const align     = cfg.etiquette_alignement    || 'center';
  const largeur   = Math.round((cfg.etiquette_largeur || 60) * 3.7795); // mm -> px 96dpi
  const hauteur   = Math.round((cfg.etiquette_hauteur || 40) * 3.7795);
  const showPrix  = cfg.etiquette_afficher_prix !== false;
  const showRef   = cfg.etiquette_afficher_reference !== false;
  const showDesc  = cfg.etiquette_afficher_description !== false;
  const showCode  = cfg.etiquette_afficher_codebarre !== false;
  const logoUrl   = cfg.etiquette_afficher_logo && cfg.etiquette_logo_url ? cfg.etiquette_logo_url : null;
  const uid = 'bc_' + p.id + '_' + Date.now() + '_' + Math.random().toString(36).slice(2);

  const logoHtml = logoUrl ? `<img src="${logoUrl}" style="max-height:20px;display:block;margin:0 auto 2px;">` : '';
  const refHtml  = showRef  ? `<div style="font-size:${tCode}px;color:${coulTexte};margin:1px 0;">Réf: ${p.reference || '-'}</div>` : '';
  const descHtml = showDesc && p.description ? `<div style="font-size:${tCode}px;color:${coulTexte};font-style:italic;margin:1px 0;">${p.description}</div>` : '';
  const prixHtml = showPrix ? `<div style="font-size:${tPrix}px;font-weight:900;color:${coulTexte};margin:2px 0;">${parseFloat(p.prix_vente).toFixed(2)} €</div>` : '';
  // Code-barres : SVG inline généré par JsBarcode
  const bcHtml   = showCode && code ? `<svg id="${uid}" style="display:block;margin:2px auto 0;"></svg>` : '';
  const bcScript = showCode && code ? `
    if(typeof JsBarcode!=='undefined'){
      try{
        JsBarcode('#${uid}','${code.replace(/'/g,"\\'")}',{format:'CODE128',width:1.6,height:42,displayValue:true,fontSize:${tCode},margin:2,background:'${coulFond}',lineColor:'${coulTexte}'});
      }catch(e){console.warn('JsBarcode error',e);}
    }` : '';

  return { uid, largeur, hauteur, coulFond, align, police, coulTexte,
    html: `<div id="etiq-${uid}" style="width:${largeur}px;min-height:${hauteur}px;padding:5px 6px;font-family:${police};text-align:${align};background:${coulFond};border:1px solid #bbb;box-sizing:border-box;display:inline-block;">
      ${logoHtml}
      <div style="font-size:${tNom}px;font-weight:700;color:${coulTexte};margin:1px 0;line-height:1.2;">${p.nom}</div>
      ${descHtml}${refHtml}${prixHtml}${bcHtml}
    </div>`,
    script: bcScript };
}

function rafraichirApercuEtiquette() {
  const zone = document.getElementById('apercu-etiquettes-zone');
  if (!zone) return;
  const cfg = _getCfgLive();
  const copies = Math.max(1, parseInt(document.getElementById('etiq-copies')?.value) || 1);
  const parLigne = parseInt(document.getElementById('etiq-par-ligne')?.value) || 3;

  const items = [];
  _idsEnCours.forEach(id => {
    const p = produits.find(x => x.id === id);
    if (!p) return;
    for (let c = 0; c < copies; c++) items.push(p);
  });

  let htmlAll = '';
  const scripts = [];
  items.forEach((p, idx) => {
    const { html, script } = _construireHtmlEtiquette(p, cfg);
    // Insère un saut de ligne après chaque groupe de parLigne
    const sep = (idx > 0 && idx % parLigne === 0) ? '<div style="width:100%;height:0;"></div>' : '';
    htmlAll += sep + html;
    if (script) scripts.push(script);
  });

  zone.innerHTML = htmlAll || '<p class="text-gray-400 text-sm text-center w-full py-8">Aucun produit sélectionné</p>';

  // Générer les codes-barres via JsBarcode (injecté si besoin)
  _runJsBarcode(scripts);
}

function _runJsBarcode(scripts) {
  const run = () => {
    if (!window.JsBarcode) { console.warn('JsBarcode non chargé'); return; }
    const cfg = window.parametresActuels || {};
    const tCode = parseInt(cfg.etiquette_taille_code) || 9;
    const coulFond = cfg.etiquette_couleur_fond || '#ffffff';
    const coulTexte = cfg.etiquette_couleur_texte || '#000000';
    // Générer tous les SVG présents dans la zone
    document.querySelectorAll('#apercu-etiquettes-zone svg[id^="bc_"]').forEach(svg => {
      const code = svg.closest('div')?.querySelector('[data-code]')?.dataset.code ||
        svg.id; // fallback
    });
    // Exécuter les scripts injectés
    scripts.forEach(s => {
      try { new Function('JsBarcode', s)(window.JsBarcode); } catch(e) { console.warn('script bc', e); }
    });
  };
  if (window.JsBarcode) { run(); }
  else {
    const sc = document.createElement('script');
    sc.src = 'https://cdn.jsdelivr.net/npm/jsbarcode@3.11.6/dist/JsBarcode.all.min.js';
    sc.onload = run;
    document.head.appendChild(sc);
  }
}

function lancerImpression() {
  const cfg = _getCfgLive();
  const copies = Math.max(1, parseInt(document.getElementById('etiq-copies')?.value) || 1);
  const parLigne = parseInt(document.getElementById('etiq-par-ligne')?.value) || 3;

  const items = [];
  _idsEnCours.forEach(id => {
    const p = produits.find(x => x.id === id);
    if (!p) return;
    for (let c = 0; c < copies; c++) items.push(p);
  });
  if (!items.length) return;

  const police = cfg.etiquette_police || 'Arial, sans-serif';
  const coulFond = cfg.etiquette_couleur_fond || '#ffffff';
  const coulTexte = cfg.etiquette_couleur_texte || '#000000';
  const tCode = parseInt(cfg.etiquette_taille_code) || 9;
  const parLigneNum = parLigne;

  let etiquettesHtml = '';
  const bcIds = [];
  const bcData = []; // {id, code}

  items.forEach((p, idx) => {
    const d = _construireHtmlEtiquette(p, cfg);
    etiquettesHtml += d.html;
    if (p.code_barre) bcData.push({ id: d.uid, code: (p.code_barre || '').trim() });
  });

  const bcScripts = bcData.map(({id, code}) =>
    `try{JsBarcode('#${id}','${code.replace(/'/g,"\\'").replace(/"/g,"&quot;")}',{format:'CODE128',width:1.6,height:42,displayValue:true,fontSize:${tCode},margin:2,background:'${coulFond}',lineColor:'${coulTexte}'});}catch(e){console.warn(e);}`
  ).join('\n');

  const fenetre = window.open('', '_blank', 'width=900,height=700');
  fenetre.document.write(`<!DOCTYPE html><html><head>
    <meta charset="utf-8">
    <title>Impression étiquettes</title>
    <script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.6/dist/JsBarcode.all.min.js"><\/script>
    <style>
      @media print {
        @page { margin: 8mm; }
        body { margin:0; }
        .etiq-grid { display:flex; flex-wrap:wrap; gap:3mm; }
        .no-print { display:none; }
      }
      body { font-family:${police}; background:#f5f5f5; padding:12px; }
      .etiq-grid { display:flex; flex-wrap:wrap; gap:4px; align-items:flex-start; }
      .no-print { text-align:center; margin-bottom:12px; }
      .no-print button { padding:8px 24px; background:#165DFF; color:#fff; border:none; border-radius:6px; font-size:14px; cursor:pointer; margin:0 4px; }
      .no-print button.cancel { background:#6b7280; }
    </style>
  </head><body>
    <div class="no-print">
      <strong>${items.length} étiquette${items.length>1?'s':''}</strong> —
      <button onclick="window.print()"><i>&#128424;</i> Imprimer</button>
      <button class="cancel" onclick="window.close()">Fermer</button>
    </div>
    <div class="etiq-grid">${etiquettesHtml}</div>
    <script>
      window.onload = function() {
        ${bcScripts}
      };
    <\/script>
  </body></html>`);
  fenetre.document.close();
  fermerApercuEtiquette();
}

async function supprimerProduit(id) {
  if (!confirm('Supprimer ce produit définitivement ?')) return;
  try {
    await apiFetch(`/stock/${id}`, { method: 'DELETE' });
    afficherMessage('✅ Produit supprimé', 'success');
    await chargerStock();
  } catch {}
}
