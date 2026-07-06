let parametresActuels = {};
let alignementActuel = 'center';
let logoBase64 = null;

async function chargerParametres() {
  try {
    const data = await apiFetch('/api/parametres');
    parametresActuels = data;
    remplirFormulaire(data);
    appliquerInterface(data);
  } catch (e) {
    console.error('Erreur chargement paramètres', e);
  }
}

function remplirFormulaire(d) {
  const v = (id, val) => { const el = document.getElementById(id); if (el) el.value = val || ''; };
  const c = (id, val) => { const el = document.getElementById(id); if (el) el.checked = !!val; };

  v('peri-imprimante-nom', d.imprimante_nom);
  v('peri-ticket-nom', d.imprimante_tickets_nom);
  c('peri-douchette', d.douchette_activee !== false);

  v('etiq-largeur', d.etiquette_largeur || 60);
  v('etiq-hauteur', d.etiquette_hauteur || 40);
  v('etiq-police', d.etiquette_police || 'Arial');
  v('etiq-taille-nom', d.etiquette_taille_nom || 14);
  v('etiq-taille-prix', d.etiquette_taille_prix || 18);
  v('etiq-taille-code', d.etiquette_taille_code || 10);
  v('etiq-couleur-texte', d.etiquette_couleur_texte || '#000000');
  v('etiq-couleur-fond', d.etiquette_couleur_fond || '#ffffff');
  c('etiq-show-prix', d.etiquette_afficher_prix !== false);
  c('etiq-show-ref', d.etiquette_afficher_reference !== false);
  c('etiq-show-code', d.etiquette_afficher_codebarre !== false);
  c('etiq-show-logo', d.etiquette_afficher_logo);

  alignementActuel = d.etiquette_alignement || 'center';
  setAlignement(alignementActuel, false);

  if (d.etiquette_logo_url) {
    v('etiq-logo-url', d.etiquette_logo_url);
    afficherAperçuLogo(d.etiquette_logo_url);
  }

  v('pref-couleur-primaire', d.interface_couleur_primaire || '#3B82F6');
  v('pref-couleur-sidebar', d.interface_couleur_sidebar || '#1e3a5f');
  const hexP = document.getElementById('pref-couleur-hex');
  const hexS = document.getElementById('pref-sidebar-hex');
  if (hexP) hexP.textContent = d.interface_couleur_primaire || '#3B82F6';
  if (hexS) hexS.textContent = d.interface_couleur_sidebar || '#1e3a5f';

  mettreAJourApercu();
}

function appliquerInterface(d) {
  const primaire = d.interface_couleur_primaire || '#3B82F6';
  const sidebar = d.interface_couleur_sidebar || '#1e3a5f';
  document.documentElement.style.setProperty('--color-primary', primaire);
  const aside = document.querySelector('aside');
  if (aside && sidebar !== '#1e3a5f') {
    aside.style.background = sidebar;
    aside.querySelectorAll('.menu-item').forEach(el => el.style.color = '#fff');
  }
  const prevP = document.getElementById('prev-primaire');
  const prevS = document.getElementById('prev-sidebar');
  if (prevP) prevP.style.background = primaire;
  if (prevS) prevS.style.background = sidebar;
}

function ongletParam(nom) {
  document.querySelectorAll('.param-panel').forEach(p => p.classList.add('hidden'));
  document.querySelectorAll('.tab-param').forEach(t => {
    t.classList.remove('active-tab', 'bg-white');
    t.classList.add('bg-gray-100');
  });
  document.getElementById('param-' + nom).classList.remove('hidden');
  const tab = document.getElementById('tab-' + nom);
  tab.classList.add('active-tab', 'bg-white');
  tab.classList.remove('bg-gray-100');
}

function setAlignement(val, save = true) {
  alignementActuel = val;
  ['left','center','right'].forEach(a => {
    const btn = document.getElementById('align-' + a);
    if (!btn) return;
    if (a === val) {
      btn.classList.add('bg-primary','text-white');
      btn.classList.remove('hover:bg-gray-100');
    } else {
      btn.classList.remove('bg-primary','text-white');
      btn.classList.add('hover:bg-gray-100');
    }
  });
  mettreAJourApercu();
}

