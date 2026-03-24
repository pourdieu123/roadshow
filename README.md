# 7Elite Road Show — Configuration Airtable sécurisée

## Architecture de la connexion Airtable

Le formulaire envoie les données à une **Netlify Function** (serveur) qui fait la vraie requête vers Airtable. Les credentials ne sont **jamais** dans le code source HTML.

```
Navigateur visiteur
      │  POST /api/airtable-submit
      ▼
Netlify Function (netlify/functions/airtable-submit.js)
      │  lit process.env.AIRTABLE_TOKEN   ← variable d'environnement Netlify
      │  lit process.env.AIRTABLE_BASE    ← variable d'environnement Netlify
      ▼
API Airtable  →  nouvelle ligne dans votre table
```

## Fichiers du projet

```
├── index.html                          ← Page principale (commit sur GitHub ✓)
├── netlify.toml                        ← Config déploiement Netlify (commit ✓)
├── netlify/
│   └── functions/
│       └── airtable-submit.js          ← Proxy sécurisé (commit ✓, aucun secret)
├── .env.example                        ← Template des variables (commit ✓)
├── .env                                ← VOS vraies valeurs (JAMAIS commité ✗)
└── .gitignore                          ← Exclut .env du dépôt (commit ✓)
```

## Mise en place sur Netlify (5 min)

### 1. Déployer le site
Connectez votre dépôt GitHub à Netlify. Le fichier `netlify.toml` configure tout automatiquement.

### 2. Définir les variables d'environnement
Dans votre tableau de bord Netlify :
**Site > Site configuration > Environment variables > Add a variable**

| Variable          | Valeur                         |
|-------------------|-------------------------------|
| `AIRTABLE_TOKEN`  | `patXXXXXXXXXXXXXXXX`        |
| `AIRTABLE_BASE`   | `appXXXXXXXXXXXXXX`          |
| `AIRTABLE_TABLE`  | `Participants`                 |

### 3. Créer votre token Airtable
1. Allez sur https://airtable.com/create/tokens
2. Cliquez **+ Create new token**
3. Nom : `7Elite Road Show`
4. Portée : cochez `data.records:write`
5. Accès : sélectionnez votre base
6. Copiez le token → collez-le dans Netlify

### 4. Structure de la table Airtable
Créez une table `Participants` avec ces colonnes :

| Champ             | Type        |
|-------------------|-------------|
| Prénom            | Texte court |
| Nom               | Texte court |
| Email             | Email       |
| Téléphone         | Numéro      |
| Fonction          | Texte court |
| Type participant  | Texte court |
| Entreprise        | Texte court |
| Source            | Texte court |
| Date inscription  | Date/heure  |
| Événement         | Texte court |

## Sécurité GitHub

Le fichier `.gitignore` exclut `.env` du dépôt.  
Seul `.env.example` (sans vraies valeurs) est commité — votre token ne sera jamais exposé.

```bash
# Vérifier ce qui sera commité (aucun secret ne doit apparaître)
git status
git diff --cached
```

## Test local (optionnel)

Avec Netlify CLI installé :
```bash
npm install -g netlify-cli
cp .env.example .env
# Éditez .env avec vos vraies valeurs
netlify dev
# → Ouvrez http://localhost:8888
```
