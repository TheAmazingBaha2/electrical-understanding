import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {mkdir} from 'node:fs/promises';
import {go} from './navigation-helper.mjs';
await mkdir('test-artifacts',{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH||undefined,args:process.env.CHROMIUM_PATH?['--no-sandbox']:[]});
try{for(const width of [320,390,1440]){
 const page=await browser.newPage({viewport:{width,height:1000},hasTouch:width<700}),errors=[],external=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.route('**/*',r=>{if(new URL(r.request().url()).hostname==='127.0.0.1')return r.continue();external.push(r.request().url());return r.abort();});
 await page.goto('http://127.0.0.1:8080/');await go(page,'workbench');await page.locator('[data-guide-next]').waitFor();
 assert.match(await page.locator('[data-lab-guide]').innerText(),/STEP 1 OF 10/);
 const pane=async name=>{if(width<700)await page.locator('[data-lab-pane="'+name+'"]').tap();};
 const next=async()=>page.locator('[data-guide-next]').click();
 await next();await next();await next();assert.equal(await page.locator('[data-guide-next]').isDisabled(),true);
 await pane('meter');assert.match(await page.locator('[data-meter-scene]').innerText(),/PREDICT FIRST/);
 await page.locator('[data-guide-prediction="1"]').click();await next();
 assert.equal(await page.locator('[data-guide-next]').isDisabled(),true);await page.locator('[data-probe="redNode"]').selectOption('source');assert.match(await page.locator('[data-meter-scene]').innerText(),/5.000 V/);
 await next();await page.locator('[data-probe="redNode"]').selectOption('output');assert.match(await page.locator('[data-meter-scene]').innerText(),/2.500 V/);await next();
 await page.locator('[data-component-value="R2"]').fill('2000');await page.locator('[data-component-value="R2"]').press('Tab');await next();
 await page.locator('[data-component-open="R1"]').check();await next();await page.locator('[data-component-open="R2"]').check();await pane('meter');assert.match(await page.locator('[data-meter-scene]').innerText(),/UNKNOWN/);
 await next();await next();assert.equal(await page.locator('[data-experiment-mode="free"]').getAttribute('aria-pressed'),'true');
 await pane('circuit');await page.locator('[data-component-open="R1"]').uncheck();await page.locator('[data-component-open="R2"]').uncheck();await page.locator('[data-component-open="V1"]').check();
 await pane('meter');assert.match(await page.locator('[data-meter-explanation]').innerText(),/source is disconnected/);assert.match(await page.locator('[data-meter-scene]').innerText(),/0.000 V/);
 await pane('project');await page.locator('[data-project-notes]').fill('Keep these notes');await page.locator('[data-snapshot-name]').fill('Test');await page.locator('[data-save-snapshot]').click();await page.locator('[data-save-snapshot]').click();
 assert.equal(await page.locator('.snapshot-row').count(),2);const ids=await page.locator('.snapshot-row').evaluateAll(rows=>rows.map(r=>r.dataset.snapshotId));assert.notEqual(ids[0],ids[1]);
 await page.locator('[data-snapshot-rename="'+ids[0]+'"]').fill('Before fault');await page.locator('[data-rename-snapshot="'+ids[0]+'"]').click();
 assert.match(await page.locator('[data-snapshot-id="'+ids[0]+'"] strong').innerText(),/Before fault/);
 await page.locator('[data-delete-snapshot="'+ids[1]+'"]').click();await page.locator('[data-cancel-delete-snapshot]').click();assert.equal(await page.locator('.snapshot-row').count(),2);
 await page.locator('[data-delete-snapshot="'+ids[1]+'"]').click();await page.locator('[data-confirm-delete-snapshot="'+ids[1]+'"]').click();assert.equal(await page.locator('.snapshot-row').count(),1);assert.equal(await page.locator('[data-project-notes]').inputValue(),'Keep these notes');
 await page.waitForFunction(()=>JSON.parse(localStorage.getItem('eu_projects_v1:local:divider-project')).project.snapshots.length===1);
 await page.reload();await go(page,'workbench');await pane('project');await page.locator('[data-snapshot-manager]>summary').click();assert.equal(await page.locator('.snapshot-row').count(),1);assert.match(await page.locator('.snapshot-row strong').innerText(),/Before fault/);
 await page.locator('[data-restore-snapshot="'+ids[0]+'"]').click();await pane('circuit');assert.equal(await page.locator('[data-component-open="V1"]').isChecked(),true);
 if(width===1440){
  await page.evaluate(async()=>{const {ProjectStore}=await import('/project-store.js');const store=new ProjectStore(localStorage),d=store.read('divider-project');d.project.notes='Other tab notes';await store.save(d.project,d.revision);});
  await page.locator('[data-component-open="R1"]').check();await page.locator('[data-resolve-project]').first().waitFor();
  await page.locator('[data-resolve-project][data-use-incoming="true"]').click();assert.equal(await page.locator('[data-project-notes]').inputValue(),'Keep these notes');
  assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('eu_projects_v1:local:divider-project')).resolvedConflicts.length),1);
 }
 assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+2));assert.deepEqual(errors,[]);assert.deepEqual(external,[]);
 await page.screenshot({path:'test-artifacts/lab-guide-snapshots-'+width+'.png',fullPage:true});await page.close();
}console.log('PASS: guided steps/predictions/probes, actual disconnected/floating feedback, free mode, stable snapshot rename/delete/restore, reload and local conflict resolution on desktop/phone.');}finally{await browser.close();}
