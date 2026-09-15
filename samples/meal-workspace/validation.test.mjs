import { SLOT_KEYS, isMenu, parsePlanDays, parseBackup, createBackup, parseNames, parseMenus, parseWorkspace } from './validation.mjs';

// All names, notes, dates, and filter settings are synthetic, created for this sample.
const menu = () => Object.fromEntries(SLOT_KEYS.map((key, i) => [key, 'fixture-' + i]));
const day = () => ({ menu: menu(), note: 'Synthetic note', noSchool: false });
const workspace = () => ({ version: 1, menu: menu(), locked: Object.fromEntries(SLOT_KEYS.map(k => [k, false])), filters: { syntheticPreference: true }, excluded: [], favorites: [], history: [], days: { '2024-02-29': day() } });
const equal = (actual, expected) => { if (JSON.stringify(actual) !== JSON.stringify(expected)) throw new Error('Values differ'); };
const rejects = (fn) => { let threw = false; try { fn(); } catch { threw = true; } if (!threw) throw new Error('Expected rejection'); };
const tests = [];
const test = (name, fn) => tests.push([name, fn]);
const readWorkspace = value => parseWorkspace(JSON.stringify(value), ['syntheticPreference']);
const invalidWorkspace = mutate => { const value = workspace(); mutate(value); rejects(() => readWorkspace(value)); };
const daysOf = count => Object.fromEntries(Array.from({ length: count }, (_, i) => {
  const d = new Date(Date.UTC(2020, 0, i + 1)); return [d.toISOString().slice(0, 10), day()];
}));

test('workspace success', () => equal(readWorkspace(workspace()), workspace()));
test('backup round trip', () => { const days = workspace().days; equal(parseBackup(createBackup(days)), { version: 1, days }); });
test('empty plans accepted', () => equal(parsePlanDays({}), {}));
test('names deduplicated in encounter order', () => equal(parseNames(['a', 'b', 'a']), ['a', 'b']));
test('malformed JSON rejected', () => { rejects(() => parseBackup('{')); rejects(() => parseWorkspace('{', [])); });
test('wrong backup version', () => rejects(() => parseBackup(JSON.stringify({version: 2, days: {}}))));
test('extra backup field', () => rejects(() => parseBackup(JSON.stringify({version: 1, days: {}, extra: true}))));
test('missing backup days', () => rejects(() => parseBackup(JSON.stringify({version: 1}))));
test('wrong workspace version', () => invalidWorkspace(v => v.version = '1'));
test('non-object workspace', () => rejects(() => readWorkspace([])));
test('wrong lock type', () => invalidWorkspace(v => v.locked.rice = 1));
test('missing filter', () => invalidWorkspace(v => v.filters = {}));
test('wrong filter type', () => invalidWorkspace(v => v.filters.syntheticPreference = 'true'));
test('invalid caller schema', () => rejects(() => parseWorkspace('{}', null)));
test('wrong menu value type', () => equal(isMenu({...menu(), rice: 1}), false));
test('extra menu key', () => equal(isMenu({...menu(), extra: ''}), false));
test('missing menu key', () => { const m = menu(); delete m.rice; equal(isMenu(m), false); });
test('menu name length boundary', () => { equal(isMenu({...menu(), rice: 'x'.repeat(120)}), true); equal(isMenu({...menu(), rice: 'x'.repeat(121)}), false); });
test('names length and types', () => { equal(parseNames(['x'.repeat(120)]).length, 1); rejects(() => parseNames(['x'.repeat(121)])); rejects(() => parseNames([1])); });
test('excluded list count boundary', () => { equal(parseNames(Array(10000).fill('x')), ['x']); rejects(() => parseNames(Array(10001).fill('x'))); });
test('menu list count boundary', () => { equal(parseMenus(Array(2000).fill(menu())).length, 2000); rejects(() => parseMenus(Array(2001).fill(menu()))); });
test('invalid favorite and history', () => { invalidWorkspace(v => v.favorites = [{}]); invalidWorkspace(v => v.history = 'invalid'); });
test('non-object days', () => { rejects(() => parsePlanDays([])); rejects(() => parsePlanDays(null)); });
test('invalid calendar dates', () => { for (const key of ['2023-02-29', '2024-13-01', '0000-01-01', '2024-2-01']) rejects(() => parsePlanDays({[key]: day()})); });
test('small year accepted', () => equal(Object.keys(parsePlanDays({'0001-01-01': day()})), ['0001-01-01']));
test('day shape and flags', () => { rejects(() => parsePlanDays({'2024-01-01': {...day(), extra: 1}})); rejects(() => parsePlanDays({'2024-01-01': {...day(), noSchool: 'false'}})); });
test('note type and length boundary', () => { parsePlanDays({'2024-01-01': {...day(), note: 'x'.repeat(500)}}); rejects(() => parsePlanDays({'2024-01-01': {...day(), note: 'x'.repeat(501)}})); rejects(() => parsePlanDays({'2024-01-01': {...day(), note: null}})); });
test('day count boundary', () => { equal(Object.keys(parsePlanDays(daysOf(3660))).length, 3660); rejects(() => parsePlanDays(daysOf(3661))); });
test('parsed days clone menus', () => { const input = {'2024-01-01': day()}; const output = parsePlanDays(input); output['2024-01-01'].menu.rice = 'changed'; equal(input['2024-01-01'].menu.rice, 'fixture-0'); });
test('no-school flag preserves menu', () => { const d = {...day(), noSchool: true}; equal(parsePlanDays({'2024-01-01': d})['2024-01-01'], d); });
test('workspace projects known lock and filter keys', () => { const v = workspace(); v.locked.extra = 1; v.filters.extra = 1; v.extra = true; equal(readWorkspace(v), workspace()); });

let passed = 0;
for (const [name, fn] of tests) { fn(); passed++; console.log('PASS ' + name); }
console.log(passed + '/' + tests.length + ' tests passed');
