import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const app=readFileSync(new URL('../app.js',import.meta.url),'utf8');

test('retired website authoring cannot be opened via navigation',()=>{
  assert.match(app,/if\(next==='scan-inbox'\|\|next==='ai-lab'\)next='account';/);
  assert.doesNotMatch(app,/data-goto="scan-inbox"|data-goto="ai-lab"/);
  assert.match(app,/Archived study material/);
});
test('official V2 still reads saved lessons and keeps tutor, grades and cloud sync',()=>{
  for(const marker of ["from('scan_lesson_jobs')","approvedWorkbenchLessons","loadApprovedInventory","mountAIChat","loadCloud","ProgressStore","renderAccount"])
    assert.ok(app.includes(marker),'Preserve '+marker);
});
