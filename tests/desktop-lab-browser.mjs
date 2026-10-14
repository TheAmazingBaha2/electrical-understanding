import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import {go} from './navigation-helper.mjs';
export async function desktopAcceptance(page,{native=false}={}){
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.evaluate(()=>{localStorage.setItem('eu_lab_platform_v1','desktop');});await go(page,'workbench');
 const pane=page.locator('[data-pane="circuit"]'),world=page.locator('[data-canvas-world]');await world.waitFor();
 assert.equal(await page.locator('.desktop-window-title').count(),4);assert.equal(await page.locator('[data-window-resize]').count(),32);
 const command=async(name,value,root=page)=>root.locator('[data-graphic-command="'+name+'"]'+(value===undefined?'':'[data-graphic-value="'+value+'"]')+':visible').first().click();
 const transform=async(locator,x=0,y=0)=>{await locator.scrollIntoViewIfNeeded();return locator.evaluate((el,p)=>{const svg=el.closest('svg')||el,m=el.getScreenCTM();const q=new DOMPoint(p.x,p.y).matrixTransform(m);return {x:q.x,y:q.y};},{x,y});};
 const drag=async(a,b)=>{await page.mouse.move(a.x,a.y);await page.mouse.down();await page.mouse.move(b.x,b.y,{steps:8});await page.mouse.up();};
 // Windows-style drag, edge/corner resize, keyboard move, docking, minimize/reopen.
 const meter=page.locator('[data-pane="meter"]'),bar=meter.locator('[data-window-drag]'),before=await meter.boundingBox(),barbox=await bar.boundingBox();
 await drag({x:barbox.x+50,y:barbox.y+20},{x:barbox.x+80,y:barbox.y+40});assert.ok((await meter.boundingBox()).x>before.x+20);
 const resize=await meter.locator('[data-window-resize="se"]').boundingBox(),width=(await meter.boundingBox()).width;
 await drag({x:resize.x+5,y:resize.y+5},{x:resize.x+55,y:resize.y+35});assert.ok((await meter.boundingBox()).width>width+40);
 await bar.focus();await bar.press('ArrowRight');await page.locator('[data-window-dock="right"][data-window-id="meter"]').click();assert.equal(await meter.getAttribute('data-dock'),'right');
 await page.locator('[data-window-hide="meter"]').click();assert.equal(await meter.isVisible(),false);await page.locator('[data-lab-pane="meter"]').click();assert.equal(await meter.isVisible(),true);
 await page.locator('[data-reset-desktop-layout]').click();
 // Signed meter polarity is independent of unipolar configured supply.
 const probe=page.locator('[data-canvas-probe="red"]'),source=page.locator('[data-canvas-terminal="V1.p"]');
 await drag(await transform(probe,30,-35),await transform(source,30,-35));assert.match(await page.locator('[data-lab-live-reading]').innerText(),/5\.000 V/);
 await drag(await transform(probe,30,-35),await transform(page.locator('[data-canvas-terminal="R2.a"]'),30,-35));assert.match(await page.locator('[data-lab-live-reading]').innerText(),/2\.500 V/);
 await command('canvas-tool','inspect');const part=page.locator('[data-canvas-part="R1"]'),position=await part.getAttribute('transform');
 await drag(await transform(part),await transform(part,100,30));assert.notEqual(await part.getAttribute('transform'),position);assert.match(await page.locator('[data-lab-live-reading]').innerText(),/2\.500 V/);
 await part.click();await command('resistor-value','2000',pane);assert.match(await page.locator('[data-lab-live-reading]').innerText(),/1\.667 V/);
 await command('select-circuit-part','V1').catch(async()=>{await page.locator('[data-canvas-part="V1"]').click();});
 assert.equal(await pane.locator('[data-graphic-range="supply-voltage"]').getAttribute('min'),'0');await command('supply-voltage','9',pane);assert.match(await page.locator('[data-lab-live-reading]').innerText(),/3\.000 V/);
 // Clear requires explicit confirmation; undo restores exact electrical state.
 await page.locator('[data-clear-lab]').click();assert.equal(await page.locator('[data-canvas-part]').count(),3);await page.locator('[data-cancel-clear-lab]').click();
 await page.locator('[data-clear-lab]').click();await page.locator('[data-confirm-clear-lab]').click();assert.equal(await page.locator('[data-canvas-part]').count(),0);await command('canvas-undo');assert.equal(await page.locator('[data-canvas-part]').count(),3);assert.match(await page.locator('[data-lab-live-reading]').innerText(),/3\.000 V/);
 // Place real new supported components, connect exact terminals and remove them.
 await command('canvas-tool','resistor');const p=await transform(world,900,600);await page.mouse.click(p.x,p.y);assert.equal(await page.locator('[data-canvas-part]').count(),4);
 const id=await page.locator('[data-canvas-part]').last().getAttribute('data-canvas-part');await command('canvas-tool','wire');await page.locator('[data-canvas-terminal="'+id+'.p"]').click();await page.locator('[data-canvas-terminal="V1.p"]').click();assert.equal(await page.locator('[data-canvas-wire]').count(),1);
 await command('canvas-tool','inspect');await page.locator('[data-canvas-part="'+id+'"]').click();await command('part-remove',id,pane);assert.equal(await page.locator('[data-canvas-wire]').count(),0);assert.equal(await page.locator('[data-canvas-part]').count(),3);
 await page.waitForTimeout(500);const savedLayout=await page.evaluate(()=>localStorage.getItem('eu_desktop_windows_v1'));assert.ok(savedLayout);await page.reload();await go(page,'workbench');assert.match(await page.locator('[data-lab-live-reading]').innerText(),/3\.000 V/);
 // Breadboard clearing uses its own graph/history and draggable probe contacts.
 await page.locator('[data-lab-project]').selectOption('breadboard-project');await page.locator('[data-board-probe-draggable]').first().waitFor();await page.locator('[data-clear-lab]').click();await page.locator('[data-confirm-clear-lab]').click();assert.equal(await page.locator('[data-placed-component]').count(),0);await command('board-undo');assert.equal(await page.locator('[data-placed-component]').count(),3);
 assert.deepEqual(errors,[]);await mkdir('test-artifacts',{recursive:true});await page.screenshot({path:'test-artifacts/'+(native?'electron-windows-desktop':'desktop-browser')+'.jpg',type:'jpeg',quality:68,fullPage:false});
 console.log('PASS: '+(native?'native Windows Electron':'desktop browser')+' canvas, probes, unipolar source, clear/undo, windows/docking/layout, project restoration.');
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){
 const {chromium}=await import('playwright'),browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 try{const page=await browser.newPage({viewport:{width:1600,height:1100}});await page.route('**/*',r=>new URL(r.request().url()).hostname==='127.0.0.1'?r.continue():r.abort());await page.goto('http://127.0.0.1:8080/');await desktopAcceptance(page);}finally{await browser.close();}
}
