// Optional Node host, usable by either Windows-shell prototype. No runtime GitHub.
import {mkdir,realpath,open,rename,unlink,stat,readdir} from 'node:fs/promises';
import {constants} from 'node:fs';
import {resolve,join,sep} from 'node:path';
import {fileURLToPath} from 'node:url';
import {ContentRepository,canonicalJSON,artifactHash} from '../../modular/repositories.js';
import {emptyPrivateDocument,privateScope,privateRecord,validatePrivateDocument,privateHead,applyPrivateCAS,mergePrivateRecovery} from '../../modular/private-documents.js';
export class FilePrivateStorage {
 static async open({root,ownerId,approvedBundles=[]}={}){
  privateScope(ownerId,'learning');if(!root)throw Error('Explicit private host directory required');
  const repoRoot=await realpath(fileURLToPath(new URL('../../',import.meta.url))),target=resolve(root);
  if(target===repoRoot||target.startsWith(repoRoot+sep))throw Error('Learner storage must stay outside the public repository');
  await mkdir(target,{recursive:true,mode:0o700});const actual=await realpath(target);if(actual===repoRoot||actual.startsWith(repoRoot+sep))throw Error('Private storage resolves into public repository');
  if(process.platform!=='win32'&&((await stat(actual)).mode&0o077))throw Error('Private host directory needs owner-only permissions');
  const host=new FilePrivateStorage();Object.assign(host,{root:actual,ownerId,bundles:structuredClone(approvedBundles)});return host;
 }
 key(namespace){return privateScope(this.ownerId,namespace).replace(':','--');}
 path(namespace){return join(this.root,this.key(namespace)+'.json');}
 async loadApprovedContent(){const repo=new ContentRepository();for(const b of this.bundles)repo.importBundle(b);return repo;}
 async document(namespace){let text;try{const f=await open(this.path(namespace),constants.O_RDONLY|(constants.O_NOFOLLOW||0));try{text=await f.readFile('utf8');}finally{await f.close();}}catch(e){if(e.code==='ENOENT')return emptyPrivateDocument(this.ownerId,namespace);throw e;}
  return validatePrivateDocument(JSON.parse(text),this.ownerId,namespace);
 }
 async readPrivateDocument(namespace){return privateHead(await this.document(namespace));}
 async transact(namespace,change){
  const key=this.key(namespace),lock=join(this.root,key+'.lock');let handle;
  try{handle=await open(lock,'wx',0o600);}catch(e){if(e.code==='EEXIST')throw Error('Private storage is busy or interrupted; inspect the lock and export backups before recovery');throw e;}
  let temporary;try{
   const before=await this.document(namespace),{document,result}=await change(before);await validatePrivateDocument(document,this.ownerId,namespace);
   if(before.head){const backup=join(this.root,key+'.backup-'+await artifactHash(before)+'.json'),text=canonicalJSON(before)+'\n';let f;try{f=await open(backup,'wx',0o600);await f.writeFile(text);await f.sync();}catch(e){if(e.code!=='EEXIST')throw e;const prior=await open(backup,constants.O_RDONLY|(constants.O_NOFOLLOW||0));try{if(await prior.readFile('utf8')!==text)throw Error('Existing private backup is corrupt; primary retained for explicit recovery');}finally{await prior.close();}}finally{await f?.close();}}
   temporary=join(this.root,key+'.pending-'+globalThis.crypto.randomUUID()+'.json');const file=await open(temporary,'wx',0o600);try{await file.writeFile(canonicalJSON(document)+'\n');await file.sync();}finally{await file.close();}
   await rename(temporary,this.path(namespace));temporary=null;
   // Linux fsyncs the directory; Windows atomic replacement is retained, while a
   // native durable host must document its filesystem power-loss guarantees.
   if(process.platform!=='win32'){const directory=await open(this.root,'r');try{await directory.sync();}finally{await directory.close();}}
   return result;
  }finally{await handle.close();await unlink(lock);/* interrupted pending files are retained, never auto-applied */}
 }
 async compareAndSwap(namespace,expectedRevision,value){const candidate=await privateRecord(this.ownerId,namespace,expectedRevision,value);return this.transact(namespace,document=>applyPrivateCAS(document,candidate,expectedRevision));}
 async exportRecovery(namespace){return this.document(namespace);}
 async importRecovery(namespace,recovery){return this.transact(namespace,async current=>{const m=await mergePrivateRecovery(current,recovery);return {document:m.document,result:{heads:m.heads,conflicted:m.conflicted}};});}
 async restoreRevision(namespace,revision,expectedRevision){const r=(await this.document(namespace)).records.find(r=>r.revision===revision);if(!r)throw Error('Unknown recovery revision');return this.compareAndSwap(namespace,expectedRevision,r.value);}
 async listRecoveryFiles(namespace){return (await readdir(this.root)).filter(n=>n.startsWith(this.key(namespace)+'.backup-')||n.startsWith(this.key(namespace)+'.pending-')).sort();}
}
