import test from 'node:test';import assert from 'node:assert/strict';
import {additionsFixture} from './study-additions-fixture.mjs';
import {mergeStudyBanks,validateStudyBank,studyPresentation} from '../study-bank.js';
import {conceptEvidence,makeStudyAttempt,reviewCandidates,DAY_MS} from '../review-engine.js';
function fixture(){const {base,pack}=additionsFixture(),p=structuredClone(pack),concept={id:'synthetic-limited-facet',title:'Synthetic limited facet',sourceIds:['fixture'],practiceCoverage:{kind:'limited-supplement',reason:'Only one source-supported comparison family is supplied.'}};p.concepts=[concept];for(const item of [...p.questions,...p.challenges]){item.primaryConceptId=concept.id;item.requiresIntroducedConceptIds=[concept.id];item.variantFamilyId='one-authored-family';}for(const step of p.additions[0].teaching.steps)step.conceptIds=[concept.id];return {base,pack:p,concept,bank:mergeStudyBanks(base,p)};}
test('limited practice is an explicit supplemental-only exception, not relaxed core validation',()=>{
 const {base,pack,bank}=fixture();assert.equal(validateStudyBank(bank),bank);const undeclared=structuredClone(pack);delete undeclared.concepts[0].practiceCoverage;assert.throws(()=>mergeStudyBanks(base,undeclared),/two distinct practice variants/);
 for(const reason of ['',null,8]){const bad=structuredClone(pack);bad.concepts[0].practiceCoverage.reason=reason;assert.throws(()=>mergeStudyBanks(base,bad),/Limited coverage/);}
 const core=structuredClone(base);core.concepts[0].practiceCoverage=pack.concepts[0].practiceCoverage;assert.throws(()=>validateStudyBank(core),/Limited coverage/);
 const raw=structuredClone(pack);raw.questions[0].practiceCoverage={kind:'limited-supplement'};assert.throws(()=>mergeStudyBanks(base,raw),/belongs to the concept/);
 const overlap=structuredClone(bank);overlap.lessons[0].steps[0].conceptIds.push(pack.concepts[0].id);assert.throws(()=>validateStudyBank(overlap),/Limited coverage/);
});
test('different item IDs in one limited family cannot manufacture Retaining or long spacing',()=>{
 const {bank,concept}=fixture(),at='2026-10-16T00:00:00.000Z',events=[{id:'intro',type:'introduction',at,conceptIds:[concept.id]}],questions=bank.questions.filter(q=>q.primaryConceptId===concept.id);
 for(let n=0;n<8;n++){const item=studyPresentation(bank,questions[n%questions.length],n),time=new Date(Date.parse(at)+n*2*DAY_MS).toISOString();events.push(makeStudyAttempt({id:'attempt'+n,sessionId:'test',item,answer:item.correctOptionId,at:time}));}
 const s=conceptEvidence(events)[concept.id];assert.ok(s.variants.length>1);assert.equal(s.label,'Limited coverage');assert.equal(s.stage,0);assert.equal(s.dueAt-Date.parse(s.lastAttemptAt),DAY_MS);
 const frozen=events[1].item.practiceCoverage;concept.practiceCoverage.reason='Changed local draft';assert.notEqual(frozen.reason,concept.practiceCoverage.reason);assert.match(reviewCandidates(bank,events)[0].reason,/limited supplemental coverage/);
 const oldOnly=events.filter(e=>e.type==='introduction'||e.type==='attempt').map(e=>{const copy=structuredClone(e);if(copy.item)delete copy.item.practiceCoverage;return copy;});assert.equal(conceptEvidence(oldOnly)[concept.id].label,'Retaining');
});
test('limited practice remains introduced-only and preserves misses and assisted history',()=>{
 const {bank,concept}=fixture();assert.equal(reviewCandidates(bank,[]).length,0);const at='2026-10-16T00:00:00.000Z',item=studyPresentation(bank,bank.questions.find(q=>q.primaryConceptId===concept.id),'test'),intro={id:'i',type:'introduction',at,conceptIds:[concept.id]},wrong=makeStudyAttempt({id:'wrong',sessionId:'test',item,answer:item.options.find(o=>o.id!==item.correctOptionId).id,at});assert.equal(conceptEvidence([intro,wrong])[concept.id].label,'Needs practice');const assisted=makeStudyAttempt({id:'assisted',sessionId:'test',item,answer:item.correctOptionId,at:new Date(Date.parse(at)+2*DAY_MS).toISOString(),assisted:true}),state=conceptEvidence([intro,wrong,assisted])[concept.id];assert.equal(state.label,'Needs practice');assert.equal(state.qualifying,0);assert.equal(state.misses,1);assert.equal(state.assisted,1);
});
