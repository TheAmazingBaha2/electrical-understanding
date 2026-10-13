import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {mkdir} from 'node:fs/promises';
import {go} from './navigation-helper.mjs';
await mkdir('test-artifacts',{recursive:true});
const browser=await chromium.launch({headless:true});
try{
 for(const mobile of [false,true]){
  const page=await browser.newPage({viewport:{width:mobile?390:1440,height:900},hasTouch:mobile}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.route('https://esm.sh/**',r=>r.fulfill({contentType:'text/javascript',body:'export function createClient(){throw new Error("Offline fixture")}'}));
  await page.goto('http://127.0.0.1:8080/');await page.locator('.dashboard-welcome').waitFor();
  assert.equal(await page.locator('.dashboard-area,.dashboard-home,#account-pill,.dashboard-continue').count(),0);
  const sidebar=page.locator('.sidebar'),handle=page.locator('#sidebar-resize');
  if(mobile){assert.equal(await handle.isVisible(),false);await page.locator('#menu-toggle').click();assert.equal(await page.locator('#menu-toggle').getAttribute('aria-expanded'),'true');}
  if(mobile)await page.waitForFunction(()=>document.querySelector('.sidebar').getBoundingClientRect().left===0);
  const before=Number(await handle.getAttribute('aria-valuenow')),box=await handle.boundingBox(),x=box.x+box.width/2,y=450;
  if(mobile){
   const cdp=await page.context().newCDPSession(page);
   await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y,id:7}]});
   await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:x+50,y,id:7}]});
   await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
  }else{await page.mouse.move(x,y);await page.mouse.down();await page.mouse.move(x+50,y,{steps:6});await page.mouse.up();}
  assert.equal(Number(await handle.getAttribute('aria-valuenow')),before+50);
  await handle.focus();await handle.press('ArrowRight');assert.equal(Number(await handle.getAttribute('aria-valuenow')),before+60);
  await page.reload();await page.locator('.dashboard-welcome').waitFor();
  assert.equal(Number(await handle.getAttribute('aria-valuenow')),before+60);
  if(mobile){await page.locator('#menu-toggle').click();await page.waitForFunction(()=>document.querySelector('.sidebar').getBoundingClientRect().left===0)}
  await handle.focus();await handle.press('Home');assert.equal(Number(await handle.getAttribute('aria-valuenow')),200);
  await handle.press('End');const max=mobile?346:480;assert.equal(Number(await handle.getAttribute('aria-valuenow')),max);
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+2));
  await page.screenshot({path:'test-artifacts/sidebar-resize-'+(mobile?'phone':'desktop')+'.png'});
  if(mobile){await page.locator('#sidebar-close').click();assert.equal(await page.locator('#menu-toggle').getAttribute('aria-expanded'),'false');await page.setViewportSize({width:320,height:900});await page.locator('#menu-toggle').click();assert.equal(Number(await handle.getAttribute('aria-valuenow')),276);await handle.press('Escape');await handle.waitFor({state:'hidden'});assert.equal(await handle.isVisible(),false);}
  await go(page,'math');assert.match(await page.locator('#main').innerText(),/Math Practice/);
  if(mobile)assert.equal(await sidebar.evaluate(el=>el.classList.contains('open')),false);
  await go(page,'dashboard');await page.locator('.dashboard-welcome').waitFor();
  const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('eu_sidebar_width_v1')));assert.equal(saved[mobile?'mobile':'desktop'],max);
  await page.setViewportSize({width:mobile?1440:390,height:900});await page.waitForFunction(expected=>Number(document.querySelector('#sidebar-resize').getAttribute('aria-valuenow'))===expected,mobile?245:250);assert.equal(Number(await handle.getAttribute('aria-valuenow')),mobile?245:250);
  assert.deepEqual(errors,[]);await page.close();
 }
 console.log('PASS: no navigation bubbles; desktop mouse and phone touch resizing, keyboard bounds, viewport clamping, reload persistence, separate widths, sidebar routes and menu closing.');
}finally{await browser.close();}
