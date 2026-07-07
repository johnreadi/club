const API_BASE = '/api';

function apiHeaders() {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  };
}

async function apiFetch(url, options = {}) {
  try {
    const res = await fetch(API_BASE + url, {
      ...options,
      headers: { ...apiHeaders(), ...(options.headers || {}) }
    });
    if (res.status === 401) {
      localStorage.clear();
      window.location.href = '/landing.html';
      return null;
    }
    const data = await res.json();
    if (!res.ok) throw new Error((data.erreur || `Erreur ${res.status}`) + (data.detail ? ` — ${data.detail}` : ''));
    return data;
  } catch (err) {
    if (err.name !== 'TypeError') afficherMessage('❌ ' + err.message, 'danger');
    throw err;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // Navigation entre sections
  document.querySelectorAll('.menu-item[data-section]').forEach(item => {
    item.addEventListener('click', e => {
      e.preventDefault();
      naviguerVers(item.dataset.section);
    });
  });

  // Gestion connectivité
  window.addEventListener('online', () => afficherMessage('✅ Connexion rétablie', 'success'));
  window.addEventListener('offline', () => afficherMessage('⚠️ Mode hors ligne actif — les données seront synchronisées plus tard', 'warning'));

  // Service Worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js').catch(() => {});
  }

  // Scroll BackToTop
  const btnTop = document.getElementById('btn-back-top');
  if (btnTop) {
    window.addEventListener('scroll', () => {
      btnTop.classList.toggle('hidden', window.scrollY < 300);
    });
    btnTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }
});

function naviguerVers(section) {
  document.querySelectorAll('.menu-item').forEach(i => i.classList.remove('active'));
  const menuItem = document.querySelector(`.menu-item[data-section="${section}"]`);
  if (menuItem) menuItem.classList.add('active');
  document.querySelectorAll('.module').forEach(m => m.classList.add('hidden'));
  const el = document.getElementById(section);
  if (el) {
    el.classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  // Charger les données du module
  const loaders = {
    'accueil': chargerTableauBord,
    'stock': () => typeof chargerStock === 'function' && chargerStock(),
    'caisse': () => typeof chargerVentesCaisse === 'function' && chargerVentesCaisse(),
    'inventaire': () => typeof chargerInventaire === 'function' && chargerInventaire(),
    'rapports': () => typeof chargerRapports === 'function' && chargerRapports(),
    'utilisateurs': () => typeof chargerUtilisateurs === 'function' && chargerUtilisateurs(),
    'admin-dashboard': () => typeof chargerAdminDashboard === 'function' && chargerAdminDashboard(),
    'admin-inscriptions': () => typeof chargerAdminInscriptions === 'function' && chargerAdminInscriptions(),
    'admin-tarifs': () => typeof chargerAdminTarifs === 'function' && chargerAdminTarifs(),
    'admin-paiements': () => typeof chargerAdminPaiements === 'function' && chargerAdminPaiements(),
    'admin-messagerie': () => typeof chargerMessagerie === 'function' && chargerMessagerie(),
    'admin-parametres': () => typeof chargerAdminParametres === 'function' && chargerAdminParametres(),
    'admin-reglage-site': () => typeof chargerReglagesSite === 'function' && chargerReglagesSite(),
    'parametres': () => typeof chargerParametres === 'function' && chargerParametres(),
    'messagerie': () => typeof chargerMessagerie_club === 'function' && chargerMessagerie_club(),
  };
  if (loaders[section]) loaders[section]();
}

function afficherMessage(texte, type = 'info') {
  const zone = document.getElementById('zone-message');
  if (!zone) return;
  zone.textContent = texte;
  zone.className = `mb-4 p-3 rounded text-center ${
    type === 'success' ? 'bg-green-100 text-green-800 border border-green-300' :
    type === 'danger'  ? 'bg-red-100 text-red-800 border border-red-300' :
    type === 'warning' ? 'bg-orange-100 text-orange-800 border border-orange-300' :
                         'bg-blue-100 text-blue-800 border border-blue-300'
  }`;
  zone.classList.remove('hidden');
  clearTimeout(zone._timer);
  zone._timer = setTimeout(() => zone.classList.add('hidden'), 4500);
}

async function chargerTableauBord() {
  try {
    const [stockData, ventesData] = await Promise.allSettled([
      apiFetch('/stock'),
      apiFetch('/rapports/ventes')
    ]);

    const produits = stockData.status === 'fulfilled' ? stockData.value : [];
    const ventes = ventesData.status === 'fulfilled' ? ventesData.value : [];

    document.getElementById('stat-produits').textContent = produits.length;

    const caTotal = ventes.reduce((s, v) => s + parseFloat(v.ca || 0), 0);
    document.getElementById('stat-ventes').textContent = caTotal.toFixed(2) + ' €';

    const valeurStock = produits.reduce((s, p) => s + (p.quantite_stock * parseFloat(p.prix_vente)), 0);
    document.getElementById('stat-valeur-stock').textContent = valeurStock.toFixed(2) + ' €';

    // Alertes stock
    const alertes = produits.filter(p => p.quantite_stock <= (p.seuil_alerte || 5));
    document.getElementById('alertes-stock').innerHTML = alertes.length > 0
      ? alertes.map(p => `<div class="flex justify-between py-1 border-b text-sm"><span class="text-red-600">⚠️ ${p.nom}</span><span class="font-medium">${p.quantite_stock} restant(s)</span></div>`).join('')
      : '<div class="text-green-600 text-sm">✅ Tous les stocks sont suffisants</div>';

    // Utilisateurs
    const utilisateursData = await apiFetch('/utilisateurs').catch(() => []);
    document.getElementById('stat-utilisateurs').textContent = (utilisateursData || []).length;

    // Dernières ventes
    const ventesRecentes = await apiFetch('/ventes').catch(() => []);
    document.getElementById('dernieres-ventes').innerHTML = (ventesRecentes || []).slice(0, 5).map(v =>
      `<div class="flex justify-between py-1 border-b text-sm"><span>${new Date(v.date_vente).toLocaleString('fr-FR')}</span><span class="font-medium">${parseFloat(v.montant_total).toFixed(2)} €</span></div>`
    ).join('') || '<p class="text-gray-500 text-sm">Aucune vente récente</p>';

  } catch {
    // Silencieux — erreurs déjà gérées par apiFetch
  }
}
