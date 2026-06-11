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

function normalizeQuotes(str) {
  return str ? str.replace(/"/g, "'") : null;
}

function check(label, pass, hint) {
  if (!pass) failures.push({ label, hint });
}

const api      = read('client/src/utils/api.ts');
const login    = read('client/src/pages/LoginPage.tsx');
const register = read('client/src/pages/RegisterPage.tsx');

// api.ts checks
check('api.ts exports loginUser', has(api, 'loginUser'),
  'Add an exported loginUser(email, password) function to api.ts');

check('api.ts loginUser calls POST /auth/login',
  has(api, '/auth/login') && has(api, "method: 'POST'") || has(api, 'method: "POST"'),
  'loginUser should POST to ${BASE_URL}/auth/login');

check('api.ts exports registerUser', has(api, 'registerUser'),
  'Add an exported registerUser(name, email, password) function to api.ts');

check('api.ts registerUser calls POST /auth/register',
  has(api, '/auth/register'),
  'registerUser should POST to ${BASE_URL}/auth/register');

// LoginPage checks
check('LoginPage imports loginUser',
  has(login, 'loginUser'),
  'Import loginUser from api.ts in LoginPage.tsx');

check('LoginPage calls the auth context login function',
  has(login, 'useAuth') && (has(login, '.login(') || has(login, 'login(')),
  'Call login(token, user) from useAuth() after a successful loginUser call');

check('LoginPage navigates after login',
  has(login, 'navigate'),
  'Call navigate("/") after a successful login');

// RegisterPage checks
check('RegisterPage imports registerUser',
  has(register, 'registerUser'),
  'Import registerUser from api.ts in RegisterPage.tsx');

check('RegisterPage navigates to /login on success',
  has(normalizeQuotes(register), "navigate('/login')") || has(normalizeQuotes(register), "'/login'"),
  'Call navigate("/login") after a successful registration');

if (failures.length === 0) {
  console.log('\n✅ All checks passed!\n');
  console.log('Your verification code: WV6X8Q\n');
} else {
  console.log(`\n❌ ${failures.length} check(s) failed:\n`);
  for (const { label, hint } of failures) {
    console.log(`  ✗ ${label}`);
    if (hint) console.log(`    → ${hint}`);
    console.log();
  }
  process.exit(1);
}
