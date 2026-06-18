import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import {
  test,
  assert,
  normalize,
  runGates,
  checkBehavior,
  incrementPass,
  incrementFail,
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
const counter = read("src/components/Counter/Counter.tsx");
const main = read("src/main.tsx");

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

test("main.tsx does not include FavoritesProvider", () => {
  assert(
    !has(main, "FavoritesProvider"),
    "Remove FavoritesProvider from main.tsx — it is no longer needed",
  );
});

test("Counter does not use FavoritesContext", () => {
  assert(
    !has(counter, "FavoritesContext"),
    "Remove the FavoritesContext import and usage from Counter — derive the count from currentUser.likes instead",
  );
});

test("Counter reads currentUser from useAuth", () => {
  assert(
    has(counter, "useAuth") || has(counter, "currentUser"),
    "Import useAuth in Counter and read currentUser to display currentUser?.likes.length ?? 0",
  );
});

{
  const behaviorHints = {
    "shows liked and unliked hearts based on recipe.likes":
      "Display a filled heart if the recipe is in the user's likes array, empty otherwise",
    "clicking the heart PUTs to the likes endpoint and fills the heart":
      "Call the like/unlike API endpoint when the heart is clicked",
    "the favorites page shows only recipes liked by the current user":
      "Filter recipes to only show those where the user has liked them",
    "counter displays the number of recipes liked by the current user":
      "Display currentUser?.likes.length ?? 0 inside the Counter span",
    "counter shows (0) when user is not logged in":
      "Use ?? 0 so the counter falls back to 0 when currentUser is null",
  };

  const result = checkBehavior(CLIENT, "tests/lib/lesson-08.behavior.test.tsx");
  if (result.tests.length > 0) {
    const headingIcon = result.ok ? "✅" : "❌";
    console.log(`${headingIcon} Behavior Tests`);
    result.tests.forEach((t) => {
      const icon = t.passed ? "✅" : "❌";
      const hint = t.passed ? "" : ` — ${behaviorHints[t.name] || ""}`;
      console.log(`  ${icon} ${t.name}${hint}`);
      if (t.passed) incrementPass();
      else incrementFail();
    });
    if (!result.ok) {
      const indentedMessage = result.message
        .split("\n")
        .map((line) => (line ? "  " + line : line))
        .join("\n");
      console.log(indentedMessage);
    }
  } else if (!result.ok) {
    console.log("❌ Behavior tests pass —");
    console.log(result.message);
    incrementFail();
  }
}

summary("WE4ySjZX");
