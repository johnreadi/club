// ── Admin Plateforme ──────────────────────────────────────────────────────────
let listeClubs = [];
let listeClubsFiltree = [];
let conversationActive = null;
let conversations = [];
let filtreConvActif = 'tous';

// ── Dashboard ─────────────────────────────────────────────────────────────────
async function chargerAdminDashboard() {
  try {
    listeClubs = await apiFetch('/admin/clubs') || [];
    const actifs = listeClubs.filter(c => c.actif).length;
    const attente = listeClubs.filter(c => !c.actif).length;
    document.getElementById('adm-stat-clubs').textContent = listeClubs.length;
    document.getElementById('adm-stat-actifs').textContent = actifs;
    document.getElementById('adm-stat-attente').textContent = attente;
    const recentes = listeClubs.slice(-5).reverse();
    document.getElementById('adm-dernieres-inscriptions').innerHTML = recentes.length
      ? recentes.map(c => `<div class="flex justify-between py-2 border-b text-sm"><span class="font-medium">${c.nom}</span><span class="text-gray-400">${c.ville || '-'} &mdash; <span class="capitalize">${c.niveau_abonnement || 'gratuit'}</span></span></div>`).join('')
      : '<p class="text-gray-400">Aucune inscription</p>';
    try {
      const msgs = await apiFetch('/admin/messages') || [];
      const nonLus = msgs.filter(m => !m.lu && m.direction === 'entrant').length;
      document.getElementById('adm-stat-msgs').textContent = nonLus;
      const badge = document.getElementById('badge-msg');
      if (badge) { badge.textContent = nonLus; badge.classList.toggle('hidden', nonLus === 0); }
    } catch {}
  } catch {
    afficherMessage('Erreur chargement dashboard admin', 'danger');
  }
}

// ── Inscriptions ──────────────────────────────────────────────────────────────
async function chargerAdminInscriptions() {
  try {
    listeClubs = await apiFetch('/admin/clubs') || [];
    listeClubsFiltree = [...listeClubs];
    afficherInscriptions();
  } catch {
    afficherMessage('Erreur chargement inscriptions', 'danger');
  }
}

function filtrerInscriptions() {
  const q = (document.getElementById('filtre-inscriptions')?.value || '').toLowerCase();
  const statut = document.getElementById('filtre-statut-insc')?.value;
  const abo = document.getElementById('filtre-abo-insc')?.value;
  listeClubsFiltree = listeClubs.filter(c => {
    const matchQ = !q || c.nom.toLowerCase().includes(q) || (c.email_contact || '').toLowerCase().includes(q) || (c.ville || '').toLowerCase().includes(q);
    const matchS = !statut || (statut === 'actif' ? c.actif : !c.actif);
    const matchA = !abo || c.niveau_abonnement === abo;
    return matchQ && matchS && matchA;
  });
  afficherInscriptions();
}

function afficherInscriptions() {
  const tbody = document.getElementById('liste-inscriptions');
  if (!tbody) return;
  if (listeClubsFiltree.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" class="text-center py-8 text-gray-400">Aucun club trouv&eacute;</td></tr>`;
    return;
  }
  tbody.innerHTML = listeClubsFiltree.map(c => `
    <tr class="border-b hover:bg-gray-50 transition-colors">
      <td class="p-3 font-medium">${c.nom}</td>
      <td class="p-3 text-gray-500">${c.responsable_prenom || ''} ${c.responsable_nom || ''}</td>
      <td class="p-3 text-gray-500 text-xs">${c.email_contact || '-'}</td>
      <td class="p-3 text-gray-500">${c.ville || '-'}</td>
      <td class="p-3"><span class="px-2 py-0.5 rounded-full text-xs bg-blue-100 text-blue-700 capitalize">${(c.niveau_abonnement || 'gratuit').replace(/_/g, ' ')}</span></td>
      <td class="p-3 text-xs text-gray-400">${c.cree_le ? new Date(c.cree_le).toLocaleDateString('fr-FR') : '-'}</td>
      <td class="p-3 text-center">
        <span class="px-2 py-0.5 rounded-full text-xs font-medium ${c.actif ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}">${c.actif ? 'Actif' : 'Inactif'}</span>
      </td>
      <td class="p-3 text-center whitespace-nowrap">
        <button onclick="toggleActifClub(${c.id}, ${c.actif})" class="text-xs px-2 py-1 rounded ${c.actif ? 'bg-red-100 text-red-700 hover:bg-red-200' : 'bg-green-100 text-green-700 hover:bg-green-200'} mr-1">${c.actif ? 'Bloquer' : 'Autoriser'}</button>
        <button onclick="envoyerMessageAClub(${c.id}, '${c.nom.replace(/'/g, "\\'")}', '${(c.email_contact || '').replace(/'/g, "\\'")}' )" class="text-xs px-2 py-1 rounded bg-blue-100 text-blue-700 hover:bg-blue-200"><i class="fa fa-envelope"></i></button>
      </td>
    </tr>`).join('');
}

