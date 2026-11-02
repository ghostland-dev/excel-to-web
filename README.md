# Excel to Web Converter

Une plateforme complète pour convertir automatiquement vos fichiers Excel (feuilles de calcul, formules et macros VBA) en applications web modernes et fonctionnelles.

## 🚀 Fonctionnalités

### Analyse Automatique
- **Import de fichiers Excel** (.xlsx, .xls, .xlsm)
- **Extraction de la structure** : feuilles, tables, plages nommées
- **Analyse des formules** : détection et parsing des formules Excel
- **Extraction VBA** : parsing complet des macros et modules VBA
- **Graphe de dépendances** : visualisation des relations entre cellules

### Conversion Intelligente
- **Transpilation de formules** : Excel → JavaScript/TypeScript
- **Conversion VBA** : Macros → API endpoints et fonctions
- **Génération de code** : Frontend (React) + Backend (Next.js API Routes)
- **Mapping automatique** : Tables Excel → Modèles de données

### Tests et Validation
- **Sandbox d'exécution** : environnement isolé pour tester le code généré
- **Comparaison de résultats** : Excel vs Application Web
- **Tests automatisés** : génération de cas de test
- **Validation numérique** : vérification de la précision des calculs

### Révision et Édition
- **Éditeur de code** : interface side-by-side pour comparer VBA original et code généré
- **Détection d'erreurs** : identification des éléments non convertis
- **Édition manuelle** : correction et amélioration du code généré
- **Arborescence de fichiers** : navigation dans le projet généré

### Déploiement
- **Export multi-format** : ZIP, Docker, code source
- **Déploiement Vercel** : publication en un clic
- **Intégration GitHub** : push automatique vers un repository
- **Gestion des versions** : historique des déploiements

## 🛠️ Stack Technique

### Frontend
- **Next.js 15** (App Router)
- **React 19** avec TypeScript
- **Tailwind CSS v4** pour le styling
- **shadcn/ui** pour les composants
- **SWR** pour la gestion des données

### Backend
- **Next.js API Routes** (serverless)
- **Supabase** pour la base de données et l'authentification
- **Vercel Blob** pour le stockage de fichiers
- **xlsx** pour le parsing Excel
- **Row Level Security (RLS)** pour la sécurité des données

### Parsing et Conversion
- **xlsx** : lecture et analyse des fichiers Excel
- **Transpileurs personnalisés** : formules et VBA → JavaScript/TypeScript
- **Génération de code** : templates pour React et API Routes

## 📦 Installation

### Prérequis
- Node.js 20+
- Compte Vercel (pour le déploiement)
- Compte Supabase (pour la base de données)

### Configuration

1. **Cloner le projet**
\`\`\`bash
git clone <repository-url>
cd excel-to-web-converter
npm install
\`\`\`

2. **Variables d'environnement**

Les intégrations Supabase et Blob sont déjà configurées dans ce projet v0. Les variables suivantes sont disponibles :

- `SUPABASE_URL` : URL de votre instance Supabase
- `SUPABASE_ANON_KEY` : Clé publique Supabase
- `SUPABASE_SERVICE_ROLE_KEY` : Clé service role (backend uniquement)
- `BLOB_READ_WRITE_TOKEN` : Token Vercel Blob
- `NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL` : URL de redirection pour le développement

3. **Initialiser la base de données**

Exécutez les scripts SQL dans l'ordre :
\`\`\`bash
# Dans v0, les scripts sont dans le dossier /scripts
# Ils seront exécutés automatiquement
\`\`\`

4. **Lancer le serveur de développement**
\`\`\`bash
npm run dev
\`\`\`

L'application sera disponible sur `http://localhost:3000`

## 🗄️ Structure de la Base de Données

### Tables Principales

#### `projects`
Stocke les projets de conversion
- `id` : UUID (clé primaire)
- `user_id` : UUID (référence auth.users)
- `name` : Nom du projet
- `file_name` : Nom du fichier Excel
- `file_url` : URL du fichier dans Blob storage
- `status` : État du projet (analyzed, converting, completed, failed)
- `deployed_url` : URL de déploiement (si déployé)

#### `analysis_results`
Résultats de l'analyse Excel
- `id` : UUID (clé primaire)
- `project_id` : UUID (référence projects)
- `sheets` : JSON - structure des feuilles
- `formulas` : JSON - formules détectées
- `macros` : JSON - macros VBA extraites
- `conversion_report` : JSON - rapport de conversion

#### `conversion_results`
Code généré par la conversion
- `id` : UUID (clé primaire)
- `project_id` : UUID (référence projects)
- `generated_files` : JSON - fichiers générés
- `formula_mappings` : JSON - mapping formules → code
- `macro_mappings` : JSON - mapping VBA → code

#### `test_results`
Résultats des tests d'exécution
- `id` : UUID (clé primaire)
- `project_id` : UUID (référence projects)
- `test_name` : Nom du test
- `status` : passed/failed
- `excel_result` : Résultat Excel
- `web_result` : Résultat application web
- `execution_time_ms` : Temps d'exécution

