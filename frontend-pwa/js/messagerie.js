// === Messagerie Club ===

let _msgMessages    = [];
let _msgActifId     = null;
let _msgFiltre      = 'tous';
let _msgModeNouv    = false;

// ── Chargement ────────────────────────────────────────────────────────────────
async function chargerMessagerie_club() {
  try {
    _msgMessages = await apiFetch('/messages') || [];
    _msgMajBadge();
    _msgAfficherListe();
  } catch (e) {
    const liste = document.getElementById('msg-liste-club');
    if (liste) liste.innerHTML = '<p class="p-4 text-sm text-red-400 text-center">Erreur de chargement</p>';
  }
}

// ── Badge non lus dans le menu ────────────────────────────────────────────────
function _msgMajBadge() {
  const nonLus = _msgMessages.filter(m => !m.lu && m.direction === 'sortant').length;
  const badge  = document.getElementById('badge-msg-club');
  if (badge) { badge.textContent = nonLus; badge.classList.toggle('hidden', nonLus === 0); }
}

// ── Affichage liste ───────────────────────────────────────────────────────────
function _msgAfficherListe() {
  const liste = document.getElementById('msg-liste-club');
  if (!liste) return;
  let msgs = _msgMessages;
  if (_msgFiltre === 'recus')   msgs = msgs.filter(m => m.direction === 'sortant');
  if (_msgFiltre === 'envoyes') msgs = msgs.filter(m => m.direction === 'entrant');
  const q = (document.getElementById('msg-search-club')?.value || '').toLowerCase();
  if (q) msgs = msgs.filter(m => (m.sujet || '').toLowerCase().includes(q) || (m.contenu || '').toLowerCase().includes(q));

  if (msgs.length === 0) {
    liste.innerHTML = '<p class="p-4 text-sm text-gray-400 text-center">Aucun message</p>';
    return;
  }
  liste.innerHTML = msgs.map(m => {
    const isNonLu  = !m.lu && m.direction === 'sortant';
    const isActif  = _msgActifId === m.id;
    const dt       = m.cree_le ? new Date(m.cree_le).toLocaleDateString('fr-FR', {day:'2-digit',month:'short'}) : '';
    const dirLabel = m.direction === 'sortant'
      ? '<span class="text-xs bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded-full">Re&ccedil;u</span>'
      : '<span class="text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full">Envoy&eacute;</span>';
    return `<div onclick="msg_ouvrirMessage(${m.id})" class="p-3 cursor-pointer hover:bg-blue-50 transition-colors ${isActif ? 'bg-blue-50 border-l-3 border-primary' : ''} ${isNonLu ? 'bg-blue-50/60' : ''}">
      <div class="flex justify-between items-start mb-1">
        <span class="font-${isNonLu ? 'semibold' : 'medium'} text-sm ${isNonLu ? 'text-primary' : 'text-gray-800'} truncate max-w-40">${m.sujet || '(sans objet)'}</span>
        <span class="text-xs text-gray-400 flex-shrink-0 ml-1">${dt}</span>
      </div>
      <p class="text-xs text-gray-500 truncate mb-1">${_txtOnly(m.contenu || '').slice(0, 60)}</p>
      <div class="flex items-center gap-1">
        ${dirLabel}
        ${m.urgent ? '<span class="text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full">Urgent</span>' : ''}
        ${isNonLu ? '<span class="w-2 h-2 rounded-full bg-primary ml-auto flex-shrink-0"></span>' : ''}
      </div>
    </div>`;
  }).join('');
}

