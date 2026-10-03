// Route smoke test. Usage (after `vite build`):
//   node scripts/smoke.mjs                  compare against scripts/smoke-baseline.json
//   node scripts/smoke.mjs --update-baseline  record current results as the baseline
//   node scripts/smoke.mjs --shots <dir>     also save a screenshot per route
import { spawn } from "node:child_process";
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const baselinePath = path.join(root, "scripts", "smoke-baseline.json");
const args = process.argv.slice(2);
const updateBaseline = args.includes("--update-baseline");
const shotsDir = args.includes("--shots") ? path.resolve(args[args.indexOf("--shots") + 1]) : null;
const PORT = 4173;
const ORIGIN = `http://localhost:${PORT}`;

const publicRoutes = [
  "/", "/initialsetup/test", "/contact", "/login", "/forgotpassword", "/signup-guest",
  "/techfaceoff", "/buildweek-form", "/score", "/events", "/event-details", "/team-page",
  "/adsophos", "/photobooth", "/heist", "/loop13", "/practice/test", "/this-route-does-not-exist",
];
const teamRoutes = [
  "/team/dashboard", "/team/practice", "/team/practice/test", "/team/exercises",
  "/team/exercises/test", "/team/leaderboard", "/team/customization/qrchange",
  "/team/customization/socials", "/team/customization/changepassword",
  "/team/admin/users", "/team/admin/hr-interface", "/team/admin/images", "/team/admin/team",
  "/team/admin/problems", "/team/admin/content", "/team/superadmin", "/team/superadmin/users",
  "/team/superadmin/contacts", "/team/superadmin/images",
];

const normalize = (s) =>
  s.replace(/\/assets\/[\w.-]+/g, "/assets/*").replace(/\d{4,}/g, "N").replace(/\s+/g, " ").trim().slice(0, 200);

const server = spawn(process.execPath, [path.join(root, "node_modules", "vite", "bin", "vite.js"), "preview", "--port", String(PORT), "--strictPort"], {
  cwd: root,
  stdio: "ignore",
});

async function waitForServer() {
  for (let i = 0; i < 60; i++) {
    try {
      if ((await fetch(ORIGIN)).ok) return;
    } catch {}
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error("vite preview did not start");
}

async function visit(browser, route, authed) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  if (authed) {
    await context.addInitScript(() => {
      localStorage.setItem("AuthState", JSON.stringify({ loggedIn: true, token: "smoke-test" }));
    });
  }
  const page = await context.newPage();
  const errors = new Set();
  page.on("console", (m) => m.type() === "error" && errors.add(`console: ${normalize(m.text())}`));
  page.on("pageerror", (e) => errors.add(`pageerror: ${normalize(e.message)}`));
  page.on("requestfailed", (r) => {
    if (r.url().startsWith(ORIGIN)) errors.add(`requestfailed: ${normalize(new URL(r.url()).pathname)}`);
  });
  await page.goto(ORIGIN + route, { waitUntil: "load" });
  await page.waitForTimeout(1500);
  const rootChildren = await page.evaluate(() => document.getElementById("root")?.children.length ?? 0);
  if (rootChildren === 0) errors.add("empty #root");
  if (shotsDir) {
    mkdirSync(shotsDir, { recursive: true });
    await page.screenshot({ path: path.join(shotsDir, route.replace(/\W+/g, "_") + ".png") });
  }
  await context.close();
  return [...errors].sort();
}

let exitCode = 0;
try {
  await waitForServer();
  const browser = await chromium.launch();
  const results = {};
  for (const route of publicRoutes) results[route] = await visit(browser, route, false);
  for (const route of teamRoutes) results[route] = await visit(browser, route, true);
  await browser.close();

  if (updateBaseline || !existsSync(baselinePath)) {
    writeFileSync(baselinePath, JSON.stringify(results, null, 2) + "\n");
    console.log(`Baseline written (${Object.keys(results).length} routes).`);
  } else {
    const baseline = JSON.parse(readFileSync(baselinePath, "utf8"));
    for (const [route, errs] of Object.entries(results)) {
      const known = new Set(baseline[route] ?? []);
      const fresh = errs.filter((e) => !known.has(e));
      if (fresh.length) {
        exitCode = 1;
        console.error(`NEW errors on ${route}:\n  ${fresh.join("\n  ")}`);
      }
    }
    console.log(exitCode ? "Smoke test FAILED." : `Smoke test passed (${Object.keys(results).length} routes, no new errors).`);
  }
} catch (e) {
  console.error(e);
  exitCode = 1;
} finally {
  server.kill();
}
process.exit(exitCode);
