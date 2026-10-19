import {createRemoteJWKSet, jwtVerify, SignJWT, base64url} from 'jose';
import {loginPage} from './login.mjs';
import {validateBootstrap} from './bootstrap.mjs';

const googleKeys = createRemoteJWKSet(new URL('https://www.googleapis.com/oauth2/v3/certs'), {
  timeoutDuration: 5000, cooldownDuration: 30000, cacheMaxAge: 3600000,
});
const sessionName = '__Host-suite-session', nonceName = '__Host-suite-login';
const loginLifetime = 300, sessionLifetime = 900;
const issuer = 'suite.gateway@1';
const appCsp = "default-src 'none'; script-src 'self' 'wasm-unsafe-eval' https://accounts.google.com/gsi/client; style-src 'self' 'unsafe-inline' https://accounts.google.com/gsi/style; connect-src 'self' https://www.googleapis.com https://openidconnect.googleapis.com https://accounts.google.com/gsi/; frame-src 'self' https://accounts.google.com/gsi/; worker-src 'self' blob:; img-src 'self' data: blob:; font-src 'self' data:; base-uri 'none'; object-src 'none'; form-action 'none'; frame-ancestors 'none'";
const noCache = {'Cache-Control':'private, no-store, max-age=0', 'CDN-Cache-Control':'no-store',
  'Cloudflare-CDN-Cache-Control':'no-store', 'Pragma':'no-cache', 'X-Content-Type-Options':'nosniff',
  'Referrer-Policy':'no-referrer', 'X-Frame-Options':'DENY', 'Cross-Origin-Resource-Policy':'same-origin',
  'Strict-Transport-Security':'max-age=31536000', 'Permissions-Policy':'camera=(), microphone=(), geolocation=()'};
const json = (status, message, extra = {}) => new Response(JSON.stringify({message}), {
  status, headers:{...noCache, 'Content-Type':'application/json; charset=utf-8', ...extra},
});
const cookie = (name,value,seconds) => `${name}=${value}; Path=/; Max-Age=${seconds}; Secure; HttpOnly; SameSite=Lax`;
const random = () => base64url.encode(crypto.getRandomValues(new Uint8Array(32)));
function readCookie(request,name) {
  const raw=request.headers.get('Cookie')||'';
  if(raw.length>8192)throw Error('Invalid cookie');
  const matches=raw.split(';').map(s=>s.trim()).filter(s=>s.startsWith(name+'='));
  if(matches.length!==1)throw Error('Missing or duplicate cookie');
  return matches[0].slice(name.length+1);
}
function config(env) {
  const origin=env.SUITE_ORIGIN;
  if(typeof origin!=='string'||!/^https:\/\/[a-z0-9-]+\.[a-z0-9-]+\.workers\.dev$/.test(origin))throw Error('Invalid origin');
  if(typeof env.GOOGLE_CLIENT_ID!=='string'||!/^\d+-[a-z0-9]+\.apps\.googleusercontent\.com$/.test(env.GOOGLE_CLIENT_ID))throw Error('Invalid client');
  if(typeof env.OWNER_SUB!=='string'||!/^\d{10,30}$/.test(env.OWNER_SUB)||typeof env.OWNER_EMAIL!=='string'||!/^[a-z0-9._+-]+@gmail\.com$/.test(env.OWNER_EMAIL))throw Error('Invalid owner');
  if(typeof env.SESSION_KEY!=='string'||! /^[\w-]{43}$/.test(env.SESSION_KEY))throw Error('Missing session key');
  const key=base64url.decode(env.SESSION_KEY);if(key.length!==32||base64url.encode(key)!==env.SESSION_KEY)throw Error('Invalid session key');
  return {origin,client:env.GOOGLE_CLIENT_ID,sub:env.OWNER_SUB,email:env.OWNER_EMAIL,key};
}
async function sign(payload,cfg,kind,time,expires) {
  return new SignJWT({...payload,kind}).setProtectedHeader({alg:'HS256',typ:'suite-'+kind+'+jwt'})
    .setIssuer(issuer).setAudience(cfg.origin).setIssuedAt(time).setExpirationTime(expires).sign(cfg.key);
}
async function verify(token,cfg,kind,time,lifetime) {
  if(typeof token!=='string'||token.length>4096)throw Error('Invalid cookie');
  const {payload}=await jwtVerify(token,cfg.key,{algorithms:['HS256'],typ:'suite-'+kind+'+jwt',
    issuer,audience:cfg.origin,requiredClaims:['iat','exp','kind'],maxTokenAge:lifetime,
    clockTolerance:0,currentDate:new Date(time*1000)});
  if(payload.kind!==kind||!Number.isSafeInteger(payload.iat)||!Number.isSafeInteger(payload.exp)||payload.iat>time||payload.exp-payload.iat>lifetime)throw Error('Invalid lifetime');
  return payload;
}
function sameOrigin(request,cfg) {
  if(request.headers.get('Origin')!==cfg.origin||request.headers.get('Sec-Fetch-Site')!=='same-origin')throw Error('Invalid request origin');
}
async function readCredential(request) {
  if(request.headers.get('Content-Type')!=='application/json'||request.headers.has('Content-Encoding'))throw Error('Invalid body');
  const length=request.headers.get('Content-Length');if(length!==null&&(!/^\d+$/.test(length)||Number(length)>16384))throw Error('Body too large');
  const reader=request.body?.getReader();if(!reader)throw Error('Missing body');
  let size=0;const parts=[];
  try{for(;;){const part=await reader.read();if(part.done)break;size+=part.value.length;if(size>16384)throw Error('Body too large');parts.push(part.value);}}
  catch(e){await reader.cancel().catch(()=>{});throw e;}
  const bytes=new Uint8Array(size);let offset=0;for(const part of parts){bytes.set(part,offset);offset+=part.length;}
  const body=JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(bytes));
  if(!body||Object.keys(body).length!==1||typeof body.credential!=='string'||body.credential.length>12000)throw Error('Invalid credential');
  return body.credential;
}
function safePath(path) {
  if(path==='/')return true;
  return /^\/[a-zA-Z0-9_./-]+$/.test(path)&&!path.includes('//')&&!path.split('/').some(p=>p==='.'||p==='..')
    &&!/^\/(?:private|auth)(?:\/|$)/.test(path)&&!path.endsWith('.map');
}

