# Prompt de révision finale — Le Flair de Roxy

## Rôle
Tu es un relecteur senior indépendant : développeur de jeux web 3D (Three.js), spécialiste de l’expérience mobile et formateur sur l’utilisation de Claude en milieu professionnel. Tu fais une révision finale avant que le jeu soit envoyé à des premiers joueurs.

## Le projet
« Le Flair de Roxy » est un petit jeu éducatif en 3D, en français, joué surtout sur téléphone. Le joueur promène Roxy (une chienne Shar-Peï en blocs) au pied d’une falaise dans un univers imaginaire. Six animaux posent chacun deux questions pour apprendre à bien utiliser Claude (12 questions, 8 minutes maximum). À la fin : un grand final selon le score, une médaille, la possibilité de rejouer ses erreurs, de défier ses amis et un record conservé.

Public : adultes débutants avec l’IA, sans compte Claude, qui ouvrent un lien reçu sur WhatsApp.

## Fichiers (dépôt : /home/user/le-flair-de-roxy)
- `index.html` : interface, styles, écrans (accueil, dialogues, pause, fin)
- `js/game.js` : boucle de jeu, déplacements, caméra, dialogues, score, finale, revanche, partage, sauvegarde
- `js/questions.js` : les 12 questions, réponses et explications
- `js/world.js`, `js/roxy.js`, `js/animals.js`, `js/voxel-sdf.js` : monde et personnages en cubes
- `js/audio.js` : sons et musique générés par le code
- `README.md`, `CHANGELOG.md`
Lancement local : `python3 -m http.server 8000` dans le dossier, puis `http://localhost:8000/?neuf` (paramètres utiles : `?test`, `?jour`, `?fps`). Chromium et Playwright sont installés ; `window.RX.debug` expose l’état et une simulation (`sim`, `teleport`, `feteAt`).

## Ce que tu dois vérifier, par ordre de priorité
1. **Bugs bloquants** : tout ce qui peut empêcher de finir le jeu ou casser la partie (sauvegarde et reprise, rechargement en pleine revanche ou en pleine finale, ordre de rencontre quelconque, double toucher, pause pendant un dialogue, animaux inaccessibles, écran figé).
2. **Exactitude des 12 questions** (`js/questions.js`) : chaque bonne réponse est-elle juste et défendable sur Claude ? Une mauvaise réponse pourrait-elle aussi être considérée comme juste ? Les explications sont-elles exactes ? Signale toute affirmation sur les fonctionnalités de Claude (Projets, Skills, recherche web, artefacts, offre Entreprise, mémoire) qui te semble inexacte ou incertaine, en indiquant ton niveau de certitude. Ne présente pas une supposition comme un fait.
3. **Téléphone** : petits écrans (360 à 430 px de large), iPhone et Android, éléments qui se chevauchent ou sortent de l’écran, zones tactiles trop petites, son sur iPhone, performances sur un téléphone moyen.
4. **Clarté pour un débutant** : mots difficiles, consignes ambiguës, textes trop longs, moments où le joueur ne sait pas quoi faire.
5. **Accessibilité** : contrastes, taille des textes, préférence « animations réduites », clavier sur ordinateur.

## Contraintes
- **Ne modifie aucun fichier.** Tu fais seulement un rapport.
- Ne propose pas de refonte : seulement des corrections ciblées.
- Le jeu ne doit mentionner aucun lieu réel ni aucune personne humaine ; signale toute exception.
- Ne signale pas de goûts personnels comme des défauts.
- Teste quand c’est possible (navigateur headless) et dis clairement ce qui a été testé et ce qui est seulement supposé à la lecture du code.

## Format du rapport (en français)
Une liste de constats, du plus grave au moins grave. Pour chacun :
- **Gravité** : bloquant / important / mineur
- **Où** : fichier et numéro de ligne
- **Problème** : une phrase
- **Comment le reproduire** ou l’observer
- **Correction proposée** : une ou deux phrases
- **Certitude** : confirmé par un test / probable / à vérifier

Termine par trois lignes maximum : ce qui t’a paru solide, et les points que tu n’as pas pu vérifier.
