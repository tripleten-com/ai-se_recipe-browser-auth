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

test("AuthContextValue includes isLoading: boolean", () => {
  assert(
    /type\s+AuthContextValue\s*=\s*\{[\s\S]*?isLoading\s*:\s*boolean/.test(
      authCtx,
    ),
    "Add isLoading: boolean to AuthContextValue type",
  );
});

test("createContext default includes isLoading: false", () => {
  assert(
    /createContext\s*<[^>]*>\s*\(\s*\{[\s\S]*?isLoading\s*:\s*false/.test(
      authCtx,
    ),
    "Pass isLoading: false to createContext default value",
  );
});

test("Provider value includes isLoading", () => {
  assert(
    /value\s*=\s*\{\s*[\s\S]*?isLoading[\s\S]*?\}/.test(authCtx),
    "Include isLoading in the Provider value prop",
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

// Display behavior tests as individual list items
{
  const behaviorHints = {
    "restores the session when a valid token is stored":
      "Check localStorage for a token on mount and call getCurrentUser() to restore the session",
    "clears an invalid token and stays signed out":
      "When getCurrentUser() fails in the catch block, remove the invalid token from localStorage",
    "does not call the API when no token is stored":
      "Only call getCurrentUser() if a token exists in localStorage",
    "the header displays Login/Register links only when unauthenticated":
      "Show Login/Register links only when isAuthenticated is false",
    "the header displays a logout button and username only when authenticated":
      "Add a p.header__text element for the username and a button.header__logout-btn for logout, show only when isAuthenticated is true",
  };

  const result = checkBehavior(CLIENT, "tests/lib/lesson-07.behavior.test.tsx");
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

summary("RFA0SzdS");
