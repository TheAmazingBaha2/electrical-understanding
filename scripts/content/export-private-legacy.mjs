// Read-only preservation of ALL current lesson objects and their original modules.
// Not semantic migration, credit mapping, page verification or source scan storage.
import {mkdir,readFile,writeFile,realpath} from 'node:fs/promises';import {join,dirname,resolve,sep} from 'node:path';import {fileURLToPath,pathToFileURL} from 'node:url';import {createHash} from 'node:crypto';
import {buildLegacyInventory,legacyRuntimeInventory} from './legacy-inventory.mjs';
const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
export async function exportPrivateLegacy(output){
 const root=await realpath(fileURLToPath(new URL('../../',import.meta.url))),target=resolve(output),parent=await realpath(dirname(target));if(parent===root||parent.startsWith(root+sep))throw Error('Legacy educational exports must stay outside public repository');
 await mkdir(target,{mode:0o700});const inventory=await buildLegacyInventory(),files=[];
 for(const {path,hash} of inventory.fileHashes){const bytes=await readFile(join(root,path));if(sha(bytes)!==hash)throw Error('Original source artifact changed while preserving');const destination=join(target,'originals',path);await mkdir(dirname(destination),{recursive:true,mode:0o700});await writeFile(destination,bytes,{flag:'wx',mode:0o600});files.push({path:'originals/'+path,sha256:hash,bytes:bytes.length});}
 const runtime=JSON.stringify({format:'eu-legacy-preservation@1',schemaVersion:1,lessons:legacyRuntimeInventory(),inventory,creditTransferred:false},null,2)+'\n';
 await writeFile(join(target,'legacy-full.json'),runtime,{flag:'wx',mode:0o600});files.push({path:'legacy-full.json',sha256:sha(runtime),bytes:Buffer.byteLength(runtime)});
 await writeFile(join(target,'SHA256SUMS.json'),JSON.stringify({format:'eu-private-preservation-manifest@1',files,containsLearnerData:false,containsRawScans:false,semanticMappingsReviewed:0},null,2)+'\n',{flag:'wx',mode:0o600});
 return {totals:inventory.totals,preservedFiles:files.length,semanticMappingsReviewed:0,creditTransferred:false};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){if(process.argv.length!==3)throw Error('Usage: node scripts/content/export-private-legacy.mjs NEW_PRIVATE_OUTPUT');console.log(JSON.stringify(await exportPrivateLegacy(process.argv[2])));}
