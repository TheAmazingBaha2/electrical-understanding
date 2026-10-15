import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
import {chromium} from 'playwright';
import {studyFixture} from './foundations-fixture.mjs';
import {go} from './navigation-helper.mjs';
const bank=studyFixture(),browser=await chromium.launch({headless:true,args:['--no-sandbox'],timeout:15000});
await mkdir('test-artifacts',{recursive:true});
const journal=page=>page.evaluate(()=>JSON.parse(localStorage.getItem('eu_introduced_practice_v1:anonymous')||'{"events":[]}'));
const ready=page=>page.waitForFunction(()=>!document.querySelector('#main').inert);
async function click(page,selector){await page.locator(selector).click();await ready(page);}
async function tab(page,id){await click(page,'[data-lesson-tab="'+id+'"]');}
async function choose(page,selector){await page.locator(selector).check();await ready(page);}
async function open(page,lesson){
 await go(page,'textbooks');const chapter=page.locator('[data-source="fixture"] details.content-chapter');
 if(await chapter.getAttribute('open')===null)await chapter.locator('summary').click();
 await page.locator('[data-goto="lesson"][data-lesson="'+lesson.id+'"]').click();await page.locator('.study-module').waitFor();
}
try{for(const width of [320,360,390,768,1280,1920]){
 const context=await browser.newContext({viewport:{width,height:1000},...(width<500?{isMobile:true,hasTouch:true,userAgent:'Mozilla/5.0 (Linux; Android 14) Chrome/130 Mobile Safari/537.36'}:{})});
 const page=await context.newPage(),errors=[],external=[];page.setDefaultTimeout(10000);page.on('pageerror',e=>errors.push(e.message));
 await page.route('**/*',r=>{const u=new URL(r.request().url());if(u.hostname!=='127.0.0.1'){external.push(u.href);return r.abort();}if(u.pathname.endsWith('/study-content.js'))return r.fulfill({contentType:'text/javascript',body:'export const studyContent='+JSON.stringify(bank)+';'});return r.continue();});
 await page.goto('http://127.0.0.1:8080/',{waitUntil:'networkidle'});
 await page.evaluate(()=>localStorage.setItem('eu_demo_v1',JSON.stringify({'old-fixture':{answers:{q:{correct:false,value:'keep',reviewDue:17}},complete:true}})));
 const legacy=await page.evaluate(()=>localStorage.getItem('eu_demo_v1'));
 await go(page,'reviews');assert.match(await page.locator('#main').innerText(),/No topics have been introduced/);
 await page.locator('summary').filter({hasText:'Topics, flags'}).click();await click(page,'[data-study-flag="count"]');
 assert.equal((await journal(page)).events.filter(e=>e.type==='introduction').length,0);
 await open(page,bank.lessons[0]);assert.equal(await page.locator('.lesson-tab').count(),5);await tab(page,'learn');
 assert.equal((await journal(page)).events.filter(e=>e.type==='introduction').length,0);await click(page,'[data-study-continue]');
 assert.doesNotMatch(await page.locator('.study-widget').innerText(),/Synthetic comparison explained/);
 await choose(page,'input[name="study-prediction"][value="1"]');await click(page,'[data-study-predict]');
 await page.reload({waitUntil:'networkidle'});await open(page,bank.lessons[0]);await page.locator('[data-study-action]').waitFor();assert.equal(await page.locator('[data-study-predict]').count(),0);
 await click(page,'[data-study-action]');await click(page,'[data-study-reveal]');assert.match(await page.locator('.study-widget').innerText(),/First prediction saved/);
 await tab(page,'quiz');const order=await page.locator('input[name="study-answer"]').evaluateAll(xs=>xs.map(x=>x.value));
 await choose(page,'input[name="study-answer"][value="no"]');await click(page,'[data-study-submit]');
 await page.reload({waitUntil:'networkidle'});await open(page,bank.lessons[0]);
 assert.deepEqual(await page.locator('input[name="study-answer"]').evaluateAll(xs=>xs.map(x=>x.value)),order);assert.match(await page.locator('.study-question').innerText(),/Keep this first attempt/);
 await click(page,'[data-study-quiz="1"]');await choose(page,'input[name="study-answer"][value="no"]');await click(page,'[data-study-submit]');await tab(page,'review');
 assert.match(await page.locator('#main').innerText(),/Completed/);assert.match(await page.locator('#main').innerText(),/Needs practice/);
 await go(page,'reviews');await click(page,'[data-study-start]');await page.locator('[data-study-submit]').waitFor();
 await choose(page,'input[name="study-answer"][value="no"]');await click(page,'[data-study-submit]');
 const count=(await journal(page)).events.filter(e=>e.type==='attempt').length;await page.reload({waitUntil:'networkidle'});await go(page,'reviews');
 assert.match(await page.locator('#main').innerText(),/Keep this first attempt/);assert.equal((await journal(page)).events.filter(e=>e.type==='attempt').length,count);
 await click(page,'[data-study-next]');assert.match(await page.locator('#main').innerText(),/assisted/i);
 await choose(page,'input[name="study-answer"][value="yes"]');await click(page,'[data-study-submit]');await click(page,'[data-study-next]');
 assert.match(await page.locator('#main').innerText(),/Finished/);assert.match(await page.locator('#main').innerText(),/assisted corrections/);
 await page.locator('[data-goto="review-archive"]').click();await page.locator('#main h2').filter({hasText:'Legacy Review Archive'}).waitFor();
 assert.equal(await page.locator('[data-submit],[data-study-submit]').count(),0);assert.equal(await page.evaluate(()=>localStorage.getItem('eu_demo_v1')),legacy);
 for(const lesson of bank.lessons.slice(1)){
  await open(page,lesson);await tab(page,'learn');await click(page,'[data-study-continue]');
  if(lesson===bank.lessons[3]){for(let i=0;i<3;i++){await click(page,'[data-study-classify="element"]');if(i<2)await click(page,'[data-study-next-case]');}}
  else {await choose(page,'input[name="study-prediction"][value="0"]');await click(page,'[data-study-predict]');await click(page,'[data-study-action]');await click(page,'[data-study-reveal]');}
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
 }
 for(const t of await page.locator('.lesson-tab').all()){const b=await t.boundingBox();assert.ok(b.height>=44);if(width<500)assert.ok(b.x>=0&&b.x+b.width<=width);}
 await page.screenshot({path:'test-artifacts/foundations-'+width+'.jpg',type:'jpeg',quality:70,fullPage:true});assert.deepEqual(errors,[]);assert.deepEqual(external,[]);await context.close();
 console.log('PASS: Foundations '+width+'px: explicit introductions, all widgets, saved phases, wrong-answer completion, bounded assisted repair and view-only archive.');
}}finally{await browser.close();}
