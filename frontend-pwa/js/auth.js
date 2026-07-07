document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  if (token) {
    chargerSession();
  } else {
    window.location.href = '/landing.html';
  }

  document.getElementById('form-connexion').addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.target;
    const message = document.getElementById('message-connexion');
    message.classList.add('hidden');

    try {
      const res = await fetch('/api/auth/connexion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.email.value,
          mot_de_passe: form.mot_de_passe.value
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.erreur);

      localStorage.setItem('token', data.token);
      localStorage.setItem('utilisateur', JSON.stringify(data.utilisateur));
      chargerSession();
    } catch (err) {
      message.textContent = err.message;
      message.className = 'mb-4 p-2 rounded bg-red-100 text-red-700';
      message.classList.remove('hidden');
    }
  });
});

function chargerSession() {
  const utilisateur = JSON.parse(localStorage.getItem('utilisateur') || '{}');
  const nomComplet = [utilisateur.prenom, utilisateur.nom].filter(Boolean).join(' ') || utilisateur.email || '';
  document.getElementById('nom-utilisateur').textContent = nomComplet;
  document.getElementById('nom-club').textContent = utilisateur.club_nom || (utilisateur.role === 'admin_plateforme' ? 'Administration Plateforme' : '');
  document.getElementById('ecran-connexion').classList.add('hidden');
  document.getElementById('interface-principale').classList.remove('hidden');

  if (utilisateur.role === 'admin_plateforme') {
    document.getElementById('menu-club').classList.add('hidden');
    document.getElementById('menu-admin').classList.remove('hidden');
    naviguerVers('admin-dashboard');
  } else {
    naviguerVers('accueil');
  }
}

function deconnexion() {
  localStorage.clear();
  window.location.href = '/landing.html';
}
