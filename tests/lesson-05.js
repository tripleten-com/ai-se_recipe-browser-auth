'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const failures = [];

function read(relPath) {
  try { return fs.readFileSync(path.join(ROOT, relPath), 'utf8'); }
  catch { return null; }
}

function has(content, str) {
  if (!content) return false;
  return content.replace(/\s+/g, ' ').includes(str.replace(/\s+/g, ' '));
}

function check(label, pass, hint) {
  if (!pass) failures.push({ label, hint });
}

const api = read('client/src/utils/api.ts');

check('request reads the stored token from localStorage',
  has(api, 'localStorage.getItem') && has(api, 'auth-token'),
  'Add const token = localStorage.getItem("auth-token") ?? "" inside the request function');

check('request includes an Authorization header',
  has(api, 'Authorization'),
  'Add Authorization: `Bearer ${token}` to the headers object in request');

check('Authorization header uses Bearer scheme',
  has(api, 'Bearer'),
  'Format the header as: Authorization: `Bearer ${token}`');

if (failures.length === 0) {
  console.log('\n✅ All checks passed!\n');
  console.log('Your verification code: BZ3L5F\n');
} else {
  console.log(`\n❌ ${failures.length} check(s) failed:\n`);
  for (const { label, hint } of failures) {
    console.log(`  ✗ ${label}`);
    if (hint) console.log(`    → ${hint}`);
    console.log();
  }
  process.exit(1);
}
