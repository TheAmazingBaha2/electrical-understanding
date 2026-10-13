import {go} from './navigation-helper.mjs';
// Browser-only mocked chat integration. No provider calls or private account tokens.
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
const browser=await chromium.launch({headless:true});
try{
 const page=await browser.newPage({viewport:{width:1100,height:850}});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.route('https://esm.sh/**',route=>route.abort());
 await page.goto('http://127.0.0.1:8080/',{waitUntil:'domcontentloaded'});
 await page.locator('.dashboard-welcome').waitFor({timeout:30000});
 assert.equal(await page.locator('#ai-chat-panel').isVisible(),false);
 assert.equal(await page.locator('#ai-chat-launch').isVisible(),false);
 await page.evaluate(async()=>{
  const {updateAIChatSession}=await import('/ai-chat-widget.js');
  const client={functions:{invoke:async(slug,{body})=>{
   if(slug!=='ai-model-lab')throw Error('Wrong endpoint');
   if(body.action==='status')return {data:{authorized:true,ready:true},error:null};
   if(body.action==='chat')return {data:{
    model:body.model,reply:'Current through an ideal 1 kΩ resistor at 5 V is 5 mA.\n\nAvoid mains measurements and verify your circuit connection.\n'+ 'Detailed explanation. '.repeat(30),
    tokens:{input:120,output:180},estimatedUSD:0.0005
   },error:null};
   throw Error('Wrong action');
  }}};
  updateAIChatSession({id:'mock-owner'},client);
 });
 const compact=page.locator('#ai-chat-launch'),compactBox=await compact.boundingBox();
 assert.equal(await compact.locator('img').count(),0,'Tutor launcher is text-only');
 assert.equal((await compact.innerText()).trim(),'Study tutor');
 assert.ok(compactBox.width<=115&&compactBox.height<=38,'Compact desktop tutor size '+JSON.stringify(compactBox));
 await page.locator('#ai-chat-launch').click();
 await page.waitForFunction(()=>!document.querySelector('#ai-chat-send').disabled);
 assert.equal(await page.locator('#ai-chat-panel').isVisible(),true);
 assert.equal(await page.locator('#ai-chat-model option').count(),2);
 await page.locator('#ai-chat-model').selectOption('gpt-6.1-sol');
 await page.locator('#ai-chat-input').fill('What happens at 5 volts and 1 kilo-ohm?');
 await page.locator('#ai-chat-send').click();
 await page.waitForFunction(()=>document.querySelector('#ai-chat-messages').textContent.includes('Detailed explanation.'));
 assert.match(await page.locator('#ai-chat-messages').innerText(),/5 mA/);
 assert.match(await page.locator('#ai-chat-messages').innerText(),/What happens at 5 volts/);
 await page.locator('#ai-chat-close').click();
 assert.equal(await page.locator('#ai-chat-panel').isVisible(),false);
 await go(page,'textbooks');
 await page.locator('#ai-chat-launch').click();
 assert.match(await page.locator('#ai-chat-messages').innerText(),/Detailed explanation/,'Conversation survives navigation');
 await page.setViewportSize({width:390,height:770});
 const dimensions=await page.evaluate(()=>({
  page:document.documentElement.scrollWidth,viewport:innerWidth,
  chat:document.querySelector('#ai-chat-panel').getBoundingClientRect().toJSON(),
  scroll:document.querySelector('#ai-chat-messages').scrollHeight,
  available:document.querySelector('#ai-chat-messages').clientHeight
 }));
 assert.ok(dimensions.page<=dimensions.viewport+2,'Mobile page overflow '+JSON.stringify(dimensions));
 assert.ok(dimensions.chat.left>=0&&dimensions.chat.right<=dimensions.viewport+1,'Chat off-screen '+JSON.stringify(dimensions.chat));
 assert.ok(dimensions.available>0&&dimensions.scroll>dimensions.available,'Long response should scroll inside the chat panel');
 await page.locator('#ai-chat-close').click();
 const launcher=page.locator('#ai-chat-launch');let box=await launcher.boundingBox();
 assert.ok(box.width<=115&&box.height<=38,'Compact phone tutor size '+JSON.stringify(box));
 const cdp=await page.context().newCDPSession(page);
 await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:box.x+box.width/2,y:box.y+box.height/2,id:3}]});
 await page.waitForTimeout(240);
 await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:110,y:170,id:3}]});
 await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
 assert.equal(await page.locator('#ai-chat-panel').isVisible(),false,'Dragging must not open tutor');
 box=await launcher.boundingBox();assert.ok(box.y<250&&box.x>=8);
 await page.waitForTimeout(260);await launcher.press('Alt+ArrowRight');
 const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('eu_tutor_position_v1')));assert.ok(saved.mobile);
 await page.setViewportSize({width:1100,height:850});
 box=await launcher.boundingBox();await page.mouse.move(box.x+20,box.y+20);await page.mouse.down();await page.mouse.move(160,160,{steps:8});await page.mouse.up();
 assert.equal(await page.locator('#ai-chat-panel').isVisible(),false);
 await page.waitForTimeout(260);
 const desktop=await launcher.boundingBox();assert.ok(desktop.y<220);
 await page.reload();await page.locator('.dashboard-welcome').waitFor();
 await page.evaluate(async()=>{const {updateAIChatSession}=await import('/ai-chat-widget.js');updateAIChatSession({id:'mock-owner'},{functions:{invoke:async()=>({data:{authorized:true,ready:true},error:null})}})});
 const restored=await launcher.boundingBox();assert.ok(Math.abs(restored.x-desktop.x)<2&&Math.abs(restored.y-desktop.y)<2,'Position survives reload');
 await page.setViewportSize({width:320,height:650});await page.waitForFunction(()=>{const r=document.querySelector('#ai-chat-launch').getBoundingClientRect();return r.left>=7.5&&r.right<=innerWidth-7.5&&r.top>=7.5&&r.bottom<=innerHeight-7.5});box=await launcher.boundingBox();assert.ok(box.x>=7.5&&box.x+box.width<=312.5&&box.y>=7.5&&box.y+box.height<=642.5,'Position clamps to phone viewport '+JSON.stringify(box));
 await launcher.click();await page.waitForFunction(()=>!document.querySelector('#ai-chat-send').disabled);
 await page.locator('#ai-chat-new').click();
 assert.doesNotMatch(await page.locator('#ai-chat-messages').innerText(),/Detailed explanation/);
 await page.screenshot({path:'test-artifacts/icy-tutor-phone.png'});
 await page.evaluate(async()=>{
  const {updateAIChatSession}=await import('/ai-chat-widget.js');
  updateAIChatSession(null,null);
 });
 assert.equal(await page.locator('#ai-chat-panel').isVisible(),false);
 assert.equal(await page.locator('#ai-chat-launch').isVisible(),false);
 assert.deepEqual(errors,[]);
 console.log('PASS: owner-only tutor is responsive, scrollable, persistent across navigation and hidden after sign-out.');
}finally{await browser.close()}
