// Developer-only migration from existing durable structured analysis. No AI or PDF reads.
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {join,resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {migrationId} from './legacy-inventory.mjs';
import {exportPrivateBundle} from './modular-file-repository.mjs';
import {validateBundle,validateEntity} from '../../modular/validation.js';
import {artifactHash} from '../../modular/repositories.js';

export function extractPreservedEvidence(job){
 if(job.state!=='approved'||!job.analysis)throw Error('Approved structured analysis required');
 const entities=[],key=job.source_book||'Unresolved supplied source',id=s=>migrationId('preserved-evidence:'+key+':'+s);
 const record=(kind,name,fields)=>({schemaVersion:3,kind,id:id(name),...fields});
 const work=record('SourceWork','work',{title:key,authors:[],publisher:null});entities.push(work);
 const edition=record('SourceEdition','edition',{workId:work.id,edition:null,isbn:null,fingerprint:null,status:'preserved-artifact'});entities.push(edition);
 const references=new Map();
 for(const fact of job.analysis.facts||[]){
  if(!fact.id||!fact.claim||!fact.location||references.has(fact.id))throw Error('Incomplete/duplicate preserved evidence; original retained');
  const locator=record('SourceLocator','locator:'+fact.id,{editionId:edition.id,chapter:job.lesson?.chapter_title||null,section:fact.location,printedPages:null,digitalPages:null,pageLabel:fact.location,citation:key+' · '+fact.location,verification:'preserved-reference'});entities.push(locator);
  const claim=record('EvidenceClaim','claim:'+fact.id,{version:'1.0.0',claimType:'fact',text:fact.claim,state:'under-review',locatorIds:[locator.id],conflictsWith:[]});entities.push(claim);references.set(fact.id,{id:claim.id,version:claim.version,locatorId:locator.id});
 }
 for(const [field,type,textField] of [['equations','formula','equation'],['safety_notes','safety-rule','note']])for(const [i,item] of (job.analysis[field]||[]).entries()){
  const parent=references.get(item.source_id);if(!parent||!item[textField])throw Error('Unresolved structured evidence reference; do not invent a locator');
  entities.push(record('EvidenceClaim',field+':'+i,{version:'1.0.0',claimType:type,text:field==='equations'?[item.meaning,item.equation].filter(Boolean).join('\n'):item.note,state:'under-review',locatorIds:[parent.locatorId],conflictsWith:[]}));
 }
 const bundle={schemaVersion:3,id:id('bundle'),version:'1.0.0',entities};validateBundle(bundle);
 const batch=record('IngestionBatch','batch',{editionIds:[edition.id],inputHash:'0'.repeat(64),status:'proposed',gaps:[...(job.analysis.gaps||[]),'Original raw PDF unavailable; preserved interpretations are not independently reverified.','Topic classification, source conflicts and claim-level technical review remain pending.']});validateEntity(batch);
 return {bundle,batch,legacyEvidenceReferences:[...references].map(([legacyId,r])=>({legacyId,evidence:{id:r.id,version:r.version},locatorId:r.locatorId})),coverage:{sources:1,editionsKnown:0,locators:references.size,evidenceClaims:entities.filter(e=>e.kind==='EvidenceClaim').length,rawVerified:false,rawDeletionSafe:false,lessonsMigrated:0}};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){
 if(process.argv.length!==3)throw Error('Usage: node scripts/content/extract-preserved-evidence.mjs /absolute/private/output-directory');
 const output=resolve(process.argv[2]);await mkdir(output,{recursive:true,mode:0o700});
 const {jobs}=JSON.parse(await readFile(new URL('../../content/approved/source-jobs.json',import.meta.url),'utf8'));
 for(const [i,job] of jobs.entries()){
  const result=extractPreservedEvidence(job);result.batch.inputHash=await artifactHash(job.analysis);const hash=await exportPrivateBundle(result.bundle,join(output,'source-'+(i+1)+'.bundle.json'));
  await writeFile(join(output,'source-'+(i+1)+'.coverage.json'),JSON.stringify({...result,bundle:undefined,bundleHash:hash},null,2)+'\n',{flag:'wx',mode:0o600});console.log(JSON.stringify({source:i+1,hash,...result.coverage}));
 }
}
