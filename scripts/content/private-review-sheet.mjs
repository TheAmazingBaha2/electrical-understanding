// Developer-only private review export. Never a publication or approval action.
import {writeFile,realpath} from 'node:fs/promises';
import {resolve,dirname,sep} from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {readPrivateBundle} from './modular-file-repository.mjs';
import {ContentRepository,artifactHash} from '../../modular/repositories.js';
import {composeLesson} from '../../modular/composition.js';
export function reviewSheet(repo){
 const lines=['# PRIVATE educational review — no publication or learner credit','',
  'Importing or previewing this material is not source verification, safety certification or owner approval. Technical, educational, source-rights and owner reviews remain separate gates.',''];
 for(const lesson of repo.list('LessonRevision')){
  const c=composeLesson(repo,{id:lesson.id,version:lesson.version});
  lines.push('## '+c.title+' · '+lesson.version+' · '+lesson.status,'','Identity: '+lesson.lessonId+'; revision: '+lesson.id,'',
   '### Objectives',...c.objectives.map(o=>'- '+o.text),'','### Source references',...c.locators.map(s=>'- '+s.citation+' — '+s.verification),'',
   '### Content and educational checks');
  for(const b of c.blocks)lines.push('',b.type+': '+b.title,b.text,...['hint','debrief'].filter(k=>b[k]).map(k=>k+': '+b[k]));
  lines.push('','### Common grading proposal — inactive until reviewed');
  for(const t of c.assessments)lines.push('',t.id+'@'+t.version+' · '+t.type+(t.safety?' · REQUIRED SAFETY':''),t.prompt,'Explanation: '+t.explanation,'Allowed sets: '+JSON.stringify(t.parameters),'Rule: '+JSON.stringify(t.evaluator)+'; unit '+t.unit+'; tolerance '+JSON.stringify(t.tolerance));
  lines.push('','### Independent practical proposals');
  for(const platform of ['desktop','mobile']){
   const module=lesson.labs[platform]&&repo.get('LabModuleReference',lesson.labs[platform].id,lesson.labs[platform].version),definition=module?.definition&&repo.get('LabModuleDefinition',module.definition.id,module.definition.version);
   lines.push('',platform+': '+(module?module.id+'@'+module.version:'none'));
   if(!definition){lines.push('No implemented activity definition in this historical revision.');continue;}
   for(const a of definition.activities)lines.push('',a.id+' · '+a.title+(a.required?' · required':' · optional'),a.prompt,'Hint: '+a.hint,'Rubric: '+JSON.stringify(a.rubric),'Debrief: '+a.explanation);
  }
  lines.push('','Practical completion policy: '+lesson.labs.completionPolicy+'. Core grades remain shared once; desktop and phone grades remain independent.',
   'Review policy: '+JSON.stringify(lesson.reviewPolicy||'historical/default — confirm during review'),
   '','Review decisions: source rights [pending]; evidence/edition [pending]; technical [pending]; educational [pending]; owner usability [pending]; migration equivalence [pending].','');
 }
 return lines.join('\n')+'\n';
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){
 if(process.argv.length!==4)throw Error('Usage: node scripts/content/private-review-sheet.mjs PRIVATE_BUNDLE PRIVATE_OUTPUT.md');
 const output=resolve(process.argv[3]),parent=await realpath(dirname(output)),repoRoot=await realpath(fileURLToPath(new URL('../../',import.meta.url)));
 if(parent===repoRoot||parent.startsWith(repoRoot+sep))throw Error('Private review sheets must remain outside the public repository');
 const bundle=await readPrivateBundle(process.argv[2]),repo=new ContentRepository();repo.importBundle(bundle);
 await writeFile(output,'Bundle SHA-256: '+await artifactHash(bundle)+'\n\n'+reviewSheet(repo),{flag:'wx',mode:0o600});
 console.log('Private review sheet created; no approval recorded.');
}
