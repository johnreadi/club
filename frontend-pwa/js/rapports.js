// === Module Rapports & Statistiques ===

// ── État global du module ─────────────────────────────────────────────────────
let _rptVentesRaw  = [];  // toutes les ventes brutes
let _rptLignesRaw  = [];  // lignes de vente détaillées
let _rptDateDebut  = null;
let _rptDateFin    = null;
let _rptGroupement = 'mois';
let _rptTopMode    = 'ca';
let _charts        = {};  // instances Chart.js

// ── Palette couleurs ──────────────────────────────────────────────────────────
const _RPT_COLORS = ['#3B82F6','#10B981','#8B5CF6','#F59E0B','#EF4444','#06B6D4','#F97316','#84CC16'];

// ── Chargement principal ──────────────────────────────────────────────────────
async function chargerRapports() {
  _rptInitDates();
  await _rptChargerDonnees();
}

function _rptInitDates() {
  const now = new Date();
  const debut = new Date(now.getFullYear(), now.getMonth(), 1);
  _rptDateDebut = _fmtDate(debut);
  _rptDateFin   = _fmtDate(now);
  const inputD = document.getElementById('rpt-date-debut');
  const inputF = document.getElementById('rpt-date-fin');
  if (inputD) inputD.value = _rptDateDebut;
  if (inputF) inputF.value = _rptDateFin;
  _rptActifQuick('month');
  _rptMajLabelPeriode();
}

async function _rptChargerDonnees() {
  try {
    const params = new URLSearchParams();
    if (_rptDateDebut) params.set('debut', _rptDateDebut);
    if (_rptDateFin)   params.set('fin',   _rptDateFin);
    const qs = params.toString() ? '?' + params.toString() : '';
    const [ventesRes] = await Promise.allSettled([
      apiFetch('/rapports/detail' + qs)
    ]);
    _rptVentesRaw = ventesRes.status === 'fulfilled' && ventesRes.value ? ventesRes.value : [];
    _rptMajAffichage();
  } catch (e) {
    console.warn('Rapports error', e);
  }
}

// ── Filtrage par période ──────────────────────────────────────────────────────
function _rptFiltrerVentes() {
  if (!_rptDateDebut && !_rptDateFin) return _rptVentesRaw;
  return _rptVentesRaw.filter(v => {
    const d = v.date_vente ? v.date_vente.slice(0, 10) : null;
    if (!d) return true;
    if (_rptDateDebut && d < _rptDateDebut) return false;
    if (_rptDateFin   && d > _rptDateFin)   return false;
    return true;
  });
}

// ── Mise à jour de tous les affichages ────────────────────────────────────────
function _rptMajAffichage() {
  _rptEnsureChartJs(() => {
    const ventes = _rptFiltrerVentes();
    _rptMajKPI(ventes);
    _rptMajChartCA(ventes);
    _rptMajChartPaiements(ventes);
    _rptMajChartTopProduits(ventes);
    _rptMajChartHeures(ventes);
    _rptMajTableau(ventes);
  });
}

// ── KPI ───────────────────────────────────────────────────────────────────────
function _rptMajKPI(ventes) {
  const s = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
  const ca = ventes.reduce((acc, v) => acc + parseFloat(v.montant_total || 0), 0);
  const nbVentes = ventes.length;
  const nbArticles = ventes.reduce((acc, v) => acc + (v.lignes?.reduce((a2, l) => a2 + parseInt(l.quantite || 0), 0) || parseInt(v.nb_articles || 0) || 0), 0);
  const panier = nbVentes > 0 ? ca / nbVentes : 0;
  const produits = new Set(ventes.flatMap(v => (v.lignes || []).map(l => l.produit_id)).filter(Boolean));
  const marge = ventes.reduce((acc, v) => acc + parseFloat(v.marge || 0), 0);
  const taux = ca > 0 ? (marge / ca * 100) : 0;

  s('ca-total',      _eur(ca));
  s('marge-total',   marge > 0 ? _eur(marge) : '— €');
  s('taux-marge',    marge > 0 ? taux.toFixed(1) : '—');
  s('rpt-nb-ventes', nbVentes.toString());
  s('rpt-panier-moy', _eur(panier));
  s('rpt-nb-articles', nbArticles > 0 ? nbArticles.toString() : '—');
  s('rpt-nb-produits', produits.size > 0 ? produits.size.toString() : '—');
}

