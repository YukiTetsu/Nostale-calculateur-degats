# NosCalc PvE - Guide de Démarrage et d'Arrêt

Ce projet est composé de deux parties qui tournent en même temps :
1. **Le Backend** (`server.js` sous Express) : Gère la connexion avec NosApki et sert d'API de proxy.
2. **Le Frontend** (React + Vite) : L'interface utilisateur ultra-rapide.

---

## 🚀 Comment ALLUMER le site ?

Ouvrez votre terminal dans le dossier du projet (`gemini`) et choisissez l'une des deux méthodes suivantes :

### Option A : Mode Développement (HMR actif - Recommandé pour tester des modifs)
Cette commande lance à la fois le serveur backend et le serveur de développement Vite (avec rechargement automatique en temps réel).
```bash
npm run dev:all
```
* **Accès au site :** Ouvrez votre navigateur sur `http://localhost:5173/`
* *Note : Les modifications que vous apportez au code seront visibles immédiatement sans rafraîchir la page.*

### Option B : Mode Production (Plus rapide et optimisé)
Si vous voulez lancer le site dans sa version finale la plus stable et optimisée :
1. Compilez les fichiers du site (une seule fois ou après chaque modification majeure) :
   ```bash
   npm run build
   ```
2. Démarrez le serveur de production :
   ```bash
   npm start
   ```
* **Accès au site :** Ouvrez votre navigateur sur `http://localhost:3001/`

---

## 🛑 Comment ÉTEINDRE le site ?

Pour arrêter les serveurs et libérer les ports réseau :

1. Allez sur la fenêtre de votre terminal où tourne le projet.
2. Appuyez simultanément sur les touches suivantes de votre clavier :
   * **`Ctrl + C`** (sur Mac et Windows).
3. Le terminal va stopper les processus et vous redonner la main. Vous pouvez alors fermer la fenêtre du terminal en toute sécurité.

---

## ⚠️ En cas de port déjà utilisé (ex: "Port 5173 or 3001 is already in use")

Si vous fermez le terminal sans faire `Ctrl + C`, le site peut continuer à tourner en arrière-plan. Pour forcer l'arrêt :

* **Sur Mac / Linux :**
  ```bash
  # Pour tuer le serveur Express (port 3001)
  kill -9 $(lsof -t -i:3001)

  # Pour tuer le serveur Vite (port 5173)
  kill -9 $(lsof -t -i:5173)
  ```

---

## 🔄 Comment METTRE À JOUR les données depuis NosApki tout seul ?

> 📖 Un guide encore plus détaillé et complet est disponible dans [MISE_A_JOUR.md](file:///home/pierr/Nostale-calculateur-degats/MISE_A_JOUR.md).

Dès que de nouveaux items, SPs, monstres, buffs ou titres sortent sur [NosApki](https://nosapki.com/fr/calculators/dmg_pve), vous pouvez synchroniser tout le site en **une seule commande** !

### 1. Lancer la commande de mise à jour automatique
Dans votre terminal à la racine du projet :
```bash
npm run update-data
```

Cette commande télécharge instantanément la dernière version de la page NosApki et met à jour automatiquement tous les fichiers de `src/data/` :
* `monsters.json` : Nouveaux monstres
* `buffs.json` : Nouveaux buffs & debuffs
* `items.json` : Nouveaux équipements (armes, armures, bijoux, fées, cartes SP, etc.)
* `skills.json` : Nouvelles compétences d'attaque
* `skill_upgrades.json` : Améliorations de compétences
* `passive_skills.json` : Passifs d'attaque/défense
* `family_effects.json` : Nouveaux effets de famille
* `titles.json` : Nouveaux titres
* `consumables.json` : Consommables Nosmall

### 2. Recompiler le site
Après avoir mis à jour les données :
```bash
npm run build
```
Et voilà ! Votre site aura immédiatement tous les nouveaux items et titres disponibles !

### 3. (Optionnel) Modifier ou ajouter des descriptions de titres
Les titres sont stockés dans [src/data/titles.json](file:///home/pierr/Nostale-calculateur-degats/src/data/titles.json). Si vous souhaitez modifier le texte d'un tooltip ou ajuster un nom, vous pouvez l'éditer directement dans ce fichier ou dans le dictionnaire `KNOWN_TITLE_INFO` dans [scripts/update-data.mjs](file:///home/pierr/Nostale-calculateur-degats/scripts/update-data.mjs).
