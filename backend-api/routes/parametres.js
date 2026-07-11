const express = require('express');
const pool = require('../db');
const { verifierToken } = require('../middleware/auth');
const router = express.Router();

router.use(verifierToken);

router.get('/', async (req, res) => {
  try {
    const { club_id } = req.utilisateur;
    let result = await pool.query('SELECT * FROM parametres_club WHERE club_id = $1', [club_id]);
    if (result.rows.length === 0) {
      result = await pool.query(
        'INSERT INTO parametres_club (club_id) VALUES ($1) RETURNING *',
        [club_id]
      );
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ erreur: 'Erreur serveur' });
  }
});

router.put('/', async (req, res) => {
  try {
    const { club_id } = req.utilisateur;
    const {
      imprimante_nom, imprimante_tickets_nom, douchette_activee,
      etiquette_largeur, etiquette_hauteur, etiquette_police,
      etiquette_taille_nom, etiquette_taille_prix, etiquette_taille_code,
      etiquette_couleur_texte, etiquette_couleur_fond, etiquette_alignement,
      etiquette_afficher_logo, etiquette_logo_url,
      etiquette_afficher_prix, etiquette_afficher_description, etiquette_afficher_reference, etiquette_afficher_codebarre,
      interface_couleur_primaire, interface_couleur_sidebar, interface_theme,
      site_config_json, interface_theme_json
    } = req.body;

    const siteConfigStr = site_config_json
      ? (typeof site_config_json === 'string' ? site_config_json : JSON.stringify(site_config_json))
      : null;
    const themeJsonStr = interface_theme_json
      ? (typeof interface_theme_json === 'string' ? interface_theme_json : JSON.stringify(interface_theme_json))
      : null;

    const result = await pool.query(
      `INSERT INTO parametres_club (
        club_id, imprimante_nom, imprimante_tickets_nom, douchette_activee,
        etiquette_largeur, etiquette_hauteur, etiquette_police,
        etiquette_taille_nom, etiquette_taille_prix, etiquette_taille_code,
        etiquette_couleur_texte, etiquette_couleur_fond, etiquette_alignement,
        etiquette_afficher_logo, etiquette_logo_url,
        etiquette_afficher_prix, etiquette_afficher_description, etiquette_afficher_reference, etiquette_afficher_codebarre,
        interface_couleur_primaire, interface_couleur_sidebar, interface_theme,
        site_config_json, interface_theme_json,
        mis_a_jour_le
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,CURRENT_TIMESTAMP)
      ON CONFLICT (club_id) DO UPDATE SET
        imprimante_nom = EXCLUDED.imprimante_nom,
        imprimante_tickets_nom = EXCLUDED.imprimante_tickets_nom,
        douchette_activee = EXCLUDED.douchette_activee,
        etiquette_largeur = EXCLUDED.etiquette_largeur,
        etiquette_hauteur = EXCLUDED.etiquette_hauteur,
        etiquette_police = EXCLUDED.etiquette_police,
        etiquette_taille_nom = EXCLUDED.etiquette_taille_nom,
        etiquette_taille_prix = EXCLUDED.etiquette_taille_prix,
        etiquette_taille_code = EXCLUDED.etiquette_taille_code,
        etiquette_couleur_texte = EXCLUDED.etiquette_couleur_texte,
        etiquette_couleur_fond = EXCLUDED.etiquette_couleur_fond,
        etiquette_alignement = EXCLUDED.etiquette_alignement,
        etiquette_afficher_logo = EXCLUDED.etiquette_afficher_logo,
        etiquette_logo_url = EXCLUDED.etiquette_logo_url,
        etiquette_afficher_prix = EXCLUDED.etiquette_afficher_prix,
        etiquette_afficher_description = EXCLUDED.etiquette_afficher_description,
        etiquette_afficher_reference = EXCLUDED.etiquette_afficher_reference,
        etiquette_afficher_codebarre = EXCLUDED.etiquette_afficher_codebarre,
        interface_couleur_primaire = EXCLUDED.interface_couleur_primaire,
        interface_couleur_sidebar = EXCLUDED.interface_couleur_sidebar,
        interface_theme = EXCLUDED.interface_theme,
        site_config_json = COALESCE(EXCLUDED.site_config_json, parametres_club.site_config_json),
        interface_theme_json = COALESCE(EXCLUDED.interface_theme_json, parametres_club.interface_theme_json),
        mis_a_jour_le = CURRENT_TIMESTAMP
      RETURNING *`,
      [club_id, imprimante_nom, imprimante_tickets_nom, douchette_activee,
       etiquette_largeur, etiquette_hauteur, etiquette_police,
       etiquette_taille_nom, etiquette_taille_prix, etiquette_taille_code,
       etiquette_couleur_texte, etiquette_couleur_fond, etiquette_alignement,
       etiquette_afficher_logo, etiquette_logo_url,
       etiquette_afficher_prix, etiquette_afficher_description, etiquette_afficher_reference, etiquette_afficher_codebarre,
       interface_couleur_primaire, interface_couleur_sidebar, interface_theme,
       siteConfigStr, themeJsonStr]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('PUT /parametres erreur:', err.message);
    res.status(500).json({ erreur: 'Erreur serveur', detail: err.message });
  }
});

// ── Route PATCH : mise à jour partielle (thème, site_config) ─────────────────
router.patch('/', async (req, res) => {
  try {
    const { club_id } = req.utilisateur;
    const updates = [];
    const values  = [club_id];

    if (req.body.interface_theme_json !== undefined) {
      const v = typeof req.body.interface_theme_json === 'string'
        ? req.body.interface_theme_json
        : JSON.stringify(req.body.interface_theme_json);
      values.push(v);
      updates.push(`interface_theme_json = $${values.length}`);
    }
    if (req.body.site_config_json !== undefined) {
      const v = typeof req.body.site_config_json === 'string'
        ? req.body.site_config_json
        : JSON.stringify(req.body.site_config_json);
      values.push(v);
      updates.push(`site_config_json = $${values.length}`);
    }
    if (updates.length === 0) return res.json({ ok: true });

    updates.push(`mis_a_jour_le = CURRENT_TIMESTAMP`);

    await pool.query(
      `INSERT INTO parametres_club (club_id, ${updates.map((u, i) => u.split(' = ')[0]).filter(c => c !== 'mis_a_jour_le').join(', ')})
       VALUES ($1, ${values.slice(1).map((_, i) => `$${i + 2}`).join(', ')})
       ON CONFLICT (club_id) DO UPDATE SET ${updates.join(', ')}`,
      values
    );
    res.json({ ok: true });
  } catch (err) {
    console.error('PATCH /parametres erreur:', err.message);
    res.status(500).json({ erreur: 'Erreur serveur', detail: err.message });
  }
});

// ── Route dédiée logo (évite d'envoyer tout le payload à chaque sauvegarde) ──
router.put('/logo', async (req, res) => {
  try {
    const { club_id } = req.utilisateur;
    const { etiquette_logo_url, etiquette_afficher_logo } = req.body;
    const result = await pool.query(
      `INSERT INTO parametres_club (club_id, etiquette_logo_url, etiquette_afficher_logo)
       VALUES ($1, $2, $3)
       ON CONFLICT (club_id) DO UPDATE SET
         etiquette_logo_url = EXCLUDED.etiquette_logo_url,
         etiquette_afficher_logo = EXCLUDED.etiquette_afficher_logo,
         mis_a_jour_le = CURRENT_TIMESTAMP
       RETURNING etiquette_logo_url, etiquette_afficher_logo`,
      [club_id, etiquette_logo_url || null, etiquette_afficher_logo !== false]
    );
    res.json({ ok: true, ...result.rows[0] });
  } catch (err) {
    console.error('PUT /parametres/logo erreur:', err.message);
    res.status(500).json({ erreur: 'Erreur sauvegarde logo', detail: err.message });
  }
});

module.exports = router;
