<div align="center">

# 🇬🇳 IdentiGuinée — NaissanceChain

**Plateforme d'identité numérique souveraine pour la Guinée**  
*Éliminer la corruption dans l'état civil par l'automatisation*

[![Next.js](https://img.shields.io/badge/Next.js_14-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Vercel](https://img.shields.io/badge/Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com)

**[🌐 Démo live](https://identiguinee-one.vercel.app)** · **[📂 GitHub](https://github.com/hadydieye/identiguinee)**

*MIABE Hackathon 2026 · DTC (Darollo Technologies Corporation) · Challenge GN-02 · Phase 3 Finale*

</div>

---

## 🎯 Problème

La Guinée est classée **150/180** dans l'Indice de Perception de la Corruption 2023 (Transparency International). **60 à 70 % des Guinéens** ont payé informellement pour obtenir un document d'état civil (TI Guinée, 2022). Seulement **25 % des communes** disposent d'un système informatique d'état civil.

La corruption dans l'état civil facilite la fraude électorale, le trafic d'identité et exclut les populations les plus vulnérables.

## 💡 Solution

IdentiGuinée automatise intégralement la délivrance de documents d'état civil via **NaissanceChain**, une blockchain simulée. Aucun agent humain n'intervient dans la décision : le smart contract vérifie, certifie et délivre. **Zéro intermédiaire. Zéro corruption possible.**

> Citoyen soumet → Vérification NaissanceChain → Document certifié PDF + QR code → **en moins de 2 minutes**

---

## 🏗️ Architecture

```
Deux espaces distincts, une seule plateforme :

┌─────────────────────────────┐    ┌──────────────────────────────┐
│     Portail Citoyen         │    │    Interface Admin /nca      │
│  /login  /register          │    │  Protégée — role=admin       │
│  /dashboard  /mes-demandes  │    │  JWT user_metadata.role      │
│  /nouvelle-demande          │    │  Dashboard · Demandes        │
│  /verifier (public)         │    │  Blockchain · Alertes        │
└─────────────────────────────┘    └──────────────────────────────┘
              │                                  │
              └──────────────┬───────────────────┘
                             │
                    ┌────────▼────────┐
                    │    Supabase     │
                    │  Auth · DB · RLS│
                    │    Storage      │
                    └─────────────────┘
```

---

## ✨ Fonctionnalités

### 👤 Portail citoyen

| Fonctionnalité | Description |
|---|---|
| Inscription / Connexion | Auth sécurisée via Supabase, ID blockchain `GN-2026-XXXXXX` attribué à l'inscription |
| Nouvelle demande | Formulaire multi-étapes : type de document → informations → justificatifs → confirmation |
| Types de documents | Acte de naissance · CNI · Passeport · Certificat de nationalité |
| Suivi en temps réel | Statuts : `en_cours` → `certifié` ou `rejeté` |
| Document certifié | PDF généré avec couleurs du drapeau guinéen, QR code, hash SHA-256, timestamp blockchain |
| Vérification publique | `/verifier` — scanner le QR code ou saisir la référence pour confirmer l'authenticité |

### 🛡️ Interface admin (`/nca`)

| Module | Description |
|---|---|
| Dashboard | KPIs temps réel · AreaChart 30 jours · PieChart types de documents · 5 dernières demandes |
| Gestion demandes | Liste paginée (20/page) · Filtres statut/type/search · Validation et rejet avec motif |
| Citoyens | Liste des profils · Compteur de documents · Dernier statut |
| NaissanceChain | Feed de transactions blockchain · Filtres Tout/Certifications/Rejets · Pagination infinie |
| Vérifications | Historique des vérifications · Taux de succès · Durée moyenne · Anomalies |
| Alertes | Centre d'alertes critique/attention/info · Résolution en un clic |
| Rapports | Statistiques mensuelles · Répartition régionale · Performance hebdomadaire |
| Paramètres | Sécurité · Blockchain · Notifications · Clés API |

---

## 🔒 Sécurité

- **Supabase Auth** — JWT avec `user_metadata.role` pour la séparation admin/citoyen
- **RLS (Row Level Security)** — activée sur toutes les tables, policies par rôle
- **Rate limiting anti-bruteforce** — 5 tentatives / 15 min par IP, sans dépendance externe
- **Protection des routes admin** — vérification du JWT dans le middleware (`proxy.ts`)
- **Séparation des clés** — `NEXT_PUBLIC_SUPABASE_ANON_KEY` côté client, `SUPABASE_SERVICE_ROLE_KEY` uniquement côté serveur (API routes)
- **Variables d'environnement** — jamais exposées côté client

---

## 🗄️ Base de données

| Table | Description |
|---|---|
| `profiles` | Profil citoyen (nom, prénom, commune, id_blockchain, role) |
| `demandes` | Demandes avec statut, hash SHA-256, id blockchain, informations personnelles |
| `documents_certifies` | PDF certifié, hash, numéro de bloc, URL de stockage |
| `justificatifs` | Fichiers justificatifs uploadés |
| `verifications` | Journal public des vérifications (référence, IP, résultat) |
| `verifications_admin` | Historique interne des vérifications admin |
| `alertes` | Alertes système (critique/attention/info/résolu) |

---

## 🚀 Stack technique

| Couche | Technologie |
|---|---|
| Framework | Next.js 14 (App Router, React 19, TypeScript) |
| Backend / BDD | Supabase (PostgreSQL + Auth + RLS + Storage) |
| Styling | Tailwind CSS v4 + Shadcn/ui |
| Animations | Framer Motion |
| Génération PDF | pdf-lib |
| QR Code | qrcode + @zxing/browser |
| Graphiques | recharts |
| Déploiement | Vercel |

---

## ⚙️ Installation locale

### Prérequis
- Node.js 18+
- Un projet Supabase (gratuit sur [supabase.com](https://supabase.com))

### Étapes

```bash
# 1. Cloner le dépôt
git clone https://github.com/hadydieye/identiguinee.git
cd identiguinee

# 2. Installer les dépendances
npm install

# 3. Configurer les variables d'environnement
cp .env.example .env.local
# Remplir les valeurs dans .env.local

# 4. Lancer le serveur de développement
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000).

### Variables d'environnement

| Variable | Description | Côté |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL de votre projet Supabase | Client + Serveur |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clé publique Supabase (anon) | Client + Serveur |
| `SUPABASE_SERVICE_ROLE_KEY` | Clé service role Supabase (⚠️ secrète) | Serveur uniquement |
| `INTERNAL_SECRET` | Secret partagé entre les API routes internes | Serveur uniquement |
| `NEXT_PUBLIC_SITE_URL` | URL de production (ex: `https://identiguinee-one.vercel.app`) | Client + Serveur |

---

## 📁 Structure du projet

```
app/
├── (auth)/
│   ├── login/          # Connexion avec rate limiting anti-bruteforce
│   └── register/       # Inscription + création profil + ID blockchain
├── (protected)/
│   ├── mes-demandes/   # Suivi des dossiers du citoyen
│   └── nouvelle-demande/ # Formulaire multi-étapes de demande
├── dashboard/          # Tableau de bord citoyen
├── verifier/           # Vérification publique par QR code ou référence
├── nca/                # Interface admin (protégée, role=admin)
│   ├── page.tsx        # Dashboard KPIs + graphiques
│   ├── demandes/       # Gestion des demandes + validation/rejet
│   ├── citoyens/       # Liste des profils citoyens
│   ├── blockchain/     # Feed NaissanceChain
│   ├── verifications/  # Historique des vérifications
│   ├── alertes/        # Centre d'alertes système
│   ├── rapports/       # Statistiques et rapports
│   └── parametres/     # Configuration système
└── api/
    ├── auth/login/     # Endpoint login avec rate limiting
    ├── demandes/       # CRUD demandes
    ├── generate-document/ # Génération PDF + upload Storage
    ├── upload/         # Upload justificatifs
    └── verifier/       # Vérification d'authenticité

lib/
├── supabase/
│   ├── client.ts       # Client navigateur (createBrowserClient)
│   └── server.ts       # Client serveur SSR (createServerClient + cookies)
├── rate-limit.ts       # Rate limiting en mémoire (anti-bruteforce)
├── types.ts            # Types TypeScript + constantes
├── utils.ts            # generateIdBlockchain, cn()
└── communes.ts         # Liste des communes de Guinée

proxy.ts                # Middleware Next.js (auth + protection routes)
```

---

## 🌍 Impact attendu

- **Élimination des intermédiaires** dans la chaîne de délivrance des documents d'état civil
- **Traçabilité totale** via NaissanceChain — chaque action est immuable et auditable
- **Accessibilité** — depuis n'importe quel téléphone ou ordinateur, sans déplacement
- **Vérification instantanée** — toute institution peut confirmer l'authenticité d'un document en 3 secondes via QR code
- **Modèle réplicable** — architecture applicable à d'autres pays d'Afrique de l'Ouest

---

## 👥 Équipe VortexDevs

| Membre | Rôle |
|---|---|
| **Sensei** (hadydieye) | Lead Dev · Architecture · Backend |
| **Nfamory** | Frontend · UI/UX |
| **Sempy** | Blockchain · Smart Contracts |
| **Dark_Deku** | Design · Intégration |

---

<div align="center">

**MIABE Hackathon 2026 · DTC · Challenge GN-02 · Phase 3 Finale**

*"En supprimant le rôle de l'agent, on supprime structurellement la corruption."*

🇬🇳 **IdentiGuinée** — Identité numérique citoyenne

</div>
