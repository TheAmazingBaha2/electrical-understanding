import assert from 'node:assert/strict';import {mkdir} from 'node:fs/promises';import {chromium} from 'playwright';
import {flowFixture} from './foundations-flow-fixture.mjs';import {go} from './navigation-helper.mjs';
const {bank}=flowFixture(),browser=await chromium.launch({headless:true,args:['--no-sandbox']});await mkdir('test-artifacts',{recursive:true});
const ready=p=>p.waitForFunction(()=>!document.querySelector('#main').inert);
async function click(p,s){await p.locator(s).click();await ready(p);}
async function open(p,l){await go(p,'lessons');const ch=p.locator('[data-source="electricity-foundations"] details.content-chapter');if(await ch.getAttribute('open')===null)await ch.locator('summary').click();await click(p,'[data-goto="lesson"][data-lesson="'+l.id+'"]');}
try{for(const width of [320,390,1440]){
 const context=await browser.newContext({viewport:{width,height:1000},reducedMotion:'reduce',...(width<500?{isMobile:true,hasTouch:true}:{})}),p=await context.newPage(),errors=[],external=[];p.setDefaultTimeout(10000);p.on('pageerror',e=>errors.push(e.message));
 await p.route('**/*',r=>{const u=new URL(r.request().url());if(u.hostname!=='127.0.0.1'){external.push(u.href);return r.abort();}if(u.pathname.endsWith('/study-content.js'))return r.fulfill({contentType:'text/javascript',body:'export const studyContent='+JSON.stringify(bank)+';'});return r.continue();});await p.goto('http://127.0.0.1:8080/',{waitUntil:'networkidle'});
 assert.equal(await p.locator('[data-view="textbooks"]').count(),0);assert.equal(await p.locator('[data-dashboard-category="lessons"]').count(),1);
 for(const [k,l] of bank.lessons.slice(-6,-1).entries()){
  await open(p,l);await click(p,'[data-lesson-tab="learn"]');await click(p,'[data-study-continue]');assert.doesNotMatch(await p.locator('.study-widget').innerText(),/Synthetic flow explanation/);
  await p.locator('input[name="study-prediction"][value="1"]').check();await ready(p);await click(p,'[data-study-predict]');
  for(const a of [['run'],['discharge'],['open-path'],['change-voltage'],['input:electrical','output:mechanical','compare']][k])await click(p,'[data-study-action="'+a+'"]');await click(p,'[data-study-reveal]');assert.match(await p.locator('.study-widget').innerText(),/Synthetic flow explanation/);
  if(k===2){assert.match(await p.locator('[data-flow-observation]').innerText(),/3 V.*zero/s);await click(p,'[data-study-action="terminal:V1.p"]');await click(p,'[data-study-action="terminal:R1.a"]');assert.match(await p.locator('[data-flow-observation]').innerText(),/nonzero/);}
  if(k===3){assert.match(await p.locator('[data-flow-observation]').innerText(),/2 A/);assert.equal(await p.locator('[data-study-action="resistance:6"]').isDisabled(),true);}
  await p.screenshot({path:'test-artifacts/flow-'+k+'-'+width+'.jpg',type:'jpeg',quality:65,fullPage:true});
  await p.reload({waitUntil:'networkidle'});await open(p,l);assert.match(await p.locator('.study-widget').innerText(),/Synthetic flow explanation/);assert.equal(await p.locator('[data-study-predict]').count(),0);assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  async function checkTargets(){let visible=0;for(const b of await p.locator('.study-widget button').all()){if(await b.evaluate(el=>Boolean(el.closest('details:not([open])')))||!await b.isVisible())continue;const box=await b.boundingBox();assert.ok(box&&box.height>=44&&box.x>=0&&box.x+box.width<=width+1,JSON.stringify({width,k,label:await b.innerText(),box}));visible++;}assert.ok(visible>0);assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);}
  await checkTargets();for(const summary of await p.locator('.study-explore > summary').all()){await summary.click();await checkTargets();}
 }
 const recap=bank.lessons.at(-1);await open(p,recap);await click(p,'[data-lesson-tab="learn"]');assert.match(await p.locator('#main').innerText(),/no new enrollment/);await click(p,'[data-lesson-tab="overview"]');await click(p,'[data-study-recap-start]');assert.match(await p.locator('#main').innerText(),/check 1 \/ 10/);
 await p.locator('input[name="study-answer"][value="no"]').check();await ready(p);await click(p,'[data-study-submit]');await click(p,'[data-study-quiz="4"]');assert.match(await p.locator('#main').innerText(),/Block 2/);
 await p.reload({waitUntil:'networkidle'});await open(p,recap);assert.match(await p.locator('#main').innerText(),/Block 2/);await click(p,'[data-study-quiz="0"]');assert.equal(await p.locator('input[name="study-answer"]:disabled').count(),4);
 await click(p,'[data-lesson-tab="interact"]');await click(p,'[data-study-recap-action="terminal:V1.p"]');await click(p,'[data-study-recap-action="terminal:R1.a"]');assert.match(await p.locator('[data-flow-observation]').innerText(),/1 A/);
 await p.screenshot({path:'test-artifacts/recap-'+width+'.jpg',type:'jpeg',quality:65,fullPage:true});assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);assert.deepEqual(errors,[]);assert.deepEqual(external,[]);await context.close();console.log('PASS: flow/energy/recap '+width+'px, topic navigation, saved prediction, real connection, V/R lock, immutable recap and reload.');
}}finally{await browser.close();}
