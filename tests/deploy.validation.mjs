import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import { spawnSync } from "node:child_process";

const allowed = [
  "app.js", "config.js", "course-catalog.js", "icon.svg", "index.html",
  "lab-lessons.js", "lab-widgets.js", "lessons.js",
  "manifest.webmanifest", "styles.css", "v2-panels.js", "build-info.json"
];
const actual = (await readdir("dist")).sort();
const buildInfo = JSON.parse(await readFile("dist/build-info.json", "utf8"));
assert.equal(buildInfo.worker, "eu-v2-staging");
assert.ok(buildInfo.branch && buildInfo.commit);
// If Cloudflare accidentally fetches 'main', fail before making any public assets.
const blocked = spawnSync(process.execPath, ["scripts/build.mjs"], {
  env: { ...process.env, WORKERS_CI: "1", WORKERS_CI_BRANCH: "main" }, encoding: "utf8"
});
assert.notEqual(blocked.status, 0, "A Workers build from main must fail");
assert.match(blocked.stderr, /Refusing to build eu-v2-staging/);
// A correct staging branch and intentional preview/* branch remain valid.
for (const name of ["draft/v2-dmm-companion", "preview/layout-review"]) {
  const outcome = spawnSync(process.execPath, ["scripts/build.mjs"], {
    env: { ...process.env, WORKERS_CI: "1", WORKERS_CI_BRANCH: name }, encoding: "utf8"
  });
  assert.equal(outcome.status, 0, name + " should build: " + outcome.stderr);
}
assert.deepEqual(actual, allowed.sort(), "Only explicitly public website files can be uploaded");
const wrangler = JSON.parse(await readFile("wrangler.jsonc", "utf8"));
assert.equal(wrangler.name, "eu-v2-staging");
assert.equal(wrangler.assets.directory, "./dist");
assert.equal(wrangler.workers_dev, true);
const app = await readFile("dist/app.js", "utf8");
assert.ok(app.includes("(?:pages|workers)"), "Workers staging hostname recognized");
assert.ok(app.includes("configured = !stagingPreview"), "Supabase remains disabled on staging");
const index = await readFile("dist/index.html", "utf8");
for (const file of ["./app.js", "./icon.svg", "./manifest.webmanifest", "./styles.css"]) {
  assert.ok(index.includes(file), "Required asset linked: " + file);
}
console.log("PASS: allowlisted Workers assets, dedicated staging Worker name, and workers.dev progress isolation.");
