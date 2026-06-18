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

const authCtx = read("src/contexts/AuthContext.tsx");
const main = read("src/main.tsx");

test("AuthContext.tsx exists", () => {
  assert(authCtx !== null, "Create client/src/contexts/AuthContext.tsx");
});

test("Uses createContext", () => {
  assert(
    has(authCtx, "createContext"),
    'Import and call createContext from "react"',
  );
});

test("Exports AuthProvider", () => {
  assert(
    has(authCtx, "AuthProvider"),
    "Create and export a function named AuthProvider",
  );
});

test("Exports useAuth hook", () => {
  assert(
    has(authCtx, "useAuth"),
    "Export a useAuth convenience hook that returns useContext(AuthContext)",
  );
});

test("Has isAuthenticated state", () => {
  assert(
    has(authCtx, "isAuthenticated"),
    "Add isAuthenticated state to AuthProvider with initial value false",
  );
});

test("Has currentUser state", () => {
  assert(
    has(authCtx, "currentUser"),
    "Add currentUser state to AuthProvider with initial value null",
  );
});

test("login sets currentUser to the user argument", () => {
  assert(
    has(authCtx, "setCurrentUser(user)"),
    "In the login function, call setCurrentUser(user)",
  );
});

test("login saves token to localStorage", () => {
  assert(
    has(authCtx, "localStorage.setItem") && has(authCtx, "auth-token"),
    'In the login function, call localStorage.setItem("auth-token", token)',
  );
});

test("logout removes token from localStorage", () => {
  assert(
    has(authCtx, "localStorage.removeItem") && has(authCtx, "auth-token"),
    'In the logout function, call localStorage.removeItem("auth-token")',
  );
});

test("main.tsx wraps App with AuthProvider", () => {
  assert(
    has(main, "AuthProvider"),
    "Import AuthProvider and wrap <App /> with it in client/src/main.tsx",
  );
});

{
  const behaviorHints = {
    "starts signed out":
      "AuthContext should initialize with isAuthenticated: false",
    "login sets the current user and stores the token":
      "The login function should call setCurrentUser and localStorage.setItem",
    "logout clears the user and removes the token":
      "The logout function should clear currentUser and localStorage.removeItem",
  };

  const result = checkBehavior(CLIENT, "tests/lib/lesson-02.behavior.test.tsx");
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
    console.log("❌ Behavior tests —");
    console.log(result.message);
    incrementFail();
  }
}

summary("Uks3TTJQ");
