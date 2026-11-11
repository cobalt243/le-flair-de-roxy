# Le Flair de Roxy — prototype 0.3

« Bien utiliser Claude, bloc par bloc ». Zone 1 : la Falaise aux greniers, dans un univers imaginaire (aucun nom de lieu réel dans le jeu).
Concept et création : Jean-Marc Pagé. Projet éducatif indépendant, non affilié à Anthropic.

## Lancer le prototype

Option 1 : ouvrir le lien publié (voir la conversation).

Option 2 : en local, depuis ce dossier :

    python3 -m http.server 8000

puis ouvrir http://localhost:8000. Three.js est chargé depuis cdnjs ; sans connexion, la copie locale `vendor/three.min.js` (r128, licence MIT) prend le relais.

Paramètres d’adresse utiles : `?neuf` (nouvelle partie), `?jour` (bloque le cycle jour-nuit), `?fps` (compteur d’images), `?test` (saute l’écran titre).

## Commandes

| Action | Clavier | Téléphone |
|---|---|---|
| Se déplacer | ZQSD (AZERTY) ou WASD, ou flèches | Joystick à gauche |
| Courir | Maj | Pousser le joystick au bout |
| Sauter | Espace (saut automatique sur une marche d’un bloc) | Bouton Sauter |
| Renifler une piste | F | Bouton Flair |
| Parler, creuser | E | Bouton orange |
| Caméra | Glisser la souris, molette pour le zoom | Glisser l’écran |
| Pause | Échap ou P | Bouton Pause |

## Version 0.3 : rencontrer les animaux

Le joueur promène Roxy et rencontre 6 animaux ; chacun pose 2 des 12 questions validées. Durée visée : 8 minutes maximum (environ 25 s de marche, le reste pour lire et réfléchir).

| Animal | Thème | Questions |
|---|---|---|
| Agame (lézard des rochers) | Connaître Claude | 1, 2 |
| Éléphant | Le bon prompt | 3, 4 |
| Singe patas | Les outils | 5, 6 |
| Calao à bec rouge | Les données | 7, 8 |
| Vautour charognard (sur un rocher de la plaine) | Vérifier | 9, 10 |
| Tortue sillonnée | Le dossier complet | 11, 12 |

Une flèche dorée guide vers l’animal le plus proche ; un seul gros bouton « Parler » sur téléphone. Fête finale (les animaux se rassemblent, un baobab pousse) puis bilan : bonnes réponses du premier coup, temps de jeu, 3 messages à retenir.
Les graines, le flair et le creusage de la version 0.1–0.2 sont retirés (archivés dans le zip 0.2).

## Contenu (versions précédentes)

- Zone de 64 × 64 blocs : falaise de grès en strates, corniche, éboulis, abri creusé, greniers en banco à toit de paille, 2 baobabs, 4 acacias, mare, dune, herbe sèche animée.
- Roxy : modèle voxel d’environ 5 600 cubes visibles (3 500 en mode téléphone), 7 parties animées. Animations : repos, marche, course, saut, reniflement, creusage, assise (après 7 s d’immobilité), couchée (après 16 s), joie.
- Éléphant du Gourma : environ 2 800 cubes, oreilles et trompe animées, se tourne vers Roxy.
- Objectif : retrouver 3 graines dorées (au sol, sur la corniche, dans l’abri à dégager), puis répondre à 2 questions de formation (validées : questions 3 et 12).
- Ambiance : cycle jour-nuit de 5 minutes, ombres, poussière portée par le vent, sons synthétisés (vent, oiseaux, grillons, pas, reniflement, creusage).
- Sauvegarde automatique dans le navigateur (graines, sable creusé, dialogue, réponses, position).

## Architecture

| Fichier | Rôle |
|---|---|
| `js/voxel-sdf.js` | Outils de modélisation : volumes implicites échantillonnés en cubes, texture d’arêtes originale |
| `js/roxy.js` | Modèle de Roxy et animations par pivots |
| `js/animals.js` | Éléphant |
| `js/world.js` | Génération du terrain, maillage avec occlusion ambiante, collisions, creusage |
| `js/audio.js` | Sons synthétisés (Web Audio) |
| `js/questions.js` | Questions de formation utilisées |
| `js/game.js` | Boucle de jeu : physique, caméra, flair, dialogues, jour-nuit, sauvegarde, accès de test |
| `tests/` | Scénarios Playwright (parcours complet, mobile) et captures |

## Statut : prévu, réalisé, testé

| Élément | Statut |
|---|---|
| Terrain, falaise, décor, mare | Réalisé et testé (rendu vérifié par captures) |
| Roxy contrôlable, caméra 3e personne | Réalisé et testé |
| Marche 3,2 blocs/s, course 5 blocs/s, saut d’environ 1,5 bloc, montée automatique d’une marche | Réalisé et testé (simulation à pas fixe) |
| Escalade des éboulis jusqu’à la corniche | Testé |
| Creusage du sable et entrée dans l’abri | Testé |
| Ramassage des 3 graines, dialogue, 2 questions, plantation, écran de fin | Testé (parcours complet automatisé) |
| Sauvegarde et reprise après rechargement | Testé |
| Interface et commandes tactiles (écran 412 px) | Affichage testé ; gestes tactiles réels non testés |
| Fluidité réelle | Non mesurée : le navigateur de test utilise un rendu logiciel (environ 20 images/s), sans valeur pour un vrai appareil |
| Son | Implémenté ; non écouté par un humain |
| Safari iPhone, Android réel | Non testé |
| Reconnaissance de Roxy par des testeurs | À faire en phase 4 |

## Améliorations prévues

1. Tests sur 2 téléphones réels et 5 testeurs (phase 4).
2. Réglage de la caméra dans les espaces étroits (abri).
3. Animations plus riches : interaction nez à nez avec l’éléphant, réaction de surprise.
4. Indicateur à l’écran vers la piste la plus proche.
5. Intégration des 10 autres questions avec de nouveaux animaux (agame, singe patas, calao, vautour).
6. Zone 2 : les abris de la falaise.
7. Relecture culturelle avant toute diffusion large.
