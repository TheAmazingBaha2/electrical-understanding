import {go} from './navigation-helper.mjs';
import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
import {chromium} from 'playwright';
import {geierWorkshops,reviseDmmLessons} from '../geier-workshops.js';
import {bookLessons} from '../book-lessons.js';
const key='eu_progress:hkwmtjhgrskidaizamwy:anonymous';
await mkdir('test-artifacts',{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH||undefined,args:process.env.CHROMIUM_PATH?['--no-sandbox']:[]});
try{
 for(const width of [390,1440]){
  const page=await browser.newPage({viewport:{width,height:1000}}),errors=[],providerRequests=[];
  page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(/api\.openai|api\.anthropic|functions\/v1/.test(r.url()))providerRequests.push(r.url());});
  await page.route('https://esm.sh/**',route=>route.abort());
  await page.addInitScript(()=>{if(!localStorage.getItem('eu_demo_v1'))localStorage.setItem('eu_demo_v1',JSON.stringify({'BDMM-01':{answers:{b101:{value:'0',correct:true,reviewDue:777,extra:'retain'}},complete:false}}));});
  await page.goto('http://127.0.0.1:8080/');await page.locator('[data-dashboard-source="geier"]').waitFor();
  assert.equal(await page.locator('[data-dashboard-source="geier"] .dashboard-chapter').count(),2);
  async function open(l){
   await go(page,'textbooks');
   const chapter=page.locator('[data-disclosure="contents:geier:'+l.curriculum.chapter_id+'"]');
   if(!(await chapter.getAttribute('open')!==null))await chapter.locator('summary').first().click();
   if(l.id==='GEIER-C2-W01')await chapter.locator('[data-content-lesson="'+l.id+'"]').screenshot({path:'test-artifacts/reference-card-'+width+'.png'});
   await chapter.locator('[data-goto="lesson"][data-lesson="'+l.id+'"]').click();await page.locator('.lesson-header').waitFor();
  }
  await go(page,'textbooks');assert.equal(await page.locator('.content-chapter').count(),15);
  assert.match(await page.locator('[data-disclosure="contents:geier:6"]').innerText(),/Working Your Weapons/);
  assert.equal(await page.locator('.chapter-lesson-copy .lesson-page-reference').count(),16);
  const referenceOrder=await page.locator('[data-content-lesson="GEIER-C2-W01"] .chapter-lesson-copy').evaluate(el=>{const nodes=[...el.children];return nodes.findIndex(n=>n.classList.contains('lesson-page-reference'))<nodes.findIndex(n=>n.tagName==='SMALL');});assert.equal(referenceOrder,true);
  for(const l of [...reviseDmmLessons(bookLessons),...geierWorkshops].filter(l=>l.workshop)){
   await open(l);assert.match(await page.locator('.lesson-header').innerText(),/Self-paced workshop/);assert.equal(await page.locator('.lesson-tab').count(),5);
   // Tool reference is usable on Overview, not just Interact.
   if(l.id==='GEIER-C2-W01'){
    await page.locator('.workshop-tool-reference>summary').click();await page.locator('.workshop-tool-reference [data-tool-search]').fill('capacitor');assert.ok(await page.locator('.workshop-tool-reference .tool-card').count()>0);await page.locator('.workshop-tool-reference .tool-card>summary').first().click();assert.match(await page.locator('.workshop-tool-reference').innerText(),/What to check/);
   }
   await page.locator('.lesson-tabs [data-lesson-tab="learn"]').click();assert.equal(await page.locator('.concept-step').count(),l.sections.length);assert.equal(await page.locator('#main textarea').count(),0);
   await page.locator('.lesson-tabs [data-lesson-tab="interact"]').click();assert.equal(await page.locator('.activity-step').count(),l.activities.length);
   for(const [i,a] of l.activities.entries()){
    await page.locator('.activity-step[data-activity-index="'+i+'"]').click();const widget=page.locator('[data-workshop-activity="'+a.id+'"]');
    if(a.required===false){assert.ok(await widget.locator('.tool-card').count()>=25);continue;}
    if(a.fields){for(const f of a.fields)await widget.locator('[data-workshop-field="'+f.id+'"]').selectOption(String(f.answer));}
    if(a.kind==='inspect'){for(const item of a.items.filter(x=>x.problem))await widget.locator('input[value="'+item.id+'"]').check();}
    if(a.kind==='scenario'){for(const [j,c] of a.cases.entries())await widget.locator('[data-case="'+j+'"][value="'+c.correct+'"]').check();}
    if(a.kind==='sequence'){
     for(let target=0;target<a.correctOrder.length;target++){
      const expected=a.steps.find(s=>s.id===a.correctOrder[target]).text;
      let texts=await widget.locator('.workshop-sequence li>span').allTextContents(),current=texts.indexOf(expected);
      while(current>target){await widget.locator('[data-sequence-move="'+current+'"][data-direction="-1"]').click();current--;}
     }
    }
    if(l.id==='GEIER-C2-W01'&&i===0){
     await widget.locator('[data-workshop-field="device"]').selectOption('blocked');await widget.locator('[data-workshop-check]').click();await page.waitForFunction(({key,id,aid})=>JSON.parse(localStorage.getItem(key)||'{}').progress?.[id]?.workshopChecks?.[aid]?.correct===false,{key,id:l.id,aid:a.id});
     await widget.locator('[data-workshop-field="device"]').selectOption('center');
    }
    await widget.locator('[data-workshop-check]').click();await page.waitForFunction(({key,id,aid})=>JSON.parse(localStorage.getItem(key)||'{}').progress?.[id]?.workshopChecks?.[aid]?.correct===true,{key,id:l.id,aid:a.id});
    assert.match(await widget.locator('[data-workshop-feedback]').innerText(),/decisions fit/);
    if(l.id==='BDMM-01'&&i===0||l.id==='GEIER-C2-W01'&&i===0||l.id==='GEIER-C2-W04'&&i===0||l.id==='GEIER-C2-W07'&&i===0){await page.screenshot({path:'test-artifacts/workshop-'+l.id+'-'+width+'.png',fullPage:true});}
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+2),l.id+' '+a.id+' overflow');
   }
   await page.locator('.lesson-tabs [data-lesson-tab="review"]').click();assert.match(await page.locator('.workshop-review').innerText(),/complete/);
   await page.locator('[data-workshop-jump="0"]').click();assert.equal(await page.locator('[data-workshop-activity]').getAttribute('data-workshop-activity'),l.activities[0].id);assert.match(await page.locator('[data-workshop-status]').innerText(),/completed/);
   await page.locator('.lesson-tabs [data-lesson-tab="review"]').click();await page.locator('[data-goto="textbooks"][data-lesson="geier:'+l.curriculum.chapter_id+'"]').click();assert.equal(await page.locator('[data-disclosure="contents:geier:'+l.curriculum.chapter_id+'"]').getAttribute('open'),'');
  }
  // A reload preserves checkpoint decisions and restores the actual control state.
  await page.reload();await open(geierWorkshops[0]);await page.locator('.lesson-tabs [data-lesson-tab="interact"]').click();assert.equal(await page.locator('[data-workshop-field="device"]').inputValue(),'center');assert.match(await page.locator('[data-workshop-feedback]').innerText(),/Saved checkpoint/);
  // Quiz alone isn't workshop mastery: activities were completed above; now actual quiz UI completes this workshop.
  await page.locator('.lesson-tabs [data-lesson-tab="quiz"]').click();
  for(const [i,q] of geierWorkshops[0].questions.entries()){
   await page.locator('.quiz-step[data-quiz-index="'+i+'"]').click();await page.locator('.quiz-card input[value="'+q.correct+'"]').check();await page.locator('[data-submit="'+q.id+'"]').click();
   await page.waitForFunction(({key,qid})=>JSON.parse(localStorage.getItem(key)||'{}').progress?.['GEIER-C2-W01']?.answers?.[qid]?.correct===true,{key,qid:q.id});
  }
  await page.locator('.lesson-tabs [data-lesson-tab="review"]').click();assert.match(await page.locator('.lesson-summary').innerText(),/Lesson mastered/);await page.locator('[data-goto="lesson"][data-lesson="GEIER-C2-W02"]').click();assert.match(await page.locator('.lesson-header').innerText(),/Choose the tool/);
  const summary=geierWorkshops.find(l=>l.chapterSummary);await open(summary);assert.equal(await page.locator('.chapter-takeaways li').count(),10);await page.locator('.lesson-tabs [data-lesson-tab="quiz"]').click();assert.equal(await page.locator('.quiz-step').count(),12);
  await go(page,'dashboard');const c2=page.locator('[data-disclosure="dashboard:geier:2"]');assert.match(await c2.innerText(),/1 \/ 11 lessons mastered/);await c2.locator('summary').first().click();assert.equal(await c2.locator('.chapter-lesson').count(),11);
  const old=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)).progress['BDMM-01'].answers.b101,key);assert.deepEqual(old,{value:'0',correct:true,reviewDue:777,extra:'retain'});
  assert.equal(providerRequests.length,0);assert.deepEqual(errors,[]);await page.close();
 }
 console.log('PASS: desktop/phone mixed widgets, all required checkpoints, retries, reload/control recovery, reference search, stable old progress, quizzes, chapter return and shared dashboard. No real cloud writes or paid calls.');
}finally{await browser.close();}
