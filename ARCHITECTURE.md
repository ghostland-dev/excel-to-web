# Architecture Technique

## Vue d'ensemble

L'application Excel to Web Converter est construite sur une architecture moderne serverless utilisant Next.js 15 avec l'App Router, Supabase pour la persistance des données et l'authentification, et Vercel Blob pour le stockage de fichiers.

## Architecture Système

\`\`\`
┌─────────────────────────────────────────────────────────────┐
│                        Client (Browser)                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   React UI   │  │  SWR Cache   │  │ Supabase     │      │
│  │  Components  │  │              │  │ Client       │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTPS
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Next.js App (Vercel)                      │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              API Routes (Serverless)                  │   │
│  │  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐    │   │
│  │  │ Upload │  │Convert │  │  Test  │  │ Deploy │    │   │
│  │  └────────┘  └────────┘  └────────┘  └────────┘    │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                  Business Logic                       │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐          │   │
│  │  │  Excel   │  │ Formula  │  │   VBA    │          │   │
│  │  │  Parser  │  │Transpiler│  │Transpiler│          │   │
│  │  └──────────┘  └──────────┘  └──────────┘          │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                │                           │
                │                           │
                ▼                           ▼
┌──────────────────────┐      ┌──────────────────────┐
│   Vercel Blob        │      │     Supabase         │
│  (File Storage)      │      │  ┌────────────────┐  │
│                      │      │  │   PostgreSQL   │  │
│  - Excel files       │      │  │   + RLS        │  │
│  - Generated code    │      │  └────────────────┘  │
│  - Exports           │      │  ┌────────────────┐  │
└──────────────────────┘      │  │   Auth         │  │
                              │  │   (Email/Pass) │  │
                              │  └────────────────┘  │
                              └──────────────────────┘
\`\`\`

## Flux de Données

### 1. Upload et Analyse

\`\`\`
User uploads Excel file
    │
    ▼
POST /api/upload
    │
    ├─► Validate file (type, size, virus scan)
    │
    ├─► Upload to Vercel Blob
    │
    ├─► Parse Excel (xlsx library)
    │   ├─► Extract sheets structure
    │   ├─► Parse formulas
    │   └─► Extract VBA macros
    │
    ├─► Store in Supabase
    │   ├─► projects table
    │   └─► analysis_results table
    │
    └─► Return project ID
\`\`\`

### 2. Conversion

\`\`\`
User triggers conversion
    │
    ▼
POST /api/convert/{id}
    │
    ├─► Fetch analysis from Supabase
    │
    ├─► Transpile formulas
    │   └─► Excel formulas → JavaScript functions
    │
    ├─► Transpile VBA
    │   └─► VBA code → TypeScript/API routes
    │
    ├─► Generate project structure
    │   ├─► Frontend components
    │   ├─► API routes
    │   ├─► Data models
    │   └─► Utility functions
    │
    ├─► Store in Supabase
    │   └─► conversion_results table
    │
    └─► Return generated code
\`\`\`

### 3. Testing

\`\`\`
User runs tests
    │
    ▼
POST /api/test/{id}
    │
    ├─► Fetch conversion results
    │
    ├─► Execute in sandbox
    │   ├─► Run generated code
    │   └─► Capture results
    │
    ├─► Compare with Excel results
    │
    ├─► Store test results
    │   └─► test_results table
    │
    └─► Return comparison
\`\`\`

## Composants Clés

### Frontend

#### Pages
- **`/`** : Homepage avec upload
- **`/projects`** : Liste des projets
- **`/analysis/[id]`** : Résultats d'analyse
- **`/vba/[id]`** : Détails VBA
- **`/conversion/[id]`** : Code généré
- **`/testing/[id]`** : Tests et validation
- **`/review/[id]`** : Édition de code
- **`/deploy/[id]`** : Déploiement
- **`/settings`** : Paramètres utilisateur

#### Composants Réutilisables
- **Navigation** : Barre de navigation avec auth
- **FileUpload** : Upload avec drag & drop
- **ErrorBoundary** : Gestion d'erreurs
- **LoadingSpinner** : États de chargement

### Backend

#### API Routes

**Projets**
- `GET /api/projects` : Liste des projets
- `POST /api/projects` : Créer un projet
- `GET /api/projects/[id]` : Détails d'un projet
- `PATCH /api/projects/[id]` : Mettre à jour
- `DELETE /api/projects/[id]` : Supprimer

**Upload**
- `POST /api/upload` : Upload et analyse

**Conversion**
- `POST /api/convert/[id]` : Lancer conversion
- `GET /api/convert/[id]` : Récupérer résultats

**Tests**
- `POST /api/test/[id]` : Exécuter un test
- `GET /api/test/[id]` : Liste des tests

**Déploiement**
- `POST /api/deploy/[id]` : Déployer
- `GET /api/deploy/[id]` : État du déploiement

**Export**
- `POST /api/export/[id]` : Exporter le projet

#### Bibliothèques

**excel-parser.ts**
\`\`\`typescript
- parseExcelFile(buffer: Buffer): Promise<ExcelData>
- extractSheets(workbook): Sheet[]
- extractFormulas(sheet): Formula[]
- extractVBA(workbook): VBAModule[]
\`\`\`

**formula-transpiler.ts**
\`\`\`typescript
- transpileFormula(formula: string): string
- mapExcelFunction(name: string): string
- generateFormulaFunction(formula: Formula): string
\`\`\`

**vba-transpiler.ts**
\`\`\`typescript
- transpileVBA(code: string): string
- parseVBAModule(module: VBAModule): ParsedModule
- generateAPIRoute(procedure: VBAProcedure): string
\`\`\`

## Sécurité

### Authentification
- **Supabase Auth** : Email/Password
- **JWT Tokens** : Stockés dans cookies httpOnly
- **Middleware** : Protection des routes
- **Session refresh** : Automatique

### Autorisation
- **Row Level Security (RLS)** : Isolation des données par utilisateur
- **API Routes** : Vérification de l'utilisateur sur chaque requête
- **Ownership checks** : Validation du propriétaire

### Validation
- **File upload** : Type, taille, contenu
- **Input sanitization** : Nettoyage des données
- **SQL injection** : Protection via Supabase client
- **XSS** : Protection React par défaut

## Performance

### Optimisations Frontend
- **Code splitting** : Chargement lazy des pages
- **SWR caching** : Cache des requêtes API
- **Image optimization** : Next.js Image
- **Bundle size** : Tree shaking automatique

### Optimisations Backend
- **Serverless functions** : Scaling automatique
- **Database indexes** : Sur user_id, project_id
- **Blob storage** : CDN Vercel
- **Connection pooling** : Supabase

### Monitoring
- **Vercel Analytics** : Performance metrics
- **Error tracking** : Console logs avec [v0] prefix
- **Database monitoring** : Supabase dashboard

## Scalabilité

### Horizontal Scaling
- **Serverless functions** : Auto-scaling Vercel
- **Database** : Supabase connection pooling
- **File storage** : CDN global Vercel Blob

### Limites
- **File size** : 50 MB par fichier
- **Concurrent uploads** : Limité par Vercel
- **Database connections** : Pool Supabase
- **API rate limits** : Vercel tier limits

## Déploiement

### Environnements
- **Development** : Local (localhost:3000)
- **Preview** : Vercel preview deployments
- **Production** : Vercel production

### CI/CD
- **Git push** : Déploiement automatique
- **Preview URLs** : Pour chaque PR
- **Environment variables** : Gérées par Vercel

### Rollback
- **Instant rollback** : Via Vercel dashboard
- **Database migrations** : Versionnées dans /scripts
- **Backup** : Supabase automated backups
