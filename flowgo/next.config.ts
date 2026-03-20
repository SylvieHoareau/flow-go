import type { NextConfig } from "next";

// Remplace 'flow-go' par le nom EXACT de ton dépôt GitHub (ex: 'mon-projet-bus')
const repoName = 'flow-go'; 

const nextConfig: NextConfig = {
  // Indispensable pour GitHub Pages : génère un dossier 'out' statique
  output: 'export',

  // Gestion des chemins (uniquement pour la production sur GitHub)
  // Sur GitHub Pages, l'URL est https://pseudo.github.io/repo-name/
  basePath: process.env.NODE_ENV === 'production' ? `/${repoName}` : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? `/${repoName}/` : '',

  // Désactive l'optimisation d'image native (non supportée en export statique)
  images: {
    unoptimized: true,
  },
};

export default nextConfig;