// The release builder supplies an audited, exact asset map. No wildcard, SPA
// fallback, runtime file discovery, user-controlled key URL or Drive token proxy.
export function createGateway({assets = {}, keys = googleKeys, now = Date.now, frameScriptHash = null} = {}) {
  if(frameScriptHash!==null&&(typeof frameScriptHash!=='string'||!/^[A-Za-z0-9+/]{43}=$/.test(frameScriptHash)))throw Error('Invalid isolated interpreter hash');
  const contentPolicy=frameScriptHash?appCsp.replace("script-src 'self'",`script-src 'self' 'sha256-${frameScriptHash}'`):appCsp;
  const allowed=new Map(Object.entries(assets));
  for(const [path,type] of allowed)if(!safePath(path)||!['text/html','text/css','text/javascript','application/json','image/svg+xml','image/png','font/woff2','font/ttf','application/wasm'].includes(type))throw Error('Invalid asset inventory');
  return {async fetch(request,env) {
    let cfg;try{cfg=config(env);}catch{return json(503,'Suite access is not configured.');}
    const url=new URL(request.url),time=Math.floor(now()/1000);
    if(url.origin!==cfg.origin)return json(403,'This Suite address is not enabled.');
    // Reject encoded route aliases, query tokens and fragments before any binding.
    const recovery=url.pathname==='/'&&url.search==='?recovery=1';
    if((url.search&&!recovery)||url.hash||url.pathname.includes('%')||url.pathname.includes('//'))return json(404,'Not found.');
    if(!['GET','HEAD','POST'].includes(request.method))return json(405,'Method not allowed.');
    const path=url.pathname;
    if(path==='/auth/start') {
      if(request.method!=='GET')return json(405,'Method not allowed.');
      const site=request.headers.get('Sec-Fetch-Site');
      if(site==='cross-site'&&request.headers.get('Sec-Fetch-Mode')!=='navigate')return json(403,'Open Suite directly to sign in.');
      try{
        const nonce=random(),scriptNonce=random(),signed=await sign({nonce},cfg,'login',time,time+loginLifetime);
        const headers={...noCache,'Content-Type':'text/html; charset=utf-8','Set-Cookie':cookie(nonceName,signed,loginLifetime),
          'Cross-Origin-Opener-Policy':'same-origin-allow-popups',
          'Content-Security-Policy':`default-src 'none'; script-src 'nonce-${scriptNonce}' https://accounts.google.com/gsi/client; style-src 'nonce-${scriptNonce}' https://accounts.google.com/gsi/style; frame-src https://accounts.google.com/gsi/; connect-src 'self' https://accounts.google.com/gsi/; img-src https://accounts.google.com/gsi/; base-uri 'none'; form-action 'none'; frame-ancestors 'none'`};
        return new Response(loginPage(cfg.client,nonce,scriptNonce),{headers});
      }catch{return json(503,'Sign-in is unavailable.');}
    }
    if(path==='/auth/complete') {
      if(request.method!=='POST')return json(405,'Method not allowed.');
      try{
        sameOrigin(request,cfg);
        const login=await verify(readCookie(request,nonceName),cfg,'login',time,loginLifetime);
        const token=await readCredential(request);
        const {payload}=await jwtVerify(token,keys,{algorithms:['RS256'],issuer:['https://accounts.google.com','accounts.google.com'],
          audience:cfg.client,requiredClaims:['sub','email','email_verified','nonce','iat','exp'],maxTokenAge:loginLifetime,
          clockTolerance:0,currentDate:new Date(time*1000)});
        if(payload.aud!==cfg.client||(payload.azp!==undefined&&payload.azp!==cfg.client)||payload.sub!==cfg.sub||payload.email!==cfg.email||payload.email_verified!==true||payload.nonce!==login.nonce||typeof login.nonce!=='string'||!Number.isSafeInteger(payload.iat)||!Number.isSafeInteger(payload.exp)||payload.iat>time)throw Error('Account not accepted');
        const expires=Math.min(time+sessionLifetime,payload.exp);
        const session=await sign({sub:cfg.sub,jti:random()},cfg,'session',time,expires);
        const response=json(200,'Signed in.');response.headers.append('Set-Cookie',cookie(sessionName,session,expires-time));response.headers.append('Set-Cookie',cookie(nonceName,'',0));return response;
      }catch{return json(401,'Sign-in could not be verified.',{'Set-Cookie':cookie(nonceName,'',0)});}
    }
    if(path==='/auth/logout') {
      if(request.method!=='POST')return json(405,'Method not allowed.');
      try{sameOrigin(request,cfg);}catch{return json(403,'Request not accepted.');}
      const response=json(200,'Signed out.');response.headers.append('Set-Cookie',cookie(sessionName,'',0));response.headers.append('Set-Cookie',cookie(nonceName,'',0));return response;
    }
    if(!['GET','HEAD'].includes(request.method))return json(405,'Method not allowed.');
    if(request.headers.get('Sec-Fetch-Site')==='cross-site')return json(403,'Open Suite directly.');
    let session;
    try{session=await verify(readCookie(request,sessionName),cfg,'session',time,sessionLifetime);if(session.sub!==cfg.sub)throw Error('Different owner');}
    catch{
      if(path==='/'&&request.method==='GET'&&request.headers.get('Accept')?.includes('text/html'))return new Response(null,{status:303,headers:{...noCache,Location:'/auth/start'}});
      return json(401,'Sign in to open Suite.');
    }
    if(path==='/auth/session')return new Response(request.method==='HEAD'?null:JSON.stringify({authenticated:true,expiresAt:session.exp}),{headers:{...noCache,'Content-Type':'application/json; charset=utf-8'}});
    if(path==='/auth/bootstrap'){
      try{if(typeof env.SUITE_BOOTSTRAP!=='string'||env.SUITE_BOOTSTRAP.length>16384)throw Error('Missing bootstrap');const value=validateBootstrap(JSON.parse(env.SUITE_BOOTSTRAP),cfg);return new Response(request.method==='HEAD'?null:JSON.stringify(value),{headers:{...noCache,'Content-Type':'application/json; charset=utf-8'}});}
      catch{return json(503,'The private workspace is not ready. Saved work is retained.');}
    }
    const type=allowed.get(path);if(!type)return json(404,'Not found.');
    try{
      if(typeof env.ASSETS?.fetch!=='function')throw Error('Missing assets');
      // Drop cookies, authorization, ranges, conditional and forwarded headers.
      const upstream=await env.ASSETS.fetch(new Request(cfg.origin+(path==='/'?'/index.html':path),{method:request.method,redirect:'manual'}));
      if(upstream.status!==200)return json(503,'Suite files are unavailable.');
      const headers=new Headers(noCache);headers.set('Content-Type',type+(type.startsWith('text/')?'; charset=utf-8':''));
      headers.set('Content-Security-Policy',contentPolicy);headers.set('Cross-Origin-Opener-Policy','same-origin-allow-popups');
      return new Response(request.method==='HEAD'?null:upstream.body,{status:200,headers});
    }catch{return json(503,'Suite files are unavailable.');}
  }};
}
