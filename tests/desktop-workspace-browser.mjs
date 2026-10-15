// Real event-level geometry coverage, shared with the actual Windows Electron job.
import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import {go} from './navigation-helper.mjs';
export async function workspaceAcceptance(page,{resize,reload,prefix='workspace'}={}){
 const lab=page.locator('.desktop-bench'),stage=lab.locator('.desktop-window-stage'),meter=lab.locator('[data-pane="meter"]'),bar=meter.locator('[data-window-drag]');
 await stage.waitFor();const expand=lab.locator('[data-expand-desktop-workspace]');
 if(await expand.getAttribute('aria-pressed')!=='true')await expand.click();
 const geometry=()=>stage.evaluate(e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height,clientWidth:e.clientWidth,clientHeight:e.clientHeight};});
 const drag=async(a,b)=>{await page.mouse.move(a.x,a.y);await page.mouse.down();await page.mouse.move(b.x,b.y,{steps:12});await page.mouse.up();};
 const observations=[];
 for(const viewport of resize?[{width:1280,height:720},{width:1440,height:900},{width:1650,height:900},{width:1920,height:1080},{width:2560,height:1080}]:[null]){
  if(viewport)await resize(viewport);await lab.locator('[data-reset-desktop-layout]').click();
  let s=await geometry();assert.ok(s.width>await page.evaluate(()=>innerWidth)-80,'Expanded workspace should use the viewport');
  assert.ok((await meter.boundingBox()).x>s.x+s.width*.6,'Default right dock must use the actual right side');
  // Undock, shrink, then drag into the formerly unavailable region and bottom.
  await lab.locator('[data-window-dock="free"][data-window-id="meter"]').click();
  let r=await meter.boundingBox(),h=await meter.locator('[data-window-resize="se"]').boundingBox();
  await drag({x:h.x+4,y:h.y+4},{x:h.x-100,y:h.y-100});assert.ok((await meter.boundingBox()).width<r.width-50);
  r=await bar.boundingBox();await drag({x:r.x+25,y:r.y+18},{x:s.x+s.width-15,y:s.y+s.height-30});
  r=await meter.boundingBox();assert.ok(Math.abs(r.x+r.width-(s.x+s.width-1))<3,JSON.stringify({s,r}));assert.ok(Math.abs(r.y+r.height-(s.y+s.height-1))<3,JSON.stringify({s,r}));
  // A far-right resize handle remains reachable. Grow leftwards, then keyboard move/resize.
  h=await meter.locator('[data-window-resize="w"]').boundingBox();const previous=r.width;
  await drag({x:h.x+3,y:h.y+20},{x:h.x-70,y:h.y+20});assert.ok((await meter.boundingBox()).width>previous+60);
  await bar.focus();await bar.press('ArrowLeft');await bar.press('Shift+ArrowLeft');
  await lab.locator('[data-window-hide="meter"]').click();assert.equal(await meter.isVisible(),false);await lab.locator('[data-lab-pane="meter"]').click();assert.equal(await meter.isVisible(),true);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  observations.push({viewport:await page.evaluate(()=>({width:innerWidth,height:innerHeight,dpr:devicePixelRatio})),stage:await geometry(),meter:await meter.boundingBox()});
 }
 // Transform and page scroll use the same CSS coordinate system as the window.
 await lab.locator('[data-reset-desktop-layout]').click();await lab.locator('[data-window-dock="free"][data-window-id="meter"]').click();
 for(const mode of ['transform','zoom']){
  await lab.evaluate((el,mode)=>{if(mode==='transform'){el.style.transform='scale(.8)';el.style.transformOrigin='top left';}else el.style.zoom='.8';},mode);
  let r=await bar.boundingBox(),before=await meter.boundingBox();await drag({x:r.x+20,y:r.y+15},{x:r.x-60,y:r.y+15});
  const after=await meter.boundingBox();assert.ok(Math.abs(after.x-before.x+80)<3,JSON.stringify({mode,before,after}));
  await lab.evaluate(el=>{el.style.transform='';el.style.transformOrigin='';el.style.zoom='';});
 }
 await page.waitForTimeout(150);
 const saved=await page.evaluate(()=>localStorage.getItem('eu_desktop_windows_v1'));
 // Resizing recovers visible windows but does not destroy the preferred layout.
 if(resize){await resize({width:768,height:720});await page.waitForTimeout(150);assert.equal(await page.evaluate(()=>localStorage.getItem('eu_desktop_windows_v1')),saved);await resize({width:2560,height:1080});}
 if(reload){await reload();await page.locator('.desktop-window-stage').waitFor();assert.equal(await page.locator('[data-expand-desktop-workspace]').getAttribute('aria-pressed'),'true');assert.equal(await page.evaluate(()=>localStorage.getItem('eu_desktop_windows_v1')),saved);}
 await mkdir('test-artifacts',{recursive:true});await writeFile('test-artifacts/'+prefix+'-geometry.json',JSON.stringify(observations,null,2));
 await page.locator('[data-window-dock="right"][data-window-id="meter"]').click();
 const shot=await page.screenshot({path:'test-artifacts/'+prefix+'-wide.jpg',type:'jpeg',quality:60});console.log('DESKTOP_QA_IMAGE:'+prefix+'-wide:'+shot.toString('base64'));
 await page.locator('[data-reset-desktop-layout]').click();await page.locator('[data-expand-desktop-workspace]').click();assert.equal(await page.locator('[data-expand-desktop-workspace]').getAttribute('aria-pressed'),'false');
 console.log('PASS: measured full-width workspace, right/bottom drag, resize, keyboard, dock, minimize/reopen, transform/zoom and preferred-layout recovery.');
 return observations;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){
 const {chromium}=await import('playwright'),browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 try{const page=await browser.newPage({viewport:{width:1650,height:900},deviceScaleFactor:1.5});await page.route('**/*',r=>new URL(r.request().url()).hostname==='127.0.0.1'?r.continue():r.abort());await page.goto('http://127.0.0.1:8080/');await page.evaluate(()=>localStorage.setItem('eu_lab_platform_v1','desktop'));await go(page,'workbench');await workspaceAcceptance(page,{resize:size=>page.setViewportSize(size),reload:async()=>{await page.reload();await go(page,'workbench');}});}finally{await browser.close();}
}
