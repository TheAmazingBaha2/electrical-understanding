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
 await page.locator('#ai-chat-new').click();
 assert.doesNotMatch(await page.locator('#ai-chat-messages').innerText(),/Detailed explanation/);
 await page.evaluate(async()=>{
  const {updateAIChatSession}=await import('/ai-chat-widget.js');
  updateAIChatSession(null,null);
 });
 assert.equal(await page.locator('#ai-chat-panel').isVisible(),false);
 assert.equal(await page.locator('#ai-chat-launch').isVisible(),false);
 assert.deepEqual(errors,[]);
 console.log('PASS: owner-only tutor is responsive, scrollable, persistent across navigation and hidden after sign-out.');
}finally{await browser.close()}
