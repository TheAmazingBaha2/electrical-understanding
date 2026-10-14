import test from 'node:test';import assert from 'node:assert/strict';import {readdir,readFile} from 'node:fs/promises';import {resolve,dirname,sep} from 'node:path';import {fileURLToPath} from 'node:url';
test('the complete modular domain import graph has no browser, filesystem, database, native shell or network dependency',async()=>{
 const root=fileURLToPath(new URL('..',import.meta.url)),queue=(await readdir(resolve(root,'modular'))).filter(f=>f.endsWith('.js')).map(f=>resolve(root,'modular',f)),seen=new Set(),electrical=new Set(['data-contract.js','circuit-model.js','shared-multimeter.js','resistor-color.js'].map(f=>resolve(root,f)));
 while(queue.length){const file=queue.shift();if(seen.has(file))continue;seen.add(file);assert.ok(file.startsWith(resolve(root,'modular')+sep)||electrical.has(file),'Unexpected domain dependency: '+file);
  const source=await readFile(file,'utf8');assert.doesNotMatch(source,/\b(?:window|localStorage|indexedDB|HTMLElement|XMLHttpRequest)\b|\bdocument\.(?:querySelector|createElement)|\bfetch\s*\(|\bnode:/,'Host API leaked into '+file);
  for(const m of source.matchAll(/\b(?:import|export)\s+(?:[^'";]*?\s+from\s*)?["']([^"']+)["']/g)){assert.ok(m[1].startsWith('.'),'External runtime dependency: '+m[1]);queue.push(resolve(dirname(file),m[1]));}
 }assert.ok(seen.has(resolve(root,'modular/private-learning.js')));assert.ok(seen.has(resolve(root,'shared-multimeter.js')));
});
