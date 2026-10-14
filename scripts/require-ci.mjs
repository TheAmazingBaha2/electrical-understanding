// Workers Builds must wait for this exact development commit's complete CI run.
// Public reads work without credentials; CI may supply its ephemeral read-only token.
// Authentication stays server-side; API/rate-limit errors still fail closed.
export function verifiedRun(payload,sha){
 const runs=(payload?.workflow_runs||[]).filter(r=>r.head_sha===sha&&r.head_branch==='draft/v2-dmm-companion'&&r.path==='.github/workflows/v2-checks.yml'&&r.event==='push');
 const latest=runs.sort((a,b)=>b.id-a.id)[0];
 return latest?.status==='completed'&&latest?.conclusion==='success';
}
export async function requireCI(sha,{fetcher=fetch,wait=ms=>new Promise(r=>setTimeout(r,ms)),tries=128,token=process.env.GITHUB_TOKEN}={}){
 if(!/^[a-f0-9]{40}$/.test(sha))throw Error('A concrete commit SHA is required for staging promotion');
 for(let i=0;i<tries;i++){
  const r=await fetcher('https://api.github.com/repos/TheAmazingBaha2/electrical-understanding/actions/runs?head_sha='+sha+'&per_page=20',{headers:{Accept:'application/vnd.github+json',...(token?{Authorization:'Bearer '+token}:{})}});
  if(!r.ok)throw Error('Cannot verify staging quality gate: GitHub HTTP '+r.status);
  const payload=await r.json();
  if(verifiedRun(payload,sha))return;
  if(i<tries-1)await wait(15000);
 }
 throw Error('Required CI has not passed for '+sha+'. Keep the currently deployed staging release.');
}
