import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {approvedWorkbenchLessons} from '../generated-library.js';
import {isArchivedScanChapter,legacyGroup} from '../legacy-groups.js';
import {v2Dashboard,v2Page} from '../v2-panels.js';

const archiveId='75f4c1db-1d8c-40df-890b-4211862bcfc4';
const exampleQuestions=Array.from({length:5},(_,i)=>({
 prompt:'Explain question '+i,answer:'Apply the relationship',
 explanation:'Track known quantities',source_ids:['S1']
}));
const sections=[{heading:'Source concept',body:'Reason through the saved example.',source_ids:['S1']}];
const unit=(n,review=false)=>({
 id:'GEN-'+archiveId.toUpperCase()+'-U'+String(n).padStart(2,'0'),
 title:review?'Review concept '+n:'Source concept '+n,
 kind:n%3===0?'math':'concept',destination:review?'review':'source',
 sections:review?[]:sections,questions:review?[]:exampleQuestions,
 review_lessons:review?[{title:'Review concept '+n,new_perspective:'Different practice',
 sections,questions:exampleQuestions}]:[]
});
const job=(id,units)=>({
 id,state:'approved',source_track:'guide',source_book:'Associate CET Study Guide',
 source_pages:'pp. 1-24',lesson:{lessons:units}
});
const context=(active,archived,progress={})=>({
 lessons:[],labLessons:[],bookLessons:[],activeCetaLessons:[],activeMathLessons:[],
 archivedPilotLessons:[],archivedUnreferencedLessons:[],
 activeGeneratedLessons:active,archivedGeneratedLessons:archived,
 progress,reviews:0,banner:'',coreRows:'',legacyRows:'',
 hasPassed:l=>Boolean(progress[l.id]?.complete)
});

test('only the exact approved Chapter 3 batch archives all 16 source and reinforcement units',()=>{
 const archive=job(archiveId,Array.from({length:16},(_,i)=>unit(i+1,i>=12)));
 const inventory=approvedWorkbenchLessons([archive]);
 assert.equal(inventory.length,16);
 assert.equal(inventory.filter(l=>l.archived).length,16);
 assert.ok(inventory.every(l=>l.libraryView==='legacy'&&legacyGroup(l)==='scan-chapter'));
 assert.equal(inventory.filter(l=>l.questions.length===10).length,16);
 const ui=v2Page('legacy',context([],inventory));
 assert.equal((ui.match(/data-goto="generated-lesson"/g)||[]).length,16);
 assert.match(ui,/Chapter 3 · Math for Electronics/);
 assert.match(ui,/0 \/ 16/);
 assert.equal(isArchivedScanChapter('unrelated-chapter-id'),false);
});
test('new chapter goes into active dashboard, reviews and correct category with actual answers',()=>{
 const newChapter=job('11111111-1111-1111-1111-111111111111',[
  unit(1),unit(2),unit(3,true)
 ]);
 const items=approvedWorkbenchLessons([newChapter]);
 assert.equal(items.length,3);
 assert.ok(items.every(l=>!l.archived));
 assert.deepEqual(items.map(l=>l.libraryView),['ceta','ceta','reviews']);
 const progress={[items[0].id]:{complete:true,updatedAt:1790000000000,
  answers:{[items[0].questions[0].id]:{correct:true,reviewDue:0}}}};
 const ui=v2Dashboard(context(items,[],progress));
 assert.match(ui,/Approved active companions/);
 assert.match(ui,/1 \/ 3/);
 assert.match(ui,/Review &amp; Reinforcement/);
 assert.match(ui,/Source concept 1/);
 assert.match(ui,/Correct saved answers/);
 assert.match(ui,/All published lessons/);
});
test('new approval includes server-assigned track and unified dashboard-readiness metadata',()=>{
 const src=readFileSync(new URL('../supabase/functions/scan-lesson-pipeline/index.ts',import.meta.url),'utf8');
 assert.match(src,/function dashboardTrack\(job:any,unit:any\)/);
 assert.match(src,/dashboard_track:dashboardTrack\(job,unit\),dashboard_ready:true/);
 const app=readFileSync(new URL('../app.js',import.meta.url),'utf8');
 assert.match(app,/approvedWorkbenchLessons\(data\|\|\[\]\)/);
 assert.match(app,/archivedGeneratedLessons,activeGeneratedLessons/);
});
test('scan actions and spending controls precede a collapsed and preserved attempt history',()=>{
 const src=readFileSync(new URL('../scan-inbox.js',import.meta.url),'utf8');
 const start=src.indexOf('function detail(job)');
 const end=src.indexOf('export function attachScanInbox',start);
 const detail=src.slice(start,end);
 assert.ok(detail.indexOf('scan-approve-actions')<detail.indexOf('explainAnalysis(job.analysis)'));
 assert.ok(detail.indexOf('scan-approve-actions')<detail.indexOf('attemptLog(job)'));
 assert.match(src,/scan-attempt-log/);
 assert.match(src,/data-scan-expand="attempt-history"/);
 assert.match(src,/querySelector\('\.scan-approve-actions'\)\?\.after\(controls\)/);
 assert.match(src,/Download saved response & error/);
});
