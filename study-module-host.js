import {startStudyRecap,recapAction} from './study-recap.js';
import {allStudyItems,studyPresentation,availableStudyItem} from './study-bank.js';
import {challengeAction,challengeWorking} from './foundation-model.js';
import {makeStudyAttempt,startReview,repairReview,introducedConcepts} from './review-engine.js';
import {studyState,evidenceEvents} from './study-journal.js';
import {initialStudyLesson,initialStudyActivity,lessonTarget} from './study-module-view.js';
export function attachStudyModule(root,{bank,store,lesson=null,rerender,notify,navigate,clock=()=>new Date().toISOString()}={}) {
 let busy=false;
 const target=lesson?lessonTarget(lesson):'review.active',saved=studyState(store.read(),target),parentId=saved.event?.id||null;
 let state=structuredClone(saved.value||(lesson?initialStudyLesson(bank,lesson,store.owner||'anonymous'):null));
 const events=()=>evidenceEvents(store.read());
 const now=()=>clock();
 async function save(extra=[]) {const result=await store.updateState(target,parentId,state,extra,{at:now()});if(result.conflicted)notify('Both working copies are safe. Choose which position to continue.');rerender();}
 function action(selector,fn,event='click') {root.querySelectorAll(selector).forEach(el=>el.addEventListener(event,async ev=>{if(busy)return;busy=true;root.inert=true;try{await fn(el,ev);}catch(error){notify(error.message);}finally{busy=false;root.inert=false;}}));}
 function currentItem(){return lesson?state.requiredItems[state.quizIndex]:state.tasks[state.cursor].item;}
 function currentActivity(){return lesson?state.activity:(state.tasks[state.cursor].activity??=initialStudyActivity(currentItem(),{compact:true}));}
 function challenge(){return lesson?allStudyItems(bank).find(i=>i.id===lesson.challengeId):currentItem();}
 function requireIntroduced(item){if(!availableStudyItem(bank,item))throw Error('Reinstall the matching approved lesson bank before continuing this saved assessment. History is retained.');const introduced=introducedConcepts(events());if(!item.requiresIntroducedConceptIds.every(c=>introduced.has(c)))throw Error('Introduce the required teaching steps before this check');}
 function attempt(item,answer,{caseId=null,working=null}={}) {
  requireIntroduced(item);const task=lesson?null:state.tasks[state.cursor],id=(lesson?state.id+'/item/'+item.id:state.id+'/task/'+task.id)+(caseId?'/case/'+caseId:'');
  if(store.read().events.some(e=>e.id===id))throw Error('The first response is already saved; it cannot be replaced. Export recovery if saved copies disagree.');
  return {...makeStudyAttempt({id,sessionId:state.id,item:item.sourceSnapshot?item:studyPresentation(bank,item,lesson?state.id:task.id),answer,at:now(),assisted:lesson?!!state.hints?.includes(item.id):task.assisted,parentAttemptId:task?.parentAttemptId||null,caseId,working}),taskId:task?.id||null};
 }
 function feedbackReview(a) {if(!lesson)state=repairReview(bank,[...events(),a],state,a);}
 action('[data-study-recap-start]',async()=>{if(state.started&&!confirm('Start another recap? All earlier attempts remain saved.'))return;state=startStudyRecap(bank,lesson,events(),{limit:Number(root.querySelector('[data-study-recap-size]')?.value||12),run:(state.run||0)+1});await save();});
 action('[data-study-recap-action]',async el=>{state=recapAction(state,el.dataset.studyRecapAction);await save();});
 action('[data-study-tab]',async el=>{state.tab=el.dataset.studyTab;await save();});
 action('[data-study-step]',async el=>{state.step=Number(el.dataset.studyStep);await save();});
 action('[data-study-continue]',async()=>{
  const steps=[...(lesson.preparation||[]),...lesson.steps],step=steps[state.step],id='intro:'+state.id+':'+step.id;
  state.acknowledged=[...new Set([...state.acknowledged,step.id])];const extra=events().some(e=>e.id===id)?[]:[{id,type:'introduction',at:now(),stepId:step.id,conceptIds:step.conceptIds,sourceIds:step.sourceIds}];
  if(state.step+1<steps.length)state.step++;else state.tab='interact';await save(extra);
 });
 action('[data-study-quiz]',async el=>{state.quizIndex=Number(el.dataset.studyQuiz);await save();});
 action('input[name="study-answer"]',async el=>{if(lesson)state.selected[currentItem().id]=el.value;else state.tasks[state.cursor].selected=el.value;await save();},'change');
 action('[data-study-submit]',async()=>{
  const item=currentItem(),selected=lesson?state.selected[item.id]:state.tasks[state.cursor].selected;
  if(selected===undefined)throw Error('Select an answer before committing it');const a=attempt(item,selected);feedbackReview(a);await save([a]);
 });
 action('[data-study-hint]',async()=>{if(lesson)state.hints=[...new Set([...(state.hints||[]),currentItem().id])];else state.tasks[state.cursor].assisted=true;await save();notify('Hint: separate the particle count, sign or stated relationship asked for. Read its short teaching step if needed. This presentation is now assisted.');});
 action('input[name="study-prediction"]',async el=>{currentActivity().prediction=Number(el.value);await save();},'change');
 action('[data-study-predict]',async()=>{
  const item=challenge(),s=currentActivity();if(s.prediction===null)throw Error('Choose a prediction first');const a=attempt(item,item.predictionOptions[s.prediction].value,{working:s.working});s.attemptId=a.id;s.phase='committed';if(!lesson)state.tasks[state.cursor].attemptId=a.id;await save([a]);
 });
 action('[data-study-action]',async el=>{const s=currentActivity();if(s.phase==='prediction')throw Error('Commit a prediction first');s.working=challengeAction(challenge(),s.working,el.dataset.studyAction);await save();});
 action('[data-study-reset]',async()=>{currentActivity().working=challengeWorking(challenge());await save();});
 action('[data-study-particle]',async el=>{currentActivity().inspectedParticle=el.dataset.studyParticle;await save();});
 action('[data-study-sandbox-action]',async el=>{const s=currentActivity();s.sandboxWorking=challengeAction(challenge(),s.sandboxWorking||challengeWorking(challenge()),el.dataset.studySandboxAction);await save();});
 action('[data-study-sandbox-reset]',async()=>{currentActivity().sandboxWorking=challengeWorking(challenge());await save();});
 action('[data-study-reveal]',async()=>{const item=challenge(),s=currentActivity();if(s.working.actionCount<(item.config.targetActionCount||1)||s.phase==='prediction')throw Error('Perform the comparison before reveal');s.phase='revealed';s.comparisonAttempted=true;s.attemptedWorking=structuredClone(s.working);const a=events().find(e=>e.id===s.attemptId);if(!a)throw Error('Saved prediction missing; retain recovery copy');feedbackReview(a);await save();});
 action('[data-study-classify]',async el=>{
  const item=challenge(),s=currentActivity(),c=item.config.cases[s.caseIndex],a=attempt(item,el.dataset.studyClassify,{caseId:c.id});
  s.caseAnswers.push({caseId:c.id,answer:a.answer,correct:a.result.correct,attemptId:a.id});s.phase=s.caseAnswers.length===s.caseCount?'revealed':'committed';s.comparisonAttempted=s.phase==='revealed';s.attemptId=a.id;
  if(!lesson){state.tasks[state.cursor].attemptId=a.id;feedbackReview(a);}await save([a]);
 });
 action('[data-study-next-case]',async()=>{const s=currentActivity();if(!s.caseAnswers.some(a=>a.caseId===challenge().config.cases[s.caseIndex].id))throw Error('Classify this case first');s.caseIndex++;await save();});
 action('[data-study-start]',async()=>{if(!bank)throw Error('Install the approved private lesson bank first');if(state?.status==='active'&&!confirm('End the current session and start a new one? All attempts remain saved.'))return;const limit=Number(root.querySelector('[data-study-budget]')?.value||5);state=startReview(bank,events(),{id:crypto.randomUUID(),at:now(),limit});await save();});
 action('[data-study-next]',async()=>{const task=state.tasks[state.cursor];if(!task.attemptId||(task.item.kind==='widget_challenge'&&currentActivity().phase!=='revealed'))throw Error('Finish this comparison before continuing');state.cursor++;if(state.cursor>=state.tasks.length)state.status='finished';await save();});
 action('[data-study-end]',async()=>{state.status='finished';await save();});
 action('[data-study-pause]',async()=>{navigate('dashboard');});
 action('[data-study-flag]',async el=>{const id=el.dataset.studyFlag;if(!bank.concepts.some(c=>c.id===id))throw Error('Unknown topic');await store.append([{id:crypto.randomUUID(),type:'flag',at:now(),conceptId:id,flagged:el.getAttribute('aria-pressed')!=='true'}]);rerender();});
 action('[data-study-resolve]',async el=>{await store.resolve(el.dataset.studyTarget,el.dataset.studyResolve);rerender();});
 action('[data-study-export]',async()=>{const blob=new Blob([store.export()],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='workbench-private-practice-recovery.json';a.click();URL.revokeObjectURL(url);});
 action('[data-study-import]',async el=>{const file=el.files?.[0];if(!file)return;await store.import(JSON.parse(await file.text()));rerender();notify('Recovery merged. Conflicting working copies remain available for explicit selection.');},'change');
 // A bounded, saved frame sequence. Navigating/rerendering detaches this anchor,
 // cancelling its timer. Reduced-motion users retain complete one-step controls.
 const scene=root.querySelector('[data-study-scene]');
 const motion=lesson?state?.activity:state?.tasks?.[state.cursor]?.activity;
 if(scene&&motion?.working?.playing&&motion.phase==='revealed'&&!globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches)setTimeout(async()=>{
  if(!root.contains(scene)||busy)return;busy=true;
  try{motion.working=challengeAction(challenge(),motion.working,'tick');await save();}catch(error){notify(error.message);}finally{busy=false;}
 },700);
 return {setTab:async tab=>{if(busy||!lesson)return;busy=true;root.inert=true;try{state.tab=tab;await save();}catch(error){notify(error.message);}finally{busy=false;root.inert=false;root.querySelector('.lesson-tab.selected')?.focus();}}};
}
