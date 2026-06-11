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

const api      = read('client/src/utils/api.ts');
const authCtx  = read('client/src/contexts/AuthContext.tsx');
const protect  = read('client/src/components/ProtectedRoute/ProtectedRoute.tsx');
const header   = read('client/src/components/Header/Header.tsx');

// api.ts
check('api.ts exports checkToken', has(api, 'checkToken'),
  'Add an exported checkToken() function to api.ts');

check('checkToken calls GET /auth/me', has(api, '/auth/me'),
  'checkToken should call GET ${BASE_URL}/auth/me using the request helper');

// AuthContext.tsx
check('AuthContext has isLoading state', has(authCtx, 'isLoading'),
  'Add isLoading: boolean to AuthContextValue and useState(true) in AuthProvider');

check('AuthContext uses useEffect', has(authCtx, 'useEffect'),
  'Import useEffect and add a token-check effect that runs on mount');

check('AuthContext calls checkToken in the effect', has(authCtx, 'checkToken'),
  'Import checkToken from api.ts and call it inside the useEffect');

// ProtectedRoute.tsx
check('ProtectedRoute handles isLoading', has(protect, 'isLoading'),
  'Read isLoading from useAuth() and return null while it is true in both ProtectedRoute and PublicRoute');

// Header.tsx
check('Header uses auth context for logout',
  has(header, 'useAuth') || has(header, 'logout'),
  'Import useAuth in Header.tsx and wire up a logout button');

check('Header conditionally renders the signed-in user name',
  has(header, 'currentUser') || has(header, 'name'),
  'Render currentUser.name in the header when a user is signed in');

if (failures.length === 0) {
  console.log('\n✅ All checks passed!\n');
  console.log('Your verification code: DP4K7R\n');
} else {
  console.log(`\n❌ ${failures.length} check(s) failed:\n`);
  for (const { label, hint } of failures) {
    console.log(`  ✗ ${label}`);
    if (hint) console.log(`    → ${hint}`);
    console.log();
  }
  process.exit(1);
}