async function toggleActifClub(id, actif) {
  try {
    await apiFetch(`/admin/clubs/${id}`, { method: 'PUT', body: JSON.stringify({ actif: !actif }) });
    afficherMessage(`Club ${!actif ? 'autoris&eacute;' : 'bloqu&eacute;'} avec succ&egrave;s`, 'success');
    await chargerAdminInscriptions();
  } catch {}
}

// ── Tarifs ────────────────────────────────────────────────────────────────────
function chargerAdminTarifs() {}

function modifierTarif(plan) {
  const prix = prompt(`Nouveau prix mensuel pour le plan "${plan}" (en euros) :`, plan === 'essentiel' ? '19' : plan === 'complet' ? '49' : '0');
  if (prix === null) return;
  afficherMessage(`Tarif "${plan}" mis &agrave; jour : ${prix} &euro;/mois`, 'success');
}

// ── Paiements ─────────────────────────────────────────────────────────────────
function chargerAdminPaiements() {
  document.getElementById('adm-rev-mois').textContent = '0 €';
  document.getElementById('adm-abo-actifs').textContent = listeClubs.filter(c => c.actif && c.niveau_abonnement !== 'gratuit').length;
  document.getElementById('adm-paiements-retard').textContent = '0';
}

// ── Messagerie ────────────────────────────────────────────────────────────────
async function chargerMessagerie() {
  try {
    conversations = await apiFetch('/admin/messages') || [];
    afficherConversations();
  } catch {
    document.getElementById('liste-conversations').innerHTML = '<p class="p-4 text-sm text-gray-400">Erreur chargement</p>';
  }
}

function afficherConversations() {
  const liste = document.getElementById('liste-conversations');
  if (!liste) return;
  let filtered = conversations;
  if (filtreConvActif === 'non_lu') filtered = conversations.filter(m => !m.lu);
  if (filtreConvActif === 'envoye') filtered = conversations.filter(m => m.direction === 'sortant');
  const q = (document.getElementById('search-conv')?.value || '').toLowerCase();
  if (q) filtered = filtered.filter(m => (m.club_nom || m.destinataire_email || '').toLowerCase().includes(q) || (m.sujet || '').toLowerCase().includes(q));
  if (filtered.length === 0) {
    liste.innerHTML = '<p class="p-4 text-sm text-gray-400 text-center">Aucune conversation</p>';
    return;
  }
  liste.innerHTML = filtered.map(m => `
    <div onclick="ouvrirConversation(${m.id})" class="p-3 cursor-pointer hover:bg-blue-50 transition-colors ${conversationActive === m.id ? 'bg-blue-50 border-l-2 border-primary' : ''} ${!m.lu && m.direction === 'entrant' ? 'bg-blue-50/50' : ''}">
      <div class="flex justify-between items-start mb-1">
        <span class="font-medium text-sm ${!m.lu && m.direction === 'entrant' ? 'text-primary' : 'text-gray-800'}">${m.club_nom || m.destinataire_email || 'Inconnu'}</span>
        <span class="text-xs text-gray-400">${m.cree_le ? new Date(m.cree_le).toLocaleDateString('fr-FR') : ''}</span>
      </div>
      <p class="text-xs text-gray-500 truncate">${m.sujet || '(sans objet)'}</p>
      <div class="flex gap-1 mt-1">
        ${!m.lu && m.direction === 'entrant' ? '<span class="text-xs bg-primary text-white px-1.5 py-0.5 rounded-full">Nouveau</span>' : ''}
        ${m.urgent ? '<span class="text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full">Urgent</span>' : ''}
      </div>
    </div>`).join('');
}

async function ouvrirConversation(id) {
  conversationActive = id;
  const msg = conversations.find(m => m.id === id);
  if (!msg) return;
  document.getElementById('msg-dest-nom').textContent = msg.club_nom || msg.destinataire_email || 'Inconnu';
  document.getElementById('msg-dest-club').textContent = msg.sujet || '';
  document.getElementById('msg-actions').classList.remove('hidden');
  document.getElementById('msg-actions').style.removeProperty('display');
  document.getElementById('msg-fil').innerHTML = `
    <div class="flex ${msg.direction === 'sortant' ? 'justify-end' : 'justify-start'}">
      <div class="max-w-lg rounded-2xl px-4 py-3 shadow-sm ${msg.direction === 'sortant' ? 'bg-primary text-white rounded-tr-sm' : 'bg-white rounded-tl-sm border'}">
        ${msg.urgent ? '<span class="text-xs font-bold text-red-400 block mb-1">&#x26A0; URGENT</span>' : ''}
        <div class="text-sm">${msg.contenu || ''}</div>
        <p class="text-xs mt-2 ${msg.direction === 'sortant' ? 'text-white/60' : 'text-gray-400'}">${msg.cree_le ? new Date(msg.cree_le).toLocaleString('fr-FR') : ''}</p>
      </div>
    </div>`;
  afficherConversations();
}