// ── Graphique CA évolution ────────────────────────────────────────────────────
function _rptMajChartCA(ventes) {
  const canvas = document.getElementById('chart-ca');
  const empty  = document.getElementById('chart-ca-empty');
  if (!canvas) return;

  // Grouper par période
  const map = new Map();
  ventes.forEach(v => {
    const d = v.date_vente ? new Date(v.date_vente) : null;
    if (!d) return;
    const key = _rptGroupKey(d, _rptGroupement);
    map.set(key, (map.get(key) || 0) + parseFloat(v.montant_total || 0));
  });
  const labels = [...map.keys()].sort();
  const data   = labels.map(k => map.get(k));

  if (labels.length === 0) {
    canvas.classList.add('hidden');
    if (empty) empty.classList.remove('hidden');
    return;
  }
  canvas.classList.remove('hidden');
  if (empty) empty.classList.add('hidden');

  _rptDestroyChart('ca');
  _charts.ca = new Chart(canvas.getContext('2d'), {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'CA (€)',
        data,
        backgroundColor: 'rgba(59,130,246,0.15)',
        borderColor: '#3B82F6',
        borderWidth: 2,
        borderRadius: 6,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#3B82F6',
        type: 'bar'
      }, {
        label: 'Tendance',
        data,
        type: 'line',
        borderColor: '#8B5CF6',
        borderWidth: 2,
        pointRadius: 3,
        fill: false,
        tension: 0.4,
        pointBackgroundColor: '#8B5CF6',
        backgroundColor: 'transparent'
      }]
    },
    options: _chartOpts({
      scales: {
        y: { beginAtZero: true, ticks: { callback: v => _eur(v) }, grid: { color: '#f0f0f0' } },
        x: { grid: { display: false } }
      },
      plugins: { tooltip: { callbacks: { label: ctx => ' ' + _eur(ctx.raw) } } }
    })
  });
}

// ── Graphique Paiements (donut) ───────────────────────────────────────────────
function _rptMajChartPaiements(ventes) {
  const canvas = document.getElementById('chart-paiements');
  const empty  = document.getElementById('chart-paiements-empty');
  const legend = document.getElementById('chart-paiements-legend');
  if (!canvas) return;

  const map = new Map();
  ventes.forEach(v => {
    const m = v.mode_paiement || 'Autre';
    map.set(m, (map.get(m) || 0) + parseFloat(v.montant_total || 0));
  });
  const labels = [...map.keys()];
  const data   = labels.map(k => map.get(k));

  if (labels.length === 0) {
    canvas.classList.add('hidden');
    if (empty) empty.classList.remove('hidden');
    if (legend) legend.innerHTML = '';
    return;
  }
  canvas.classList.remove('hidden');
  if (empty) empty.classList.add('hidden');

  _rptDestroyChart('paiements');
  _charts.paiements = new Chart(canvas.getContext('2d'), {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{ data, backgroundColor: _RPT_COLORS.slice(0, labels.length), borderWidth: 2, borderColor: '#fff', hoverOffset: 6 }]
    },
    options: {
      responsive: true, maintainAspectRatio: false, cutout: '68%',
      plugins: { legend: { display: false }, tooltip: { callbacks: { label: ctx => ` ${ctx.label}: ${_eur(ctx.raw)}` } } }
    }
  });

  // Légende custom
  const total = data.reduce((a, b) => a + b, 0);
  if (legend) {
    legend.innerHTML = labels.map((l, i) =>
      `<div class="flex items-center justify-between text-xs">
        <div class="flex items-center gap-1.5">
          <div class="w-2.5 h-2.5 rounded-full" style="background:${_RPT_COLORS[i]}"></div>
          <span class="text-gray-600">${l}</span>
        </div>
        <span class="font-semibold text-gray-800">${total > 0 ? Math.round(data[i]/total*100) : 0}%</span>
      </div>`
    ).join('');
  }
}

