// Presentation-only pointer adapter. Drafts never mutate a circuit or assessment.
// Tap/keyboard controls call the same host command as a successful drag.
export function resolvePointerTarget(point,targets,{radius=24}={}){
 const candidates=targets.filter(t=>!t.disabled&&Math.hypot(point.x-t.x,point.y-t.y)<=Math.max(radius,t.radius||0));
 return {target:candidates.length===1?candidates[0]:null,ambiguous:candidates.length>1,candidates};
}
export function pointerDraft(start,point,{threshold=7}={}){
 return {point:{x:point.x,y:point.y},dragged:Math.hypot(point.x-start.x,point.y-start.y)>=threshold};
}
export function attachLabPointerInput(root,{handleSelector,targets,commit,onTap=null,preview=()=>{},status=()=>{},threshold=7}={}){
 let active=null,frame=null,pending=null,suppressUntil=0,suppressedHandle=null;
 const view=root.ownerDocument.defaultView;
 const position=e=>({x:e.clientX,y:e.clientY});
 function paint(){frame=null;if(!active||!pending)return;const hit=resolvePointerTarget(pending,targets(active.handle));preview({handle:active.handle,start:active.start,point:pending,...hit});}
 function clear(){if(frame!==null)view.cancelAnimationFrame(frame);frame=null;pending=null;preview(null);}
 function finish(event,canceled=false){
  if(!active||event&&event.pointerId!==undefined&&event.pointerId!==active.pointerId)return;
  const previous=active;active=null;
  const tapped=!previous.dragged&&!canceled&&!!event&&!!onTap;
  if(previous.dragged||tapped){suppressUntil=Date.now()+500;suppressedHandle=previous.handle;}
  const hit=!canceled&&event?resolvePointerTarget(position(event),targets(previous.handle)):null;
  // Release before a host redraw removes the captured node.
  if(previous.handle.hasPointerCapture?.(previous.pointerId))previous.handle.releasePointerCapture(previous.pointerId);
  clear();
  if(previous.dragged&&!canceled&&hit?.target){try{commit(previous.handle,hit.target);}catch(error){status(error.message);}}
  else if(tapped){try{onTap(previous.handle);}catch(error){status(error.message);}}
  else if(previous.dragged)status(hit?.ambiguous?'Several terminals are nearby. Use the named tap controls.':'Movement canceled; the previous connection is unchanged.');
 }
 function down(e){
  if(active){finish(null,true);suppressUntil=Date.now()+500;return;}
  suppressUntil=0; // A new deliberate gesture is never the trailing compatibility click.
  const handle=e.target.closest(handleSelector);if(!handle||!root.contains(handle)||e.button!==0||e.isPrimary===false)return;
  e.stopPropagation();active={handle,pointerId:e.pointerId,start:position(e),dragged:false};handle.setPointerCapture(e.pointerId);
 }
 function move(e){if(!active||active.pointerId!==e.pointerId)return;const p=position(e);active.dragged ||= pointerDraft(active.start,p,{threshold}).dragged;if(!active.dragged)return;e.preventDefault();e.stopPropagation();pending=p;if(frame===null)frame=view.requestAnimationFrame(paint);}
 const up=e=>finish(e),cancel=()=>finish(null,true),lost=e=>{if(active?.pointerId===e.pointerId)finish(null,true);};
 const click=e=>{if(e.detail!==0&&Date.now()<suppressUntil&&e.target.closest(handleSelector)===suppressedHandle){e.preventDefault();e.stopImmediatePropagation();}};
 const key=e=>{if(e.key==='Escape'&&active){e.preventDefault();cancel();}};
 root.addEventListener('pointerdown',down);root.addEventListener('pointermove',move);root.addEventListener('pointerup',up);root.addEventListener('pointercancel',cancel);root.addEventListener('lostpointercapture',lost);root.addEventListener('click',click,true);root.addEventListener('keydown',key);
 for(const event of ['blur','orientationchange','pagehide'])view.addEventListener(event,cancel);
 return ()=>{cancel();root.removeEventListener('pointerdown',down);root.removeEventListener('pointermove',move);root.removeEventListener('pointerup',up);root.removeEventListener('pointercancel',cancel);root.removeEventListener('lostpointercapture',lost);root.removeEventListener('click',click,true);root.removeEventListener('keydown',key);for(const event of ['blur','orientationchange','pagehide'])view.removeEventListener(event,cancel);};
}
// Screen-space overlay uses CSS pixels, matching client hit tests at any SVG zoom.
export function pointerPreview(root){
 let overlay=null;
 return draft=>{
  if(!draft){overlay?.remove();overlay=null;return;}
  if(!overlay){overlay=root.ownerDocument.createElement('div');overlay.className='lab-pointer-preview';overlay.setAttribute('aria-hidden','true');root.append(overlay);}
  const {point,start,target,ambiguous}=draft,doc=root.ownerDocument;
  overlay.replaceChildren();
  const svg=doc.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('width','100%');svg.setAttribute('height','100%');
  const line=doc.createElementNS(svg.namespaceURI,'line');for(const [key,value] of Object.entries({x1:start.x,y1:start.y,x2:point.x,y2:point.y,stroke:target?'#8ef0c0':'#f6d968','stroke-width':4,'stroke-dasharray':'7 5'}))line.setAttribute(key,value);svg.append(line);overlay.append(svg);
  const label=doc.createElement('span');label.textContent=ambiguous?'Ambiguous · use named controls':target?target.label+' · release to connect':'Uncommitted · choose a terminal';label.style.left=Math.max(4,Math.min(point.x-90,doc.documentElement.clientWidth-220))+'px';label.style.top=Math.max(4,point.y-64)+'px';overlay.append(label);
 };
}

