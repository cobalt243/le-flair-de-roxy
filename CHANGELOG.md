# Historique

## Version B — 12 novembre 2026 (musique)
Nouvelle musique dans B uniquement : piano doux (esprit jeu en blocs) avec balafon, tambour d’eau, flûte en bois et cloche en fer, sans vent (`b/audio/musique-b.mp3`, 65 s, composition originale générée par le code). Jouée en entier puis suivie de 20 à 40 s de silence.

## Version B — 12 novembre 2026
B devient autonome : sa propre copie de la bibliothèque 3D (`b/vendor/`) et son lien de défi vers `/b/`. Aucun fichier de la version principale n’est utilisé par B.

## 1.1 — 12 novembre 2026
Paysage plus dogon, repris de la version B : petits villages nichés sous un surplomb de la falaise (maisons en banco, greniers), case à palabres (toguna) à piliers de bois et toit épais de tiges de mil. Univers toujours imaginaire, sans objet sacré.

## Version B (test) — 12 novembre 2026
Dossier `b/` : copie de la 1.0.3 avec un paysage plus dogon (maisons nichées dans la falaise, case à palabres). Sauvegardes séparées (`flair-roxy-b-*`). La version principale n’est pas modifiée.

## 1.0.3 — 12 novembre 2026
Question 4 : la mise en situation se passe sur l’ordinateur de travail, avec le compte personnel déjà ouvert. La bonne réponse n’encourage plus l’usage d’un appareil personnel ; débuts de réponses variés.

## 1.0.2 — 11 novembre 2026
- Médailles : nouvelle tête de Roxy en blocs (style du jeu : plis du front, museau foncé, oreilles repliées, contour), médaille un peu plus grande.
- Écriture inclusive par reformulation neutre : écran final 12/12, questions 3, 4 et 8, « À retenir ».

## 1.0.1 — 11 novembre 2026
Écran final : le lien « Copier le message du défi » est retiré. « Défier mes collègues » ouvre déjà le menu de partage du téléphone (WhatsApp, Teams, courriel, SMS…).

## 1.0 — 11 novembre 2026
Écran final : le lien « Rejouer avec les animaux » est retiré (doublon de « Rejouer mes erreurs »). Il reste deux liens : « Continuer à explorer » et « Tout recommencer ».

## 0.9.9 — 11 novembre 2026
Écran final simplifié : « À retenir » sous le score, « Rejouer mes erreurs » en premier quand il y a des erreurs (« Défier mes collègues » devient secondaire), actions secondaires regroupées sur une ligne de liens.

## 0.9.8 — 11 novembre 2026
Si la page est rechargée pendant une revanche, l’accueil propose « Reprendre ma revanche » en bouton principal (« Nouvelle partie » reste disponible, avec confirmation).

## 0.9.7 — 11 novembre 2026
Question 10 (vautour) plus exigeante : une note à envoyer dans 10 minutes avec un chiffre non vérifié ; la bonne réponse est de retirer le chiffre ou d’indiquer « à vérifier ». Le message technique « Ombres désactivées » ne s’affiche plus (le réglage se fait sans rien dire).

## 0.9.6 — 11 novembre 2026
Fiche aide-mémoire masquée pour l’instant, en attendant d’autres retours (code conservé : `FICHE_ON` dans `js/game.js`).

## 0.9.5 — 11 novembre 2026
Suite aux premiers retours :
- **Revanche express** : « Rejouer mes erreurs » affiche directement les questions ratées, sans marcher, puis rejoue la finale. « Rejouer avec les animaux » reste disponible.
- La revanche avec les animaux ne répète plus leur présentation.
- **Fiche aide-mémoire** : les 12 questions, la bonne réponse et l’explication, à partager ou copier ; erreurs signalées « à revoir » ; version dorée « fiche du baobab doré » pour un 12/12.
- « Défier mes collègues » et « Rejouer mon erreur » (singulier).

