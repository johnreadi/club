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
    conteneur.innerHTML = `<tr><td colspan="6" class="text-center py-6 text-gray-500">Aucun produit enregistré</td></tr>`;
    return;
  }
  conteneur.innerHTML = produits.map(p => `
    <tr class="border-b hover:bg-gray-50">
      <td class="p-2 text-xs">${p.reference || '-'}</td>
      <td class="p-2 text-xs font-mono">${p.code_barre || '-'}</td>
      <td class="p-2 font-medium">${p.nom}</td>
      <td class="p-2 text-right">${parseFloat(p.prix_vente).toFixed(2)} €</td>
      <td class="p-2 text-right font-medium ${p.quantite_stock <= (p.seuil_alerte || 5) ? 'text-red-600' : 'text-green-700'}">${p.quantite_stock}</td>
      <td class="p-2 text-center whitespace-nowrap">
        <button onclick="editerProduit(${p.id})" class="text-blue-600 hover:text-blue-800 mr-1" title="Modifier">✏️</button>
        <button onclick="imprimerEtiquette(${p.id})" class="text-green-600 hover:text-green-800 mr-1" title="Étiquette">🖨️</button>
        <button onclick="supprimerProduit(${p.id})" class="text-red-600 hover:text-red-800" title="Supprimer">🗑️</button>
      </td>
    </tr>
  `).join('');
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

function imprimerEtiquette(id, typeImprimante) {
  const p = produits.find(x => x.id === id);
  if (!p) return;

  // Si typeImprimante non précisé, demander à l'utilisateur
  if (!typeImprimante) {
    const cfg = window.parametresActuels || {};
    const hasTicket = cfg.imprimante_tickets_nom;
    const hasLabel = cfg.imprimante_nom;
    if (hasLabel && hasTicket) {
      const choix = confirm(`Imprimer sur :\n✅ OK → Imprimante étiquettes (${cfg.imprimante_nom})\n❌ Annuler → Imprimante tickets (${cfg.imprimante_tickets_nom})`);
      typeImprimante = choix ? 'etiquette' : 'ticket';
    } else {
      typeImprimante = 'etiquette';
    }
  }

  const cfg = window.parametresActuels || {};
  const code = p.code_barre || '';

  if (typeImprimante === 'ticket') {
    // Format ticket thermique 80mm
    const nom = cfg.imprimante_tickets_nom || 'Imprimante tickets';
    const fenetre = window.open('', '', 'width=320,height=320');
    fenetre.document.write(`<!DOCTYPE html><html><head>
      <script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.6/dist/JsBarcode.all.min.js"><\/script>
      </head><body style="margin:4px;font-family:monospace;width:280px;font-size:12px;">
      <p style="font-weight:bold;font-size:14px;margin:2px 0;">${p.nom}</p>
      ${p.description ? `<p style="font-size:10px;margin:1px 0;color:#444;">${p.description}</p>` : ''}
      <p style="font-size:11px;margin:1px 0;">Réf: ${p.reference || '-'}</p>
      <p style="font-size:16px;font-weight:bold;margin:4px 0;">${parseFloat(p.prix_vente).toFixed(2)} €</p>
      ${code ? `<svg id="bc-t" style="display:block;max-width:200px;"></svg>` : ''}
      <script>
        ${code ? `JsBarcode('#bc-t','${code}',{format:'CODE128',width:1.5,height:35,displayValue:true,fontSize:10,margin:2});` : ''}
        window.onload=function(){window.print();window.close();};
      <\/script>
    </body></html>`);
    fenetre.document.close();
    return;
  }

  // Format étiquette standard (paramètres personnalisés)
  const police = cfg.etiquette_police || 'Arial';
  const tNom = cfg.etiquette_taille_nom || 14;
  const tPrix = cfg.etiquette_taille_prix || 18;
  const tCode = cfg.etiquette_taille_code || 10;
  const coulTexte = cfg.etiquette_couleur_texte || '#000000';
  const coulFond = cfg.etiquette_couleur_fond || '#ffffff';
  const align = cfg.etiquette_alignement || 'center';
  const largeur = (cfg.etiquette_largeur || 60) * 3.78;
  const hauteur = (cfg.etiquette_hauteur || 40) * 3.78;
  const showPrix = cfg.etiquette_afficher_prix !== false;
  const showRef = cfg.etiquette_afficher_reference !== false;
  const showCode = cfg.etiquette_afficher_codebarre !== false;
  const logoUrl = cfg.etiquette_afficher_logo && cfg.etiquette_logo_url ? cfg.etiquette_logo_url : null;

  const logoHtml = logoUrl ? `<img src="${logoUrl}" style="max-height:24px;display:block;margin:0 auto 4px;">` : '';
  const refHtml = showRef ? `<p style="font-size:${tCode}px;margin:1px 0;color:${coulTexte};">Réf: ${p.reference || '-'}</p>` : '';
  const descHtml = p.description ? `<p style="font-size:${tCode}px;margin:1px 0;color:${coulTexte};font-style:italic;">${p.description}</p>` : '';
  const prixHtml = showPrix ? `<p style="font-size:${tPrix}px;font-weight:bold;margin:2px 0;color:${coulTexte};">${parseFloat(p.prix_vente).toFixed(2)} €</p>` : '';
  const codeHtml = showCode && code ? `<svg id="bc-print" style="display:block;margin:2px auto;"></svg>` : '';

  const fenetre = window.open('', '', `width=${Math.round(largeur + 40)},height=${Math.round(hauteur + 80)}`);
  fenetre.document.write(`<!DOCTYPE html><html><head>
    <script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.6/dist/JsBarcode.all.min.js"><\/script>
    </head><body style="margin:4px;background:${coulFond};">
    <div style="width:${largeur}px;min-height:${hauteur}px;padding:6px;font-family:${police};text-align:${align};background:${coulFond};border:1px solid #ccc;box-sizing:border-box;">
      ${logoHtml}
      <p style="font-size:${tNom}px;font-weight:bold;margin:2px 0;color:${coulTexte};">${p.nom}</p>
      ${descHtml}
      ${refHtml}
      ${prixHtml}
      ${codeHtml}
    </div>
    <script>
      if(document.getElementById('bc-print')){
        JsBarcode('#bc-print','${code}',{format:'CODE128',width:1.5,height:40,displayValue:true,fontSize:${tCode},margin:2});
      }
      window.onload=function(){window.print();window.close();};
    <\/script>
  </body></html>`);
  fenetre.document.close();
}

async function supprimerProduit(id) {
  if (!confirm('Supprimer ce produit définitivement ?')) return;
  try {
    await apiFetch(`/stock/${id}`, { method: 'DELETE' });
    afficherMessage('✅ Produit supprimé', 'success');
    await chargerStock();
  } catch {}
}
