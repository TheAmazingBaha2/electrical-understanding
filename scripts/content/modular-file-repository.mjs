// Node host adapter. Private native storage can implement the same domain ports later.
import {readFile,writeFile,realpath} from 'node:fs/promises';
import {dirname,resolve,sep} from 'node:path';
import {fileURLToPath} from 'node:url';
import {ContentRepository,canonicalJSON,artifactHash,orderedBundle} from '../../modular/repositories.js';

export class JsonFileContentRepository extends ContentRepository {
 static async open(paths){const repo=new JsonFileContentRepository();for(const path of paths)repo.importBundle(JSON.parse(await readFile(path,'utf8')));return repo;}
}
export async function exportPrivateBundle(bundle,path){
 const repoRoot=await realpath(fileURLToPath(new URL('../../',import.meta.url))),parent=await realpath(dirname(resolve(path)));
 if(parent===repoRoot||parent.startsWith(repoRoot+sep))throw Error('Private bundles must stay outside the repository and public build tree');
 const approved=orderedBundle(bundle),hash=await artifactHash(approved);
 // Exclusive create prevents accidental replacement of an owner-supplied artifact.
 await writeFile(path,canonicalJSON({format:'eu-modular-bundle',schemaVersion:3,hash,bundle:approved})+'\n',{flag:'wx',mode:0o600});
 return hash;
}
export async function readPrivateBundle(path){
 const envelope=JSON.parse(await readFile(path,'utf8'));
 if(Object.keys(envelope).sort().join(',')!=='bundle,format,hash,schemaVersion'||envelope.format!=='eu-modular-bundle'||envelope.schemaVersion!==3)throw Error('Unsupported bundle envelope; original retained');
 const bundle=orderedBundle(envelope.bundle);if(await artifactHash(bundle)!==envelope.hash)throw Error('Artifact hash mismatch; original retained');return bundle;
}
