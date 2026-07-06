// === Module Inventaire ===
let produitsInventaire = [];

async function chargerInventaire() {
  try {
    produitsInventaire = await apiFetch('/inventaire') || [];
    preparerInventaireEnCours();
  } catch {
    const c = document.getElementById('inventaire-liste');
    if (c) c.innerHTML = `<tr><td colspan="4" class="text-center py-4 text-red-500">Impossible de charger l'inventaire</td></tr>`;
  }
}

function preparerInventaireEnCours() {
  const conteneur = document.getElementById('inventaire-liste');
  if (!conteneur) return;
  if (produitsInventaire.length === 0) {
    conteneur.innerHTML = `<tr><td colspan="4" class="text-center py-4 text-gray-500">Aucun produit en stock</td></tr>`;
    return;
  }
  conteneur.innerHTML = produitsInventaire.map(p => `
    <tr class="border-b hover:bg-gray-50">
      <td class="p-2 font-medium">${p.nom}<br><span class="text-xs text-gray-400">${p.reference || ''}</span></td>
      <td class="p-2 text-right">${p.quantite_stock}</td>
      <td class="p-2 text-center">
        <input type="number" min="0" value="${p.quantite_stock}"
               class="w-24 border rounded p-1 text-right focus:ring-2 focus:ring-primary/40"
               data-id="${p.id}" id="inv-${p.id}"
               oninput="calculerEcart(${p.id}, ${p.quantite_stock})">
      </td>
      <td class="p-2 text-right font-medium" id="ecart-${p.id}">0</td>
    </tr>`).join('');
}

function calculerEcart(id, theorique) {
  const reel = parseInt(document.getElementById(`inv-${id}`)?.value) || 0;
  const ecart = reel - theorique;
  const el = document.getElementById(`ecart-${id}`);
  if (el) {
    el.textContent = (ecart > 0 ? '+' : '') + ecart;
    el.className = `p-2 text-right font-medium ${ecart !== 0 ? 'text-red-600' : 'text-gray-500'}`;
  }
}

async function validerInventaire() {
  if (produitsInventaire.length === 0) return afficherMessage('⚠️ Aucun produit à inventorier', 'warning');
  if (!confirm('Valider cet inventaire et mettre à jour les stocks ?')) return;

  let erreurs = 0;
  for (const p of produitsInventaire) {
    const input = document.getElementById(`inv-${p.id}`);
    if (!input) continue;
    const nouvelle_quantite = parseInt(input.value) || 0;
    if (nouvelle_quantite !== p.quantite_stock) {
      try {
        await apiFetch('/inventaire/ajuster', {
          method: 'POST',
          body: JSON.stringify({ produit_id: p.id, nouvelle_quantite })
        });
      } catch { erreurs++; }
    }
  }

  if (erreurs > 0) {
    afficherMessage(`⚠️ Inventaire enregistré avec ${erreurs} erreur(s)`, 'warning');
  } else {
    afficherMessage('✅ Inventaire validé — stocks mis à jour', 'success');
  }
  await chargerInventaire();
}
