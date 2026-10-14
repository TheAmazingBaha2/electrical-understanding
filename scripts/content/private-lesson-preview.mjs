import {mkdir,copyFile,readdir,writeFile,realpath} from 'node:fs/promises';
import {join,resolve,sep} from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {readPrivateBundle} from './modular-file-repository.mjs';
import {canonicalJSON,orderedBundle} from '../../modular/repositories.js';
export async function writePrivatePreview(bundle,output){
 const root=fileURLToPath(new URL('../../',import.meta.url)),target=resolve(output),parent=await realpath(join(target,'..'));
 if(parent===await realpath(root)||parent.startsWith((await realpath(root))+sep))throw Error('Private preview must stay outside repository');
 await mkdir(target,{mode:0o700}); // Exclusive directory: no overwrite on interrupted export.
 for(const file of await readdir(join(root,'dist')))await copyFile(join(root,'dist',file),join(target,file));
 await mkdir(join(target,'modular'));for(const file of (await readdir(join(root,'modular'))).filter(f=>f.endsWith('.js')))await copyFile(join(root,'modular',file),join(target,'modular',file));
 await writeFile(join(target,'bundle.json'),canonicalJSON(orderedBundle(bundle))+'\n',{mode:0o600});
 await writeFile(join(target,'index.html'),'<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Private modular lesson review</title><link rel="stylesheet" href="styles.css"><style>body{margin:0}#main{margin:0;padding:12px;max-width:none}.modular-preview-tools{display:flex;flex-wrap:wrap;gap:12px}.modular-preview-tools label{display:grid;gap:6px}.modular-preview-tools select{min-height:44px;max-width:100%}.modular-progress{max-width:180px;margin:16px auto;text-align:center}.modular-progress svg{width:120px;max-width:100%}.panel{overflow-wrap:anywhere}.lesson-tabs{max-width:100%;overflow-x:auto}h1{font-size:clamp(1.4rem,4vw,2rem)}.modular-preview-tools{position:relative;z-index:1}</style></head><body><main id="main"><p>Loading private draft…</p></main><script type="module" src="preview-entry.js"></script></body></html>\n');
 await writeFile(join(target,'preview-entry.js'),"import {mountPrivatePreview} from './modular/lesson-preview.js';\nconst root=document.querySelector('#main');try{const response=await fetch('./bundle.json');if(!response.ok)throw Error('Local bundle unavailable');await mountPrivatePreview(root,await response.json());}catch(e){root.textContent=e.message;}\n");
 await writeFile(join(target,'README.txt'),'Private local review only. Serve this folder on loopback, for example: python -m http.server 8081 --bind 127.0.0.1 --directory THIS_FOLDER\nOpen http://127.0.0.1:8081/. No website/AI/backend/repository connection is required. Draft grading is disabled. Close the server after review. This is not an installer or APK.\n');
 return target;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){if(process.argv.length!==4)throw Error('Usage: node scripts/content/private-lesson-preview.mjs /private/bundle.json /private/new-preview-directory');console.log(await writePrivatePreview(await readPrivateBundle(process.argv[2]),process.argv[3]));}
