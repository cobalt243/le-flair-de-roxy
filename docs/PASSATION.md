# Passation — 13 novembre 2026

Note pour reprendre le projet dans une nouvelle session Claude Code (la précédente avait atteint 82 % de son contexte).

## État actuel
- **Version officielle 2.0.5** à la racine : https://cobalt243.github.io/le-flair-de-roxy/
  - 6 animaux, 12 questions (agame 1 et 9 · éléphant 3 et 11 · patas 5 et 6 · calao 7 et 8 · vautour 2 et 10 · tortue 4 et 12).
  - Écran de fin : médaille, 12 blocs à toucher, ligne « À revoir », 4 points « À retenir ».
  - Musique en 3 variantes (`audio/`), carillon de fin, aperçu de partage (`apercu.jpg`).
- **Bêta** (`beta/`) = 2.0.5 + **la quête du baobab** : jeune pousse visible dès le départ, qui grandit après chaque animal (scène de 3 s), objectif « Graines de savoir : n sur 6 ». **À faire tester par quelques collègues avant de la reporter.**
- **Archive 1.1** (`v1/`) : figée.
- Questions validées et historique des décisions : `docs/conception/questions-validees.md`, `docs/conception/decisions.md`.

## Points ouverts
1. Décider du report de la quête du baobab (bêta → officielle).
2. Ancien artefact « Roxy · Dossier de conception » (https://claude.ai/artifact/UZMfY8qTEZiKvicn7b5XiG) : périmé ; le supprimer ou y ajouter un renvoi vers le nouveau dossier.
3. Repères Git `v1.1` et `v2.0` : créés localement mais refusés à l’envoi (403). À créer depuis la page « Releases » de GitHub si souhaité.
4. Relecture culturelle (paysage, instruments) par une personne qui connaît le Mali : recommandée avant une large diffusion.
5. Tester sur un vrai téléphone Android modeste (vitesse) et vérifier le volume de la musique à l’oreille.

## Deuxième niveau (à concevoir)
Rien n’est encore décidé. Pistes à proposer à l’auteur avant tout développement :
- Nouvelle zone imaginaire (par exemple un fleuve et ses plaines inondables), nouveaux animaux, 12 nouvelles questions de niveau intermédiaire (Projets avancés, Skills, connecteurs, recherche, artefacts partagés, relecture critique).
- Réutiliser le moteur, Roxy, l’écran de fin et la structure « bêta d’abord ».
- Garder 8 minutes maximum et le téléphone d’abord.
- Construire dans `beta/` (ou un dossier `niveau2/` autonome, à décider avec l’auteur).
