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

const protect = read('client/src/components/ProtectedRoute/ProtectedRoute.tsx');
const app     = read('client/src/components/App/App.tsx');

check('ProtectedRoute.tsx exists', protect !== null,
  'Create client/src/components/ProtectedRoute/ProtectedRoute.tsx');

check('ProtectedRoute is exported', has(protect, 'ProtectedRoute'),
  'Export a ProtectedRoute component from ProtectedRoute.tsx');

check('PublicRoute is exported', has(protect, 'PublicRoute'),
  'Export a PublicRoute component from the same file');

check('ProtectedRoute uses Navigate from react-router',
  has(protect, 'Navigate'),
  'Import Navigate from "react-router-dom" and use it to redirect unauthenticated users');

check('ProtectedRoute uses Outlet',
  has(protect, 'Outlet'),
  'Import Outlet from "react-router-dom" and render it for authenticated users');

check('ProtectedRoute reads isAuthenticated from auth context',
  has(protect, 'isAuthenticated'),
  'Call useAuth() in ProtectedRoute and read isAuthenticated');

check('App.tsx uses ProtectedRoute', has(app, 'ProtectedRoute'),
  'Wrap the home, favorites, and recipe detail routes with <ProtectedRoute> in App.tsx');

check('App.tsx uses PublicRoute', has(app, 'PublicRoute'),
  'Wrap /login and /register with <PublicRoute> in App.tsx');

if (failures.length === 0) {
  console.log('\n✅ All checks passed!\n');
  console.log('Your verification code: HC1Y9G\n');
} else {
  console.log(`\n❌ ${failures.length} check(s) failed:\n`);
  for (const { label, hint } of failures) {
    console.log(`  ✗ ${label}`);
    if (hint) console.log(`    → ${hint}`);
    console.log();
  }
  process.exit(1);
}
