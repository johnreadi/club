// === Caisse & Ventes ===
let panier = [];
let produitsCaisse = [];
let scanCaisseBuffer = '';
let scanCaisseTimer = null;

document.addEventListener('DOMContentLoaded', () => {
  // Champ de saisie manuelle
  document.getElementById('scan-produit')?.addEventListener('keydown', gererScanManuel);

  // Douchette globale sur la page Caisse
  document.addEventListener('keydown', intercepterScanCaisse);
  afficherPanier();
});

// Interception douchette : accumule les touches rapides, détecte Enter
function intercepterScanCaisse(e) {
  const sectionCaisse = document.getElementById('caisse');
  if (!sectionCaisse || sectionCaisse.classList.contains('hidden')) return;
  const focused = document.activeElement;
  if (focused && focused.id === 'scan-produit') return; // déjà géré par gererScanManuel
  const tag = focused?.tagName;
  if (tag === 'BUTTON' || tag === 'SELECT') return;

  if (e.key === 'Enter') {
    if (scanCaisseBuffer.length > 2) {
      traiterScanCaisse(scanCaisseBuffer);
    }
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
  await traiterScanCaisse(code);
}

async function traiterScanCaisse(code) {
  try {
    // Chercher d'abord dans le cache local
    let produit = produitsCaisse.find(p =>
      p.code_barre === code || p.reference === code ||
      p.nom.toLowerCase() === code.toLowerCase()
    );
    // Si pas en cache → appel API (scan douchette d'un nouveau produit)
    if (!produit) {
      produit = await apiFetch('/stock/scan/' + encodeURIComponent(code));
      // Mettre à jour le cache local
      const idx = produitsCaisse.findIndex(p => p.id === produit.id);
      if (idx >= 0) produitsCaisse[idx] = produit; else produitsCaisse.push(produit);
    }
    if (produit.quantite_stock <= 0) {
      afficherMessage(`⚠️ Stock épuisé : ${produit.nom}`, 'warning');
      return;
    }
    ajouterAuPanier(produit);
    afficherMessage(`✅ ${produit.nom} ajouté`, 'success');
  } catch {
    afficherMessage('❌ Produit non trouvé : ' + code, 'danger');
  }
}

async function chargerVentesCaisse() {
  try {
    produitsCaisse = await apiFetch('/stock') || [];
    const ventes = await apiFetch('/ventes') || [];
    const conteneur = document.getElementById('dernieres-ventes-caisse');
    if (conteneur) {
      conteneur.innerHTML = ventes.slice(0, 10).map(v =>
        `<div class="border-b py-1 flex justify-between">
          <span>${new Date(v.date_vente).toLocaleString('fr-FR')}</span>
          <span class="font-medium">${parseFloat(v.montant_total).toFixed(2)} €</span>
        </div>`
      ).join('') || '<p class="text-gray-500">Aucune vente</p>';
    }
  } catch {}
}

function ajouterAuPanier(produit) {
  const ligne = panier.find(l => l.produit_id === produit.id);
  if (ligne) {
    ligne.quantite++;
  } else {
    panier.push({ produit_id: produit.id, nom: produit.nom, prix_unitaire: parseFloat(produit.prix_vente), quantite: 1 });
  }
  afficherPanier();
}

function afficherPanier() {
  const conteneur = document.getElementById('panier');
  if (!conteneur) return;
  const total = panier.reduce((s, l) => s + l.prix_unitaire * l.quantite, 0);
  conteneur.innerHTML = panier.length === 0
    ? `<p class="text-center text-gray-500 py-8">Panier vide — scanner ou saisir un produit</p>`
    : panier.map((l, i) => `
      <div class="flex justify-between items-center border-b py-2 gap-2">
        <span class="flex-1 font-medium">${l.nom}</span>
        <div class="flex items-center gap-1">
          <button onclick="changerQte(${i},-1)" class="w-6 h-6 rounded bg-gray-200 hover:bg-gray-300 text-sm">−</button>
          <span class="w-8 text-center">${l.quantite}</span>
          <button onclick="changerQte(${i},1)" class="w-6 h-6 rounded bg-gray-200 hover:bg-gray-300 text-sm">+</button>
        </div>
        <span class="w-20 text-right">${(l.prix_unitaire * l.quantite).toFixed(2)} €</span>
        <button onclick="supprimerLigne(${i})" class="text-red-500 font-bold text-lg leading-none">×</button>
      </div>`).join('');
  document.getElementById('montant-total').textContent = total.toFixed(2) + ' €';
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

async function validerVente(modePaiement) {
  if (panier.length === 0) return afficherMessage('⚠️ Panier vide', 'warning');
  const montant_total = panier.reduce((s, l) => s + l.prix_unitaire * l.quantite, 0);
  const articles = panier.map(l => ({ produit_id: l.produit_id, quantite: l.quantite, prix_unitaire: l.prix_unitaire }));
  try {
    const vente = await apiFetch('/ventes', {
      method: 'POST',
      body: JSON.stringify({ articles, montant_total, mode_paiement: modePaiement })
    });
    // Mettre à jour le stock local (décrémentation)
    articles.forEach(a => {
      const p = produitsCaisse.find(x => x.id === a.produit_id);
      if (p) p.quantite_stock = Math.max(0, p.quantite_stock - a.quantite);
    });
    imprimerTicket({ ...vente, lignes: panier, montant_total, mode_paiement: modePaiement });
    panier = [];
    afficherPanier();
    afficherMessage('✅ Vente enregistrée — stock mis à jour', 'success');
    await chargerVentesCaisse();
  } catch {}
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
