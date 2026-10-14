import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {go} from './navigation-helper.mjs';
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH||undefined,args:process.env.CHROMIUM_PATH?['--no-sandbox']:[]});
try{for(const width of [320,390,1440]){
 const page=await browser.newPage({viewport:{width,height:1000},hasTouch:width<700}),errors=[],external=[];page.on('pageerror',e=>errors.push(e.message));await page.route('**/*',r=>{if(new URL(r.request().url()).hostname==='127.0.0.1')return r.continue();external.push(r.request().url());return r.abort();});
 await page.goto('http://127.0.0.1:8080/');await go(page,'workbench');await page.locator('[data-experiment-mode="free"]').click();const pane=async p=>{if(width<700)await page.locator('[data-lab-pane="'+p+'"]').tap();};await pane('scope');
 assert.match(await page.locator('[data-scope-origin]').innerText(),/SHARED CIRCUIT/);assert.match(await page.locator('[data-scope-summary]').innerText(),/2.500 to 2.500 V/);
 await page.locator('[data-scope-setting="source"]').selectOption('demo');assert.match(await page.locator('[data-scope-origin]').innerText(),/INDEPENDENT OF CIRCUIT/);assert.match(await page.locator('[data-scope-summary]').innerText(),/1000 Hz.*1.000 ms/);
 await page.locator('[data-scope-signal="amplitude"]').fill('4');await page.locator('[data-scope-signal="amplitude"]').press('Tab');await page.locator('[data-scope-setting="voltsDiv"]').fill('2');await page.locator('[data-scope-setting="voltsDiv"]').press('Tab');
 await page.locator('[data-scope-signal="waveform"]').selectOption('triangle');assert.equal(await page.locator('[data-scope-display] svg').count(),1);
 await go(page,'account');await go(page,'workbench');await pane('scope');assert.equal(await page.locator('[data-scope-signal="waveform"]').inputValue(),'triangle');assert.equal(await page.locator('[data-scope-signal="amplitude"]').inputValue(),'4');
 await page.locator('[data-scope-setting="source"]').selectOption('dc');await pane('circuit');await page.locator('[data-component-open="R1"]').check();await page.locator('[data-component-open="R2"]').check();await pane('scope');assert.match(await page.locator('[data-scope-summary]').innerText(),/floating/);assert.equal(await page.locator('[data-scope-display] svg').count(),0);
 assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+2));assert.deepEqual(errors,[]);assert.deepEqual(external,[]);await page.close();
}console.log('PASS: shared steady-DC scope, clearly separate demo generator, signal/time/voltage controls, preserved settings and floating-node refusal on desktop/phone.');}finally{await browser.close();}
