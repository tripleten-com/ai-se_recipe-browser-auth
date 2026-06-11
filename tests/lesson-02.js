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

const authCtx = read('client/src/contexts/AuthContext.tsx');
const main    = read('client/src/main.tsx');

check('AuthContext.tsx exists', authCtx !== null,
  'Create client/src/contexts/AuthContext.tsx');

check('Uses createContext', has(authCtx, 'createContext'),
  'Import and call createContext from "react"');

check('Exports AuthProvider', has(authCtx, 'AuthProvider'),
  'Create and export a function named AuthProvider');

check('Exports useAuth hook', has(authCtx, 'useAuth'),
  'Export a useAuth convenience hook that returns useContext(AuthContext)');

check('Has isAuthenticated state', has(authCtx, 'isAuthenticated'),
  'Add isAuthenticated state to AuthProvider with initial value false');

check('Has currentUser state', has(authCtx, 'currentUser'),
  'Add currentUser state to AuthProvider with initial value null');

check('Has login function',
  has(authCtx, 'function login') || has(authCtx, 'login ='),
  'Add a login(token, user) function to AuthProvider');

check('login saves token to localStorage',
  has(authCtx, 'localStorage.setItem') && has(authCtx, 'auth-token'),
  'In the login function, call localStorage.setItem("auth-token", token)');

check('Has logout function',
  has(authCtx, 'function logout') || has(authCtx, 'logout ='),
  'Add a logout() function to AuthProvider');

check('logout removes token from localStorage',
  has(authCtx, 'localStorage.removeItem') && has(authCtx, 'auth-token'),
  'In the logout function, call localStorage.removeItem("auth-token")');

check('main.tsx wraps App with AuthProvider', has(main, 'AuthProvider'),
  'Import AuthProvider and wrap <App /> with it in client/src/main.tsx');

if (failures.length === 0) {
  console.log('\n✅ All checks passed!\n');
  console.log('Your verification code: RK7M2P\n');
} else {
  console.log(`\n❌ ${failures.length} check(s) failed:\n`);
  for (const { label, hint } of failures) {
    console.log(`  ✗ ${label}`);
    if (hint) console.log(`    → ${hint}`);
    console.log();
  }
  process.exit(1);
}
