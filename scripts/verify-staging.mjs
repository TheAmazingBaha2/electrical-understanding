// Read-only verification of the authorized staging URL. Never deploys or invokes APIs.
import {readFile,readdir,mkdir,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {requireCI} from './require-ci.mjs';
const STAGING='https://eu-v2-staging.vanguardcorbett.workers.dev';
export async function verifyStaging(sha,assets,{fetcher=fetch,wait=ms=>new Promise(r=>setTimeout(r,ms)),tries=18}={}){
 if(!/^[a-f0-9]{40}$/.test(sha))throw Error('Exact staging SHA required');
 let info;
 for(let i=0;i<tries;i++){
  const r=await fetcher(STAGING+'/build-info.json?verify='+sha,{headers:{'Cache-Control':'no-cache'}});
  if(r.ok){const data=await r.json();if(data.commit===sha&&data.branch==='draft/v2-dmm-companion'&&data.worker==='eu-v2-staging'){info=data;break;}}
  if(i<tries-1)await wait(10000);
 }
 if(!info)throw Error('Staging did not serve the expected commit; deployment remains unverified');
 const failures=[];for(let start=0;start<assets.length;start+=6){
  const results=await Promise.allSettled(assets.slice(start,start+6).map(async a=>{
   if(!/^[A-Za-z0-9._-]+$/.test(a.name)||a.name==='build-info.json')throw Error('Invalid static asset path');
   const r=await fetcher(STAGING+'/'+a.name+'?verify='+sha,{headers:{'Cache-Control':'no-cache'}});if(!r.ok)throw Error(a.name+' HTTP '+r.status);
   const actual=createHash('sha256').update(new Uint8Array(await r.arrayBuffer())).digest('hex');if(actual!==a.hash)throw Error('Served asset differs: '+a.name);
  }));for(const r of results)if(r.status==='rejected')failures.push(r.reason.message);
 }
 if(failures.length)throw Error(failures.join('; '));
 return {schemaVersion:1,verifiedAt:new Date().toISOString(),commit:sha,site:STAGING,assetCount:assets.length,buildInfo:info,status:'verified-static-assets'};
}
if(process.argv[1]===fileURLToPath(import.meta.url)){
 const sha=process.argv[2];await requireCI(sha);
 const assets=[];for(const name of (await readdir('dist')).filter(n=>n!=='build-info.json'))assets.push({name,hash:createHash('sha256').update(await readFile('dist/'+name)).digest('hex')});
 const report=await verifyStaging(sha,assets);await mkdir('test-artifacts',{recursive:true});await writeFile('test-artifacts/staging-readback.json',JSON.stringify(report,null,2)+'\n');console.log('PASS: staging build-info and '+report.assetCount+' served assets match '+sha);
}
