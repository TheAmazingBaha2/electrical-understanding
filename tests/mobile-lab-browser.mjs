import assert from 'node:assert/strict';import {chromium} from 'playwright';import {mkdir} from 'node:fs/promises';import {go} from './navigation-helper.mjs';
await mkdir('test-artifacts',{recursive:true});const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
try{for(const width of [320,390]){
 const page=await browser.newPage({viewport:{width,height:844},isMobile:true,hasTouch:true,userAgent:'Mozilla/5.0 (Linux; Android 13) Chrome/130 Mobile Safari/537.36'}),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.route('**/*',r=>new URL(r.request().url()).hostname==='127.0.0.1'?r.continue():r.abort());await page.goto('http://127.0.0.1:8080/');
 // No override: normal platform detection selects a separate phone module.
 const menu=page.locator('#menu-toggle');await menu.click();await page.locator('.sidebar [data-view="workbench"]').click();await page.locator('.mobile-lab').waitFor();assert.equal(await page.locator('[data-canvas-world]').count(),0);
 await page.locator('[data-mobile-contact="source"]').tap();assert.match(await page.locator('[data-mobile-reading]').innerText(),/5/);await page.locator('[data-mobile-contact="output"]').tap();assert.match(await page.locator('[data-mobile-reading]').innerText(),/2\.5/);
 await page.locator('[data-mobile-resistance="2000"]').tap();assert.match(await page.locator('[data-mobile-reading]').innerText(),/3\.333/);await page.locator('[data-mobile-voltage="9"]').tap();assert.match(await page.locator('[data-mobile-reading]').innerText(),/6/);
 // CDP native touch emulation exercises browser capture/compatibility clicks.
 await page.locator('[data-mobile-probe="red"]').scrollIntoViewIfNeeded();
 const center=async selector=>{const b=await page.locator(selector).boundingBox();assert.ok(b&&b.y>=0&&b.y+b.height<=844,'drag endpoints must be visible');return {x:b.x+b.width/2,y:b.y+b.height/2};};
 const cdp=await page.context().newCDPSession(page);
 async function dragProbe(destination,{cancel=false}={}){const a=await center('[data-mobile-probe="red"]'),b=await center('[data-mobile-contact="'+destination+'"]');await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{...a,id:1}]});for(let i=1;i<=6;i++){await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:a.x+(b.x-a.x)*i/6,y:a.y+(b.y-a.y)*i/6,id:1}]});}await cdp.send('Input.dispatchTouchEvent',{type:cancel?'touchCancel':'touchEnd',touchPoints:[]});}
 await dragProbe('common');await page.waitForFunction(()=>document.querySelector('[data-mobile-reading]').textContent==='0.000 V');
 await page.waitForTimeout(550);await page.locator('[data-mobile-undo]').tap();assert.match(await page.locator('[data-mobile-reading]').innerText(),/6/);
 await page.locator('[data-mobile-redo]').tap();assert.equal(await page.locator('[data-mobile-reading]').innerText(),'0.000 V');
 await page.locator('[data-mobile-undo]').tap();await dragProbe('common',{cancel:true});assert.match(await page.locator('[data-mobile-reading]').innerText(),/6/);
 assert.equal(await page.locator('.lab-pointer-preview').count(),0);assert.equal(await page.evaluate(()=>localStorage.getItem('eu_introduced_practice_v1:anonymous')),null);await cdp.detach();
 assert.equal(await page.locator('.mobile-lab input[type="number"]').count(),0);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);await page.waitForTimeout(500);await page.reload();
 await page.locator('#menu-toggle').click();await page.locator('.sidebar [data-view="workbench"]').click();await page.locator('.mobile-lab').waitFor();assert.match(await page.locator('[data-mobile-reading]').innerText(),/6/);
 await page.waitForFunction(()=>!document.querySelector('.sidebar').classList.contains('open')&&document.querySelector('.sidebar').getBoundingClientRect().right<=1);const screenshot=await page.screenshot({path:'test-artifacts/mobile-module-'+width+'.jpg',type:'jpeg',quality:60,fullPage:true});console.log('DESKTOP_QA_IMAGE:mobile-module-'+width+':'+screenshot.toString('base64'));assert.deepEqual(errors,[]);await page.locator('[data-lab-platform-choice]').selectOption('desktop');await page.locator('[data-canvas-world]').waitFor();await page.locator('[data-lab-platform-choice]').selectOption('mobile');await page.locator('.mobile-lab').waitFor();assert.match(await page.locator('[data-mobile-reading]').innerText(),/6/);await page.close();
 console.log('PASS: separate phone module '+width+' px, OS detection, taps, shared measurements, offline project restoration and manual override.');
}}finally{await browser.close();}
