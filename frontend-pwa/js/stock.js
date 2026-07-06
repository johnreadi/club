// === Gestion du Stock ===
let produits = [];
let produitEnEdition = null;

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('form-produit')?.addEventListener('submit', enregistrerProduit);
  document.getElementById('recherche-produit')?.addEventListener('input', e => {
    const q = e.target.value.toLowerCase();
    const lignes = document.querySelectorAll('#liste-produits tr');
    lignes.forEach(tr => {
      tr.style.display = tr.textContent.toLowerCase().includes(q) ? '' : 'none';
    });
  });
});

async function chargerStock() {
  try {
    produits = await apiFetch('/stock') || [];
    afficherListeProduits();
  } catch {
    document.getElementById('liste-produits').innerHTML =
      `<tr><td colspan="6" class="text-center py-6 text-red-500">Impossible de charger le stock</td></tr>`;
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
      <td class="p-2">${p.reference || '-'}</td>
      <td class="p-2">${p.code_barre || '-'}</td>
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
    code_barre: form.code_barre.value.trim(),
    nom: form.nom.value.trim(),
    prix_achat: parseFloat(form.prix_achat.value) || 0,
    prix_vente: parseFloat(form.prix_vente.value) || 0,
    quantite_stock: parseInt(form.quantite.value) || 0,
    seuil_alerte: parseInt(form.seuil.value) || 5
  };
  try {
    if (produitEnEdition) {
      await apiFetch(`/stock/${produitEnEdition}`, { method: 'PUT', body: JSON.stringify(donnees) });
      afficherMessage('✅ Produit mis à jour', 'success');
      produitEnEdition = null;
    } else {
      await apiFetch('/stock', { method: 'POST', body: JSON.stringify(donnees) });
      afficherMessage('✅ Produit ajouté', 'success');
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
  form.prix_achat.value = p.prix_achat || 0;
  form.prix_vente.value = p.prix_vente;
  form.quantite.value = p.quantite_stock;
  form.seuil.value = p.seuil_alerte || 5;
  form.querySelector('button[type="submit"]').textContent = 'Modifier le produit';
  form.scrollIntoView({ behavior: 'smooth' });
}

function imprimerEtiquette(id) {
  const p = produits.find(x => x.id === id);
  if (!p) return;
  const contenu = `
    <div style="width:70mm;height:30mm;padding:5px;font-family:sans-serif;border:1px solid #ccc;">
      <h3 style="font-size:13px;margin:0 0 4px 0;">${p.nom}</h3>
      <p style="font-size:14px;margin:2px 0;font-weight:bold;">Prix : ${parseFloat(p.prix_vente).toFixed(2)} €</p>
      <p style="font-size:9px;margin:2px 0;">Réf : ${p.reference || '-'} | Code : ${p.code_barre || '-'}</p>
    </div>`;
  const fenetre = window.open('', '', 'width=320,height=220');
  fenetre.document.write(`<html><body onload="window.print();window.close()">${contenu}</body></html>`);
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
