import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {go} from './navigation-helper.mjs';
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH||undefined,args:process.env.CHROMIUM_PATH?['--no-sandbox']:[]});
try{for(const width of [390,1440]){
 const page=await browser.newPage({viewport:{width,height:1000},hasTouch:width<700}),errors=[],external=[];page.on('pageerror',e=>errors.push(e.message));
 await page.route('**/*',r=>{if(new URL(r.request().url()).hostname==='127.0.0.1')return r.continue();external.push(r.request().url());return r.abort();});
 await page.goto('http://127.0.0.1:8080/');await go(page,'workbench');await page.locator('[data-experiment-mode="free"]').click();
 const pane=async name=>{if(width<700)await page.locator('[data-lab-pane="'+name+'"]').tap();};await pane('meter');
 await page.locator('[data-meter-jack]').selectOption('A');assert.match(await page.locator('[data-meter-scene]').innerText(),/TEST BLOCKED/);
 await page.locator('[data-meter-jack]').selectOption('VΩ');await page.locator('[data-meter-mode]').selectOption('resistance');assert.match(await page.locator('[data-meter-explanation]').innerText(),/Disconnect modeled sources/);
 await pane('circuit');await page.locator('[data-circuit-power]').uncheck();await pane('meter');assert.match(await page.locator('[data-meter-scene]').innerText(),/1.000 kΩ/);
 await page.locator('[data-probe="redNode"]').selectOption('source');assert.match(await page.locator('[data-meter-scene]').innerText(),/2.000 kΩ/);
 await page.locator('[data-meter-mode]').selectOption('continuity');await page.locator('[data-probe="redNode"]').selectOption('common');assert.match(await page.locator('[data-meter-explanation]').innerText(),/Connected path detected/);
 await page.locator('[data-meter-mode]').selectOption('current');await page.locator('[data-meter-jack]').selectOption('A');assert.match(await page.locator('[data-meter-scene]').innerText(),/TEST BLOCKED/);
 await page.locator('[data-current-branch]').selectOption('R1');await page.locator('[data-prepare-current]').click();
 await pane('circuit');await page.locator('[data-circuit-power]').check();await pane('meter');assert.match(await page.locator('[data-meter-scene]').innerText(),/2.500 mA/);
 await page.locator('[data-current-reverse]').check();assert.match(await page.locator('[data-meter-scene]').innerText(),/-2.500 mA/);
 await pane('circuit');await page.locator('[data-component-open="R1"]').check();await pane('meter');assert.match(await page.locator('[data-meter-scene]').innerText(),/0.000 mA/);
 await go(page,'account');await go(page,'workbench');await pane('meter');assert.equal(await page.locator('[data-meter-mode]').inputValue(),'current');assert.equal(await page.locator('[data-current-reverse]').isChecked(),true);
 assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+2));assert.deepEqual(errors,[]);assert.deepEqual(external,[]);await page.close();
}console.log('PASS: shared DC voltage/jacks, live-ohms blocking, resistor-network resistance/continuity, explicit series preparation, current polarity/open faults and saved settings on desktop/phone.');}finally{await browser.close();}
