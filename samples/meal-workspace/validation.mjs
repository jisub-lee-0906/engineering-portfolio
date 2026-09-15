// Newly extracted/adapted on 2026-09-15. See README.md for origin and limits.
// No catalog, storage, network, or application dependencies.

export const SLOT_KEYS = ['rice', 'soup', 'main', 'side1', 'side2', 'kimchi', 'dessert'];

const DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;
const MAX_DAYS = 3660;
const MAX_NAME_LENGTH = 120;
const MAX_NOTE_LENGTH = 500;

function dateFromKey(value) {
  const match = DATE_PATTERN.exec(value);
  if (!match) throw new Error(`Invalid local date: ${value}`);
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (year === 0) throw new Error(`Invalid local date: ${value}`);

  const date = new Date(year, month - 1, day, 12, 0, 0, 0);
  // Date treats years 0..99 as 1900..1999 unless corrected explicitly.
  if (year < 100) date.setFullYear(year);
  if (
    Number.isNaN(date.getTime()) ||
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    throw new Error(`Invalid local date: ${value}`);
  }
  return date;
}


function isRecord(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function isMenu(value) {
  if (!isRecord(value)) return false;
  const keys = Object.keys(value);
  if (keys.length !== SLOT_KEYS.length || keys.some((key) => !SLOT_KEYS.includes(key))) return false;
  return SLOT_KEYS.every((key) => typeof value[key] === 'string' && value[key].length <= MAX_NAME_LENGTH);
}

function cloneMenu(menu) {
  return Object.fromEntries(SLOT_KEYS.map((key) => [key, menu[key]]));
}

export function parsePlanDays(value) {
  if (!isRecord(value)) throw new Error('Plan days must be an object');
  const entries = Object.entries(value);
  if (entries.length > MAX_DAYS) throw new Error(`Plan days cannot exceed ${MAX_DAYS}`);

  const parsed = {};
  for (const [dateKey, rawDay] of entries) {
    dateFromKey(dateKey);
    if (!isRecord(rawDay)) throw new Error(`Invalid planned day: ${dateKey}`);
    const keys = Object.keys(rawDay);
    if (keys.length !== 3 || !['menu', 'note', 'noSchool'].every((key) => keys.includes(key))) {
      throw new Error(`Invalid planned day shape: ${dateKey}`);
    }
    if (!isMenu(rawDay.menu)) throw new Error(`Invalid menu: ${dateKey}`);
    if (typeof rawDay.note !== 'string' || rawDay.note.length > MAX_NOTE_LENGTH) {
      throw new Error(`Invalid note: ${dateKey}`);
    }
    if (typeof rawDay.noSchool !== 'boolean') throw new Error(`Invalid no-school flag: ${dateKey}`);
    parsed[dateKey] = { menu: cloneMenu(rawDay.menu), note: rawDay.note, noSchool: rawDay.noSchool };
  }
  return parsed;
}


export function parseBackup(text) {
  let value;
  try {
    value = JSON.parse(text);
  } catch {
    throw new Error('Backup must be valid JSON');
  }
  if (!isRecord(value) || Object.keys(value).length !== 2 || value.version !== 1 || !Object.hasOwn(value, 'days')) {
    throw new Error('Backup must be an exact version 1 envelope');
  }
  return { version: 1, days: parsePlanDays(value.days) };
}

export function createBackup(days) {
  return JSON.stringify({ version: 1, days: parsePlanDays(days) });
}
function record(value){return !!value&&typeof value==='object'&&!Array.isArray(value);}
export function parseNames(value){if(!Array.isArray(value)||value.length>10000||!value.every(x=>typeof x==='string'&&x.length<=120))throw new Error('제외 목록 형식이 올바르지 않습니다.');return [...new Set(value)];}
export function parseMenus(value){if(!Array.isArray(value)||value.length>2000||!value.every(isMenu))throw new Error('저장된 식단 형식이 올바르지 않습니다.');return value;}
// filterKeys replaces the private application DEFAULT_MENU_FILTERS dependency.
// The caller supplies its schema; this sample intentionally has no catalog defaults.
export function parseWorkspace(text, filterKeys){
 if(!Array.isArray(filterKeys)||!filterKeys.every(key=>typeof key==='string')) throw new Error('filterKeys must be an array of strings');
 const value=JSON.parse(text);
 if(!record(value)||value.version!==1||!isMenu(value.menu)||!record(value.locked)||!record(value.filters))throw new Error('저장 데이터 버전 또는 형식이 올바르지 않습니다.');
 const locked=value.locked,filters=value.filters;
 if(!SLOT_KEYS.every(key=>typeof locked[key]==='boolean')||!filterKeys.every(key=>typeof filters[key]==='boolean'))throw new Error('저장된 추천 조건 형식이 올바르지 않습니다.');
 return {version:1,menu:value.menu,locked:Object.fromEntries(SLOT_KEYS.map(key=>[key,locked[key]])),filters:Object.fromEntries(filterKeys.map(key=>[key,filters[key]])),excluded:parseNames(value.excluded),favorites:parseMenus(value.favorites),history:parseMenus(value.history),days:parsePlanDays(value.days)};
}
