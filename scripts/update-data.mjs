import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const DATA_DIR = path.join(ROOT_DIR, 'src', 'data');

// Known titles info (names and tooltips for recent titles)
const KNOWN_TITLE_INFO = {
  13056: { name: "Achille : Gardien des dimensions", tooltip: "Les points de compétence de l'élément de ton spécialiste augmentent de 2., L'élément Obscurité augmente de 5." },
  13057: { name: "Amiral Yi : Gardien des dimensions", tooltip: "Les points de compétence de l'élément de ton spécialiste augmentent de 2., L'élément Eau augmente de 5." },
  13058: { name: "Merlin : Gardien des dimensions", tooltip: "Les points de compétence de l'élément de ton spécialiste augmentent de 2., L'élément Lumière augmente de 5." },
  13059: { name: "Thor : Gardien des dimensions", tooltip: "Les points de compétence de l'élément de ton spécialiste augmentent de 2., L'élément Eau augmente de 5." },
  13060: { name: "Héros des dimensions", tooltip: "Chaque élément augmente de 3., La résistance aux éléments augmente de 5." },
  13065: { name: "Roi de la perfection", tooltip: "Tous les points de compétence de ton spécialiste augmentent de 5., Toutes les attaques augmentent de 8%." },
  13066: { name: "Poissard", tooltip: "Aucun bonus actif" },
  13067: { name: "Maitre des dimensions", tooltip: "Tous les points de compétence de ton spécialiste augmentent de 3., L'élément de la fée équipée augmente de 15., La vitesse de déplacement augmente de 1." },
  13068: { name: "Immortel", tooltip: "Toutes les attaques augmentent de 8%., La vitesse de déplacement augmente de 2." },
  13069: { name: "Dieu des catacombes", tooltip: "Toutes les attaques augmentent de 10%., Toutes les attaques augmentent de 7 % dans les Catacombes de la Tour céleste." },
  13070: { name: "Spécialiste des catacombes", tooltip: "Toutes les attaques augmentent de 15 % dans les Catacombes de la Tour céleste." }
};

