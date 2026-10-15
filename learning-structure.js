import {catalogSection,lessonCatalogPlacement} from './lesson-catalog.js';
// Shared organization for content menus, dashboard and lesson return routes.
// Placement changes presentation only; graded lesson/question IDs never change.
import {cetaGuideUnits,eimBasicExperiments} from './course-catalog.js';
import {geierChapters} from './geier-catalog.js';
import {workshopActivityProgress} from './workshop-progress.js';
export const studySections=[
 {id:'lessons',section:'lessons',title:'Lessons',description:'Explore topics, experiments and references.'},
 {id:'labs',section:'labs',title:'Labs',description:'Practice alongside your lab manuals.'},
 {id:'ceta',section:'exam',title:'Exam Prep',description:'Chapter practice for certification exams.'},
 {id:'math',section:'math',title:'Math',description:'Refresh the mathematics behind electricity.'},
 {id:'reviews',section:'reviews',title:'Review',description:'Revisit ideas and checks from earlier lessons.'}
];
export const learningSources=[
 {id:'associate-cet',section:'exam',title:'Associate CET',book:'Associate CET Study Guide',chapters:cetaGuideUnits.flatMap(u=>u.chapters.map(([id,title,page])=>({id,title,page,group:u.title})))},
 {id:'geier',section:'textbooks',title:'How to Diagnose and Fix Everything Electronic',book:'How to Diagnose and Fix Everything Electronic',note:'Third edition · supplied table of contents. Chapter 2 workshops are ready; Chapter 6 currently covers only Digital Multimeter, pp. 97–103.',chapters:geierChapters},
 {id:'basic',section:'labs',title:'EIM · Basic Electric Circuits',book:'EIM Basic Electric Circuits',chapters:eimBasicExperiments.map(([id,title,page])=>({id,title,page}))},
 {id:'analog',section:'labs',title:'EIM · Fundamental Analog Circuits and Semiconductors',book:'EIM Fundamental Analog Circuits and Semiconductors',note:'Paused. Only the supplied chapter reference is listed; the full contents are pending.',chapters:[{id:'2.1',title:'Equipment and Tools',page:81}]},
 {id:'fpga',section:'labs',title:'EIM · Fundamental Digital Design with FPGA',book:'EIM Fundamental Digital Design with FPGA',note:'Manual waiting. Table of contents has not been supplied.',chapters:[]},
 {id:'rp2040',section:'labs',title:'EIM · Introduction to Microcontroller with RP2040',book:'EIM Introduction to Microcontroller with RP2040',note:'Manual waiting. Table of contents has not been supplied.',chapters:[]}
];
const clean=v=>String(v??'').trim();
export const sectionView=section=>studySections.find(s=>s.section===catalogSection(section))?.id||'lessons';
export function manualSourceId(title){const s=clean(title).toLowerCase();return /rp2040/.test(s)?'rp2040':/fpga/.test(s)?'fpga':/analog.*(?:circuits|semiconductor)/.test(s)?'analog':/basic electric circuits/.test(s)?'basic':null;}
const sourceKey=title=>'book-'+clean(title).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
export function sourcePlacement(job,unit={},kind='unique'){
 const explicit=unit.curriculum||job.analysis?.intake_context?.curriculum||{};
 const series=unit.series_id==='C3-CURATED-20261013'||/^C3-CURATED-U\d+$/.test(unit.id||'');
 const section=kind==='review'?'reviews':series?'exam':studySections.some(s=>s.section===explicit.section)?explicit.section:job.source_track==='guide'?'exam':job.source_track==='basic'?'labs':'textbooks';
 const sourceId=series?'associate-cet':clean(explicit.source_id)||(section==='exam'?'associate-cet':job.source_track==='geier'?'geier':job.source_track==='basic'?(manualSourceId(job.source_book)||sourceKey(job.source_book||job.title||'Manual')):sourceKey(job.source_book||job.title||'Source'));
 const label=job.analysis?.intake_context?.group||job.title||'';
 const chapterMatch=label.match(/\bchapter\s+(\d+(?:\.\d+)?)/i);
 return {section,source_id:sourceId,source_title:clean(explicit.source_title)||job.source_book||job.title||'Source',chapter_id:series?'3':clean(explicit.chapter_id)||chapterMatch?.[1]||'unassigned',chapter_title:series?'Basic Math used in Electronic Service & Decibels':clean(explicit.chapter_title)||job.analysis?.chapter_outline?.chapter_title||'Source chapter to be assigned',order:Number(unit.series_order||explicit.order)||0,dashboard:explicit.dashboard!==false};
}
export function placementForLesson(l){
 if(l.seriesId==='C3-CURATED-20261013'||/^C3-CURATED-U\d+$/.test(l.id||''))return {...l.curriculum,section:'exam',source_id:'associate-cet',chapter_id:'3',order:l.seriesOrder||0,dashboard:true};
 if(l.curriculum)return l.curriculum;
 if(l.id==='EIM-BEC-PRELAB'||l.id==='EIM-BEC-DC02')return {section:'labs',source_id:'basic',chapter_id:l.id==='EIM-BEC-PRELAB'?'PreLab':'DC 02',dashboard:false};
 if(/^BDMM-/.test(l.id||''))return {section:'textbooks',source_id:'geier',chapter_id:'6',dashboard:false};
 return {section:l.libraryView==='ceta'?'exam':l.libraryView||'math',source_id:sourceKey(l.module||'Practice'),source_title:l.module||'Practice',chapter_id:'unassigned',chapter_title:'Source chapter to be assigned',dashboard:Boolean(l.generated)};
}
export function studyInventory(c={}){
 const seen=new Set();return [...(c.activeCetaLessons||[]),...(c.bookLessons||[]),...(c.labLessons||[]),...(c.activeMathLessons||[]),...(c.activeGeneratedLessons||[])].filter(l=>{
  if(l.archived||seen.has(l.id))return false;seen.add(l.id);return true;
 }).map(l=>({...l,curriculum:placementForLesson(l)}));
}
export function sourceIndex(c={}){
 const sources=learningSources.map(s=>({...s,chapters:s.chapters.map(ch=>({...ch,lessons:[]}))}));
 for(const l of studyInventory(c)){
  const p=l.curriculum;if(!['exam','textbooks','labs'].includes(p.section))continue;
  let source=sources.find(s=>s.id===p.source_id&&s.section===p.section);
  if(!source){source={id:p.source_id,section:p.section,title:p.source_title||l.module||'Source',book:p.source_title||l.module||'Source',chapters:[]};sources.push(source);}
  for(const ch of l.sourceContents||[]){if(ch.id&&ch.title&&!source.chapters.some(x=>x.id===String(ch.id)))source.chapters.push({id:String(ch.id),title:String(ch.title),page:ch.page,lessons:[]});}
  let chapter=source.chapters.find(ch=>ch.id===String(p.chapter_id));
  if(!chapter){chapter={id:String(p.chapter_id||'unassigned'),title:p.chapter_title||'Source chapter to be assigned',lessons:[]};source.chapters.push(chapter);}
  chapter.lessons.push(l);
 }
 for(const s of sources)for(const ch of s.chapters)ch.lessons.sort((a,b)=>Number(Boolean(a.chapterSummary))-Number(Boolean(b.chapterSummary))||(a.curriculum.order||0)-(b.curriculum.order||0));
 return sources;
}
export function learningProgress(lessons,c={},{includePractice=false}={}){
 const counted=includePractice?lessons:lessons.filter(l=>!l.supplemental&&!(l.studyModule&&l.kind==='recap'));
 let correct=0,incorrect=0,total=0,mastered=0;
 for(const l of counted){const state=c.progress?.[l.id]||{},answers=state.answers||{};if(l.studyModule&&l.kind==='recap'){total+=state.checksTotal||0;correct+=Object.values(answers).filter(a=>a.correct===true).length;incorrect+=Object.values(answers).filter(a=>a.correct===false).length;if(c.hasPassed?.(l))mastered++;continue;}const practice=workshopActivityProgress(l,state);total+=l.questions.length+practice.total;correct+=practice.correct;incorrect+=practice.incorrect;for(const q of l.questions){if(answers[q.id]?.correct===true)correct++;else if(answers[q.id]?.correct===false)incorrect++;}if(c.hasPassed?.(l))mastered++;}
 return {correct,incorrect,total,unanswered:total-correct-incorrect,mastered,lessons:counted.length,percent:total?Math.round(correct/total*100):0};
}
export const chapterLabel=ch=>ch.label||(/^\d/.test(ch.id)?'Chapter '+ch.id:ch.id==='unassigned'?'Chapter assignment pending':ch.id);
// References reflect supplied metadata, never a guessed book page based on the topic.
export function lessonReferencePages(l){
 const known={'EIM-BEC-PRELAB':'1–12','EIM-BEC-DC02':'21–27','CETA-G03-01':'16 · table of contents only; chapter text not used'};
 const pages=l.sourcePages||l.referencePages||known[l.id]||(l.module||'').match(/\bpp?\.\s*(\d+(?:[–-]\d+)?)/)?.[1];
 if(pages)return String(pages).replace(/^\s*pp?\.?(?=\s|\d)\s*/i,'');
 if(l.generated||['exam','textbooks','lessons','labs'].includes(l.curriculum?.section)||l.subtrack==='geier')return 'Not recorded for this source';
 return 'Original practice · no book pages';
}
export const sourceReturn=l=>{const p=placementForLesson(l);if(catalogSection(p.section)==='lessons'){const c=lessonCatalogPlacement(l);return {view:'lessons',key:c.trackId+':'+c.groupId};}return {view:sectionView(p.section),key:p.source_id+':'+p.chapter_id};};
export function nextSourceLesson(lesson,inventory){
 const p=placementForLesson(lesson);
 const chapter=inventory.filter(l=>{const q=placementForLesson(l);return q.section===p.section&&q.source_id===p.source_id&&q.chapter_id===p.chapter_id;})
  .sort((a,b)=>Number(Boolean(a.chapterSummary))-Number(Boolean(b.chapterSummary))||(placementForLesson(a).order||0)-(placementForLesson(b).order||0));
 return chapter[chapter.findIndex(l=>l.id===lesson.id)+1]||null;
}
