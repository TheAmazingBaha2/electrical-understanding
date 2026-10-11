import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";

const allowed = [
  "app.js", "config.js", "course-catalog.js", "icon.svg", "index.html",
  "lab-lessons.js", "lab-widgets.js", "lessons.js",
  "manifest.webmanifest", "styles.css", "v2-panels.js"
];
const actual = (await readdir("dist")).sort();
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
