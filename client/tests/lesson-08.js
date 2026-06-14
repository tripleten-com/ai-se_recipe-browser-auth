import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import {
  test,
  assert,
  normalize,
  runGates,
  checkBehavior,
  summary,
} from "./lib/utils.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const CLIENT = resolve(__dirname, "..");

function read(relPath) {
  try {
    return readFileSync(resolve(CLIENT, relPath), "utf8");
  } catch {
    return null;
  }
}

function has(content, str) {
  if (!content) return false;
  return normalize(content).includes(normalize(str));
}

runGates(CLIENT);

const app = read("src/components/App/App.tsx");
const card = read("src/components/RecipeCard/RecipeCard.tsx");
const favorites = read("src/pages/FavoritesPage.tsx");

test("App.tsx calls toggleLike from api.ts", () => {
  assert(
    has(app, "toggleLike"),
    "Import toggleLike from api.ts and call it in a handleToggleLike function",
  );
});

test("App.tsx passes onToggleLike to child components", () => {
  assert(
    has(app, "onToggleLike"),
    "Pass onToggleLike as a prop to HomePage and FavoritesPage",
  );
});

test("App.tsx updates recipe state after a toggle", () => {
  assert(
    has(app, "setRecipes") && has(app, "map("),
    "After toggleLike resolves, update recipes state by mapping over the array and replacing the updated recipe",
  );
});

test("RecipeCard accepts onToggleLike prop", () => {
  assert(
    has(card, "onToggleLike"),
    "Add onToggleLike: (id: string) => void to RecipeCard props and call it on the heart button",
  );
});

test("RecipeCard reads recipe.likes", () => {
  assert(
    has(card, "likes"),
    "Derive isLiked from recipe.likes.includes(currentUser?.userId)",
  );
});

test("RecipeCard reads currentUser from auth context", () => {
  assert(
    has(card, "useAuth") || has(card, "currentUser"),
    "Import useAuth in RecipeCard and read currentUser to derive isLiked",
  );
});

test("FavoritesPage filters recipes by likes", () => {
  assert(
    has(favorites, "filter"),
    "Filter the recipes array to show only recipes whose likes array includes the current user ID",
  );
});

test("FavoritesPage uses likes", () => {
  assert(
    has(favorites, "likes"),
    "Check recipe.likes.includes(currentUser.userId) to identify liked recipes",
  );
});

test("Behavior tests pass", () => {
  const result = checkBehavior(CLIENT, "tests/lib/lesson-08.behavior.test.tsx");
  assert(result.ok, "Run `npm test` in client/ for the full vitest output");
});

summary("WE4ySjZX");
