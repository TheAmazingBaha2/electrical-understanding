// GitHub Actions browser smoke test; never writes to real Supabase.
import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
import {chromium} from 'playwright';
await mkdir('test-artifacts',{recursive:true});
const browser=await chromium.launch({headless:true});
try{
 const page=await browser.newPage({viewport:{width:1440,height:1000},deviceScaleFactor:1});
 await page.route('https://esm.sh/**',route=>route.abort());
 await page.goto('http://127.0.0.1:8080/',{waitUntil:'domcontentloaded'});
 await page.locator('.v2-hero').waitFor({timeout:30000});
 assert.match(await page.title(),/Electrical Understanding/);
 assert.equal(await page.locator('.v2-donut').count(),1);
 await page.locator('[data-view="labs"]').click();
 assert.match(await page.locator('main').innerText(),/Hands-On Laboratory/);
 await page.locator('[data-goto="subtrack"][data-lesson="basic"]').first().click();
 assert.equal(await page.locator('[data-goto="lesson"][data-lesson="EIM-BEC-PRELAB"]').count(),1);
 await page.locator('[data-goto="lesson"][data-lesson="EIM-BEC-PRELAB"]').click();
 assert.equal(await page.locator('.lab-widget').count(),5);
 assert.equal(await page.locator('.quiz-card').count(),10);
 await page.locator('.lab-widget[data-lab-kind="meter"] [data-x="mode"]').selectOption('a');
 const warning=await page.locator('.lab-widget[data-lab-kind="meter"] .lab-output').innerText();
 assert.match(warning,/UNSAFE.*short/i);
 await page.locator('[data-view="dashboard"]').click();
 await page.screenshot({path:'test-artifacts/desktop.png',fullPage:true});

 const phone=await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:1});
 await phone.route('https://esm.sh/**',route=>route.abort());
 await phone.goto('http://127.0.0.1:8080/',{waitUntil:'domcontentloaded'});
 await phone.locator('.v2-hero').waitFor({timeout:30000});
 await phone.locator('#menu-toggle').click();
 await phone.locator('[data-view="labs"]').click();
 await phone.locator('[data-goto="subtrack"][data-lesson="basic"]').first().click();
 const width=await phone.evaluate(()=>({document:document.documentElement.scrollWidth,view:window.innerWidth}));
 assert.ok(width.document<=width.view+2,'Mobile layout overflow: '+JSON.stringify(width));
 await phone.screenshot({path:'test-artifacts/mobile.png',fullPage:true});
 console.log('PASS: Desktop and phone rendered; lab controls, safety feedback, navigation and widths verified.');
}finally{await browser.close()}
