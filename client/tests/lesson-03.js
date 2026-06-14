import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { test, assert, normalize, runGates, checkBehavior, summary } from './lib/utils.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CLIENT = resolve(__dirname, '..');

function read(relPath) {
  try { return readFileSync(resolve(CLIENT, relPath), 'utf8'); }
  catch { return null; }
}

function has(content, str) {
  if (!content) return false;
  return normalize(content).includes(normalize(str));
}

function nq(str) {
  return str ? str.replace(/"/g, "'") : null;
}

runGates(CLIENT);

const login    = read('src/pages/LoginPage.tsx');
const register = read('src/pages/RegisterPage.tsx');
const app      = read('src/components/App/App.tsx');

test('LoginPage.tsx exists', () => {
  assert(login !== null, 'Create client/src/pages/LoginPage.tsx');
});

test('LoginPage uses useFormWithValidation', () => {
  assert(has(login, 'useFormWithValidation'), 'Import and call useFormWithValidation in LoginPage');
});

test('LoginPage has an email input', () => {
  assert(has(nq(login), "type='email'"), 'Add an <input type="email" ... /> for the email field');
});

test('LoginPage has a password input', () => {
  assert(has(nq(login), "type='password'"), 'Add an <input type="password" minLength={8} ... /> for the password field');
});

test('LoginPage form has noValidate', () => {
  assert(has(login, 'noValidate'), 'Add the noValidate attribute to the <form> element');
});

test('LoginPage submit button is disabled when invalid', () => {
  assert(has(login, '!isValid'), 'Disable the submit button with disabled={!isValid}');
});

test('RegisterPage.tsx exists', () => {
  assert(register !== null, 'Create client/src/pages/RegisterPage.tsx');
});

test('RegisterPage uses useFormWithValidation', () => {
  assert(has(register, 'useFormWithValidation'), 'Import and call useFormWithValidation in RegisterPage');
});

test('RegisterPage has a name input', () => {
  assert(has(nq(register), "name='name'"), 'Add a name input: <input name="name" required ... />');
});

test('RegisterPage has an email input', () => {
  assert(has(nq(register), "type='email'"), 'Add an <input type="email" ... /> for the email field');
});

test('RegisterPage has a password input', () => {
  assert(has(nq(register), "type='password'"), 'Add an <input type="password" minLength={8} ... /> for the password field');
});

test('RegisterPage form has noValidate', () => {
  assert(has(register, 'noValidate'), 'Add the noValidate attribute to the <form> element');
});

test('App.tsx has a /login route', () => {
  assert(has(app, '/login'), 'Add a <Route path="/login" element={<LoginPage />} /> in App.tsx');
});

test('App.tsx has a /register route', () => {
  assert(has(app, '/register'), 'Add a <Route path="/register" element={<RegisterPage />} /> in App.tsx');
});

test('Behavior tests pass', () => {
  const result = checkBehavior(CLIENT, 'tests/lib/lesson-03.behavior.test.tsx');
  assert(result.ok, 'Run `npm test` in client/ for the full vitest output');
});

summary('U0o5VDRO');
