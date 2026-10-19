// This is the entire signed-out page. It contains no lesson, owner or Drive data.
export function loginPage(clientId, nonce, scriptNonce) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Sign in to Electronics Suite</title>
<style nonce="${scriptNonce}">:root{color-scheme:dark;font:18px/1.6 system-ui;background:#1e2732;color:#d9e4ec}main{max-width:38rem;margin:10vh auto;padding:1.5rem}h1{line-height:1.2}a{color:#8ddad5}#signin{min-height:44px}#message{min-height:3rem}</style></head>
<body><main><p>Electronics Suite</p><h1>Sign in to your workspace</h1><p>Use the Google account connected to Suite. Your lessons and saved work stay in your private Drive.</p><div id="signin"></div><p id="message" role="status">Loading Google sign-in…</p><p><a href="/auth/start">Start sign-in again</a></p></main>
<script nonce="${scriptNonce}">
const message=document.getElementById('message');
window.suiteGoogleReady=()=>{
 if(!window.google?.accounts?.id){message.textContent='Google sign-in is unavailable. Try again when connected.';return;}
 google.accounts.id.initialize({client_id:${JSON.stringify(clientId)},nonce:${JSON.stringify(nonce)},auto_select:false,ux_mode:'popup',callback:async result=>{
  message.textContent='Checking your account…';
  try{const response=await fetch('/auth/complete',{method:'POST',credentials:'same-origin',cache:'no-store',headers:{'Content-Type':'application/json'},body:JSON.stringify({credential:result.credential})});
   if(!response.ok)throw Error();location.replace('/');
  }catch{message.textContent='Sign-in could not be verified. Use your connected account, or start sign-in again.';}
 }});
 google.accounts.id.renderButton(document.getElementById('signin'),{type:'standard',theme:'outline',size:'large',text:'signin_with'});
 message.textContent='Sign in to open Suite.';
};
const script=document.createElement('script');script.nonce=${JSON.stringify(scriptNonce)};script.src='https://accounts.google.com/gsi/client';script.async=true;
script.onload=window.suiteGoogleReady;script.onerror=()=>{message.textContent='Google sign-in is unavailable. Try again when connected.';};document.head.append(script);
</script></body></html>`;
}
