// Cloudflare Workers Static Assets deployment. Intentionally publish ONLY this allowlist.
// Never deploy docs, GitHub workflows, tests, environment files or secrets as web assets.
import { mkdir, copyFile, rm, stat } from "node:fs/promises";
import { join } from "node:path";

const output = "dist";
const publicFiles = [
  "index.html",
  "app.js",
  "lessons.js",
  "course-catalog.js",
  "v2-panels.js",
  "lab-lessons.js",
  "lab-widgets.js",
  "styles.css",
  "config.js", // Public Supabase URL and publishable key only; NEVER a secret/service_role key.
  "icon.svg",
  "manifest.webmanifest",
];

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
for (const file of publicFiles) {
  const info = await stat(file);
  if (!info.isFile()) throw new Error("Expected web file: " + file);
  await copyFile(file, join(output, file));
}
console.log("Workers staging build ready: " + publicFiles.length + " public assets copied to ./dist");
