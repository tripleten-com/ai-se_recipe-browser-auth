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

function nq(str) {
  return str ? str.replace(/"/g, "'") : null;
}

runGates(CLIENT);

const login = read("src/pages/LoginPage.tsx");
const register = read("src/pages/RegisterPage.tsx");
const app = read("src/components/App/App.tsx");

test("LoginPage.tsx exists", () => {
  assert(login !== null, "Create client/src/pages/LoginPage.tsx");
});

test("LoginPage uses useFormWithValidation", () => {
  assert(
    has(login, "useFormWithValidation"),
    "Import and call useFormWithValidation in LoginPage",
  );
});

test("LoginPage has an email input", () => {
  assert(
    has(nq(login), "type='email'") && has(login, "required"),
    'Add an <input type="email" required ... /> for the email field',
  );
});

test("LoginPage has a password input", () => {
  assert(
    has(nq(login), "type='password'") &&
      has(login, "minLength={8}") &&
      has(login, "required"),
    'Add an <input type="password" required minLength={8} ... /> for the password field',
  );
});

test("LoginPage form has noValidate", () => {
  assert(
    has(login, "noValidate"),
    "Add the noValidate attribute to the <form> element",
  );
});

test("LoginPage submit button is disabled when invalid", () => {
  assert(
    has(login, "disabled={!isValid}"),
    "Disable the submit button with disabled={!isValid}",
  );
});

test("LoginPage form element has className='form'", () => {
  assert(
    has(nq(login), "className='form'"),
    'Add className="form" to the <form> element in LoginPage',
  );
});

test("LoginPage uses form* classes", () => {
  const classes = [
    "form__title",
    "form__input-container",
    "form__label",
    "form__input",
    "form__error",
    "form__submit-btn",
  ];
  const missing = classes.filter((c) => !has(login, c));
  assert(
    missing.length === 0,
    `Appropriate form* classes should be used: ${classes.map((c) => `'${c}'`).join(", ")}`,
  );
});

test("RegisterPage.tsx exists", () => {
  assert(register !== null, "Create client/src/pages/RegisterPage.tsx");
});

test("RegisterPage uses useFormWithValidation", () => {
  assert(
    has(register, "useFormWithValidation"),
    "Import and call useFormWithValidation in RegisterPage",
  );
});

test("RegisterPage has a name input", () => {
  assert(
    has(nq(register), "name='name'"),
    'Add a name input: <input name="name" required ... />',
  );
});

test("RegisterPage has an email input", () => {
  assert(
    has(nq(register), "type='email'") && has(register, "required"),
    'Add an <input type="email" required ... /> for the email field',
  );
});

test("RegisterPage has a password input", () => {
  assert(
    has(nq(register), "type='password'") &&
      has(register, "minLength={8}") &&
      has(register, "required"),
    'Add an <input type="password" required minLength={8} ... /> for the password field',
  );
});

test("RegisterPage form has noValidate", () => {
  assert(
    has(register, "noValidate"),
    "Add the noValidate attribute to the <form> element",
  );
});

test("RegisterPage form element has className='form'", () => {
  assert(
    has(nq(register), "className='form'"),
    'Add className="form" to the <form> element in RegisterPage',
  );
});

test("RegisterPage uses form* classes", () => {
  const classes = [
    "form__title",
    "form__input-container",
    "form__label",
    "form__input",
    "form__error",
    "form__submit-btn",
  ];
  const missing = classes.filter((c) => !has(register, c));
  assert(
    missing.length === 0,
    `Appropriate form* classes should be used: ${classes.map((c) => `'${c}'`).join(", ")}`,
  );
});

test("App.tsx has a /login route", () => {
  assert(
    has(app, "/login"),
    'Add a <Route path="/login" element={<LoginPage />} /> in App.tsx',
  );
});

test("App.tsx has a /register route", () => {
  assert(
    has(app, "/register"),
    'Add a <Route path="/register" element={<RegisterPage />} /> in App.tsx',
  );
});

{
  const behaviorHints = {
    "login submit button is disabled before any input":
      "The button should be disabled when the form is empty or invalid",
    "login submit button stays disabled with an invalid email":
      "Validate that the email field contains a valid email format",
    "login submit button is enabled once email and password are valid":
      "Enable the button only when both fields have valid input",
    "register submit button is enabled only when all fields are valid":
      "All three fields (name, email, password) must be filled and valid",
  };

  const result = checkBehavior(CLIENT, "tests/lib/lesson-03.behavior.test.tsx");
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

summary("U0o5VDRO");
