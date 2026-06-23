import React, { useState, useEffect, useRef } from 'react';
import { 
  Sword, Shield, Sparkles, Save, Trash2, Download, Upload, 
  RefreshCw, Play, Search, X, Info, Zap, Flame, Droplet, Sun, Moon, 
  ChevronRight, Award, FlameKindling, Database, Copy
} from 'lucide-react';
import monstersData from './data/monsters.json';
import buffsData from './data/buffs.json';
import itemsData from './data/items.json';
import skillsData from './data/skills.json';
import skillUpgradesData from './data/skill_upgrades.json';
import familyEffectsData from './data/family_effects.json';
import passiveSkillsData from './data/passive_skills.json';
import './App.css';

// Classes & Elements mappings
const CLASSES = [
  { id: 0, name: "Aventurier", color: "#64748b" },
  { id: 1, name: "Épéiste", color: "#ef4444" },
  { id: 2, name: "Archer", color: "#22c55e" },
  { id: 3, name: "Mage", color: "#3b82f6" },
  { id: 4, name: "Artiste Martial", color: "#eab308" }
];

const GENDERS = [
  { id: 0, name: "Homme" },
  { id: 1, name: "Femme" }
];

const SHELL_OPTIONS = [
  { id: 1, name: "Attaque augmentée", max: 270, type: "flat" },
  { id: 2, name: "Dégâts augmentés %", max: 25, type: "percent" },
  { id: 9, name: "Dégâts plantes %", max: 23, type: "percent" },
  { id: 10, name: "Dégâts animaux %", max: 27, type: "percent" },
  { id: 11, name: "Dégâts monstres %", max: 23, type: "percent" },
  { id: 12, name: "Dégâts morts-vivants %", max: 27, type: "percent" },
  { id: 13, name: "Dégâts kovolts/catsys/ratufus %", max: 27, type: "percent" },
  { id: 14, name: "Dégâts boss de carte %", max: 31, type: "percent" },
  { id: 16, name: "Dégâts critiques %", max: 77, type: "percent" },
  { id: 18, name: "Élément Feu renforcé", max: 302, type: "flat", element: "fire" },
  { id: 19, name: "Élément Eau renforcé", max: 302, type: "flat", element: "water" },
  { id: 20, name: "Élément Lumière renforcé", max: 302, type: "flat", element: "light" },
  { id: 21, name: "Élément Obscurité renforcé", max: 302, type: "flat", element: "shadow" },
  { id: 22, name: "Tous les éléments renforcés", max: 371, type: "flat" },
  { id: 26, name: "Points Attaque SP", max: 19, type: "flat" },
  { id: 27, name: "Points Défense SP", max: 21, type: "flat" },
  { id: 28, name: "Points Élément SP", max: 19, type: "flat" },
  { id: 29, name: "Points HP/MP SP", max: 19, type: "flat" },
  { id: 30, name: "Points Généraux SP", max: 13, type: "flat" }
];

const RUNE_OPTIONS = [
  { id: 21, name: "Toutes les attaques (Arme)", max: 250, group: 0 },
  { id: 39, name: "Dégâts monstres % (Arme)", max: 20, group: 0 },
  { id: 41, name: "Probabilité Critique % (Arme)", max: 10, group: 0 },
  { id: 43, name: "Dégâts Critiques % (Arme)", max: 25, group: 0 },
  { id: 497, name: "Dégâts dragons % (Arme)", max: 20, group: 0 },
  { id: 951, name: "Élément de la fée (Arme)", max: 20, group: 0 },
  { id: 1011, name: "Points Attaque SP (Arme)", max: 6, group: 0 },
  { id: 1015, name: "Points Élément SP (Arme)", max: 6, group: 0 },
  { id: 433, name: "Toutes les attaques % (Arme)", max: 13, group: 0 },
  { id: 1013, name: "Points Défense SP (Armure)", max: 6, group: 1 },
  { id: 1017, name: "Points HP/MP SP (Armure)", max: 6, group: 1 }
];

const FAIRY_OPTIONS = [
  { id: 6, name: "Défense augmentée", max: 130 },
  { id: 7, name: "Dégâts critiques %", max: 25 },
  { id: 14, name: "Élément fée augmenté", max: 25 },
  { id: 15, name: "Attaques augmentées %", max: 13 },
  { id: 17, name: "Attaques augmentées", max: 250 }
];

const TITLES = [
  { id: 0, name: "Aucun Titre", tooltip: "Aucun bonus actif" },
  { id: 13055, name: "Transcendé", tooltip: "Tous les dégâts augmentés de 8%" },
  { id: 13045, name: "Titan PvE", tooltip: "Tous les dégâts augmentés de 8%" },
  { id: 13011, name: "Seigneur des tempêtes", tooltip: "Tous les dégâts augmentés de 5%" },
  { id: 9404, name: "Véritable héros", tooltip: "Tous les dégâts augmentés de 5%" },
  { id: 9307, name: "Héros de NosVille", tooltip: "Toutes les attaques +5%" },
  { id: 9347, name: "Divinité", tooltip: "Tous les dégâts +5%, MP max +1000" },
  { id: 9302, name: "Rebelle", tooltip: "Attaque augmentée +15" },
  { id: 9314, name: "Robin des bois", tooltip: "Vitesse de déplacement +1" },
  { id: 9317, name: "Templier", tooltip: "Attaque physique +20, Vitesse +1" },
  { id: 9320, name: "Sensei", tooltip: "Toutes les attaques +2%" },
  { id: 9359, name: "Ritualiste", tooltip: "Résistance ombre +3" },
  { id: 9374, name: "Sosie", tooltip: "Précision augmentée de 50" },
  { id: 9400, name: "Sauveur des orcs", tooltip: "Tous les dégâts PvE +5%" },
  { id: 9406, name: "Voyageur du temps", tooltip: "Vitesse de déplacement +1" },
  { id: 9482, name: "Tout doux", tooltip: "Toutes les défenses +10" },
  { id: 13040, name: "Roi des catacombes", tooltip: "Dégâts contre les monstres des catacombes +5%" },
  { id: 13051, name: "Sauveur des dimensions", tooltip: "Dégâts critiques augmentés de 5%" },
  { id: 9313, name: "Archer en or", tooltip: "Dégâts à distance +20, Vitesse de déplacement +1" },
  { id: 9315, name: "Maître Archer", tooltip: "Attaque à distance +30, Vitesse +1" },
  { id: 9318, name: "Maître Épéiste", tooltip: "Attaque physique +30, Vitesse +1" },
  { id: 9312, name: "Maître Sorcier", tooltip: "Attaque magique +30, Vitesse +1" },
  { id: 9311, name: "Haut Sorcier", tooltip: "Attaque magique +20, Vitesse +1" },
  { id: 9316, name: "Mercenaire", tooltip: "Toutes les attaques +20, Vitesse +1" },
  { id: 9335, name: "Hercules", tooltip: "Tous les dégâts +50, PV max +1000" },
  { id: 13042, name: "Héritage", tooltip: "Dégâts PvE +5%, Or +5%" },
  { id: 9402, name: "Héros de la Tour céleste", tooltip: "Tous les dégâts en Tour céleste +5%" },
  { id: 9403, name: "Conquérant de la Tour céleste", tooltip: "Tous les dégâts en Tour céleste +10%" },
  { id: 9371, name: "Phénix", tooltip: "Tous les dégâts +3%" },
  { id: 9372, name: "Pourfendeur de dragons", tooltip: "Dégâts contre les dragons +5%" },
  { id: 13012, name: "Maitre des dragons", tooltip: "Dégâts contre les dragons +10%" },
  { id: 9440, name: "Chasseur de dragons", tooltip: "Dégâts contre les dragons +5%" },
  { id: 13046, name: "Légende des catacombes", tooltip: "Dégâts en catacombes +10%" },
  { id: 13038, name: "Ninja fruité", tooltip: "Dégâts critiques +5%, Or +5%" },
  { id: 13017, name: "Ombre nocturne", tooltip: "Vitesse +1, Dégâts critiques +5%" },
  { id: 9481, name: "Extermite", tooltip: "Dégâts critiques +10%" },
  { id: 9438, name: "Faburlesque", tooltip: "Tous les dégâts +3%" },
  { id: 9300, name: "Aventurier", tooltip: "Vitesse +1" },
  { id: 9319, name: "Ceinture noire", tooltip: "Défense +25, Vitesse de déplacement +1" },
  { id: 9306, name: "Destructeur", tooltip: "Probabilité critique +2%" },
  { id: 9346, name: "Héros rayonnant", tooltip: "Probabilité critique +3%" },
  { id: 9367, name: "Maître BBQ", tooltip: "Dégâts critiques +5%" },
  { id: 9304, name: "Pacificateur", tooltip: "Esquive +2%, Vitesse +1" },
  { id: 9362, name: "Pépite", tooltip: "Or +5%" }
];

const CONSUMABLES = [
  { id: 5655, name: "Médaille du 18e anniversaire", icon: "7495" },
  { id: 13306, name: "Ordre héroïque", icon: "7243" }
];

// Specialist points progressive cost arrays up to 120
const ATTACK_COSTS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 31, 34, 37, 40, 43, 46, 49, 52, 55, 58, 61, 64, 67, 70, 73, 76, 79, 82, 85, 88, 92, 96, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 140, 144, 148, 152, 156, 160, 164, 168, 173, 178, 183, 188, 193, 198, 203, 208, 213, 218, 223, 228, 233, 238, 239, 243, 248, 253, 258, 263, 268, 274, 280, 286, 292, 298, 304, 310, 316, 322, 328, 334, 341, 348, 355, 362, 369, 376, 383, 391, 400, 410, 413, 416, 419, 422, 425, 429, 433, 437, 441, 445, 449, 453, 457, 461, 465, 469, 473, 477, 481, 486];

const ELEMENT_COSTS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 43, 46, 49, 52, 55, 58, 61, 64, 67, 70, 74, 78, 82, 86, 90, 94, 98, 102, 106, 110, 115, 120, 125, 130, 135, 140, 145, 150, 155, 160, 165, 170, 175, 180, 185, 190, 195, 200, 205, 210, 216, 222, 228, 234, 240, 246, 252, 258, 264, 270, 277, 284, 291, 298, 305, 312, 319, 326, 333, 340, 347, 354, 361, 368, 375, 382, 389, 396, 403, 410, 413, 416, 419, 422, 425, 429, 433, 437, 441, 445, 449, 453, 457, 461, 465, 469, 473, 477, 481, 486];

// Smart presets to test for PvE damage optimization (defined as maximum target ratios)
const PRESET_TARGETS = [
  { name: "Équilibré standard (1:1)", att: 120, ele: 120 },
  { name: "Orienté Attaque (9:7)", att: 120, ele: 93 },
  { name: "Orienté Élément (7:9)", att: 93, ele: 120 },
  { name: "Fort Attaque / Moyen Élément (10:6)", att: 120, ele: 72 },
  { name: "Moyen Attaque / Fort Élément (6:10)", att: 72, ele: 120 },
  { name: "Très fort Attaque / Faible Élément (11:4)", att: 120, ele: 43 },
  { name: "Faible Attaque / Très fort Élément (4:11)", att: 43, ele: 120 },
  { name: "Maximum Attaque (12:3)", att: 120, ele: 30 },
  { name: "Maximum Élément (3:12)", att: 30, ele: 120 }
];

