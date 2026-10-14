// Versioned external-authoring contract. Plain text becomes escaped markup only.
import {widgetFor,validateWidgetReference,renderRegisteredWidget} from './widget-registry.js';
export const LESSON_SCHEMA_VERSION=1;
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const idPattern=/^[A-Za-z0-9][A-Za-z0-9._:-]*$/;
function object(v,label){if(!v||typeof v!=='object'||Array.isArray(v)||Object.getPrototypeOf(v)!==Object.prototype)throw Error(label+' must be a plain object');}
function keys(v,allowed,label){object(v,label);for(const k of Object.keys(v))if(!allowed.includes(k))throw Error('Unknown '+label+' field: '+k);}
function text(v,label){if(typeof v!=='string'||!v.trim())throw Error(label+' must be nonempty text');}
function list(v,label){if(!Array.isArray(v))throw Error(label+' must be an array');}
function id(v,label){text(v,label);if(!idPattern.test(v))throw Error('Invalid '+label);}
export function assertSerializable(value){
 const seen=new Set();function visit(v){
  if(v===null||typeof v==='string'||typeof v==='boolean')return;
  if(typeof v==='number'){if(!Number.isFinite(v))throw Error('Nonfinite number');return;}
  if(typeof v!=='object'||seen.has(v))throw Error('Nonserializable or cyclic data');
  seen.add(v);if(!Array.isArray(v))object(v,'JSON value');
  for(const [k,x] of Object.entries(v)){if(['__proto__','prototype','constructor'].includes(k))throw Error('Unsafe object key');visit(x);}seen.delete(v);
 }visit(value);return value;
}
export function validateLessonPackage(p,{knownLessonIds=[]}={}){
 assertSerializable(p);keys(p,['schemaVersion','id','title','description','curriculum','source','references','objectives','sections','workedExamples','checkpoints','activities','questions','reviewRules','prerequisites','approval'],'lesson');
 if(p.schemaVersion!==1)throw Error('Unsupported lesson schema; preserve original input');
 id(p.id,'lesson ID');for(const k of ['title','description'])text(p[k],k);
 if(knownLessonIds.includes(p.id))throw Error('Stable lesson ID already exists; explicit reviewed revision required');
 keys(p.curriculum,['section','source_id','source_title','chapter_id','chapter_title','order','dashboard'],'curriculum');
 if(!['exam','textbooks','labs','math','reviews'].includes(p.curriculum.section))throw Error('Unknown curriculum track');
 for(const k of ['source_id','chapter_id'])id(p.curriculum[k],k);
 for(const k of ['source_title','chapter_title'])text(p.curriculum[k],k);
 if(!Number.isFinite(p.curriculum.order)||typeof p.curriculum.dashboard!=='boolean')throw Error('Invalid dashboard placement');
 keys(p.source,['book','edition','chapter','printedPages'],'source');for(const k of ['book','edition','chapter','printedPages'])text(p.source[k],k);
 list(p.references,'references');const refs=new Set();for(const r of p.references){keys(r,['id','description','printedPages'],'reference');id(r.id,'reference ID');if(refs.has(r.id))throw Error('Duplicate reference');refs.add(r.id);text(r.description,'reference description');text(r.printedPages,'reference pages');}
 function citations(v){list(v,'source_ids');if(!v.length||v.some(x=>!refs.has(x)))throw Error('Missing or unknown source reference');}
 list(p.objectives,'objectives');if(!p.objectives.length)throw Error('Learning objectives required');p.objectives.forEach(v=>text(v,'objective'));
 list(p.sections,'sections');if(!p.sections.length)throw Error('Explanation sections required');
 for(const s of p.sections){keys(s,['heading','body','source_ids'],'section');text(s.heading,'heading');text(s.body,'body');citations(s.source_ids);}
 list(p.workedExamples,'workedExamples');for(const e of p.workedExamples){keys(e,['title','steps','result','source_ids'],'worked example');text(e.title,'example title');list(e.steps,'steps');if(!e.steps.length)throw Error('Worked steps required');e.steps.forEach(s=>text(s,'step'));text(e.result,'result');citations(e.source_ids);}
 list(p.checkpoints,'checkpoints');for(const c of p.checkpoints){keys(c,['id','kind','prompt','debrief','source_ids'],'checkpoint');id(c.id,'checkpoint');if(!['discussion','prediction'].includes(c.kind))throw Error('Unknown checkpoint kind');text(c.prompt,'checkpoint prompt');text(c.debrief,'debrief');citations(c.source_ids);}
 list(p.activities,'activities');const activityIds=new Set();for(const a of p.activities){keys(a,['id','title','prompt','expected','explanation','source_ids','widget'],'activity');id(a.id,'activity ID');if(activityIds.has(a.id))throw Error('Duplicate activity ID');activityIds.add(a.id);for(const k of ['title','prompt','expected','explanation'])text(a[k],k);citations(a.source_ids);if(a.widget){keys(a.widget,['id','version','config'],'widget');validateWidgetReference(a.widget);if(!widgetFor(a.widget.id,a.widget.version).compatibleLessonSchemas.includes(1))throw Error('Widget schema incompatible');}}
 list(p.questions,'questions');if(!p.questions.length)throw Error('Quiz questions required');const questionIds=new Set();
 for(const q of p.questions){keys(q,['id','type','prompt','choices','correct','answer','tolerance','unit','rubric','explain','safety','source_ids'],'question');id(q.id,'question ID');if(questionIds.has(q.id))throw Error('Duplicate question ID');questionIds.add(q.id);text(q.prompt,'question prompt');text(q.explain,'explanation');citations(q.source_ids);if(typeof q.safety!=='boolean')throw Error('Safety flag required');
  if(q.type==='choice'){list(q.choices,'choices');q.choices.forEach(c=>text(c,'choice'));if(q.choices.length<2||!Number.isInteger(q.correct)||q.correct<0||q.correct>=q.choices.length)throw Error('Invalid choice grading');}
  else if(q.type==='number'){if(!Number.isFinite(q.answer)||!Number.isFinite(q.tolerance)||q.tolerance<0||typeof q.unit!=='string')throw Error('Invalid numeric grading');}
  else if(q.type==='reflection'){text(q.rubric,'rubric');if(q.safety)throw Error('Safety-critical checks cannot be self-certified reflections');}
  else throw Error('Unsupported question type');
 }
 keys(p.reviewRules,['passFraction','missedDays','initialSuccessDays','retrySuccessDays'],'review rules');
 // Existing engine behavior is preserved; changing it requires a separately reviewed adapter.
 if(p.reviewRules.passFraction!==.8||p.reviewRules.missedDays!==1||p.reviewRules.initialSuccessDays!==7||p.reviewRules.retrySuccessDays!==21)throw Error('Review or grading rules incompatible with five-tab engine');
 list(p.prerequisites,'prerequisites');for(const prior of p.prerequisites){id(prior,'prerequisite');if(prior===p.id||!knownLessonIds.includes(prior))throw Error('Unknown/self prerequisite');}
 keys(p.approval,['status','reviewedBy','approvedAt'],'approval');if(p.approval.status!=='owner-approved')throw Error('Owner approval required');text(p.approval.reviewedBy,'reviewer');text(p.approval.approvedAt,'approval date');if(!Number.isFinite(Date.parse(p.approval.approvedAt)))throw Error('Invalid approval date');
 return p;
}
export function lessonFromPackage(p,options){
 validateLessonPackage(p,options);
 const blocks=p.sections.map(s=>'<h3>'+esc(s.heading)+'</h3><p>'+esc(s.body).replaceAll('\n','</p><p>')+'</p><small>Source: '+esc(s.source_ids.join(', '))+'</small>');
 for(const e of p.workedExamples)blocks.push('<h3>'+esc(e.title)+'</h3><ol>'+e.steps.map(s=>'<li>'+esc(s)+'</li>').join('')+'</ol><p>'+esc(e.result)+'</p>');
 const activities=[...p.activities.map(a=>({...a,answer:a.expected,widget:a.widget})),...p.checkpoints.map(c=>({title:c.kind,prompt:c.prompt,answer:c.debrief,explanation:c.debrief,source_ids:c.source_ids}))];
 return {publicationPackage:true,id:p.id,title:p.title,description:p.description,curriculum:p.curriculum,module:p.source.book,sourcePages:p.source.printedPages,sourceAttribution:[p.source.book,p.source.edition,p.source.chapter,p.source.printedPages].join(' · '),sourceReferences:p.references,objectives:p.objectives,html:blocks.join(''),teachingSections:p.sections,activities,questions:p.questions,prerequisites:p.prerequisites,reviewRules:p.reviewRules,generated:true,experiment:'generated',archived:false,simulator:null};
}
export function activityWidgetMarkup(activity){return activity.widget?renderRegisteredWidget(activity.widget):'';}
