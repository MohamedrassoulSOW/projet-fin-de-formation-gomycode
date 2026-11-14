# SoukExpat

MVP responsive de la marketplace SoukExpat, pensé pour les expatriés au Maroc.

## Fonctionnalités disponibles

- Accueil avec recherche, catégories et annonces à la une
- Recherche par mot-clé, catégorie, ville et tri par prix
- Fiche détaillée d'une annonce et conseils de sécurité
- Favoris côté navigateur
- Inscription / connexion de démonstration
- Espace membre et soumission d'une annonce à la modération
- Design responsive mobile-first

## Démarrage

```bash
npm install
npm run dev
```

Le projet est servi par Vite à l'adresse indiquée dans le terminal.

## Build de production

```bash
npm run build
npm run preview
```

Les données de démonstration sont dans `src/data.ts`. L'interface est volontairement découplée des données afin de permettre le branchement ultérieur de l'API Express/MongoDB prévue par le cahier des charges.

## Prochaine étape technique

Pour passer du prototype au MVP production, remplacer les données locales par les routes REST prévues (`/api/v1/auth`, `/api/v1/listings`, `/api/v1/categories`, etc.), puis ajouter les contrôles serveur, MongoDB, le stockage privé des images et la vérification d'e-mail.