// ── Graphique Top Produits (barres horizontales) ──────────────────────────────
function _rptMajChartTopProduits(ventes) {
  const canvas = document.getElementById('chart-top-produits');
  if (!canvas) return;

  // Agréger depuis lignes ou données résumées
  const map = new Map();
  ventes.forEach(v => {
    const lignes = v.lignes || [];
    lignes.forEach(l => {
      const nom = l.produit_nom || l.nom || 'Produit #' + l.produit_id;
      const ca  = parseFloat(l.prix_unitaire || 0) * parseInt(l.quantite || 0);
      const qte = parseInt(l.quantite || 0);
      const prev = map.get(nom) || { ca: 0, qte: 0 };
      map.set(nom, { ca: prev.ca + ca, qte: prev.qte + qte });
    });
  });

  const sorted = [...map.entries()].sort((a, b) =>
    _rptTopMode === 'ca' ? b[1].ca - a[1].ca : b[1].qte - a[1].qte
  ).slice(0, 8);

  const labels = sorted.map(([n]) => n.length > 20 ? n.slice(0, 18) + '…' : n);
  const data   = sorted.map(([, v]) => _rptTopMode === 'ca' ? v.ca : v.qte);
  const fmt    = _rptTopMode === 'ca' ? v => _eur(v) : v => v + ' u.';

  _rptDestroyChart('top');
  _charts.top = new Chart(canvas.getContext('2d'), {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: _RPT_COLORS.slice(0, labels.length).map(c => c + 'CC'),
        borderColor: _RPT_COLORS.slice(0, labels.length),
        borderWidth: 1.5,
        borderRadius: 5
      }]
    },
    options: _chartOpts({
      indexAxis: 'y',
      scales: {
        x: { beginAtZero: true, ticks: { callback: fmt }, grid: { color: '#f0f0f0' } },
        y: { grid: { display: false } }
      },
      plugins: { legend: { display: false }, tooltip: { callbacks: { label: ctx => ' ' + fmt(ctx.raw) } } }
    })
  });
}

// ── Graphique Horaire (courbe) ────────────────────────────────────────────────
function _rptMajChartHeures(ventes) {
  const canvas = document.getElementById('chart-heures');
  const empty  = document.getElementById('chart-heures-empty');
  if (!canvas) return;

  const heures = new Array(24).fill(0);
  ventes.forEach(v => {
    const h = v.date_vente ? new Date(v.date_vente).getHours() : null;
    if (h !== null) heures[h] += parseFloat(v.montant_total || 0);
  });
  const actives = heures.some(h => h > 0);
  if (!actives) {
    canvas.classList.add('hidden');
    if (empty) empty.classList.remove('hidden');
    return;
  }
  canvas.classList.remove('hidden');
  if (empty) empty.classList.add('hidden');

  _rptDestroyChart('heures');
  _charts.heures = new Chart(canvas.getContext('2d'), {
    type: 'line',
    data: {
      labels: heures.map((_, i) => i + 'h'),
      datasets: [{
        label: 'CA',
        data: heures,
        borderColor: '#10B981',
        backgroundColor: 'rgba(16,185,129,0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: heures.map(h => h > 0 ? 4 : 0),
        pointBackgroundColor: '#10B981',
        borderWidth: 2
      }]
    },
    options: _chartOpts({
      scales: {
        y: { beginAtZero: true, ticks: { callback: v => _eur(v) }, grid: { color: '#f0f0f0' } },
        x: { grid: { display: false } }
      },
      plugins: { tooltip: { callbacks: { label: ctx => ' ' + _eur(ctx.raw) } } }
    })
  });
}

