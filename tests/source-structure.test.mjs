import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {authoredSeries} from './chapter3-series-fixture.mjs';
import {approvedWorkbenchLessons} from '../generated-library.js';
import {sourceIndex,learningProgress,studyInventory,sourcePlacement} from '../learning-structure.js';
import {renderSourceSection,renderChapterDashboard,renderMathPractice,renderSavedReinforcement} from '../source-navigation.js';
import {setup} from './scan-harness.mjs';
const {source,series}=authoredSeries();
const lessons=approvedWorkbenchLessons([{...source,state:'approved',lesson:{lessons:[],curated_series:series}}]);
const ctx={activeGeneratedLessons:lessons,progress:{},hasPassed:()=>false};
test('Chapter 3 lives only under Associate CET and its complete ordered contents drive the dashboard',()=>{
 const index=sourceIndex(ctx),guide=index.find(s=>s.id==='associate-cet'),chapter=guide.chapters.find(ch=>ch.id==='3');
 assert.equal(guide.chapters.length,22);assert.deepEqual(chapter.lessons.map(l=>l.id),lessons.map(l=>l.id));
 const dashboard=renderChapterDashboard(ctx),menu=renderSourceSection('ceta',ctx);
 assert.equal((dashboard.match(/class="dashboard-book source-book"/g)||[]).length,1);assert.equal((dashboard.match(/class="dashboard-chapter"/g)||[]).length,1);
 assert.equal((dashboard.match(/data-content-lesson=/g)||[]).length,16);assert.equal((menu.match(/data-content-lesson=/g)||[]).length,16);
 assert.doesNotMatch(renderMathPractice(ctx),/data-content-lesson=/);assert.doesNotMatch(dashboard,/v2-meter|v2-frost-ring|All published lessons|Legacy/);
});
test('progress is weighted by current question identities and excludes unrelated stale answers',()=>{
 const l=lessons[0],p={progress:{[l.id]:{answers:{[l.questions[0].id]:{correct:true},[l.questions[1].id]:{correct:false},removed:{correct:true}}}},hasPassed:()=>false};
 assert.deepEqual(learningProgress([l],p),{correct:1,incorrect:1,total:8,unanswered:6,mastered:0,lessons:1,percent:13});
 assert.equal(studyInventory({...ctx,activeCetaLessons:lessons}).length,16);
});
test('future chapters and books update the same menus and dashboard without hard-coded chart rows',()=>{
 const next={...lessons[0],id:'FUTURE-C4',curatedSeries:false,seriesId:null,curriculum:{section:'exam',source_id:'associate-cet',chapter_id:'4',order:1,dashboard:true}};
 const book={...next,id:'FUTURE-BOOK',curatedSeries:true,seriesId:'FUTURE-AUTHORED-BOOK',module:'New verified book',curriculum:{section:'textbooks',source_id:'new-book',source_title:'New verified book',chapter_id:'2',chapter_title:'Supported chapter',dashboard:true},sourceContents:[{id:'1',title:'Introduction'},{id:'2',title:'Supported chapter'}]};
 const c={...ctx,activeGeneratedLessons:[...lessons,next,book]};
 assert.equal(sourceIndex(c).find(s=>s.id==='new-book').chapters.length,2);
 assert.match(renderSourceSection('textbooks',c),/data-content-lesson="FUTURE-BOOK"/);
 const d=renderChapterDashboard(c);assert.equal((d.match(/class="dashboard-chapter"/g)||[]).length,3);assert.match(d,/data-dashboard-source="new-book"/);
});
test('missing TOC data stays pending, textbook placeholders are limited to the troubleshooting book',()=>{
 const c={progress:{}};const books=renderSourceSection('textbooks',c),labs=renderSourceSection('labs',c);
 assert.equal((books.match(/data-source=/g)||[]).length,1);assert.doesNotMatch(books,/Teach Yourself|Principles and Applications|Cabling/);
 assert.match(labs,/table of contents is supplied/);assert.equal((labs.match(/data-source=/g)||[]).length,4);
 assert.equal(sourcePlacement({source_track:'guide',title:'Chapter 4',source_book:'Associate CET'}, {kind:'math'}).section,'exam');
});
test('scan and archive are absent from both navigation; account and sync stay available',()=>{
 const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');assert.doesNotMatch(html,/data-view="(?:scan-inbox|legacy)"/);
 assert.equal((html.match(/data-view="account"/g)||[]).length,1);assert.equal((html.match(/data-view="ceta"/g)||[]).length,1);
 const app=readFileSync(new URL('../app.js',import.meta.url),'utf8');assert.doesNotMatch(app,/data-goto="scan-inbox"/);assert.match(app,/loadCloud/);assert.match(app,/data-disclosure/);
});
test('future paid authoring retains source chapter placement and explicitly opted-in math refreshers',async()=>{
 for(const mode of ['source','math']){
  const h=setup();await h.invoke({action:'register',path:'owner/33333333-3333-4333-8333-333333333333.pdf',title:'Chapter 4',book:'Associate CET Study Guide',pages:'25–35',track:'guide',chapterId:'4',chapterTitle:'DC Circuits',practiceMode:mode});
  assert.equal(h.job.analysis.intake_context.chapter_id,'4');assert.equal(h.calls.length,0);
  const r=await h.invoke({action:'plan'});assert.equal(r.status,200);const input=JSON.parse(h.calls[0].input[0].content[0].text);
  assert.equal(input.source_metadata.curriculum.section,mode==='math'?'math':'exam');assert.equal(input.source_metadata.curriculum.chapter_id,'4');assert.match(h.calls[0].instructions,/CURRICULUM STRUCTURE/);
 }
});

