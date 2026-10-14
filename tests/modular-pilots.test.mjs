import test from 'node:test';
import assert from 'node:assert/strict';
import {draftModularPilots} from '../scripts/content/draft-modular-pilots.mjs';
import {ContentRepository} from '../modular/repositories.js';
import {composeLesson,presentationPlan,validateLabCapabilities} from '../modular/composition.js';
import {widgetFor} from '../widget-registry.js';
import {validateAssessmentTemplate,generateAssessment} from '../modular/assessments.js';

test('private Resistors/DMM drafts compose shared canonical knowledge and provenance with independent lab identities',async()=>{
 const {bundle,coverage}=draftModularPilots(),repo=new ContentRepository();repo.importBundle(bundle);assert.equal(coverage.lessonsMigrated,0);assert.equal(coverage.ownerUsablePilots,false);
 const profile=repo.list('PresentationProfile')[0],lessons=repo.list('LessonRevision');assert.equal(lessons.length,2);const compositions=lessons.map(l=>composeLesson(repo,{id:l.id,version:l.version}));
 for(const c of compositions){assert.equal(c.sources.length,2);assert.ok(c.blocks.length>1);assert.ok(c.locators.every(l=>l.citation&&l.verification==='preserved-reference'));assert.equal(validateLabCapabilities(c,widgetFor),true);assert.notEqual(c.labs.desktop.id,c.labs.mobile.id);assert.notEqual(c.labs.desktop.activityIds[0],c.labs.mobile.activityIds[0]);const plan=presentationPlan(c,profile,{correct:0,total:c.assessments.length});assert.deepEqual(plan.regions.map(r=>r.name),['overview','learn','interact','quiz','review']);}
 const common=compositions[0].topics.filter(t=>compositions[1].topics.some(other=>t.topicId===other.topicId));assert.equal(common.length,1);assert.equal(new Set(bundle.entities.map(e=>e.kind+':'+e.id)).size,bundle.entities.length);
 for(const t of repo.list('AssessmentTemplate')){validateAssessmentTemplate(t);await assert.rejects(generateAssessment(t,'draft'),/Unreviewed/);}
 const polarity=repo.list('AssessmentTemplate').find(t=>t.evaluator.op==='voltage-difference');const reviewed={...polarity,status:'reviewed'};const signs=new Set();for(let i=0;i<20;i++)signs.add(Math.sign((await generateAssessment(reviewed,String(i))).expected));assert.ok(signs.has(-1)&&signs.has(0)&&signs.has(1));
});
