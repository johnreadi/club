// ── Garde-fou localStorage ────────────────────────────────────────────────────
// Seules les clés de session (token, utilisateur) sont autorisées.
// Toute tentative de stocker une donnée métier est bloquée et loguée.
(function() {
  const CLES_AUTORISEES = new Set(['token', 'utilisateur']);
  const _set = localStorage.setItem.bind(localStorage);
  const _get = localStorage.getItem.bind(localStorage);
  const _rm  = localStorage.removeItem.bind(localStorage);

  localStorage.setItem = function(cle, valeur) {
    if (!CLES_AUTORISEES.has(cle)) {
      console.warn(`[localStorage BLOQUÉ] setItem("${cle}") — utilisez l'API BDD à la place.`);
      return;
    }
    _set(cle, valeur);
  };

  localStorage.getItem = function(cle) {
    if (!CLES_AUTORISEES.has(cle)) {
      console.warn(`[localStorage BLOQUÉ] getItem("${cle}") — données non disponibles, utilisez l'API BDD.`);
      return null;
    }
    return _get(cle);
  };

  localStorage.removeItem = function(cle) {
    if (!CLES_AUTORISEES.has(cle)) {
      console.warn(`[localStorage BLOQUÉ] removeItem("${cle}")`);
      return;
    }
    _rm(cle);
  };
})();

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

    // Dernières ventes — tableau enrichi
    const lignesRecentes = await apiFetch('/ventes/lignes-recentes').catch(() => []);
    const lignes = lignesRecentes || [];
    const _modeBadge = m => {
      const map = { especes: ['Espèces','bg-green-100 text-green-700'], cheque: ['Chèque','bg-yellow-100 text-yellow-700'], cb: ['CB','bg-blue-100 text-blue-700'], virement: ['Virement','bg-purple-100 text-purple-700'] };
      const [label, cls] = map[(m||'').toLowerCase()] || [m || '—', 'bg-gray-100 text-gray-500'];
      return `<span class="px-2 py-0.5 rounded-full text-xs font-medium ${cls}">${label}</span>`;
    };
    const _fmt = d => { const dt = new Date(d); return dt.toLocaleDateString('fr-FR',{day:'2-digit',month:'short'}) + ', ' + dt.toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'}); };
    document.getElementById('dernieres-ventes').innerHTML = lignes.length === 0
      ? '<p class="text-gray-500 text-sm p-2">Aucune vente récente</p>'
      : `<div class="overflow-x-auto">
          <div class="flex justify-end text-xs text-gray-400 mb-1">${lignes.length} ligne(s)</div>
          <table class="w-full text-sm">
            <thead><tr class="text-xs text-gray-400 uppercase border-b">
              <th class="text-left py-1.5 pr-3 font-medium">Date</th>
              <th class="text-left py-1.5 pr-3 font-medium">Référence</th>
              <th class="text-left py-1.5 pr-3 font-medium">Produit</th>
              <th class="text-right py-1.5 pr-3 font-medium">Qté</th>
              <th class="text-right py-1.5 pr-3 font-medium">P.U.</th>
              <th class="text-right py-1.5 pr-3 font-medium">Total</th>
              <th class="text-left py-1.5 font-medium">Paiement</th>
            </tr></thead>
            <tbody>${lignes.map(l => `<tr class="border-b border-gray-50 hover:bg-gray-50">
              <td class="py-1.5 pr-3 text-gray-500 whitespace-nowrap">${_fmt(l.date_vente)}</td>
              <td class="py-1.5 pr-3 font-mono text-xs text-gray-600">${l.reference || '—'}</td>
              <td class="py-1.5 pr-3 text-gray-800">${l.produit_nom || '—'}</td>
              <td class="py-1.5 pr-3 text-right text-gray-600">${l.quantite}</td>
              <td class="py-1.5 pr-3 text-right text-gray-600">${parseFloat(l.prix_unitaire).toFixed(2)} €</td>
              <td class="py-1.5 pr-3 text-right font-semibold">${(parseFloat(l.prix_unitaire)*parseInt(l.quantite)).toFixed(2)} €</td>
              <td class="py-1.5">${_modeBadge(l.mode_paiement)}</td>
            </tr>`).join('')}</tbody>
          </table>
        </div>`;

  } catch {
    // Silencieux — erreurs déjà gérées par apiFetch
  }
}
