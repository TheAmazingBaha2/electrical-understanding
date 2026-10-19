// Exact, reviewed file classes. A new asset class requires a release review.
const rootJson=new Set(['build-info.json','coding-content.json','interpreter-policy.json','library-status.json','presentation-status.json','registry-status.json']);
const electronics=new Map([['body.html','text/html'],['electronics.js','text/javascript'],['recovery.js','text/javascript'],['styles.css','text/css'],['icon.svg','image/svg+xml'],['content-status.json','application/json'],['study-content.json','application/json']]);
export const privateKinds=['study-bank','review-calculations','legacy-lessons','registry','coding-text','electronics-text'];
const privateFiles=new Set(privateKinds.map(kind=>'private/'+kind+'.json'));
export function reviewedAssetType(file){
  if(typeof file!=='string'||!file||file.includes('\\')||file.includes('%')||file.includes('?')||file.split('/').some(p=>!p||p==='.'||p==='..'))throw Error('Unsafe asset path');
  if(privateFiles.has(file))return null;
  if(file==='index.html')return 'text/html';
  if(rootJson.has(file))return 'application/json';
  if(file.startsWith('electronics/')&&electronics.has(file.slice(12)))return electronics.get(file.slice(12));
  const match=/^assets\/[A-Za-z0-9_.-]+\.(js|css|ttf)$/.exec(file);
  if(match)return {js:'text/javascript',css:'text/css',ttf:'font/ttf'}[match[1]];
  throw Error('Unreviewed asset class: '+file);
}
export function reviewAssetInventory(entries){
  if(!Array.isArray(entries)||entries.length<1||entries.length>1000)throw Error('Invalid asset inventory');
  const seen=new Set(),assets=[],excluded=[];
  for(const row of entries){
    if(!row||typeof row.path!=='string'||seen.has(row.path.toLowerCase())||!/^[a-f0-9]{64}$/.test(row.sha256)||!Number.isSafeInteger(row.bytes)||row.bytes<1||row.bytes>25*1024*1024)throw Error('Invalid or duplicate asset');
    seen.add(row.path.toLowerCase());const type=reviewedAssetType(row.path);
    if(type===null)excluded.push(row);else assets.push({...row,type});
  }
  for(const required of ['index.html',...rootJson,...Array.from(electronics.keys(),name=>'electronics/'+name),...privateFiles])if(!seen.has(required))throw Error('Missing reviewed file: '+required);
  return {assets,excluded};
}
