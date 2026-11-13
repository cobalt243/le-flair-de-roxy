# Le Flair de Roxy — consignes de travail

Jeu éducatif en blocs (Three.js, sans compilation) pour apprendre à bien utiliser Claude au travail, pensé pour les équipes d’ONG. Concept et création : Jean-Marc Pagé. Lire d’abord `docs/PASSATION.md`.

## Façon de travailler (demandée par l’auteur)
- **Proposer avant de changer.** Expliquer la proposition et attendre l’accord avant toute modification visible du jeu ou des questions.
- **Bêta d’abord.** Tout changement se fait dans `beta/`, puis se reporte dans la version officielle (racine) seulement après accord. Ne jamais modifier `v1/` (archive figée).
- **Image avant/après** après chaque changement visible (captures Playwright, téléphone simulé).
- **Téléphone d’abord** : tester en iPhone 13 et en 360 × 640 ; aucun débordement horizontal.
- Répondre en **français professionnel, vouvoiement**, concis et structuré ; clore par « Cordialement ».
- Être honnête sur ce qui n’a pas pu être vérifié (son, vrai téléphone, site en ligne).

## Règles de contenu
- Monde **imaginaire** : aucun nom de lieu réel dans le jeu. Paysage d’inspiration dogon, **musique d’inspiration sahélienne** (ne pas dire « musique dogon »). Aucun objet sacré (masques, autels).
- Inspiration « jeux en blocs » sans rien copier (pas de nom, logo, texture, créature ni interface repris).
- Profil **ONG** assumé (bailleur de fonds, décret sur les ONG, suivi-évaluation). Ne pas changer questions ni réponses sans accord.
- Écriture inclusive par reformulation neutre (pas de point médian).
- Crédit : « Concept et création : Jean-Marc Pagé · Projet éducatif indépendant, non affilié à Anthropic ».
- Les photos de référence de Roxy restent **hors du dépôt** (privées).

## Organisation du dépôt
| Dossier | Rôle | Sauvegardes navigateur |
|---|---|---|
| racine | Version officielle (2.0.5) | `flair-roxy-2-*` |
| `beta/` | Espace de test | `flair-roxy-beta-*` |
| `v1/` | Archive 1.1, figée | `flair-roxy-*` |
| `b/` | Simple renvoi vers la racine | — |

Chaque version est autonome (code, `vendor/`, musique, images, lien de partage `GAME_URL`). Après un changement : incrémenter le numéro de version dans `index.html` (libellé et `?v=` des scripts), noter dans `CHANGELOG.md`.

## Vérifications utiles
- `python3 -m http.server 8000` puis `tests/acces-animaux.js` (trajets à pied) ; `node --check` sur chaque fichier JS modifié.
- Playwright : bloquer cdnjs pour forcer `vendor/three.min.js`, lancer Chromium avec `--use-angle=swiftshader --enable-unsafe-swiftshader`. `window.RX.debug` expose l’état, `teleport`, `sim`, `feteAt`, `seedAt` (bêta).

## Hors dépôt
- Artefact « Dossier du jeu Roxy » : https://claude.ai/artifact/12MGasMKuHXZUZ6xCXc3GR — source dans `docs/dossier-artefact/` (`python3 build.py <dossier>` après avoir recopié `img/`, `audio/`, `js/`).
- Artefact du jeu : https://claude.ai/artifact/EWT2dbfK5r62GxpZpmqKVT
