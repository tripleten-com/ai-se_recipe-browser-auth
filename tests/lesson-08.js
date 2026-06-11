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

const app       = read('client/src/components/App/App.tsx');
const card      = read('client/src/components/RecipeCard/RecipeCard.tsx');
const favorites = read('client/src/pages/FavoritesPage.tsx');

// App.tsx
check('App.tsx calls toggleLike from api.ts',
  has(app, 'toggleLike'),
  'Import toggleLike from api.ts and call it in a handleToggleLike function');

check('App.tsx passes onToggleLike to child components',
  has(app, 'onToggleLike'),
  'Pass onToggleLike as a prop to HomePage and FavoritesPage');

check('App.tsx updates recipe state after a toggle',
  has(app, 'setRecipes') && has(app, 'map('),
  'After toggleLike resolves, update recipes state by mapping over the array and replacing the updated recipe');

// RecipeCard.tsx
check('RecipeCard accepts onToggleLike prop',
  has(card, 'onToggleLike'),
  'Add onToggleLike: (id: string) => void to RecipeCard props and call it on the heart button');

check('RecipeCard reads recipe.likes to determine liked state',
  has(card, 'likes'),
  'Derive isLiked from recipe.likes.includes(currentUser?.userId)');

check('RecipeCard reads the current user from auth context',
  has(card, 'useAuth') || has(card, 'currentUser'),
  'Import useAuth in RecipeCard and read currentUser to derive isLiked');

// FavoritesPage.tsx
check('FavoritesPage filters recipes by likes',
  has(favorites, 'filter'),
  'Filter the recipes array to show only recipes whose likes array includes the current user ID');

check('FavoritesPage uses likes to determine which recipes to show',
  has(favorites, 'likes'),
  'Check recipe.likes.includes(currentUser.userId) to identify liked recipes');

if (failures.length === 0) {
  console.log('\n✅ All checks passed!\n');
  console.log('Your verification code: XN2J6W\n');
} else {
  console.log(`\n❌ ${failures.length} check(s) failed:\n`);
  for (const { label, hint } of failures) {
    console.log(`  ✗ ${label}`);
    if (hint) console.log(`    → ${hint}`);
    console.log();
  }
  process.exit(1);
}
