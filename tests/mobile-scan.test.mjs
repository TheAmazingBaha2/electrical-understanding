import test from 'node:test';
import assert from 'node:assert/strict';
import {prepareScanFile} from '../scan-inbox.js';
test('reads phone provider bytes immediately, accepts missing MIME, and normalizes by content',async()=>{
 let reads=0;
 const bytes=new TextEncoder().encode('%PDF-test').buffer;
 const pending=prepareScanFile({size:bytes.byteLength,type:'',arrayBuffer(){reads++;return Promise.resolve(bytes)}});
 assert.equal(reads,1);
 const result=await pending;assert.equal(result.type,'application/pdf');assert.equal(result.extension,'pdf');assert.equal(result.bytes,bytes);
});
test('rejects unreadable, changed, oversize and unsupported scans before networking',async()=>{
 await assert.rejects(prepareScanFile({size:9,arrayBuffer:async()=>{throw Error('content URI expired')}}),/Downloads/);
 await assert.rejects(prepareScanFile({size:9,arrayBuffer:async()=>new ArrayBuffer(3)}),/changed/);
 await assert.rejects(prepareScanFile({size:5242881}),/5 MB/);
 await assert.rejects(prepareScanFile({size:3,arrayBuffer:async()=>new ArrayBuffer(3)}),/valid PDF/);
});
