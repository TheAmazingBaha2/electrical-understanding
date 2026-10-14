// Cloudflare Workers Static Assets deployment. Intentionally publish ONLY this allowlist.
// Never deploy docs, GitHub workflows, tests, environment files or secrets as web assets.
import { mkdir, copyFile, rm, stat, writeFile } from "node:fs/promises";
import { join } from "node:path";

// Workers Builds exposes its Git branch through WORKERS_CI_BRANCH.
// Do not let a misconfigured auto-build deploy main to the dedicated staging Worker.
const sourceBranch = process.env.WORKERS_CI_BRANCH || process.env.GITHUB_REF_NAME || "local";
const isWorkersBuild = process.env.WORKERS_CI === "1";
const allowedCloudflareBranch = sourceBranch === "draft/v2-dmm-companion";
if (isWorkersBuild && !allowedCloudflareBranch) {
  throw new Error(`Refusing to build eu-v2-staging from unexpected Cloudflare branch: ${sourceBranch}. Set its production branch to draft/v2-dmm-companion.`);
}
const commitSha = process.env.WORKERS_CI_COMMIT_SHA || process.env.GITHUB_SHA || "local";

if(isWorkersBuild){
 const {requireCI}=await import('./require-ci.mjs');
 await requireCI(commitSha);
}
const output = "dist";
const publicFiles = [
  "index.html",
  "app.js", "persistence.js", "approved-lessons.js", "published-lessons.js", "lesson-package.js", "widget-registry.js", "widget-improvements.js", "data-contract.js", "circuit-model.js", "project-store.js", "tutor-contract.js", "electronics-workspace.js", "guided-activities.js", "lab-guidance.js", "lab-guidance-view.js", "circuit-view.js", "breadboard-model.js", "breadboard-view.js", "breadboard-project.js", "shared-multimeter.js", "ai-chat-widget.js", "generated-library.js", "generated-simulations.js", "legacy-groups.js", "math-lessons.js", "math-widgets.js", "math-track.js",
  "lessons.js",
  "course-catalog.js", "learning-structure.js", "source-navigation.js",
  "v2-panels.js",
  "lab-lessons.js",
  "book-lessons.js", "geier-catalog.js", "geier-workshops.js", "workshop-widgets.js", "workshop-progress.js",
  "ceta-lessons.js",
  "ceta-widgets.js",
  "dmm-widgets.js",
  "lab-widgets.js",
  "lab-visuals.js",
  "lesson-tabs.js",
  "lesson-view.js",
  "lesson-overviews.js",
  "styles.css",
  "config.js", // Public Supabase URL and publishable key only; NEVER a secret/service_role key.
  "icon.svg", "icon-192.png", "icon-512.png", "icon-180.png", "icon-maskable-512.png",
  "manifest.webmanifest",
];

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
// V3 development must not carry a usable official database connection.
const config = await import('../config.js');
if(config.SUPABASE_ENVIRONMENT !== 'development' || config.SUPABASE_URL || config.SUPABASE_PUBLISHABLE_KEY)throw new Error('Development build rejected: cloud/AI requires a separately configured V3 backend');
for (const file of publicFiles) {
  const info = await stat(file);
  if (!info.isFile()) throw new Error("Expected web file: " + file);
  const source = await (await import('node:fs/promises')).readFile(file, 'utf8');
  if (/https:\/\/hkwmtjhgrskidaizamwy|wwvpzyqcgwlwcetwlime|sb_secret_[A-Za-z0-9_-]+/.test(source)) throw new Error('Production or secret configuration in public asset: ' + file);
  await copyFile(file, join(output, file));
}
// Verify every local ES module dependency makes it into the exact public assets
// that Cloudflare serves. A missing imported module otherwise leaves the entire
// page blank, including its navigation. Fail the build instead of shipping that.
const published=new Set(publicFiles);
const staticModule=/\b(?:import|export)\s+(?:[^'";]*?\s+from\s*)?["'](\.[^"']+)["']/g;
const dynamicModule=/\bimport\s*\(\s*["'](\.[^"']+)["']\s*\)/g;
for(const file of publicFiles.filter(name=>name.endsWith(".js"))){
 const source=await (await import("node:fs/promises")).readFile(file,"utf8");
 for(const expression of [staticModule,dynamicModule]){
  expression.lastIndex=0;
  for(const match of source.matchAll(expression)){
   const relativeTarget=match[1].split(/[?#]/,1)[0];
   const target=join(file.includes("/")?file.slice(0,file.lastIndexOf("/")):".",relativeTarget).replace(/\\/g,"/");
   if(!published.has(target)){
    throw new Error("Staging build missing imported module: "+file+" -> "+target+
      ". Add the required file to publicFiles. The site would not start without it.");
   }
  }
 }
}
await writeFile(join(output, "build-info.json"), JSON.stringify({
  site: "Electronic Learning Workbench V3 development",
  worker: "eu-v2-staging",
  branch: sourceBranch,
  commit: commitSha,
  builtAt: new Date().toISOString(),
  mode: "V3 local development — official V2 cloud and AI disabled"
}, null, 2) + "\n");
console.log("Workers staging build ready: " + publicFiles.length + " public assets copied to ./dist");
console.log("Build source: " + sourceBranch + " @ " + commitSha);
