// Browser UI contract for private AI benchmark; mock transport means NO paid API calls.
import assert from "node:assert/strict";
import {chromium} from "playwright";
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH||undefined,args:process.env.CHROMIUM_PATH?['--no-sandbox']:[]});
try {
 const page=await browser.newPage({viewport:{width:1024,height:768}});
 await page.goto("http://127.0.0.1:8080/",{waitUntil:"domcontentloaded"});
 await page.evaluate(async()=>{
   const {renderAIModelLab,attachAIModelLab}=await import("/ai-model-lab.js");
   document.querySelector("#main").innerHTML=renderAIModelLab({id:"mock-owner"});
   const mocked={
    functions:{invoke:async(_slug,{body})=>{
     if(body.action==="status")return {data:{authorized:true,ready:true,models:["gpt-6-luna","gpt-6.1-sol","gpt-6-astra"],cases:[{id:"units-milli",title:"Convert milliamperes",topic:"CETa",prompt:"A virtual meter reports 2.5 mA. Convert it to amperes and explain why the prefix matters."}]},error:null};
     if(body.action==="run")return {data:{model:body.model,caseId:body.caseId,question:"A virtual meter reports 2.5 mA. Convert it to amperes and explain why the prefix matters.",reply:"2.5 mA = 0.0025 A. Multiply by one thousand for mA.",elapsedMs:42,
       tokens:{input:80,output:70},estimatedUSD:0.000043,checkCount:2,checkTotal:2,disclaimer:"Not a certified grade."},error:null};
     return {data:null,error:new Error("Unknown action")};
    }}
   };
   attachAIModelLab(mocked,()=>{});
 });
 await page.waitForFunction(()=>!document.querySelector("#ai-run").disabled);
 assert.equal(await page.locator("#ai-case option").count(),1);
 assert.match(await page.locator("#ai-case-prompt").innerText(),/virtual meter reports 2.5 mA/);
 assert.equal(await page.locator("#ai-model option").count(),3);
 await page.locator("#ai-model").selectOption("gpt-6-astra");
 assert.match(await page.locator("#ai-model-cost-note").textContent(),/Maximum 2 Astra tests/);
 await page.locator("#ai-model").selectOption("gpt-6.1-sol");
 await page.locator("#ai-run").click();
 await page.locator(".ai-result").waitFor({timeout:10000});
 assert.match(await page.locator(".ai-result").innerText(),/0\.0025 A/);
 assert.equal(await page.locator(".ai-result .ai-dialogue-question").count(),1);
 assert.equal(await page.locator(".ai-result .ai-dialogue-answer").count(),1);
 assert.match(await page.locator(".ai-result .ai-dialogue-question").innerText(),/virtual meter/);
 assert.match(await page.locator(".ai-result").innerText(),/0\.00004/);
 assert.match(await page.locator(".ai-lab-panel").innerText(),/Not a certified grade/);
 // Repeat at a phone size to check layout doesn't overflow.
 await page.setViewportSize({width:390,height:844});
 const w=await page.evaluate(()=>[document.documentElement.scrollWidth,innerWidth]);
 assert.ok(w[0]<=w[1]+2,"AI test mobile width overflow "+w);
 console.log("PASS: owner-only AI lab UI renders, loads cases, displays mock comparison, and fits mobile.");
}finally{await browser.close()}