// Helper to compute SL values from main/sec weapon shells
const getSLValues = (data) => {
  const w0Att = data.shell_0?.[26] || 0;
  const w0Def = data.shell_0?.[27] || 0;
  const w0Ele = data.shell_0?.[28] || 0;
  const w0Hp = data.shell_0?.[29] || 0;
  const w0Gen = data.shell_0?.[30] || 0;

  const w5Att = data.shell_5?.[26] || 0;
  const w5Def = data.shell_5?.[27] || 0;
  const w5Ele = data.shell_5?.[28] || 0;
  const w5Hp = data.shell_5?.[29] || 0;
  const w5Gen = data.shell_5?.[30] || 0;

  const slAttack = Math.max(w0Att, w5Att);
  const slDefense = Math.max(w0Def, w5Def);
  const slElement = Math.max(w0Ele, w5Ele);
  const slHp = Math.max(w0Hp, w5Hp);
  const slGeneral = Math.max(w0Gen, w5Gen);

  // Weapon runes (Attack is 1011, Element is 1015)
  const runeAtt = data.rune_0?.[1011] || 0;
  const runeEle = data.rune_0?.[1015] || 0;

  // Armor runes (Def is 1013, HP/MP is 1017)
  const armorDef = data.rune_1?.[1013] || 0;
  const armorHp = data.rune_1?.[1017] || 0;

  return {
    attack: slAttack + slGeneral + runeAtt,
    defense: slDefense + slGeneral + armorDef,
    element: slElement + slGeneral + runeEle,
    hpmp: slHp + slGeneral + armorHp
  };
};

// Find the best scaled-down preset that fits the 486 points limit
const findBestScaledPreset = (targetAtt, targetEle, slAtt, slEle) => {
  if (targetAtt <= slAtt && targetEle <= slEle) {
    return { baseAtt: 0, baseEle: 0, totalAtt: slAtt, totalEle: slEle, cost: 0 };
  }

  for (let s = 200; s >= 0; s--) {
    const scale = s / 200;
    const scaledAtt = Math.max(0, Math.round(targetAtt * scale));
    const scaledEle = Math.max(0, Math.round(targetEle * scale));
    
    // Base points cannot exceed 120 - SL, and must be at least 0
    const baseAtt = Math.max(0, Math.min(120 - slAtt, scaledAtt - slAtt));
    const baseEle = Math.max(0, Math.min(120 - slEle, scaledEle - slEle));
    
    const costAtt = ATTACK_COSTS[baseAtt] || 0;
    const costEle = ELEMENT_COSTS[baseEle] || 0;
    const totalCost = costAtt + costEle;
    
    if (totalCost <= 486) {
      return {
        baseAtt,
        baseEle,
        totalAtt: baseAtt + slAtt,
        totalEle: baseEle + slEle,
        cost: totalCost
      };
    }
  }
  return { baseAtt: 0, baseEle: 0, totalAtt: slAtt, totalEle: slEle, cost: 0 };
};

const SLOT_INFOS = {
  0: { name: "Arme Principale (D)", iconType: "weapon", placeholder: "⚔️" },
  5: { name: "Arme Secondaire (G)", iconType: "weapon-sec", placeholder: "🗡️" },
  1: { name: "Armure", iconType: "armor", placeholder: "🛡️" },
  2: { name: "Chapeau", iconType: "hat", placeholder: "👒" },
  9: { name: "Masque / Fantaisie", iconType: "mask", placeholder: "🎭" },
  3: { name: "Gants (Rési)", iconType: "gloves", placeholder: "🧤" },
  4: { name: "Chaussures (Rési)", iconType: "shoes", placeholder: "🥾" },
  6: { name: "Collier", iconType: "necklace", placeholder: "📿" },
  7: { name: "Anneau", iconType: "ring", placeholder: "💍" },
  8: { name: "Bracelet", iconType: "bracelet", placeholder: "💎" },
  10: { name: "Fée", iconType: "fairy", placeholder: "🧚" },
  11: { name: "Amulette", iconType: "amulet", placeholder: "🧿" },
  12: { name: "Spécialiste (SP)", iconType: "specialist", placeholder: "🃏" },
  13: { name: "Costume Corps", iconType: "costume-body", placeholder: "🧥" },
  14: { name: "Costume Chapeau", iconType: "costume-hat", placeholder: "👒" },
  15: { name: "Apparence Arme", iconType: "weapon-skin", placeholder: "✨" },
  16: { name: "Ailes de Costume", iconType: "wings", placeholder: "🪶" },
  17: { name: "Mini-familier", iconType: "minipet", placeholder: "🐾" }
};

// Initial form state definition
const INITIAL_STATE = {
  level: 99,
  class: 1, // Swordsman
  gender: 0, // Male
  distance: 3,
  monster_id: 333, // Default monster
  
  // Weapon stats (0 = main weapon, 5 = secondary weapon)
  'weapon_plus[0]': 10,
  'weapon_attack[0][min]': '',
  'weapon_attack[0][max]': '',
  
  'weapon_plus[5]': 0,
  'weapon_attack[5][min]': '',
  'weapon_attack[5][max]': '',
  
  'armor_defense[2]': '', // Armor base defense

  // Equipments slot 0 to 17 map
  equipments: {
    0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0,
    10: 0, 11: 0, 12: 0, 13: 0, 14: 0, 15: 0, 16: 0, 17: 0
  },

  // Active skill & upgrades
  skill: 0,
  skill_upgrades: {
    0: 0,
    1: 0,
    2: 0
  },

  // Family effects map (groupId -> itemId)
  family_effects: {},

  // SP card points
  'specialist_points[1]': 100, // Attack
  'specialist_points[2]': 0,   // Defense
  'specialist_points[3]': 0,   // Element
  'specialist_points[4]': 0,   // HP/MP
  
  'specialist_perfect_points[1]': 0,
  'specialist_perfect_points[2]': 0,
  'specialist_perfect_points[3]': 0,
  'specialist_perfect_points[4]': 0,

  // Fairy
  fairy_percent: 50,
  'fairy_option[6]': 0,
  'fairy_option[7]': 0,
  'fairy_option[14]': 0,
  'fairy_option[15]': 0,
  'fairy_option[17]': 0,
  
  // Custom objects inside form data (flat mapping key/val)
  titles: 0,
  
  // Buff lists mappings
  buffs: {},
  monster_buffs: {},
  nosmall_consumable_item: {},
  
  // Options for Shells & Runes (default to 0)
  shell_0: {}, // main weapon shells
  shell_5: {}, // secondary weapon shells
  rune_0: {},  // main weapon runes
  rune_1: {},  // armor runes
  passive_skill: {}, // selected passive skills (map id to level)
};

// Fill empty shell/rune options in initial state
SHELL_OPTIONS.forEach(opt => {
  INITIAL_STATE.shell_0[opt.id] = 0;
  INITIAL_STATE.shell_5[opt.id] = 0;
});
RUNE_OPTIONS.forEach(opt => {
  if (opt.group === 0) INITIAL_STATE.rune_0[opt.id] = 0;
  if (opt.group === 1) INITIAL_STATE.rune_1[opt.id] = 0;
});
passiveSkillsData.forEach(group => {
  INITIAL_STATE.passive_skill[group.groupId] = 0;
});

const getPassiveGroupName = (group) => {
  const firstItemName = group.items[0].name;
  return firstItemName
    .replace(/\[(Débutant|Intermédiaire|Avancé)\]\s*/g, '')
    .replace(/\s*\(\d+\)/g, '')
    .replace(/\s+1$/g, '')
    .trim();
};

const getPassiveTooltip = (groupId, level) => {
  switch(groupId) {
    case 0:
      if (level === 3) return "Augmente toutes les attaques de 10.";
      if (level === 12) return "Augmente toutes les attaques de 30.";
      if (level === 30) return "Augmente toutes les attaques de 100.";
      return "";
    case 1:
      if (level === 3) return "Augmente la vitesse de déplacement de 1.";
      if (level === 12) return "Augmente la vitesse de déplacement de 2.";
      if (level === 30) return "Augmente la vitesse de déplacement de 3.";
      return "";
    case 2:
      if (level === 4) return "Augmente les MP max de 200.";
      if (level === 15) return "Augmente les MP max de 600.";
      if (level === 35) return "Augmente les MP max de 1500.";
      return "";
    case 6:
      if (level === 2) return "Augmente les dégâts infligés aux monstres (PvE) de 20.";
      if (level === 6) return "Augmente les dégâts infligés aux monstres (PvE) de 50.";
      if (level === 20) return "Augmente les dégâts infligés aux monstres (PvE) de 100.";
      return "";
    case 7:
      if (level === 3) return "Augmente toutes les défenses de 10.";
      if (level === 8) return "Augmente toutes les défenses de 30.";
      if (level === 20) return "Augmente toutes les défenses de 100.";
      return "";
    case 21:
      if (level === 1) return "Augmente toutes les défenses de 80.";
      if (level === 2) return "Augmente toutes les défenses de 100.";
      return "";
    case 22:
      if (level === 1) return "Augmente toutes les défenses de 80.";
      if (level === 2) return "Augmente toutes les défenses de 100.";
      return "";
    case 23:
      if (level === 1) return "Augmente toutes les défenses de 80.";
      if (level === 2) return "Augmente toutes les défenses de 100.";
      return "";
    case 26:
      if (level === 1) return "Augmente la défense de 30.";
      if (level === 2) return "Augmente la défense de 50.";
      return "";
    case 27:
      if (level === 1) return "Augmente toutes les attaques de 30.";
      if (level === 2) return "Augmente toutes les attaques de 50.";
      return "";
    case 32:
      if (level === 1) return "Augmente la précision de 120.";
      if (level === 2) return "Augmente la précision de 150.";
      if (level === 3) return "Augmente la précision de 200.";
      if (level === 4) return "Augmente la précision de 276.";
      return "";
    case 33:
      if (level === 1) return "Augmente l'attaque magique de 120.";
      if (level === 2) return "Augmente l'attaque magique de 150.";
      if (level === 3) return "Augmente l'attaque magique de 220.";
      if (level === 4) return "Augmente l'attaque magique de 276.";
      return "";
    case 34:
      if (level === 1) return "Augmente l'attaque physique de 120.";
      if (level === 2) return "Augmente l'attaque physique de 150.";
      if (level === 3) return "Augmente l'attaque physique de 200.";
      if (level === 4) return "Augmente l'attaque physique de 276.";
      return "";
    case 36:
      if (level === 1) return "Augmente la compétence de pêche de 50.";
      return "";
    case 37:
      if (level === 1) return "Augmente la compétence de cuisine de 30.";
      if (level === 2) return "Augmente la compétence de cuisine de 50.";
      if (level === 3) return "Augmente la compétence de cuisine de 100.";
      return "";
    case 38:
      if (level === 1) return "Augmente l'attaque/défense du familier de 25.";
      if (level === 2) return "Augmente l'attaque/défense du familier de 50.";
      if (level === 3) return "Augmente l'attaque/défense du familier de 100.";
      return "";
    case 41:
      if (level === 1) return "Augmente les dégâts infligés aux monstres (PvE) de 100.";
      return "";
    case 42:
      if (level === 1) return "Augmente la collecte de fruits de 30.";
      if (level === 2) return "Augmente la collecte de fruits de 50.";
      return "";
    case 43:
      if (level === 1) return "Augmente les dégâts infligés dans les catacombes de 50.";
      return "";
    case 44:
      if (level === 1) return "Augmente l'élément de la fée de 5.";
      return "";
    default:
      return "";
  }
};

const getFamilyTooltip = (groupId, level) => {
  if (level === -1 || level === undefined) return "Aucun effet sélectionné.";
  const lvlNum = level + 1;
  switch(groupId) {
    case 0:
      return `Augmente la force d'attaque et de défense de ${lvlNum}%.`;
    case 14:
      return `Augmente l'élément de la fée de 1%.`;
    case 22:
      return `Augmente toutes les défenses de 1%.`;
    case 28:
      return `Augmente les dégâts contre les démons de 1%.`;
    case 29:
      return `Augmente les dégâts contre les anges de 1%.`;
    case 30:
      return `Augmente la probabilité de coups critiques ou l'attaque magique de 1%.`;
    case 31:
      return `Augmente les dégâts critiques ou l'attaque magique de 1%.`;
    case 32:
      return `Augmente l'élément de la fée équipée de 1%.`;
    case 33:
      return `Réduit la résistance élémentaire de l'adversaire de 1%.`;
    case 35:
    case 36:
      return `Augmente les dégâts contre les dragons de haut niveau de 1%.`;
    case 37:
      return `Augmente toutes les attaques de 1%.`;
    case 43:
      return `Augmente l'attaque de l'éclaireur de 1%.`;
    default:
      return "";
  }
};

