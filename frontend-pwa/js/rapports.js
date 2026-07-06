// === Module Rapports & Statistiques ===

async function chargerRapports() {
  try {
    const [ventesData, stockData] = await Promise.allSettled([
      apiFetch('/rapports/ventes'),
      apiFetch('/rapports/stock')
    ]);

    const ventes = ventesData.status === 'fulfilled' ? ventesData.value : [];
    const stock = stockData.status === 'fulfilled' ? stockData.value : [];

    const caTotal = ventes.reduce((s, v) => s + parseFloat(v.ca || 0), 0);
    const nbVentes = ventes.reduce((s, v) => s + parseInt(v.nb_ventes || 0), 0);
    const valeurStock = stock.reduce((s, s2) => s + parseFloat(s2.valeur_stock || 0), 0);

    const setEl = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    setEl('ca-total', caTotal.toFixed(2) + ' €');
    setEl('marge-total', '— €');
    setEl('taux-marge', '—');

    // Graphique ventes par jour (barres simples)
    const graphique = document.getElementById('graphique-ventes');
    if (graphique && ventes.length > 0) {
      const max = Math.max(...ventes.map(v => parseFloat(v.ca)));
      graphique.innerHTML = `<div class="w-full overflow-x-auto"><div class="flex items-end gap-1 h-36 min-w-0">` +
        ventes.slice(-30).reverse().map(v => {
          const h = max > 0 ? Math.round((parseFloat(v.ca) / max) * 100) : 0;
          return `<div class="flex flex-col items-center flex-1 min-w-0" title="${v.jour}: ${parseFloat(v.ca).toFixed(2)} €">
            <div class="w-full bg-primary rounded-t" style="height:${h}%"></div>
            <span class="text-[9px] text-gray-500 mt-1 truncate w-full text-center">${v.jour?.slice(5) || ''}</span>
          </div>`;
        }).join('') + `</div></div>`;
    } else if (graphique) {
      graphique.innerHTML = `<p class="text-gray-500 text-sm">Aucune donnée de vente disponible</p>`;
    }

    // Stock par catégorie
    const contStock = document.getElementById('graphique-ventes')?.nextElementSibling;
    const tableStock = document.querySelector('#rapports table tbody') || null;

  } catch {}
}

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
    const ventes = await apiFetch('/ventes') || [];
    const lignes = [['ID', 'Date', 'Montant', 'Mode paiement', 'Statut'],
      ...ventes.map(v => [v.id, new Date(v.date_vente).toLocaleString('fr-FR'), v.montant_total, v.mode_paiement, v.statut])
    ];
    const csv = lignes.map(r => r.join(';')).join('\n');
    telecharger(csv, `ventes_${new Date().toISOString().slice(0,10)}.csv`, 'text/csv;charset=utf-8;');
    afficherMessage('✅ Export CSV téléchargé', 'success');
  } catch {}
}

function telecharger(contenu, nom, type) {
  const blob = new Blob([contenu], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = nom; a.click();
  URL.revokeObjectURL(url);
}
