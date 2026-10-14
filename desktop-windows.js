// Device-local window geometry. Never serialized into a circuit or graded lesson.
import {assertSerializable} from './data-contract.js';
export const windowIds=['circuit','meter','scope','project'];
export const desktopLayoutKey='eu_desktop_windows_v1';
const bounds={width:1800,height:1400};
export function defaultDesktopLayout(){return {schemaVersion:1,windows:{circuit:{x:0,y:0,width:670,height:850,z:1,visible:true,dock:'left'},meter:{x:684,y:0,width:320,height:850,z:2,visible:true,dock:'right'},scope:{x:280,y:70,width:780,height:650,z:3,visible:false,dock:'free'},project:{x:380,y:100,width:620,height:760,z:4,visible:false,dock:'free'}}};}
export function validateDesktopLayout(value){
 assertSerializable(value);if(value?.schemaVersion!==1||!value.windows)throw Error('Unsupported desktop layout');
 for(const id of windowIds){const w=value.windows[id];if(!w||!['x','y','width','height','z'].every(k=>Number.isFinite(w[k]))||w.x<0||w.x>bounds.width-100||w.y<0||w.y>bounds.height-100||w.width<300||w.width>bounds.width||w.height<220||w.height>bounds.height||typeof w.visible!=='boolean'||!['free','left','right','max'].includes(w.dock))throw Error('Invalid desktop window geometry');}return value;
}
export function resizeDesktopWindow(w,edge,dx,dy){
 if(!['n','s','e','w','ne','nw','se','sw'].includes(edge))throw Error('Unsupported resize edge');
 const next={...w,dock:'free'},right=w.x+w.width,bottom=w.y+w.height;
 if(edge.includes('e'))next.width=Math.min(bounds.width-w.x,Math.max(300,w.width+dx));
 if(edge.includes('s'))next.height=Math.min(bounds.height-w.y,Math.max(220,w.height+dy));
 if(edge.includes('w')){next.x=Math.min(right-300,Math.max(0,w.x+dx));next.width=right-next.x;}
 if(edge.includes('n')){next.y=Math.min(bottom-220,Math.max(0,w.y+dy));next.height=bottom-next.y;}
 return next;
}
export function dockDesktopWindow(w,dock,stageWidth=1260){
 if(!['left','right','max','free'].includes(dock))throw Error('Unsupported docking position');
 const width=Math.min(1800,Math.max(1000,stageWidth));
 if(dock==='free')return {...w,dock};
 return {...w,x:dock==='right'?Math.round(width*.68):0,y:0,width:dock==='max'?width:dock==='right'?Math.round(width*.32):Math.round(width*.67),height:850,dock,visible:true};
}
export function attachDesktopWindows(root,storage=localStorage){
 const lab=root.querySelector('[data-lab-platform="desktop"]');if(!lab)return ()=>{};
 const stage=lab.querySelector('.lab-workspace-grid');stage.classList.add('desktop-window-stage');
 let state=defaultDesktopLayout(),active=null,saveTimer;
 try{const raw=storage.getItem(desktopLayoutKey);if(raw)state=validateDesktopLayout(JSON.parse(raw));}catch{const p=document.createElement('p');p.textContent='Saved layout could not be read. Default layout shown; the original remains until you change the layout.';lab.prepend(p);}
 const pane=id=>stage.querySelector('[data-pane="'+id+'"]');
 const save=()=>{clearTimeout(saveTimer);saveTimer=setTimeout(()=>{try{storage.setItem(desktopLayoutKey,JSON.stringify(state));}catch{lab.querySelector('[data-project-status]').textContent='Window layout could not be saved; project storage is separate.';}},100);};
 function apply(){for(const id of windowIds){const p=pane(id),w=state.windows[id];p.hidden=!w.visible;p.style.cssText=`left:${w.x}px;top:${w.y}px;width:${w.width}px;height:${w.height}px;z-index:${w.z}`;p.dataset.dock=w.dock;}}
 for(const id of windowIds){const p=pane(id),heading=p.querySelector('h3'),title=heading?.textContent||id;heading?.remove();p.classList.add('desktop-window');
  const content=document.createElement('div');content.className='desktop-window-content';while(p.firstChild)content.append(p.firstChild);p.append(content);
  const bar=document.createElement('header');bar.className='desktop-window-title';bar.dataset.windowDrag=id;bar.tabIndex=0;bar.setAttribute('aria-label',title+' window: drag to move; arrow keys move, Shift plus arrows resize');
  bar.innerHTML='<strong>'+title+'</strong><div class="window-actions">'+[['left','Dock left'],['right','Dock right'],['max','Maximize'],['free','Undock']].map(([dock,label])=>'<button data-window-dock="'+dock+'" data-window-id="'+id+'" title="'+label+'" aria-label="'+label+' '+title+'">'+({left:'◧',right:'◨',max:'□',free:'↗'}[dock])+'</button>').join('')+'<button data-window-hide="'+id+'" aria-label="Minimize '+title+'">−</button></div>';p.prepend(bar);
  for(const edge of ['n','s','e','w','ne','nw','se','sw']){const handle=document.createElement('div');handle.className='window-resize window-resize-'+edge;handle.dataset.windowResize=edge;handle.dataset.windowId=id;p.append(handle);}
 }
 function raise(id){state.windows[id].z=Math.max(...windowIds.map(i=>state.windows[i].z))+1;state.windows[id].visible=true;apply();}
 const down=e=>{if(e.button!==0||e.target.closest('button,input,select,textarea'))return;const handle=e.target.closest('[data-window-resize]'),bar=e.target.closest('[data-window-drag]');if(!handle&&!bar)return;const id=handle?.dataset.windowId||bar.dataset.windowDrag;raise(id);active={id,edge:handle?.dataset.windowResize,x:e.clientX,y:e.clientY,w:{...state.windows[id]},pointerId:e.pointerId,target:handle||bar};active.target.setPointerCapture(e.pointerId);e.preventDefault();};
 const move=e=>{if(!active||active.pointerId!==e.pointerId)return;const {w,id}=active,dx=e.clientX-active.x,dy=e.clientY-active.y;state.windows[id]=active.edge?resizeDesktopWindow(w,active.edge,dx,dy):{...w,x:Math.max(0,Math.min(1700,w.x+dx)),y:Math.max(0,Math.min(1300,w.y+dy)),dock:'free'};apply();};
 const up=e=>{if(!active||active.pointerId!==e.pointerId)return;const a=active;active=null;if(a.target.hasPointerCapture(e.pointerId))a.target.releasePointerCapture(e.pointerId);if(e.type==='pointercancel')state.windows[a.id]=a.w;apply();save();};
 const click=e=>{const dock=e.target.closest('[data-window-dock]'),hide=e.target.closest('[data-window-hide]'),show=e.target.closest('[data-lab-pane]'),reset=e.target.closest('[data-reset-desktop-layout]');if(dock){const id=dock.dataset.windowId;state.windows[id]=dockDesktopWindow(state.windows[id],dock.dataset.windowDock,stage.clientWidth);raise(id);}else if(hide){state.windows[hide.dataset.windowHide].visible=false;apply();}else if(show)raise(show.dataset.labPane);else if(reset){state=defaultDesktopLayout();apply();}else return;save();};
 const focus=e=>{if(windowIds.includes(e.detail)){raise(e.detail);save();}};
 const key=e=>{if(!e.target.matches('[data-window-drag]')||!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key))return;e.preventDefault();const id=e.target.dataset.windowDrag,w=state.windows[id],dx=e.key==='ArrowLeft'?-10:e.key==='ArrowRight'?10:0,dy=e.key==='ArrowUp'?-10:e.key==='ArrowDown'?10:0;state.windows[id]=e.shiftKey?resizeDesktopWindow(w,'se',dx,dy):{...w,x:Math.max(0,Math.min(1700,w.x+dx)),y:Math.max(0,Math.min(1300,w.y+dy)),dock:'free'};apply();save();};
 lab.addEventListener('lab-window-focus',focus);lab.addEventListener('pointerdown',down);lab.addEventListener('pointermove',move);lab.addEventListener('pointerup',up);lab.addEventListener('pointercancel',up);lab.addEventListener('click',click);lab.addEventListener('keydown',key);apply();
 return ()=>{clearTimeout(saveTimer);if(saveTimer)try{storage.setItem(desktopLayoutKey,JSON.stringify(state));}catch{}lab.removeEventListener('lab-window-focus',focus);lab.removeEventListener('pointerdown',down);lab.removeEventListener('pointermove',move);lab.removeEventListener('pointerup',up);lab.removeEventListener('pointercancel',up);lab.removeEventListener('click',click);lab.removeEventListener('keydown',key);};
}
