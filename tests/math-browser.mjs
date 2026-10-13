import {go} from './navigation-helper.mjs';
// Real phone/desktop navigation and offline math saving; no paid APIs.
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
const browser=await chromium.launch({headless:true});
try{
 const page=await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:1});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.route('https://esm.sh/**',route=>route.abort());
 await page.goto('http://127.0.0.1:8080/',{waitUntil:'domcontentloaded'});
 await page.locator('.dashboard-welcome').waitFor({timeout:30000});
 await go(page,'math');
 assert.equal(await page.locator('.math-topic-card').count(),0);
 assert.match(await page.locator('#main').innerText(),/Periodic refreshers/);
 await go(page,'account');await page.locator('.account-maintenance > summary').click();await page.locator('[data-goto="legacy"]').click();
 assert.equal(await page.locator('.legacy-source-row').count(),7);
 await page.locator('[data-lesson="MATH-001"][data-goto="lesson"]').click();
 assert.match(await page.locator('.lesson-header').innerText(),/Scale, Prefixes/);
 assert.match(await page.locator('.bread').innerText(),/Mathematics Companion.*LEGACY GROUP 2/);
 await page.locator('.lesson-tabs [data-lesson-tab="learn"]').click();
 assert.match(await page.locator('.learning-concept').innerText(),/milli/i);
 assert.equal(await page.locator('.concept-step').count(),4);
 await page.locator('.lesson-tabs [data-lesson-tab="interact"]').click();
 await page.locator('.math-explorer').waitFor();
 assert.match(await page.locator('.math-calculation').innerText(),/1\. Equation/);
 assert.match(await page.locator('.math-calculation').innerText(),/0\.005 A/);
 await page.locator('.math-explorer input[type=range]').evaluate(input=>{input.value='10';input.dispatchEvent(new Event('input',{bubbles:true}));});
 assert.match(await page.locator('.math-calculation').innerText(),/0\.010 A/);
 await page.locator('.lesson-tabs [data-lesson-tab="quiz"]').click();
 assert.equal(await page.locator('.quiz-step').count(),6);
 await page.locator('.question-input').fill('0.012');
 await page.locator('[data-submit="m001q01"]').click();
 await page.waitForFunction(()=>{
  const progress=JSON.parse(localStorage.getItem('eu_progress:hkwmtjhgrskidaizamwy:anonymous')||'{}').progress||{};
  return progress['MATH-001']?.answers?.m001q01?.correct===true;
 });
 const saved=await page.evaluate(()=>{
  const data=JSON.parse(localStorage.getItem('eu_progress:hkwmtjhgrskidaizamwy:anonymous')||'{}');
  return {keys:Object.keys(data.progress||{}),answer:data.progress?.['MATH-001']?.answers?.m001q01};
 });
 assert.ok(saved.keys.includes('MATH-001'));
 assert.equal(saved.answer.correct,true);
 assert.ok(!saved.keys.includes('L01'),'Math answer must not overwrite legacy lesson ID');
 await go(page,'account');await page.locator('.account-maintenance > summary').click();await page.locator('[data-goto="legacy"]').click();
 assert.match(await page.locator('.legacy-source-row').filter({has:page.locator('[data-lesson="MATH-001"]')}).innerText(),/1 correct/);
 await go(page,'ceta');
 assert.equal(await page.locator('.content-chapter').count(),22);
 await go(page,'account');await page.locator('.account-maintenance > summary').click();await page.locator('[data-goto="legacy"]').click();
 await page.locator('[data-goto="lesson"][data-lesson="CETA-G03-01"]').click();
 assert.ok(await page.locator('.math-related-panel [data-lesson="MATH-001"]').count()>0);
 await page.locator('.math-related-panel [data-lesson="MATH-001"]').click();
 await page.locator('.lesson-tabs [data-lesson-tab="quiz"]').click();
 assert.match(await page.locator('.quiz-step.correct').first().getAttribute('aria-label'),/correct/);
 const dims=await page.evaluate(()=>({w:innerWidth,scroll:document.documentElement.scrollWidth}));
 assert.ok(dims.scroll<=dims.w+2,'Mobile math track overflows '+JSON.stringify(dims));
 assert.deepEqual(errors,[],'Unexpected math browser runtime errors');
 console.log('PASS: responsive math track, source links, slider substitution, unique persisted answer and reentry.');
}finally{await browser.close()}
