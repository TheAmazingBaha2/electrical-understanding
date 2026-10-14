// Synthetic content only; no published lesson or real learner record is changed.
import assert from 'node:assert/strict';import {chromium} from 'playwright';
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
try{
 const page=await browser.newPage({viewport:{width:1600,height:1100}}),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.route('**/*',r=>new URL(r.request().url()).hostname==='127.0.0.1'?r.continue():r.abort());await page.goto('http://127.0.0.1:8080/');
 await page.evaluate(async()=>{
  const {renderLessonLabs,attachLessonLabs}=await import('/lesson-labs.js'),{recordLabActivity}=await import('/lab-modules.js'),{ProgressStore}=await import('/persistence.js'),{lessonRequirementsMet}=await import('/workshop-progress.js');
  const lesson={id:'QA-DUAL',questions:[{id:'QA-CORE',safety:false}],labs:{completionPolicy:'either'}};
  for(const platform of ['desktop','mobile'])lesson.labs[platform]={id:'QA-'+platform,version:'1.0.0',title:platform+' practical',activities:[{id:'QA-'+platform+'-voltage',title:'Measure output',prompt:'Connect red to output and black to common.',required:true,source_ids:['QA-REF'],assessment:{type:'dc-voltage',redNode:'output',blackNode:'common',valueVolts:2.5,toleranceVolts:.001,explanation:'Equal resistors divide a 5 V supply in half.'}}]};
  const store=new ProgressStore(localStorage,null);await store.edit(lesson.id,s=>{s.answers={'QA-CORE':{correct:true,attempts:7,reviewDue:123}};s.complete=false;});localStorage.setItem('eu_lab_platform_v1','desktop');
  const root=document.createElement('section');root.id='dual-lab-test';document.querySelector('#main').replaceChildren(root);let cleanup;
  async function draw(){await cleanup?.();const state=store.read().progress[lesson.id];root.innerHTML=renderLessonLabs(lesson,state);cleanup=attachLessonLabs(root,lesson,{state,onPlatformChange:draw,saveActivity:async(platform,id,submission)=>{const doc=await store.edit(lesson.id,s=>{Object.assign(s,recordLabActivity(lesson,s,platform,id,submission));s.complete=lessonRequirementsMet(lesson,s);});return doc.progress[lesson.id];}});}
  await draw();window.qaDualState=()=>store.read().progress[lesson.id];
 });
 const root=page.locator('#dual-lab-test');await root.locator('[data-practical-measure="QA-desktop-voltage"]').click();await root.locator('[data-practical-feedback]').filter({hasText:'Saved independently'}).waitFor();assert.match(await root.locator('[data-practical-count]').innerText(),/1 \/ 1/);assert.equal(await root.locator('[data-practical-requirement]').innerText(),'met');
 const desktop=await page.evaluate(()=>window.qaDualState().labModules.desktop);await root.locator('[data-lab-platform-choice]').selectOption('mobile');await root.locator('.mobile-lab').waitFor();assert.match(await root.locator('[data-practical-count]').innerText(),/0 \/ 1/);assert.equal(await root.locator('[data-practical-requirement]').innerText(),'met');
 await root.locator('[data-mobile-contact="source"]').click();await root.locator('[data-practical-measure="QA-mobile-voltage"]').click();await root.locator('[data-practical-feedback]').filter({hasText:'Needs another attempt'}).waitFor();assert.equal(await root.locator('[data-practical-requirement]').innerText(),'met');
 await root.locator('[data-mobile-contact="output"]').click();await root.locator('[data-practical-measure="QA-mobile-voltage"]').click();await root.locator('[data-practical-feedback]').filter({hasText:'Correct.'}).waitFor();
 const state=await page.evaluate(()=>window.qaDualState());assert.equal(state.complete,true);assert.deepEqual(state.labModules.desktop,desktop);assert.equal(state.labModules.mobile['QA-mobile@1.0.0'].gradeCounters.attempts,2);assert.deepEqual(state.answers,{'QA-CORE':{correct:true,attempts:7,reviewDue:123}});assert.deepEqual(errors,[]);
 console.log('PASS: five-tab lab adapter saves independent grades, either completion, immediate counters and unchanged core answers/review state.');
}finally{await browser.close();}
