import {go} from './navigation-helper.mjs';
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {mkdir} from 'node:fs/promises';
await mkdir('test-artifacts',{recursive:true});
const browser=await chromium.launch({headless:true});
try{for(const width of [320,390,1440]){
 const page=await browser.newPage({viewport:{width,height:900}}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.route('https://esm.sh/**',r=>r.fulfill({contentType:'text/javascript',body:'export function createClient(){throw new Error("Offline fixture")}'}));
 await page.goto('http://127.0.0.1:8080/');
 const book=page.locator('[data-dashboard-source="geier"]');await book.waitFor();
 assert.equal(await page.locator('.workspace-top-tabs').count(),0);
 assert.equal(await page.locator('.dashboard-area').count(),0);
 assert.match(await page.locator('[data-nav-status="math"]').textContent(),/TBD/);
 assert.match(await page.locator('[data-nav-status="reviews"]').textContent(),/TBD/);
 assert.equal(await book.evaluate(el=>el.tagName),'SECTION');
 assert.deepEqual(await page.locator('[data-dashboard-category]').evaluateAll(els=>els.map(el=>el.dataset.dashboardCategory)),['textbooks','labs','ceta','math','reviews']);
 assert.deepEqual(await page.locator('.sidebar [data-nav-status]').evaluateAll(els=>els.map(el=>el.dataset.navStatus)),['textbooks','labs','ceta','math','reviews']);
 assert.equal(await book.locator('.dashboard-book-link .navigation-chevron').count(),1);
 assert.equal(await book.locator('button').filter({hasText:'Browse contents'}).count(),0);
 assert.equal(await book.evaluate(el=>el.closest('[data-dashboard-category]').dataset.dashboardCategory),'textbooks');

 assert.equal(await page.locator('details details').count(),0);
 assert.equal(await book.locator('.chapter-pie').first().isVisible(),false);
 if(width===390||width===1440)await page.screenshot({path:'test-artifacts/compact-dashboard-'+width+'.png',fullPage:true});
 const chapter=book.locator('.dashboard-chapter').first();
 assert.equal(await chapter.locator('.chapter-pie').first().isVisible(),false);
 await chapter.locator(':scope > summary').click();
 assert.equal(await chapter.locator('.dashboard-chapter-progress .chapter-pie').isVisible(),true);
 const lesson=chapter.locator('.chapter-lesson').first();
 assert.equal(await chapter.locator('.lesson-pie').count(),0);
 assert.equal(await lesson.locator('.lesson-progress-bar').isVisible(),true);
 assert.equal(await chapter.locator('details').count(),0);
 assert.equal(await lesson.locator('.chapter-lesson-copy').evaluate(el=>{
  const reference=el.querySelector('.lesson-page-reference'),bar=el.querySelector('.lesson-progress-bar'),counts=el.querySelector('small');
  return Boolean(reference.compareDocumentPosition(bar)&Node.DOCUMENT_POSITION_FOLLOWING)&&Boolean(bar.compareDocumentPosition(counts)&Node.DOCUMENT_POSITION_FOLLOWING);
 }),true);
 assert.ok((await lesson.locator('button').boundingBox()).height>=44 || width>700);
 if(width===390)await page.screenshot({path:'test-artifacts/compact-dashboard-expanded-phone.png',fullPage:true});
 assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+2));
 await book.locator('.dashboard-book-link').click();assert.equal(await page.locator('[data-source="geier"]').count(),1);
 await go(page,'dashboard');await book.waitFor();
 await go(page,'math');assert.match(await page.locator('#main').innerText(),/Math Practice/);
 await go(page,'dashboard');await book.waitFor();
 assert.deepEqual(errors,[]);await page.close();
}console.log('PASS: compact dashboard, single-level keyboard/touch disclosures and subsection bars, TBD sidebar labels, sidebar navigation, 320/390/1440px without overflow.');}finally{await browser.close();}
