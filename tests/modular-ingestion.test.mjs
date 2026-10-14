import test from 'node:test';import assert from 'node:assert/strict';
import {DeterministicIngestionProvider,ingestionContext} from '../modular/ingestion.js';import {ContentRepository} from '../modular/repositories.js';import {modularFixture,entity,uid,ref} from './modular-fixture.mjs';
test('eight deterministic private ingestion fixtures propose reviewable decisions without content, grades or publication changes',async()=>{
 const bundle=modularFixture();bundle.entities.push(entity('SourceLocator',31,{...bundle.entities[2],id:uid(31),printedPages:{start:14,end:14}}),entity('Topic',30,{title:'Reference selection',aliases:['reference']}),entity('LessonDefinition',32,{title:'Another synthetic lesson',aliases:[],description:'Synthetic only.'}));
 const repo=new ContentRepository();repo.importBundle(bundle);const original=repo.exportBundle(bundle.id,bundle.version),provider=new DeterministicIngestionProvider(),context=ingestionContext(repo),base={id:uid(100),summary:bundle.entities[3].text,locatorIds:[uid(3)],topicHints:['tolerance'],topicIds:[],lessonIds:[],intent:'fact',contradicts:[],objectives:[]};
 const fixtures=[
  ['duplicate',{},'DUPLICATE'],
  ['additional evidence',{locatorIds:[uid(31)],intent:'new-evidence'},'EXTEND_TOPIC'],
  ['contradiction',{summary:'Synthetic incompatible claim.',contradicts:[ref(4)]},'CONFLICT'],
  ['subtopic',{summary:'A narrower synthetic topic.',intent:'subtopic'},'CREATE_SUBTOPIC'],
  ['new lesson',{summary:'A coherent new synthetic objective.',intent:'new-lesson',topicHints:[],objectives:['Demonstrate the new test skill.']},'CREATE_LESSON'],
  ['split',{intent:'split',topicIds:[uid(5),uid(30)],lessonIds:[uid(9)],objectives:['First objective.','Second objective.']},'SPLIT_LESSON'],
  ['merge',{intent:'merge',lessonIds:[uid(9),uid(32)]},'MERGE_LESSONS'],
  ['missing citation',{locatorIds:[]},'DEFER']
 ];
 for(const [name,fields,expected] of fixtures){const input={format:'eu-ingestion-input@1',editionIds:[uid(2)],items:[{...base,...fields}]},a=await provider.prepare(input,context),b=await provider.prepare(input,context);assert.deepEqual(a,b,name);assert.equal(a.proposals[0].decision,expected,name);assert.equal(provider.validate(a.batch,a.proposals).valid,true);assert.equal(a.proposals[0].review,'pending');assert.match(a.diffs[0].gradeImpact,/no credit/);assert.equal(repo.exportBundle(bundle.id,bundle.version),original);}
 const ambiguous=structuredClone(context);ambiguous.topics[1].aliases.push('tolerance');const result=await provider.prepare({format:'eu-ingestion-input@1',editionIds:[uid(2)],items:[base]},ambiguous);assert.equal(result.proposals[0].decision,'DEFER');assert.match(result.proposals[0].reason,/Ambiguous/);
 await assert.rejects(provider.prepare({format:'eu-ingestion-input@1',editionIds:[uid(2)],items:[{...base,code:'fetch()'}]},context),/Malformed/);
});