function cleanItemName(str) {
  if (!str) return '';
  return str
    .replace(/&lt;br&gt;/gi, ' ')
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/&amp;#039;/g, "'")
    .replace(/&#039;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .replace(/\u00a0/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function cleanTitleName(str) {
  if (!str) return '';
  return str
    .split('&lt;br&gt;')[0]
    .split(/<br\s*\/?>/i)[0]
    .replace(/&amp;#039;/g, "'")
    .replace(/&#039;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .replace(/\u00a0/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

async function main() {
  console.log('🔄 Téléchargement de la page https://nosapki.com/fr/calculators/dmg_pve ...');
  const response = await fetch('https://nosapki.com/fr/calculators/dmg_pve', {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
  });

  if (!response.ok) {
    throw new Error(`Erreur HTTP lors du téléchargement : ${response.status} ${response.statusText}`);
  }

  const html = await response.text();
  console.log(`✅ Page téléchargée avec succès (${Math.round(html.length / 1024)} Ko).`);

  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  // 1. MONSTRES
  console.log('📦 Mise à jour des monstres (monsters.json)...');
  const monstersMatch = html.match(/var monsters_list\s*=\s*(\[[\s\S]*?\])\s*;?\s*<\/script>/);
  if (monstersMatch) {
    const monsters = JSON.parse(monstersMatch[1]);
    fs.writeFileSync(path.join(DATA_DIR, 'monsters.json'), JSON.stringify(monsters, null, 2), 'utf8');
    console.log(`   👉 ${monsters.length} monstres enregistrés.`);
  } else {
    console.warn('   ⚠️ Impossible d\'extraire monsters_list.');
  }

  // 2. BUFFS & MONSTER BUFFS
  console.log('📦 Mise à jour des buffs et debuffs monstres (buffs.json)...');
  const buffsMatch = html.match(/var buffs_list\s*=\s*(\[[\s\S]*?\])\s*;?\s*<\/script>/);
  const monsterBuffsMatch = html.match(/var monster_buffs_list\s*=\s*(\[[\s\S]*?\])\s*;?\s*<\/script>/);
  if (buffsMatch && monsterBuffsMatch) {
    const buffs = JSON.parse(buffsMatch[1]);
    const monsterBuffs = JSON.parse(monsterBuffsMatch[1]);
    const buffsData = {
      monster_buffs: monsterBuffs,
      buffs: buffs
    };
    fs.writeFileSync(path.join(DATA_DIR, 'buffs.json'), JSON.stringify(buffsData, null, 2), 'utf8');
    console.log(`   👉 ${buffs.length} buffs joueur et ${monsterBuffs.length} buffs monstres enregistrés.`);
  } else {
    console.warn('   ⚠️ Impossible d\'extraire buffs_list ou monster_buffs_list.');
  }

  // 3. ÉQUIPEMENTS & OBJETS (SLOTS 0 À 17)
  console.log('📦 Mise à jour des équipements (items.json)...');
  const itemsData = {};
  let totalItems = 0;
  for (let slot = 0; slot <= 17; slot++) {
    const marker = `data-slot="${slot}"`;
    const slotIdx = html.indexOf(marker);
    if (slotIdx === -1) {
      itemsData[String(slot)] = [];
      continue;
    }
    const nextSlotIdx = html.indexOf('class="equipments_slot_group"', slotIdx + 1);
    let endIdx;
    if (nextSlotIdx !== -1) {
      endIdx = nextSlotIdx;
    } else {
      const tgMatch = html.substring(slotIdx).match(/class=['\"]titles_group['\"]/);
      endIdx = tgMatch ? slotIdx + tgMatch.index : html.indexOf('titles_group', slotIdx);
    }
    const slotHtml = html.substring(slotIdx, endIdx !== -1 ? endIdx : html.length);

    const matches = [...slotHtml.matchAll(/<div[^>]*class=['\"][^'\"]*nt-slot-item[^'\"]*['\"]([^>]*)>[\s\S]*?<img[^>]*data-src=['\"]([^'\"]*)['\"][^>]*>[\s\S]*?<\/div>/g)];
    const items = matches
      .filter(m => !m[1].includes('data-id="any"'))
      .map(m => {
        const attrs = m[1];
        const imgSrc = m[2];
        const id = parseInt(attrs.match(/data-id=['\"](\d+)['\"]/)?.[1] || '0', 10);
        if (!id || isNaN(id) || id <= 0) return null;
        const name = cleanItemName(attrs.match(/data-name=['\"]([^'\"]*)['\"]/)?.[1] || '');
        const cls = attrs.match(/data-class=['\"]?(\d+)['\"]?/)?.[1];
        const sp = attrs.match(/data-sp=['\"]?(-?\d+)['\"]?/)?.[1];
        const icon = imgSrc.match(/\/images\/icons\/(\d+)\.png/)?.[1] || '';
        
        const obj = { id, name };
        if (cls !== undefined) obj.class = parseInt(cls, 10);
        if (icon) obj.icon = icon;
        if (sp !== undefined) obj.sp = parseInt(sp, 10);
        return obj;
      })
      .filter(Boolean);

    itemsData[String(slot)] = items;
    totalItems += items.length;
  }
  fs.writeFileSync(path.join(DATA_DIR, 'items.json'), JSON.stringify(itemsData, null, 2), 'utf8');
  console.log(`   👉 ${totalItems} objets enregistrés sur 18 slots (incluant ${itemsData['12']?.length || 0} cartes SP).`);

  // 4. COMPÉTENCES PASSIVES (passive_skills.json)
  console.log('📦 Mise à jour des compétences passives (passive_skills.json)...');
  const pIndices = [...html.matchAll(/class=\"passive_skills_group\"/g)].map(m => m.index);
  const passiveGroups = [];
  for (let i = 0; i < pIndices.length; i++) {
    const start = pIndices[i];
    const end = i + 1 < pIndices.length ? pIndices[i + 1] : html.indexOf('class="family_effects_group"');
    const groupHtml = html.substring(start, end);
    const items = [...groupHtml.matchAll(/<div[^>]*class=['\"][^'\"]*nt-slot-skill[^'\"]*['\"]([^>]*)>[\s\S]*?<img[^>]*data-src=['\"]([^'\"]*)['\"][^>]*>[\s\S]*?<\/div>/g)].map(m => {
      const attrs = m[1];
      const imgSrc = m[2];
      const id = parseInt(attrs.match(/data-id=['\"](\d+)['\"]/)?.[1] || '0', 10);
      const name = cleanItemName(attrs.match(/data-name=['\"]([^'\"]*)['\"]/)?.[1] || '');
      const level = attrs.match(/data-level=['\"]?(\d+)['\"]?/)?.[1];
      const icon = imgSrc.match(/\/images\/icons\/(\d+)\.png/)?.[1] || '';
      const obj = { id, name };
      if (level !== undefined) obj.level = parseInt(level, 10);
      if (icon) obj.icon = icon;
      return obj;
    });
    passiveGroups.push({ groupId: i, items });
  }
  fs.writeFileSync(path.join(DATA_DIR, 'passive_skills.json'), JSON.stringify(passiveGroups, null, 2), 'utf8');
  console.log(`   👉 ${passiveGroups.length} groupes passifs (${passiveGroups.reduce((a, b) => a + b.items.length, 0)} compétences) enregistrés.`);

  // 5. EFFETS DE FAMILLE (family_effects.json)
  console.log('📦 Mise à jour des effets de famille (family_effects.json)...');
  const fIndices = [...html.matchAll(/class=\"family_effects_group\"/g)].map(m => m.index);
  const familyGroups = [];
  for (let i = 0; i < fIndices.length; i++) {
    const start = fIndices[i];
    const end = i + 1 < fIndices.length ? fIndices[i + 1] : html.indexOf('class="equipments_slot_group"');
    const groupHtml = html.substring(start, end);
    const gIdMatch = groupHtml.match(/data-group=['\"]?(\d+)['\"]?/);
    const groupId = gIdMatch ? parseInt(gIdMatch[1], 10) : i;
    const items = [...groupHtml.matchAll(/<div[^>]*class=['\"][^'\"]*nt-slot-item[^'\"]*['\"]([^>]*)>[\s\S]*?<img[^>]*data-src=['\"]([^'\"]*)['\"][^>]*>[\s\S]*?<\/div>/g)].map(m => {
      const attrs = m[1];
      const imgSrc = m[2];
      const id = parseInt(attrs.match(/data-id=['\"](\d+)['\"]/)?.[1] || '0', 10);
      const name = cleanItemName(attrs.match(/data-name=['\"]([^'\"]*)['\"]/)?.[1] || '');
      const amount = attrs.match(/data-amount=['\"]?(\d+)['\"]?/)?.[1];
      const level = attrs.match(/data-level=['\"]?(\d+)['\"]?/)?.[1];
      const icon = imgSrc.match(/\/images\/icons\/(\d+)\.png/)?.[1] || '';
      const obj = { id, name };
      if (amount !== undefined) obj.amount = parseInt(amount, 10);
      if (level !== undefined) obj.level = parseInt(level, 10);
      if (icon) obj.icon = icon;
      return obj;
    });
    familyGroups.push({ groupId, items });
  }
  fs.writeFileSync(path.join(DATA_DIR, 'family_effects.json'), JSON.stringify(familyGroups, null, 2), 'utf8');
  console.log(`   👉 ${familyGroups.length} groupes de famille (${familyGroups.reduce((a, b) => a + b.items.length, 0)} effets) enregistrés.`);

  // 6. COMPÉTENCES (skills.json)
  console.log('📦 Mise à jour des compétences d\'attaque (skills.json)...');
  const skillsStart = html.indexOf("class='skills_group");
  const skillsEnd = html.indexOf('class="skill_upgrades_group"', skillsStart);
  if (skillsStart !== -1 && skillsEnd !== -1) {
    const skillsSection = html.substring(skillsStart, skillsEnd);
    const matches = [...skillsSection.matchAll(/<div[^>]*class=['\"][^'\"]*nt-slot-skill[^'\"]*['\"]([^>]*)>[\s\S]*?<img[^>]*data-src=['\"]([^'\"]*)['\"][^>]*>[\s\S]*?<\/div>/g)];
    const skills = matches.map(m => {
      const attrs = m[1];
      const imgSrc = m[2];
      const id = parseInt(attrs.match(/data-id=['\"](\d+)['\"]/)?.[1] || '0', 10);
      const name = cleanItemName(attrs.match(/data-name=['\"]([^'\"]*)['\"]/)?.[1] || '');
      const cls = attrs.match(/data-class=['\"]?(\d+)['\"]?/)?.[1];
      const sp = attrs.match(/data-sp=['\"]?(-?\d+)['\"]?/)?.[1];
      const icon = imgSrc.match(/\/images\/icons\/(\d+)\.png/)?.[1] || '';
      const obj = { id, name };
      if (cls !== undefined) obj.class = parseInt(cls, 10);
      if (sp !== undefined) obj.sp = parseInt(sp, 10);
      if (icon) obj.icon = icon;
      return obj;
    });
    fs.writeFileSync(path.join(DATA_DIR, 'skills.json'), JSON.stringify(skills, null, 2), 'utf8');
    console.log(`   👉 ${skills.length} compétences enregistrées.`);
  }

  // 7. AMÉLIORATIONS DE COMPÉTENCES (skill_upgrades.json)
  console.log('📦 Mise à jour des améliorations de compétences (skill_upgrades.json)...');
  const suIndices = [...html.matchAll(/class=\"skill_upgrades_group\"/g)].map(m => m.index);
  const suItemsList = [];
  for (let i = 0; i < suIndices.length; i++) {
    const start = suIndices[i];
    const end = i + 1 < suIndices.length ? suIndices[i + 1] : html.indexOf('var buffs_list');
    const groupHtml = html.substring(start, end);
    const items = [...groupHtml.matchAll(/<div[^>]*class=['\"][^'\"]*nt-slot-skill[^'\"]*['\"]([^>]*)>[\s\S]*?<img[^>]*data-src=['\"]([^'\"]*)['\"][^>]*>[\s\S]*?<\/div>/g)].map(m => {
      const attrs = m[1];
      const imgSrc = m[2];
      const id = parseInt(attrs.match(/data-id=['\"](\d+)['\"]/)?.[1] || '0', 10);
      const name = cleanItemName(attrs.match(/data-name=['\"]([^'\"]*)['\"]/)?.[1] || '');
      const skillId = attrs.match(/data-skill=['\"]?(\d+)['\"]?/)?.[1];
      const icon = imgSrc.match(/\/images\/icons\/(\d+)\.png/)?.[1] || '';
      const obj = { id, name };
      if (skillId !== undefined) obj.skillId = parseInt(skillId, 10);
      if (icon) obj.icon = icon;
      obj.group = i;
      return obj;
    });
    suItemsList.push(...items);
  }
  fs.writeFileSync(path.join(DATA_DIR, 'skill_upgrades.json'), JSON.stringify(suItemsList, null, 2), 'utf8');
  console.log(`   👉 ${suItemsList.length} améliorations de compétences enregistrées.`);

  // 8. CONSOMMABLES NOSMALL (consumables.json)
  console.log('📦 Mise à jour des consommables Nosmall (consumables.json)...');
  const consStart = html.indexOf("class='nosmall_consumable_items_group");
  const consEnd = html.indexOf("class='skills_group", consStart);
  const consumables = [];
  if (consStart !== -1 && consEnd !== -1) {
    const consSection = html.substring(consStart, consEnd);
    const matches = [...consSection.matchAll(/<div[^>]*class=['\"][^'\"]*nt-slot-item[^'\"]*['\"]([^>]*)>[\s\S]*?<img[^>]*data-src=['\"]([^'\"]*)['\"][^>]*>[\s\S]*?<\/div>/g)];
    matches.forEach(m => {
      const attrs = m[1];
      const imgSrc = m[2];
      const id = parseInt(attrs.match(/data-id=['\"](\d+)['\"]/)?.[1] || '0', 10);
      const name = cleanTitleName(attrs.match(/data-name=['\"]([^'\"]*)['\"]/)?.[1] || '');
      const icon = imgSrc.match(/\/images\/icons\/(\d+)\.png/)?.[1] || '';
      consumables.push({ id, name, icon });
    });
  }
  // Si le parsing a échoué ou si la liste est vide, fallback sur les consommables connus
  if (consumables.length === 0) {
    consumables.push(
      { id: 5655, name: "Médaille d'anniversaire", icon: "7495" },
      { id: 13306, name: "Ordre héroïque", icon: "7243" }
    );
  }
  fs.writeFileSync(path.join(DATA_DIR, 'consumables.json'), JSON.stringify(consumables, null, 2), 'utf8');
  console.log(`   👉 ${consumables.length} consommables enregistrés.`);

  // 9. TITRES (titles.json)
  console.log('📦 Mise à jour des titres (titles.json)...');
  let currentTitles = [];
  const titlesFilePath = path.join(DATA_DIR, 'titles.json');
  if (fs.existsSync(titlesFilePath)) {
    try {
      currentTitles = JSON.parse(fs.readFileSync(titlesFilePath, 'utf8'));
    } catch {
      currentTitles = [];
    }
  }

  const titlesById = new Map();
  // Toujours avoir le titre "Aucun Titre" en ID 0
  titlesById.set(0, { id: 0, name: "Aucun Titre", tooltip: "Aucun bonus actif" });

  // Récupérer les titres existants
  for (const t of currentTitles) {
    titlesById.set(t.id, t);
  }

  // Titres connus / récents ajoutés par défaut
  for (const [idStr, info] of Object.entries(KNOWN_TITLE_INFO)) {
    const id = parseInt(idStr, 10);
    if (!titlesById.has(id)) {
      titlesById.set(id, { id, name: info.name, tooltip: info.tooltip });
    } else {
      const existing = titlesById.get(id);
      if (!existing.name || existing.name.startsWith('Titre #')) {
        existing.name = info.name;
      }
      if (!existing.tooltip || existing.tooltip === "Aucun bonus actif") {
        existing.tooltip = info.tooltip;
      }
    }
  }

  // Extraire les titres du calculateur NosApki
  const titlesStart = html.indexOf("class='titles_group");
  const titlesEnd = html.indexOf("class='nosmall_consumable_items_group", titlesStart);
  if (titlesStart !== -1 && titlesEnd !== -1) {
    const titlesSection = html.substring(titlesStart, titlesEnd);
    const matches = [...titlesSection.matchAll(/<div[^>]*data-id=['\"](\d+)['\"][^>]*data-name=['\"]([^'\"]*)['\"][^>]*>/g)];
    for (const m of matches) {
      const id = parseInt(m[1], 10);
      const name = cleanTitleName(m[2]);
      if (titlesById.has(id)) {
        const existing = titlesById.get(id);
        existing.name = name; // mettre à jour le nom
        if (KNOWN_TITLE_INFO[id] && (!existing.tooltip || existing.tooltip === "Aucun bonus actif")) {
          existing.tooltip = KNOWN_TITLE_INFO[id].tooltip;
        }
      } else {
        const tooltip = KNOWN_TITLE_INFO[id]?.tooltip || "Aucun bonus actif";
        titlesById.set(id, { id, name, tooltip });
      }
    }
  }

  // Trier les titres : 0 en premier, puis par ID décroissant
  const sortedTitles = Array.from(titlesById.values()).sort((a, b) => {
    if (a.id === 0) return -1;
    if (b.id === 0) return 1;
    return b.id - a.id;
  });

  fs.writeFileSync(titlesFilePath, JSON.stringify(sortedTitles, null, 2), 'utf8');
  console.log(`   👉 ${sortedTitles.length} titres enregistrés dans titles.json.`);

  console.log('\n✨ Toutes les données ont été mises à jour avec succès depuis NosApki !');
}

main().catch(err => {
  console.error('❌ Erreur lors de la mise à jour des données :', err);
  process.exit(1);
});