// ── Tableau détaillé ──────────────────────────────────────────────────────────
function _rptMajTableau(ventes) {
  const tbody  = document.getElementById('rpt-tableau-ventes');
  const nbEl   = document.getElementById('rpt-nb-lignes');
  if (!tbody) return;

  // Exploser par lignes si disponibles, sinon 1 ligne par vente
  const lignes = [];
  ventes.forEach(v => {
    if (v.lignes && v.lignes.length > 0) {
      v.lignes.forEach(l => lignes.push({ ...l, _vente: v }));
    } else {
      lignes.push({ _vente: v, _simple: true });
    }
  });

  if (nbEl) nbEl.textContent = lignes.length + ' ligne(s)';
  if (lignes.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" class="text-center py-8 text-gray-400">Aucune vente sur cette période</td></tr>`;
    return;
  }

  tbody.innerHTML = lignes.slice(0, 100).map(l => {
    const v   = l._vente;
    const dt  = v.date_vente ? new Date(v.date_vente).toLocaleString('fr-FR', {day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'}) : '—';
    const nom = l._simple ? ('Vente #' + v.id) : (l.produit_nom || l.nom || 'Produit');
    const qte = l._simple ? '—' : (l.quantite || '—');
    const pu  = l._simple ? '—' : (l.prix_unitaire ? _eur(l.prix_unitaire) : '—');
    const tot = l._simple ? _eur(v.montant_total) : (l.quantite && l.prix_unitaire ? _eur(parseFloat(l.prix_unitaire) * parseInt(l.quantite)) : '—');
    const mdp = v.mode_paiement || '—';
    const badgeMdp = {
      'especes':'bg-green-100 text-green-700','espèces':'bg-green-100 text-green-700',
      'carte':'bg-blue-100 text-blue-700','cb':'bg-blue-100 text-blue-700',
      'virement':'bg-purple-100 text-purple-700','cheque':'bg-yellow-100 text-yellow-700','chèque':'bg-yellow-100 text-yellow-700'
    }[mdp.toLowerCase()] || 'bg-gray-100 text-gray-600';
    return `<tr class="border-b border-gray-50 hover:bg-gray-50 transition-colors">
      <td class="p-2 text-gray-500 text-xs">${dt}</td>
      <td class="p-2 font-medium text-gray-800">${nom}</td>
      <td class="p-2 text-right text-gray-600">${qte}</td>
      <td class="p-2 text-right text-gray-600">${pu}</td>
      <td class="p-2 text-right font-semibold text-gray-800">${tot}</td>
      <td class="p-2 text-center"><span class="px-2 py-0.5 rounded-full text-xs font-medium ${badgeMdp}">${mdp}</span></td>
    </tr>`;
  }).join('') + (lignes.length > 100 ? `<tr><td colspan="6" class="text-center py-2 text-xs text-gray-400">… et ${lignes.length - 100} lignes de plus</td></tr>` : '');
}

// ── Sélecteur de période ──────────────────────────────────────────────────────
function rptPeriodeRapide(key) {
  const now   = new Date();
  let debut, fin = now;
  switch (key) {
    case 'today':   debut = new Date(now); break;
    case 'week':    debut = new Date(now); debut.setDate(debut.getDate() - 6); break;
    case 'month':   debut = new Date(now.getFullYear(), now.getMonth(), 1); break;
    case 'quarter': debut = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1); break;
    case 'year':    debut = new Date(now.getFullYear(), 0, 1); break;
    case 'all':     debut = null; fin = null; break;
  }
  _rptDateDebut = debut ? _fmtDate(debut) : null;
  _rptDateFin   = fin   ? _fmtDate(fin)   : null;
  const inputD = document.getElementById('rpt-date-debut');
  const inputF = document.getElementById('rpt-date-fin');
  if (inputD) inputD.value = _rptDateDebut || '';
  if (inputF) inputF.value = _rptDateFin   || '';
  _rptActifQuick(key);
  _rptMajLabelPeriode();
  _rptChargerDonnees();
}

function rptAppliquerPeriode() {
  _rptDateDebut = document.getElementById('rpt-date-debut')?.value || null;
  _rptDateFin   = document.getElementById('rpt-date-fin')?.value   || null;
  _rptActifQuick(null);
  _rptMajLabelPeriode();
  _rptChargerDonnees();
}

function rptChangerGroupement(g) {
  _rptGroupement = g;
  document.querySelectorAll('.rpt-grp').forEach(b => {
    const active = b.dataset.g === g;
    b.classList.toggle('bg-white', active);
    b.classList.toggle('shadow', active);
    b.classList.toggle('text-primary', active);
    b.classList.toggle('text-gray-500', !active);
  });
  _rptMajChartCA(_rptFiltrerVentes());
}

function rptTopMode(mode) {
  _rptTopMode = mode;
  document.querySelectorAll('.rpt-top-btn').forEach(b => {
    const active = b.dataset.t === mode;
    b.classList.toggle('bg-white', active);
    b.classList.toggle('shadow', active);
    b.classList.toggle('text-primary', active);
    b.classList.toggle('text-gray-500', !active);
  });
  _rptMajChartTopProduits(_rptFiltrerVentes());
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function _rptActifQuick(key) {
  document.querySelectorAll('.rpt-quick').forEach(b => {
    const active = b.dataset.k === key;
    b.classList.toggle('bg-white', active);
    b.classList.toggle('shadow', active);
    b.classList.toggle('active-rpt-quick', active);
  });
}

function _rptMajLabelPeriode() {
  const el = document.getElementById('rpt-periode-label');
  if (!el) return;
  if (!_rptDateDebut && !_rptDateFin) { el.textContent = 'Période : toutes les données'; return; }
  const d = _rptDateDebut ? new Date(_rptDateDebut).toLocaleDateString('fr-FR') : '—';
  const f = _rptDateFin   ? new Date(_rptDateFin).toLocaleDateString('fr-FR')   : '—';
  el.textContent = `Période : du ${d} au ${f}`;
}

function _rptGroupKey(date, grp) {
  const y = date.getFullYear(), m = date.getMonth() + 1, d = date.getDate();
  const w = _semaine(date);
  if (grp === 'jour')    return `${y}-${_z(m)}-${_z(d)}`;
  if (grp === 'semaine') return `${y}-S${_z(w)}`;
  return `${y}-${_z(m)}`;
}

function _semaine(d) {
  const onejan = new Date(d.getFullYear(), 0, 1);
  return Math.ceil((((d - onejan) / 86400000) + onejan.getDay() + 1) / 7);
}

function _fmtDate(d) {
  return `${d.getFullYear()}-${_z(d.getMonth()+1)}-${_z(d.getDate())}`;
}

function _z(n) { return String(n).padStart(2, '0'); }

function _eur(v) {
  return parseFloat(v).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';
}

function _chartOpts(extra = {}) {
  return { responsive: true, maintainAspectRatio: false, interaction: { mode: 'index', intersect: false },
    plugins: { legend: { display: false }, tooltip: { backgroundColor: '#1f2937', titleFont: { size: 11 }, bodyFont: { size: 11 } } },
    ...extra };
}

function _rptDestroyChart(key) {
  if (_charts[key]) { try { _charts[key].destroy(); } catch {} _charts[key] = null; }
}

function _rptEnsureChartJs(cb) {
  if (window.Chart) { cb(); return; }
  const sc = document.createElement('script');
  sc.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.3/dist/chart.umd.min.js';
  sc.onload = cb;
  document.head.appendChild(sc);
}

// ── Export ─────────────────────────────────────────────────────────────────────
async function exporterDonnees() {
  try {
    const [ventesData, stockData] = await Promise.allSettled([
      apiFetch('/ventes'),
      apiFetch('/stock')
    ]);
    const contenu = JSON.stringify({
      produits: stockData.value || [],
      ventes: ventesData.value || [],
      exporte_le: new Date().toISOString()
    }, null, 2);
    telecharger(contenu, `sauvegarde_${new Date().toISOString().slice(0,10)}.json`, 'application/json');
    afficherMessage('✅ Export JSON téléchargé', 'success');
  } catch {}
}

async function exporterCSV() {
  try {
    const ventes = _rptFiltrerVentes();
    const lignes = [['Date','Produit','Quantité','Prix unitaire','Total','Mode paiement'],
      ...ventes.flatMap(v =>
        (v.lignes && v.lignes.length > 0)
          ? v.lignes.map(l => [
              new Date(v.date_vente).toLocaleString('fr-FR'),
              l.produit_nom || l.nom || '#' + l.produit_id,
              l.quantite, l.prix_unitaire,
              (parseFloat(l.prix_unitaire||0) * parseInt(l.quantite||0)).toFixed(2),
              v.mode_paiement || '—'
            ])
          : [[new Date(v.date_vente).toLocaleString('fr-FR'), 'Vente #'+v.id, '—', '—', v.montant_total, v.mode_paiement || '—']]
      )
    ];
    const csv = lignes.map(r => r.join(';')).join('\n');
    telecharger(csv, `ventes_${new Date().toISOString().slice(0,10)}.csv`, 'text/csv;charset=utf-8;');
    afficherMessage('✅ Export CSV téléchargé', 'success');
  } catch {}
}

function telecharger(contenu, nom, type) {
  const blob = new Blob([contenu], { type });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url; a.download = nom; a.click();
  URL.revokeObjectURL(url);
}
