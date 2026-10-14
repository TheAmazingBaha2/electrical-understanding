import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {buildLegacyInventory,legacyRuntimeInventory} from '../scripts/content/legacy-inventory.mjs';
import {migrateLesson} from '../persistence.js';
import {validateEntity} from '../modular/validation.js';

test('migration ledger inventories every current lesson, question, activity and source dependency without granting credit',async()=>{
 const report=await buildLegacyInventory();assert.deepEqual(JSON.parse(await readFile(new URL('../content/modular/legacy-inventory.json',import.meta.url))),report);
 assert.equal(report.totals.preservedApprovedLessons,33);assert.equal(report.totals.preservedApprovedQuestions,336);assert.equal(report.totals.legacyLessons,63);
 for(const lesson of legacyRuntimeInventory()){
  const rows=report.mappings.filter(m=>m.lessonId===lesson.id);assert.equal(rows.filter(m=>m.legacyKind==='lesson').length,1);
  for(const q of lesson.questions)assert.equal(rows.filter(m=>m.legacyKind==='question'&&m.legacyId===q.id).length,1);
  const history={schemaVersion:1,answers:Object.fromEntries(lesson.questions.map(q=>[q.id,{correct:true,attempts:2}])),reviewDue:123456,unknownHistoricalField:{preserve:true}};
  const migrated=migrateLesson(history);assert.deepEqual(migrated.answers,history.answers);assert.equal(migrated.reviewDue,history.reviewDue);assert.deepEqual(migrated.unknownHistoricalField,history.unknownHistoricalField);
 }
 assert.equal(new Set(report.mappings.map(m=>m.id)).size,report.mappings.length);assert.ok(report.mappings.every(m=>m.disposition==='REQUIRES_REVIEW'&&m.credit==='none'&&validateEntity(m)));assert.equal(report.demolitionAllowed,false);
 assert.equal(report.sourceAnalysis.evidenceMigrated,0);assert.doesNotMatch(JSON.stringify(report),/storage_path|bucket_id|service_role|user_id|owner_id|draft_id|scanId/);
});
