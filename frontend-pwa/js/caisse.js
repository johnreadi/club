// === Caisse & Ventes ===
let panier = [];
let produitsCaisse = [];

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('scan-produit')?.addEventListener('keydown', gererScan);
  afficherPanier();
});

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

function gererScan(e) {
  if (e.key !== 'Enter') return;
  e.preventDefault();
  const code = e.target.value.trim();
  if (!code) return;
  const produit = produitsCaisse.find(p => p.code_barre === code || p.reference === code || p.nom.toLowerCase() === code.toLowerCase());
  if (!produit) {
    afficherMessage('❌ Produit non trouvé : ' + code, 'danger');
    e.target.value = '';
    return;
  }
  ajouterAuPanier(produit);
  e.target.value = '';
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
    imprimerTicket({ ...vente, lignes: panier, montant_total, mode_paiement: modePaiement });
    panier = [];
    afficherPanier();
    afficherMessage('✅ Vente enregistrée — ' + modePaiement, 'success');
    await chargerVentesCaisse();
  } catch {}
}

function imprimerTicket(vente) {
  const utilisateur = JSON.parse(localStorage.getItem('utilisateur') || '{}');
  let contenu = `<div style="width:75mm;padding:8px;font-family:monospace;font-size:12px;">
    <h3 style="text-align:center;font-weight:bold;margin:0 0 4px 0;">GESTION DES CLUBS</h3>
    <p style="text-align:center;margin:2px 0;">${utilisateur.club_nom || ''}</p>
    <p style="text-align:center;margin:2px 0;">${new Date().toLocaleString('fr-FR')}</p>
    <hr style="margin:6px 0;">`;
  (vente.lignes || []).forEach(l => {
    contenu += `<p style="margin:3px 0;">${l.nom}<br/>${l.quantite} × ${parseFloat(l.prix_unitaire).toFixed(2)} € = ${(l.quantite * parseFloat(l.prix_unitaire)).toFixed(2)} €</p>`;
  });
  contenu += `<hr style="margin:6px 0;">
    <p style="text-align:right;font-weight:bold;">Total : ${parseFloat(vente.montant_total).toFixed(2)} €</p>
    <p style="margin:4px 0;">Règlement : ${vente.mode_paiement}</p>
    <p style="text-align:center;margin-top:10px;">Merci de votre visite !</p>
  </div>`;
  const fenetre = window.open('', '_blank', 'width=320,height=580');
  if (fenetre) {
    fenetre.document.write(`<html><body onload="window.print();window.close()">${contenu}</body></html>`);
    fenetre.document.close();
  }
}
