import test from 'node:test';
import assert from 'node:assert/strict';
import {ContentRepository} from '../modular/repositories.js';
import {composeLesson,presentationPlan,validateLabCapabilities} from '../modular/composition.js';
import {widgetFor} from '../widget-registry.js';
import {modularFixture,uid,ref,entity} from './modular-fixture.mjs';

test('one semantic composition supports independent presentation profiles without changing educational/progress identities',()=>{
 const b=modularFixture(),repo=new ContentRepository();repo.importBundle(b);const composition=composeLesson(repo,ref(13)),classic=repo.get('PresentationProfile',uid(14),'1.0.0');const linear={...classic,id:uid(50),name:'Reading',renderer:'linear-reading@1',regions:[{name:'content',blockTypes:['concept']}]};
 const progress={correct:3,total:4,percentage:75};const a=presentationPlan(composition,classic,progress),c=presentationPlan(composition,linear,progress);
 assert.deepEqual(a.lesson,c.lesson);assert.deepEqual(a.assessmentRefs,c.assessmentRefs);assert.deepEqual(a.labRefs,c.labRefs);assert.deepEqual(a.progress,c.progress);assert.notEqual(a.profile.id,c.profile.id);assert.equal(a.citations[0].verification,'preserved-reference');
 assert.equal(validateLabCapabilities(composition,widgetFor),true);assert.throws(()=>validateLabCapabilities(composition,()=>null),/Unavailable/);assert.throws(()=>presentationPlan(composition,{...classic,regions:[]},progress),/omit/);
});
test('additional source support and disputed claims survive composition without duplicating concept blocks',()=>{
 const b=modularFixture();b.entities.push(entity('SourceWork',60,{title:'Second synthetic source',authors:[],publisher:null}),entity('SourceEdition',61,{workId:uid(60),edition:null,isbn:null,fingerprint:null,status:'metadata-only'}),{...b.entities[2],id:uid(62),editionId:uid(61),citation:'Second source, p. 12'},{...b.entities[3],id:uid(63),locatorIds:[uid(62)],state:'disputed',conflictsWith:[ref(4)]});b.entities[9].evidence.push(ref(63));
 const repo=new ContentRepository();repo.importBundle(b);const c=composeLesson(repo,ref(13));assert.equal(c.sources.length,2);assert.equal(c.locators.length,2);assert.equal(c.blocks.length,1);assert.equal(c.evidence.find(e=>e.id===uid(63)).conflictsWith[0].id,uid(4));
 const next=structuredClone(b);next.version='2.0.0';next.entities.push({...b.entities[7],version:'2.0.0',title:'Tolerance intervals',aliases:['allowed spread'],supersedes:ref(8)},{...b.entities[12],version:'2.0.0',title:'Resistor characteristics',topicRevisions:[ref(8,'2.0.0')],supersedes:ref(13)});repo.importBundle(next);const renamed=composeLesson(repo,ref(13,'2.0.0'));assert.equal(renamed.definition.id,c.definition.id);assert.equal(renamed.title,'Resistor characteristics');assert.deepEqual(renamed.lesson.assessments,c.lesson.assessments);assert.equal(repo.get('LessonRevision',uid(13),'1.0.0').title,undefined);
});
