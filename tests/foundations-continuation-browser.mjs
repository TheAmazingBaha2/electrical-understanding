import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
import {chromium} from 'playwright';
import {continuationFixture} from './foundations-continuation-fixture.mjs';
import {initialStudyLesson,lessonTarget} from '../study-module-view.js';
import {emptyStudyJournal} from '../study-journal.js';
import {presentedItem} from '../study-bank.js';
import {makeStudyAttempt} from '../review-engine.js';
import {go} from './navigation-helper.mjs';
const {base,bank}=continuationFixture(),at='2026-10-16T00:00:00.000Z',old=base.lessons[0],oldState=initialStudyLesson(base,old),challenge=base.challenges[0];
oldState.tab='review';oldState.acknowledged=old.steps.map(s=>s.id);
const prediction=makeStudyAttempt({id:'old-prediction',sessionId:oldState.id,item:presentedItem(challenge,'old'),answer:{comparison:'b'},at});
oldState.activity={...oldState.activity,phase:'revealed',prediction:1,comparisonAttempted:true,attemptId:prediction.id,attemptedWorking:{actionCount:1}};
const history={...emptyStudyJournal(),events:[{id:'old-intro',type:'introduction',at,stepId:old.steps[0].id,conceptIds:['count'],sourceIds:['fixture']},prediction,...oldState.requiredItems.map((i,n)=>makeStudyAttempt({id:'old-answer'+n,sessionId:oldState.id,item:i,answer:'no',at})),{id:'old-state',type:'state',target:lessonTarget(old),parentId:null,at,value:oldState}]};
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});await mkdir('test-artifacts',{recursive:true});
const ready=p=>p.waitForFunction(()=>!document.querySelector('#main').inert);
async function click(p,s){await p.locator(s).click();await ready(p);}
async function open(p,l){await go(p,'textbooks');const chapter=p.locator('[data-source="fixture"] details.content-chapter');if(await chapter.getAttribute('open')===null)await chapter.locator('summary').click();await click(p,'[data-goto="lesson"][data-lesson="'+l.id+'"]');}
const read=p=>p.evaluate(()=>JSON.parse(localStorage.getItem('eu_introduced_practice_v1:anonymous')));
try {for(const width of [320,360,390,768,1280,1920]){
 const context=await browser.newContext({viewport:{width,height:1000},reducedMotion:'reduce',...(width<500?{isMobile:true,hasTouch:true}:{})}),page=await context.newPage(),errors=[],external=[];page.setDefaultTimeout(10000);page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(h=>{if(!localStorage.getItem('eu_introduced_practice_v1:anonymous'))localStorage.setItem('eu_introduced_practice_v1:anonymous',JSON.stringify(h));},history);
 await page.route('**/*',r=>{const u=new URL(r.request().url());if(u.hostname!=='127.0.0.1'){external.push(u.href);return r.abort();}if(u.pathname.endsWith('/study-content.js'))return r.fulfill({contentType:'text/javascript',body:'export const studyContent='+JSON.stringify(bank)+';'});return r.continue();});
 await page.goto('http://127.0.0.1:8080/',{waitUntil:'networkidle'});await open(page,old);assert.match(await page.locator('.study-module').innerText(),/Completed/);assert.deepEqual((await read(page)).events,history.events);
 for(const lesson of bank.lessons.slice(-2)){
  await open(page,lesson);await click(page,'[data-lesson-tab="learn"]');const before=(await read(page)).events.filter(e=>e.type==='introduction').length;await click(page,'[data-study-continue]');assert.equal((await read(page)).events.filter(e=>e.type==='introduction').length,before+1);
  assert.equal(await page.locator('[data-study-reveal]').count(),0);assert.doesNotMatch(await page.locator('.study-widget').innerText(),/Synthetic explanation/);
  await page.locator('input[name="study-prediction"][value="1"]').check();await ready(page);await click(page,'[data-study-predict]');
  const attempts=(await read(page)).events.filter(e=>e.type==='attempt').length;await page.reload({waitUntil:'networkidle'});await open(page,lesson);assert.equal(await page.locator('[data-study-predict]').count(),0);assert.equal((await read(page)).events.filter(e=>e.type==='attempt').length,attempts);
  await click(page,lesson===bank.lessons.at(-1)?'[data-study-action="step"]':'[data-study-action="atom:atom-0"]');await click(page,'[data-study-reveal]');assert.match(await page.locator('.study-widget').innerText(),/First prediction retained/);
  if(lesson===bank.lessons.at(-1)){
   const positions=()=>page.locator('[data-motion-particle]').evaluateAll(xs=>xs.map(x=>[x.getAttribute('cx'),x.getAttribute('cy')]));const frame=await positions();await click(page,'[data-study-action="step"]');assert.notDeepEqual(await positions(),frame);await click(page,'[data-study-action="replay"]');assert.match(await page.locator('.study-widget').innerText(),/frame 0/);
   await click(page,'[data-study-action="temperature:warmer"]');assert.match(await page.locator('.study-widget').innerText(),/solid preset · warmer/);await click(page,'[data-study-action="state:liquid"]');await page.reload({waitUntil:'networkidle'});await open(page,lesson);assert.match(await page.locator('.study-widget').innerText(),/liquid preset · warmer/);
  }else {await click(page,'[data-study-action="formula:H2O"]');assert.match(await page.locator('.study-axes').innerText(),/molecule.*compound/s);assert.match(await page.locator('.study-axes').innerText(),/H: 2 · O: 1 · total: 3/);}
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  for(const el of await page.locator('.study-widget button').all()){const b=await el.boundingBox();if(b)assert.ok(b.height>=44&&b.x>=0&&b.x+b.width<=width+1);}
  await page.screenshot({path:'test-artifacts/continuation-'+lesson.id.split('.').at(-1)+'-'+width+'.jpg',type:'jpeg',quality:65,fullPage:true});
 }
 const preserved=(await read(page)).events.filter(e=>e.id.startsWith('old-'));assert.equal(preserved.length,history.events.length);for(const event of preserved)assert.deepEqual(event,history.events.find(original=>original.id===event.id));assert.deepEqual(errors,[]);assert.deepEqual(external,[]);await context.close();console.log('PASS: continuation '+width+'px, A progress unchanged, two-axis classification, motion frames, wrong prediction and offline reload, reduced-motion/touch controls.');
}}finally{await browser.close();}
