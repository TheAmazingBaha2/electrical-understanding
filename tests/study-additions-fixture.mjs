import {studyFixture} from './foundations-fixture.mjs';import {modularFixture,uid} from './modular-fixture.mjs';import {mergeStudyBanks} from '../study-bank.js';
export function additionsFixture(){
 const base=studyFixture(),home=modularFixture().entities.find(e=>e.kind==='LessonDefinition'),id=uid(500),alias='older-pack-unit-1';
 const questions=Array.from({length:5},(_,i)=>({...structuredClone(base.questions[0]),id:uid(510+i),lessonId:alias,variantFamilyId:uid(510+i)}));
 const challenges=['desktop','mobile'].map((p,i)=>({...structuredClone(base.challenges[0]),id:uid(520+i),lessonId:alias,variantFamilyId:uid(520+i),config:{...base.challenges[0].config,allowedActions:[i?'add-electron':'add-proton']}}));
 const addition={id,version:'1.0.0',homeLessonId:home.id,title:'Synthetic optional comparison',importAliases:[alias],sourceIds:['fixture'],questionPoolIds:questions.map(q=>q.id),requiredCheckCount:3,completionPolicy:'either-platform',entryContexts:['math','source'],variants:{desktop:{id:uid(530),version:'1.0.0',challengeId:challenges[0].id},mobile:{id:uid(531),version:'1.0.0',challengeId:challenges[1].id}},teaching:{...structuredClone(base.lessons[0]),id:alias,requiredIds:[],challengeId:challenges[0].id}};
 const pack={schemaVersion:1,approved:true,revision:2,canonicalLessons:[{id:home.id,aliases:[base.lessons[0].id]}],additions:[addition],questions,challenges};return {base,pack,addition,bank:mergeStudyBanks(base,pack)};
}
