# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

 Fonctionnalités :
- Assistant IA Vision avec réponses automatiques
- Intégration avec API externe (http://127.0.0.1:3001/api/chat)
- Affichage automatique des sources sous forme de labels
- Chat temps réel avec salons publics et messages privés
- Support upload de fichiers (images, documents)
- Authentification et gestion des utilisateurs
- Base de données SQLite avec conversations persistantes
- Interface moderne avec animations et effets visuels

 Technique :
- Frontend React 18 + Vite
- Backend Node.js + Express
- Base de données SQLite avec colonne sources
- Multer pour upload de fichiers
- Configuration CORS
- Configuration ESLint pour backend Node.js

 Vision IA :
- Répond automatiquement aux messages envoyés à @Vision AI
- Appelle l'API externe pour réponses spécialisées
- Affiche les sources des réponses API sous forme de petits labels
- Support informations contextuelles et spécialisées