// ── Ouvrir un message ─────────────────────────────────────────────────────────
async function msg_ouvrirMessage(id) {
  _msgActifId  = id;
  _msgModeNouv = false;
  const msg = _msgMessages.find(m => m.id === id);
  if (!msg) return;

  // Marquer comme lu si reçu non lu
  if (!msg.lu && msg.direction === 'sortant') {
    msg.lu = true;
    apiFetch(`/messages/${id}/lu`, { method: 'PATCH' }).catch(() => {});
    _msgMajBadge();
  }

  const titre = document.getElementById('msg-conv-titre');
  const ssTitre = document.getElementById('msg-conv-sous-titre');
  if (titre) titre.textContent = msg.sujet || '(sans objet)';
  if (ssTitre) ssTitre.textContent = msg.direction === 'sortant' ? 'Message reçu de l\'administration' : 'Message envoyé à l\'administration';

  const actions = document.getElementById('msg-conv-actions');
  if (actions) actions.style.removeProperty('display');

  const fil = document.getElementById('msg-fil-club');
  if (fil) {
    const isSortant = msg.direction === 'sortant';
    const dt = msg.cree_le ? new Date(msg.cree_le).toLocaleString('fr-FR', {day:'2-digit',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'}) : '';
    fil.innerHTML = `
      <div class="flex ${isSortant ? 'justify-start' : 'justify-end'}">
        <div class="max-w-xl rounded-2xl px-4 py-3 shadow-sm ${isSortant ? 'bg-white border border-gray-100 rounded-tl-sm' : 'bg-primary text-white rounded-tr-sm'}">
          ${msg.urgent ? `<div class="flex items-center gap-1 text-xs font-bold ${isSortant ? 'text-red-500' : 'text-red-200'} mb-2"><i class="fa fa-exclamation-circle"></i> URGENT</div>` : ''}
          <div class="text-sm leading-relaxed">${msg.contenu || ''}</div>
          <p class="text-xs mt-2 ${isSortant ? 'text-gray-400' : 'text-white/60'}">${isSortant ? '<i class="fa fa-headset mr-1"></i>Administration' : '<i class="fa fa-building mr-1"></i>Vous'} &mdash; ${dt}</p>
        </div>
      </div>
      <div class="text-center">
        <button onclick="msg_nouveauMessage()" class="text-xs text-primary hover:underline mt-2"><i class="fa fa-reply mr-1"></i>Envoyer un nouveau message</button>
      </div>`;
  }

  // Masquer les champs nouveau message, montrer juste le fil + zone reply
  const champsNouv = document.getElementById('msg-champs-nouveaux');
  if (champsNouv) champsNouv.classList.add('hidden');
  document.getElementById('msg-contenu-club').innerHTML = '';

  _msgAfficherListe();
}

// ── Nouveau message ───────────────────────────────────────────────────────────
function msg_nouveauMessage() {
  _msgActifId  = null;
  _msgModeNouv = true;
  const titre   = document.getElementById('msg-conv-titre');
  const ssTitre = document.getElementById('msg-conv-sous-titre');
  if (titre)   titre.textContent    = 'Nouveau message';
  if (ssTitre) ssTitre.textContent  = 'Destinataire : Administration READI.Fr';

  const fil = document.getElementById('msg-fil-club');
  if (fil) fil.innerHTML = `
    <div class="flex justify-center items-center h-full text-gray-300">
      <div class="text-center">
        <i class="fa fa-envelope-o text-4xl mb-2 block"></i>
        <p class="text-sm">R&eacute;digez votre message ci-dessous</p>
      </div>
    </div>`;

  const champsNouv = document.getElementById('msg-champs-nouveaux');
  if (champsNouv) champsNouv.classList.remove('hidden');
  document.getElementById('msg-sujet-club').value = '';
  document.getElementById('msg-contenu-club').innerHTML = '';
  document.getElementById('msg-contenu-club').focus();

  const actions = document.getElementById('msg-conv-actions');
  if (actions) actions.style.display = 'none';

  _msgAfficherListe();
}

// ── Envoyer ───────────────────────────────────────────────────────────────────
async function msg_envoyer() {
  const contenu = document.getElementById('msg-contenu-club')?.innerHTML?.trim();
  const texte   = _txtOnly(contenu || '');
  if (!texte) return afficherMessage('Veuillez saisir un message', 'warning');

  const sujet   = document.getElementById('msg-sujet-club')?.value?.trim() || '(sans objet)';
  const urgent  = document.getElementById('msg-urgent-club')?.checked || false;

  try {
    const res = await apiFetch('/messages', {
      method: 'POST',
      body: JSON.stringify({ sujet, contenu, urgent })
    });
    if (res && res.id) {
      afficherMessage('✅ Message envoyé à l\'administration', 'success');
      document.getElementById('msg-contenu-club').innerHTML = '';
      document.getElementById('msg-sujet-club').value = '';
      document.getElementById('msg-urgent-club').checked = false;
      await chargerMessagerie_club();
      msg_ouvrirMessage(res.id);
    }
  } catch (e) {
    afficherMessage('❌ Erreur envoi message', 'danger');
  }
}

// ── Supprimer actif (en BDD via DELETE /messages/:id) ────────────────────────
async function msg_supprimerActif() {
  if (!_msgActifId) return;
  if (!confirm('Supprimer ce message ?')) return;
  const idASupprimer = _msgActifId;
  try {
    await apiFetch(`/messages/${idASupprimer}`, { method: 'DELETE' });
    _msgMessages = _msgMessages.filter(m => m.id !== idASupprimer);
    _msgActifId  = null;
    const fil = document.getElementById('msg-fil-club');
    if (fil) fil.innerHTML = '<div class="text-center text-gray-300 text-sm mt-16"><i class="fa fa-envelope-o text-5xl mb-3 block"></i>S&eacute;lectionnez un message</div>';
    const titre = document.getElementById('msg-conv-titre');
    if (titre) titre.textContent = 'Sélectionnez un message';
    const champsNouv = document.getElementById('msg-champs-nouveaux');
    if (champsNouv) champsNouv.classList.add('hidden');
    const actions = document.getElementById('msg-conv-actions');
    if (actions) actions.style.display = 'none';
    _msgMajBadge();
    _msgAfficherListe();
    afficherMessage('✅ Message supprimé', 'success');
  } catch (e) {
    afficherMessage('❌ Erreur lors de la suppression', 'danger');
  }
}

// ── Filtre onglets ────────────────────────────────────────────────────────────
function msg_filtre(type) {
  _msgFiltre = type;
  ['tous', 'recus', 'envoyes'].forEach(t => {
    const btn = document.getElementById(`msg-tab-club-${t}`);
    if (!btn) return;
    if (t === type) {
      btn.className = 'flex-1 py-3 text-xs font-medium text-primary border-b-2 border-primary';
    } else {
      btn.className = 'flex-1 py-3 text-xs font-medium text-gray-400 hover:text-gray-600';
    }
  });
  _msgAfficherListe();
}

function msg_filtrer() { _msgAfficherListe(); }

// ── Outils éditeur ────────────────────────────────────────────────────────────
function msg_fmt(cmd) {
  document.execCommand(cmd, false, null);
  document.getElementById('msg-contenu-club')?.focus();
}

function msg_emoji() {
  const emojis = ['😊','👍','✅','⚠️','📢','🎉','💬','📌','🔔','💡','🏆','🤝'];
  const e = prompt('Choisissez un emoji :\n' + emojis.join('  '));
  if (e) document.execCommand('insertText', false, e);
}

// ── Helper texte brut ─────────────────────────────────────────────────────────
function _txtOnly(html) {
  const div = document.createElement('div');
  div.innerHTML = html;
  return (div.textContent || div.innerText || '').trim();
}
