# 📖 Guide Complet : Mise à Jour des Données NosApki

Ce document explique en détail comment mettre à jour automatiquement le calculateur lorsque de nouveaux monstres, cartes SP, équipements, buffs ou titres sont ajoutés sur [NosApki](https://nosapki.com/fr/calculators/dmg_pve).

---

## ⚡ En Bref (Procédure Rapide)

Pour mettre à jour toutes les données du site en **2 commandes** :

```bash
# 1. Télécharge et extrait automatiquement les nouvelles données de NosApki
npm run update-data

# 2. Recompile l'application pour la production
npm run build
```

Puis redémarrez votre serveur avec `npm start` (ou continuez en mode développement avec `npm run dev:all`).

---

## 🔍 Comment fonctionne la mise à jour automatique ?

Le script de synchronisation est situé dans [scripts/update-data.mjs](file:///home/pierr/Nostale-calculateur-degats/scripts/update-data.mjs).

Quand vous exécutez `npm run update-data`, le script effectue les actions suivantes :
1. **Téléchargement** : Il se connecte à la page `https://nosapki.com/fr/calculators/dmg_pve` et récupère le code HTML complet à jour.
2. **Extraction des monstres** : Met à jour [src/data/monsters.json](file:///home/pierr/Nostale-calculateur-degats/src/data/monsters.json) avec tous les monstres, niveaux et IDs actuels.
3. **Extraction des buffs** : Met à jour [src/data/buffs.json](file:///home/pierr/Nostale-calculateur-degats/src/data/buffs.json) avec les buffs du joueur et les debuffs de monstres.
4. **Extraction des équipements** : Met à jour [src/data/items.json](file:///home/pierr/Nostale-calculateur-degats/src/data/items.json) pour les 18 slots (armes, armures, bijoux, fées, cartes SP, chapeaux, costumes, etc.).
5. **Extraction des compétences** : Met à jour [src/data/skills.json](file:///home/pierr/Nostale-calculateur-degats/src/data/skills.json) et [src/data/skill_upgrades.json](file:///home/pierr/Nostale-calculateur-degats/src/data/skill_upgrades.json).
6. **Extraction des passifs et effets de famille** : Met à jour [src/data/passive_skills.json](file:///home/pierr/Nostale-calculateur-degats/src/data/passive_skills.json) et [src/data/family_effects.json](file:///home/pierr/Nostale-calculateur-degats/src/data/family_effects.json).
7. **Extraction des titres** : Fusionne les nouveaux titres dans [src/data/titles.json](file:///home/pierr/Nostale-calculateur-degats/src/data/titles.json) tout en conservant les descriptions existantes.
8. **Extraction des consommables** : Met à jour [src/data/consumables.json](file:///home/pierr/Nostale-calculateur-degats/src/data/consumables.json).

---

## ✏️ Personnaliser ou ajouter des titres manuellement

Les titres sont enregistrés dans le fichier [src/data/titles.json](file:///home/pierr/Nostale-calculateur-degats/src/data/titles.json).

Chaque titre possède le format suivant :
```json
{
  "id": 13069,
  "name": "Dieu des catacombes",
  "tooltip": "Toutes les attaques augmentent de 10%., Toutes les attaques augmentent de 7 % dans les Catacombes de la Tour céleste."
}
```

* **`id`** : L'ID officiel de l'objet dans Nostale/NosApki (utilisé par l'API pour calculer les dégâts).
* **`name`** : Le nom affiché dans la liste déroulante.
* **`tooltip`** : La description affichée au survol du curseur sur le titre.

### Ajouter un nouveau titre à la main :
1. Ouvrez [src/data/titles.json](file:///home/pierr/Nostale-calculateur-degats/src/data/titles.json).
2. Ajoutez votre titre dans le tableau (de préférence par ordre décroissant d'ID).
3. Enregistrez le fichier.
4. Pour que vos descriptions personnalisées ne soient pas écrasées lors d'un futur `npm run update-data`, vous pouvez également les inscrire dans l'objet `KNOWN_TITLE_INFO` dans [scripts/update-data.mjs](file:///home/pierr/Nostale-calculateur-degats/scripts/update-data.mjs).

---

## 🗂️ Structure des données (`src/data/`)

| Fichier | Contenu |
|---|---|
| `monsters.json` | Liste complète des monstres du jeu avec leurs niveaux et IDs |
| `items.json` | Tous les équipements classés par slot de 0 à 17 (0=arme principale, 1=armure, 12=SP, etc.) |
| `buffs.json` | Buffs pour le joueur et debuffs applicables sur le monstre |
| `skills.json` | Compétences d'attaque par classe et par SP |
| `skill_upgrades.json` | Améliorations de compétences |
| `passive_skills.json` | Compétences passives (attaque, défense, etc.) |
| `family_effects.json` | Effets de famille |
| `titles.json` | Tous les titres actifs et leurs bonus |
| `consumables.json` | Objets consommables Nosmall (médaille d'anniversaire, ordre héroïque) |

---

## ❓ FAQ & Dépannage

### Pourquoi mes nouvelles modifications ne s'affichent pas sur le site ?
* Si vous lancez le site en production (`npm start`), vous devez d'abord recompiler le frontend avec :
  ```bash
  npm run build
  ```
* Si vous êtes en mode développement (`npm run dev:all`), videz le cache de votre navigateur avec `Ctrl + F5` (ou `Cmd + Shift + R` sur Mac).

### Le calcul de dégâts échoue ou retourne une erreur :
* NosApki a parfois des périodes de maintenance ou de limitation de requêtes.
* Assurez-vous que votre serveur Express tourne bien (`npm start` ou `npm run server`) pour relayer les requêtes de calcul via le proxy.
