import {chromium} from 'playwright';import assert from 'node:assert/strict';import {mkdtemp,mkdir,rm} from 'node:fs/promises';import {tmpdir} from 'node:os';import {join} from 'node:path';import {spawn} from 'node:child_process';
import {learningFixture} from './modular-learning-fixture.mjs';import {writePrivatePreview} from '../scripts/content/private-lesson-preview.mjs';
const dir=await mkdtemp(join(tmpdir(),'eu-guided-private-'));await mkdir('test-artifacts',{recursive:true});
for(const name of ['resistors','dmm']){const f=await learningFixture({published:false,rich:true});for(const d of f.bundle.entities.filter(e=>e.kind==='LabModuleDefinition')){const a=d.activities[0];if(name==='dmm')a.rubric={kind:'meter-state@1',mode:'voltage',powered:true,redRole:'source',blackRole:'common',expectedValue:5,tolerance:.00001};a.experiment={version:'1.0.0',start:'guided',template:name==='dmm'?'meter-connections@1':'divider-construction@1',allowExample:true};if(d.platform==='mobile')d.activities[1].experiment={version:'1.0.0',start:'guided',template:'resistor-bands@1',allowExample:true};}await writePrivatePreview(f.bundle,join(dir,name));}
const server=spawn('python3',['-m','http.server','8082','--bind','127.0.0.1','--directory',dir],{stdio:'ignore'}),browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const xy=async(locator,x=0,y=0)=>locator.evaluate((el,p)=>{const q=new DOMPoint(p.x,p.y).matrixTransform(el.getScreenCTM());return {x:q.x,y:q.y};},{x,y});
try{for(const name of ['resistors','dmm'])for(const width of [320,390,1650]){
 const page=await browser.newPage({viewport:{width,height:1000},...(width<500?{isMobile:true,hasTouch:true,userAgent:'Mozilla/5.0 (Linux; Android 13) Chrome/130 Mobile Safari/537.36'}:{})}),errors=[];page.setDefaultTimeout(15000);page.on('pageerror',e=>errors.push(e.message));await page.route('**/*',r=>new URL(r.request().url()).hostname==='127.0.0.1'?r.continue():r.abort());await page.goto('http://127.0.0.1:8082/'+name+'/',{waitUntil:'networkidle'});await page.locator('[data-lesson-tab="interact"]').click();await page.locator('[data-private-activity-guide]').waitFor();
 const guide=page.locator('[data-private-activity-guide]');
 const next=async()=>{
  if(!await guide.locator('[data-guide-next]').isEnabled()){
   await page.screenshot({path:'test-artifacts/guided-failure.jpg',type:'jpeg',quality:65});
   const probes=await page.locator('[data-canvas-probe]').evaluateAll(es=>es.map(e=>({color:e.dataset.canvasProbe,state:e.dataset.contactState,terminal:e.dataset.contactTerminal})));
   const wires=await page.locator('[data-canvas-wire]').evaluateAll(es=>es.map(e=>({from:e.dataset.canvasFrom,to:e.dataset.canvasTo})));
   throw Error(JSON.stringify({feedback:await guide.locator('[data-guide-feedback]').innerText(),probes,wires}));
  }
  await guide.locator('[data-guide-next]').click();
 };
 const command=(id,value)=>page.locator('[data-graphic-command="'+id+'"]'+(value===undefined?'':'[data-graphic-value="'+value+'"]')+':visible').first().click();
 await guide.locator('[data-guide-prediction="1"]').click();await next();
 if(width>500){
  assert.equal(await page.locator('[data-canvas-part]').count(),1);await page.locator('[data-expand-desktop-workspace]').click();await page.locator('[data-window-dock="max"][data-window-id="circuit"]').click();await page.screenshot({path:'test-artifacts/guided-'+name+'-minimal.jpg',type:'jpeg',quality:65});
  const world=page.locator('[data-canvas-world]');for(const pos of [{x:500,y:210},{x:500,y:450}]){await command('canvas-tool','resistor');const p=await xy(world,pos.x,pos.y);await page.mouse.click(p.x,p.y);}
  assert.equal(await page.locator('[data-canvas-part]').count(),3);await next();
  const ids=await page.locator('[data-canvas-part]').evaluateAll(es=>es.map(e=>e.dataset.canvasPart)),upper=ids.find(id=>id!=='V1'),lower=ids.find(id=>id!=='V1'&&id!==upper);
  await command('canvas-tool','wire');for(const [from,to] of [['V1.p',upper+'.p'],[upper+'.n',lower+'.p'],[lower+'.n','V1.n']]){await page.locator('[data-canvas-terminal="'+from+'"]').click();await page.locator('[data-canvas-terminal="'+to+'"]').click();}
  await command('canvas-tool','inspect');for(const [color,t] of [['red',name==='dmm'?'V1.p':upper+'.n'],['black','V1.n']]){const p=await xy(page.locator('[data-canvas-probe="'+color+'"]'),30,-35);await page.mouse.click(p.x,p.y);await page.locator('[data-canvas-terminal="'+t+'"]').click();}
  await next();await command('circuit-power','true');
 }else{
  await next();for(const [color,contact] of [['red',name==='dmm'?'source':'output'],['black','common']]){await command('probe-select',color);await page.locator('[data-mobile-contact="'+contact+'"]').tap();}await next();await command('pilot-power','true');
 }
 assert.match(await guide.locator('[data-guide-feedback]').innerText(),name==='dmm'?/5\.000 V/:/2\.500 V/);await next();await guide.locator('[data-activity-explain="0"]').click();await next();assert.match(await guide.locator('[data-guide-title]').innerText(),/Debrief/);
 await page.waitForTimeout(250);await page.reload({waitUntil:'networkidle'});await page.locator('[data-lesson-tab="interact"]').click();await page.locator('[data-private-activity-guide]').waitFor();assert.match(await guide.locator('[data-guide-title]').innerText(),/Debrief/);assert.equal(await page.locator('[data-private-graded]').count(),0);assert.match(await page.locator('[data-private-completion]').innerText(),/Core 0\/1.*Desktop 0\/1/);
 // Restart snapshots the old circuit without clearing unrelated data or attempts.
 await guide.locator('[data-activity-restart]').click();await guide.locator('[data-activity-confirm]').click();assert.match(await guide.locator('[data-guide-title]').innerText(),/Predict/);if(width>500)assert.equal(await page.locator('[data-canvas-part]').count(),1);
 await guide.locator('[data-guide-prediction="1"]').click();await guide.locator('[data-activity-example]').click();await guide.locator('[data-activity-confirm]').click();assert.equal(await page.locator('[data-practical-check]').isDisabled(),true);assert.match(await guide.innerText(),/Example mode/);
 await page.waitForFunction(()=>Object.values(localStorage).some(raw=>{try{const p=JSON.parse(raw).project;return p?.id?.startsWith('activity-')&&p.snapshots.length>=2&&p.experimentState.activitySession.example;}catch{return false;}}));
 const recovery=await page.evaluate(()=>Object.entries(localStorage).map(([k,v])=>{try{return JSON.parse(v)}catch{return null;}}).find(v=>v?.project?.id?.startsWith('activity-')));assert.ok(recovery.project.snapshots.length>=2);assert.ok(recovery.project.experimentState.activitySession.example);
 await guide.locator('details:has([data-activity-recovery]) summary').click();await guide.locator('[data-activity-recovery]').selectOption({index:0});await guide.locator('[data-activity-restore]').click();assert.equal(await page.locator('[data-practical-check]').isDisabled(),false);assert.match(await guide.locator('[data-guide-title]').innerText(),/Debrief/);
 if(name==='resistors'&&width<500){await page.locator('[data-private-activity]').selectOption('1');await guide.locator('[data-guide-prediction="1"]').click();await next();assert.equal(await guide.locator('[data-guide-next]').isDisabled(),true);await command('resistor-value','1000');await next();await next();assert.match(await guide.locator('[data-guide-feedback]').innerText(),/1000 Ω/);await next();await guide.locator('[data-activity-explain="0"]').click();await next();await page.locator('[data-practical-check]').click();await page.waitForFunction(()=>document.querySelector('[data-practical-feedback]').textContent.includes('Outcome demonstrated'));}
 await page.screenshot({path:'test-artifacts/guided-'+name+'-'+width+'.jpg',type:'jpeg',quality:65,fullPage:width<500});assert.deepEqual(errors,[]);await page.close();console.log('PASS: '+name+' '+width+'px prediction → real construction/connection → actual measurement → explanation/debrief; exact resume, restart snapshots and ungraded example.');
}}finally{await browser.close();server.kill();await rm(dir,{recursive:true,force:true});}
