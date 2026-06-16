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

const protect = read("src/components/ProtectedRoute/ProtectedRoute.tsx");
const app = read("src/components/App/App.tsx");

test("ProtectedRoute.tsx exists", () => {
  assert(
    protect !== null,
    "Create client/src/components/ProtectedRoute/ProtectedRoute.tsx",
  );
});

test("ProtectedRoute is exported", () => {
  assert(
    has(protect, "ProtectedRoute"),
    "Export a ProtectedRoute component from ProtectedRoute.tsx",
  );
});

test("PublicRoute is exported", () => {
  assert(
    has(protect, "PublicRoute"),
    "Export a PublicRoute component from the same file",
  );
});

test("ProtectedRoute uses Navigate", () => {
  assert(
    has(protect, "Navigate"),
    'Import Navigate from "react-router-dom" and use it to redirect unauthenticated users',
  );
});

test("ProtectedRoute uses Outlet", () => {
  assert(
    has(protect, "Outlet"),
    'Import Outlet from "react-router-dom" and render it for authenticated users',
  );
});

test("ProtectedRoute reads isAuthenticated from auth context", () => {
  assert(
    has(protect, "isAuthenticated"),
    "Call useAuth() in ProtectedRoute and read isAuthenticated",
  );
});

test("App.tsx uses ProtectedRoute", () => {
  assert(
    has(app, "ProtectedRoute"),
    "Wrap the home, favorites, and recipe detail routes with <ProtectedRoute> in App.tsx",
  );
});

test("App.tsx uses PublicRoute", () => {
  assert(
    has(app, "PublicRoute"),
    "Wrap /login and /register with <PublicRoute> in App.tsx",
  );
});

test("Behavior tests pass", () => {
  const result = checkBehavior(CLIENT, "tests/lib/lesson-06.behavior.test.tsx");
  assert(result.ok, result.message);
});

summary("SEMxWTlH");
