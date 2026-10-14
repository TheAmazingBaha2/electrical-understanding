// Prepare a local approved learner artifact; never changes a website or release ref.
import {mkdir,readFile,writeFile} from 'node:fs/promises';import {join,resolve} from 'node:path';import {pathToFileURL} from 'node:url';
import {readPrivateBundle,exportPrivateBundle} from './modular-file-repository.mjs';
import {requirePublication} from '../../modular/publication.js';import {widgetFor} from '../../widget-registry.js';
export async function exportReviewedBundle(bundle,manifest,output,{previous=null}={}){
 const result=await requirePublication(bundle,manifest,{previous,widgetLookup:widgetFor});
 // exportPrivateBundle enforces an exclusive outside-repository artifact path.
 const hash=await exportPrivateBundle(bundle,join(output,'approved.bundle.json'));
 await writeFile(join(output,'publication.json'),JSON.stringify(manifest,null,2)+'\n',{flag:'wx',mode:0o600});
 await writeFile(join(output,'release.json'),JSON.stringify({format:'eu-approved-local-release@1',bundleHash:hash,publicationHash:result.manifestHash,rollback:manifest.rollback,activated:false},null,2)+'\n',{flag:'wx',mode:0o600});return {bundleHash:hash,publicationHash:result.manifestHash,activated:false};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){if(![5,6].includes(process.argv.length))throw Error('Usage: node scripts/content/publish-reviewed-bundle.mjs PRIVATE_BUNDLE PRIVATE_MANIFEST NEW_PRIVATE_OUTPUT [PREVIOUS_BUNDLE]');const bundle=await readPrivateBundle(process.argv[2]),manifest=JSON.parse(await readFile(process.argv[3],'utf8')),previous=process.argv[5]?await readPrivateBundle(process.argv[5]):null,output=resolve(process.argv[4]);await mkdir(output,{mode:0o700});console.log(JSON.stringify(await exportReviewedBundle(bundle,manifest,output,{previous})));}
