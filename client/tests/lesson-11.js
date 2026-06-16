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

const api = read("src/utils/api.ts");
const authCtx = read("src/contexts/AuthContext.tsx");
const header = read("src/components/Header/Header.tsx");

test('api.ts sends credentials: "include"', () => {
  assert(
    has(api, "credentials") && has(api, "include"),
    'Add `credentials: "include"` as a top-level option in the fetch call inside request() — not inside headers',
  );
});

test("api.ts exports logoutUser", () => {
  assert(
    has(api, "logoutUser"),
    "Export a logoutUser function that calls POST /auth/logout",
  );
});

test("api.ts does not send an Authorization header", () => {
  assert(
    !has(api, "Authorization"),
    "Remove the Authorization header from the request helper",
  );
});

test("api.ts does not read from localStorage", () => {
  assert(
    !has(api, "localStorage"),
    "Remove the localStorage.getItem call from the request helper",
  );
});

test("AuthContext does not reference auth-token in localStorage", () => {
  assert(
    !has(authCtx, "auth-token"),
    "Remove all localStorage references from AuthContext — the cookie is managed by the server",
  );
});

test("AuthContext login does not take a token parameter", () => {
  assert(
    !has(authCtx, "login(token") && !has(authCtx, "login: (token"),
    "Update login() to take only a user parameter — remove the token argument",
  );
});

test("Header calls logoutUser on logout", () => {
  assert(
    has(header, "logoutUser"),
    "Import logoutUser in Header.tsx and call it inside handleLogout",
  );
});

test("Behavior tests pass", () => {
  const result = checkBehavior(CLIENT, "tests/lib/lesson-11.behavior.test.tsx");
  assert(result.ok, result.message);
});

summary("VkY5QzJL");
