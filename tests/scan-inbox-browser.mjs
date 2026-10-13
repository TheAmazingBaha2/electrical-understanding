import assert from 'node:assert/strict';
import {chromium} from 'playwright';
// Mock the owner account, private Storage and AI pipeline. NO real model inference or charges.
const browser=await chromium.launch({headless:true});
try{
 const page=await browser.newPage({viewport:{width:390,height:840}});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.route('https://esm.sh/**',route=>route.abort());
 await page.goto('http://127.0.0.1:8080/',{waitUntil:'domcontentloaded'});
 await page.locator('.v2-hero').waitFor({timeout:30000});
 await page.evaluate(async()=>{
  const {renderScanInbox,attachScanInbox}=await import('/scan-inbox.js');
  let job=null;window.__attempts=[];window.__uploadCount=0;window.__failRegistration=true;
  const exampleAnalysis={
   overview:'A simulated low-voltage resistor circuit is illustrated.',
   facts:[{id:'S1',claim:'One 1 kΩ resistor is connected to 5 V.',location:'page 1',confidence:'high'},
          {id:'S2',claim:'The source is ideal in this exercise.',location:'page 1',confidence:'high'}],
   equations:[],safety_notes:[],gaps:[]
  };
  const lesson={title:'Practice a source-based resistance lesson',description:'An example source-based teaching draft.',
   objectives:['Convert units','Calculate current'],
   sections:[{heading:'Units',body:'Use amperes when applying Ohms law. '.repeat(13),source_ids:['S1']},
             {heading:'Circuit model',body:'An ideal source has a simple equivalent circuit. '.repeat(11),source_ids:['S2']},
             {heading:'Calculate',body:'Current is the voltage divided by resistance. '.repeat(11),source_ids:['S1']}],
   questions:[{prompt:'Find the current in amperes.',answer:'0.005 A',
               explanation:'Divide 5 V by 1,000 Ω.',source_ids:['S1']},
              {prompt:'Find the current in milliamperes.',answer:'5 mA',explanation:'Multiply A by 1,000.',source_ids:['S1']},
              {prompt:'What is ideal about the source?',answer:'Constant 5 V',explanation:'Ideal means no internal sag in this model.',source_ids:['S2']}]};
  const sampleReview={ready:true,summary:'No safety errors in this sample.',findings:[]};
  const client={
   from(table){
    if(table==='study_books'){const q={select(){return q},eq(){return q},order(){return q},limit(){return Promise.resolve({data:[{id:'book-one',title:'Test book',source_track:'guide'}],error:null})}};return q;}
    if(table==='scan_model_attempts')return {select(){return {order(){return {limit(){return Promise.resolve({data:window.__attempts,error:null})}}}}}};
    if(table!=='scan_lesson_jobs')throw new Error('Unauthorized table');
    return {select(){return{order(){return{limit(){return Promise.resolve({data:job?[job]:[],error:null})}}}}}};
   },
   storage:{from(bucket){
    if(bucket!=='eu-private-scans')throw Error('Wrong bucket');
    return {upload:async(path,body,options)=>{if(!(body instanceof ArrayBuffer))throw Error('Upload must use detached bytes');if(options.contentType!=='image/png')throw Error('Wrong normalized MIME');window.__uploadCount++;return {error:null}},download:async()=>({data:new Blob([1]),error:null})};
   }},
   functions:{invoke:async(slug,{body})=>{
    if(slug!=='scan-lesson-pipeline')throw Error('Wrong function');
    if(body.action==='budget-status')return {data:{contract:'spend-v1',sessions:[{id:'22222222-2222-2222-2222-222222222222',authorized_usd:100}],ledger:[],prices:[]},error:null};
    if(body.action==='status')return {data:{authorized:true},error:null};
    if(body.action==='delete'){job=null;return {data:{deleted:true},error:null};}
    if(body.action==='register'){
      if(window.__failRegistration){window.__failRegistration=false;return {error:{message:'Simulated lost registration response'}};}
      job={id:'00000000-0000-4000-8000-000000000001',title:body.title,source_path:body.path,
        source_book:body.book,source_pages:body.pages,source_track:body.track,revision:0,source_bytes:1024,created_at:new Date().toISOString(),state:'uploaded',analysis:null,lesson:null,review:null,draft_id:null};
      return {data:{jobId:job.id},error:null};
    }
    if(body.action==='plan'){job.analysis={planning_brief:{astra_guidance:'Verify',lesson_guidance:'Explain',review_guidance:'Check'}};job.revision++;}
    if(body.action==='outline'){job.state='outlined';job.analysis.chapter_outline={chapter_title:'One unit',units:[{id:'U01',title:'Circuit',kind:'math',destination:'source',ordering:'independent',prerequisites:[]}]};}
    if(body.action==='analyze'){job.state='analyzed';job.analysis=exampleAnalysis;}
    if(body.action==='draft'){job.state='drafted';job.lesson={lessons:[],current:{...lesson,plan:job.analysis.chapter_outline.units[0]}};}
    if(body.action==='review'){job.state='reviewed';job.review=sampleReview;}
    if(body.action==='approve'){job.state='approved';job.draft_id='GEN-'+job.id.toUpperCase();job.lesson={id:job.draft_id,lessons:[{...job.lesson.current,id:job.draft_id+'-U01'}],current:null};}
    return {data:{state:job.state,usage:{input:100,output:200,estimatedUSD:0.002}},error:null};
   }}
  };
  window.__mockClient=client;
  document.querySelector('#main').innerHTML=renderScanInbox({id:'00000000-0000-4000-8000-000000000010'});
  attachScanInbox(client,{id:'00000000-0000-4000-8000-000000000010'});
 });
 await page.waitForFunction(()=>document.querySelector('#scan-status')?.textContent.includes('0 private source'));
 assert.equal(await page.locator('#scan-share-consent').isChecked(),false);
 await page.locator('#scan-book').selectOption('book-one');
 await page.locator('#scan-pages').fill('1');
 await page.locator('#scan-title').fill('Chapter 4 DC circuit scan');
 await page.locator('#scan-file').setInputFiles({name:'chapter.png',mimeType:'image/png',buffer:Buffer.from([137,80,78,71,13,10,26,10])});
 await page.locator('#scan-share-consent').check();
 await page.locator('#scan-upload').click();
 await page.waitForFunction(()=>document.querySelector('#scan-upload')?.textContent.includes('Retry'));
 await page.locator('#scan-upload').click();
 await page.locator('[data-scan-action="plan"]').waitFor();
 assert.equal(await page.evaluate(()=>window.__uploadCount),1,'Registration retry must not upload a duplicate');
 assert.match(await page.locator('#scan-status').innerText(),/No AI charges yet/);
 const acceptPaid=dialog=>dialog.accept();page.on('dialog',acceptPaid);
 await page.locator('[data-scan-action="plan"]').click();
 await page.locator('[data-scan-action="analyze"]').click();
 await page.locator('.scan-evidence-row').first().waitFor();
 assert.match(await page.locator('#scan-detail').innerText(),/S1/);
 await page.locator('[data-scan-action="outline"]').click();
 await page.locator('[data-scan-action="draft"]').click();
 await page.locator('.scan-quiz-item').first().waitFor();
 assert.equal(await page.locator('.scan-lesson-section').count(),3);
 await page.locator('.scan-quiz-item').first().locator('summary').click();
 assert.match(await page.locator('.scan-quiz-item').first().innerText(),/0\.005 A/);
 await page.locator('[data-scan-action="review"]').click();
 await page.locator('[data-scan-action="approve"]').waitFor();
 await page.locator('[data-scan-action="approve"]').click();
 page.off('dialog',acceptPaid);
 await page.waitForFunction(()=>document.querySelector('#scan-detail')?.innerText.includes('Approved · available'));
 assert.match(await page.locator('#scan-detail').innerText(),/Approved lesson 1/i);
 assert.equal(await page.locator('.scan-chapter-current').count(),0);
 page.once('dialog',dialog=>dialog.dismiss());
 await page.locator('#scan-delete-source').click();
 assert.equal(await page.locator('#scan-delete-source').count(),1,'Cancel preserves scan');
 page.once('dialog',dialog=>dialog.accept());
 await page.locator('#scan-delete-source').click();
 await page.waitForFunction(()=>document.querySelector('#scan-status')?.textContent.includes('content deleted'));
 assert.equal(await page.locator('.scan-list-row').count(),0);
 const dims=await page.evaluate(()=>({page:document.documentElement.scrollWidth,viewport:innerWidth}));
 assert.ok(dims.page<=dims.viewport+2,'Mobile overflow '+JSON.stringify(dims));
 assert.deepEqual(errors,[],'No JS runtime errors');
 console.log('PASS: owner-only scan upload, manual Astra/Sol/Astra stages, preview, approval, and phone widths.');
}finally{await browser.close()}


