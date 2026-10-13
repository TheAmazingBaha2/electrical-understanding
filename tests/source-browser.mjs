import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {mkdir} from 'node:fs/promises';
import {authoredSeries} from './chapter3-series-fixture.mjs';
const {source,series}=authoredSeries();const job={...source,state:'approved',lesson:{lessons:[],curated_series:series}};
await mkdir('test-artifacts',{recursive:true});
const browser=await chromium.launch({headless:true});
try{
 for(const width of [390,1440]){
  const page=await browser.newPage({viewport:{width,height:1000}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.addInitScript(job=>{window.__fixtureJob=job;window.__writes=[];window.__paid=[];window.__rows=[];},job);
  // All account/service traffic is a local mock; no real authentication, cloud writes or spending.
  await page.route('https://esm.sh/**',route=>route.fulfill({contentType:'text/javascript',body:`export function createClient(){const user={id:'fixture-owner',email:'fixture@example.test'};return {auth:{getSession:async()=>({data:{session:{user}}}),onAuthStateChange(){},signOut:async()=>{}},from(table){let patch=null;const q={select(){return q},range(){return q},insert(v){patch=v;return q},update(v){patch={...v,lesson_id:'C3-CURATED-U01'};return q},eq(){return q},in(){return q},order(){return q},limit(){return q},maybeSingle:async()=>({data:null}),then(resolve){if(patch){window.__writes.push(patch);window.__rows=[{...patch,revision:patch.revision||0}];}resolve({data:table==='scan_lesson_jobs'?[window.__fixtureJob]:table==='lesson_progress'?window.__rows:[],error:null});}};return q;},rpc:async(name,args)=>{window.__writes.push({name,args});return {data:{lesson_id:args.p_lesson_id,data:args.p_data,revision:1}};},functions:{invoke:async(name,args)=>{window.__paid.push({name,args});return {data:{paused:true}};}}};}` }));
  await page.route('https://fixture.workers.dev/**',async route=>{const url=new URL(route.request().url());const response=await page.request.get('http://127.0.0.1:8080'+(url.pathname==='/'?'/index.html':url.pathname));await route.fulfill({response});});
  await page.goto('https://fixture.workers.dev/');await page.locator('.dashboard-book').waitFor();
  assert.equal(await page.locator('.workspace-top-tabs .workspace-tab').count(),7);assert.equal(await page.locator('[data-view="scan-inbox"]').count(),0);
  assert.equal(await page.locator('.dashboard-chapter').count(),1);assert.equal(await page.locator('.dashboard-lesson-list .chapter-lesson').count(),16);
  assert.equal(await page.locator('.dashboard-lesson-list').isVisible(),false);
  await page.locator('.dashboard-chapter > summary').click();assert.equal(await page.locator('.dashboard-lesson-list').isVisible(),true);
  if(width===1440){const bytes=await page.screenshot({path:'test-artifacts/chapter-dashboard-desktop.jpg',type:'jpeg',quality:65});console.log('SOURCE_QA_IMAGE:dashboard:'+bytes.toString('base64'));}
  await page.locator('.dashboard-lesson-list [data-lesson="C3-CURATED-U01"]').click();assert.match(await page.locator('.bread').innerText(),/Exam Practice.*Chapter 3/);
  await page.locator('.lesson-tabs [data-lesson-tab="quiz"]').click();const correct=series.lessons[0].questions[0].correct;await page.locator('.quiz-card input[value="'+correct+'"]').check();await page.locator('[data-submit="C3-CURATED-U01-Q01"]').click();
  await page.waitForFunction(()=>JSON.parse(localStorage.getItem('eu_progress:hkwmtjhgrskidaizamwy:fixture-owner')||'{}').progress?.['C3-CURATED-U01']?.answers?.['C3-CURATED-U01-Q01']?.correct===true);
  await page.locator('.lesson-tabs [data-lesson-tab="review"]').click();await page.locator('[data-goto="ceta"][data-lesson="associate-cet:3"]').click();
  assert.equal(await page.locator('.content-chapter').count(),22);assert.equal(await page.locator('[data-disclosure="contents:associate-cet:3"]').getAttribute('open'),'');
  assert.equal(await page.locator('[data-disclosure="contents:associate-cet:3"] .chapter-lesson').count(),16);
  if(width===390){const bytes=await page.screenshot({path:'test-artifacts/chapter-contents-phone.jpg',type:'jpeg',quality:65});console.log('SOURCE_QA_IMAGE:contents:'+bytes.toString('base64'));}
  await page.locator('.workspace-top-tabs [data-view="math"]').click();assert.equal(await page.locator('.chapter-lesson').count(),0);
  await page.locator('.workspace-top-tabs [data-view="textbooks"]').click();assert.equal(await page.locator('.source-book').count(),1);await page.locator('[data-disclosure="contents:geier:6"] > summary').click();assert.equal(await page.locator('[data-lesson="BDMM-01"]').count(),1);
  await page.locator('.workspace-top-tabs [data-view="labs"]').click();assert.equal(await page.locator('.source-book').count(),4);assert.equal(await page.locator('.content-chapter').count(),21);
  await page.locator('.workspace-top-tabs [data-view="reviews"]').click();assert.match(await page.locator('#main').innerText(),/still to be decided/);
  await page.locator('.workspace-top-tabs [data-view="account"]').click();assert.match(await page.locator('#main').innerText(),/cross-device sync/);await page.locator('.account-maintenance > summary').click();assert.equal(await page.locator('[data-goto="scan-inbox"]').isVisible(),true);
  assert.equal(await page.evaluate(()=>window.__paid.length),0);assert.ok(await page.evaluate(()=>window.__writes.length)>0);
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+2));assert.deepEqual(errors,[]);await page.close();
 }
 console.log('PASS: real app navigation, private Chapter 3 loading, responsive chapter dropdowns, quizzes, saved IDs, source return, hidden scans and account sync with mocked services.');
}finally{await browser.close();}
