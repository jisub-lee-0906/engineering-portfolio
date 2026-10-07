'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');

let TEMP_DIR;

function parseCsv(text) {
  const lines = text.trim().split(/\r?\n/);
  const headers = lines.shift().split(',');
  return lines.map((line) => Object.fromEntries(line.split(',').map((value, i) => [headers[i], value])));
}

function validate(assets, identities) {
  const issues = [];
  const seen = new Set();
  for (const asset of assets) {
    if (seen.has(asset.asset_id)) issues.push(`DUPLICATE_ASSET_ID:${asset.asset_id}`);
    seen.add(asset.asset_id);
  }
  for (const identity of identities) {
    if (identity.employment_status === 'retired' && identity.account_status === 'active') {
      issues.push(`RETIRED_ACTIVE_ACCOUNT:${identity.employee_id}`);
    }
  }
  return issues.sort();
}

async function writeCase(name, assetsCsv, identities) {
  const dir = path.join(TEMP_DIR, name);
  await fs.mkdir(dir, { recursive: true });
  const csvPath = path.join(dir, 'assets.csv');
  const jsonPath = path.join(dir, 'identities.json');
  await fs.writeFile(csvPath, assetsCsv, 'utf8');
  await fs.writeFile(jsonPath, JSON.stringify(identities, null, 2), 'utf8');
  return { csvPath, jsonPath };
}

async function checkCase(name, expected, assetsCsv, identities) {
  const files = await writeCase(name, assetsCsv, identities);
  const assets = parseCsv(await fs.readFile(files.csvPath, 'utf8'));
  const accounts = JSON.parse(await fs.readFile(files.jsonPath, 'utf8'));
  const actual = validate(assets, accounts);
  assert.deepEqual(actual, expected);
  console.log(`PASS ${name}: ${actual.length ? actual.join('|') : 'VALID'}`);
}

async function main() {
  TEMP_DIR = await fs.mkdtemp(path.join(__dirname, '.tmp-fixtures-'));
  try {
    await checkCase(
      'duplicate-asset',
      ['DUPLICATE_ASSET_ID:A-100'],
      'asset_id,owner_id,status\nA-100,E-001,assigned\nA-100,E-002,assigned\n',
      [{ employee_id: 'E-001', employment_status: 'active', account_status: 'active' }]
    );
    await checkCase(
      'retired-active-account',
      ['RETIRED_ACTIVE_ACCOUNT:E-009'],
      'asset_id,owner_id,status\nA-200,E-009,returned\n',
      [{ employee_id: 'E-009', employment_status: 'retired', account_status: 'active' }]
    );
    await checkCase(
      'valid',
      [],
      'asset_id,owner_id,status\nA-300,E-003,assigned\nA-301,E-004,stock\n',
      [
        { employee_id: 'E-003', employment_status: 'active', account_status: 'active' },
        { employee_id: 'E-004', employment_status: 'retired', account_status: 'disabled' }
      ]
    );
    console.log('RESULT 3/3 deterministic cases passed');
  } finally {
    await fs.rm(TEMP_DIR, { recursive: true, force: true });
  }
}

main().catch((error) => {
  console.error(`FAIL ${error.code || error.name}: ${error.message}`);
  process.exitCode = 1;
});
