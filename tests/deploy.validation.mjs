import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import { spawnSync } from "node:child_process";

const allowed = [
  "lab-pointer-input.js", "study-additions.js", "lesson-catalog.js", "foundation-flow-model.js", "foundation-energy-model.js", "study-flow-view.js", "study-recap.js", "study-content.js", "foundation-model.js", "foundation-continuation-model.js", "foundation-material-model.js", "study-material-view.js", "study-continuation-view.js", "study-bank.js", "review-engine.js", "study-journal.js", "study-module-view.js", "study-module-host.js",
  "app.js", "persistence.js", "approved-lessons.js", "published-lessons.js", "lesson-package.js", "lab-modules.js", "lesson-labs.js", "widget-registry.js", "widget-improvements.js", "data-contract.js", "circuit-model.js", "project-store.js", "tutor-contract.js", "electronics-workspace.js", "desktop-lab.js", "desktop-windows.js", "mobile-lab.js", "lab-platform.js", "guided-activities.js", "lab-guidance.js", "lab-guidance-view.js", "circuit-view.js", "circuit-canvas.js", "circuit-canvas-view.js", "breadboard-model.js", "breadboard-view.js", "graphical-breadboard.js", "graphic-controls.js", "lab-graphics.js", "resistor-color.js", "component-editors.js", "instrument-graphics.js", "breadboard-overview.js", "breadboard-project.js", "shared-multimeter.js", "scope-signals.js", "scope-view.js", "project-manager.js", "generated-library.js", "generated-simulations.js", "legacy-groups.js", "ai-chat-widget.js", "math-lessons.js", "math-widgets.js", "math-track.js", "config.js", "course-catalog.js", "learning-structure.js", "source-navigation.js", "icon.svg", "icon-192.png", "icon-512.png", "icon-180.png", "icon-maskable-512.png", "index.html",
  "lab-lessons.js", "book-lessons.js", "geier-catalog.js", "geier-workshops.js", "workshop-widgets.js", "workshop-progress.js", "ceta-lessons.js", "ceta-widgets.js", "dmm-widgets.js", "lab-widgets.js", "lab-visuals.js", "lesson-tabs.js", "lesson-view.js", "lesson-overviews.js", "lessons.js",
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
// An exact staging commit with successful CI may build (network mocked).
for (const name of ["draft/v2-dmm-companion"]) {
  const outcome = spawnSync(process.execPath, ["--import", "./tests/ci-pass-fixture.mjs", "scripts/build.mjs"], {
    env: { ...process.env, WORKERS_CI: "1", WORKERS_CI_BRANCH: name, WORKERS_CI_COMMIT_SHA:"a".repeat(40) }, encoding: "utf8"
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
assert.ok(app.includes("configured = stagingPreview && stagingBackend"), "Cloudflare staging connects only to its isolated Supabase project");
const publicConfig = await readFile("dist/config.js", "utf8");
assert.match(publicConfig, /SUPABASE_URL = ''/);
assert.match(publicConfig, /SUPABASE_PUBLISHABLE_KEY = ''/);
assert.doesNotMatch(publicConfig, /wwvpzyqcgwlwcetwlime/);
const index = await readFile("dist/index.html", "utf8");
for (const file of ["./app.js", "./icon.svg", "./manifest.webmanifest", "./styles.css"]) {
  assert.ok(index.includes(file), "Required asset linked: " + file);
}
console.log("PASS: allowlisted Workers assets, dedicated staging Worker name, and workers.dev progress isolation.");