function mettreAJourApercu() {
  const police = document.getElementById('etiq-police')?.value || 'Arial';
  const tailleNom = document.getElementById('etiq-taille-nom')?.value || 14;
  const taillePrix = document.getElementById('etiq-taille-prix')?.value || 18;
  const tailleCode = document.getElementById('etiq-taille-code')?.value || 10;
  const couleurTexte = document.getElementById('etiq-couleur-texte')?.value || '#000000';
  const couleurFond = document.getElementById('etiq-couleur-fond')?.value || '#ffffff';
  const largeur = document.getElementById('etiq-largeur')?.value || 60;
  const hauteur = document.getElementById('etiq-hauteur')?.value || 40;
  const showPrix = document.getElementById('etiq-show-prix')?.checked;
  const showRef = document.getElementById('etiq-show-ref')?.checked;
  const showCode = document.getElementById('etiq-show-code')?.checked;
  const showLogo = document.getElementById('etiq-show-logo')?.checked;

  const ap = document.getElementById('apercu-etiquette');
  if (!ap) return;
  ap.style.fontFamily = police;
  ap.style.color = couleurTexte;
  ap.style.background = couleurFond;
  ap.style.textAlign = alignementActuel;
  ap.style.width = Math.min(largeur * 2.5, 280) + 'px';
  ap.style.minHeight = Math.min(hauteur * 2.5, 200) + 'px';

  const apNom = document.getElementById('ap-nom');
  const apRef = document.getElementById('ap-ref');
  const apPrix = document.getElementById('ap-prix');
  const apCode = document.getElementById('ap-code');
  const apLogo = document.getElementById('ap-logo');

  if (apNom) apNom.style.fontSize = tailleNom + 'px';
  if (apRef) { apRef.style.fontSize = (tailleCode) + 'px'; apRef.style.display = showRef ? '' : 'none'; }
  if (apPrix) { apPrix.style.fontSize = taillePrix + 'px'; apPrix.style.display = showPrix ? '' : 'none'; }
  if (apCode) { apCode.style.fontSize = tailleCode + 'px'; apCode.style.display = showCode ? '' : 'none'; }
  if (apLogo) apLogo.style.display = showLogo ? '' : 'none';
}

function previewCouleur(val) {
  const hex = document.getElementById('pref-couleur-hex');
  const prev = document.getElementById('prev-primaire');
  if (hex) hex.textContent = val;
  if (prev) prev.style.background = val;
}

function previewSidebar(val) {
  const hex = document.getElementById('pref-sidebar-hex');
  const prev = document.getElementById('prev-sidebar');
  if (hex) hex.textContent = val;
  if (prev) prev.style.background = val;
  const aside = document.querySelector('aside');
  if (aside) aside.style.background = val;
}

function appliquerPalette(primaire, sidebar) {
  const ep = document.getElementById('pref-couleur-primaire');
  const es = document.getElementById('pref-couleur-sidebar');
  if (ep) { ep.value = primaire; previewCouleur(primaire); }
  if (es) { es.value = sidebar; previewSidebar(sidebar); }
  document.documentElement.style.setProperty('--color-primary', primaire);
}

function setTheme(theme) {
  document.getElementById('theme-clair')?.classList.toggle('border-primary', theme === 'clair');
  document.getElementById('theme-sombre')?.classList.toggle('border-primary', theme === 'sombre');
  if (theme === 'sombre') {
    document.body.classList.add('bg-gray-900', 'text-white');
    document.body.classList.remove('bg-light', 'text-dark');
  } else {
    document.body.classList.remove('bg-gray-900', 'text-white');
    document.body.classList.add('bg-light', 'text-dark');
  }
  parametresActuels.interface_theme = theme;
}

function importerLogo(event) {
  const file = event.target.files[0];
  if (!file) return;
  if (file.size > 2 * 1024 * 1024) { alert('Fichier trop lourd (max 2 Mo)'); return; }
  const reader = new FileReader();
  reader.onload = (e) => {
    logoBase64 = e.target.result;
    document.getElementById('etiq-logo-url').value = logoBase64;
    afficherAperçuLogo(logoBase64);
  };
  reader.readAsDataURL(file);
}

function dropLogo(event) {
  event.preventDefault();
  const file = event.dataTransfer.files[0];
  if (file) {
    const fakeEvent = { target: { files: [file] } };
    importerLogo(fakeEvent);
  }
}

function afficherAperçuLogo(src) {
  const apercu = document.getElementById('apercu-logo');
  const img = document.getElementById('logo-preview');
  if (apercu && img) {
    img.src = src;
    apercu.classList.remove('hidden');
  }
  let apLogo = document.getElementById('ap-logo');
  if (!apLogo) {
    apLogo = document.createElement('img');
    apLogo.id = 'ap-logo';
    apLogo.className = 'max-h-8 mx-auto mb-1';
    const ap = document.getElementById('apercu-etiquette');
    if (ap) ap.prepend(apLogo);
  }
  apLogo.src = src;
}

function supprimerLogo() {
  logoBase64 = null;
  document.getElementById('etiq-logo-url').value = '';
  document.getElementById('apercu-logo')?.classList.add('hidden');
  const apLogo = document.getElementById('ap-logo');
  if (apLogo) apLogo.remove();
}

