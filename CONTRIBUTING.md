# Proposer un composant

La vitrine accepte les composants de développeurs indépendants. Chaque composant garde le nom de son auteur sur sa carte et sur sa page.

## Ce qu'il faut fournir

Trois fichiers. Les modèles à copier sont dans [`templates/`](templates/).

| Fichier | Où il va | Rôle |
|---|---|---|
| Le composant | `src/library/<nom>.tsx` | Le code que les utilisateurs copient, tel quel, via le prompt |
| La démo | `src/demos/<nom>.tsx` | Le composant avec un contenu d'exemple, montré dans la vitrine |
| La fiche | une entrée dans `models` de `src/models.tsx` | Titre, auteur, taille de la carte, dépendances… |

`<nom>` est le même pour les trois, en minuscules avec des tirets (`mon-composant`).

## Les règles de la maison

Le site existe pour montrer des interfaces qui n'ont pas l'air générées. Un composant est accepté s'il respecte :

1. **Pas de dégradé violet**, ni de couleurs par défaut d'un framework (indigo de Tailwind, etc.). Une teinte choisie pour le composant.
2. **Une police qui a un dessin**, jamais une police par défaut sans raison.
3. **Un mouvement mesuré** : durées et courbes écrites dans le code. Seulement `transform` et `opacity` pour ce qui bouge.
4. **Rien de caché au repos** : le contenu reste lisible sans JavaScript et sans animation.
5. **Un bloc `prefers-reduced-motion`** qui affiche l'état final sans animation.
6. **Pas de faux contenu** dans la démo : ni chiffres inventés, ni faux avis, ni faux logos.
7. **Toutes les dépendances déclarées** dans `requires` (Tailwind, framer-motion, lucide-react…). Sans `requires`, le composant ne doit importer que React.
8. **Un seul fichier** pour le composant, avec les couleurs, la police et les durées en variables en tête, pour qu'on l'adapte sans toucher au reste.

## Sécurité

Votre code s'exécute dans le navigateur des visiteurs. Il est refusé s'il :

- envoie ou reçoit des données sur le réseau (`fetch`, `XMLHttpRequest`, `WebSocket`…) ;
- exécute du code à partir d'une chaîne (`eval`, `new Function`) ou charge du code à la volée (`import()`) ;
- lit ou écrit les cookies, le `localStorage` ou d'autres données du navigateur ;
- redirige le visiteur, ouvre une page ou injecte un script ;
- demande un accès sensible (presse-papiers, position, caméra, notifications) ;
- appelle une adresse externe autre que Google Fonts, Fontshare, Wikimedia ou Unsplash (polices et images d'exemple).

## Choisir la taille de la carte

La carte doit avoir la taille de ce qu'elle montre : ni grand vide autour d'un petit élément, ni démo écrasée.

| Ce que montre la démo | `span` (colonnes sur 12) | `stageHeight` |
|---|---|---|
| Un petit élément : police, lien, compteur, bouton | 4 | 260 à 320 |
| Un titre, une barre, une carte | 5 à 7 | 320 à 400 |
| Un formulaire, une galerie | 5 à 8 | 560 à 640 |
| Un fond ou une section entière (hero) | 12 | 520 à 640 |

Sur une même rangée, les cartes ont la même hauteur : combinez des largeurs qui font 12 (4 + 4 + 4, 5 + 7, 12).

Si la démo a son propre fond (noir, bleu…), indiquez-le dans `stageColor` : tout le cadre prend cette couleur et la démo va jusqu'aux bords.

## Vérifier avant d'envoyer

Avec le site lancé (`npm run dev`) :

```bash
npm run check-model -- mon-composant
npm run previews -- mon-composant
```

Le premier vérifie le format : fichiers présents, fiche complète, imports déclarés, mouvement réduit. Le second filme la démo et crée sa vidéo d'aperçu dans `public/previews/`.

## Envoyer : une pull request

1. Faites un fork du dépôt et une branche à votre nom de composant.
2. Ajoutez vos trois fichiers et les aperçus générés (`public/previews/<slug>.mp4` et `.jpg`).
3. Ouvrez une pull request et cochez la liste du modèle.

**Ce qui se passe ensuite, automatiquement :** le site est compilé, votre composant est vérifié (format et sécurité) et filmé. La vidéo est jointe à l'exécution, et une version de prévisualisation du site est publiée. Si quelque chose ne va pas, la liste des erreurs s'affiche dans la pull request.

**Puis une relecture humaine**, avant publication : le code finit chez les visiteurs, donc rien n'est publié sans avoir été lu.

## Licence

En proposant un composant, vous confirmez qu'il est votre travail original (ou que vous avez le droit de le redistribuer, source et licence indiquées), et vous acceptez qu'il soit publié sur la vitrine et copié par ses utilisateurs **sous licence MIT**, avec votre nom comme auteur.
