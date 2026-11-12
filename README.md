# Le Flair de Roxy

« Bien utiliser Claude, bloc par bloc ». Petit jeu éducatif en 3D, en français, pensé d’abord pour le téléphone.
Concept et création : Jean-Marc Pagé. Projet éducatif indépendant, non affilié à Anthropic.

**Jouer :** https://cobalt243.github.io/le-flair-de-roxy/

## Versions

| Adresse | Dossier | Rôle |
|---|---|---|
| https://cobalt243.github.io/le-flair-de-roxy/ | racine | **Version officielle 2.0**, celle qu’on partage |
| https://cobalt243.github.io/le-flair-de-roxy/beta/ | `beta/` | Espace de test : on y essaie les changements avant de les reporter dans la version officielle |
| https://cobalt243.github.io/le-flair-de-roxy/v1/ | `v1/` | Archive figée de la version 1.1, non maintenue |

Chaque version est autonome : ses propres fichiers (code, bibliothèque 3D, musique, images), ses propres sauvegardes dans le navigateur (`flair-roxy-2-*`, `flair-roxy-beta-*`, et `flair-roxy-*` pour l’archive) et son propre lien de partage. La bêta et l’archive sont masquées des moteurs de recherche. L’ancienne adresse `/b/` renvoie vers la version officielle. Repères Git : `v1.1` et `v2.0`.

## Le jeu

Le joueur promène Roxy, une chienne Shar-Peï en blocs, au pied d’une grande falaise dans un univers imaginaire. Six animaux posent chacun deux questions pour apprendre à bien utiliser Claude (12 questions, 8 minutes maximum). Une flèche dorée guide vers l’animal le plus proche.

| Animal | Thème |
|---|---|
| Agame (lézard des rochers) | Connaître Claude |
| Éléphant | Le bon prompt |
| Singe patas | Les outils |
| Calao | Les données |
| Vautour | Vérifier |
| Tortue sillonnée | Claude au travail (compte de l’organisation, artefacts) |

À la fin : un grand final selon le score, une médaille (Flair d’or, d’argent, de bronze ou Chiot curieux), « Rejouer mes erreurs », « Défier mes collègues », une rangée de 12 blocs pour revoir chaque question, et un record conservé.

## Commandes

| Action | Téléphone | Clavier |
|---|---|---|
| Se déplacer | Joystick à gauche (pousser au bout pour courir) | ZQSD, WASD ou flèches ; Maj pour courir |
| Sauter | Automatique devant une marche | Espace |
| Parler à un animal | Gros bouton doré | E |
| Répondre | Toucher une réponse | Touches 1 à 4 |
| Caméra | Glisser l’écran | Glisser la souris, molette |
| Pause | Bouton Pause | Échap ou P |

## Lancer en local

    python3 -m http.server 8000

puis http://localhost:8000 (version officielle), http://localhost:8000/beta/ ou http://localhost:8000/v1/. Three.js r128 (licence MIT) est chargé depuis cdnjs, avec une copie locale dans `vendor/`.
Paramètres utiles : `?neuf` (nouvelle partie), `?jour` (pas de cycle jour-nuit), `?fps`, `?test` (saute l’écran titre).

## Fichiers (version officielle ; la bêta a les mêmes)

| Fichier | Rôle |
|---|---|
| `index.html` | Interface, styles, écrans |
| `js/game.js` | Boucle de jeu, caméra, dialogues, score, finale, revanche, partage, sauvegarde |
| `js/questions.js` | Les 12 questions, réponses et explications |
| `js/world.js` | Monde en blocs |
| `js/roxy.js`, `js/animals.js`, `js/voxel-sdf.js` | Personnages en cubes |
| `js/audio.js` | Sons générés par le code, lecture de la musique, carillon de fin |
| `audio/` | Musique en 3 variantes (`musique-1.mp3` à `musique-3.mp3`), composée par le code (`compo-source.js`) |
| `apercu.jpg`, `icone.png` | Aperçu du lien partagé et icône |
| `tests/` | Scénarios Playwright |

Historique : voir `CHANGELOG.md`.
