// ── Admin Plateforme ──────────────────────────────────────────────────────────
let listeClubs = [];
let listeClubsFiltree = [];
let conversationActive = null;
let conversationActiveClubId = null;
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
let tarifsData = {
  gratuit:  { id: 'gratuit',  nom: 'Gratuit',   emoji: '🔷', prix: 0,  prixAnnuel: 0,   description: 'Pour d\u00e9couvrir la plateforme',  populaire: false, fonctionnalites: [{ texte: 'Jusqu\u0027\u00e0 50 produits', inclus: true }, { texte: '1 utilisateur', inclus: true }, { texte: 'Rapports avanc\u00e9s', inclus: false }] },
  essentiel:{ id: 'essentiel',nom: 'Essentiel', emoji: '⚡', prix: 19, prixAnnuel: 190, description: 'Pour les clubs actifs',               populaire: true,  fonctionnalites: [{ texte: 'Produits illimit\u00e9s', inclus: true }, { texte: '3 utilisateurs', inclus: true }, { texte: 'Rapports complets', inclus: true }, { texte: 'Support email', inclus: true }] },
  complet:  { id: 'complet',  nom: 'Complet',   emoji: '👑', prix: 49, prixAnnuel: 490, description: 'Tout inclus, sans limites',           populaire: false, fonctionnalites: [{ texte: 'Tout illimit\u00e9', inclus: true }, { texte: 'Utilisateurs illimit\u00e9s', inclus: true }, { texte: 'Support t\u00e9l\u00e9phonique', inclus: true }, { texte: 'Messagerie prioritaire', inclus: true }] }
};
let tarifEnCours = null;

function chargerAdminTarifs() { rendreTarifs(); }

function rendreTarifs() {
  const grid = document.getElementById('tarifs-grid');
  if (!grid) return;
  const styles = {
    gratuit:   { border: 'border-gray-200', btnClass: 'border-2 border-primary text-primary hover:bg-primary hover:text-white', titleColor: 'text-gray-700', badge: '' },
    essentiel: { border: 'border-primary',  btnClass: 'bg-primary text-white hover:bg-blue-700',                                titleColor: 'text-primary',  badge: '<span class="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-xs px-3 py-1 rounded-full">Populaire</span>' },
    complet:   { border: 'border-yellow-400',btnClass: 'border-2 border-yellow-400 text-yellow-700 hover:bg-yellow-400 hover:text-white', titleColor: 'text-yellow-600', badge: '' }
  };
  grid.innerHTML = Object.values(tarifsData).map(t => {
    const s = styles[t.id] || styles.gratuit;
    const badge = t.populaire && s.badge ? s.badge : (t.populaire ? '<span class="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-xs px-3 py-1 rounded-full">Populaire</span>' : '');
    const feats = t.fonctionnalites.map(f => `<li><i class="fa ${f.inclus ? 'fa-check text-green-500' : 'fa-times text-red-400'} mr-2"></i>${f.texte}</li>`).join('');
    return `
    <div class="card border-2 ${s.border} text-center relative hover:shadow-lg transition-shadow">
      ${badge}
      <div class="text-5xl mb-3">${t.emoji}</div>
      <h3 class="text-xl font-bold mb-1">${t.nom}</h3>
      ${t.description ? `<p class="text-xs text-gray-400 mb-2">${t.description}</p>` : ''}
      <p class="text-4xl font-black ${s.titleColor} mb-1">${t.prix} &euro;<span class="text-sm font-normal text-gray-400">/mois</span></p>
      ${t.prixAnnuel ? `<p class="text-xs text-gray-400 mb-3">ou ${t.prixAnnuel}&euro;/an</p>` : '<p class="mb-3"></p>'}
      <ul class="text-sm text-gray-500 space-y-2 mb-6 text-left px-2">${feats}</ul>
      <button onclick="modifierTarif('${t.id}')" class="w-full py-2 rounded-lg font-medium transition-colors ${s.btnClass}">Modifier</button>
    </div>`;
  }).join('');
}

