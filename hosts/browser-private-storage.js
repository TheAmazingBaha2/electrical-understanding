// Browser/private-webview host adapter. No production-origin migration or network.
import {ContentRepository} from '../modular/repositories.js';
import {emptyPrivateDocument,privateScope,privateRecord,validatePrivateDocument,privateHead,applyPrivateCAS,samePrivateDocument,mergePrivateRecovery} from '../modular/private-documents.js';
export class IndexedDBPrivateStorage {
 constructor({ownerId,indexedDB=globalThis.indexedDB,databaseName='eu_modular_private_v1',approvedBundles=[]}={}){
  privateScope(ownerId,'learning');if(!indexedDB)throw Error('Private durable storage unavailable; export rather than discard');this.ownerId=ownerId;this.databaseName=databaseName;this.indexedDB=indexedDB;this.bundles=structuredClone(approvedBundles);
 }
 async open(){if(!this.database)this.database=new Promise((resolve,reject)=>{const request=this.indexedDB.open(this.databaseName,1);request.onupgradeneeded=()=>request.result.createObjectStore('documents');request.onsuccess=()=>{const db=request.result;db.onversionchange=()=>db.close();resolve(db);};request.onerror=()=>reject(request.error);request.onblocked=()=>reject(Error('Private store upgrade blocked; close other private previews'));});return this.database;}
 async loadApprovedContent(){const repo=new ContentRepository();for(const bundle of this.bundles)repo.importBundle(bundle);return repo;}
 async document(namespace){const key=privateScope(this.ownerId,namespace),db=await this.open(),raw=await new Promise((resolve,reject)=>{const tx=db.transaction('documents','readonly'),r=tx.objectStore('documents').get(key);r.onsuccess=()=>resolve(r.result);tx.onerror=()=>reject(tx.error);});return validatePrivateDocument(raw||emptyPrivateDocument(this.ownerId,namespace),this.ownerId,namespace);}
 async readPrivateDocument(namespace){return privateHead(await this.document(namespace));}
 async transact(namespace,change){
  const key=privateScope(this.ownerId,namespace),db=await this.open();
  for(let retry=0;retry<8;retry++){
   const before=await this.document(namespace),{document,result}=await change(before);await validatePrivateDocument(document,this.ownerId,namespace);
   const applied=await new Promise((resolve,reject)=>{const tx=db.transaction('documents','readwrite'),store=tx.objectStore('documents'),r=store.get(key);let matches=false;
    r.onsuccess=()=>{matches=samePrivateDocument(r.result||emptyPrivateDocument(this.ownerId,namespace),before);if(matches)store.put(document,key);};
    tx.oncomplete=()=>resolve(matches);tx.onabort=()=>reject(tx.error||Error('Private transaction aborted; previous data retained'));tx.onerror=()=>reject(tx.error);
   });if(applied)return result;
  }throw Error('Concurrent private updates remain busy; no record overwritten');
 }
 async compareAndSwap(namespace,expectedRevision,value){const candidate=await privateRecord(this.ownerId,namespace,expectedRevision,value);return this.transact(namespace,document=>applyPrivateCAS(document,candidate,expectedRevision));}
 async exportRecovery(namespace){return this.document(namespace);}
 async importRecovery(namespace,recovery){return this.transact(namespace,async current=>{const merge=await mergePrivateRecovery(current,recovery);return {document:merge.document,result:{heads:merge.heads,conflicted:merge.conflicted}};});}
 async restoreRevision(namespace,revision,expectedRevision){const record=(await this.document(namespace)).records.find(r=>r.revision===revision);if(!record)throw Error('Unknown recovery revision');return this.compareAndSwap(namespace,expectedRevision,record.value);}
 async close(){if(this.database)(await this.database).close();this.database=null;}
}
