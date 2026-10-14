// Bounded CI housekeeping for the authorized development branch only. Never
// marks a check passed, skips current tests, touches production or prints tokens.
import {pathToFileURL} from 'node:url';
export function obsoleteValidationRuns(runs,{repository,branch,currentRun,currentSha}={}){
 if(repository!=='TheAmazingBaha2/electrical-understanding'||branch!=='draft/v2-dmm-companion'||!/^\d+$/.test(String(currentRun))||!/^[a-f0-9]{40}$/.test(currentSha))throw Error('Obsolete-run cleanup requires the exact V3 development context');
 return runs.filter(r=>r.head_repository?.full_name===repository&&r.head_branch===branch&&r.event==='push'&&r.name==='Verify Electrical Understanding v2'&&Number(r.id)<Number(currentRun)&&r.head_sha!==currentSha&&['queued','in_progress'].includes(r.status)).map(r=>r.id);
}
export async function cancelObsolete({environment=process.env,request=fetch}={}){
 const repository=environment.GITHUB_REPOSITORY,branch=environment.GITHUB_REF_NAME,currentRun=environment.GITHUB_RUN_ID,currentSha=environment.GITHUB_SHA;
 obsoleteValidationRuns([],{repository,branch,currentRun,currentSha});
 if(environment.GITHUB_EVENT_NAME!=='push'||!environment.GITHUB_TOKEN)throw Error('Push-only ephemeral CI authorization required');
 const headers={Authorization:'Bearer '+environment.GITHUB_TOKEN,Accept:'application/vnd.github+json','X-GitHub-Api-Version':'2022-11-28'},base='https://api.github.com/repos/'+repository;
 const response=await request(base+'/actions/workflows/v2-checks.yml/runs?branch='+encodeURIComponent(branch)+'&per_page=30',{headers});if(!response.ok)throw Error('Cannot inspect obsolete validations: HTTP '+response.status);
 const ids=obsoleteValidationRuns((await response.json()).workflow_runs,{repository,branch,currentRun,currentSha});
 for(const id of ids){const r=await request(base+'/actions/runs/'+id+'/cancel',{method:'POST',headers});if(![202,409].includes(r.status))throw Error('Obsolete validation cancellation failed: HTTP '+r.status);}
 return {cancelledObsoleteRuns:ids};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href)console.log(JSON.stringify(await cancelObsolete()));
