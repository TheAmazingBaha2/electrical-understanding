import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
import {chromium} from 'playwright';
import {materialsFixture} from './foundations-materials-fixture.mjs';
import {go} from './navigation-helper.mjs';
const {bank}=materialsFixture(),browser=await chromium.launch({headless:true,args:['--no-sandbox']});await mkdir('test-artifacts',{recursive:true});
const ready=p=>p.waitForFunction(()=>!document.querySelector('#main').inert);
async function click(p,s){await p.locator(s).click();await ready(p);}
async function open(p,l){await go(p,'textbooks');const ch=p.locator('[data-source="fixture"] details.content-chapter');if(await ch.getAttribute('open')===null)await ch.locator('summary').click();await click(p,'[data-goto="lesson"][data-lesson="'+l.id+'"]');}
try {for(const width of [320,360,390,768,1280,1920]){
 const context=await browser.newContext({viewport:{width,height:1000},reducedMotion:'reduce',...(width<500?{isMobile:true,hasTouch:true}:{})}),page=await context.newPage(),errors=[],external=[];page.setDefaultTimeout(10000);page.on('pageerror',e=>errors.push(e.message));
 await page.route('**/*',r=>{const u=new URL(r.request().url());if(u.hostname!=='127.0.0.1'){external.push(u.href);return r.abort();}if(u.pathname.endsWith('/study-content.js'))return r.fulfill({contentType:'text/javascript',body:'export const studyContent='+JSON.stringify(bank)+';'});return r.continue();});await page.goto('http://127.0.0.1:8080/',{waitUntil:'networkidle'});
 for(const [k,lesson] of bank.lessons.slice(-5).entries()){
  await open(page,lesson);await click(page,'[data-lesson-tab="learn"]');await click(page,'[data-study-continue]');assert.doesNotMatch(await page.locator('.study-widget').innerText(),/Synthetic material comparison/);
  await page.locator('input[name="study-prediction"][value="1"]').check();await ready(page);await click(page,'[data-study-predict]');await click(page,k===4?'[data-study-action="move:3"]':'[data-study-action="compare"]');await click(page,'[data-study-reveal]');assert.match(await page.locator('.study-widget').innerText(),/First prediction retained/);
  if(k===0){await click(page,'[data-study-action="case:saltwater-described"]');assert.match(await page.locator('.study-widget').innerText(),/solution may use ions/);assert.doesNotMatch(await page.locator('.study-widget').innerText(),/Metal electron-transfer schematic only/);}
  if(k===2||k===3){await click(page,'[data-study-action="swap"]');assert.match(await page.locator('.study-widget').innerText(),/Relative resistance: decrease/);}
  if(k===4){assert.match(await page.locator('.study-widget').innerText(),/electron left.*vacancy right/s);await click(page,'[data-study-action="majority:N"]');assert.match(await page.locator('.study-widget').innerText(),/Type N/);}
  await page.reload({waitUntil:'networkidle'});await open(page,lesson);assert.equal(await page.locator('[data-study-predict]').count(),0);assert.match(await page.locator('.study-widget').innerText(),/First prediction retained/);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  for(const b of await page.locator('.study-widget button').all()){const box=await b.boundingBox();if(box)assert.ok(box.height>=44&&box.x>=0&&box.x+box.width<=width+1);}
 }
 await page.screenshot({path:'test-artifacts/materials-'+width+'.jpg',type:'jpeg',quality:65,fullPage:true});assert.deepEqual(errors,[]);assert.deepEqual(external,[]);await context.close();console.log('PASS: materials '+width+'px, progressive cards, liquid-carrier distinction, reversed conditions, vacancy conservation, reload and touch controls.');
}}finally{await browser.close();}
