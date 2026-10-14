import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,mkdtemp,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {domainSchema,ENTITY_KINDS} from '../modular/contracts.js';
import {validateBundle,validateEntity} from '../modular/validation.js';
import {ContentRepository,createDomainRepositories,canonicalJSON,artifactHash} from '../modular/repositories.js';
import {JsonFileContentRepository,exportPrivateBundle,readPrivateBundle} from '../scripts/content/modular-file-repository.mjs';
import {modularFixture,uid,entity,ref} from './modular-fixture.mjs';

test('Schema V3 family is independent, reproducible and strictly rejects malformed contracts',async()=>{
 assert.deepEqual(JSON.parse(await readFile(new URL('../content/modular/domain.schema.json',import.meta.url))),domainSchema);
 assert.equal(ENTITY_KINDS.length,19);validateBundle(modularFixture());
 for(const mutate of [b=>b.secret='no',b=>b.schemaVersion=2,b=>b.id='resistors',b=>b.version='01.0.0',b=>b.entities[0].code='return 1',b=>b.entities[0].id='__proto__',b=>b.entities[1].status='guessed']){const b=modularFixture();mutate(b);assert.throws(()=>validateBundle(b));}
 const input=modularFixture();input.entities[0].title='<script>text only</script>';validateBundle(input);
 assert.throws(()=>validateEntity(JSON.parse('{"kind":"Topic","__proto__":{}}')),/Unsafe/);
});
test('provenance and topic composition enforce references, page evidence and prerequisite DAGs',()=>{
 for(const mutate of [b=>b.entities[2].editionId=uid(111),b=>b.entities[2].printedPages.end=1,b=>{b.entities[2].printedPages=null;b.entities[2].section=null;},b=>b.entities[3].locatorIds=[],b=>b.entities[6].evidence=[],b=>b.entities[7].topicId=uid(111),b=>b.entities[12].topicRevisions=[ref(111)],b=>b.entities[12].prerequisites=[ref(13)],b=>b.entities[11].activityIds=[uid(21)]]){const b=modularFixture();mutate(b);assert.throws(()=>validateBundle(b));}
 const b=modularFixture();b.entities.push(entity('Topic',30,{title:'Resistance',aliases:[]}),entity('TopicRelation',31,{fromTopicId:uid(5),toTopicId:uid(30),relation:'prerequisite',rationale:'Fixture'}),entity('TopicRelation',32,{fromTopicId:uid(30),toTopicId:uid(5),relation:'prerequisite',rationale:'Fixture'}));assert.throws(()=>validateBundle(b),/cycle/);
 const conflict=modularFixture();conflict.entities.push(entity('EvidenceClaim',40,{...conflict.entities[3],id:uid(40),text:'Conflicting synthetic claim.',state:'disputed',conflictsWith:[ref(4)]}));validateBundle(conflict);assert.equal(conflict.entities.at(-1).state,'disputed');
});
test('immutable repositories preserve versions and defensive copies across private-file export',async()=>{
 const b=modularFixture(),repo=new ContentRepository();repo.importBundle(b);b.entities[0].title='Mutated input';assert.equal(repo.get('SourceWork',uid(1)).title,'Synthetic Electronics');
 const changed=modularFixture();changed.entities[6].text='Changed published content';assert.throws(()=>repo.importBundle(changed),/Immutable/);
 const next=modularFixture();next.version='2.0.0';const tr=next.entities[7];next.entities.push({...tr,version:'2.0.0',supersedes:ref(8)});repo.importBundle(next);assert.ok(repo.get('TopicRevision',uid(8),'1.0.0'));assert.ok(repo.get('TopicRevision',uid(8),'2.0.0'));
 const ports=createDomainRepositories(repo);assert.equal(ports.SearchProvider.searchTopics('resistor tolerance').length,1);assert.equal(ports.EvidenceRepository.get(uid(4),'1.0.0').locatorIds[0],uid(3));
 const folder=await mkdtemp(join(tmpdir(),'eu-private-bundle-'));try{const path=join(folder,'bundle.json');const hash=await exportPrivateBundle(modularFixture(),path);assert.equal(hash,await artifactHash(JSON.parse(repo.exportBundle(uid(99),'1.0.0'))));assert.deepEqual(await readPrivateBundle(path),JSON.parse(repo.exportBundle(uid(99),'1.0.0')));await assert.rejects(exportPrivateBundle(modularFixture(),path),/EEXIST/);
 const rawPath=join(folder,'raw.json');const {writeFile}=await import('node:fs/promises');await writeFile(rawPath,canonicalJSON(modularFixture()));const files=await JsonFileContentRepository.open([rawPath]);assert.equal(files.list('LessonRevision').length,1);
 }finally{await rm(folder,{recursive:true,force:true});}
});
