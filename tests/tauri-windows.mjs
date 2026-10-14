import assert from 'node:assert/strict';import {resolve,join} from 'node:path';import {homedir} from 'node:os';import {spawn} from 'node:child_process';import {mkdir,writeFile,stat} from 'node:fs/promises';
import {Builder,By,Capabilities,until} from 'selenium-webdriver';
assert.equal(process.platform,'win32');await mkdir('test-artifacts',{recursive:true});
const executable=resolve('native/tauri/src-tauri/target/debug/eu-tauri-evaluation.exe'),processDriver=spawn(join(homedir(),'.cargo/bin/tauri-driver.exe'),[],{stdio:'inherit'});let driver;
try{
 for(let i=0;i<30;i++){try{await fetch('http://127.0.0.1:4444/status');break;}catch{await new Promise(r=>setTimeout(r,300));}}
 const start=performance.now(),capabilities=new Capabilities();capabilities.set('tauri:options',{application:executable});capabilities.setBrowserName('wry');
 driver=await new Builder().withCapabilities(capabilities).usingServer('http://127.0.0.1:4444').build();await driver.wait(until.elementLocated(By.css('#main')),30000);const launchMs=performance.now()-start;
 const click=async selector=>{const e=await driver.wait(until.elementLocated(By.css(selector)),15000);await driver.wait(until.elementIsVisible(e),10000);await e.click();};
 await driver.executeScript('localStorage.clear();localStorage.setItem("eu_lab_platform_v1","desktop");');
 await click('.sidebar [data-view="workbench"]');await driver.wait(until.elementLocated(By.css('[data-canvas-world]')),20000);
 assert.equal(await driver.executeScript('return !!navigator.locks'),true);assert.equal((await driver.findElements(By.css('[data-window-resize]'))).length,32);
 await click('[data-window-dock="max"][data-window-id="circuit"]');assert.equal(await driver.findElement(By.css('[data-pane="circuit"]')).getAttribute('data-dock'),'max');await click('[data-reset-desktop-layout]');
 const coordinate=selector=>driver.executeScript('const e=document.querySelector(arguments[0]);e.scrollIntoView({block:"nearest"});const p=new DOMPoint(30,-35).matrixTransform(e.getScreenCTM());return {x:Math.round(p.x),y:Math.round(p.y)};',selector);
 const a=await coordinate('[data-canvas-probe="red"]'),b=await coordinate('[data-canvas-terminal="V1.p"]');await driver.actions({async:true}).move({x:a.x,y:a.y,origin:'viewport'}).press().move({x:b.x,y:b.y,origin:'viewport',duration:400}).release().perform();
 await driver.wait(async()=>/5\.000 V/.test(await driver.findElement(By.css('[data-lab-live-reading]')).getText()),10000);
 await click('[data-clear-lab]');await click('[data-confirm-clear-lab]');assert.equal((await driver.findElements(By.css('[data-canvas-part]'))).length,0);await click('[data-graphic-command="canvas-undo"]');assert.equal((await driver.findElements(By.css('[data-canvas-part]'))).length,3);
 await writeFile('test-artifacts/tauri-windows-desktop.png',Buffer.from(await driver.takeScreenshot(),'base64'));await writeFile('test-artifacts/tauri-evaluation.json',JSON.stringify({platform:process.platform,launchMs,debugExecutableBytes:(await stat(executable)).size,capabilities:await driver.getCapabilities().then(c=>Object.fromEntries(c)),prototype:true},null,2));
 console.log('PASS: real Windows Tauri/WebView2 launch, secure local locks, docking, native pointer probe snap, clear and undo.');
}finally{if(driver)await driver.quit();processDriver.kill();}