// Touch/pen taps invoke the host's semantic command, not a fabricated DOM click.
// Ordinary controls retain native scrolling and keyboard/mouse click fallback.
export function attachLabTapControls(root,{selector,activate,threshold=7}={}){
 const view=root.ownerDocument.defaultView;let pressed=null,handled=null;
 const target=e=>e.target.closest?.(selector);
 const reset=()=>{pressed=null;};
 function down(e){
  if(pressed){reset();return;}
  if(!['touch','pen'].includes(e.pointerType)){handled=null;return;}
  const element=target(e);if(!element||!root.contains(element)||element.disabled||e.isPrimary===false||e.button!==0)return;
  pressed={element,pointerId:e.pointerId,x:e.clientX,y:e.clientY};
 }
 function move(e){if(pressed?.pointerId===e.pointerId&&Math.hypot(e.clientX-pressed.x,e.clientY-pressed.y)>threshold)reset();}
 function up(e){
  if(!pressed||pressed.pointerId!==e.pointerId)return;const p=pressed;reset();
  const r=p.element.getBoundingClientRect();
  if(p.element.disabled||!root.contains(p.element)||target(e)!==p.element||e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom||Math.hypot(e.clientX-p.x,e.clientY-p.y)>threshold)return;
  handled={element:p.element,until:Date.now()+500};activate(p.element);
 }
 function click(e){if(e.detail===0){reset();return;}if(handled&&Date.now()<handled.until&&target(e)===handled.element){e.preventDefault();e.stopImmediatePropagation();}}
 const key=e=>{if(['Escape','Enter',' '].includes(e.key))reset();},otherDown=e=>{if(pressed&&pressed.pointerId!==e.pointerId)reset();};
 root.addEventListener('pointerdown',down);root.addEventListener('click',click,true);view.addEventListener('pointerdown',otherDown);view.addEventListener('pagehide',reset);
 view.addEventListener('pointermove',move);view.addEventListener('pointerup',up);view.addEventListener('pointercancel',reset);view.addEventListener('blur',reset);view.addEventListener('orientationchange',reset);view.addEventListener('keydown',key);
 return ()=>{reset();handled=null;view.removeEventListener('pointerdown',otherDown);view.removeEventListener('pagehide',reset);root.removeEventListener('pointerdown',down);root.removeEventListener('click',click,true);view.removeEventListener('pointermove',move);view.removeEventListener('pointerup',up);view.removeEventListener('pointercancel',reset);view.removeEventListener('blur',reset);view.removeEventListener('orientationchange',reset);view.removeEventListener('keydown',key);};
}
