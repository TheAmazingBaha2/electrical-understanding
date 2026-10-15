// Device-local preferred geometry. Rendering on a smaller display never rewrites it.
import {assertSerializable} from './data-contract.js';
export const windowIds=['circuit','meter','scope','project'];
export const desktopLayoutKey='eu_desktop_windows_v1';
const expandedKey='eu_desktop_workspace_expanded_v1';
const edges=['n','s','e','w','ne','nw','se','sw'];
export function defaultDesktopLayout(){return {schemaVersion:1,windows:{circuit:{x:0,y:0,width:670,height:850,z:1,visible:true,dock:'left'},meter:{x:684,y:0,width:320,height:850,z:2,visible:true,dock:'right'},scope:{x:280,y:70,width:780,height:650,z:3,visible:false,dock:'free'},project:{x:380,y:100,width:620,height:760,z:4,visible:false,dock:'free'}}};}
export function validateDesktopLayout(value){
 assertSerializable(value);
 if(value?.schemaVersion!==1||!value.windows)throw Error('Unsupported desktop layout');
 for(const id of windowIds){const w=value.windows[id];if(!w||!['x','y','width','height','z'].every(k=>Number.isFinite(w[k]))||w.x<0||w.y<0||w.width<300||w.height<220||typeof w.visible!=='boolean'||!['free','left','right','max'].includes(w.dock))throw Error('Invalid desktop window geometry');}
 return value;
}
export function fitDesktopWindow(w,area={width:w.x+w.width,height:w.y+w.height}){
 const width=Math.min(Math.max(300,w.width),area.width),height=Math.min(Math.max(220,w.height),area.height);
 return {...w,width,height,x:Math.max(0,Math.min(w.x,area.width-width)),y:Math.max(0,Math.min(w.y,area.height-height))};
}
export function resizeDesktopWindow(w,edge,dx,dy,area={width:Infinity,height:Infinity}){
 if(!edges.includes(edge))throw Error('Unsupported resize edge');
 const next={...w,dock:'free'},right=w.x+w.width,bottom=w.y+w.height,minWidth=Math.min(300,area.width),minHeight=Math.min(220,area.height);
 if(edge.includes('e'))next.width=Math.min(area.width-w.x,Math.max(minWidth,w.width+dx));
 if(edge.includes('s'))next.height=Math.min(area.height-w.y,Math.max(minHeight,w.height+dy));
 if(edge.includes('w')){next.x=Math.min(right-minWidth,Math.max(0,w.x+dx));next.width=right-next.x;}
 if(edge.includes('n')){next.y=Math.min(bottom-minHeight,Math.max(0,w.y+dy));next.height=bottom-next.y;}
 return next;
}
export function dockDesktopWindow(w,dock,stage=1260){
 if(!['left','right','max','free'].includes(dock))throw Error('Unsupported docking position');
 if(dock==='free')return {...w,dock};
 const area=typeof stage==='number'?{width:stage,height:850}:stage;
 const width=dock==='max'?area.width:Math.min(area.width,Math.max(300,Math.round(area.width*(dock==='right'?.32:.67))));
 return {...w,x:dock==='right'?area.width-width:0,y:0,width,height:area.height,dock,visible:true};
}
export function presentDesktopLayout(state,area){
 // Pure projection: shrinking/zooming must not destroy a preferred free layout.
 return Object.fromEntries(windowIds.map(id=>{const w=state.windows[id];return [id,fitDesktopWindow({...w,...(w.dock==='free'?{}:dockDesktopWindow(w,w.dock,area)),visible:w.visible},area)];}));
}
export function desktopPointerPoint(point,geometry){
 // client coordinates and the stage border box share viewport/zoom/DPI space.
 // Convert to the padding-box CSS coordinates used by its absolute children.
 return {x:(point.clientX-geometry.left)*geometry.offsetWidth/geometry.width-geometry.clientLeft+geometry.scrollLeft,
  y:(point.clientY-geometry.top)*geometry.offsetHeight/geometry.height-geometry.clientTop+geometry.scrollTop};
}
export function attachDesktopWindows(root,storage=localStorage){
 const lab=root.querySelector('[data-lab-platform="desktop"]');if(!lab)return ()=>{};
 const stage=lab.querySelector('.lab-workspace-grid');stage.classList.add('desktop-window-stage');
 let state=defaultDesktopLayout(),presented={},active=null,saveTimer,dirty=false,expanded=false,returnScroll;
 try{const raw=storage.getItem(desktopLayoutKey);if(raw)state=validateDesktopLayout(JSON.parse(raw));expanded=storage.getItem(expandedKey)==='true';}catch{const p=document.createElement('p');p.textContent='Saved layout could not be read. Default layout shown; the original remains until you change the layout.';lab.prepend(p);}
 const pane=id=>stage.querySelector('[data-pane="'+id+'"]');
 const area=()=>({width:stage.clientWidth,height:stage.clientHeight});
 const local=e=>{const r=stage.getBoundingClientRect();return desktopPointerPoint(e,{left:r.left,top:r.top,width:r.width,height:r.height,offsetWidth:stage.offsetWidth,offsetHeight:stage.offsetHeight,clientLeft:stage.clientLeft,clientTop:stage.clientTop,scrollLeft:stage.scrollLeft,scrollTop:stage.scrollTop});};
 const flush=()=>{clearTimeout(saveTimer);saveTimer=null;if(!dirty)return;try{const saved={...state,windows:Object.fromEntries(windowIds.map(id=>[id,{...state.windows[id],width:Math.max(300,state.windows[id].width),height:Math.max(220,state.windows[id].height)}]))};validateDesktopLayout(saved);storage.setItem(desktopLayoutKey,JSON.stringify(saved));dirty=false;}catch{lab.querySelector('[data-project-status]').textContent='Window layout could not be saved; project storage is separate.';}};
 const save=()=>{dirty=true;clearTimeout(saveTimer);saveTimer=setTimeout(flush,100);};
 function apply(){const a=area();if(a.width<=0||a.height<=0)return;presented=presentDesktopLayout(state,a);for(const id of windowIds){const p=pane(id),w=presented[id];p.hidden=!w.visible;p.style.cssText=`left:${w.x}px;top:${w.y}px;width:${w.width}px;height:${w.height}px;z-index:${w.z}`;p.dataset.dock=w.dock;}}
 function expand(value){
  if(value&&!expanded)returnScroll={x:window.scrollX,y:window.scrollY};
  expanded=value;lab.classList.toggle('desktop-workspace-expanded',value);
  const button=lab.querySelector('[data-expand-desktop-workspace]');if(button){button.textContent=value?'Return to lesson':'Expand lab';button.setAttribute('aria-pressed',String(value));}
  try{storage.setItem(expandedKey,String(value));}catch{}
  apply();if(!value&&returnScroll){window.scrollTo(returnScroll.x,returnScroll.y);returnScroll=null;}button?.focus({preventScroll:true});
 }
 for(const id of windowIds){const p=pane(id),heading=p.querySelector('h3'),title=heading?.textContent||id;heading?.remove();p.classList.add('desktop-window');
  const content=document.createElement('div');content.className='desktop-window-content';while(p.firstChild)content.append(p.firstChild);p.append(content);
  const bar=document.createElement('header');bar.className='desktop-window-title';bar.dataset.windowDrag=id;bar.tabIndex=0;bar.setAttribute('aria-label',title+' window: drag to move; arrow keys move, Shift plus arrows resize');
  bar.innerHTML='<strong>'+title+'</strong><div class="window-actions">'+[['left','Dock left'],['right','Dock right'],['max','Maximize'],['free','Undock']].map(([dock,label])=>'<button data-window-dock="'+dock+'" data-window-id="'+id+'" title="'+label+'" aria-label="'+label+' '+title+'">'+({left:'◧',right:'◨',max:'□',free:'↗'}[dock])+'</button>').join('')+'<button data-window-hide="'+id+'" aria-label="Minimize '+title+'">−</button></div>';p.prepend(bar);
  for(const edge of edges){const handle=document.createElement('div');handle.className='window-resize window-resize-'+edge;handle.dataset.windowResize=edge;handle.dataset.windowId=id;p.append(handle);}
 }
 function raise(id){state.windows[id]={...state.windows[id],z:Math.max(...windowIds.map(i=>state.windows[i].z))+1,visible:true};apply();}
 const down=e=>{
  if(e.button!==0)return;
  const handle=e.target.closest('[data-window-resize]'),bar=e.target.closest('[data-window-drag]'),p=e.target.closest('[data-pane]');
  if(!handle&&!bar){if(p){raise(p.dataset.pane);save();}return;}
  if(e.target.closest('button,input,select,textarea'))return;
  const id=handle?.dataset.windowId||bar.dataset.windowDrag,before={...state.windows[id]};raise(id);
  active={id,edge:handle?.dataset.windowResize,start:local(e),w:{...presented[id]},before,pointerId:e.pointerId,target:handle||bar};
  active.target.setPointerCapture(e.pointerId);e.preventDefault();
 };
 const move=e=>{if(!active||active.pointerId!==e.pointerId)return;const {w,id,start}=active,p=local(e),dx=p.x-start.x,dy=p.y-start.y;state.windows[id]=active.edge?resizeDesktopWindow(w,active.edge,dx,dy,area()):fitDesktopWindow({...w,x:w.x+dx,y:w.y+dy,dock:'free'},area());apply();};
 function finish(cancel=false){if(!active)return;const a=active;active=null;if(a.target.hasPointerCapture(a.pointerId))a.target.releasePointerCapture(a.pointerId);if(cancel)state.windows[a.id]=a.before;apply();if(!cancel)save();}
 const up=e=>{if(active?.pointerId===e.pointerId)finish(e.type==='pointercancel');};
 const click=e=>{
  const dock=e.target.closest('[data-window-dock]'),hide=e.target.closest('[data-window-hide]'),show=e.target.closest('[data-lab-pane]'),reset=e.target.closest('[data-reset-desktop-layout]');
  if(e.target.closest('[data-expand-desktop-workspace]')){expand(!expanded);return;}
  if(dock){const id=dock.dataset.windowId;state.windows[id]=dockDesktopWindow(presented[id],dock.dataset.windowDock,area());raise(id);}
  else if(hide){state.windows[hide.dataset.windowHide].visible=false;apply();}
  else if(show)raise(show.dataset.labPane);
  else if(reset){state=defaultDesktopLayout();apply();}
  else return;save();
 };
 const focus=e=>{if(windowIds.includes(e.detail)){raise(e.detail);save();}};
 const key=e=>{
  if(e.key==='Escape'&&active){e.preventDefault();finish(true);return;}
  if(!e.target.matches('[data-window-drag]')||!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key))return;
  e.preventDefault();const id=e.target.dataset.windowDrag,w=presented[id],dx=e.key==='ArrowLeft'?-10:e.key==='ArrowRight'?10:0,dy=e.key==='ArrowUp'?-10:e.key==='ArrowDown'?10:0;
  const updated=e.shiftKey?resizeDesktopWindow(w,'se',dx,dy,area()):fitDesktopWindow({...w,x:w.x+dx,y:w.y+dy,dock:'free'},area());
  state.windows[id]={...updated,width:Math.max(300,updated.width),height:Math.max(220,updated.height)};raise(id);save();
 };
 const observer=new ResizeObserver(apply);observer.observe(stage);
 window.addEventListener('resize',apply);lab.addEventListener('lab-window-focus',focus);lab.addEventListener('pointerdown',down);lab.addEventListener('pointermove',move);lab.addEventListener('pointerup',up);lab.addEventListener('pointercancel',up);lab.addEventListener('click',click);lab.addEventListener('keydown',key);
 expand(expanded);apply();
 return ()=>{finish(true);observer.disconnect();window.removeEventListener('resize',apply);flush();lab.removeEventListener('lab-window-focus',focus);lab.removeEventListener('pointerdown',down);lab.removeEventListener('pointermove',move);lab.removeEventListener('pointerup',up);lab.removeEventListener('pointercancel',up);lab.removeEventListener('click',click);lab.removeEventListener('keydown',key);};
}
