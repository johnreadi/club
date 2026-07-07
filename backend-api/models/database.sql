-- ==============================
-- Base de données Gestion des Clubs
-- ==============================

-- Administrateurs de la plateforme
CREATE TABLE IF NOT EXISTS admins_plateforme (
  id SERIAL PRIMARY KEY,
  email VARCHAR(100) UNIQUE NOT NULL,
  mot_de_passe_hash VARCHAR(255) NOT NULL,
  nom_complet VARCHAR(150),
  cree_le TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Clubs
CREATE TABLE IF NOT EXISTS clubs (
  id SERIAL PRIMARY KEY,
  nom VARCHAR(150) NOT NULL,
  adresse TEXT,
  code_postal VARCHAR(10),
  ville VARCHAR(100),
  telephone VARCHAR(20),
  email_contact VARCHAR(100),
  niveau_abonnement VARCHAR(30) DEFAULT 'de_base',
  date_debut_abonnement DATE DEFAULT CURRENT_DATE,
  date_fin_abonnement DATE,
  actif BOOLEAN DEFAULT TRUE,
  cree_le TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Utilisateurs
CREATE TABLE IF NOT EXISTS utilisateurs (
  id SERIAL PRIMARY KEY,
  club_id INT REFERENCES clubs(id) ON DELETE CASCADE,
  nom VARCHAR(100) NOT NULL,
  prenom VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  mot_de_passe_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL,
  derniere_connexion TIMESTAMP WITH TIME ZONE,
  actif BOOLEAN DEFAULT TRUE,
  cree_le TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Produits
CREATE TABLE IF NOT EXISTS produits (
  id SERIAL PRIMARY KEY,
  club_id INT REFERENCES clubs(id) ON DELETE CASCADE,
  reference VARCHAR(50),
  code_barre VARCHAR(100),
  nom VARCHAR(200) NOT NULL,
  categorie VARCHAR(100),
  description TEXT,
  prix_achat DECIMAL(10,2) DEFAULT 0,
  prix_vente DECIMAL(10,2) NOT NULL,
  quantite_stock INT DEFAULT 0,
  seuil_alerte INT DEFAULT 5,
  actif BOOLEAN DEFAULT TRUE,
  cree_le TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  mis_a_jour_le TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Ventes
CREATE TABLE IF NOT EXISTS ventes (
  id SERIAL PRIMARY KEY,
  club_id INT REFERENCES clubs(id) ON DELETE CASCADE,
  utilisateur_id INT REFERENCES utilisateurs(id),
  montant_total DECIMAL(10,2) NOT NULL,
  mode_paiement VARCHAR(50) NOT NULL,
  statut VARCHAR(30) DEFAULT 'valide',
  date_vente TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Lignes de vente
CREATE TABLE IF NOT EXISTS lignes_vente (
  id SERIAL PRIMARY KEY,
  vente_id INT REFERENCES ventes(id) ON DELETE CASCADE,
  produit_id INT REFERENCES produits(id),
  quantite INT NOT NULL,
  prix_unitaire DECIMAL(10,2) NOT NULL
);

-- Inventaires
CREATE TABLE IF NOT EXISTS inventaires (
  id SERIAL PRIMARY KEY,
  club_id INT REFERENCES clubs(id) ON DELETE CASCADE,
  date_inventaire DATE NOT NULL,
  utilisateur_id INT REFERENCES utilisateurs(id),
  motif_ecarts TEXT,
  valide BOOLEAN DEFAULT FALSE,
  cree_le TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS inventaires_lignes (
  id SERIAL PRIMARY KEY,
  inventaire_id INT REFERENCES inventaires(id) ON DELETE CASCADE,
  produit_id INT REFERENCES produits(id),
  quantite_theorique INT NOT NULL,
  quantite_reelle INT NOT NULL,
  ecart INT NOT NULL
);

-- Paramètres club
CREATE TABLE IF NOT EXISTS parametres_club (
  id SERIAL PRIMARY KEY,
  club_id INT UNIQUE REFERENCES clubs(id) ON DELETE CASCADE,
  -- Périphériques
  imprimante_nom VARCHAR(150),
  imprimante_tickets_nom VARCHAR(150),
  douchette_activee BOOLEAN DEFAULT TRUE,
  -- Étiquettes produits
  etiquette_largeur INT DEFAULT 60,
  etiquette_hauteur INT DEFAULT 40,
  etiquette_police VARCHAR(50) DEFAULT 'Arial',
  etiquette_taille_nom INT DEFAULT 14,
  etiquette_taille_prix INT DEFAULT 18,
  etiquette_taille_code INT DEFAULT 10,
  etiquette_couleur_texte VARCHAR(10) DEFAULT '#000000',
  etiquette_couleur_fond VARCHAR(10) DEFAULT '#FFFFFF',
  etiquette_alignement VARCHAR(10) DEFAULT 'center',
  etiquette_afficher_logo BOOLEAN DEFAULT FALSE,
  etiquette_logo_url TEXT,
  etiquette_afficher_prix BOOLEAN DEFAULT TRUE,
  etiquette_afficher_description BOOLEAN DEFAULT TRUE,
  etiquette_afficher_reference BOOLEAN DEFAULT TRUE,
  etiquette_afficher_codebarre BOOLEAN DEFAULT TRUE,
  -- Préférences interface
  interface_couleur_primaire VARCHAR(10) DEFAULT '#3B82F6',
  interface_couleur_sidebar VARCHAR(10) DEFAULT '#1e3a5f',
  interface_theme VARCHAR(20) DEFAULT 'clair',
  mis_a_jour_le TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index
CREATE INDEX IF NOT EXISTS idx_clubs_actif ON clubs(actif);
CREATE INDEX IF NOT EXISTS idx_produits_club ON produits(club_id);
CREATE INDEX IF NOT EXISTS idx_produits_codebarre ON produits(code_barre);
CREATE INDEX IF NOT EXISTS idx_ventes_club_date ON ventes(club_id, date_vente);

-- Données initiales (idempotentes)
INSERT INTO admins_plateforme (email, mot_de_passe_hash, nom_complet)
VALUES ('admin@plateforme.fr', '$2a$10$GuDW.4x1VkK1GBN9XDMruegNQD3UO8leIdryV7sMwMGTuPqgvyDES', 'Administrateur Principal')
ON CONFLICT (email) DO NOTHING;

INSERT INTO clubs (id, nom, ville, niveau_abonnement, date_fin_abonnement)
VALUES (1, 'AS Rouen', 'Rouen', 'complet', CURRENT_DATE + INTERVAL '1 year')
ON CONFLICT (id) DO NOTHING;

INSERT INTO utilisateurs (club_id, nom, prenom, email, mot_de_passe_hash, role)
VALUES (1, 'Dupont', 'Jean', 'jean@asrouen.fr', '$2a$10$bpFN0y4vawEgDqzJZfcgeutJWeDRtFkAMV8CN84LFCgF5vCocUNre', 'proprietaire')
ON CONFLICT (email) DO NOTHING;
