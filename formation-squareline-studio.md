# Formation SquareLine Studio 1.6.1

---

## 1. Introduction

SquareLine Studio est un outil graphique puissant pour concevoir des interfaces utilisateur avec la bibliothèque **LVGL (Light and Versatile Graphics Library)**, destinées principalement aux systèmes embarqués (microcontrôleurs, écrans tactiles, etc.). SquareLine Studio 1.6.1 simplifie le développement en proposant un éditeur visuel, une prévisualisation en temps réel et une exportation directe de code compatible LVGL v8 ou v9.

### Cas d'usage
- Interfaces pour écrans domestiques connectés
- Panneaux de contrôle pour appareils industriels
- Interfaces pour véhicules (infodivertissement)
- Projets DIY avec microcontrôleurs (Arduino, ESP32, Raspberry Pi Pico, etc.)

---

## 2. Installation

### Étape 1 : Téléchargement
Rendez-vous sur la page officielle : [SquareLine Studio - Téléchargement](https://squareline.io/downloads)

Choisissez la version 1.6.1 adaptée à votre système d'exploitation :
- Windows 10/11
- Linux (Ubuntu, Fedora, etc.)
- macOS

### Étape 2 : Installation
- **Windows** : Exécutez le fichier `.exe` et suivez l'assistant d'installation.
- **Linux** : Décompressez l'archive et exécutez le fichier `SquareLineStudio`.
- **macOS** : Ouvrez le fichier `.dmg` et faites glisser SquareLine Studio dans votre dossier Applications.

### Étape 3 : Licence
- **Gratuit** : Pour des projets non commerciaux et avec un certain nombre de widgets limité.
- **Payante** : Pour des projets professionnels, sans limite de widgets.

Lancez SquareLine Studio et connectez-vous ou créez un compte si nécessaire.

---

## 3. Présentation de l'interface principale

L'interface de SquareLine Studio est structurée en 4 zones clés :

| Zone | Nom | Fonction |
|------|-----|----------|
| 1 | Barre d'outils | Gestion de projet, prévisualisation, exportation, paramètres. |
| 2 | Widgets | Liste de tous les widgets disponibles (boutons, textes, images, etc.). |
| 3 | Editeur visuel | Zone principale pour créer et organiser votre interface. |
| 4 | Inspecteur | Modification des propriétés des widgets et des écrans. |
| 5 | Hierarchie | Arborescence des écrans et des widgets. |

---

## 4. Création d'un nouveau projet

### Étape 1 : Démarrer un projet
1. Ouvrez SquareLine Studio.
2. Cliquez sur **New Project**.
3. Choisissez votre plateforme cible :
   - **Desktop Simulator** : Pour tester sur votre ordinateur avant déploiement.
   - **LVGL for ESP32** : Pour projets sur microcontrôleur ESP32.
   - **Generic LVGL** : Pour une utilisation générique de LVGL.
   - Autres (Arduino, Raspberry Pi, etc.)

4. Choisissez la version de LVGL : LVGL v8 (stable) ou LVGL v9 (nouvelle version).

### Étape 2 : Configurer le projet
- Nom du projet
- Dossier de sauvegarde
- Résolution de l'écran (ex: 320x240, 480x320, 800x480)
- Couleur profondeur (16 bits, 32 bits)

Cliquez sur **Create** !

---

## 5. Widgets de base

Les widgets sont les éléments de votre interface. Voici les plus utilisés :

### 5.1 Boutons (Button)
- **Fonction** : Interagir avec l'utilisateur (clic, appui long).
- **Ajout** : Glissez-déposez « Button » depuis la palette vers l'éditeur visuel.
- **Propriétés utiles** :
  - Texte du bouton
  - Styles (couleur de fond, bordure, radius)
  - Événements (clic, appui, etc.)

### 5.2 Étiquettes (Label)
- **Fonction** : Afficher du texte.
- **Propriétés utiles** :
  - Texte, taille de police
  - Couleur du texte
  - Alignement

### 5.3 Barres de progression (Bar)
- **Fonction** : Indiquer un pourcentage (chargement, batterie, etc.).
- **Propriétés utiles** : Valeur, couleurs de fond et de remplissage.

### 5.4 Curseurs (Slider)
- **Fonction** : Sélectionner une valeur dans une plage définie.
- **Propriétés utiles** : Min, max, valeur actuelle.

### 5.5 Images (Image)
- **Fonction** : Afficher des images dans votre interface.
- **Méthode** : Ajoutez vos images via la section « Assets », puis glissez-déposez un widget « Image ».

---

## 6. Gestion des écrans

### Ajouter un écran
1. Dans le panneau « Hierarchy », cliquez sur l'icône « + » à côté de « Screens ».
2. Un nouvel écran « Screen2 » apparaît.

### Naviguer entre les écrans
- Dans le panneau « Hierarchy », cliquez simplement sur le nom de l'écran souhaité.

### Passer d'un écran à l'autre avec un bouton
1. Ajoutez un bouton sur un écran.
2. Dans le panneau « Events », cliquez sur « + ».
3. Choisissez l'événement « Clicked » et l'action « Change Screen ».
4. Sélectionnez l'écran cible.

---

## 7. Styles

Les styles vous permettent de personnaliser l'apparence de vos widgets.

### Ajouter un style
1. Sélectionnez votre widget dans l'éditeur visuel ou la hiérarchie.
2. Dans l'inspecteur, allez dans la section « Styles ».
3. Cliquez sur « + » pour ajouter un nouveau style ou en utiliser un prédéfini.

### Modifier un style
Les éléments de style configurables incluent :
- Couleurs de fond et de texte
- Bordures et radius
- Ombres
- Espacement interne/extern (padding/margin)

---

## 8. Animations

SquareLine Studio permet d'ajouter facilement des animations à vos widgets.

### Ajouter une animation
1. Sélectionnez un widget.
2. Dans l'inspecteur, allez dans la section « Animations ».
3. Cliquez sur « + ».
4. Choisissez le type d'animation (ex: fade, move, scale, rotate).
5. Réglez la durée, le retard et le mode de répétition.

---

## 9. Logique avec les événements

Les événements connectent vos actions à la logique de l'application.

### Types d'événements populaires
- **Clicked** : Lorsqu'un bouton est cliqué.
- **Value Changed** : Lorsque la valeur d'un slider change.
- **Long Pressed** : Lorsqu'un bouton reste appuyé.
- **Screen Loaded** : Lorsqu'un écran s'affiche.

### Ajouter un événement
1. Sélectionnez un widget.
2. Dans l'inspecteur, allez dans « Events » → « + ».
3. Choisissez le déclencheur et l'action associée.

---

## 10. Exportation du code

### Étape 1 : Préparer l'export
1. Sauvegardez votre projet.
2. Cliquez sur le bouton « Export » dans la barre d'outils.
3. Choisissez le dossier d'exportation.

### Étape 2 : Type d'export
- **Export UI Files** : Génère les fichiers C pour LVGL.
- **Export Template Project** : Génère un projet complet (adapté à votre plateforme, ex: ESP32).

### Étape 3 : Intégrer le code
Les fichiers générés incluent :
- Les écrans (`ui_Screen1.c`, `ui_Screen1.h`, etc.)
- Les widgets et les styles
- Un fichier principal `ui.c` et `ui.h`

Pour l'utiliser dans votre projet LVGL, incluez `ui.h` et appelez `ui_init()` au démarrage !

---

## 11. Projet d'exemple : Compteur simple

### Objectif
Créer un écran avec :
- Un label pour afficher un compteur
- Un bouton « + » pour incrémenter
- Un bouton « – » pour décrémenter
- Un bouton « Reset » pour remettre à zéro

### Étapes
1. Créez un nouveau projet.
2. Ajoutez un label, changez son texte par « 0 ».
3. Ajoutez trois boutons et renommez-les « + », « – », « Reset ».
4. Dans les paramètres du projet, ajoutez une variable : `compteur` de type `int`, initialisée à 0.
5. Pour chaque bouton, ajoutez un événement :
   - « + » → incrémente `compteur`, puis met à jour le label.
   - « – » → décrémente `compteur`, puis met à jour le label.
   - « Reset » → remet `compteur` à 0, puis met à jour le label.
6. Testez avec la prévisualisation !
7. Exportez et déployez sur votre cible.

---

## 12. Trucs et astuces

1. **Organisation des widgets** : Utilisez des conteneurs (Containers) pour grouper plusieurs widgets et simplifier la mise en page.
2. **Réutilisation de styles** : Créez des styles globaux pour garder une cohérence visuelle dans toute l'interface.
3. **Prévisualisation en temps réel** : Utilisez la prévisualisation pour valider rapidement vos modifications.
4. **Assets** : Stockez toutes vos images et polices dans l'onglet « Assets » pour une gestion centralisée.

---

## 13. Ressources utiles

- **Documentation officielle LVGL** : https://docs.lvgl.io
- **Documentation SquareLine Studio** : https://docs.squareline.io
- **Forum SquareLine** : https://forum.squareline.io
- **GitHub LVGL** : https://github.com/lvgl/lvgl

Bon développement ! 🎨