test('new lab companions attach to their actual manual rather than all sharing Basic Electric Circuits',async()=>{
 for(const [book,id] of [['EIM Fundamental Analog Circuits and Semiconductors','analog'],['EIM Fundamental Digital Design with FPGA','fpga'],['EIM Introduction to Microcontroller with RP2040','rp2040'],['EIM Basic Electric Circuits','basic']]){
  const h=setup();await h.invoke({action:'register',path:'owner/33333333-3333-4333-8333-333333333333.pdf',title:'Chapter 2',book,pages:'10–15',track:'basic',chapterId:'2'});await h.invoke({action:'plan'});
  const p=JSON.parse(h.calls[0].input[0].content[0].text).source_metadata.curriculum;
  assert.equal(p.source_id,id);assert.equal(sourcePlacement(h.job).source_id,id);assert.equal(p.section,'labs');
 }
});

test('availability is keyed by immutable lesson ID rather than object identity after catalog decoration',()=>{
 const app=readFileSync(new URL('../app.js',import.meta.url),'utf8');
 const start=app.indexOf('const canOpenLesson=');const end=app.indexOf('\nlet supabase=',start);
 const create=new Function('lessons','labLessons','unlocked','bookUnlocked','guideUnlocked','labUnlocked',app.slice(start,end)+';return canOpenLesson;');
 const can=create([{id:'L01'}],[{id:'LAB',subtrack:'basic'}],i=>i===0,l=>l.id==='BOOK',()=>false,l=>l.id==='LAB');
 assert.equal(can({id:'LAB',subtrack:'basic'}),true);assert.equal(can({id:'BOOK',subtrack:'geier'}),true);assert.equal(can({id:'L01'}),true);assert.equal(can({id:'UNKNOWN'}),false);assert.equal(can({id:'REFRESH',subtrack:'math'}),true);
});

test('saved reinforcement remains reachable without imposing a new review algorithm or source chart',()=>{
 const l={...lessons[0],id:'SAVED-REVIEW',seriesId:null,curatedSeries:false,curriculum:{section:'reviews',source_id:'associate-cet',chapter_id:'3'}};
 const c={...ctx,activeGeneratedLessons:[l]};assert.match(renderSavedReinforcement(c),/data-lesson="SAVED-REVIEW"/);assert.doesNotMatch(renderChapterDashboard(c),/chapter-pie/);
});