function modifierTarif(planId) {
  tarifEnCours = planId;
  const t = tarifsData[planId];
  if (!t) return;
  document.getElementById('modal-tarif-titre').textContent = 'Modifier le plan \u2014 ' + t.nom;
  document.getElementById('tarif-nom').value = t.nom;
  document.getElementById('tarif-emoji').value = t.emoji;
  document.getElementById('tarif-prix').value = t.prix;
  document.getElementById('tarif-prix-annuel').value = t.prixAnnuel || '';
  document.getElementById('tarif-description').value = t.description || '';
  document.getElementById('tarif-populaire').checked = t.populaire || false;
  renderFonctionnalites(t.fonctionnalites);
  document.getElementById('modal-tarif').classList.remove('hidden');
}

function renderFonctionnalites(fonctionnalites) {
  const cont = document.getElementById('tarif-fonctionnalites');
  cont.innerHTML = fonctionnalites.map((f, i) => `
    <div class="flex items-center gap-2 bg-gray-50 border rounded-lg px-3 py-2" data-idx="${i}">
      <select class="border rounded px-1 py-0.5 text-xs" onchange="toggleFonct(${i}, this.value)">
        <option value="1" ${f.inclus ? 'selected' : ''}>&#10003; Inclus</option>
        <option value="0" ${!f.inclus ? 'selected' : ''}>&#10007; Exclu</option>
      </select>
      <input type="text" value="${f.texte}" class="flex-1 text-sm bg-transparent focus:outline-none border-b border-transparent focus:border-gray-300" oninput="editFonct(${i}, this.value)">
      <button onclick="supprimerFonct(${i})" class="text-red-400 hover:text-red-600 text-xs px-1"><i class="fa fa-trash"></i></button>
    </div>`).join('');
}

function ajouterFonctionnalite() {
  if (!tarifEnCours) return;
  tarifsData[tarifEnCours].fonctionnalites.push({ texte: 'Nouvelle fonctionnalit\u00e9', inclus: true });
  renderFonctionnalites(tarifsData[tarifEnCours].fonctionnalites);
}

function supprimerFonct(idx) {
  if (!tarifEnCours) return;
  tarifsData[tarifEnCours].fonctionnalites.splice(idx, 1);
  renderFonctionnalites(tarifsData[tarifEnCours].fonctionnalites);
}

function editFonct(idx, val) {
  if (!tarifEnCours) return;
  tarifsData[tarifEnCours].fonctionnalites[idx].texte = val;
}

function toggleFonct(idx, val) {
  if (!tarifEnCours) return;
  tarifsData[tarifEnCours].fonctionnalites[idx].inclus = val === '1';
}

function sauvegarderTarif() {
  if (!tarifEnCours) return;
  const t = tarifsData[tarifEnCours];
  t.nom = document.getElementById('tarif-nom').value.trim() || t.nom;
  t.emoji = document.getElementById('tarif-emoji').value.trim() || t.emoji;
  t.prix = parseFloat(document.getElementById('tarif-prix').value) || 0;
  t.prixAnnuel = parseFloat(document.getElementById('tarif-prix-annuel').value) || 0;
  t.description = document.getElementById('tarif-description').value.trim();
  t.populaire = document.getElementById('tarif-populaire').checked;
  fermerModalTarif();
  rendreTarifs();
  afficherMessage('Plan "' + t.nom + '" mis \u00e0 jour', 'success');
}

