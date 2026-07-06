-- ==============================
-- Base de données Gestion des Clubs
-- ==============================

-- Suppression si existant
DROP TABLE IF EXISTS lignes_vente CASCADE;
DROP TABLE IF EXISTS ventes CASCADE;
DROP TABLE IF EXISTS inventaires_lignes CASCADE;
DROP TABLE IF EXISTS inventaires CASCADE;
DROP TABLE IF EXISTS produits CASCADE;
DROP TABLE IF EXISTS utilisateurs CASCADE;
DROP TABLE IF EXISTS parametres_club CASCADE;
DROP TABLE IF EXISTS clubs CASCADE;
DROP TABLE IF EXISTS admins_plateforme CASCADE;

-- Administrateurs de la plateforme
CREATE TABLE admins_plateforme (
  id SERIAL PRIMARY KEY,
  email VARCHAR(100) UNIQUE NOT NULL,
  mot_de_passe_hash VARCHAR(255) NOT NULL,
  nom_complet VARCHAR(150),
  cree_le TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Clubs
CREATE TABLE clubs (
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
CREATE TABLE utilisateurs (
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
CREATE TABLE produits (
  id SERIAL PRIMARY KEY,
  club_id INT REFERENCES clubs(id) ON DELETE CASCADE,
  reference VARCHAR(50),
  code_barre VARCHAR(100),
  nom VARCHAR(200) NOT NULL,
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
CREATE TABLE ventes (
  id SERIAL PRIMARY KEY,
  club_id INT REFERENCES clubs(id) ON DELETE CASCADE,
  utilisateur_id INT REFERENCES utilisateurs(id),
  montant_total DECIMAL(10,2) NOT NULL,
  mode_paiement VARCHAR(50) NOT NULL,
  statut VARCHAR(30) DEFAULT 'valide',
  date_vente TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Lignes de vente
CREATE TABLE lignes_vente (
  id SERIAL PRIMARY KEY,
  vente_id INT REFERENCES ventes(id) ON DELETE CASCADE,
  produit_id INT REFERENCES produits(id),
  quantite INT NOT NULL,
  prix_unitaire DECIMAL(10,2) NOT NULL
);

-- Inventaires
CREATE TABLE inventaires (
  id SERIAL PRIMARY KEY,
  club_id INT REFERENCES clubs(id) ON DELETE CASCADE,
  date_inventaire DATE NOT NULL,
  utilisateur_id INT REFERENCES utilisateurs(id),
  motif_ecarts TEXT,
  valide BOOLEAN DEFAULT FALSE,
  cree_le TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE inventaires_lignes (
  id SERIAL PRIMARY KEY,
  inventaire_id INT REFERENCES inventaires(id) ON DELETE CASCADE,
  produit_id INT REFERENCES produits(id),
  quantite_theorique INT NOT NULL,
  quantite_reelle INT NOT NULL,
  ecart INT NOT NULL
);

-- Paramètres club
CREATE TABLE parametres_club (
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
CREATE INDEX idx_clubs_actif ON clubs(actif);
CREATE INDEX idx_produits_club ON produits(club_id);
CREATE INDEX idx_produits_codebarre ON produits(code_barre);
CREATE INDEX idx_ventes_club_date ON ventes(club_id, date_vente);

-- Données initiales
-- Admin plateforme : admin@plateforme.fr / Admin2026!Plateforme
INSERT INTO admins_plateforme (email, mot_de_passe_hash, nom_complet)
VALUES ('admin@plateforme.fr', '$2a$10$GuDW.4x1VkK1GBN9XDMruegNQD3UO8leIdryV7sMwMGTuPqgvyDES', 'Administrateur Principal');

INSERT INTO clubs (nom, ville, niveau_abonnement, date_fin_abonnement)
VALUES ('AS Rouen', 'Rouen', 'complet', CURRENT_DATE + INTERVAL '1 year');

-- Proprietaire club : jean@asrouen.fr / ClubAS2026!Rouen
INSERT INTO utilisateurs (club_id, nom, prenom, email, mot_de_passe_hash, role)
VALUES (1, 'Dupont', 'Jean', 'jean@asrouen.fr', '$2a$10$bpFN0y4vawEgDqzJZfcgeutJWeDRtFkAMV8CN84LFCgF5vCocUNre', 'proprietaire');

-- Produits de démonstration pour AS Rouen
INSERT INTO produits (club_id, reference, code_barre, nom, description, prix_achat, prix_vente, quantite_stock, seuil_alerte) VALUES
(1, 'TSH-M-BL', '001234567890', 'T-shirt Club', 'Taille M — Coton 100% — Bleu marine', 8.00, 15.00, 25, 5),
(1, 'TSH-L-BL', '001234567891', 'T-shirt Club', 'Taille L — Coton 100% — Bleu marine', 8.00, 15.00, 20, 5),
(1, 'SHO-42-BL', '001234567892', 'Chaussettes Club', 'Pointure 42-45 — Blanc', 2.50, 5.00, 50, 10),
(1, 'SCF-UNI', '001234567893', 'Écharpe Club', 'Taille unique — Laine — Bleu/Blanc', 5.00, 12.00, 15, 5),
(1, 'BON-UNI', '001234567894', 'Bonnet Club', 'Taille unique — Acrylique — Bleu marine', 4.00, 10.00, 12, 3),
(1, 'SAC-MED', '001234567895', 'Sac de sport', 'Medium — Polyester — Logo club', 12.00, 25.00, 8, 3);
