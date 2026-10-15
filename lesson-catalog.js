// Presentation-only topic catalog. Books are evidence, never lesson identity.
// Hosts may supply catalog metadata without migrating content or learner records.
export const catalogSection=section=>['textbooks','lessons'].includes(section)?'lessons':section;
export function lessonCatalogPlacement(lesson){
 const c=lesson.catalog||{};
 const meter=lesson.curriculum?.chapter_id==='6'||/^BDMM-/.test(lesson.id||'');
 return {trackId:c.trackId||(lesson.studyModule?'electricity-foundations':'practical-electronics'),trackTitle:c.trackTitle||(lesson.studyModule?'Electricity foundations':'Tools and troubleshooting'),groupId:c.groupId||(lesson.studyModule?'matter-charge-circuits':meter?'measurement':'electronic-tools'),groupTitle:c.groupTitle||(lesson.studyModule?'Matter, charge and circuits':meter?'Digital multimeter skills':'Electronic tools and repair'),order:c.order??lesson.curriculum?.order??0};
}
export function lessonCatalog(inventory){
 const tracks=[];
 for(const lesson of inventory.filter(l=>catalogSection(l.curriculum?.section)==='lessons')){
  const p=lessonCatalogPlacement(lesson);let track=tracks.find(t=>t.id===p.trackId);
  if(!track){track={id:p.trackId,section:'lessons',title:p.trackTitle,book:p.trackTitle,chapters:[]};tracks.push(track);}
  let group=track.chapters.find(g=>g.id===p.groupId);
  if(!group){group={id:p.groupId,title:p.groupTitle,label:'TOPIC SERIES',lessons:[]};track.chapters.push(group);}
  group.lessons.push(lesson);
 }
 for(const t of tracks)for(const g of t.chapters)g.lessons.sort((a,b)=>Number(!!a.chapterSummary)-Number(!!b.chapterSummary)||lessonCatalogPlacement(a).order-lessonCatalogPlacement(b).order||a.id.localeCompare(b.id));
 return tracks;
}
// Append-only evidence links can expand an existing lesson without rekeying it,
// changing its assessment revision, or replacing frozen attempt citations.
export function lessonReferenceLinks(bank,lesson){
 const original=lesson.sourceIds.map(sourceId=>({id:'original:'+lesson.id+':'+sourceId,lessonId:lesson.id,sourceId,role:'inspiration'}));
 return [...original,...(bank.lessonReferences||[]).filter(r=>r.lessonId===lesson.id)];
}
export function validateLessonReferences(bank){
 const seen=new Set();for(const r of bank.lessonReferences||[]){
  if(!r.id||seen.has(r.id)||!bank.lessons.some(l=>l.id===r.lessonId)||!bank.sources.some(s=>s.id===r.sourceId)||!['inspiration','supporting','qualification'].includes(r.role)||typeof r.note!=='string')throw Error('Invalid or duplicate lesson evidence link');seen.add(r.id);
 }
 for(const l of bank.lessons)if(l.catalog){const c=l.catalog;if(['trackId','trackTitle','groupId','groupTitle'].some(k=>typeof c[k]!=='string'||!c[k].trim())||c.order!==undefined&&!Number.isFinite(c.order))throw Error('Invalid topic catalog placement');}
}
