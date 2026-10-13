import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {authoredSeries} from './chapter3-series-fixture.mjs';
const curated=authoredSeries();
// Vetted widgets and model-selected formats only; no provider or private account.
const browser=await chromium.launch({headless:true});
try{
 for(const width of [390,1280]){
  const page=await browser.newPage({viewport:{width,height:900}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.route('https://esm.sh/**',r=>r.abort());await page.goto('http://127.0.0.1:8080/');await page.locator('.dashboard-welcome').waitFor();
  await page.evaluate(async()=>{
   const {renderActivitySelector,attachGeneratedPredictions}=await import('/lesson-tabs.js');
   const {attachGeneratedSimulations}=await import('/generated-simulations.js');
   const activities=[{kind:'choice',title:'Choose the change',prompt:'With resistance fixed, doubling voltage does what?',answer:'Doubles current',explanation:'I = V/R.',choices:['Doubles current','Halves current','No change'],correct:0,source_ids:['S1']},
    {kind:'simulation',title:'Explore voltage and current',prompt:'Move voltage at fixed resistance.',answer:'Current scales with voltage',explanation:'Ideal Ohms law',simulator:'ohm',source_ids:['S1']}];
   window.__lesson={experiment:'generated',activities};window.__notices=[];
   window.__showTask=i=>{document.querySelector('#main').innerHTML=renderActivitySelector(window.__lesson,i);attachGeneratedPredictions(document.querySelector('#main'),m=>window.__notices.push(m));attachGeneratedSimulations(document.querySelector('#main'));};
   window.__showTask(0);
  });
  assert.equal(await page.locator('#main textarea').count(),0);assert.equal(await page.locator('input[type=radio]').count(),3);
  await page.locator('[data-generated-reveal]').click();assert.equal(await page.locator('[data-generated-feedback]').isVisible(),false);
  assert.deepEqual(await page.evaluate(()=>window.__notices),['Choose a prediction first.']);
  await page.locator('input[type=radio][value="0"]').check();await page.locator('[data-generated-reveal]').click();assert.match(await page.locator('[data-generated-feedback]').innerText(),/Your prediction matches/);
  await page.evaluate(()=>window.__showTask(1));assert.equal(await page.locator('input[type=range]').count(),2);
  const before=await page.locator('[data-sim-result]').innerText();await page.locator('input[aria-label="Voltage"]').evaluate(el=>{el.value='10';el.dispatchEvent(new Event('input',{bubbles:true}));});
  assert.notEqual(await page.locator('[data-sim-result]').innerText(),before);assert.equal(await page.locator('[data-sim-curve] svg').count(),1);assert.match(await page.locator('[data-sim-result]').innerText(),/10 mA/);
  const size=await page.evaluate(()=>({actual:document.documentElement.scrollWidth,width:innerWidth}));assert.ok(size.actual<=size.width+2);assert.deepEqual(errors,[]);
  await page.evaluate(async({source,series})=>{
   const {approvedWorkbenchLessons}=await import('/generated-library.js');
   const {renderSourceSection}=await import('/source-navigation.js');
   const {v2Dashboard}=await import('/v2-panels.js');
   const {tabbedLesson}=await import('/lesson-view.js');
   const {attachGeneratedPredictions}=await import('/lesson-tabs.js');
   const {attachGeneratedSimulations}=await import('/generated-simulations.js');
   window.__series=approvedWorkbenchLessons([{...source,state:'approved',lesson:{lessons:[],curated_series:series}}]);
   window.__math=()=>document.querySelector('#main').innerHTML=renderSourceSection('ceta',{activeMathLessons:[],activeGeneratedLessons:window.__series},'associate-cet:3');
   window.__dashboard=()=>document.querySelector('#main').innerHTML=v2Dashboard({lessons:[],labLessons:[],bookLessons:[],activeCetaLessons:[],activeMathLessons:[],activeGeneratedLessons:window.__series,archivedGeneratedLessons:[],progress:{},reviews:0,banner:'',hasPassed:()=>false});
   window.__curatedTab=(i,tab,activityIndex=0)=>{
    const lesson=window.__series[i];document.querySelector('#main').innerHTML=tabbedLesson({lesson,answers:{},score:{correct:0,total:lesson.questions.length},passed:false,tab,activityIndex,learnIndex:0,quizIndex:0,questionHtml:q=>'<div>'+q.prompt+'</div>'});
    attachGeneratedPredictions(document.querySelector('#main'));attachGeneratedSimulations(document.querySelector('#main'));
   };window.__math();
  },curated);
  assert.equal(await page.locator('.chapter-lesson').count(),16);assert.equal(await page.locator('.chapter-lesson [data-goto="generated-lesson"]').count(),16);
  await page.evaluate(()=>window.__dashboard());
  assert.equal(await page.locator('.dashboard-chapter').count(),1);assert.equal(await page.locator('.dashboard-lesson-list .lesson-progress-bar').count(),16);
  assert.equal(await page.locator('.dashboard-welcome [data-lesson="C3-CURATED-U01"]').count(),0);
  for(let i=0;i<16;i++){
   await page.evaluate(i=>window.__curatedTab(i,'overview'),i);assert.match(await page.locator('.lesson-briefing').innerText(),/CHAPTER 3/);
   await page.evaluate(i=>window.__curatedTab(i,'quiz'),i);assert.equal(await page.locator('.quiz-step').count(),curated.series.lessons[i].questions.length);
   for(let j=0;j<curated.series.lessons[i].activities.length;j++){
    await page.evaluate(([i,j])=>window.__curatedTab(i,'interact',j),[i,j]);assert.equal(await page.locator('#main textarea').count(),0);
    const a=curated.series.lessons[i].activities[j];
    if(a.kind==='simulation'){
     assert.ok(await page.locator('input[type=range]').count()>0);assert.ok(!(await page.locator('[data-sim-result]').innerText()).includes('—'));
     const slider=page.locator('input[type=range]').first();await slider.evaluate(el=>{el.value=el.max;el.dispatchEvent(new Event('input',{bubbles:true}));});
    }else{
     await page.locator('input[type=radio][value="'+a.correct+'"]').check();await page.locator('[data-generated-reveal]').click();assert.match(await page.locator('[data-generated-feedback]').innerText(),/Your prediction matches/);
    }
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+2),'Curated activity overflows '+i+'/'+j);
   }
  }
  assert.deepEqual(errors,[]);
  await page.close();
 }
 console.log('PASS: phone/desktop predictions, all 37 curated activities, 16 variable quizzes, Math routes and unique dashboard scope.');
}finally{await browser.close();}
