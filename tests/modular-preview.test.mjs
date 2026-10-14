import test from 'node:test';import assert from 'node:assert/strict';
import {renderPreview,renderProgressPie} from '../modular/lesson-preview.js';
import {ContentRepository} from '../modular/repositories.js';import {composeLesson} from '../modular/composition.js';
import {modularFixture,ref} from './modular-fixture.mjs';
test('private renderer reuses classic tabs, shows citations/projection pies and escapes semantic input',()=>{
 const b=modularFixture();b.entities[6].text='<script>not executable</script>';const repo=new ContentRepository();repo.importBundle(b);const c=composeLesson(repo,ref(13)),profile=repo.list('PresentationProfile')[0];
 assert.match(renderPreview(c,profile),/Reference pages/);assert.match(renderPreview(c,profile),/Core lesson: 0 correct, 0 needs review, 1 unanswered out of 1 checks/);assert.equal((renderPreview(c,profile).match(/role="tab"/g)||[]).length,5);
 const learn=renderPreview(c,profile,{tab:'learn'});assert.match(learn,/&lt;script&gt;/);assert.doesNotMatch(learn,/<script>/);
 assert.match(renderPreview(c,profile,{tab:'quiz'}),/grading disabled/);assert.doesNotMatch(renderPreview(c,profile,{tab:'quiz'}),/<input|data-grade/);
 assert.match(renderProgressPie({correct:3,total:4}),/75%/);assert.throws(()=>renderProgressPie({correct:NaN,total:4}));assert.throws(()=>renderProgressPie({correct:5,total:4}));
});
