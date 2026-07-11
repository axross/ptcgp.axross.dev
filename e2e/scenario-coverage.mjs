// Scenario-coverage reporter and gate over the Playwright JSON report.
//
// Reads the journey catalog (e2e/scenarios.md) and the report produced by the
// e2e run (e2e/.data/report.json), then prints covered/total overall and per
// priority plus the uncovered scenarios. A scenario counts as covered only
// when at least one PASSING test carries its `@scenario:<id>` tag.
//
// Exit codes:
// - structural tag errors (unknown scenario id, facet tag disagreeing with
//   the catalog, duplicate catalog id) always fail;
// - with `--gate=must`, any uncovered must-priority scenario also fails.
import { readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const rootDir = import.meta.dirname;
const catalogPath = path.join(rootDir, "scenarios.md");
const reportPath = path.join(rootDir, ".data", "report.json");
const gateMust = process.argv.includes("--gate=must");

const PRIORITIES = ["must", "should", "may"];

async function readCatalog() {
  const source = await readFile(catalogPath, "utf-8");
  const scenarios = new Map();
  const errors = [];

  for (const line of source.split("\n")) {
    const cells = line
      .split("|")
      .map((cell) => cell.trim())
      .filter((cell) => cell.length > 0);

    // Keep only data rows: 4 cells, not the header row or its ---- separator.
    if (cells.length !== 4 || cells[0] === "Id" || /^-+$/.test(cells[0])) {
      continue;
    }

    const [id, title, area, priority] = cells;

    if (scenarios.has(id)) {
      errors.push(`duplicate scenario id in catalog: ${id}`);
      continue;
    }

    if (!PRIORITIES.includes(priority)) {
      errors.push(`invalid priority "${priority}" for scenario ${id}`);
      continue;
    }

    scenarios.set(id, { id, title, area, priority });
  }

  return { scenarios, errors };
}

function collectSpecs(suite, specs = []) {
  for (const spec of suite.specs ?? []) {
    specs.push(spec);
  }

  for (const child of suite.suites ?? []) {
    collectSpecs(child, specs);
  }

  return specs;
}

function specPassed(spec) {
  return (spec.tests ?? []).some(
    (test) => test.status === "expected" || test.status === "flaky",
  );
}

const { scenarios, errors } = await readCatalog();

let report;

try {
  report = JSON.parse(await readFile(reportPath, "utf-8"));
} catch {
  console.error(
    `Could not read ${path.relative(process.cwd(), reportPath)} — run the ` +
      "Playwright suite first (it writes the JSON report this script reads).",
  );
  process.exit(1);
}

const specs = (report.suites ?? []).flatMap((suite) => collectSpecs(suite));
const covered = new Set();

for (const spec of specs) {
  const tags = (spec.tags ?? []).map((tag) => tag.replace(/^@/, ""));
  const scenarioIds = [];
  const facets = { area: [], priority: [] };

  for (const tag of tags) {
    const [kind, ...rest] = tag.split(":");
    const value = rest.join(":");

    if (kind === "scenario") {
      scenarioIds.push(value);
    } else if (kind === "area" || kind === "priority") {
      facets[kind].push(value);
    }
  }

  for (const id of scenarioIds) {
    const scenario = scenarios.get(id);

    if (scenario === undefined) {
      errors.push(`test "${spec.title}" tags unknown scenario id: ${id}`);
      continue;
    }

    for (const kind of ["area", "priority"]) {
      for (const value of facets[kind]) {
        if (value !== scenario[kind]) {
          errors.push(
            `test "${spec.title}" tags @${kind}:${value} but scenario ` +
              `${id} has ${kind} "${scenario[kind]}" in the catalog`,
          );
        }
      }
    }

    if (specPassed(spec)) {
      covered.add(id);
    }
  }
}

const rows = [...scenarios.values()];
const uncovered = rows.filter((scenario) => !covered.has(scenario.id));

console.log("\nScenario coverage");
console.log(`  overall: ${covered.size}/${rows.length}`);

for (const priority of PRIORITIES) {
  const total = rows.filter((scenario) => scenario.priority === priority);

  if (total.length === 0) {
    continue;
  }

  const done = total.filter((scenario) => covered.has(scenario.id));
  console.log(`  ${priority}: ${done.length}/${total.length}`);
}

if (uncovered.length > 0) {
  console.log("\nUncovered scenarios:");

  for (const scenario of uncovered) {
    console.log(`  - ${scenario.id} (${scenario.priority}): ${scenario.title}`);
  }
}

if (errors.length > 0) {
  console.error("\nStructural tag errors:");

  for (const error of errors) {
    console.error(`  - ${error}`);
  }

  process.exit(1);
}

if (gateMust) {
  const uncoveredMust = uncovered.filter(
    (scenario) => scenario.priority === "must",
  );

  if (uncoveredMust.length > 0) {
    console.error(
      `\nGate failed: ${uncoveredMust.length} must-priority scenario(s) ` +
        "have no passing asserting test.",
    );
    process.exit(1);
  }
}