function filtreMsg(type) {
  filtreConvActif = type;
  ['tous', 'nonlu', 'envoye'].forEach(t => {
    const btn = document.getElementById(`msg-tab-${t}`);
    if (btn) btn.className = `flex-1 py-2 text-gray-400 hover:text-gray-700 text-xs font-medium`;
  });
  const actifBtn = document.getElementById(`msg-tab-${type === 'non_lu' ? 'nonlu' : type}`);
  if (actifBtn) actifBtn.className = `flex-1 py-2 border-b-2 border-primary text-primary text-xs font-medium`;
  afficherConversations();
}

function filtrerConversations() { afficherConversations(); }

function nouveauMessage() {
  conversationActive = null;
  const clubs = listeClubs.map(c => `<option value="${c.id}" data-email="${c.email_contact || ''}">${c.nom}</option>`).join('');
  document.getElementById('msg-dest-nom').innerHTML = `<select id="dest-club-select" class="border rounded p-1 text-sm w-full" onchange="selDest(this)">${clubs ? '<option value="">Choisir un club...</option>' + clubs : '<option>Aucun club disponible</option>'}</select>`;
  document.getElementById('msg-dest-club').textContent = 'Nouveau message';
  document.getElementById('msg-fil').innerHTML = `
    <div class="p-4">
      <label class="block text-sm mb-1 font-medium text-gray-600">Objet du message</label>
      <input type="text" id="msg-sujet" placeholder="Objet..." class="w-full border p-2 rounded-lg mb-3 text-sm">
    </div>`;
  document.getElementById('msg-contenu').innerHTML = '';
  document.getElementById('msg-actions').classList.add('hidden');
}

function selDest(sel) {
  document.getElementById('msg-dest-club').textContent = sel.options[sel.selectedIndex]?.dataset.email || '';
}

async function envoyerMessage() {
  const contenu = document.getElementById('msg-contenu')?.innerHTML?.trim();
  if (!contenu) return afficherMessage('Veuillez saisir un message', 'warning');
  const sujet = document.getElementById('msg-sujet')?.value || '(sans objet)';
  const destSel = document.getElementById('dest-club-select');
  const clubId = destSel ? destSel.value : null;
  const urgent = document.getElementById('msg-urgent')?.checked || false;
  if (!clubId) return afficherMessage('S&eacute;lectionnez un destinataire', 'warning');
  try {
    await apiFetch('/admin/messages', { method: 'POST', body: JSON.stringify({ club_id: parseInt(clubId), sujet, contenu, urgent }) });
    afficherMessage('Message envoy&eacute; avec succ&egrave;s', 'success');
    document.getElementById('msg-contenu').innerHTML = '';
    await chargerMessagerie();
  } catch {}
}

function envoyerMessageAClub(clubId, nom, email) {
  naviguerVers('admin-messagerie');
  setTimeout(() => {
    nouveauMessage();
    const sel = document.getElementById('dest-club-select');
    if (sel) { sel.value = clubId; selDest(sel); }
  }, 300);
}

function archiverConversation() { afficherMessage('Conversation archiv&eacute;e', 'success'); }
function supprimerConversation() {
  if (!confirm('Supprimer cette conversation ?')) return;
  conversations = conversations.filter(m => m.id !== conversationActive);
  conversationActive = null;
  document.getElementById('msg-fil').innerHTML = '<div class="text-center text-gray-300 text-sm mt-16"><i class="fa fa-envelope-o text-5xl mb-3 block"></i>S&eacute;lectionnez une conversation</div>';
  document.getElementById('msg-dest-nom').textContent = 'S&eacute;lectionnez une conversation';
  document.getElementById('msg-dest-club').textContent = '';
  afficherConversations();
}

function fmtMsg(cmd) { document.execCommand(cmd, false, null); document.getElementById('msg-contenu')?.focus(); }
function insererLien() {
  const url = prompt('URL du lien :');
  if (url) document.execCommand('createLink', false, url);
}
function insererEmoji() {
  const emojis = ['😊','👍','✅','⚠️','📢','🎉','💬','📌','🔔','💡'];
  const e = prompt('Emoji :\n' + emojis.join('  '));
  if (e) document.execCommand('insertText', false, e);
}
function ajouterPJ(event) {
  const f = event.target.files[0];
  if (!f) return;
  const liste = document.getElementById('msg-pj-liste');
  liste.classList.remove('hidden');
  liste.innerHTML += `<span class="bg-gray-100 border rounded px-2 py-1 text-xs flex items-center gap-1"><i class="fa fa-paperclip"></i>${f.name}</span>`;
}

// ── Parametres admin ──────────────────────────────────────────────────────────
function chargerAdminParametres() {}
function sauvegarderAdminParams() { afficherMessage('Param&egrave;tres plateforme sauvegard&eacute;s', 'success'); }
function sauvegarderSecurite() { afficherMessage('Param&egrave;tres s&eacute;curit&eacute; sauvegard&eacute;s', 'success'); }
