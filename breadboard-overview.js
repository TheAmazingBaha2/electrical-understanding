// Informational view of the existing graph. Editing stays on large native buttons.
import {breadboardHoles,holeNode,compileBreadboard} from './breadboard-model.js';
import {circuitNodeMap} from './circuit-model.js';
import {circuitSvgFrame} from './lab-visuals.js';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const columns={LP:22,LN:48,A:104,B:126,C:148,D:170,E:192,F:272,G:294,H:316,I:338,J:360,RP:418,RN:444};
const point=hole=>{holeNode(hole);const [,col,row]=/^([A-J]|LP|LN|RP|RN)(\d+)$/.exec(hole);return [columns[col],56+(Number(row)-1)*24];};
export function breadboardNet(state,hole){
 const map=circuitNodeMap(compileBreadboard(state)),net=map[holeNode(hole)];
 return breadboardHoles.filter(h=>map[holeNode(h)]===net);
}
export function renderBreadboardOverview(state,{selection=[],instrumentSettings={}}={}){
 const selected=selection.at(-1),connected=new Set(selected?breadboardNet(state,selected):[]);
 const text=(x,y,s,cl='lab-svg-info')=>'<text x="'+x+'" y="'+y+'" class="'+cl+'">'+esc(s)+'</text>';
 let inner='<rect x="4" y="4" width="464" height="346" rx="14" class="lab-board-body"/><rect x="221" y="42" width="12" height="291" rx="5" class="lab-board-trench"/>';
 // These paths show only the real internal copper, including the rail breaks.
 for(let row=1;row<=12;row++)for(const side of ['left','right']){const [x,y]=point((side==='left'?'A':'F')+row),[end]=point((side==='left'?'E':'J')+row);inner+='<path class="board-preview-strip" d="M'+x+' '+y+' H'+end+'"/>';}
 for(const rail of ['LP','LN','RP','RN'])for(const [first,last] of [[1,6],[7,12]]){const [x,y]=point(rail+first),[,end]=point(rail+last);inner+='<path class="board-preview-strip" d="M'+x+' '+y+' V'+end+'"/>';}
 inner+=text(22,30,'L+')+text(48,30,'L−')+text(418,30,'R+')+text(444,30,'R−');
 for(const col of 'ABCDEFGHIJ')inner+=text(columns[col]-4,30,col);
 for(let row=1;row<=12;row++)inner+=text(238,point('A'+row)[1]+4,row);
 for(const hole of breadboardHoles){const [x,y]=point(hole);inner+='<circle cx="'+x+'" cy="'+y+'" r="4" class="lab-hole'+(connected.has(hole)?' board-net-highlight':'')+'"><title>'+hole+'</title></circle>';}
 for(const wire of state.wires){const [x,y]=point(wire.fromHole),[a,b]=point(wire.toHole);inner+='<path data-preview-wire="'+esc(wire.id)+'" class="board-preview-wire'+(wire.closed?'':' board-preview-open')+'" d="M'+x+' '+y+' Q'+((x+a)/2)+' '+(Math.min(y,b)-24)+' '+a+' '+b+'"><title>'+esc(wire.label||wire.id)+' '+wire.fromHole+' ↔ '+wire.toHole+' · '+(wire.closed?'connected':'OPEN')+'</title></path>';}
 for(const part of state.placements){
  const [x,y]=point(part.holes[0]),[a,b]=point(part.holes[1]),mx=(x+a)/2,my=(y+b)/2,angle=Math.atan2(b-y,a-x)*180/Math.PI;
  const open=part.state.open||part.type==='dc-source'&&!state.powered;
  inner+='<g data-preview-component="'+esc(part.id)+'" class="'+(open?'board-preview-open':'')+'"><title>'+esc(part.label||part.id)+' '+part.holes.join(' ↔ ')+' · '+(open?'DISCONNECTED':'connected')+'</title><path class="lab-wire" d="M'+x+' '+y+' L'+a+' '+b+'"/>';
  if(part.type==='resistor')inner+='<rect x="'+(mx-18)+'" y="'+(my-8)+'" width="36" height="16" rx="4" class="lab-resistor" transform="rotate('+angle+' '+mx+' '+my+')"/>';
  else inner+='<circle cx="'+mx+'" cy="'+my+'" r="15" class="lab-battery"/>'+text(mx-8,my+4,'+/−');
  inner+=text(mx+20,my-10,part.label||part.id);
  if(open)inner+='<path class="board-preview-break" d="M'+(mx-12)+' '+(my-12)+' l24 24 M'+(mx+12)+' '+(my-12)+' l-24 24"/>';
  inner+='</g>';
 }
 if(instrumentSettings.mode!=='current')for(const [probe,color] of [['red','#ff8e88'],['black','#153943']]){const hole=state.probes[probe],[x,y]=point(hole);inner+='<circle data-preview-probe="'+probe+'" cx="'+x+'" cy="'+y+'" r="9" fill="none" stroke="'+color+'" stroke-width="3"><title>'+probe+' probe '+hole+'</title></circle>';}
 return '<details class="breadboard-overview" open><summary>Wiring overview and connected holes</summary>'+circuitSvgFrame(inner,'Breadboard wiring overview: internal copper strips, placed components, virtual wires and meter probes. Use large hole controls below to edit.','0 0 476 358')+'<p class="muted sm">Thin gray lines: internal copper. Cyan curves: wires. Dashed orange and ×: opened paths. Rings: red/black meter probes. Source symbols show configured connections; only instrument results report voltage.</p><p data-board-net-summary>'+(selected?'Hole '+selected+' shares direct copper/wire connectivity with '+[...connected].join(', ')+'. Resistors and sources do not join these holes into one node.':'Select a hole below to highlight every contact on its copper/wire node. No precision dragging is required.')+'</p></details>';
}