async function sauvegarderParametres() {
  try {
    const payload = {
      imprimante_nom: document.getElementById('peri-imprimante-nom')?.value,
      imprimante_tickets_nom: document.getElementById('peri-ticket-nom')?.value,
      douchette_activee: document.getElementById('peri-douchette')?.checked,
      etiquette_largeur: parseInt(document.getElementById('etiq-largeur')?.value) || 60,
      etiquette_hauteur: parseInt(document.getElementById('etiq-hauteur')?.value) || 40,
      etiquette_police: document.getElementById('etiq-police')?.value || 'Arial',
      etiquette_taille_nom: parseInt(document.getElementById('etiq-taille-nom')?.value) || 14,
      etiquette_taille_prix: parseInt(document.getElementById('etiq-taille-prix')?.value) || 18,
      etiquette_taille_code: parseInt(document.getElementById('etiq-taille-code')?.value) || 10,
      etiquette_couleur_texte: document.getElementById('etiq-couleur-texte')?.value || '#000000',
      etiquette_couleur_fond: document.getElementById('etiq-couleur-fond')?.value || '#ffffff',
      etiquette_alignement: alignementActuel,
      etiquette_afficher_logo: document.getElementById('etiq-show-logo')?.checked,
      etiquette_logo_url: document.getElementById('etiq-logo-url')?.value || null,
      etiquette_afficher_prix: document.getElementById('etiq-show-prix')?.checked,
      etiquette_afficher_reference: document.getElementById('etiq-show-ref')?.checked,
      etiquette_afficher_codebarre: document.getElementById('etiq-show-code')?.checked,
      interface_couleur_primaire: document.getElementById('pref-couleur-primaire')?.value || '#3B82F6',
      interface_couleur_sidebar: document.getElementById('pref-couleur-sidebar')?.value || '#1e3a5f',
      interface_theme: parametresActuels.interface_theme || 'clair'
    };
    const data = await apiFetch('/api/parametres', { method: 'PUT', body: JSON.stringify(payload) });
    parametresActuels = data;
    appliquerInterface(data);
    afficherMessage('✅ Paramètres sauvegardés avec succès', 'success');
  } catch (e) {
    afficherMessage('❌ Erreur lors de la sauvegarde', 'error');
  }
}

function testerImpression() {
  const nom = document.getElementById('peri-imprimante-nom')?.value || 'Imprimante étiquettes';
  const win = window.open('', '_blank', 'width=400,height=300');
  win.document.write(`<html><body style="font-family:Arial;text-align:center;padding:20px">
    <h2>Test d'impression</h2>
    <p>Imprimante : <strong>${nom}</strong></p>
    <div style="border:2px solid #000;padding:10px;display:inline-block;margin:10px">
      <p style="font-size:14px;font-weight:bold">Produit exemple</p>
      <p style="font-size:10px">RÉF: TEST001</p>
      <p style="font-size:18px;font-weight:bold">9.90 €</p>
      <p style="font-size:10px;font-family:monospace">||| 1234567890 |||</p>
    </div>
    <script>window.print();window.close();<\/script>
  </body></html>`);
}

function testerTicket() {
  const nom = document.getElementById('peri-ticket-nom')?.value || 'Imprimante tickets';
  const win = window.open('', '_blank', 'width=300,height=400');
  win.document.write(`<html><body style="font-family:'Courier New';width:280px;padding:10px">
    <h3 style="text-align:center">GESTION DES CLUBS</h3>
    <p style="text-align:center;font-size:12px">${nom}</p>
    <hr>
    <p>Produit test x1 ........ 9.90 €</p>
    <hr>
    <p><strong>TOTAL : 9.90 €</strong></p>
    <p style="text-align:center;font-size:10px">Merci de votre visite</p>
    <script>window.print();window.close();<\/script>
  </body></html>`);
}

document.addEventListener('input', (e) => {
  const ids = ['etiq-police','etiq-taille-nom','etiq-taille-prix','etiq-taille-code',
                'etiq-couleur-texte','etiq-couleur-fond','etiq-largeur','etiq-hauteur'];
  if (ids.includes(e.target.id)) mettreAJourApercu();
});
document.addEventListener('change', (e) => {
  const ids = ['etiq-show-prix','etiq-show-ref','etiq-show-code','etiq-show-logo'];
  if (ids.includes(e.target.id)) mettreAJourApercu();
});

document.getElementById('test-scan')?.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    const val = e.target.value.trim();
    if (val) {
      e.target.style.background = '#d1fae5';
      setTimeout(() => { e.target.style.background = ''; e.target.value = ''; }, 1000);
      afficherMessage('✅ Douchette OK — Code scanné : ' + val, 'success');
    }
  }
});
