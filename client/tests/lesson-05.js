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

runGates(CLIENT);

const api = read('src/utils/api.ts');
const app = read('src/components/App/App.tsx');

test('request reads the stored token from localStorage', () => {
  assert(
    has(api, 'localStorage.getItem') && has(api, 'auth-token'),
    'Add const token = localStorage.getItem("auth-token") ?? "" inside the request function',
  );
});

test('request includes an Authorization header', () => {
  assert(has(api, 'Authorization'), 'Add Authorization: `Bearer ${token}` to the headers object in request');
});

test('Authorization header uses Bearer scheme', () => {
  assert(has(api, 'Bearer'), 'Format the header as: Authorization: `Bearer ${token}`');
});

test('App.tsx reads isAuthenticated from auth context', () => {
  assert(
    has(app, 'useAuth') && has(app, 'isAuthenticated'),
    'Import useAuth in App.tsx and read isAuthenticated from it',
  );
});

test('App.tsx useEffect depends on isAuthenticated', () => {
  assert(
    has(app, 'isAuthenticated') && has(app, 'useEffect'),
    'Add isAuthenticated to the useEffect dependency array and return early when !isAuthenticated',
  );
});

test('Behavior tests pass', () => {
  const result = checkBehavior(CLIENT, 'tests/lib/lesson-05.behavior.test.tsx');
  assert(result.ok, 'Run `npm test` in client/ for the full vitest output');
});

summary('QlozTDVG');