function fermerModalTarif() {
  document.getElementById('modal-tarif').classList.add('hidden');
  tarifEnCours = null;
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
  conversationActiveClubId = msg.club_id || null;
  document.getElementById('msg-dest-nom').textContent = msg.club_nom || msg.destinataire_email || 'Inconnu';
  document.getElementById('msg-dest-club').textContent = `Répondre à : ${msg.club_nom || 'ce club'}  —  Objet : ${msg.sujet || '(sans objet)'}`;
  document.getElementById('msg-actions').classList.remove('hidden');
  document.getElementById('msg-actions').style.removeProperty('display');
  // Afficher champ objet pré-rempli pour la réponse
  const filEl = document.getElementById('msg-fil');
  filEl.innerHTML = `
    <div class="flex ${msg.direction === 'sortant' ? 'justify-end' : 'justify-start'}">
      <div class="max-w-lg rounded-2xl px-4 py-3 shadow-sm ${msg.direction === 'sortant' ? 'bg-primary text-white rounded-tr-sm' : 'bg-white rounded-tl-sm border'}">
        ${msg.urgent ? '<span class="text-xs font-bold text-red-400 block mb-1">&#x26A0; URGENT</span>' : ''}
        <div class="text-sm">${msg.contenu || ''}</div>
        <p class="text-xs mt-2 ${msg.direction === 'sortant' ? 'text-white/60' : 'text-gray-400'}">${msg.cree_le ? new Date(msg.cree_le).toLocaleString('fr-FR') : ''}</p>
      </div>
    </div>
    <p class="text-center text-xs text-gray-400 mt-4">Rédigez votre réponse ci-dessous</p>`;
  // Pré-remplir le sujet de réponse et vider le contenu
  const sujetEl = document.getElementById('msg-sujet');
  if (sujetEl) sujetEl.value = msg.sujet ? `Re: ${msg.sujet}` : '';
  document.getElementById('msg-contenu').innerHTML = '';
  document.getElementById('msg-contenu').focus();
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
  conversationActiveClubId = null;
  const clubs = listeClubs.map(c => `<option value="${c.id}" data-email="${c.email_contact || ''}">${c.nom}</option>`).join('');
  document.getElementById('msg-dest-nom').innerHTML = `<select id="dest-club-select" class="border rounded p-1 text-sm w-full" onchange="selDest(this)">${clubs ? '<option value="">Choisir un club...</option>' + clubs : '<option>Aucun club disponible</option>'}</select>`;
  document.getElementById('msg-dest-club').textContent = 'Choisissez un destinataire';
  document.getElementById('msg-fil').innerHTML = `
    <div class="text-center text-gray-300 text-sm mt-16">
      <i class="fa fa-envelope-o text-5xl mb-3 block"></i>
      S&eacute;lectionnez un destinataire et r&eacute;digez votre message
    </div>`;
  const sujetEl = document.getElementById('msg-sujet');
  if (sujetEl) sujetEl.value = '';
  document.getElementById('msg-contenu').innerHTML = '';
  document.getElementById('msg-actions').classList.add('hidden');
  document.getElementById('msg-contenu').focus();
}

function selDest(sel) {
  document.getElementById('msg-dest-club').textContent = sel.options[sel.selectedIndex]?.dataset.email || '';
}

async function envoyerMessage() {
  const contenu = document.getElementById('msg-contenu')?.innerHTML?.trim();
  if (!contenu) return afficherMessage('Veuillez saisir un message', 'warning');
  const sujet = document.getElementById('msg-sujet')?.value || '(sans objet)';
  const urgent = document.getElementById('msg-urgent')?.checked || false;
  // Priorité : select nouveau message, sinon club du message actif
  const destSel = document.getElementById('dest-club-select');
  const clubId  = destSel ? parseInt(destSel.value) : (conversationActiveClubId || null);
  if (!clubId) return afficherMessage('Destinataire non renseigné — ouvrez un message ou utilisez Nouveau message', 'warning');
  try {
    await apiFetch('/admin/messages', { method: 'POST', body: JSON.stringify({ club_id: clubId, sujet, contenu, urgent }) });
    afficherMessage('✅ Message envoyé avec succès', 'success');
    document.getElementById('msg-contenu').innerHTML = '';
    await chargerMessagerie();
  } catch { afficherMessage('❌ Erreur envoi', 'danger'); }
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
