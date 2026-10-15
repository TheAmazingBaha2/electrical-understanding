import {probeContact} from './circuit-model.js';
import {canvasSize,canvasTerminals,canvasProbeTerminal,circuitCanvasLayout} from './circuit-canvas.js';
import {resistorBody,sourceBody,partIcon,escapeGraphic as esc} from './lab-graphics.js';
import {boardPoint} from './graphical-breadboard.js';
import {breadboardHoles} from './breadboard-model.js';
import {graphicButton} from './graphic-controls.js';
import {formatResistance} from './resistor-color.js';
const line=(a,b)=>`M${a.x} ${a.y} C${a.x} ${a.y+90} ${b.x} ${b.y+90} ${b.x} ${b.y}`;
export function renderCircuitCanvas(circuit,stored,ui={},history={}){
 const layout=circuitCanvasLayout(circuit,stored),terminals=canvasTerminals(circuit,layout),terminal=id=>terminals.find(t=>t.id===id);
 const groups=new Map();for(const t of terminals){if(!groups.has(t.nodeId))groups.set(t.nodeId,[]);groups.get(t.nodeId).push(t);}
 const implicit=[...groups.values()].flatMap(ts=>ts.slice(1).map(t=>'<path class="canvas-net" d="'+line(ts[0],t)+'"><title>Shared node '+esc(t.nodeId)+'</title></path>')).join('');
 const wires=circuit.connections.map(w=>{const a=terminal(w.from),b=terminal(w.to);return a&&b?'<g data-canvas-wire="'+esc(w.id)+'" data-canvas-from="'+esc(w.from)+'" data-canvas-to="'+esc(w.to)+'" role="button" tabindex="0" aria-label="Wire '+esc(w.id)+(w.closed?' connected':' open')+'"><path class="canvas-wire-hit" d="'+line(a,b)+'"/><path class="canvas-wire '+(!w.closed?'canvas-open':'')+'" d="'+line(a,b)+'"/></g>':'';}).join('');
 const components=circuit.components.map(p=>{const pos=layout.positions[p.id];return '<g data-canvas-part="'+esc(p.id)+'" class="canvas-part '+(ui.selectedPart===p.id?'canvas-selected':'')+(p.state.open?' canvas-open':'')+'" transform="translate('+pos.x+' '+pos.y+')" role="button" tabindex="0" aria-label="Edit '+esc(p.label||p.id)+'"><rect x="-85" y="-62" width="170" height="94" fill="transparent"/><g transform="translate(-80 -30)">'+(p.type==='resistor'?resistorBody(p.properties):sourceBody())+'</g><text y="-44" text-anchor="middle">'+esc((p.label||p.id)+' · '+(p.type==='resistor'?formatResistance(p.properties.resistanceOhms):p.properties.voltageVolts+' V set'))+(p.state.open?' · OPEN':p.type==='dc-source'&&!circuit.state.powered?' · OFF':'')+'</text></g>';}).join('');
 const targets=terminals.map(t=>'<g data-canvas-terminal="'+esc(t.id)+'" data-canvas-node="'+esc(t.nodeId)+'" class="canvas-terminal '+(ui.firstTerminal===t.id?'canvas-selected':'')+'" transform="translate('+t.x+' '+t.y+')" role="button" tabindex="0" aria-label="'+esc(t.componentId+' '+t.id+' node '+t.nodeId)+'"><circle r="22" class="terminal-target"/><circle r="7" class="terminal-contact"/><text y="44" text-anchor="middle">'+esc((circuit.components.find(p=>p.id===t.componentId)?.label||t.componentId)+' '+(circuit.components.find(p=>p.id===t.componentId)?.type==='dc-source'?(t.id===circuit.components.find(p=>p.id===t.componentId)?.terminals[0]?.id?'＋':'−'):(t.id===circuit.components.find(p=>p.id===t.componentId)?.terminals[0]?.id?'A':'B')))+'</text>'+(t.nodeId===circuit.groundNode?'<path d="M-14 60 H14 M-9 67 H9 M-4 74 H4" stroke="#a5eeee" stroke-width="3"/>':'')+'</g>').join('');
 const wireEnds=circuit.connections.filter(w=>w.id===ui.selectedWire).map(w=>['from','to'].map(end=>{const t=terminal(w[end]);return '<g data-canvas-wire-end="'+end+'" data-canvas-wire-id="'+esc(w.id)+'" transform="translate('+t.x+' '+t.y+')" role="button" tabindex="0" aria-label="Reroute '+end+' end of wire '+esc(w.id)+'"><path d="M0 0 L0 -30" stroke="#f4dd79"/><circle cy="-30" r="13" fill="#2d5659" stroke="#f4dd79" stroke-width="3"/></g>';}).join('')).join('');
 const probe=circuit.instruments[0],probes=probe&&ui.instrumentSettings?.mode!=='current'?['red','black'].map((color,i)=>{const node=probe[color==='red'?'redNode':'blackNode'],t=canvasProbeTerminal(circuit,layout,color),x=t?.x??1040,y=t?.y??(180+i*150);return '<g class="canvas-probe '+color+'"><path data-canvas-probe-wire="'+color+'" d="M1230 '+(120+i*110)+' C1100 40 '+x+' '+(y-110)+' '+x+' '+y+'"/><g data-canvas-probe="'+color+'" transform="translate('+x+' '+y+')" role="button" tabindex="0" data-contact-state="'+probeContact(circuit,color).state+'" data-contact-terminal="'+esc(t?.id||'')+'" data-contact-node="'+esc(node)+'" aria-label="Move '+color+' probe; '+esc(probeContact(circuit,color).state)+'"><circle cx="30" cy="-35" r="18"/><path d="M0 0 L30 -35" pointer-events="none"/><text x="58" y="-40">'+color+' · '+esc(t?(circuit.components.find(p=>p.id===t.componentId)?.label||t.componentId)+' '+(t.id===circuit.components.find(p=>p.id===t.componentId)?.terminals[0]?.id?'A':'B'):'unattached')+'</text></g></g>';}).join(''):'';
 const tools=[['resistor','Resistor'],['source','DC supply'],['wire','Wire'],['ground','Reference'],['inspect','Select'],['fault','Open path']];
 return '<section class="freeform-canvas" aria-label="Freeform DC circuit canvas"><div class="canvas-toolbar" role="toolbar" aria-label="Circuit tools">'+tools.map(([id,label])=>graphicButton('canvas-tool',id,label,ui.tool===id,partIcon(id))).join('')+graphicButton('canvas-cancel','','Cancel')+graphicButton('canvas-undo','','Undo')+graphicButton('canvas-redo','','Redo')+'</div><p data-canvas-instruction role="status">'+esc(ui.message||({resistor:'Click empty canvas to place a 1 kΩ resistor.',source:'Power off, then click empty canvas to place a 5 V unipolar supply.',wire:ui.firstTerminal?'Choose the second terminal.':'Choose the first terminal.',ground:'Choose the reference terminal.',fault:'Click a component or wire to open/reconnect it.'}[ui.tool]||'Drag a component to move it; click to edit. Drag red/black probe tips onto a terminal, or select a probe then click a terminal.'))+'</p><div class="circuit-canvas-viewport"><svg class="circuit-canvas-world" viewBox="0 0 '+canvasSize.width+' '+canvasSize.height+'" data-canvas-world aria-label="Editable circuit" role="group"><defs><pattern id="canvas-grid" width="25" height="25" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="1" fill="#35525c"/></pattern></defs><rect data-canvas-background width="1400" height="900" fill="url(#canvas-grid)"/>'+implicit+wires+components+targets+wireEnds+probes+'</svg></div><p class="muted sm">Shared node lines represent existing electrical joins; added wires connect exact terminal IDs. DC resistors and ideal voltage sources only. Probe tips snap within 24 screen pixels; yellow targets are previews until release. Select a wire to reveal its end grips. Dragging parts preserves their electrical joins.</p></section>';
}
// Shared pointer adapter: DOM geometry never becomes electrical state until a valid snap/edit.
export function attachCircuitCanvasPointers(root,getState,onAction,onFeedback){
 let drag=null,suppressClick=false;
 const point=(event,svg)=>{const matrix=svg.getScreenCTM();if(!matrix)throw Error('Canvas is not visible');return new DOMPoint(event.clientX,event.clientY).matrixTransform(matrix.inverse());};
 const limit=p=>({x:Math.max(90,Math.min(1310,p.x)),y:Math.max(70,Math.min(830,p.y))});
 function candidates(state,kind){return kind==='board-probe'?breadboardHoles.map(id=>({id,...boardPoint(id)})):canvasTerminals(state.circuit,state.layout);}
 function snap(svg,state,kind,endpoint,pointer){
  const matrix=svg.getScreenCTM();if(!matrix)return null;
  const nearest=p=>{const screen=new DOMPoint(p.x,p.y).matrixTransform(matrix);return candidates(state,kind).map(t=>{const q=new DOMPoint(t.x,t.y).matrixTransform(matrix);return {...t,distance:Math.hypot(q.x-screen.x,q.y-screen.y)};}).filter(t=>t.distance<=24).sort((a,b)=>a.distance-b.distance)[0]||null;};
  // A physical tip is authoritative; accepting a handle dropped directly on a
  // contact is a forgiving alternative. Preview shows exactly which will commit.
  return nearest(endpoint)||nearest(pointer);
 }
 function restore(d){d.target.setAttribute('transform',d.originalTransform);for(const [p,path] of d.paths)p.setAttribute('d',path);delete d.svg.dataset.snapContact;delete d.svg.dataset.connectionState;for(const e of root.querySelectorAll('.contact-snap-target'))e.classList.remove('contact-snap-target');}
 function down(e){
  if(e.button!==0)return;const svg=e.target.closest('[data-canvas-world],.direct-board-svg');if(!svg)return;
  const boardProbe=e.target.closest('[data-board-probe-draggable]'),probe=e.target.closest('[data-canvas-probe]')||boardProbe,part=e.target.closest('[data-canvas-part]'),wireEnd=e.target.closest('[data-canvas-wire-end]');if(!probe&&!part&&!wireEnd)return;
  const state=getState();if(state.locked||!probe&&!wireEnd&&state.ui.tool!=='inspect')return;
  const id=probe?.dataset.canvasProbe||probe?.dataset.boardProbe||wireEnd?.dataset.canvasWireId||part.dataset.canvasPart,wire=wireEnd&&state.circuit.connections.find(w=>w.id===id),end=wireEnd?.dataset.canvasWireEnd;
  const position=part?state.layout.positions[id]:boardProbe?(state.board.probeConnected?.[id]===false?{x:750,y:id==='red'?500:560}:boardPoint(state.board.probes[id])):wireEnd?canvasTerminals(state.circuit,state.layout).find(t=>t.id===wire[end]):canvasProbeTerminal(state.circuit,state.layout,id)||{x:1040,y:id==='red'?180:330};
  const target=probe||wireEnd||part,paths=wireEnd?[...svg.querySelector('[data-canvas-wire="'+id+'"]').querySelectorAll('path')]:[...svg.querySelectorAll('[data-canvas-probe-wire="'+id+'"],[data-board-probe-wire="'+id+'"]')];
  drag={svg,target,id,end,wire,kind:boardProbe?'board-probe':probe?'probe':wireEnd?'wire-end':'part',start:point(e,svg),position,moved:false,pointerId:e.pointerId,projectId:state.projectId,originalTransform:target.getAttribute('transform'),paths:paths.map(p=>[p,p.getAttribute('d')])};
  svg.setPointerCapture(e.pointerId);e.preventDefault();
 }
 function move(e){
  if(!drag||drag.pointerId!==e.pointerId)return;const d=drag,p=point(e,d.svg);if(Math.hypot(p.x-d.start.x,p.y-d.start.y)>5)d.moved=true;if(!d.moved)return;
  const endpoint={x:d.position.x+p.x-d.start.x,y:d.position.y+p.y-d.start.y},target=d.kind==='part'?null:snap(d.svg,getState(),d.kind,endpoint,p),pos=d.kind==='part'?limit(endpoint):target||endpoint;
  d.snap=target;d.lastPoint=p;d.target.setAttribute('transform','translate('+pos.x+' '+pos.y+')');d.svg.dataset.connectionState='pending';
  for(const el of root.querySelectorAll('.contact-snap-target'))el.classList.remove('contact-snap-target');
  if(target){d.svg.dataset.snapContact=target.id;root.querySelector(d.kind==='board-probe'?'[data-breadboard-hole="'+target.id+'"]':'[data-canvas-terminal="'+target.id+'"]')?.classList.add('contact-snap-target');}else delete d.svg.dataset.snapContact;
  if(d.kind==='probe'||d.kind==='board-probe')for(const [path] of d.paths)path.setAttribute('d','M'+(d.kind==='board-probe'?780:1230)+' '+(d.id==='red'?120:230)+' Q'+pos.x+' 40 '+pos.x+' '+pos.y);
  if(d.kind==='wire-end'){const state=getState(),other=canvasTerminals(state.circuit,state.layout).find(t=>t.id===d.wire[d.end==='from'?'to':'from']);for(const [path] of d.paths)path.setAttribute('d',d.end==='from'?line(pos,other):line(other,pos));}
 }
 function finish(e,cancel=false){
  if(!drag||drag.pointerId!==e.pointerId)return;const d=drag;drag=null;if(d.svg.hasPointerCapture(e.pointerId))d.svg.releasePointerCapture(e.pointerId);restore(d);
  if(!d.moved&&!cancel){if(d.kind==='part'&&!getState().locked&&getState().projectId===d.projectId)onAction({type:'select-part',id:d.id});return;}
  suppressClick=true;setTimeout(()=>{suppressClick=false;},0);
  try{if(cancel)throw Error('Move canceled; previous connection retained');const state=getState();if(state.projectId!==d.projectId)throw Error('The project changed; previous drag canceled');if(state.locked)throw Error('Editing paused during project transfer or conflict');
   const p=point(e,d.svg),endpoint={x:d.position.x+p.x-d.start.x,y:d.position.y+p.y-d.start.y};
   if(d.kind==='part'){onAction({type:'move',id:d.id,position:limit(endpoint)});return;}
   const target=snap(d.svg,state,d.kind,endpoint,p);if(!target)throw Error('No contact snapped; previous connection retained. Use Detach to unplug a probe.');
   if(d.kind==='board-probe')onAction({type:'board-probe',probe:d.id,hole:target.id});
   else if(d.kind==='wire-end')onAction({type:'reroute-wire',id:d.id,[d.end]:target.id});
   else onAction({type:'probe',probe:d.id,terminal:target.id});
  }catch(error){onFeedback(error.message);}
 }
 const up=e=>finish(e),cancel=e=>finish(e,true),key=e=>{if(e.key==='Escape'&&drag){e.preventDefault();finish({pointerId:drag.pointerId},true);}},click=e=>{if(suppressClick){e.stopImmediatePropagation();e.preventDefault();suppressClick=false;}};
 root.addEventListener('pointerdown',down);root.addEventListener('pointermove',move);root.addEventListener('pointerup',up);root.addEventListener('pointercancel',cancel);root.addEventListener('keydown',key,true);root.addEventListener('click',click,true);
 return ()=>{if(drag){restore(drag);if(drag.svg.hasPointerCapture(drag.pointerId))drag.svg.releasePointerCapture(drag.pointerId);drag=null;}root.removeEventListener('pointerdown',down);root.removeEventListener('pointermove',move);root.removeEventListener('pointerup',up);root.removeEventListener('pointercancel',cancel);root.removeEventListener('keydown',key,true);root.removeEventListener('click',click,true);};
}
