// Developer-only import. Input is explicitly supplied JSON, never a ChatGPT account or web upload.
import {readFile,writeFile,mkdir,readdir} from 'node:fs/promises';
import {resolve,join} from 'node:path';
import {validateLessonPackage,lessonFromPackage} from '../../lesson-package.js';
import {preservedLessons} from '../../approved-lessons.js';
import {lessons} from '../../lessons.js';
import {labLessons} from '../../lab-lessons.js';
import {bookLessons} from '../../book-lessons.js';
import {cetaLessons} from '../../ceta-lessons.js';
import {mathLessons} from '../../math-lessons.js';
import {geierWorkshops} from '../../geier-workshops.js';
const directory=new URL('../../content/packages/',import.meta.url);
await mkdir(directory,{recursive:true});
const packages=[];for(const file of (await readdir(directory)).filter(f=>f.endsWith('.json')).sort())packages.push(JSON.parse(await readFile(new URL(file,directory),'utf8')));
const existing=[...preservedLessons,...lessons,...labLessons,...bookLessons,...cetaLessons,...mathLessons,...geierWorkshops].map(l=>l.id);
if(process.argv[2]){
 const input=JSON.parse(await readFile(resolve(process.argv[2]),'utf8'));
 validateLessonPackage(input,{knownLessonIds:[...existing,...packages.map(p=>p.id)]});
 await writeFile(new URL(encodeURIComponent(input.id)+'.json',directory),JSON.stringify(input,null,2)+'\n',{flag:'wx'});
 packages.push(input);
}
if(new Set(packages.map(p=>p.id)).size!==packages.length)throw Error('Duplicate published package ID');
const outputs=packages.map(p=>lessonFromPackage(p,{knownLessonIds:[...existing,...packages.filter(other=>other!==p).map(p=>p.id)]}));
// Detect prerequisite cycles before generating output.
const visiting=new Set(),done=new Set();function walk(id){if(done.has(id))return;if(visiting.has(id))throw Error('Prerequisite cycle');visiting.add(id);for(const prior of packages.find(p=>p.id===id)?.prerequisites||[])walk(prior);visiting.delete(id);done.add(id);}
packages.forEach(p=>walk(p.id));
await writeFile(new URL('../../published-lessons.js',import.meta.url),'// Developer-validated lesson package output. No automatic publication.\nexport const publishedLessons = '+JSON.stringify(outputs,null,2)+';\n');
console.log('Validated '+packages.length+' external-authoring packages. Review diff and preview before release.');
