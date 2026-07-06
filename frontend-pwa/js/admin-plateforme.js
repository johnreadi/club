let listeClubs = [];

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('form-nouveau-club')?.addEventListener('submit', creerNouveauClub);
});

async function chargerListeClubs() {
  try {
    listeClubs = await apiFetch('/admin/clubs') || [];
    afficherClubs();
  } catch {
    afficherMessage('❌ Impossible de charger la liste des clubs', 'danger');
  }
}

function afficherClubs() {
  const conteneur = document.getElementById('liste-clubs-plateforme');
  if (!conteneur) return;
  if (listeClubs.length === 0) {
    conteneur.innerHTML = `<tr><td colspan="6" class="text-center py-6 text-gray-500">Aucun club enregistré</td></tr>`;
    return;
  }
  conteneur.innerHTML = listeClubs.map(club => `
    <tr class="border-b hover:bg-gray-50">
      <td class="p-2 font-medium">${club.nom}</td>
      <td class="p-2">${club.ville || '-'}</td>
      <td class="p-2 capitalize">${(club.niveau_abonnement || '').replace(/_/g, ' ')}</td>
      <td class="p-2">${club.date_fin_abonnement ? new Date(club.date_fin_abonnement).toLocaleDateString('fr-FR') : '-'}</td>
      <td class="p-2 text-center">
        <span class="px-2 py-0.5 rounded text-xs ${club.actif ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}">
          ${club.actif ? 'Actif' : 'Inactif'}
        </span>
      </td>
      <td class="p-2 text-center">
        <button onclick="voirClub(${club.id})" class="text-blue-600 hover:text-blue-800 text-sm" title="Voir">👁️</button>
      </td>
    </tr>`).join('');
}

async function creerNouveauClub(e) {
  e.preventDefault();
  const form = e.target;
  const donnees = {
    nom: form.nom.value.trim(),
    adresse: form.adresse?.value?.trim() || '',
    code_postal: form.cp?.value?.trim() || '',
    ville: form.ville.value.trim(),
    telephone: form.telephone?.value?.trim() || '',
    email_contact: form.email.value.trim(),
    niveau_abonnement: form.abonnement.value
  };
  try {
    await apiFetch('/admin/clubs', { method: 'POST', body: JSON.stringify(donnees) });
    afficherMessage('✅ Club créé avec succès', 'success');
    form.reset();
    await chargerListeClubs();
  } catch {}
}

function voirClub(id) {
  const club = listeClubs.find(c => c.id === id);
  if (!club) return;
  alert(`Club : ${club.nom}\nVille : ${club.ville || '-'}\nEmail : ${club.email_contact || '-'}\nFormule : ${club.niveau_abonnement}`);
}
