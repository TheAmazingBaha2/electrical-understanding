import {go} from './navigation-helper.mjs';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {chromium} from 'playwright';
const browser=await chromium.launch({headless:true,...(process.env.PLAYWRIGHT_CHANNEL?{channel:process.env.PLAYWRIGHT_CHANNEL}:{})});
const key='eu_progress:hkwmtjhgrskidaizamwy:anonymous';
try {
 const context=await browser.newContext({acceptDownloads:true});
 // Some Windows sandboxes block browser file downloads; still validate the exact
 // generated Blob locally. CI exercises real downloads (no CAPTURE_EXPORT flag).
 if(process.env.CAPTURE_EXPORT)await context.addInitScript(()=>{const original=URL.createObjectURL.bind(URL);URL.createObjectURL=blob=>{window.lastExport=blob.text();return original(blob)}});
 async function exportProgress(page){
  if(process.env.CAPTURE_EXPORT){await page.locator('#export-progress').click();return page.evaluate(async()=>JSON.parse(await window.lastExport))}
  const waiting=page.waitForEvent('download');await page.locator('#export-progress').click();return JSON.parse(await readFile(await (await waiting).path(),'utf8'));
 }
 const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:8080/');
 await page.evaluate(()=>localStorage.setItem('eu_demo_v1',JSON.stringify({L01:{answers:{u1:{value:'legacy',correct:true,extra:'preserve'}},complete:false},archived:{answers:{old:{value:42}}}})));
 await page.reload();await go(page,'account');
 const input={version:2,progress:{L01:{answers:{u1:{value:'imported',correct:false,extra:'preserve'}},complete:false},retired:{answers:{q:{value:'archived'}}}}};
 await page.locator('#import-file').setInputFiles({name:'progress.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(input))});
 await page.locator('[data-resolve="L01"][data-incoming="true"]').waitFor();
 assert.equal(await page.evaluate(k=>JSON.parse(localStorage.getItem(k)).progress.L01.answers.u1.value,key),'legacy');
 await page.locator('summary:has-text("Compare saved copies")').click();
 assert.match(await page.locator('main').innerText(),/legacy/);assert.match(await page.locator('main').innerText(),/imported/);
 await page.locator('[data-resolve="L01"][data-incoming="true"]').click();
 await page.waitForFunction(k=>JSON.parse(localStorage.getItem(k)).progress.L01.answers.u1.value==='imported',key);
 const exported=await exportProgress(page);
 assert.equal(exported.schemaVersion,3);assert.ok(exported.backups.length>=2);assert.equal(JSON.parse(exported.legacyRaw).L01.answers.u1.value,'legacy');
 assert.equal(JSON.parse(exported.raw).progress.archived.answers.old.value,42);
 // Cross-tab writes refresh state without losing another tab's answer.
 const tab=await context.newPage();await tab.goto('http://127.0.0.1:8080/');
 await tab.evaluate(async()=>{const {ProgressStore}=await import('/persistence.js');await new ProgressStore(localStorage,null).edit('L01',l=>{l.answers.u2={value:'second tab'}})});
 assert.equal(await page.evaluate(k=>JSON.parse(localStorage.getItem(k)).progress.L01.answers.u2.value,key),'second tab');
 // Unknown future cache remains raw and exportable, with a visible warning.
 await page.evaluate(k=>{const d=JSON.parse(localStorage.getItem(k));d.schemaVersion=4;localStorage.setItem(k,JSON.stringify(d))},key);
 await page.reload();await go(page,'account');assert.match(await page.locator('main').innerText(),/Unsupported progress version/);
 const future=await exportProgress(page);assert.equal(JSON.parse(future.raw).schemaVersion,4);
 assert.deepEqual(errors,[]);console.log('PASS: browser legacy migration, import conflicts, resolution, complete export, archived data, cross-tab edit, future-schema recovery.');
}finally{await browser.close()}
