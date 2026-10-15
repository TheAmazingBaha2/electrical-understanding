import {assertSerializable} from './data-contract.js';
import {particleState,energyTransition} from './foundation-model.js';
export const sameValue=(a,b)=>JSON.stringify(normalize(a))===JSON.stringify(normalize(b));
const normalize=x=>Array.isArray(x)?x.map(normalize):x&&typeof x==='object'?Object.fromEntries(Object.keys(x).sort().map(k=>[k,normalize(x[k])])):x;
export const allStudyItems=bank=>[...(bank?.questions||[]),...(bank?.variants||[]),...(bank?.challenges||[])];
export function validateStudyBank(bank) {
 assertSerializable(bank);
 if(bank?.schemaVersion!==1||typeof bank.id!=='string'||bank.approved!==true||!Array.isArray(bank.lessons)||!bank.lessons.length)throw Error('Unsupported or unapproved study bank');
 const sources=new Set(bank.sources.map(s=>s.id)),concepts=new Set(bank.concepts.map(c=>c.id)),lessons=new Set(bank.lessons.map(l=>l.id));
 if(sources.size!==bank.sources.length||concepts.size!==bank.concepts.length||lessons.size!==bank.lessons.length)throw Error('Duplicate study identity');
 const refs=(ids,pool,label)=>{if(!Array.isArray(ids)||!ids.length||ids.some(id=>!pool.has(id)))throw Error('Unresolved '+label);};
 for(const c of bank.concepts)refs(c.sourceIds,sources,'concept source');
 const ids=new Set();
 for(const item of allStudyItems(bank)) {
  if(ids.has(item.id)||!Number.isInteger(item.revision)||item.revision<1||!lessons.has(item.lessonId)||!concepts.has(item.primaryConceptId)||!item.variantFamilyId||!item.evidencePolicy)throw Error('Invalid study item identity');ids.add(item.id);
  refs(item.requiresIntroducedConceptIds,concepts,'required concept');refs(item.sourceIds,sources,'item source');if(!item.requiresIntroducedConceptIds.includes(item.primaryConceptId))throw Error('Primary concept must be explicitly introduced');
  if(item.kind==='single_choice') {
   if(typeof item.stem!=='string'||item.options?.length!==4||new Set(item.options.map(o=>o.id)).size!==4||new Set(item.options.map(o=>o.text)).size!==4||item.options.filter(o=>o.id===item.correctOptionId).length!==1||item.options.some(o=>!o.text||!o.feedback))throw Error('Invalid single-choice item');
  } else if(item.kind==='widget_challenge') {
   if(!['atom-identity','charge-balance','shell-energy','material-classifier'].includes(item.widgetKey))throw Error('Unregistered study widget');
   if(['atom-identity','charge-balance'].includes(item.widgetKey)){
    particleState(item.config.initialCounts);if(!Array.isArray(item.config.allowedActions)||!item.config.allowedActions.length||item.config.allowedActions.some(a=>!/^(add|remove)-(proton|neutron|electron)$/.test(a)))throw Error('Invalid particle controls');
    if(item.grading.expectedCounts)particleState(item.grading.expectedCounts);
   }
   if(item.widgetKey==='shell-energy')energyTransition(item.config.fromLevel,item.config.toLevel);
   if(item.widgetKey==='material-classifier') {if(!item.config.cases?.length||item.config.cases.some(c=>!item.config.answerOptions.includes(c.answer)))throw Error('Invalid case answer');}
   else if(!item.predictionOptions?.length||item.predictionOptions.filter(o=>sameValue(o.value,item.grading.expectedPrediction)).length!==1)throw Error('Invalid prediction alternatives');
  } else throw Error('Unsupported study item kind');
 }
 for(const lesson of bank.lessons) {
  refs(lesson.sourceIds,sources,'lesson source');refs(lesson.requiredIds,ids,'lesson check');
  if(!ids.has(lesson.challengeId)||!lesson.steps?.length||lesson.objectives?.length>2||!lesson.recap||!lesson.confusion)throw Error('Incomplete lesson');
  for(const step of [...lesson.steps,...(lesson.preparation||[])]){refs(step.conceptIds,concepts,'step concept');refs(step.sourceIds,sources,'step source');if(!step.text||!step.title)throw Error('Empty teaching step');}
  if(lesson.requiredIds.some(id=>allStudyItems(bank).find(i=>i.id===id)?.lessonId!==lesson.id))throw Error('Lesson check belongs to another lesson');
 }
 for(const c of bank.concepts){const families=new Set(allStudyItems(bank).filter(i=>i.primaryConceptId===c.id).map(i=>i.variantFamilyId));if(families.size<2)throw Error('Each assessed concept needs two distinct practice variants: '+c.id);}
 if(/<\s*script|javascript:|sb_secret_|service_role/i.test(JSON.stringify(bank)))throw Error('Unsafe study content');
 return bank;
}
export function presentedItem(item,seed) {
 // Option order is a display property, never variant identity or answer key.
 let n=2166136261;for(const ch of String(seed))n=Math.imul(n^ch.charCodeAt(0),16777619)>>>0;
 const copy=structuredClone(item);if(copy.options)for(let i=copy.options.length-1;i>0;i--){n=(Math.imul(n,1664525)+1013904223)>>>0;const j=n%(i+1);[copy.options[i],copy.options[j]]=[copy.options[j],copy.options[i]];}
 copy.variantId=item.variantId||item.id+'@'+item.revision;return copy;
}
export function studyPresentation(bank,item,seed){return {...presentedItem(item,seed),bankId:bank.id,bankRevision:bank.revision,sourceSnapshot:structuredClone(bank.sources.filter(s=>item.sourceIds.includes(s.id)))};}
export function answerStudyItem(item,answer,{caseId=null}={}) {
 if(item.kind==='single_choice'){const option=item.options.find(o=>o.id===answer);if(!option)throw Error('Choose an available option');return {correct:answer===item.correctOptionId,feedback:option.feedback,misconception:option.misconception||null};}
 if(item.widgetKey==='material-classifier'){const c=item.config.cases.find(c=>c.id===caseId);if(!c||!item.config.answerOptions.includes(answer))throw Error('Choose an available case label');return {correct:answer===c.answer,feedback:item.explanation,misconception:answer===c.answer?null:'relationship_classification'};}
 if(!item.predictionOptions.some(o=>sameValue(o.value,answer)))throw Error('Choose an available prediction');
 return {correct:sameValue(answer,item.grading.expectedPrediction),feedback:item.explanation,misconception:sameValue(answer,item.grading.expectedPrediction)?null:item.primaryConceptId+'_prediction'};
}
export function studyLessonAssets(bank) {
 if(!bank)return [];
 validateStudyBank(bank);return bank.lessons.map(l=>({...l,studyModule:true,contentRevision:bank.revision,seriesId:bank.id,seriesOrder:l.curriculum.order,module:bank.title,independent:true,subtrack:'private-study',sourcePages:l.sourcePages,
  questions:l.requiredIds.map(id=>{const i=allStudyItems(bank).find(q=>q.id===id);return {id:i.id,prompt:i.stem,type:'choice'};})}));
}
