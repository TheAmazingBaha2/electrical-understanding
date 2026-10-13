// Shared organization for content menus, dashboard and lesson return routes.
// Placement changes presentation only; graded lesson/question IDs never change.
import {cetaGuideUnits,eimBasicExperiments} from './course-catalog.js';
export const studySections=[
 {id:'ceta',section:'exam',title:'Exam Practice',description:'Prepare for Associate CET, one chapter and lesson at a time.'},
 {id:'textbooks',section:'textbooks',title:'Textbook Companions',description:'Your books, their chapters, and the lessons that support your reading.'},
 {id:'labs',section:'labs',title:'Labs',description:'Manuals and chapter companions for the laboratory work you are studying.'},
 {id:'math',section:'math',title:'Math Practice',description:'Periodic refreshers on the mathematics behind electricity.'},
 {id:'reviews',section:'reviews',title:'Review',description:'Bring ideas from your regular lessons back into practice. The broader review format is still to be decided.'}
];
export const learningSources=[
 {id:'associate-cet',section:'exam',title:'Associate CET',book:'Associate CET Study Guide',chapters:cetaGuideUnits.flatMap(u=>u.chapters.map(([id,title,page])=>({id,title,page,group:u.title})))},
 {id:'geier',section:'textbooks',title:'How to Diagnose and Fix Everything Electronic',book:'How to Diagnose and Fix Everything Electronic',note:'Troubleshooting book · third edition. Full contents to be added when we work on this book.',chapters:[{id:'6',title:'Digital Multimeter',page:97}]},
 {id:'basic',section:'labs',title:'EIM · Basic Electric Circuits',book:'EIM Basic Electric Circuits',chapters:eimBasicExperiments.map(([id,title,page])=>({id,title,page}))},
 {id:'analog',section:'labs',title:'EIM · Fundamental Analog Circuits and Semiconductors',book:'EIM Fundamental Analog Circuits and Semiconductors',note:'Paused. Only the supplied chapter reference is listed; the full contents are pending.',chapters:[{id:'2.1',title:'Equipment and Tools',page:81}]},
 {id:'fpga',section:'labs',title:'EIM · Fundamental Digital Design with FPGA',book:'EIM Fundamental Digital Design with FPGA',note:'Manual waiting. Table of contents has not been supplied.',chapters:[]},
 {id:'rp2040',section:'labs',title:'EIM · Introduction to Microcontroller with RP2040',book:'EIM Introduction to Microcontroller with RP2040',note:'Manual waiting. Table of contents has not been supplied.',chapters:[]}
];
const clean=v=>String(v??'').trim();
export const sectionView=section=>studySections.find(s=>s.section===section)?.id||'textbooks';
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
 for(const s of sources)for(const ch of s.chapters)ch.lessons.sort((a,b)=>(a.curriculum.order||0)-(b.curriculum.order||0));
 return sources;
}
export function learningProgress(lessons,c={}){
 let correct=0,incorrect=0,total=0,mastered=0;
 for(const l of lessons){const answers=c.progress?.[l.id]?.answers||{};total+=l.questions.length;for(const q of l.questions){if(answers[q.id]?.correct===true)correct++;else if(answers[q.id]?.correct===false)incorrect++;}if(c.hasPassed?.(l))mastered++;}
 return {correct,incorrect,total,unanswered:total-correct-incorrect,mastered,lessons:lessons.length,percent:total?Math.round(correct/total*100):0};
}
export const chapterLabel=ch=>/^\d/.test(ch.id)?'Chapter '+ch.id:ch.id==='unassigned'?'Chapter assignment pending':ch.id;
export const sourceReturn=l=>{const p=placementForLesson(l);return {view:sectionView(p.section),key:p.source_id+':'+p.chapter_id};};
