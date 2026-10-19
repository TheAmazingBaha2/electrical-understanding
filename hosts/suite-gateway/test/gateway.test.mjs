import {test} from 'node:test';
import assert from 'node:assert/strict';
import {generateKeyPair,exportJWK,createLocalJWKSet,SignJWT,base64url,decodeJwt} from 'jose';
import {createGateway} from '../gateway.mjs';

const origin='https://suite-fixture.example.workers.dev';
const pair=await generateKeyPair('RS256');
const jwk={...await exportJWK(pair.publicKey),kid:'fixture',alg:'RS256',use:'sig'};
const otherPair=await generateKeyPair('RS256');
function fixture() {
  let time=1900000000,calls=0,lastAssetRequest;
  const env={SUITE_ORIGIN:origin,GOOGLE_CLIENT_ID:'1234567890-fixture.apps.googleusercontent.com',OWNER_SUB:'123456789012345678901',OWNER_EMAIL:'fixture@gmail.com',
    SESSION_KEY:base64url.encode(crypto.getRandomValues(new Uint8Array(32))),ASSETS:{fetch:async request=>{calls++;lastAssetRequest=request;return new Response('PRIVATE ASSET',{headers:{'Cache-Control':'public,max-age=86400','Set-Cookie':'bad=1','Location':'https://example.com'}});}}};
  const app=createGateway({assets:{'/':'text/html','/index.html':'text/html','/assets/app.js':'text/javascript','/assets/codicon.ttf':'font/ttf','/build-info.json':'application/json'},keys:createLocalJWKSet({keys:[jwk]}),now:()=>time*1000});
  const request=(path,options={})=>app.fetch(new Request(origin+path,options),env);
  async function start(){const response=await request('/auth/start');assert.equal(response.status,200);const value=response.headers.getSetCookie()[0].split(';')[0];return {cookie:value,nonce:decodeJwt(value.slice(value.indexOf('=')+1)).nonce,html:await response.text()};}
  async function token(nonce,patch={},key=pair.privateKey,header={}){return new SignJWT({sub:env.OWNER_SUB,email:env.OWNER_EMAIL,email_verified:true,nonce,iss:'https://accounts.google.com',aud:env.GOOGLE_CLIENT_ID,iat:time,exp:time+3600,...patch}).setProtectedHeader({alg:'RS256',kid:'fixture',...header}).sign(key);}
  const complete=(cookie,credential,headers={})=>request('/auth/complete',{method:'POST',headers:{Cookie:cookie,Origin:origin,'Sec-Fetch-Site':'same-origin','Content-Type':'application/json',...headers},body:JSON.stringify({credential})});
  async function login(){const begin=await start(),response=await complete(begin.cookie,await token(begin.nonce));assert.equal(response.status,200);return response.headers.getSetCookie().find(c=>c.startsWith('__Host-suite-session=')).split(';')[0];}
  return {env,app,request,start,token,complete,login,get calls(){return calls;},get lastAssetRequest(){return lastAssetRequest;},get time(){return time;},advance:seconds=>time+=seconds};
}
test('signed-out requests never reach assets, including direct and alternate paths',async()=>{
  const f=fixture();for(const path of ['/','/index.html','/assets/app.js','/private/study-bank.json','/private/registry.json','/library-status.json','/auth/session','/missing','/assets/app.js?token=x','/%70rivate/study-bank.json','//assets/app.js']){
    const r=await f.request(path);assert.ok([401,404].includes(r.status),path);assert.doesNotMatch(await r.text(),/PRIVATE ASSET/);assert.match(r.headers.get('Cache-Control'),/no-store/);
  }assert.equal(f.calls,0);
  const root=await f.request('/',{headers:{Accept:'text/html'}});assert.equal(root.status,303);assert.equal(root.headers.get('Location'),'/auth/start');
});
test('Google popup page is data-free, nonce-bound and protected by CSP',async()=>{
  const f=fixture(),start=await f.start();assert.doesNotMatch(start.html,/fixture@gmail|123456789012345678901|PRIVATE ASSET|<script[^>]+onload=/);
  assert.match(start.html,new RegExp(start.nonce));assert.match(start.html,/auto_select:false/);
  const r=await f.request('/auth/start');assert.match(r.headers.get('Set-Cookie'),/Secure; HttpOnly; SameSite=Lax/);assert.match(r.headers.get('Content-Security-Policy'),/frame-ancestors 'none'/);assert.equal(f.calls,0);
});
test('editor icon fonts require the same signed session as other assets',async()=>{
  const f=fixture();assert.equal((await f.request('/assets/codicon.ttf')).status,401);assert.equal(f.calls,0);
  const cookie=await f.login(),r=await f.request('/assets/codicon.ttf',{headers:{Cookie:cookie}});
  assert.equal(r.status,200);assert.equal(r.headers.get('Content-Type'),'font/ttf');assert.match(r.headers.get('Cache-Control'),/no-store/);
  assert.equal((await f.request('/assets/unknown.ttf',{headers:{Cookie:cookie}})).status,404);
});
test('signed owner can read only exact assets; binding gets no credentials or range',async()=>{
  const f=fixture(),cookie=await f.login();
  const r=await f.request('/assets/app.js',{headers:{Cookie:cookie,Authorization:'Bearer secret',Range:'bytes=0-3','If-None-Match':'cached','X-Forwarded-Host':'other'}});
  assert.equal(r.status,200);assert.equal(await r.text(),'PRIVATE ASSET');assert.equal(f.calls,1);assert.equal([...f.lastAssetRequest.headers].length,0);
  assert.match(r.headers.get('Cache-Control'),/no-store/);assert.equal(r.headers.get('Set-Cookie'),null);assert.equal(r.headers.get('Location'),null);
  assert.match(r.headers.get('Content-Security-Policy'),/frame-ancestors 'none'/);assert.match(r.headers.get('Content-Security-Policy'),/object-src 'none'/);assert.doesNotMatch(r.headers.get('Content-Security-Policy'),/script-src[^;]*'unsafe-inline'/);
  for(const path of ['/private/study-bank.json','/private/registry.json','/unknown','/assets/app.js.map','/auth/unknown','/index.html/anything'])assert.equal((await f.request(path,{headers:{Cookie:cookie}})).status,404);
  assert.equal(f.calls,1);assert.equal((await (await f.request('/auth/session',{headers:{Cookie:cookie}})).json()).authenticated,true);
  assert.equal((await f.request('/?recovery=1',{headers:{Cookie:cookie}})).status,200);
  for(const path of ['/?recovery=2','/?recovery=1&token=anything','/index.html?recovery=1'])assert.equal((await f.request(path,{headers:{Cookie:cookie}})).status,404);
  const head=await f.request('/assets/app.js',{method:'HEAD',headers:{Cookie:cookie}});assert.equal(head.status,200);assert.equal(await head.text(),'');
});
test('wrong account, nonce, audience, authorized party and identity fields fail closed',async()=>{
  const f=fixture();for(const patch of [{sub:'999999999999999999999'},{email:'other@gmail.com'},{email_verified:false},{email_verified:'true'},{nonce:'other'},
    {aud:'1234567890-other.apps.googleusercontent.com'},{aud:[f.env.GOOGLE_CLIENT_ID,'another']},{azp:'another'},{iss:'https://attacker.invalid'},{iat:f.time+1},{exp:f.time-1},{iat:f.time-301},{sub:undefined},{nonce:undefined}]){
    const begin=await f.start(),r=await f.complete(begin.cookie,await f.token(begin.nonce,patch));assert.equal(r.status,401,JSON.stringify(patch));assert.doesNotMatch(r.headers.get('Set-Cookie')||'',/__Host-suite-session/);
  }assert.equal(f.calls,0);
});
test('forged, unsigned and unexpected-algorithm credentials fail cryptographic verification',async()=>{
  const f=fixture(),begin=await f.start();
  const forged=await f.token(begin.nonce,{},otherPair.privateKey);
  const valid=await f.token(begin.nonce),pieces=valid.split('.');pieces[1]=base64url.encode(JSON.stringify({...decodeJwt(valid),sub:'999999999999999999999'}));
  const hs=await new SignJWT({...decodeJwt(valid)}).setProtectedHeader({alg:'HS256',kid:'fixture'}).sign(base64url.decode(f.env.SESSION_KEY));
  for(const value of [forged,pieces.join('.'),`${base64url.encode('{"alg":"none"}')}.${valid.split('.')[1]}.`,hs,'malformed'])assert.equal((await f.complete(begin.cookie,value)).status,401);
  assert.equal(f.calls,0);
});
test('expired, duplicate, changed and rotated cookies cannot authorize asset reads',async()=>{
  const f=fixture(),cookie=await f.login();f.advance(900);assert.equal((await f.request('/assets/app.js',{headers:{Cookie:cookie}})).status,401);
  const fresh=await f.login();for(const value of [fresh+'; '+fresh,fresh.slice(0,-8)+'changed',cookie])assert.equal((await f.request('/assets/app.js',{headers:{Cookie:value}})).status,401);
  const nonce=await f.start();assert.equal((await f.request('/assets/app.js',{headers:{Cookie:nonce.cookie.replace('__Host-suite-login=','__Host-suite-session=')}})).status,401);
  f.env.SESSION_KEY=base64url.encode(crypto.getRandomValues(new Uint8Array(32)));assert.equal((await f.request('/assets/app.js',{headers:{Cookie:fresh}})).status,401);assert.equal(f.calls,0);
});
test('login cookie expiration, cookie substitution and missing cookies fail',async()=>{
  const f=fixture(),begin=await f.start();f.advance(300);assert.equal((await f.complete(begin.cookie,await f.token(begin.nonce))).status,401);
  const next=await f.start();for(const value of ['',begin.cookie,next.cookie+'; '+next.cookie,next.cookie.slice(0,-8)+'changed'])assert.equal((await f.complete(value,await f.token(next.nonce))).status,401);
});
test('CSRF, CORS, cross-site reads and unsafe methods are denied',async()=>{
  const f=fixture(),begin=await f.start(),token=await f.token(begin.nonce);
  for(const headers of [{Origin:'https://attacker.invalid'},{Origin:''},{'Sec-Fetch-Site':'cross-site'},{'Sec-Fetch-Site':''},{'Content-Type':'text/plain'},{'Content-Encoding':'gzip'}])assert.equal((await f.complete(begin.cookie,token,headers)).status,401);
  assert.equal((await f.request('/auth/complete',{method:'OPTIONS'})).status,405);
  assert.equal((await f.request('/auth/start',{method:'POST'})).status,405);
  assert.equal((await f.request('/auth/logout',{method:'POST',headers:{Origin:'https://attacker.invalid','Sec-Fetch-Site':'cross-site'}})).status,403);
  const cookie=await f.login();assert.equal((await f.request('/assets/app.js',{headers:{Cookie:cookie,'Sec-Fetch-Site':'cross-site'}})).status,403);
  assert.equal((await f.request('/assets/app.js',{method:'POST',headers:{Cookie:cookie}})).status,405);assert.equal(f.calls,0);
});
test('alternate worker hosts, insecure origins and query aliases do not authorize',async()=>{
  const f=fixture(),cookie=await f.login();for(const other of ['https://version-suite-fixture.example.workers.dev','https://suite-fixture.other.workers.dev','http://suite-fixture.example.workers.dev']){
    const r=await f.app.fetch(new Request(other+'/assets/app.js',{headers:{Cookie:cookie}}),f.env);assert.equal(r.status,403);
  }assert.equal((await f.request('/assets/app.js?cache=1',{headers:{Cookie:cookie}})).status,404);assert.equal(f.calls,0);
});
test('session ends no later than the Google credential and logout clears both cookies',async()=>{
  const f=fixture(),begin=await f.start(),r=await f.complete(begin.cookie,await f.token(begin.nonce,{exp:f.time+60}));
  const set=r.headers.getSetCookie().find(x=>x.startsWith('__Host-suite-session='));assert.match(set,/Max-Age=60;/);const cookie=set.split(';')[0];
  const out=await f.request('/auth/logout',{method:'POST',headers:{Origin:origin,'Sec-Fetch-Site':'same-origin',Cookie:cookie}});assert.equal(out.status,200);assert.equal(out.headers.getSetCookie().length,2);for(const c of out.headers.getSetCookie())assert.match(c,/Max-Age=0;/);
  f.advance(60);assert.equal((await f.request('/assets/app.js',{headers:{Cookie:cookie}})).status,401);
});
test('unavailable keys or binding, redirects, missing config and upstream errors fail closed',async()=>{
  const f=fixture(),cookie=await f.login();
  for(const status of [301,302,304,404,429,500]){f.env.ASSETS.fetch=async()=>new Response(null,{status,headers:{Location:'https://example.com'}});const r=await f.request('/assets/app.js',{headers:{Cookie:cookie}});assert.equal(r.status,503);assert.equal(r.headers.get('Location'),null);}
  f.env.ASSETS.fetch=async()=>{throw Error('private diagnostics');};assert.equal((await f.request('/assets/app.js',{headers:{Cookie:cookie}})).status,503);
  delete f.env.SESSION_KEY;const unavailable=await f.request('/assets/app.js',{headers:{Cookie:cookie}});assert.equal(unavailable.status,503);assert.doesNotMatch(await unavailable.text(),/private diagnostics/);
  const other=fixture(),start=await other.start(),app=createGateway({keys:async()=>{throw Error('provider offline');},now:()=>other.time*1000});
  const r=await app.fetch(new Request(origin+'/auth/complete',{method:'POST',headers:{Origin:origin,'Sec-Fetch-Site':'same-origin','Content-Type':'application/json',Cookie:start.cookie},body:JSON.stringify({credential:await other.token(start.nonce)})}),other.env);assert.equal(r.status,401);assert.doesNotMatch(await r.text(),/provider offline/);
});
test('oversized login bodies are rejected even without a Content-Length',async()=>{
  const f=fixture(),begin=await f.start();assert.equal((await f.complete(begin.cookie,'x'.repeat(17000))).status,401);
  assert.equal((await f.complete(begin.cookie,'x',{'Content-Length':'17000'})).status,401);assert.equal(f.calls,0);
});
test('release inventory refuses private paths, wildcards and source maps',()=>{
  for(const path of ['/private/lessons.json','/auth/leak.json','/assets/*','/assets/a.js.map','/assets/../private.json','/assets//a.js'])assert.throws(()=>createGateway({assets:{[path]:'text/javascript'}}));
});

