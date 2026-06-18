import { execSync } from "child_process";

// ============================================================
// TEST RUNNER
// ============================================================

let pass = 0;
let fail = 0;
let notRun = 0;

/**
 * Set when a gate (compile/build) fails. Once blocked, remaining tests are
 * displayed greyed-out as "not run" instead of executing.
 */
let blocked = false;

const GREY = "\x1b[90m";
const RESET = "\x1b[0m";

/** Wraps text in grey ANSI codes (skipped when output is not a terminal). */
function grey(text) {
  if (!process.stdout.isTTY) return text;
  return `${GREY}${text}${RESET}`;
}

/** Prints a greyed-out "not run" line for a test that was skipped. */
function printNotRun(label) {
  console.log(grey(`⚪ ${label} (not run)`));
  notRun++;
}

/**
 * Runs a single test. Tests run regardless of gate status.
 */
export function test(label, fn) {
  try {
    fn();
    console.log(`✅ ${label}`);
    pass++;
  } catch (err) {
    console.log(`❌ ${label} — ${err.message}`);
    fail++;
  }
}

/** Throws with the given message if the condition is falsy. */
export function assert(condition, message) {
  if (!condition) throw new Error(message);
}

/** Increments the pass counter (for custom test display). */
export function incrementPass() {
  pass++;
}

/** Increments the fail counter (for custom test display). */
export function incrementFail() {
  fail++;
}

/**
 * Runs the compile and build gates against the client app. Shows results but
 * does not block subsequent tests, so students can see behavioral feedback
 * even when there are type or build issues.
 */
export function runGates(client) {
  const built = checkBuilds(client);
  if (built.ok) {
    console.log("✅ App builds and runs without errors");
    pass++;
  } else {
    console.log("❌ App builds and runs without errors — Vite build failed\n");
    const indented = built.output
      .split("\n")
      .map((line) => (line ? "  " + line : line))
      .join("\n");
    console.log(indented);
    fail++;
  }

  const compiled = checkCompiles(client);
  if (compiled.ok) {
    console.log("✅ Project compiles without type errors\n");
    pass++;
  } else {
    console.log(
      "❌ Project compiles without type errors — fix TypeScript errors\n",
    );
    const indented = compiled.output
      .split("\n")
      .map((line) => (line ? "  " + line : line))
      .join("\n");
    console.log(indented);
    fail++;
  }
}

/**
 * Prints the pass/fail/not-run totals. When everything passed, decodes and
 * prints the lesson's verification code. Exits nonzero on any failure.
 */
export function summary(encodedCode) {
  let line = `\n${pass} passed, ${fail} failed`;
  if (notRun > 0) line += grey(`, ${notRun} not run`);
  console.log(line);
  if (fail === 0 && notRun === 0) {
    const code = Buffer.from(encodedCode, "base64").toString();
    console.log(`\nVerification code: ${code}`);
  } else {
    process.exit(1);
  }
}

// ============================================================
// CHECKS
// ============================================================

/**
 * Collapses all whitespace sequences to a single space and trims the result.
 * Call this on every file read so that formatting differences don't affect
 * string matching in tests.
 */
export function normalize(content) {
  if (content === null) return null;
  return content.replace(/\s+/g, " ").trim();
}

/**
 * Type-checks the client app with TypeScript. `client` is the path to the
 * client directory, which has its own package.json and tsconfig files.
 *
 * Unused-code checks (noUnusedLocals / noUnusedParameters) are disabled here
 * because editors may surface them as faded "warning"-style hints rather than
 * red errors, and students shouldn't fail the check for leftover unused
 * variables. Real type errors (red squiggles) still fail.
 */
export function checkCompiles(client) {
  try {
    execSync(
      "npx tsc -p tsconfig.app.json --noEmit --noUnusedLocals false --noUnusedParameters false",
      {
        cwd: client,
        stdio: "pipe",
      },
    );
    return { ok: true, output: "" };
  } catch (err) {
    const output =
      err.stderr?.toString() || err.stdout?.toString() || "(no output)";
    return { ok: false, output };
  }
}

/**
 * Runs `vite build` to verify the client app bundles without errors.
 */
export function checkBuilds(client) {
  try {
    execSync("npx vite build", { cwd: client, stdio: "pipe" });
    return { ok: true, output: "" };
  } catch (err) {
    const output =
      err.stderr?.toString() || err.stdout?.toString() || "(no output)";
    return { ok: false, output };
  }
}

/**
 * Runs a vitest test file and returns individual test results with friendly names.
 * `testFile` is relative to the client directory (e.g.
 * "tests/lib/lesson-04.behavior.test.tsx"). On failure, includes a message with
 * the exact command to run for the full vitest output.
 */
export function checkBehavior(client, testFile) {
  let output = "";
  let ok = false;
  try {
    output = execSync(`npx vitest run --reporter=verbose ${testFile}`, {
      cwd: client,
      stdio: "pipe",
      encoding: "utf8",
    });
    ok = true;
  } catch (err) {
    output = err.stdout?.toString() || "";
    ok = false;
  }

  // Extract individual test results: "✓ path > suite > test name" or "× path > suite > test name"
  const testMatches = output.match(/^\s*[✓×✗]\s+.+$/gm) || [];
  const tests = testMatches.map((match) => {
    const status = match.trim().startsWith("✓");
    // Extract just the final test name after the last ">"
    const name = match.split(">").pop().trim();
    return { name, passed: status };
  });

  return {
    ok,
    tests,
    message: !ok
      ? `\n- Run \`npx vitest run ${testFile}\` in client/ for the full vitest output. To output the test results to a file,\n- Run \`NO_COLOR=1 npx vitest run ${testFile} > results.txt\`
`
      : undefined,
  };
}
