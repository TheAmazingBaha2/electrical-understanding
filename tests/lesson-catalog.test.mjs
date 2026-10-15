import test from 'node:test';import assert from 'node:assert/strict';
import {studyFixture} from './foundations-fixture.mjs';
import {studyLessonAssets,mergeStudyBanks,studyPresentation} from '../study-bank.js';
import {renderChapterDashboard,renderSourceSection} from '../source-navigation.js';
import {sourceReturn} from '../learning-structure.js';
import {lessonReferenceLinks} from '../lesson-catalog.js';
import {initialStudyLesson,renderStudyLesson} from '../study-module-view.js';
import {emptyStudyJournal} from '../study-journal.js';
test('Lessons groups topics independently of books and old source links remain compatible',()=>{
 const b=studyFixture(),ls=studyLessonAssets(b),c={bookLessons:ls,progress:{}};
 for(const html of [renderSourceSection('lessons',c),renderSourceSection('textbooks',c,'fixture:1'),renderChapterDashboard(c)]){assert.match(html,/Electricity foundations/);assert.doesNotMatch(html,/Textbook Companions|data-source="fixture"|data-dashboard-source="fixture"/);for(const l of ls)assert.ok(html.includes('data-content-lesson="'+l.id+'"'));}
 assert.deepEqual(sourceReturn(ls[0]),{view:'lessons',key:'electricity-foundations:matter-charge-circuits'});
});
test('appending a second book citation expands the same lesson and preserves assessments and frozen sources',()=>{
 const b=studyFixture(),before=studyPresentation(b,b.questions[0],'fixed'),state=initialStudyLesson(b,b.lessons[0]);
 const addition={schemaVersion:1,approved:true,revision:2,sources:[{id:'second-book',book:'Another source',edition:'Reviewed edition',chapter:'2',printedPage:20,scanPage:null,pageStatus:'owner supplied',verification:'reviewed',section:'Supporting relationship'}],lessonReferences:[{id:'evidence-link-1',lessonId:b.lessons[0].id,sourceId:'second-book',role:'supporting',note:'Expands the same topic.'}]};
 const next=mergeStudyBanks(b,addition);assert.equal(next.lessons.length,b.lessons.length);assert.deepEqual(next.lessons,b.lessons);assert.deepEqual(next.questions,b.questions);assert.equal(initialStudyLesson(next,next.lessons[0]).id,state.id);assert.deepEqual(initialStudyLesson(next,next.lessons[0]).requiredItems.map(i=>i.options),state.requiredItems.map(i=>i.options));assert.deepEqual(studyPresentation(next,next.questions[0],'fixed').sourceSnapshot,before.sourceSnapshot);assert.equal(lessonReferenceLinks(next,next.lessons[0]).length,2);
 assert.match(renderStudyLesson(next,studyLessonAssets(next)[0],emptyStudyJournal()),/Original inspiration.*Additional supporting reference.*Another source/s);assert.deepEqual(mergeStudyBanks(next,addition),next);assert.throws(()=>mergeStudyBanks(next,{...addition,lessonReferences:[{...addition.lessonReferences[0],note:'collision'}]}),/collision/);
});
