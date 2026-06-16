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
const app = read("src/components/App/App.tsx");

test("request reads the stored token from localStorage", () => {
  assert(
    has(api, "localStorage.getItem") && has(api, "auth-token"),
    'Add const token = localStorage.getItem("auth-token") ?? "" inside the request function',
  );
});

test("request includes an Authorization header", () => {
  assert(
    has(api, "Authorization"),
    "Add an Authorization header to the headers object in request",
  );
});

test("Authorization header uses Bearer scheme", () => {
  assert(
    has(api, "`Bearer ${token}`"),
    "Format the header as: Authorization: `Bearer ${token}`",
  );
});

test("App.tsx reads isAuthenticated from auth context", () => {
  assert(
    has(app, "useAuth") && has(app, "isAuthenticated"),
    "Import useAuth in App.tsx and read isAuthenticated from it",
  );
});

test("App.tsx useEffect depends on isAuthenticated", () => {
  assert(
    has(app, "[isAuthenticated]") ||
      has(app, "[ isAuthenticated]") ||
      has(app, "[isAuthenticated ]") ||
      (has(app, "[ isAuthenticated ]") && has(app, "useEffect")),
    "Add isAuthenticated to the useEffect dependency array and return early when !isAuthenticated",
  );
});

test("homeContent shows a sign-in message when not authenticated", () => {
  const n = normalize(app);
  assert(
    /homeContent\(\).*if \(!isAuthenticated\) \{(?:[^}]|\{[^}]*\})*Sign in/.test(n),
    'In homeContent(), add an if (!isAuthenticated) branch that renders a "Sign in" link or message',
  );
});

test("homeContent shows an error message when fetch fails", () => {
  const n = normalize(app);
  assert(
    /homeContent\(\).*if \(error\) \{[^}]*\}/.test(n),
    "In homeContent(), add an if (error) block for server errors",
  );
});

test("Behavior tests pass", () => {
  const result = checkBehavior(CLIENT, "tests/lib/lesson-05.behavior.test.tsx");
  assert(result.ok, result.message);
});

summary("QlozTDVG");
