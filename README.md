# IdentiGuinée

Plateforme d'identité numérique citoyenne pour la Guinée, permettant la demande, la certification et la vérification de documents administratifs via une blockchain simulée (NaissanceChain).

## Présentation

IdentiGuinée digitalise la délivrance de documents d'état civil en Guinée. Un citoyen crée un compte, soumet une demande de document, et reçoit un PDF certifié avec QR code en moins de 2 minutes. N'importe qui peut ensuite vérifier l'authenticité du document via la page publique `/verifier`.

## Stack technique

| Couche | Technologie |
|---|---|
| Framework | Next.js 16 (App Router, React 19) |
| Backend / BDD | Supabase (PostgreSQL + Auth + Storage) |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Animations | Framer Motion |
| Génération PDF | pdf-lib |
| QR Code | qrcode + @zxing/browser |
| Déploiement | Vercel |

## Structure du projet

```
app/
├── page.tsx                        # Landing page publique
├── (auth)/
│   ├── login/page.tsx              # Connexion
│   └── register/page.tsx           # Inscription
├── (protected)/
│   ├── nouvelle-demande/page.tsx   # Formulaire multi-étapes
│   └── mes-demandes/page.tsx       # Suivi des dossiers
├── dashboard/page.tsx              # Tableau de bord citoyen
├── verifier/page.tsx               # Vérification publique (QR + saisie)
└── api/
    ├── demandes/route.ts           # POST (créer) / GET (lister)
    ├── demandes/[id]/route.ts      # GET demande par ID
    ├── demandes/certifier/route.ts # Certification manuelle
    ├── generate-document/route.ts  # Génération PDF + upload Supabase Storage
    ├── upload/route.ts             # Upload justificatifs
    └── verifier/route.ts           # Vérification d'authenticité

components/
├── landing/                        # Hero, Stats, FlowSteps, NaissanceChain, CTA, Navbar
└── demandes/                       # DocumentTypeSelector, FormStepper, EtapeInformations,
                                    # EtapeJustificatifs, EtapeConfirmation, DemandeCard,
                                    # TimelineBlockchain

lib/
├── types.ts                        # Types TypeScript + constantes (TypeDocument, StatutDemande…)
├── utils.ts                        # generateIdBlockchain, cn()
├── communes.ts                     # Liste des communes de Guinée
└── supabase/
    ├── client.ts                   # Client Supabase côté navigateur
    └── server.ts                   # Client Supabase côté serveur (SSR)
```

## Base de données (Supabase)

| Table | Description |
|---|---|
| `profiles` | Profil citoyen (nom, prénom, commune, id_blockchain) |
| `demandes` | Demandes de documents avec statut, hash SHA-256 et id blockchain |
| `documents_certifies` | PDF certifié, hash, numéro de bloc, URL de stockage |
| `justificatifs` | Fichiers justificatifs uploadés |
| `verifications` | Journal des vérifications (référence, IP, résultat) |

### Types de documents supportés

- Acte de naissance
- Carte nationale d'identité (CNI)
- Passeport
- Certificat de nationalité

### Statuts d'une demande

`en_cours` → `certifie` | `rejete`

## Flux principal

1. **Inscription** — le citoyen crée un compte avec ses informations et sa commune ; un `id_blockchain` unique (`GN-2026-XXXXXX`) lui est attribué.
2. **Nouvelle demande** — formulaire en 4 étapes : type de document → informations personnelles → justificatifs → confirmation.
3. **Certification automatique** — à la soumission, l'API `/api/demandes` génère une référence (`GN-AAAA-NNNN-XXXX`), un hash SHA-256, certifie immédiatement la demande et appelle `/api/generate-document`.
4. **Génération PDF** — un PDF certifié est créé avec pdf-lib (couleurs du drapeau guinéen, QR code, hash, timestamp) et uploadé dans Supabase Storage.
5. **Vérification** — la page `/verifier` permet à quiconque de scanner le QR code ou saisir la référence pour confirmer l'authenticité du document.

## Variables d'environnement

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
INTERNAL_SECRET=          # Secret partagé entre /api/demandes et /api/generate-document
NEXT_PUBLIC_SITE_URL=     # URL de production (ex: https://identiguinee-one.vercel.app)
```

## Lancer le projet en local

```bash
npm install
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000).

## Déploiement

Le projet est déployé sur Vercel : [identiguinee-one.vercel.app](https://identiguinee-one.vercel.app)

```bash
npm run build   # vérification locale avant déploiement
```
