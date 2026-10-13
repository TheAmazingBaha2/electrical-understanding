import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {sourcePlacement,sectionView} from '../learning-structure.js';
import {mathAvailability} from '../math-lessons.js';

const backend=readFileSync(new URL('../supabase/functions/scan-lesson-pipeline/index.ts',import.meta.url),'utf8');
const moduleSource=readFileSync(new URL('../generated-library.js',import.meta.url),'utf8');
const scanUI=readFileSync(new URL('../scan-inbox.js',import.meta.url),'utf8');
const app=readFileSync(new URL('../app.js',import.meta.url),'utf8');
const migration=readFileSync(new URL('../supabase/migrations/20261012183000_chapter_outlines_and_independent_lessons.sql',import.meta.url),'utf8');
const phaseMigration=readFileSync(new URL('../supabase/migrations/20261012183500_chapter_outline_attempt_phase.sql',import.meta.url),'utf8');

function verifyOutlineFunction(){
 const from=backend.indexOf('function verifyOutline(');
 const until=backend.indexOf('function parseText(',from);
 assert.ok(from>=0&&until>from,'source outline validator present');
 const js=backend.slice(from,until).replace(/:any|:string|:number/g,'')
  .replace(/new Map<string,string>\(\)/g,'new Map()').replace(/new Set<string>\(\)/g,'new Set()');
 return new Function('plain','evidenceFacts',js+';return verifyOutline;')((v,max)=>typeof v==='string'&&v.trim().length>0&&v.trim().length<=max,a=>[...(a?.facts||[]),...(a?.continuity?.sources||[]).flatMap(s=>s.facts||[])]);
}
const verify=verifyOutlineFunction();
const unit=(i,kind='concept')=>({key:'U'+String(i+1).padStart(2,'0'),title:'Grounded topic '+i,
 goal:'Learn and apply the concept',focus:'Explain the source evidence with a worked example',
 kind,destination:i%2?'source':'review',ordering:i?'sequential':'independent',
 prerequisites:i?['U'+String(i).padStart(2,'0')]:[],source_ids:['S1']});
const input=n=>({chapter_title:'Chapter study plan',rationale:'The number of lessons follows the concepts.',
 units:Array.from({length:n},(_,i)=>unit(i,i%3===0?'math':'concept'))});

test('lesson count is flexible, not fixed at twelve',()=>{
 for(const n of [1,4,8,12,15,26,40])
  assert.equal(verify(input(n),{facts:[{id:'S1'}]}).units.length,n);
});
test('math prerequisites are always removed, while conceptual dependencies are preserved',()=>{
 const plan=verify(input(7),{facts:[{id:'S1'}]}).units;
 assert.equal(plan[3].kind,'math');
 assert.equal(plan[3].ordering,'independent');
 assert.deepEqual(plan[3].prerequisites,[]);
 assert.equal(plan[4].ordering,'sequential');
 assert.deepEqual(plan[4].prerequisites,['U04']);
});
test('unsupported fact citations are rejected before drafting',()=>{
 const plan=input(1);plan.units[0].source_ids=['not-extracted'];
 assert.throws(()=>verify(plan,{facts:[{id:'S1'}]}));
});
test('mathematics unlocks without any completed electronic prerequisites',()=>{
 assert.equal(mathAvailability({id:'MATH-002'},[],()=>false),true);
 assert.equal(mathAvailability({id:'MATH-005'},[],()=>false),true);
 assert.match(app,/l.subtrack==='math'\)return true/);
});
test('chapter states and durable attempt phases are migrated',()=>{
 assert.match(migration,/'outlined'/);
 assert.match(migration,/a\.phase='outline'/);
 assert.match(migration,/p_stage='outline'/);
 assert.match(phaseMigration,/'outline'/);
});
test('pipeline reuses saved extraction and saves individual approved units',()=>{
 assert.match(backend,/action==="outline"\s*\?JSON\.stringify/);
 assert.match(backend,/acceptedLessons\.length===chapterOutline\.units\.length/);
 assert.match(backend,/status:"received",error_message:null/);
 assert.match(backend,/!plain\(f\.location,400\)/);
 assert.match(backend,/action==="review"&&job\.analysis\?\.chapter_outline\?instructions\.unitReview/);
});
test('Scan Inbox offers free recovery and per-lesson approval',()=>{
 assert.match(scanUI,/Revalidate saved /);
 assert.match(scanUI,/Ask Sol to outline the full chapter/);
 assert.match(scanUI,/Draft lesson /);
 assert.match(scanUI,/Approve /);
});
test('approved unit cards are separate from in-progress chapter drafts',()=>{
 const js=moduleSource.replace(/^import [^\n]+\n/gm,'').replace(/\bexport\s+(?=(?:async\s+)?(?:function|const|let)\b)/g,'');
 const {cards}=new Function('isArchivedScanChapter','sourcePlacement','sectionView',js+';return {cards};')(()=>false,sourcePlacement,sectionView);
 const job={state:'outlined',source_track:'guide',source_book:'Study Guide',source_pages:'pp. 16–24',
  analysis:{facts:[{id:'S1',location:'printed p. 17'}]},
  lesson:{lessons:[{title:'Practice Ohm’s law',description:'Reinforcement',kind:'math',destination:'source',
   ordering:'independent',sections:[{heading:'Example',body:'Step by step',source_ids:['S1']}],questions:[]}],
   current:{title:'Do not publish unfinished lesson',sections:[{heading:'Not yet',body:'Waiting',source_ids:['S1']}]}}};
 const html=cards([job],'math');
 assert.match(html,/Practice Ohm/);
 assert.doesNotMatch(html,/Do not publish unfinished lesson/);
 assert.match(html,/Study Guide/);
});
