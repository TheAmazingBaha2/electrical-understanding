// Developer tool: explicit local JSON -> exclusive private learner preview.
// No website upload, network, model call, activation, or public build mutation.
import {readFile,readdir,mkdir,copyFile,writeFile,realpath} from 'node:fs/promises';
import {resolve,relative,join} from 'node:path';
import {createHash} from 'node:crypto';
import {validateStudyBank} from '../../study-bank.js';
export async function privateStudyPreview(input,output,{root=process.cwd()}={}) {
 root=await realpath(root);const source=await realpath(input),out=resolve(output);
 const inside=p=>{const r=relative(root,p);return !r.startsWith('..')&&!r.startsWith('/');};
 if(inside(source)||inside(out))throw Error('Private study input and output must remain outside the public repository');
 const bank=validateStudyBank(JSON.parse(await readFile(source,'utf8')));
 await mkdir(out,{mode:0o700}); // Exclusive: never replace a previous preview/recovery artifact.
 for(const name of await readdir(join(root,'dist'))){if(!/^[A-Za-z0-9._-]+$/.test(name))throw Error('Unexpected public asset path');await copyFile(join(root,'dist',name),join(out,name));}
 await writeFile(join(out,'study-content.js'),'// Private owner-supplied, validated study artifact. Never publish this file.\nexport const studyContent = '+JSON.stringify(bank)+';\n',{mode:0o600});
 let commit=(await readFile(join(root,'.git','HEAD'),'utf8')).trim();
 if(commit.startsWith('ref: ')){const ref=commit.slice(5);try{commit=(await readFile(join(root,'.git',ref),'utf8')).trim();}catch{commit=(await readFile(join(root,'.git','packed-refs'),'utf8')).split('\n').find(line=>line.endsWith(' '+ref))?.split(' ')[0];}}
 if(!/^[a-f0-9]{40}$/.test(commit))throw Error('A concrete source commit is required for the private preview');
 await writeFile(join(out,'build-info.json'),JSON.stringify({site:'Private local study preview',commit,bank:bank.id,revision:bank.revision,cloud:false,sourceIndependentVerification:false},null,2)+'\n');
 const files=[];for(const name of await readdir(out))files.push({name,sha256:createHash('sha256').update(await readFile(join(out,name))).digest('hex')});
 await writeFile(join(out,'SHA256SUMS.json'),JSON.stringify(files,null,2)+'\n',{mode:0o600});
 return {commit,bank:bank.id,lessons:bank.lessons.length,seedQuestions:bank.questions.length,variants:bank.variants.length,challenges:bank.challenges.length,files:files.length,output:out};
}
if(process.argv[1]===new URL(import.meta.url).pathname){if(process.argv.length!==4)throw Error('Usage: node scripts/content/private-study-preview.mjs PRIVATE_BANK NEW_PRIVATE_DIRECTORY');console.log(JSON.stringify(await privateStudyPreview(process.argv[2],process.argv[3]),null,2));}
