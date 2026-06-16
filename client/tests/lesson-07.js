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
const protect = read("src/components/ProtectedRoute/ProtectedRoute.tsx");
const header = read("src/components/Header/Header.tsx");

test("api.ts exports getCurrentUser", () => {
  assert(
    has(api, "getCurrentUser"),
    "Add an exported getCurrentUser() function to api.ts",
  );
});

test("getCurrentUser calls GET /users/me", () => {
  assert(
    has(api, "/users/me"),
    "getCurrentUser should call GET ${BASE_URL}/users/me using the request helper",
  );
});

test("AuthContext has isLoading state", () => {
  assert(
    has(authCtx, "isLoading"),
    "Add isLoading: boolean to AuthContextValue and useState(true) in AuthProvider",
  );
});

test("AuthContext uses useEffect", () => {
  assert(
    has(authCtx, "useEffect"),
    "Import useEffect and add a token-check effect that runs on mount",
  );
});

test("AuthContext calls getCurrentUser in the effect", () => {
  assert(
    has(authCtx, "getCurrentUser"),
    "Import getCurrentUser from api.ts and call it inside the useEffect",
  );
});

test("ProtectedRoute handles isLoading", () => {
  assert(
    has(protect, "isLoading"),
    "Read isLoading from useAuth() and return null while it is true in both ProtectedRoute and PublicRoute",
  );
});

test("Header uses auth context for logout", () => {
  assert(
    has(header, "useAuth") || has(header, "logout"),
    "Import useAuth in Header.tsx and wire up a logout button",
  );
});

test("Header renders the signed-in user name", () => {
  assert(
    has(header, "currentUser") || has(header, "name"),
    "Render currentUser.name in the header when a user is signed in",
  );
});

test("Behavior tests pass", () => {
  const result = checkBehavior(CLIENT, "tests/lib/lesson-07.behavior.test.tsx");
  assert(result.ok, result.message);
});

summary("RFA0SzdS");