test('private bootstrap requires the verified session and exact owner with no asset fallback',async()=>{
 const f=fixture(),kinds=['study-bank','review-calculations','legacy-lessons','registry','coding-text','electronics-text'];
 const value={schema:'suite.hosted-bootstrap@1',config:{schema:'suite.google-web@1',clientId:f.env.GOOGLE_CLIENT_ID,origin,expectedEmail:f.env.OWNER_EMAIL,locator:{schema:'suite.drive-locator@1',kind:'personal',project:'fixture',ownerSubject:f.env.OWNER_SUB,workspace:'personal-fixture',folderId:'folder',sentinelId:'sentinel',sentinelSha256:'a'.repeat(64)}},library:kinds.map((kind,i)=>({kind,sha256:'b'.repeat(64),bytes:100,fileId:'file-'+i}))};
 f.env.SUITE_BOOTSTRAP=JSON.stringify(value);assert.equal((await f.request('/auth/bootstrap')).status,401);
 const cookie=await f.login(),headers={Cookie:cookie};assert.deepEqual(await(await f.request('/auth/bootstrap',{headers})).json(),value);assert.equal(f.calls,0);
 for(const changed of [{...value,config:{...value.config,expectedEmail:'other@gmail.com'}},{...value,library:value.library.slice(1)},{...value,library:value.library.map(file=>({...file,fileId:'same'}))},{...value,token:'not-permitted'}]){f.env.SUITE_BOOTSTRAP=JSON.stringify(changed);assert.equal((await f.request('/auth/bootstrap',{headers})).status,503);}
 f.env.SUITE_BOOTSTRAP=JSON.stringify(value);f.advance(901);assert.equal((await f.request('/auth/bootstrap',{headers})).status,401);assert.equal(f.calls,0);
});