const getPassiveLevel = (group, id) => {
  if (!id) return 0;
  if (group.items.length === 1 && group.items[0].level === 0) {
    return id === group.items[0].id ? 1 : 0;
  }
  const item = group.items.find(it => it.id === id);
  return item ? item.level : 0;
};

const getPassiveOptions = (group) => {
  if (group.items.length === 1 && group.items[0].level === 0) {
    const singleItem = group.items[0];
    return (
      <>
        <option value={0}>Aucun</option>
        <option value={singleItem.id} title={getPassiveTooltip(group.groupId, 1)}>Actif</option>
      </>
    );
  }
  
  return (
    <>
      <option value={0}>Aucun</option>
      {group.items.map(it => (
        <option key={it.id} value={it.id} title={getPassiveTooltip(group.groupId, it.level)}>
          Lvl {it.level}
        </option>
      ))}
    </>
  );
};

function App() {
  const [formData, setFormData] = useState(() => {
    const savedForm = localStorage.getItem('nostale_calc_current_form');
    if (savedForm) {
      try {
        return JSON.parse(savedForm);
      } catch (e) {
        console.error("Failed to parse saved current form:", e);
      }
    }
    return INITIAL_STATE;
  });
  const [monsterSearch, setMonsterSearch] = useState('');
  const [selectedMonster, setSelectedMonster] = useState(null);
  const [showMonsterSelect, setShowMonsterSelect] = useState(false);
  const [activeTab, setActiveTab] = useState('attacker');
  const [calculationResult, setCalculationResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Saved builds management
  const [savedBuilds, setSavedBuilds] = useState([]);
  const [newBuildName, setNewBuildName] = useState('');
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [compareBuild, setCompareBuild] = useState(null);
  const [compareResult, setCompareResult] = useState('');

  // Buff dialogs toggles
  const [showBuffSelect, setShowBuffSelect] = useState(null); // 'player' or 'monster'
  const [buffSearch, setBuffSearch] = useState('');

  // Equipment selection modal states
  const [showEquipSelect, setShowEquipSelect] = useState(null); // slot ID (0-17) or null
  const [equipSearch, setEquipSearch] = useState('');

  // Optimizer modal states
  const [showOptimizerModal, setShowOptimizerModal] = useState(false);
  const [optimizing, setOptimizing] = useState(false);
  const [optimizeProgress, setOptimizeProgress] = useState(0);
  const [optimizationResults, setOptimizationResults] = useState([]);

  // Sequence optimizer simulation
  const runOptimization = async () => {
    setOptimizing(true);
    setOptimizeProgress(0);
    const results = [];
    const sls = getSLValues(formData);
    
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    
    for (let i = 0; i < PRESET_TARGETS.length; i++) {
      if (i > 0) await sleep(600); // Wait 600ms to prevent rate limiting (429)
      setOptimizeProgress(i + 1);
      const preset = PRESET_TARGETS[i];
      const distribution = findBestScaledPreset(preset.att, preset.ele, sls.attack, sls.element);
      
      try {
        const payload = {
          level: formData.level,
          class: formData.class,
          gender: formData.gender,
          distance: formData.distance,
          monster_id: formData.monster_id,
          'weapon_plus[0]': formData['weapon_plus[0]'],
          'weapon_attack[0][min]': formData['weapon_attack[0][min]'],
          'weapon_attack[0][max]': formData['weapon_attack[0][max]'],
          'weapon_plus[5]': formData['weapon_plus[5]'],
          'weapon_attack[5][min]': formData['weapon_attack[5][min]'],
          'weapon_attack[5][max]': formData['weapon_attack[5][max]'],
          'armor_defense[2]': formData['armor_defense[2]'],
          'specialist_points[1]': distribution.baseAtt,
          'specialist_points[2]': 0, // Reset Defense for pure dmg test
          'specialist_points[3]': distribution.baseEle,
          'specialist_points[4]': 0, // Reset HP/MP for pure dmg test
          'specialist_perfect_points[1]': formData['specialist_perfect_points[1]'],
          'specialist_perfect_points[2]': formData['specialist_perfect_points[2]'],
          'specialist_perfect_points[3]': formData['specialist_perfect_points[3]'],
          'specialist_perfect_points[4]': formData['specialist_perfect_points[4]'],
          fairy_percent: formData.fairy_percent,
          'fairy_option[6]': formData['fairy_option[6]'],
          'fairy_option[7]': formData['fairy_option[7]'],
          'fairy_option[14]': formData['fairy_option[14]'],
          'fairy_option[15]': formData['fairy_option[15]'],
          'fairy_option[17]': formData['fairy_option[17]'],
          titles: formData.titles,
        };

        if (formData.equipments) {
          Object.entries(formData.equipments).forEach(([slot, itemId]) => {
            payload[`equipments[${slot}]`] = itemId || 0;
          });
        }

        payload['skill'] = formData.skill || 0;
        if (formData.skill_upgrades) {
          payload['skill_upgrade[0]'] = formData.skill_upgrades[0] || 0;
          payload['skill_upgrade[1]'] = formData.skill_upgrades[1] || 0;
          payload['skill_upgrade[2]'] = formData.skill_upgrades[2] || 0;
        }

        if (formData.family_effects) {
          Object.entries(formData.family_effects).forEach(([groupId, lvl]) => {
            if (lvl !== undefined && lvl !== -1) {
              payload[`family_effects[${groupId}]`] = lvl;
            }
          });
        }

        Object.entries(formData.shell_0).forEach(([key, val]) => {
          if (val > 0) payload[`weapon_shell_option[0][${key}]`] = val;
        });
        Object.entries(formData.shell_5).forEach(([key, val]) => {
          if (val > 0) payload[`weapon_shell_option[5][${key}]`] = val;
        });

        Object.entries(formData.rune_0).forEach(([key, val]) => {
          if (val > 0) payload[`rune_option[0][${key}]`] = val;
        });
        Object.entries(formData.rune_1).forEach(([key, val]) => {
          if (val > 0) payload[`rune_option[1][${key}]`] = val;
        });

        Object.entries(formData.passive_skill).forEach(([key, val]) => {
          if (val > 0) payload[`passive_skill[${key}]`] = val;
        });

        Object.entries(formData.buffs).forEach(([key, val]) => {
          if (val.active) {
            payload[`buffs[${val.group}][id]`] = val.id;
            payload[`buffs[${val.group}][level]`] = val.level || 1;
          }
        });

        Object.entries(formData.monster_buffs).forEach(([key, val]) => {
          if (val.active) {
            payload[`monster_buffs[${val.group}][id]`] = val.id;
            payload[`monster_buffs[${val.group}][level]`] = val.level || 1;
          }
        });

        Object.entries(formData.nosmall_consumable_item).forEach(([key, active]) => {
          if (active) payload[`nosmall_consumable_item[${key}]`] = key;
        });

        const response = await fetch('/api/calculate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        if (response.ok) {
          const resData = await response.json();
          if (resData.status === 'ok') {
            const html = resData.elements.damages;
            
            // Extract the highest damage value to rank
            const cleanHtml = html.replace(/<[^>]*>/g, ' ');
            const numbers = [...cleanHtml.matchAll(/\b\d[\d\s]*\b/g)]
              .map(m => parseInt(m[0].replace(/\s/g, '')))
              .filter(n => !isNaN(n) && n > 100);
            
            const maxDmg = numbers.length > 0 ? Math.max(...numbers) : 0;

            results.push({
              presetName: preset.name,
              targetAtt: preset.att,
              targetEle: preset.ele,
              distribution,
              html,
              maxDmg
            });
          }
        }
      } catch (e) {
        console.error("Error simulating preset:", e);
      }
    }

    results.sort((a, b) => b.maxDmg - a.maxDmg);
    setOptimizationResults(results);
    setOptimizing(false);
  };

  const getSpentSPPoints = (data = formData) => {
    const pts1 = parseInt(data['specialist_points[1]']) || 0;
    const pts2 = parseInt(data['specialist_points[2]']) || 0;
    const pts3 = parseInt(data['specialist_points[3]']) || 0;
    const pts4 = parseInt(data['specialist_points[4]']) || 0;

    const c1 = ATTACK_COSTS[pts1] || 0;
    const c2 = ATTACK_COSTS[pts2] || 0;
    const c3 = ELEMENT_COSTS[pts3] || 0;
    const c4 = ATTACK_COSTS[pts4] || 0;

    return c1 + c2 + c3 + c4;
  };

  const debouncedCalculateTimer = useRef(null);

  // Load saved builds on start
  useEffect(() => {
    const loaded = localStorage.getItem('nostale_calc_builds');
    if (loaded) {
      try {
        setSavedBuilds(JSON.parse(loaded));
      } catch (e) {
        console.error("Failed to parse saved builds:", e);
      }
    }
    
    // Find initial default monster
    const initialMonster = monstersData.find(m => m.id === formData.monster_id);
    if (initialMonster) setSelectedMonster(initialMonster);
  }, []);

  // Sync saved builds to localstorage
  const saveBuildsToLocalStorage = (builds) => {
    localStorage.setItem('nostale_calc_builds', JSON.stringify(builds));
    setSavedBuilds(builds);
  };

  // Perform calculations
  const calculateDamage = async (data = formData, isComparison = false) => {
    setLoading(true);
    setError(null);
    try {
      // Build clean JSON body mirroring NosApki structure
      const payload = {
        level: data.level,
        class: data.class,
        gender: data.gender,
        distance: data.distance,
        monster_id: data.monster_id,
        'weapon_plus[0]': data['weapon_plus[0]'],
        'weapon_attack[0][min]': data['weapon_attack[0][min]'],
        'weapon_attack[0][max]': data['weapon_attack[0][max]'],
        'weapon_plus[5]': data['weapon_plus[5]'],
        'weapon_attack[5][min]': data['weapon_attack[5][min]'],
        'weapon_attack[5][max]': data['weapon_attack[5][max]'],
        'armor_defense[2]': data['armor_defense[2]'],
        'specialist_points[1]': data['specialist_points[1]'],
        'specialist_points[2]': data['specialist_points[2]'],
        'specialist_points[3]': data['specialist_points[3]'],
        'specialist_points[4]': data['specialist_points[4]'],
        'specialist_perfect_points[1]': data['specialist_perfect_points[1]'],
        'specialist_perfect_points[2]': data['specialist_perfect_points[2]'],
        'specialist_perfect_points[3]': data['specialist_perfect_points[3]'],
        'specialist_perfect_points[4]': data['specialist_perfect_points[4]'],
        fairy_percent: data.fairy_percent,
        'fairy_option[6]': data['fairy_option[6]'],
        'fairy_option[7]': data['fairy_option[7]'],
        'fairy_option[14]': data['fairy_option[14]'],
        'fairy_option[15]': data['fairy_option[15]'],
        'fairy_option[17]': data['fairy_option[17]'],
        titles: data.titles,
      };

      // Add all equipments
      if (data.equipments) {
        Object.entries(data.equipments).forEach(([slot, itemId]) => {
          payload[`equipments[${slot}]`] = itemId || 0;
        });
      }

      // Add active skill and upgrades
      payload['skill'] = data.skill || 0;
      if (data.skill_upgrades) {
        payload['skill_upgrade[0]'] = data.skill_upgrades[0] || 0;
        payload['skill_upgrade[1]'] = data.skill_upgrades[1] || 0;
        payload['skill_upgrade[2]'] = data.skill_upgrades[2] || 0;
      }

      // Add family effects
      if (data.family_effects) {
        Object.entries(data.family_effects).forEach(([groupId, level]) => {
          if (level !== undefined && level !== -1) {
            payload[`family_effects[${groupId}]`] = level;
          }
        });
      }

      // Add Weapon Shell options
      Object.entries(data.shell_0).forEach(([key, val]) => {
        if (val > 0) payload[`weapon_shell_option[0][${key}]`] = val;
      });
      Object.entries(data.shell_5).forEach(([key, val]) => {
        if (val > 0) payload[`weapon_shell_option[5][${key}]`] = val;
      });

      // Add Runes options
      Object.entries(data.rune_0).forEach(([key, val]) => {
        if (val > 0) payload[`rune_option[0][${key}]`] = val;
      });
      Object.entries(data.rune_1).forEach(([key, val]) => {
        if (val > 0) payload[`rune_option[1][${key}]`] = val;
      });

      // Add Passive Skills
      Object.entries(data.passive_skill).forEach(([key, val]) => {
        if (val > 0) payload[`passive_skill[${key}]`] = val;
      });

      // Add active player buffs
      Object.entries(data.buffs).forEach(([key, val]) => {
        if (val.active) {
          payload[`buffs[${val.group}][id]`] = val.id;
          payload[`buffs[${val.group}][level]`] = val.level || 1;
        }
      });

      // Add active monster buffs (debuffs)
      Object.entries(data.monster_buffs).forEach(([key, val]) => {
        if (val.active) {
          payload[`monster_buffs[${val.group}][id]`] = val.id;
          payload[`monster_buffs[${val.group}][level]`] = val.level || 1;
        }
      });

      // Add consumables
      Object.entries(data.nosmall_consumable_item).forEach(([key, active]) => {
        if (active) payload[`nosmall_consumable_item[${key}]`] = key;
      });

      const response = await fetch('/api/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Calculation server returned status ${response.status}`);
      }

      const resData = await response.json();
      if (resData.status === 'ok') {
        if (isComparison) {
          setCompareResult(resData.elements.damages);
        } else {
          setCalculationResult(resData.elements.damages);
        }
      } else {
        throw new Error(resData.message || "Failed to calculate damage details.");
      }
    } catch (e) {
      console.error(e);
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  // Debounced execution when inputs change
  useEffect(() => {
    if (debouncedCalculateTimer.current) clearTimeout(debouncedCalculateTimer.current);
    
    debouncedCalculateTimer.current = setTimeout(() => {
      calculateDamage(formData);
    }, 600);

    return () => clearTimeout(debouncedCalculateTimer.current);
  }, [formData]);

  // Sync current form state to localStorage on change
  useEffect(() => {
    localStorage.setItem('nostale_calc_current_form', JSON.stringify(formData));
  }, [formData]);

  // Recalculate comparison build when target changes
  useEffect(() => {
    if (compareBuild) {
      calculateDamage({
        ...compareBuild.formData,
        monster_id: formData.monster_id // keep current target monster
      }, true);
    }
  }, [compareBuild, formData.monster_id]);

  // Simple state update helper
  const updateField = (field, val) => {
    setFormData(prev => ({
      ...prev,
      [field]: val
    }));
  };

  const handleClassChange = (newClassId) => {
    setFormData(prev => {
      const nextEquipments = { ...prev.equipments };
      const userClassBit = 1 << newClassId;
      
      // Helper to check compatibility
      const isCompatible = (slot) => {
        const itemId = nextEquipments[slot];
        if (!itemId) return true;
        const item = itemsData[slot]?.find(i => i.id === itemId);
        if (!item) return true;
        if (item.class === null || item.class === undefined) return true;
        return (item.class & userClassBit) !== 0;
      };
      
      // Clear incompatible slots
      [0, 1, 5, 12].forEach(slot => {
        if (!isCompatible(slot)) {
          nextEquipments[slot] = 0;
        }
      });
      
      // Reset active skill if incompatible
      let nextSkill = prev.skill;
      let nextSkillUpgrades = { ...prev.skill_upgrades };
      
      const equippedSpId = nextEquipments[12];
      const activeCard = equippedSpId ? itemsData["12"]?.find(i => i.id === equippedSpId) : null;
      const spIndex = activeCard ? activeCard.sp : -1;
      
      const currentSkill = skillsData.find(s => s.id === prev.skill);
      const isSkillCompatible = currentSkill && (
        (spIndex !== -1 && currentSkill.sp === spIndex) ||
        (spIndex === -1 && currentSkill.sp === -1 && (currentSkill.class === -1 || (currentSkill.class & userClassBit) !== 0))
      );
      
      if (!isSkillCompatible) {
        nextSkill = 0;
        nextSkillUpgrades = { 0: 0, 1: 0, 2: 0 };
      }
      
      return {
        ...prev,
        class: newClassId,
        equipments: nextEquipments,
        skill: nextSkill,
        skill_upgrades: nextSkillUpgrades
      };
    });
  };

  const handleEquipItem = (slot, item) => {
    setFormData(prev => {
      const nextEquipments = {
        ...prev.equipments,
        [slot]: item ? item.id : 0
      };
      
      let nextSkill = prev.skill;
      let nextSkillUpgrades = { ...prev.skill_upgrades };
      
      // If we are modifying slot 12 (Specialist)
      if (slot === 12) {
        const spIndex = item ? item.sp : -1;
        const userClassBit = 1 << prev.class;
        const currentSkill = skillsData.find(s => s.id === prev.skill);
        const isSkillCompatible = currentSkill && (
          (spIndex !== -1 && currentSkill.sp === spIndex) ||
          (spIndex === -1 && currentSkill.sp === -1 && (currentSkill.class === -1 || (currentSkill.class & userClassBit) !== 0))
        );
        
        if (!isSkillCompatible) {
          nextSkill = 0;
          nextSkillUpgrades = { 0: 0, 1: 0, 2: 0 };
        }
      }
      
      return {
        ...prev,
        equipments: nextEquipments,
        skill: nextSkill,
        skill_upgrades: nextSkillUpgrades
      };
    });
  };

  const updateShellField = (type, key, val) => {
    setFormData(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [key]: parseInt(val) || 0
      }
    }));
  };

  // Select monster details
  const selectMonster = (monster) => {
    setSelectedMonster(monster);
    updateField('monster_id', monster.id);
    setShowMonsterSelect(false);
  };

  // Buff / Debuff toggle
  const toggleBuff = (type, buff, level = 1) => {
    setFormData(prev => {
      const activeMap = { ...prev[type] };
      if (activeMap[buff.group] && activeMap[buff.group].id === buff.id) {
        // disable it
        delete activeMap[buff.group];
      } else {
        // activate it
        activeMap[buff.group] = {
          id: buff.id,
          group: buff.group,
          text: buff.text,
          icon: buff.icon,
          active: true,
          level: level
        };
      }
      return {
        ...prev,
        [type]: activeMap
      };
    });
  };

  // Consumable toggle
  const toggleConsumable = (id) => {
    setFormData(prev => ({
      ...prev,
      nosmall_consumable_item: {
        ...prev.nosmall_consumable_item,
        [id]: !prev.nosmall_consumable_item[id]
      }
    }));
  };



  // Saved builds operations
  const handleSaveBuild = () => {
    if (!newBuildName.trim()) return;
    
    const activeClass = CLASSES.find(c => c.id === formData.class);
    
    const newBuild = {
      id: Date.now().toString(),
      name: newBuildName,
      class: activeClass ? activeClass.name : "Inconnu",
      classColor: activeClass ? activeClass.color : "#64748b",
      date: new Date().toLocaleDateString('fr-FR'),
      formData: { ...formData }
    };
    
    const updated = [newBuild, ...savedBuilds];
    saveBuildsToLocalStorage(updated);
    setNewBuildName('');
    setShowSaveModal(false);
  };

  const handleLoadBuild = (build) => {
    const mergedData = {
      ...INITIAL_STATE,
      ...build.formData,
      equipments: {
        ...INITIAL_STATE.equipments,
        ...(build.formData.equipments || {})
      },
      skill_upgrades: {
        ...INITIAL_STATE.skill_upgrades,
        ...(build.formData.skill_upgrades || {})
      },
      family_effects: {
        ...INITIAL_STATE.family_effects,
        ...(build.formData.family_effects || {})
      },
      passive_skill: {
        ...INITIAL_STATE.passive_skill,
        ...(build.formData.passive_skill || {})
      }
    };
    setFormData(mergedData);
    const m = monstersData.find(mon => mon.id === mergedData.monster_id);
    if (m) setSelectedMonster(m);
  };

  const handleDeleteBuild = (id, e) => {
    e.stopPropagation();
    const updated = savedBuilds.filter(b => b.id !== id);
    saveBuildsToLocalStorage(updated);
    if (compareBuild?.id === id) {
      setCompareBuild(null);
      setCompareResult('');
    }
  };

  // Export / Import builds as JSON file
  const exportBuilds = () => {
    const blob = new Blob([JSON.stringify(savedBuilds, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `nostale_calculs_sauvegardes_${new Date().toISOString().slice(0,10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const importBuilds = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (Array.isArray(parsed)) {
          // merge with current
          const merged = [...parsed, ...savedBuilds];
          // remove duplicate IDs
          const unique = Array.from(new Map(merged.map(item => [item.id, item])).values());
          saveBuildsToLocalStorage(unique);
          alert("Sauvegardes importées avec succès !");
        } else {
          alert("Format de fichier invalide.");
        }
      } catch (err) {
        alert("Erreur lors de la lecture du fichier : " + err.message);
      }
    };
    reader.readAsText(file);
  };

  // Filters
  const filteredMonsters = monstersData.filter(m => 
    m.text.toLowerCase().includes(monsterSearch.toLowerCase())
  );

  const getFilteredBuffs = (type) => {
    const pool = type === 'player' ? buffsData.buffs : buffsData.monster_buffs;
    return pool.filter(b => b.text.toLowerCase().includes(buffSearch.toLowerCase()));
  };

  return (
    <div className="calc-container">
      {/* Top Header */}
      <header className="calc-header">
        <div className="header-logo">
          <Sword className="logo-icon text-red" />
          <h1>NosCalc <span className="pve-pill">PvE</span></h1>
        </div>
        <p className="header-tagline">Calculateur de dégâts amélioré pour NosTale avec sauvegarde locale</p>
      </header>

      {/* Main Grid Layout */}
      <main className="calc-grid">
        {/* Left Control Column */}
        <section className="calc-column config-section">
          {/* Menu Tabs */}
          <div className="calc-tabs">
            <button 
              className={`tab-btn ${activeTab === 'attacker' ? 'active' : ''}`}
              onClick={() => setActiveTab('attacker')}
            >
              <Sword size={16} /> Attaquant
            </button>
            <button 
              className={`tab-btn ${activeTab === 'defender' ? 'active' : ''}`}
              onClick={() => setActiveTab('defender')}
            >
              <Shield size={16} /> Défenseur / Cible
            </button>
            <button 
              className={`tab-btn ${activeTab === 'saved' ? 'active' : ''}`}
              onClick={() => setActiveTab('saved')}
            >
              <Database size={16} /> Sauvegardes ({savedBuilds.length})
            </button>
          </div>

          <div className="tab-content">
            {/* 1. Attacker Tab */}
            {activeTab === 'attacker' && (
              <div className="animate-fade-in flex-col gap-6">
                
                {/* Basic Stats Card */}
                <div className="config-card">
                  <h3 className="card-title"><Sparkles size={18} className="text-yellow" /> Caractéristiques de base</h3>
                  <div className="grid-2">
                    <div>
                      <label>Classe</label>
                      <div className="btn-group">
                        {CLASSES.map(c => (
                          <button
                            key={c.id}
                            className={`btn-select ${formData.class === c.id ? 'active' : ''}`}
                            onClick={() => handleClassChange(c.id)}
                            style={{ '--accent-color': c.color }}
                          >
                            {c.name}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label>Genre</label>
                      <div className="btn-group">
                        {GENDERS.map(g => (
                          <button
                            key={g.id}
                            className={`btn-select ${formData.gender === g.id ? 'active' : ''}`}
                            onClick={() => updateField('gender', g.id)}
                          >
                            {g.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="grid-2 mt-4">
                    <div className="input-field">
                      <label>Niveau Attaquant (1-99)</label>
                      <input 
                        type="number" 
                        min="1" max="99" 
                        value={formData.level}
                        onChange={(e) => updateField('level', parseInt(e.target.value) || 1)}
                      />
                    </div>
                    <div className="input-field">
                      <label>Distance de tir (m)</label>
                      <input 
                        type="number" 
                        min="0" max="100" 
                        value={formData.distance}
                        onChange={(e) => updateField('distance', parseInt(e.target.value) || 0)}
                      />
                    </div>
                  </div>
                </div>

                {/* Character Equipment Sheet Card */}
                <div className="config-card">
                  <h3 className="card-title"><Shield size={18} className="text-yellow" /> Équipement du Personnage</h3>
                  
                  {/* Grid Layout definition */}
                  {(() => {
                    const LEFT_SLOTS = [2, 9, 0, 5, 14, 13];
                    const MIDDLE_SLOTS = [12, 10, 16, 15];
                    const RIGHT_SLOTS = [1, 3, 4, 6, 7, 8];
                    const BOTTOM_SLOTS = [11, 17];
                    
                    const renderEquipSlot = (slotId) => {
                      const slotInfo = SLOT_INFOS[slotId];
                      const equippedId = formData.equipments[slotId] || 0;
                      const item = equippedId ? itemsData[slotId]?.find(it => it.id === equippedId) : null;
                      
                      return (
                        <button
                          key={slotId}
                          className={`equip-slot ${item ? 'active' : ''}`}
                          onClick={() => {
                            setShowEquipSelect(slotId);
                            setEquipSearch('');
                          }}
                          title={item ? item.name : slotInfo.name}
                        >
                          <div className="equip-slot-icon">
                            {item ? (
                              <img src={`https://nosapki.com/images/icons/${item.icon}.png`} alt={item.name} />
                            ) : (
                              <span className="equip-slot-placeholder">{slotInfo.placeholder}</span>
                            )}
                          </div>
                          <div className="equip-slot-info">
                            <span className="equip-slot-label">{slotInfo.name}</span>
                            <span className="equip-slot-name">
                              {item ? item.name.replace(/\[Abandonner\],?\s*/, '').replace(/\[Commerce\],?\s*/, '').replace(/\[Vente\],?\s*/, '').replace(/Impossible/, '').trim() : "Vide"}
                            </span>
                          </div>
                        </button>
                      );
                    };

                    return (
                      <div className="flex-col gap-4">
                        <div className="equip-grid">
                          {/* Left Column */}
                          <div className="equip-column">
                            {LEFT_SLOTS.map(slotId => renderEquipSlot(slotId))}
                          </div>
                          
                          {/* Middle Column (Visual Avatar / Core Slots) */}
                          <div className="equip-column middle-column">
                            <div className="avatar-placeholder">
                              {(() => {
                                const spId = formData.equipments[12] || 0;
                                const spItem = spId ? itemsData[12]?.find(it => it.id === spId) : null;
                                const activeClass = CLASSES.find(c => c.id === formData.class);
                                const classNameText = activeClass ? activeClass.name : "Aventurier";
                                
                                if (spItem) {
                                  return (
                                    <>
                                      <img 
                                        src={`https://nosapki.com/images/icons/${spItem.icon}.png`} 
                                        alt={spItem.name} 
                                        className="w-10 h-10 object-contain filter drop-shadow-[0_0_8px_rgba(245,158,11,0.4)]" 
                                      />
                                      <span className="avatar-text">
                                        {spItem.name.replace(/\[Abandonner\],?\s*/, '').replace(/\[Commerce\],?\s*/, '').replace(/\[Vente\],?\s*/, '').replace(/Impossible/, '').trim()}
                                      </span>
                                    </>
                                  );
                                }
                                
                                // Default Class representation
                                return (
                                  <>
                                    {(() => {
                                      switch(formData.class) {
                                        case 1:
                                          return <Sword className="text-red animate-pulse" size={28} />;
                                        case 2:
                                          return <Sparkles className="text-green animate-pulse" size={28} />;
                                        case 3:
                                          return <Sparkles className="text-blue animate-pulse" size={28} />;
                                        case 4:
                                          return <Zap className="text-purple animate-pulse" size={28} />;
                                        default:
                                          return <Sparkles className="text-slate" size={28} />;
                                      }
                                    })()}
                                    <span className="avatar-text">{classNameText}</span>
                                  </>
                                );
                              })()}
                            </div>
                            {MIDDLE_SLOTS.map(slotId => renderEquipSlot(slotId))}
                          </div>
                          
                          {/* Right Column */}
                          <div className="equip-column">
                            {RIGHT_SLOTS.map(slotId => renderEquipSlot(slotId))}
                          </div>
                        </div>
                        
                        {/* Bottom Row */}
                        <div className="equip-bottom mt-2">
                          {BOTTOM_SLOTS.map(slotId => renderEquipSlot(slotId))}
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* Weapons & Armor Manual Overrides (Optional) */}
                <div className="config-card">
                  <h3 className="card-title"><Sword size={18} /> Ajustements d'Équipements (Surcharges)</h3>
                  
                  {/* Main Weapon */}
                  <h4 className="card-subtitle text-red">Arme Principale (Droite)</h4>
                  <div className="grid-3">
                    <div className="input-field">
                      <label>Upgrade (+0 à +13)</label>
                      <input 
                        type="number" min="0" max="13" 
                        value={formData['weapon_plus[0]']}
                        onChange={(e) => updateField('weapon_plus[0]', parseInt(e.target.value) || 0)}
                      />
                    </div>
                    <div className="input-field">
                      <label>Attaque Min (Facultatif)</label>
                      <input 
                        type="number" min="0" max="3000"
                        value={formData['weapon_attack[0][min]']}
                        onChange={(e) => updateField('weapon_attack[0][min]', e.target.value)}
                        placeholder="Auto"
                      />
                    </div>
                    <div className="input-field">
                      <label>Attaque Max (Facultatif)</label>
                      <input 
                        type="number" min="0" max="3000"
                        value={formData['weapon_attack[0][max]']}
                        onChange={(e) => updateField('weapon_attack[0][max]', e.target.value)}
                        placeholder="Auto"
                      />
                    </div>
                  </div>

                  {/* Secondary Weapon */}
                  <h4 className="card-subtitle text-blue mt-4">Arme Secondaire (Gauche)</h4>
                  <div className="grid-3">
                    <div className="input-field">
                      <label>Upgrade (+0 à +13)</label>
                      <input 
                        type="number" min="0" max="13" 
                        value={formData['weapon_plus[5]']}
                        onChange={(e) => updateField('weapon_plus[5]', parseInt(e.target.value) || 0)}
                      />
                    </div>
                    <div className="input-field">
                      <label>Attaque Min (Facultatif)</label>
                      <input 
                        type="number" min="0" max="3000"
                        value={formData['weapon_attack[5][min]']}
                        onChange={(e) => updateField('weapon_attack[5][min]', e.target.value)}
                        placeholder="Auto"
                      />
                    </div>
                    <div className="input-field">
                      <label>Attaque Max (Facultatif)</label>
                      <input 
                        type="number" min="0" max="3000"
                        value={formData['weapon_attack[5][max]']}
                        onChange={(e) => updateField('weapon_attack[5][max]', e.target.value)}
                        placeholder="Auto"
                      />
                    </div>
                  </div>

                  {/* Armor Defense Override */}
                  <h4 className="card-subtitle text-green mt-4">Armure</h4>
                  <div className="input-field">
                    <label>Défense de l'armure (Facultatif)</label>
                    <input 
                      type="number" min="0" max="3000"
                      value={formData['armor_defense[2]']}
                      onChange={(e) => updateField('armor_defense[2]', e.target.value)}
                      placeholder="Auto"
                    />
                  </div>

                  {/* Shell Option Accordion for Right Weapon */}
                  <details className="mt-4 details-section">
                    <summary className="details-summary">Options Coquillage (Arme Droite)</summary>
                    <div className="details-content">
                      <div className="grid-2">
                        {SHELL_OPTIONS.slice(0, 10).map(opt => (
                          <div key={opt.id} className="input-field-inline">
                            <span>{opt.name}</span>
                            <input 
                              type="number" min="0" max={opt.max}
                              value={formData.shell_0[opt.id] || 0}
                              onChange={(e) => updateShellField('shell_0', opt.id, e.target.value)}
                              placeholder="0"
                            />
                          </div>
                        ))}
                      </div>
                      <h4 className="card-subtitle mt-2">Éléments renforcés (Coquillage)</h4>
                      <div className="grid-2">
                        {SHELL_OPTIONS.slice(10).map(opt => (
                          <div key={opt.id} className="input-field-inline">
                            <span>{opt.name}</span>
                            <input 
                              type="number" min="0" max={opt.max}
                              value={formData.shell_0[opt.id] || 0}
                              onChange={(e) => updateShellField('shell_0', opt.id, e.target.value)}
                              placeholder="0"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </details>

                  {/* Shell Option Accordion for Left Weapon */}
                  <details className="mt-4 details-section">
                    <summary className="details-summary">Options Coquillage (Arme Gauche)</summary>
                    <div className="details-content">
                      <div className="grid-2">
                        {SHELL_OPTIONS.slice(0, 10).map(opt => (
                          <div key={opt.id} className="input-field-inline">
                            <span>{opt.name}</span>
                            <input 
                              type="number" min="0" max={opt.max}
                              value={formData.shell_5[opt.id] || 0}
                              onChange={(e) => updateShellField('shell_5', opt.id, e.target.value)}
                              placeholder="0"
                            />
                          </div>
                        ))}
                      </div>
                      <h4 className="card-subtitle mt-2">Éléments renforcés (Coquillage)</h4>
                      <div className="grid-2">
                        {SHELL_OPTIONS.slice(10).map(opt => (
                          <div key={opt.id} className="input-field-inline">
                            <span>{opt.name}</span>
                            <input 
                              type="number" min="0" max={opt.max}
                              value={formData.shell_5[opt.id] || 0}
                              onChange={(e) => updateShellField('shell_5', opt.id, e.target.value)}
                              placeholder="0"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </details>
                </div>

                 {/* SP Card Stats Settings */}
                 <div className="config-card">
                   <div className="flex-between mb-4 flex-wrap gap-2">
                     <h3 className="card-title mb-0 text-sm md:text-base" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Award size={18} className="text-purple" /> Points de Carte Spécialiste (SP)</h3>
                     <div className="flex-center gap-2 flex-wrap">
                       <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${getSpentSPPoints() > 486 ? 'bg-red/20 text-red border border-red/30' : 'bg-purple/20 text-purple border border-purple/30'}`}>
                         Dépensés : {getSpentSPPoints()} / 486
                       </span>
                       <button 
                         className="btn-small border text-purple border-purple flex-center gap-1 hover:bg-purple/10 cursor-pointer"
                         onClick={() => {
                           setShowOptimizerModal(true);
                           setOptimizationResults([]);
                         }}
                         type="button"
                       >
                         <Zap size={14} /> Optimiseur PvE
                       </button>
                     </div>
                   </div>
                  <div className="grid-4">
                    <div className="input-field">
                      <label>Attaque</label>
                      <input 
                        type="number" min="0" max="120"
                        value={formData['specialist_points[1]']}
                        onChange={(e) => updateField('specialist_points[1]', parseInt(e.target.value) || 0)}
                      />
                      <span className="perf-label">Perf (+{formData['specialist_perfect_points[1]']})</span>
                      <input 
                        className="perf-input"
                        type="number" min="0" max="54"
                        value={formData['specialist_perfect_points[1]']}
                        onChange={(e) => updateField('specialist_perfect_points[1]', parseInt(e.target.value) || 0)}
                      />
                    </div>
                    <div className="input-field">
                      <label>Défense</label>
                      <input 
                        type="number" min="0" max="120"
                        value={formData['specialist_points[2]']}
                        onChange={(e) => updateField('specialist_points[2]', parseInt(e.target.value) || 0)}
                      />
                      <span className="perf-label">Perf (+{formData['specialist_perfect_points[2]']})</span>
                      <input 
                        className="perf-input"
                        type="number" min="0" max="54"
                        value={formData['specialist_perfect_points[2]']}
                        onChange={(e) => updateField('specialist_perfect_points[2]', parseInt(e.target.value) || 0)}
                      />
                    </div>
                    <div className="input-field">
                      <label>Élément</label>
                      <input 
                        type="number" min="0" max="120"
                        value={formData['specialist_points[3]']}
                        onChange={(e) => updateField('specialist_points[3]', parseInt(e.target.value) || 0)}
                      />
                      <span className="perf-label">Perf (+{formData['specialist_perfect_points[3]']})</span>
                      <input 
                        className="perf-input"
                        type="number" min="0" max="54"
                        value={formData['specialist_perfect_points[3]']}
                        onChange={(e) => updateField('specialist_perfect_points[3]', parseInt(e.target.value) || 0)}
                      />
                    </div>
                    <div className="input-field">
                      <label>HP/MP</label>
                      <input 
                        type="number" min="0" max="120"
                        value={formData['specialist_points[4]']}
                        onChange={(e) => updateField('specialist_points[4]', parseInt(e.target.value) || 0)}
                      />
                      <span className="perf-label">Perf (+{formData['specialist_perfect_points[4]']})</span>
                      <input 
                        className="perf-input"
                        type="number" min="0" max="54"
                        value={formData['specialist_perfect_points[4]']}
                        onChange={(e) => updateField('specialist_perfect_points[4]', parseInt(e.target.value) || 0)}
                      />
                    </div>
                  </div>

                  {/* Totals Table */}
                  <div className="mt-4 border-t pt-4 border-slate/20">
                    <h4 className="text-xs font-semibold text-purple mb-2 uppercase tracking-wider" style={{ letterSpacing: '0.05em' }}>Récapitulatif des points finaux (Max 120)</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left border-collapse">
                        <thead>
                          <tr className="border-b border-slate/20 text-muted">
                            <th className="pb-2 font-medium">Statistique</th>
                            <th className="pb-2 font-medium text-center">SP (Base)</th>
                            <th className="pb-2 font-medium text-center">Équipement (SL)</th>
                            <th className="pb-2 font-medium text-right">Total Final</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(() => {
                            const sls = getSLValues(formData);
                            const stats = [
                              { name: "Attaque", base: parseInt(formData['specialist_points[1]']) || 0, sl: sls.attack, color: "text-red" },
                              { name: "Défense", base: parseInt(formData['specialist_points[2]']) || 0, sl: sls.defense, color: "text-blue" },
                              { name: "Élément", base: parseInt(formData['specialist_points[3]']) || 0, sl: sls.element, color: "text-green" },
                              { name: "HP / MP", base: parseInt(formData['specialist_points[4]']) || 0, sl: sls.hpmp, color: "text-yellow" }
                            ];

                            return stats.map((st, i) => {
                              const total = st.base + st.sl;
                              const isOvercapped = total > 120;
                              return (
                                <tr key={i} className="border-b border-slate/10 last:border-0">
                                  <td className="py-2 font-medium flex-center gap-1" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                    <span className={st.color}>●</span> {st.name}
                                  </td>
                                  <td className="py-2 text-center text-light">{st.base}</td>
                                  <td className="py-2 text-center text-muted">+{st.sl}</td>
                                  <td className="py-2 text-right">
                                    <span className={`font-bold ${isOvercapped ? 'text-red animate-pulse' : 'text-light'}`} title={isOvercapped ? 'Statistique dépassée (> 120), les points au-dessus sont perdus !' : ''}>
                                      {isOvercapped ? '120' : total}
                                    </span>
                                    {isOvercapped && (
                                      <span className="text-[10px] text-red ml-1 font-normal block" style={{ fontSize: '10px' }}>
                                        (Perte : -{total - 120})
                                      </span>
                                    )}
                                  </td>
                                </tr>
                              );
                            });
                          })()}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <details className="mt-4 details-section">
                    <summary className="details-summary">Options de Rune (Arme & Armure)</summary>
                    <div className="details-content">
                      <h4 className="card-subtitle text-yellow">Rune d'Arme</h4>
                      <div className="grid-2">
                        {RUNE_OPTIONS.filter(r => r.group === 0).map(opt => (
                          <div key={opt.id} className="input-field-inline">
                            <span>{opt.name}</span>
                            <input 
                              type="number" min="0" max={opt.max}
                              value={formData.rune_0[opt.id] || 0}
                              onChange={(e) => updateShellField('rune_0', opt.id, e.target.value)}
                              placeholder="0"
                            />
                          </div>
                        ))}
                      </div>
                      <h4 className="card-subtitle text-yellow mt-4">Rune d'Armure</h4>
                      <div className="grid-2">
                        {RUNE_OPTIONS.filter(r => r.group === 1).map(opt => (
                          <div key={opt.id} className="input-field-inline">
                            <span>{opt.name}</span>
                            <input 
                              type="number" min="0" max={opt.max}
                              value={formData.rune_1[opt.id] || 0}
                              onChange={(e) => updateShellField('rune_1', opt.id, e.target.value)}
                              placeholder="0"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </details>
                </div>

                {/* Active Skills Selection Card */}
                <div className="config-card">
                  <h3 className="card-title"><Zap size={18} className="text-yellow" /> Compétences Actives</h3>
                  
                  {/* Selected Active Skill details */}
                  {(() => {
                    const activeSkill = skillsData.find(s => s.id === formData.skill);
                    return (
                      <div className="active-skill-summary mb-4 flex-center gap-3">
                        <div className="skill-icon-box">
                          {activeSkill ? (
                            <img src={`https://nosapki.com/images/icons/${activeSkill.icon}.png`} alt={activeSkill.name} />
                          ) : (
                            <Zap size={24} className="text-muted" />
                          )}
                        </div>
                        <div>
                          <span className="text-xs text-muted block uppercase tracking-wider">Compétence Active</span>
                          <span className="font-bold text-sm text-light">{activeSkill ? activeSkill.name : "Attaque de base (Défaut)"}</span>
                        </div>
                        {formData.skill > 0 && (
                          <button className="btn-small border ml-auto" onClick={() => {
                            setFormData(prev => ({
                              ...prev,
                              skill: 0,
                              skill_upgrades: { 0: 0, 1: 0, 2: 0 }
                            }));
                          }}>
                            Désélectionner
                          </button>
                        )}
                      </div>
                    );
                  })()}

                  {/* Skills Grid */}
                  <div className="skills-selection-grid scrollbar">
                    {(() => {
                      const userClassBit = 1 << formData.class;
                      const equippedSpId = formData.equipments[12];
                      const activeCard = equippedSpId ? itemsData["12"]?.find(i => i.id === equippedSpId) : null;
                      const spIndex = activeCard ? activeCard.sp : -1;
                      
                      const filteredSkills = skillsData.filter(s => {
                        if (spIndex !== -1) {
                          return s.sp === spIndex;
                        } else {
                          return s.sp === -1 && (s.class === -1 || (s.class & userClassBit) !== 0);
                        }
                      });

                      if (filteredSkills.length === 0) {
                        return <p className="empty-text text-center py-2">Aucune compétence trouvée pour cette configuration.</p>;
                      }

                      return (
                        <div className="skills-grid-layout">
                          {filteredSkills.map(skill => {
                            const isSelected = formData.skill === skill.id;
                            return (
                              <button
                                key={skill.id}
                                className={`skill-grid-btn ${isSelected ? 'selected' : ''}`}
                                onClick={() => {
                                  setFormData(prev => ({
                                    ...prev,
                                    skill: skill.id,
                                    skill_upgrades: { 0: 0, 1: 0, 2: 0 }
                                  }));
                                }}
                                title={skill.name}
                              >
                                <img src={`https://nosapki.com/images/icons/${skill.icon}.png`} alt={skill.name} />
                                <span className="skill-grid-name">{skill.name}</span>
                              </button>
                            );
                          })}
                        </div>
                      );
                    })()}
                  </div>

                  {/* Skill Upgrades Section */}
                  {formData.skill > 0 && (() => {
                    const skillUpgrades = skillUpgradesData.filter(u => u.skillId === formData.skill);
                    if (skillUpgrades.length === 0) return null;
                    
                    const upgradesByGroup = { 0: [], 1: [], 2: [] };
                    skillUpgrades.forEach(u => {
                      if (upgradesByGroup[u.group]) upgradesByGroup[u.group].push(u);
                    });

                    return (
                      <div className="skill-upgrades-section mt-4 border-t pt-4">
                        <h4 className="card-subtitle text-yellow mb-2 text-xs">Améliorations de Compétence</h4>
                        <div className="flex-col gap-3">
                          {[0, 1, 2].map(gId => {
                            const groupList = upgradesByGroup[gId] || [];
                            if (groupList.length === 0) return null;
                            
                            return (
                              <div key={gId} className="upgrade-group">
                                <span className="text-xs text-muted block mb-1">Row {gId + 1}</span>
                                <div className="upgrades-row">
                                  {groupList.map(up => {
                                    const isSelected = formData.skill_upgrades[gId] === up.id;
                                    return (
                                      <button
                                        key={up.id}
                                        className={`upgrade-btn ${isSelected ? 'active' : ''}`}
                                        onClick={() => {
                                          setFormData(prev => ({
                                            ...prev,
                                            skill_upgrades: {
                                              ...prev.skill_upgrades,
                                              [gId]: isSelected ? 0 : up.id
                                            }
                                          }));
                                        }}
                                        title={up.name}
                                      >
                                        <img src={`https://nosapki.com/images/icons/${up.icon}.png`} alt={up.name} />
                                        <span className="text-xs">{up.name}</span>
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* Fairy, Passives, Titles & Consumables */}
                <div className="config-card">
                  <h3 className="card-title"><Sun size={18} className="text-yellow" /> Fée & Compléments</h3>
                  <div className="grid-2">
                    <div className="input-field">
                      <label>Pourcentage de la fée (%)</label>
                      <input 
                        type="number" min="0" max="110"
                        value={formData.fairy_percent}
                        onChange={(e) => updateField('fairy_percent', parseInt(e.target.value) || 0)}
                      />
                    </div>
                    <div className="input-field">
                      <label>Titre</label>
                      <select 
                        value={formData.titles}
                        onChange={(e) => updateField('titles', parseInt(e.target.value) || 0)}
                        className="calc-select"
                        title={TITLES.find(t => t.id === formData.titles)?.tooltip || ''}
                      >
                        {TITLES.map(t => (
                          <option key={t.id} value={t.id} title={t.tooltip || ''}>{t.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <details className="mt-4 details-section">
                    <summary className="details-summary">Effets de Fée</summary>
                    <div className="details-content grid-2">
                      {FAIRY_OPTIONS.map(opt => (
                        <div key={opt.id} className="input-field-inline">
                          <span>{opt.name}</span>
                          <input 
                            type="number" min="0" max={opt.max}
                            value={formData[`fairy_option[${opt.id}]`] || 0}
                            onChange={(e) => updateField(`fairy_option[${opt.id}]`, parseInt(e.target.value) || 0)}
                            placeholder="0"
                          />
                        </div>
                      ))}
                    </div>
                  </details>

                  {/* Collapsible Family Effects Panel */}
                  <details className="mt-4 details-section">
                    <summary className="details-summary">Effets de Famille (Lvl 1 à 8)</summary>
                    <div className="details-content flex-col gap-3">
                      {familyEffectsData.map(group => {
                        const selectedLevel = formData.family_effects[group.groupId] !== undefined
                          ? formData.family_effects[group.groupId]
                          : -1;
                        
                        return (
                          <div 
                            key={group.groupId} 
                            className="family-effect-row flex-between border-b pb-2 mb-2 last:border-0"
                            title={getFamilyTooltip(group.groupId, selectedLevel)}
                          >
                            <div className="flex-center gap-2">
                              {group.items[0] && (
                                <img src={`https://nosapki.com/images/icons/${group.items[0].icon}.png`} alt="Effect Icon" className="w-5 h-5 object-contain" />
                              )}
                              <span className="text-xs font-medium">
                                {group.items[0] ? group.items[0].name.replace(/\(niveau \d+\)/, '').replace(/Level \d+/, '').trim() : `Groupe ${group.groupId}`}
                              </span>
                            </div>
                            
                            <select
                              value={selectedLevel}
                              onChange={(e) => {
                                const val = parseInt(e.target.value);
                                setFormData(prev => ({
                                  ...prev,
                                  family_effects: {
                                    ...prev.family_effects,
                                    [group.groupId]: val
                                  }
                                }));
                              }}
                              className="calc-select w-36 text-xs"
                            >
                              <option value={-1}>Aucun</option>
                              {group.items.map(it => {
                                const levelMatch = it.name.match(/niveau (\d+)/);
                                const levelText = levelMatch ? `Niveau ${levelMatch[1]}` : it.name;
                                return (
                                  <option key={it.level} value={it.level} title={getFamilyTooltip(group.groupId, it.level)}>
                                    {levelText}
                                  </option>
                                );
                              })}
                            </select>
                          </div>
                        );
                      })}
                    </div>
                  </details>

                  {/* Collapsible Passive Skills Panel */}
                  <details className="mt-4 details-section">
                    <summary className="details-summary">Compétences Passives (Livres)</summary>
                    <div className="details-content passives-grid">
                      {passiveSkillsData.map(group => {
                        const cleanName = getPassiveGroupName(group);
                        const selectedVal = formData.passive_skill[group.groupId] !== undefined 
                          ? formData.passive_skill[group.groupId] 
                          : 0;
                        const lastItem = group.items[group.items.length - 1];
                        
                        return (
                          <div 
                            key={group.groupId} 
                            className="passive-row flex-between border-b pb-2 mb-2 last:border-0"
                            title={getPassiveTooltip(group.groupId, getPassiveLevel(group, selectedVal))}
                          >
                            <div className="flex-center gap-2">
                              <img 
                                src={`https://nosapki.com/images/icons/${lastItem.icon}.png`} 
                                alt="Passive Icon" 
                                className="w-5 h-5 object-contain"
                                onError={(e) => { e.target.src = 'https://nosapki.com/images/icons/7070.png'; }}
                              />
                              <span className="text-xs font-medium">
                                {cleanName}
                              </span>
                            </div>
                            
                            <select
                              value={selectedVal}
                              onChange={(e) => {
                                const val = parseInt(e.target.value) || 0;
                                setFormData(prev => ({
                                  ...prev,
                                  passive_skill: {
                                    ...prev.passive_skill,
                                    [group.groupId]: val
                                  }
                                }));
                              }}
                              className="calc-select w-36 text-xs"
                            >
                              {getPassiveOptions(group)}
                            </select>
                          </div>
                        );
                      })}
                    </div>
                  </details>

                  {/* Consumables (Anniversary medal / Heroic order) */}
                  <h4 className="card-subtitle text-yellow mt-4">Consommables Nosmall</h4>
                  <div className="consumables-row mt-2">
                    {CONSUMABLES.map(c => (
                      <button
                        key={c.id}
                        className={`btn-consumable ${formData.nosmall_consumable_item[c.id] ? 'active' : ''}`}
                        onClick={() => toggleConsumable(c.id)}
                      >
                        <Zap size={14} /> {c.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Active Player Buffs Grid */}
                <div className="config-card">
                  <div className="flex-between">
                    <h3 className="card-title"><Flame size={18} className="text-red" /> Buffs Actifs ({Object.keys(formData.buffs).length})</h3>
                    <button className="btn-small border" onClick={() => setShowBuffSelect('player')}>
                      Ajouter un Buff
                    </button>
                  </div>
                  <div className="buffs-grid mt-3">
                    {Object.values(formData.buffs).length === 0 ? (
                      <p className="empty-text">Aucun buff actif. Cliquez sur "Ajouter un Buff" pour configurer.</p>
                    ) : (
                      Object.values(formData.buffs).map(b => (
                        <div key={b.group} className="buff-tag">
                          <div className="flex-center gap-2">
                            <span className="buff-text">{b.text}</span>
                            <span className="buff-level">Lvl {b.level}</span>
                          </div>
                          <button className="buff-remove" onClick={() => toggleBuff('buffs', b)}>
                            <X size={12} />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>

              </div>
            )}

            {/* 2. Defender Tab */}
            {activeTab === 'defender' && (
              <div className="animate-fade-in flex-col gap-6">
                
                {/* Target Monster Selector */}
                <div className="config-card allow-overflow">
                  <h3 className="card-title"><Search size={18} className="text-yellow" /> Sélection du Monstre</h3>
                  
                  <div className="search-box relative">
                    <Search className="search-icon" size={16} />
                    <input 
                      type="text" 
                      placeholder="Rechercher un monstre (ex: Bacoum, Yéti...)"
                      value={monsterSearch}
                      onChange={(e) => {
                        setMonsterSearch(e.target.value);
                        setShowMonsterSelect(true);
                      }}
                      onFocus={() => setShowMonsterSelect(true)}
                    />
                    {monsterSearch && (
                      <button className="clear-btn" onClick={() => { setMonsterSearch(''); setShowMonsterSelect(false); }}>
                        <X size={14} />
                      </button>
                    )}

                    {showMonsterSelect && monsterSearch && (
                      <div className="search-dropdown scrollbar">
                        {filteredMonsters.slice(0, 50).map(m => (
                          <button
                            key={m.id}
                            className="search-item"
                            onClick={() => selectMonster(m)}
                          >
                            {m.text}
                          </button>
                        ))}
                        {filteredMonsters.length === 0 && (
                          <div className="search-empty">Aucun monstre trouvé</div>
                        )}
                      </div>
                    )}
                  </div>

                  {selectedMonster && (
                    <div className="selected-monster-display mt-4">
                      <div className="flex-between">
                        <div>
                          <p className="m-label">Cible Active</p>
                          <p className="m-name">{selectedMonster.text}</p>
                        </div>
                        <span className="id-badge">ID: {selectedMonster.id}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Target Buffs & Debuffs */}
                <div className="config-card">
                  <div className="flex-between">
                    <h3 className="card-title"><Moon size={18} className="text-purple" /> Débuffs & Effets Cible ({Object.keys(formData.monster_buffs).length})</h3>
                    <button className="btn-small border" onClick={() => setShowBuffSelect('monster')}>
                      Ajouter un Débuff
                    </button>
                  </div>
                  <div className="buffs-grid mt-3">
                    {Object.values(formData.monster_buffs).length === 0 ? (
                      <p className="empty-text">Aucun débuff actif sur le monstre.</p>
                    ) : (
                      Object.values(formData.monster_buffs).map(b => (
                        <div key={b.group} className="buff-tag monster-buff">
                          <div className="flex-center gap-2">
                            <span className="buff-text">{b.text}</span>
                            <span className="buff-level">Lvl {b.level}</span>
                          </div>
                          <button className="buff-remove" onClick={() => toggleBuff('monster_buffs', b)}>
                            <X size={12} />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Additional Target Modifiers */}
                <div className="config-card">
                  <h3 className="card-title"><Shield size={18} /> Autres paramètres Défense</h3>
                  <div className="input-field">
                    <label>Défense de base de l'armure attaquante (pour test)</label>
                    <input 
                      type="number" min="0" max="2000"
                      value={formData['armor_defense[2]']}
                      onChange={(e) => updateField('armor_defense[2]', parseInt(e.target.value) || 0)}
                      placeholder="0"
                    />
                  </div>
                </div>

              </div>
            )}

            {/* 3. Saved Builds Tab */}
            {activeTab === 'saved' && (
              <div className="animate-fade-in flex-col gap-6">
                
                {/* Saved list card */}
                <div className="config-card">
                  <div className="flex-between mb-4">
                    <h3 className="card-title"><Database size={18} className="text-yellow" /> Vos configurations</h3>
                    <div className="flex gap-2">
                      <button className="btn-icon" onClick={exportBuilds} title="Exporter toutes les sauvegardes">
                        <Download size={16} />
                      </button>
                      <label className="btn-icon cursor-pointer" title="Importer des sauvegardes">
                        <Upload size={16} />
                        <input type="file" accept=".json" onChange={importBuilds} style={{ display: 'none' }} />
                      </label>
                    </div>
                  </div>

                  <div className="builds-list flex-col gap-3">
                    {savedBuilds.length === 0 ? (
                      <div className="build-empty">
                        <Award size={36} className="text-muted mb-2" />
                        <p>Aucune configuration sauvegardée.</p>
                        <p className="text-xs text-muted mt-1">Configurez votre attaquant puis cliquez sur "Sauvegarder" dans le panneau de résultats.</p>
                      </div>
                    ) : (
                      savedBuilds.map(b => (
                        <div 
                          key={b.id} 
                          className="build-item"
                          onClick={() => handleLoadBuild(b)}
                        >
                          <div className="build-details">
                            <span className="build-name">{b.name}</span>
                            <div className="build-meta">
                              <span className="class-tag" style={{ backgroundColor: `${b.classColor}20`, color: b.classColor }}>
                                {b.class}
                              </span>
                              <span className="build-date">le {b.date}</span>
                            </div>
                          </div>
                          
                          <div className="build-actions flex gap-2">
                            <button 
                              className={`btn-compare ${compareBuild?.id === b.id ? 'active' : ''}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                if (compareBuild?.id === b.id) {
                                  setCompareBuild(null);
                                  setCompareResult('');
                                } else {
                                  setCompareBuild(b);
                                }
                              }}
                              title="Comparer avec ce build"
                            >
                              <Copy size={14} />
                            </button>
                            <button 
                              className="btn-delete"
                              onClick={(e) => handleDeleteBuild(b.id, e)}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* Information & Documentation Guide */}
          <div className="config-card info-card mt-4">
            <h4 className="info-title"><Info size={16} /> Comment optimiser vos dégâts ?</h4>
            <ul className="info-list">
              <li>Les points d'<strong>Attaque</strong> sur la carte SP ajoutent des dégâts bruts et augmentent la probabilité de coup critique.</li>
              <li>Les points d'<strong>Élément</strong> décuplent les dégâts élémentaires multipliés par votre fée, très efficaces sur les monstres à faibles résistances.</li>
              <li>Le <strong>Double Dégât (Soft + Critique)</strong> survient lorsque la probabilité de baisse de défense de votre arme et votre coup critique s'activent simultanément. C'est le pic de dégâts majeur sur NosTale.</li>
            </ul>
          </div>
        </section>

        {/* Right Dashboard / Results Column */}
        <section className="calc-column results-section flex-col gap-6">
          
          {/* Main Glow result card */}
          <div className="result-sticky-card">
            <div className="flex-between border-b pb-3 mb-4">
              <h2 className="result-title"><FlameKindling className="text-red animate-pulse" /> Dégâts calculés (PvE)</h2>
              <div className="flex gap-2">
                <button className="btn btn-secondary flex-center gap-2" onClick={() => setShowSaveModal(true)}>
                  <Save size={16} /> Sauvegarder
                </button>
                <button 
                  className="btn btn-secondary flex-center gap-2" 
                  onClick={() => calculateDamage(formData)}
                  disabled={loading}
                >
                  <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                </button>
              </div>
            </div>

            {loading && !calculationResult && (
              <div className="result-loader flex-col flex-center">
                <RefreshCw size={32} className="animate-spin text-yellow mb-2" />
                <p>Calcul des dégâts en cours...</p>
              </div>
            )}

            {error && (
              <div className="error-card">
                <Info size={18} />
                <div className="error-text">
                  <p className="font-semibold">Erreur de connexion</p>
                  <p className="text-xs">{error}</p>
                </div>
              </div>
            )}

            {/* Displaying HTML result from NosApki */}
            {calculationResult ? (
              <div className="results-container flex-col gap-4">
                <div 
                  className="raw-result-html"
                  dangerouslySetInnerHTML={{ __html: calculationResult }} 
                />
                
                <p className="text-xs text-muted text-center mt-2 flex-center gap-1">
                  <Info size={12} /> Ces calculs proviennent du moteur exact de NosApki (fiabilité 99%).
                </p>
              </div>
            ) : (
              !loading && !error && (
                <div className="result-placeholder flex-col flex-center">
                  <Play size={48} className="text-muted mb-2" />
                  <p>Sélectionnez un attaquant et un monstre cible pour démarrer les calculs.</p>
                </div>
              )
            )}
          </div>

          {/* Comparison Panel */}
          {compareBuild && (
            <div className="result-sticky-card compare-card animate-fade-in">
              <div className="flex-between border-b pb-3 mb-4">
                <h3 className="compare-title">
                  <Copy size={16} className="text-yellow" /> Comparaison avec : <span className="text-yellow">{compareBuild.name}</span>
                </h3>
                <button className="close-compare" onClick={() => { setCompareBuild(null); setCompareResult(''); }}>
                  <X size={16} />
                </button>
              </div>

              {loading && !compareResult ? (
                <div className="result-loader flex-center">
                  <RefreshCw size={24} className="animate-spin text-yellow mr-2" />
                  <span>Calcul du build comparatif...</span>
                </div>
              ) : (
                compareResult && (
                  <div 
                    className="raw-result-html compare-result-html"
                    dangerouslySetInnerHTML={{ __html: compareResult }} 
                  />
                )
              )}
            </div>
          )}



        </section>
      </main>

      {/* Optimizer Modal */}
      {showOptimizerModal && (() => {
        const sls = getSLValues(formData);
        const activeMonster = selectedMonster ? selectedMonster.text : "Aucun monstre sélectionné";
        
        return (
          <div className="modal-overlay" onClick={() => !optimizing && setShowOptimizerModal(false)}>
            <div className="modal-content config-card buff-modal scrollbar" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '800px', width: '90%' }}>
              <div className="flex-between border-b pb-2 mb-4">
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Zap className="text-purple animate-pulse" size={20} /> Optimiseur de Dégâts SP (PvE)</h3>
                <button className="close-btn" onClick={() => !optimizing && setShowOptimizerModal(false)} disabled={optimizing}>
                  <X size={18} />
                </button>
              </div>

              <div className="mb-4 bg-purple/10 border border-purple/20 rounded p-3">
                <h4 className="font-semibold text-sm text-purple mb-1">Résumé des statistiques détectées :</h4>
                <div className="grid-2 text-xs">
                  <div>
                    <span className="text-muted">SL Attaque (Armes + Coquillages + Gen) :</span> <strong className="text-light">+{sls.attack}</strong>
                  </div>
                  <div>
                    <span className="text-muted">SL Élément (Armes + Coquillages + Gen) :</span> <strong className="text-light">+{sls.element}</strong>
                  </div>
                  <div className="mt-1">
                    <span className="text-muted">Cible active :</span> <strong className="text-yellow">{activeMonster}</strong>
                  </div>
                  <div className="mt-1">
                    <span className="text-muted">Règle de distribution :</span> <strong className="text-light">Base max = 120 - SL (bridé à 120 max final, surplus perdu)</strong>
                  </div>
                </div>
              </div>

              {optimizationResults.length === 0 && !optimizing && (
                <div className="text-center py-6">
                  <p className="text-sm text-muted mb-4">L'optimiseur testera 11 configurations d'Attaque et d'Élément sur le monstre cible, en adaptant automatiquement les points SP selon vos SL et le budget maximum de 486 points.</p>
                  <button className="btn btn-primary flex-center gap-2 mx-auto" onClick={runOptimization} type="button">
                    <Play size={16} /> Lancer la simulation PvE
                  </button>
                </div>
              )}

              {optimizing && (
                <div className="text-center py-8">
                  <RefreshCw size={36} className="animate-spin text-purple mb-3 mx-auto" />
                  <p className="text-sm font-medium">Simulation du preset {optimizeProgress} / {PRESET_TARGETS.length}...</p>
                  <div className="w-full bg-slate/20 h-2 rounded-full mt-3 overflow-hidden" style={{ maxWidth: '300px', margin: '15px auto 0' }}>
                    <div 
                      className="bg-purple h-full transition-all duration-300"
                      style={{ width: `${(optimizeProgress / PRESET_TARGETS.length) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              {optimizationResults.length > 0 && !optimizing && (
                <div className="flex-col gap-4">
                  <div className="flex-between">
                    <p className="text-xs text-muted">Résultats classés par dégâts maximum (coups critiques & doubles inclus) :</p>
                    <button className="btn-small border text-xs" onClick={runOptimization} type="button">
                      Recommencer
                    </button>
                  </div>
                  
                  <div className="flex-col gap-3 mt-2 scrollbar" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                    {optimizationResults.map((res, index) => {
                      const isBest = index === 0;
                      return (
                        <div key={index} className={`border rounded p-3 bg-slate/5 ${isBest ? 'border-yellow/50 bg-yellow/5' : 'border-slate/20'}`} style={{ marginBottom: '10px' }}>
                          <div className="flex-between flex-wrap gap-2">
                            <div>
                              <div className="flex-center gap-2">
                                <span className={`text-xs px-2 py-0.5 rounded font-bold ${isBest ? 'bg-yellow text-slate-900' : 'bg-slate text-light'}`}>
                                  #{index + 1}
                                </span>
                                <strong className="text-sm text-light">{res.presetName}</strong>
                              </div>
                              <div className="text-xs text-muted mt-1">
                                Cible finale : <span className="text-light font-medium">{res.targetAtt} Att / {res.targetEle} Ele</span> | 
                                Requis SP : <span className="text-purple font-medium">+{res.distribution.baseAtt} Att / +{res.distribution.baseEle} Ele</span> | 
                                Coût : <span className="text-light font-medium">{res.distribution.cost} / 486 pts</span>
                              </div>
                            </div>
                            
                            <button
                              className="btn btn-secondary text-xs flex-center gap-1 py-1 px-3 cursor-pointer"
                              onClick={() => {
                                setFormData(prev => ({
                                  ...prev,
                                  'specialist_points[1]': res.distribution.baseAtt,
                                  'specialist_points[2]': 0,
                                  'specialist_points[3]': res.distribution.baseEle,
                                  'specialist_points[4]': 0,
                                }));
                                setShowOptimizerModal(false);
                                calculateDamage({
                                  ...formData,
                                  'specialist_points[1]': res.distribution.baseAtt,
                                  'specialist_points[2]': 0,
                                  'specialist_points[3]': res.distribution.baseEle,
                                  'specialist_points[4]': 0,
                                });
                              }}
                              type="button"
                            >
                              Appliquer
                            </button>
                          </div>
                          
                          {/* Damages html display snippet */}
                          <div className="mt-2 bg-slate-950/60 p-2 rounded text-xs leading-relaxed border border-slate-900">
                            <div 
                              className="raw-result-html text-xs" 
                              dangerouslySetInnerHTML={{ __html: res.html }} 
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })()}

      {/* Save Build Modal */}
      {showSaveModal && (
        <div className="modal-overlay">
          <div className="modal-content config-card">
            <h3 className="modal-title"><Save size={18} /> Sauvegarder la configuration</h3>
            <p className="text-sm text-muted mb-4">Attribuez un nom à cette configuration (ex: Mage Acte 7, Archer Raid Fafnir) pour la retrouver plus tard.</p>
            
            <div className="input-field">
              <label>Nom de la sauvegarde</label>
              <input 
                type="text" 
                placeholder="Ex: Épéiste PvE A7"
                value={newBuildName}
                onChange={(e) => setNewBuildName(e.target.value)}
                autoFocus
              />
            </div>

            <div className="modal-actions mt-6 flex justify-end gap-3">
              <button className="btn border" onClick={() => setShowSaveModal(false)}>
                Annuler
              </button>
              <button className="btn btn-primary" onClick={handleSaveBuild} disabled={!newBuildName.trim()}>
                Confirmer la sauvegarde
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Buffs Selector Modal */}
      {showBuffSelect && (
        <div className="modal-overlay" onClick={() => setShowBuffSelect(null)}>
          <div className="modal-content config-card buff-modal scrollbar" onClick={(e) => e.stopPropagation()}>
            <div className="flex-between border-b pb-2 mb-4">
              <h3>{showBuffSelect === 'player' ? 'Sélectionner un Buff joueur' : 'Sélectionner un Débuff monstre'}</h3>
              <button className="close-btn" onClick={() => setShowBuffSelect(null)}>
                <X size={18} />
              </button>
            </div>

            <div className="search-box mb-4">
              <Search className="search-icon" size={16} />
              <input 
                type="text" 
                placeholder="Rechercher un buff..."
                value={buffSearch}
                onChange={(e) => setBuffSearch(e.target.value)}
              />
            </div>

            <div className="buffs-selection-list">
              {getFilteredBuffs(showBuffSelect).slice(0, 100).map(b => {
                const isActive = showBuffSelect === 'player' 
                  ? !!formData.buffs[b.group] && formData.buffs[b.group].id === b.id
                  : !!formData.monster_buffs[b.group] && formData.monster_buffs[b.group].id === b.id;
                
                return (
                  <button
                    key={b.id}
                    className={`buff-selection-item ${isActive ? 'active' : ''}`}
                    onClick={() => {
                      if (showBuffSelect === 'player') {
                        toggleBuff('buffs', b);
                      } else {
                        toggleBuff('monster_buffs', b);
                      }
                      setShowBuffSelect(null);
                      setBuffSearch('');
                    }}
                  >
                    <div className="flex-col text-left">
                      <span className="font-semibold text-sm">{b.text}</span>
                      <span className="text-xs text-muted">Groupe {b.group}</span>
                    </div>
                    {isActive && <span className="active-dot"></span>}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Equipment Selector Modal */}
      {showEquipSelect !== null && (() => {
        const slotId = showEquipSelect;
        const slotInfo = SLOT_INFOS[slotId];
        const allItems = itemsData[slotId] || [];
        
        // Filter items
        const userClassBit = 1 << formData.class;
        const filteredItems = allItems.filter(item => {
          if (equipSearch && !item.name.toLowerCase().includes(equipSearch.toLowerCase())) {
            return false;
          }
          if (item.class === null || item.class === undefined) return true;
          return (item.class & userClassBit) !== 0;
        });

        return (
          <div className="modal-overlay" onClick={() => setShowEquipSelect(null)}>
            <div className="modal-content config-card buff-modal scrollbar" onClick={(e) => e.stopPropagation()}>
              <div className="flex-between border-b pb-2 mb-4">
                <h3>Choisir : {slotInfo.name}</h3>
                <button className="close-btn" onClick={() => setShowEquipSelect(null)}>
                  <X size={18} />
                </button>
              </div>

              <div className="search-box mb-4">
                <Search className="search-icon" size={16} />
                <input 
                  type="text" 
                  placeholder="Rechercher un équipement..."
                  value={equipSearch}
                  onChange={(e) => setEquipSearch(e.target.value)}
                  autoFocus
                />
              </div>

              {/* Unequip action */}
              <button
                className="btn border w-full mb-4 text-xs font-semibold py-2 flex-center justify-center gap-2"
                onClick={() => {
                  handleEquipItem(slotId, null);
                  setShowEquipSelect(null);
                }}
              >
                <Trash2 size={14} /> Retirer l'équipement (Vide)
              </button>

              <div className="buffs-selection-list">
                {filteredItems.slice(0, 100).map(item => {
                  const isEquipped = formData.equipments[slotId] === item.id;
                  return (
                    <button
                      key={item.id}
                      className={`buff-selection-item ${isEquipped ? 'active' : ''}`}
                      onClick={() => {
                        handleEquipItem(slotId, item);
                        setShowEquipSelect(null);
                      }}
                    >
                      <div className="flex-center gap-3 text-left">
                        <div className="equip-slot-icon small">
                          <img src={`https://nosapki.com/images/icons/${item.icon}.png`} alt={item.name} className="w-8 h-8 object-contain" />
                        </div>
                        <span className="font-semibold text-xs text-light">
                          {item.name.replace(/\[Abandonner\],?\s*/, '').replace(/\[Commerce\],?\s*/, '').replace(/\[Vente\],?\s*/, '').replace(/Impossible/, '').trim()}
                        </span>
                      </div>
                      {isEquipped && <span className="active-dot"></span>}
                    </button>
                  );
                })}
                {filteredItems.length === 0 && (
                  <p className="empty-text text-center">Aucun équipement trouvé.</p>
                )}
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

export default App;
