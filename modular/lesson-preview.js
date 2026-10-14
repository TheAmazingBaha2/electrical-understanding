import {ContentRepository} from './repositories.js';
import {composeLesson,presentationPlan} from './composition.js';
import {renderLessonTabs} from '../lesson-tabs.js';
import {progressPie} from '../source-navigation.js';
import {renderLabPlatform,attachLabPlatform} from '../lab-platform.js';
const escape=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function renderProgressPie(projection){
 const correct=projection.correct??0,total=projection.total??0,incorrect=projection.needsReview??0,percentage=total?100*correct/total:0;
 if(![correct,total,incorrect].every(Number.isInteger)||correct<0||incorrect<0||total<correct+incorrect)throw Error('Invalid progress projection');
 return '<figure class="modular-progress">'+progressPie({correct,incorrect,total,unanswered:total-correct-incorrect,percent:Math.round(percentage)},'Core lesson')+'<figcaption>'+correct+' / '+total+' core checks · ungraded preview</figcaption></figure>';
}
export function renderPreview(composition,profile,{tab='overview',projection={correct:0,total:composition.assessments.length},labMarkup=''}={}){
 if(composition.blocks.some(b=>b.assetKey))throw Error('Private renderer needs a registered figure/asset adapter; original content retained');
 const plan=presentationPlan(composition,profile,projection),linear=profile.renderer==='linear-reading@1';
 const citations='<details class="panel" open><summary>Reference pages</summary>'+plan.citations.map(c=>'<p class="sm">'+escape(c.citation)+' <span class="muted">('+escape(c.verification)+')</span></p>').join('')+'</details>';
 const block=b=>'<section class="panel" data-semantic-block="'+b.id+'"><span class="v2-kicker">'+escape(b.type)+'</span><h3>'+escape(b.title)+'</h3><p>'+escape(b.text).replaceAll('\n','</p><p>')+'</p></section>';
 const sections={
  overview:renderProgressPie(projection)+'<section class="panel"><h3>Learning objectives</h3><ul>'+composition.objectives.map(o=>'<li>'+escape(o.text)+'</li>').join('')+'</ul></section>'+citations,
  learn:plan.regions.filter(r=>r.name==='learn'||r.name==='content').flatMap(r=>r.blocks).map(block).join(''),
  interact:'<section class="panel"><h3>Explore with the shared laboratory</h3><p>This is free, ungraded experimentation. Lesson-specific practical checks remain under development; using this lab does not award a desktop/mobile grade.</p></section>'+(labMarkup||'<p>Open Interact to use the existing workbench.</p>'),
  quiz:composition.assessments.map(t=>'<section class="panel" data-assessment-id="'+t.id+'"><h3>'+escape(t.prompt)+'</h3><p class="muted">Draft template · grading disabled</p>'+(t.parameters.length?'<p>Proposed value sets: '+t.parameters.map(p=>escape(p.name)+': '+p.values.map(escape).join(', ')).join(' · ')+'</p>':'')+'<details><summary>Review the proposed answer criteria</summary><p>'+escape(t.explanation)+'</p><p>Evaluator: '+escape(t.evaluator.op)+' · unit '+escape(t.unit||'none')+'</p></details></section>').join(''),
  review:'<section class="panel"><h3>Owner review before publication</h3><p>No historical grades were imported or awarded. Source/taxonomy/template review, practical assessments and migration mappings remain pending. The ideal DC laboratory is not a physical safety certification.</p></section>'+citations
 };
 return '<article data-educational-id="'+composition.definition.id+'"><header class="panel"><span class="v2-kicker">PRIVATE MODULAR DRAFT · '+escape(composition.lesson.version)+'</span><h1>'+escape(composition.title)+'</h1><p>'+escape(composition.description)+'</p></header>'+(linear?Object.entries(sections).filter(([name])=>name!=='interact').map(([name,html])=>'<h2>'+escape(name)+'</h2>'+html).join(''):renderLessonTabs(tab,projection.correct,projection.total)+'<div id="lesson-panel" role="tabpanel">'+(sections[tab]||sections.overview)+'</div>')+'</article>';
}
export async function mountPrivatePreview(root,bundle){
 const repo=new ContentRepository();repo.importBundle(bundle);const lessons=repo.list('LessonRevision');if(!lessons.length)throw Error('Preview needs a lesson composition');
 let selected=lessons[0],tab='overview',linear=false,dispose;
 const classic=repo.list('PresentationProfile').find(p=>p.renderer==='classic-five-tab@1');if(!classic)throw Error('Classic profile missing');
 const draw=async()=>{
  root.inert=true;try{await dispose?.();dispose=null;const composition=composeLesson(repo,{id:selected.id,version:selected.version}),profile=linear?{...classic,id:'71d75454-580a-44ea-8f17-97ec0999c9ad',name:'Linear reading',renderer:'linear-reading@1',regions:[{name:'content',blockTypes:classic.regions.flatMap(r=>r.blockTypes)}]}:classic;
   root.innerHTML='<nav class="panel modular-preview-tools"><label>Lesson<select data-preview-lesson>'+lessons.map(l=>'<option value="'+l.id+'" '+(l.id===selected.id?'selected':'')+'>'+escape(repo.get('LessonDefinition',l.lessonId).title)+'</option>').join('')+'</select></label><label>Presentation<select data-preview-profile><option value="classic" '+(!linear?'selected':'')+'>Classic five tabs</option><option value="linear" '+(linear?'selected':'')+'>Linear reading</option></select></label></nav>'+renderPreview(composition,profile,{tab,labMarkup:!linear&&tab==='interact'?'<section data-preview-lab>'+renderLabPlatform()+'</section>':''});
   if(!linear&&tab==='interact')dispose=attachLabPlatform(root.querySelector('[data-preview-lab]'),localStorage,{onPlatformChange:draw});
  }finally{root.inert=false;}
 };
 let queue=Promise.resolve();const schedule=fn=>{queue=queue.then(async()=>{fn();await draw();}).catch(e=>{root.innerHTML='<p role="alert">'+escape(e.message)+'</p>';root.inert=false;});};
 const click=e=>{const button=e.target.closest('[data-lesson-tab]');if(button)schedule(()=>{tab=button.dataset.lessonTab;});};
 const change=e=>{if(e.target.matches('[data-preview-lesson]'))schedule(()=>{selected=lessons.find(l=>l.id===e.target.value);tab='overview';});if(e.target.matches('[data-preview-profile]'))schedule(()=>{linear=e.target.value==='linear';});};
 root.addEventListener('click',click);root.addEventListener('change',change);await draw();return async()=>{root.removeEventListener('click',click);root.removeEventListener('change',change);await queue;await dispose?.();};
}
