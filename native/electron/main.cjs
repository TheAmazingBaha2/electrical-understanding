// Evaluation shell only. No preload, Node renderer, IPC, updater or production backend.
const {app,BrowserWindow,protocol,session,Menu}=require('electron');
const {readFile,readdir}=require('node:fs/promises');const path=require('node:path');
const root=path.resolve(__dirname,'../../dist');
protocol.registerSchemesAsPrivileged([{scheme:'eu-lab',privileges:{standard:true,secure:true,supportFetchAPI:true,stream:true}}]);
if(process.env.EU_NATIVE_QA_PROFILE)app.setPath('userData',process.env.EU_NATIVE_QA_PROFILE);
const csp="default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; object-src 'none'; frame-src 'none'; base-uri 'none'";
app.whenReady().then(async()=>{
 // dist is produced by the tested public-asset allowlist. Only flat files from
 // that directory are served; this protocol cannot browse project/user files.
 const allowed=new Set(await readdir(root)),config=await readFile(path.join(root,'config.js'),'utf8');
 if(!/SUPABASE_URL = ''/.test(config)||!/SUPABASE_PUBLISHABLE_KEY = ''/.test(config))throw Error('Evaluation requires the isolated offline configuration');
 protocol.handle('eu-lab',async request=>{
  const url=new URL(request.url),name=decodeURIComponent(url.pathname).replace(/^\//,'')||'index.html';
  if(url.hostname!=='app'||name.includes('/')||name.includes('\\')||!allowed.has(name))return new Response('Not found',{status:404});
  const type={'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.json':'application/json','.webmanifest':'application/manifest+json','.png':'image/png'}[path.extname(name)]||'application/octet-stream';
  try{return new Response(await readFile(path.join(root,name)),{headers:{'Content-Type':type,'Content-Security-Policy':csp}});}catch{return new Response('Not found',{status:404});}
 });
 session.defaultSession.webRequest.onBeforeRequest((details,callback)=>callback({cancel:!details.url.startsWith('eu-lab://app/')}));
 session.defaultSession.setPermissionRequestHandler((_w,_p,callback)=>callback(false));
 const window=new BrowserWindow({title:'Electrical Workbench · Electron evaluation',width:1600,height:1100,minWidth:1000,minHeight:700,webPreferences:{nodeIntegration:false,contextIsolation:true,sandbox:true,webSecurity:true}});
 window.webContents.setWindowOpenHandler(()=>({action:'deny'}));
 window.webContents.on('will-navigate',(event,url)=>{if(!url.startsWith('eu-lab://app/'))event.preventDefault();});
 Menu.setApplicationMenu(Menu.buildFromTemplate([{label:'Prototype',submenu:[{label:'Unsigned evaluation · no cloud backend',enabled:false},{role:'quit'}]}]));
 await window.loadURL('eu-lab://app/index.html');
}).catch(error=>{console.error(error);app.exit(1);});
app.on('window-all-closed',()=>app.quit());
