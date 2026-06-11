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
  return str.replace(/"/g, "'");
}

function check(label, pass, hint) {
  if (!pass) failures.push({ label, hint });
}

const login    = read('client/src/pages/LoginPage.tsx');
const register = read('client/src/pages/RegisterPage.tsx');
const app      = read('client/src/components/App/App.tsx');

// LoginPage checks
check('LoginPage.tsx exists', login !== null,
  'Create client/src/pages/LoginPage.tsx');

check('LoginPage uses useFormWithValidation', has(login, 'useFormWithValidation'),
  'Import and call useFormWithValidation in LoginPage');

check('LoginPage has an email input',
  has(normalizeQuotes(login), "type='email'"),
  'Add an <input type="email" ... /> for the email field');

check('LoginPage has a password input',
  has(normalizeQuotes(login), "type='password'"),
  'Add an <input type="password" minLength={8} ... /> for the password field');

check('LoginPage form has noValidate', has(login, 'noValidate'),
  'Add the noValidate attribute to the <form> element');

check('LoginPage submit button is disabled when form is invalid', has(login, '!isValid'),
  'Disable the submit button with disabled={!isValid}');

// RegisterPage checks
check('RegisterPage.tsx exists', register !== null,
  'Create client/src/pages/RegisterPage.tsx');

check('RegisterPage uses useFormWithValidation', has(register, 'useFormWithValidation'),
  'Import and call useFormWithValidation in RegisterPage');

check('RegisterPage has a name input',
  has(normalizeQuotes(register), "name='name'"),
  'Add a name input: <input name="name" required ... />');

check('RegisterPage has an email input',
  has(normalizeQuotes(register), "type='email'"),
  'Add an <input type="email" ... /> for the email field');

check('RegisterPage has a password input',
  has(normalizeQuotes(register), "type='password'"),
  'Add an <input type="password" minLength={8} ... /> for the password field');

check('RegisterPage form has noValidate', has(register, 'noValidate'),
  'Add the noValidate attribute to the <form> element');

// App.tsx routing checks
check('App.tsx has a /login route', has(app, '/login'),
  'Add a <Route path="/login" element={<LoginPage />} /> in App.tsx');

check('App.tsx has a /register route', has(app, '/register'),
  'Add a <Route path="/register" element={<RegisterPage />} /> in App.tsx');

if (failures.length === 0) {
  console.log('\n✅ All checks passed!\n');
  console.log('Your verification code: SJ9T4N\n');
} else {
  console.log(`\n❌ ${failures.length} check(s) failed:\n`);
  for (const { label, hint } of failures) {
    console.log(`  ✗ ${label}`);
    if (hint) console.log(`    → ${hint}`);
    console.log();
  }
  process.exit(1);
}
