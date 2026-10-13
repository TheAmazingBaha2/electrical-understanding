import assert from 'node:assert/strict';
import {chromium} from 'playwright';
// Vetted widgets and model-selected formats only; no provider or private account.
const browser=await chromium.launch({headless:true});
try{
 for(const width of [390,1280]){
  const page=await browser.newPage({viewport:{width,height:900}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.route('https://esm.sh/**',r=>r.abort());await page.goto('http://127.0.0.1:8080/');await page.locator('.v2-hero').waitFor();
  await page.evaluate(async()=>{
   const {renderActivitySelector,attachGeneratedPredictions}=await import('/lesson-tabs.js');
   const {attachGeneratedSimulations}=await import('/generated-simulations.js');
   const activities=[{kind:'choice',title:'Choose the change',prompt:'With resistance fixed, doubling voltage does what?',answer:'Doubles current',explanation:'I = V/R.',choices:['Doubles current','Halves current','No change'],correct:0,source_ids:['S1']},
    {kind:'simulation',title:'Explore voltage and current',prompt:'Move voltage at fixed resistance.',answer:'Current scales with voltage',explanation:'Ideal Ohms law',simulator:'ohm',source_ids:['S1']}];
   window.__lesson={experiment:'generated',activities};window.__notices=[];
   window.__showTask=i=>{document.querySelector('#main').innerHTML=renderActivitySelector(window.__lesson,i);attachGeneratedPredictions(document.querySelector('#main'),m=>window.__notices.push(m));attachGeneratedSimulations(document.querySelector('#main'));};
   window.__showTask(0);
  });
  assert.equal(await page.locator('textarea').count(),0);assert.equal(await page.locator('input[type=radio]').count(),3);
  await page.locator('[data-generated-reveal]').click();assert.equal(await page.locator('[data-generated-feedback]').isVisible(),false);
  assert.deepEqual(await page.evaluate(()=>window.__notices),['Choose a prediction first.']);
  await page.locator('input[type=radio][value="0"]').check();await page.locator('[data-generated-reveal]').click();assert.match(await page.locator('[data-generated-feedback]').innerText(),/Your prediction matches/);
  await page.evaluate(()=>window.__showTask(1));assert.equal(await page.locator('input[type=range]').count(),2);
  const before=await page.locator('[data-sim-result]').innerText();await page.locator('input[aria-label="Voltage"]').fill('10');
  assert.notEqual(await page.locator('[data-sim-result]').innerText(),before);assert.equal(await page.locator('[data-sim-curve] svg').count(),1);assert.match(await page.locator('[data-sim-result]').innerText(),/10 mA/);
  const size=await page.evaluate(()=>({actual:document.documentElement.scrollWidth,width:innerWidth}));assert.ok(size.actual<=size.width+2);assert.deepEqual(errors,[]);
  await page.close();
 }
 console.log('PASS: phone/desktop selectable predictions, hidden-before-selection feedback and model-selected live slider.');
}finally{await browser.close();}
