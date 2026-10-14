// Deterministic preservation, never generation. Do not edit the exported source to redesign lessons.
import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {approvedWorkbenchLessons} from '../../generated-library.js';
const path=new URL('../../content/approved/source-jobs.json',import.meta.url);
const source=await readFile(path,'utf8');
const {jobs}=JSON.parse(source);
if(jobs.some(j=>j.state!=='approved'||!j.approved_at))throw Error('Unapproved source export');
const lessons=approvedWorkbenchLessons(jobs);
if(new Set(lessons.map(l=>l.id)).size!==lessons.length)throw Error('Duplicate approved lesson ID');
await writeFile(new URL('../../approved-lessons.js',import.meta.url),'// Preserved approved content; generated deterministically from content/approved/source-jobs.json.\nexport const preservedLessons = '+JSON.stringify(lessons,null,2)+';\n');
await writeFile(new URL('../../content/approved/inventory.json',import.meta.url),JSON.stringify({schemaVersion:1,sourceHash:createHash('sha256').update(source).digest('hex'),lessons:lessons.map(l=>({id:l.id,title:l.title,curriculum:l.curriculum,archived:l.archived,sourcePages:l.sourcePages,sourceUnitId:l.sourceUnitId,prerequisites:jobs.flatMap(j=>j.lesson.lessons).find(u=>u.id===l.sourceUnitId)?.prerequisites||[],questionIds:l.questions.map(q=>q.id),gradingHash:createHash('sha256').update(JSON.stringify(l.questions)).digest('hex'),activities:l.activities,simulator:l.simulator}))},null,2)+'\n');
console.log('Preserved '+lessons.length+' lessons and '+lessons.reduce((n,l)=>n+l.questions.length,0)+' question IDs.');
