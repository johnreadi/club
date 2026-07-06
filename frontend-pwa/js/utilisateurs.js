// === Module Utilisateurs & Droits ===
let listeUtilisateurs = [];

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('form-utilisateur')?.addEventListener('submit', enregistrerUtilisateur);
});

async function chargerUtilisateurs() {
  try {
    listeUtilisateurs = await apiFetch('/utilisateurs') || [];
    afficherListeUtilisateurs();
  } catch {
    document.getElementById('liste-utilisateurs').innerHTML =
      `<tr><td colspan="5" class="text-center py-4 text-red-500">Impossible de charger les utilisateurs</td></tr>`;
  }
}

async function enregistrerUtilisateur(e) {
  e.preventDefault();
  const form = e.target;
  const donnees = {
    nom: form.nom.value.trim(),
    prenom: form.prenom.value.trim(),
    email: form.email.value.trim(),
    mot_de_passe: form.mot_de_passe.value,
    role: form.role.value
  };
  try {
    await apiFetch('/utilisateurs', { method: 'POST', body: JSON.stringify(donnees) });
    afficherMessage('✅ Utilisateur créé', 'success');
    form.reset();
    await chargerUtilisateurs();
  } catch {}
}

function afficherListeUtilisateurs() {
  const conteneur = document.getElementById('liste-utilisateurs');
  if (!conteneur) return;
  if (listeUtilisateurs.length === 0) {
    conteneur.innerHTML = `<tr><td colspan="5" class="text-center py-4 text-gray-500">Aucun utilisateur enregistré</td></tr>`;
    return;
  }
  conteneur.innerHTML = listeUtilisateurs.map(u => `
    <tr class="border-b hover:bg-gray-50">
      <td class="p-2 font-medium">${u.prenom} ${u.nom}</td>
      <td class="p-2">${u.email}</td>
      <td class="p-2 capitalize">${u.role.replace(/_/g, ' ')}</td>
      <td class="p-2 text-center">
        <span class="px-2 py-0.5 rounded text-xs ${u.actif ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}">
          ${u.actif ? 'Actif' : 'Inactif'}
        </span>
      </td>
      <td class="p-2 text-center whitespace-nowrap">
        <button onclick="toggleActif(${u.id}, ${!u.actif})" class="text-blue-600 hover:text-blue-800 mr-2 text-sm"
          title="${u.actif ? 'Désactiver' : 'Activer'}">${u.actif ? '🔒' : '🔓'}</button>
        <button onclick="supprimerUtilisateur(${u.id})" class="text-red-600 hover:text-red-800 text-sm" title="Supprimer">🗑️</button>
      </td>
    </tr>`).join('');
}

async function toggleActif(id, actif) {
  try {
    await apiFetch(`/utilisateurs/${id}/actif`, { method: 'PUT', body: JSON.stringify({ actif }) });
    afficherMessage(`✅ Utilisateur ${actif ? 'activé' : 'désactivé'}`, 'success');
    await chargerUtilisateurs();
  } catch {}
}

async function supprimerUtilisateur(id) {
  if (!confirm('Supprimer cet utilisateur définitivement ?')) return;
  try {
    await apiFetch(`/utilisateurs/${id}`, { method: 'DELETE' });
    afficherMessage('✅ Utilisateur supprimé', 'success');
    await chargerUtilisateurs();
  } catch {}
}