## 0.9.2 — 11 novembre 2026
Les fichiers du jeu portent un numéro de version dans leur adresse, pour que les téléphones chargent toujours la dernière version ensemble.

## 0.9.1 — 11 novembre 2026
Après la finale, la caméra ne traverse plus le grand baobab pendant les dialogues. Quand le parcours est terminé, l’écran d’accueil propose « Nouvelle partie » en bouton principal.

## 0.9 — 11 novembre 2026
Son : le souffle de fond (vent) est fortement réduit et adouci, les bruits de pas sont plus discrets.

## 0.8 — 11 novembre 2026
Jeu recentré sur Claude en entreprise : deux nouvelles questions posées par la tortue (« Claude au travail ») sur le compte de l’organisation et sur les artefacts (tableau de bord de suivi-évaluation). Elles remplacent deux questions sur la rédaction des demandes. L’éléphant pose désormais les questions 3 et 11. « Bailleur de fonds » dans la question 3.

## 0.7 — 11 novembre 2026
Corrections issues de la révision finale :
- La mare n’est plus un piège : fond relevé, saut normal dans l’eau, et Roxy est ramenée sur la berge après quelques secondes dans l’eau.
- « Tout recommencer » ne laisse plus `?neuf` dans l’adresse (un rechargement n’efface plus la partie).
- Bouton « Voir mon résultat » (accueil et pause) une fois le parcours terminé ; record enregistré dès le début de la finale.
- Une mauvaise réponse affiche maintenant sa propre explication, puis la bonne réponse.
- Questions 2, 6, 7, 8 et 12 précisées (sujets fournis dans le bon prompt, nuances sur les données, formulations moins catégoriques) ; « prompt » expliqué par l’éléphant.
- Dialogue plein écran sur téléphone avec indicateur « Faites défiler », messages et astuces plus larges.
- Finale : la caméra démarre côté mare pour ne plus être masquée par un arbre.
- Son suspendu quand on quitte l’onglet ; choix « Son : non » mémorisé.
- Clavier : touches 1 à 4 en AZERTY, Entrée sur une réponse sélectionnée.
- Double toucher après la fermeture d’un dialogue ignoré ; réponse reposée après rechargement correctement comptée.
- Contrastes renforcés, zones tactiles d’au moins 44 px, « animations réduites » mieux respectées, README à jour.

## 0.6 — 11 novembre 2026
Pour donner envie de rejouer : bouton « Rejouer mes erreurs » (seuls les animaux concernés reposent les questions ratées, la médaille peut monter), objectif vers la médaille suivante avec barre de progression, bouton « Défier mes amis » (WhatsApp ou partage du téléphone, message prêt avec le score et le lien) et record conservé, affiché sur l’écran d’accueil.

## 0.5 — 11 novembre 2026
Grand final selon le score (Parfait, Bravo, Bien joué, Bon début) : baobab qui pousse, feux d’artifice, médailles or, argent, bronze ou Chiot curieux.

## 0.4 — 11 novembre 2026
Écran titre : décor visible avec Roxy, phrase de bénéfice, trois pictogrammes (marcher, suivre la flèche, parler), progression et « Nouvelle partie ».

## 0.3 — 11 novembre 2026
Nouveau principe : se promener et rencontrer 6 animaux qui posent les 12 questions validées (8 minutes maximum). Flèches de guidage (au-dessus de l’animal, au sol, au bord de l’écran). Univers imaginaire, sans nom de lieu réel. Vautour déplacé dans la plaine pour être accessible.

## 0.2 — 11 novembre 2026
Un seul bouton d’action sur téléphone, flèche d’objectif, tutoriel en 3 bulles, survol d’arrivée.

## 0.1 — 11 novembre 2026
Premier prototype jouable : Roxy en voxels, falaise, graines à retrouver au flair, creusage, éléphant, 2 questions. Musique et sons générés par le code.

## Avant : Claude Quest 0.1 à 0.3
Bureau 3D avec quatre animaux, puis six missions et 41 questions. Archivé hors de ce dépôt.
