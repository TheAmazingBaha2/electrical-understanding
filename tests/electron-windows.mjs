import assert from 'node:assert/strict';import {resolve} from 'node:path';import {mkdtemp,mkdir,writeFile} from 'node:fs/promises';import {tmpdir} from 'node:os';
import {_electron as electron} from 'playwright';import {desktopAcceptance} from './desktop-lab-browser.mjs';import {workspaceAcceptance} from './desktop-workspace-browser.mjs';
assert.equal(process.platform,'win32','This evidence must come from a real Windows runner');
const start=performance.now(),profile=await mkdtemp(resolve(tmpdir(),'eu-native-qa-'));
const app=await electron.launch({args:[resolve('native/electron/main.cjs')],env:{...process.env,EU_NATIVE_QA_PROFILE:profile},timeout:60000});
try{
 const page=await app.firstWindow(),launchMs=performance.now()-start;await page.waitForSelector('#main');
 assert.equal(await page.evaluate(()=>typeof window.require),'undefined');assert.equal(await page.evaluate(()=>Boolean(navigator.locks)),true);
 const native=await app.evaluate(({BrowserWindow,app})=>{const window=BrowserWindow.getAllWindows()[0];window.setBounds({width:1500,height:1000});return {bounds:window.getBounds(),versions:process.versions,metrics:app.getAppMetrics()};});assert.equal(native.bounds.width,1500);
 await desktopAcceptance(page,{native:true});await workspaceAcceptance(page,{resize:size=>app.evaluate(({BrowserWindow},size)=>{BrowserWindow.getAllWindows()[0].setContentSize(size.width,size.height);},size),reload:async()=>{await page.reload();await page.waitForSelector('[data-canvas-world],[data-board-viewport]');},prefix:'workspace-windows'});await mkdir('test-artifacts',{recursive:true});await writeFile('test-artifacts/electron-evaluation.json',JSON.stringify({platform:process.platform,launchMs,...native,prototype:true},null,2));
}catch(error){await mkdir('test-artifacts',{recursive:true});const p=await app.firstWindow();await p.screenshot({path:'test-artifacts/electron-failure.jpg',type:'jpeg',quality:60});throw error;}finally{await app.close();}
