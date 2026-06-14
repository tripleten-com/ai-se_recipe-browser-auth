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

const api      = read('src/utils/api.ts');
const login    = read('src/pages/LoginPage.tsx');
const register = read('src/pages/RegisterPage.tsx');

test('api.ts exports loginUser', () => {
  assert(has(api, 'loginUser'), 'Add an exported loginUser(email, password) function to api.ts');
});

test('api.ts loginUser calls POST /auth/login', () => {
  assert(
    has(api, '/auth/login') && (has(api, "method: 'POST'") || has(api, 'method: "POST"')),
    'loginUser should POST to ${BASE_URL}/auth/login',
  );
});

test('api.ts exports registerUser', () => {
  assert(has(api, 'registerUser'), 'Add an exported registerUser(name, email, password) function to api.ts');
});

test('api.ts registerUser calls POST /auth/register', () => {
  assert(has(api, '/auth/register'), 'registerUser should POST to ${BASE_URL}/auth/register');
});

test('LoginPage imports loginUser', () => {
  assert(has(login, 'loginUser'), 'Import loginUser from api.ts in LoginPage.tsx');
});

test('LoginPage calls the auth context login function', () => {
  assert(
    has(login, 'useAuth') && (has(login, '.login(') || has(login, 'login(')),
    'Call login(token, user) from useAuth() after a successful loginUser call',
  );
});

test('LoginPage navigates after login', () => {
  assert(has(login, 'navigate'), 'Call navigate("/") after a successful login');
});

test('RegisterPage imports registerUser', () => {
  assert(has(register, 'registerUser'), 'Import registerUser from api.ts in RegisterPage.tsx');
});

test('RegisterPage navigates to /login on success', () => {
  assert(
    has(nq(register), "navigate('/login')") || has(nq(register), "'/login'"),
    'Call navigate("/login") after a successful registration',
  );
});

test('Behavior tests pass', () => {
  const result = checkBehavior(CLIENT, 'tests/lib/lesson-04.behavior.test.tsx');
  assert(result.ok, 'Run `npm test` in client/ for the full vitest output');
});

summary('V1Y2WDhR');
