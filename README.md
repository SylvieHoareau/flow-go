# 🚌 FlowGo - MVP

    **Note** : Ce projet est actuellement en version **MVP** (Minimum Viable Product). L'objectif est de valider la visualisation des lignes de bus du réseau "Cars Jaunes" à La Réunion sur une interface cartographique interactive.

## 🎯 Objectif du MVP

L'objectif principal de ce MVP est de fournir aux usagers une vue d'ensemble simplifiée des itinéraires :

    - **Visualisation géographique** : Affichage des tracés précis des lignes.

    - **Identification des points d'arrêts** : Localisation des arrêts sur le tracé.

    - **Consultation mobile-first (Responsive)** : Interface entièrement responsive.

    ![Capture d'écran de FlowGo](public/images/screenshot.png)

## ✨ Fonctionnalités Actuelles (V1)

    [x] Carte Interactive : Utilisation de MapLibre GL pour un rendu fluide.

    [x] Données Temps Réel : Intégration de l'API Open Data de la Région Réunion.

    [x] Sidebar Responsive : Liste des lignes accessible sur tous les écrans.

    [x] Accessibilité (A11y) : Support des lecteurs d'écran et navigation clavier.

## 🛠️ Stack Technique

    **Framework** : Next.js 16 (App Router)

    **Langage** : TypeScript (Typage strict pour la robustesse)

    **Cartographie** : MapLibre GL

    **Styling** : Tailwind CSS

    **Déploiement** : GitHub Pages (Export statique)

## 🚀 Roadmap (Évolutions futures)

Une fois le MVP validé, les fonctionnalités suivantes seront priorisées :

    **Recherche Intelligente** : Filtrage des lignes par nom ou par ville.

    **Géolocalisation** : Bouton pour centrer la carte sur la position de l'utilisateur.

    **Temps d'attente** : Intégration des flux temps réel (GTFS-RT) si disponibles.

    **Mode Hors-Ligne** : Mise en cache des données pour une consultation sans réseau.

## ⚙️ Installation & Lancement local

    Cloner le dépôt :

```bash
git clone https://github.com/ton-pseudo/flow-go.git
```

Installer les dépendances :

```bash
npm install
```

Lancer le serveur de développement :

```bash
    npm run dev
```

## 📄 Licence

Projet personnel

Les données proviennent du portail Open Data de la Région Réunion.