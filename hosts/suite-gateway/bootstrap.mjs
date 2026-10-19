const kinds=['study-bank','review-calculations','legacy-lessons','registry','coding-text','electronics-text'];
const keys=(v,names)=>v&&typeof v==='object'&&!Array.isArray(v)&&Object.keys(v).sort().join(',')===names.split(',').sort().join(',');
const id=v=>typeof v==='string'&&/^[A-Za-z0-9_-]{1,200}$/.test(v);
export function validateBootstrap(value,owner){
 if(!keys(value,'schema,config,library')||value.schema!=='suite.hosted-bootstrap@1')throw Error('Invalid private bootstrap');
 const c=value.config,l=c?.locator;
 if(!keys(c,'schema,clientId,origin,expectedEmail,locator')||c.schema!=='suite.google-web@1'||c.origin!==owner.origin||c.clientId!==owner.client||c.expectedEmail!==owner.email||!keys(l,'schema,kind,project,ownerSubject,workspace,folderId,sentinelId,sentinelSha256')||l.schema!=='suite.drive-locator@1'||l.kind!=='personal'||l.ownerSubject!==owner.sub||!id(l.project)||!id(l.workspace)||!l.workspace.startsWith('personal-')||!id(l.folderId)||!id(l.sentinelId)||l.folderId===l.sentinelId||!/^[a-f0-9]{64}$/.test(l.sentinelSha256))throw Error('Private bootstrap owner or workspace changed');
 if(!Array.isArray(value.library)||value.library.length!==kinds.length)throw Error('Incomplete private bootstrap library');
 const found=new Set(),ids=new Set();for(const f of value.library){
  if(!keys(f,'kind,sha256,bytes,fileId')||!kinds.includes(f.kind)||found.has(f.kind)||!id(f.fileId)||ids.has(f.fileId)||!/^[a-f0-9]{64}$/.test(f.sha256)||!Number.isSafeInteger(f.bytes)||f.bytes<1||f.bytes>1500000)throw Error('Invalid private bootstrap file');found.add(f.kind);ids.add(f.fileId);
 }
 return structuredClone(value);
}