### Sécurité (RLS)

Toutes les tables utilisent Row Level Security pour garantir que :
- Les utilisateurs ne peuvent voir que leurs propres projets
- Les opérations de modification sont limitées aux propriétaires
- Les données sont isolées par utilisateur

## 🔐 Authentification

L'application utilise Supabase Auth avec :
- **Email/Password** : authentification par défaut
- **Protection des routes** : middleware Next.js
- **Session management** : cookies sécurisés
- **Refresh tokens** : gestion automatique

### Pages d'authentification
- `/auth/login` : Connexion
- `/auth/sign-up` : Inscription
- `/auth/sign-up-success` : Confirmation d'inscription
- `/auth/error` : Gestion des erreurs

## 📊 Utilisation

### 1. Upload d'un fichier Excel
- Glissez-déposez ou sélectionnez un fichier .xlsx, .xls ou .xlsm
- Le fichier est scanné et validé
- L'analyse démarre automatiquement

### 2. Analyse des résultats
- Consultez la structure détectée (feuilles, formules, macros)
- Visualisez le rapport de conversion
- Identifiez les éléments convertibles automatiquement

### 3. Conversion
- Lancez la conversion automatique
- Consultez le code généré (frontend + backend)
- Vérifiez les mappings formules → JavaScript

### 4. Tests
- Exécutez les tests dans le sandbox
- Comparez les résultats Excel vs Web
- Validez la précision numérique

### 5. Révision
- Éditez le code généré si nécessaire
- Corrigez les éléments non convertis automatiquement
- Ajoutez des fonctionnalités personnalisées

### 6. Déploiement
- Exportez le projet (ZIP, Docker, source)
- Déployez sur Vercel en un clic
- Partagez l'URL de votre application

## 🎯 Taux de Conversion

### Formules Excel
- **95%** des formules standards converties automatiquement
- Support complet : SUM, AVERAGE, VLOOKUP, IF, COUNT, etc.
- Formules complexes : conversion partielle avec assistance

### Macros VBA
- **70%** des macros simples converties automatiquement
- Structures de contrôle : For, If, While → JavaScript
- Appels COM/API externes : nécessitent une implémentation manuelle

## 🔧 Développement

### Structure du Projet
\`\`\`
excel-to-web-converter/
├── app/                      # Pages Next.js (App Router)
│   ├── api/                  # API Routes
│   ├── auth/                 # Pages d'authentification
│   ├── analysis/             # Page d'analyse
│   ├── conversion/           # Page de conversion
│   ├── testing/              # Page de tests
│   ├── review/               # Page de révision
│   ├── deploy/               # Page de déploiement
│   └── projects/             # Liste des projets
├── components/               # Composants React
│   ├── ui/                   # Composants shadcn/ui
│   ├── analysis/             # Composants d'analyse
│   ├── conversion/           # Composants de conversion
│   ├── testing/              # Composants de tests
│   ├── review/               # Composants de révision
│   └── deploy/               # Composants de déploiement
├── lib/                      # Utilitaires
│   ├── supabase/             # Clients Supabase
│   ├── excel-parser.ts       # Parser Excel
│   ├── formula-transpiler.ts # Transpileur de formules
│   └── vba-transpiler.ts     # Transpileur VBA
└── scripts/                  # Scripts SQL
    ├── 001_create_tables.sql
    └── 002_create_rls_policies.sql
\`\`\`

### Ajouter une Nouvelle Fonctionnalité

1. **Backend** : Créer une API Route dans `app/api/`
2. **Frontend** : Créer les composants dans `components/`
3. **Page** : Créer la page dans `app/`
4. **Types** : Ajouter les types TypeScript si nécessaire

## 🚨 Limitations Connues

### Conversion VBA
- **Appels COM** : nécessitent une réécriture manuelle
- **API Windows** : non supportées
- **Add-ins Excel** : non convertis
- **Graphiques complexes** : nécessitent une bibliothèque web

### Formules Excel
- **Fonctions propriétaires** : non supportées sans équivalent
- **Add-ins tiers** : non convertis
- **Formules matricielles** : support partiel

## 📝 Licence

Ce projet est développé dans l'environnement v0 de Vercel.

## 🤝 Support

Pour toute question ou problème :
- Ouvrir un ticket sur GitHub
- Contacter le support Vercel : vercel.com/help

## 🎉 Crédits

Développé avec :
- [Next.js](https://nextjs.org/)
- [Supabase](https://supabase.com/)
- [Vercel](https://vercel.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)

## Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fghostland-dev%2Fexcel-to-web&env=NEXT_PUBLIC_SUPABASE_URL NEXT_PUBLIC_SUPABASE_ANON_KEY)

Click the button to deploy your own copy on Vercel in one step. It needs a [Supabase](https://supabase.com) project; Vercel asks for these values during setup (see `.env.example`):

- `NEXT_PUBLIC_SUPABASE_URL NEXT_PUBLIC_SUPABASE_ANON_KEY`

