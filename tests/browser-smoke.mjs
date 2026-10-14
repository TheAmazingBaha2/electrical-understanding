import {go} from './navigation-helper.mjs';
import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
import {chromium} from 'playwright';
await mkdir('test-artifacts',{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH||undefined,args:process.env.CHROMIUM_PATH?['--no-sandbox']:[]});
try{
 for(const width of [390,1440]){
  const page=await browser.newPage({viewport:{width,height:1000}}),errors=[];page.on('pageerror',e=>{errors.push(e.message);console.log('BROWSER_ERROR',e.stack);});
  await page.route('https://esm.sh/**',r=>r.abort());await page.goto('http://127.0.0.1:8080/');await page.locator('.dashboard-welcome').waitFor();
  assert.equal(await page.locator('.dashboard-area').count(),0);assert.equal(await page.locator('.v2-frost-ring,.v2-evidence-pie').count(),0);assert.equal(await page.locator('[data-view="scan-inbox"],[data-view="legacy"]').count(),0);
  await go(page,'ceta');assert.equal(await page.locator('.content-chapter').count(),22);assert.equal(await page.locator('.source-book').count(),1);
  await go(page,'account');await page.locator('.account-maintenance > summary').click();await page.locator('[data-goto="legacy"]').click();
  await page.locator('[data-goto="lesson"][data-lesson="CETA-G03-01"]').click();await page.locator('.lesson-tabs [data-lesson-tab="interact"]').click();assert.equal(await page.locator('.ceta-illustration').count(),1);await page.locator('[data-x="p"]').selectOption('kilo');assert.match(await page.locator('.ceta-illustration').textContent(),/1 kA = 1,000 A/);
  await go(page,'labs');assert.deepEqual(errors,[]);await page.locator('[data-disclosure="contents:basic:PreLab"] > summary').click();
  await page.locator('[data-lesson="EIM-BEC-PRELAB"]').click();assert.equal(await page.locator('.lesson-tab').count(),5);assert.match(await page.locator('.lesson-overview').innerText(),/1,080/);await page.locator('[data-reveal-insight]').click();assert.equal(await page.locator('#starting-insight').isVisible(),true);
  await page.locator('.lesson-tabs [data-lesson-tab="learn"]').click();assert.equal(await page.locator('.lab-widget').count(),0);assert.equal(await page.locator('.concept-step').count(),5);
  await page.locator('.concept-step[data-learn-index="2"]').click();assert.match(await page.locator('.learning-concept-reading').innerText(),/power limit/);
  await page.locator('.lesson-tabs [data-lesson-tab="interact"]').click();assert.equal(await page.locator('.lab-widget').count(),1);
  await page.locator('.activity-step[data-activity-index="3"]').click();await page.locator('[data-board-hole="F1"]').click();assert.match(await page.locator('.lab-output').innerText(),/F1/);
  await page.locator('.activity-step[data-activity-index="4"]').click();await page.locator('.lab-widget[data-lab-kind="meter"] [data-x="mode"]').selectOption('a');assert.match(await page.locator('.lab-output').innerText(),/UNSAFE.*short/i);
  await page.locator('.lesson-tabs [data-lesson-tab="quiz"]').click();assert.equal(await page.locator('.quiz-card').count(),1);assert.equal(await page.locator('.quiz-step').count(),10);await page.locator('.quiz-card input[value="1"]').check();await page.locator('[data-submit="p01"]').click();
  await page.waitForFunction(()=>JSON.parse(localStorage.getItem('eu_progress:hkwmtjhgrskidaizamwy:anonymous')||'{}').progress?.['EIM-BEC-PRELAB']?.answers?.p01?.correct===true);
  await page.locator('.lesson-tabs [data-lesson-tab="review"]').click();assert.equal(await page.locator('.lesson-review-item').count(),10);
  await go(page,'textbooks');assert.equal(await page.locator('.source-book').count(),1);await page.locator('[data-disclosure="contents:geier:6"] > summary').click();
  assert.equal(await page.locator('[data-goto="lesson"][data-lesson="BDMM-02"]').count(),1);await page.locator('[data-lesson="BDMM-01"]').click();assert.match(await page.locator('.lesson-overview').innerText(),/5.04 V/);
  await page.locator('.lesson-tabs [data-lesson-tab="interact"]').click();assert.equal(await page.locator('.activity-step').count(),3);
  await page.locator('[data-workshop-field="digits"]').selectOption('3');await page.locator('[data-workshop-field="error"]').selectOption('0.04');assert.match(await page.locator('.workshop-reading').innerText(),/0.040 V/);
  await page.locator('.activity-step[data-activity-index="1"]').click();assert.equal(await page.locator('.case-stage').count(),3);
  await page.locator('.lesson-tabs [data-lesson-tab="quiz"]').click();await page.locator('.quiz-card input[value="0"]').check();await page.locator('[data-submit="b101"]').click();
  await page.waitForFunction(()=>JSON.parse(localStorage.getItem('eu_progress:hkwmtjhgrskidaizamwy:anonymous')||'{}').progress?.['BDMM-01']?.answers?.b101?.correct===true);
  assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('eu_progress:hkwmtjhgrskidaizamwy:anonymous')).progress['EIM-BEC-PRELAB'].answers.p01.correct),true);
  await page.locator('.lesson-tabs [data-lesson-tab="review"]').click();assert.match(await page.locator('#main').innerText(),/Back to your chapter/);
  const dims=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth}));assert.ok(dims.scroll<=dims.width+2);assert.deepEqual(errors,[]);
  await page.screenshot({path:'test-artifacts/source-workbench-'+width+'.png',fullPage:true});await page.close();
 }
 console.log('PASS: new source navigation, old archived CET widgets, five-tab lab/book workbenches, unsafe meter feedback, stable persisted assessments and responsive desktop/phone.');
}finally{await browser.close();}
