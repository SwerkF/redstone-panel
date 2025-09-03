# Minecraft Servers

Plateforme de gestion de serveurs Minecraft avec Kubernetes.

## 🚀 Getting Started

### Installation

```bash
# Installation des dépendances
pnpm install

# Setup de la base de données
pnpm db:migrate
pnpm db:seed

# Développement
pnpm dev
```

### Scripts disponibles

- `pnpm dev` - Démarre le serveur en mode développement
- `pnpm build` - Build l'application
- `pnpm start` - Démarre le serveur en production
- `pnpm test` - Lance les tests
- `pnpm lint` - Vérifie le code avec ESLint
- `pnpm lint:fix` - Corrige automatiquement les erreurs ESLint
- `pnpm format` - Formate le code avec Prettier
- `pnpm typecheck` - Vérifie les types TypeScript

### Base de données

- `pnpm db:migrate` - Lance les migrations
- `pnpm db:reset` - Reset la base de données
- `pnpm db:seed` - Insère les données de test
- `pnpm db:fresh` - Reset + seed

## 🔧 Configuration Husky

Ce projet utilise Husky pour automatiser les vérifications avant les commits :

### Pre-commit Hook

- ✅ **lint-staged** : Exécute automatiquement le linting et le formatage sur les fichiers modifiés
- ✅ **ESLint** : Détection et correction des erreurs de code
- ✅ **Prettier** : Formatage automatique du code

### Commit Message Hook

Les messages de commit doivent suivre le format **Conventional Commits** :

```
<type>(<scope>): <description>
```

#### Types autorisés :

- `feat` - Nouvelle fonctionnalité
- `fix` - Correction de bug
- `docs` - Documentation
- `style` - Formatage, sans changement de code
- `refactor` - Refactoring du code
- `test` - Ajout ou modification de tests
- `chore` - Maintenance, configuration

#### Exemples valides :

```bash
git commit -m "feat(auth): add user login functionality"
git commit -m "fix(server): resolve kubernetes port allocation issue"
git commit -m "docs: update README with setup instructions"
git commit -m "chore: setup husky and lint-staged"
```

#### Exemples invalides :

```bash
git commit -m "update code"           # ❌ Pas de type
git commit -m "added new feature"    # ❌ Type invalide
git commit -m "fix bug"              # ❌ Manque les deux points
```

## 📁 Structure du projet

```
minecraft-servers/
├── backend/           # API Backend (AdonisJS)
├── docker/           # Configuration Docker
├── .husky/           # Hooks Git
├── package.json      # Configuration workspace
└── pnpm-workspace.yaml
```

## 🐛 Dépannage Husky

Si les hooks ne fonctionnent pas :

```bash
# Réinstaller Husky
pnpm install
chmod +x .husky/pre-commit .husky/commit-msg

# Vérifier que Git hooks sont activés
git config core.hooksPath .husky
```