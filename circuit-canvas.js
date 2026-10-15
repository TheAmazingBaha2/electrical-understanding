// Editing adapter for the existing graph. There is no electrical solver here.
import {validateCircuit,withProbeContact,probeContact} from './circuit-model.js';
import {assertSerializable} from './data-contract.js';
import {validateResistorMetadata} from './resistor-color.js';
export const canvasSize={width:1400,height:900};
const clone=structuredClone;
export function validateCanvasLayout(layout,circuit){
 assertSerializable(layout);if(layout?.schemaVersion!==1||!layout.positions||Array.isArray(layout.positions))throw Error('Unsupported canvas layout; original preserved');
 for(const position of Object.values(layout.positions))if(!position||!Number.isFinite(position.x)||!Number.isFinite(position.y)||position.x<90||position.x>1310||position.y<70||position.y>830)throw Error('Canvas position outside supported area');
 if(layout.wireRoutes&&(typeof layout.wireRoutes!=='object'||Array.isArray(layout.wireRoutes)))throw Error('Invalid illustrative route map');
 for(const route of Object.values(layout.wireRoutes||{}))if(!Array.isArray(route)||route.length>16||route.some(p=>!Number.isFinite(p.x)||!Number.isFinite(p.y)||p.x<0||p.x>canvasSize.width||p.y<0||p.y>canvasSize.height))throw Error('Invalid illustrative wire route');
 validateCircuit(circuit);return layout;
}
export function circuitCanvasLayout(circuit,stored){
 if(stored)validateCanvasLayout(stored,circuit);
 const layout=stored?clone(stored):{schemaVersion:1,positions:{}};
 circuit.components.forEach((p,i)=>{layout.positions[p.id]??=({V1:{x:190,y:300},R1:{x:500,y:210},R2:{x:500,y:450}}[p.id]||{x:180+(i%4)*300,y:120+(Math.floor(i/4)%5)*150});});
 validateCanvasLayout(layout,circuit);return layout;
}
export function canvasTerminals(circuit,layout){return circuit.components.flatMap(p=>p.terminals.map((t,i)=>({...t,componentId:p.id,x:layout.positions[p.id].x+(i?80:-80),y:layout.positions[p.id].y})));}
export function snapCanvasTerminal(circuit,layout,point,radius=28){
 return canvasTerminals(circuit,layout).map(t=>({...t,distance:Math.hypot(t.x-point.x,t.y-point.y)})).filter(t=>t.distance<=radius).sort((a,b)=>a.distance-b.distance)[0]||null;
}
export function canvasProbeTerminal(circuit,layout,color){
 const meter=circuit.instruments[0];if(!meter||meter[color+'Connected']===false)return null;
 const terminals=canvasTerminals(circuit,layout),node=meter[color==='red'?'redNode':'blackNode'];
 if(probeContact(circuit,color).state==='invalid')return null;
 return meter[color+'TerminalId']!==undefined?terminals.find(t=>t.id===meter[color+'TerminalId']&&t.nodeId===node)||null:terminals.find(t=>t.nodeId===node)||null;
}
export function emptyCanvasCircuit(circuit){
 const next=clone(circuit);next.components=[];next.connections=[];next.externalTerminals=[];next.state.powered=false;
 next.nodes=next.nodes.filter(n=>n.id===next.groundNode).map(n=>({...n,used:true}));
 next.instruments=next.instruments.map(i=>{const m={...i,redNode:next.groundNode,blackNode:next.groundNode,redConnected:false,blackConnected:false};delete m.redTerminalId;delete m.blackTerminalId;return m;});validateCircuit(next);return next;
}
// Shared by drag, tap-pair and keyboard. Existing saved parallel wires remain valid.
export function canvasConnectionCommand(circuit,from,to,id){
 const terminals=new Set(circuit.components.flatMap(p=>p.terminals.map(t=>t.id)));
 if(from===to||!terminals.has(from)||!terminals.has(to))throw Error('Choose two different actual terminals');
 if(circuit.connections.some(w=>w.from===from&&w.to===to||w.from===to&&w.to===from))return null;
 return {type:'connect',id,from,to};
}
export function editCircuitCanvas(circuit,layout,action){
 validateCircuit(circuit);validateCanvasLayout(layout,circuit);assertSerializable(action);
 const c=clone(circuit),l=clone(layout),terminals=canvasTerminals(c,l);
 const terminal=id=>{const t=terminals.find(t=>t.id===id);if(!t)throw Error('Choose a real component terminal');return t;};
 if(action.type==='place'){
  const {id,componentType:type,properties,position}=action;if(c.components.some(p=>p.id===id)||!['resistor','dc-source'].includes(type))throw Error('Invalid supported component/identity');
  if(type==='dc-source'&&(!Number.isFinite(properties.voltageVolts)||properties.voltageVolts<0||properties.voltageVolts>24))throw Error('Unipolar bench supply requires 0–24 V');
  if(type==='dc-source'&&c.state.powered)throw Error('Turn circuit power off before adding a source');
  if(type==='resistor')validateResistorMetadata(properties);
  const ids=[id+'.a',id+'.b'];if(ids.some(id=>c.nodes.some(n=>n.id===id)))throw Error('Component node identity already exists');
  const prefix=type==='resistor'?'R':'V',labels=new Set(c.components.map(p=>p.label||p.id));let number=1;while(labels.has(prefix+number))number++;
  c.nodes.push(...ids.map(id=>({id,used:true})));c.components.push({id,label:action.label||prefix+number,type,terminals:ids.map((nodeId,i)=>({id:id+(i?'.n':'.p'),nodeId})),properties:clone(properties),state:{open:false}});l.positions[id]=clone(position);
 }else if(action.type==='move'){
  if(!c.components.some(p=>p.id===action.id))throw Error('Component unavailable');l.positions[action.id]=clone(action.position);
 }else if(action.type==='connect'){
  if(action.from===action.to)throw Error('Choose two different terminals');terminal(action.from);terminal(action.to);
  if(c.connections.some(w=>w.id===action.id))throw Error('Wire identity exists');c.connections.push({id:action.id,from:action.from,to:action.to,closed:true});
 }else if(action.type==='route-wire'){
  if(!c.connections.some(w=>w.id===action.id))throw Error('Wire unavailable');l.wireRoutes??={};l.wireRoutes[action.id]=clone(action.points);
 }else if(action.type==='reroute-wire'){
  const wire=c.connections.find(w=>w.id===action.id);if(!wire)throw Error('Wire unavailable');
  const from=action.from??wire.from,to=action.to??wire.to;terminal(from);terminal(to);if(from===to)throw Error('Choose two different terminals');Object.assign(wire,{from,to});
 }else if(action.type==='remove-component'){
  const p=c.components.find(p=>p.id===action.id);if(!p)throw Error('Component unavailable');const ids=p.terminals.map(t=>t.id);
  c.connections=c.connections.filter(w=>!ids.includes(w.from)&&!ids.includes(w.to));c.components=c.components.filter(p=>p.id!==action.id);delete l.positions[action.id];
  for(const meter of c.instruments)for(const color of ['red','black'])if(ids.includes(meter[color+'TerminalId'])){meter[color+'Connected']=false;delete meter[color+'TerminalId'];}
 }else if(action.type==='remove-wire'){
  if(!c.connections.some(w=>w.id===action.id))throw Error('Wire unavailable');c.connections=c.connections.filter(w=>w.id!==action.id);
 }else if(action.type==='reference')c.groundNode=terminal(action.terminal).nodeId;
 else if(action.type==='probe'){
  terminal(action.terminal);Object.assign(c,withProbeContact(c,action.probe,action.terminal));
 }else if(action.type==='detach-probe'){
  Object.assign(c,withProbeContact(c,action.probe,null));
 }else if(action.type==='open'){
  const part=c.components.find(p=>p.id===action.id),wire=c.connections.find(w=>w.id===action.id);if(typeof action.open!=='boolean'||!part&&!wire)throw Error('Path unavailable');if(part)part.state.open=action.open;else wire.closed=!action.open;
 }else if(action.type==='properties'){const part=c.components.find(p=>p.id===action.id);if(!part)throw Error('Component unavailable');validateResistorMetadata(action.properties);if(part.type==='dc-source'&&action.properties.voltageVolts<0&&part.properties.voltageVolts>=0)throw Error('Unipolar bench supply requires 0–24 V');Object.assign(part.properties,action.properties);}
 else if(action.type==='power'){if(typeof action.powered!=='boolean')throw Error('Explicit power state required');c.state.powered=action.powered;}
 else if(action.type==='clear'){return {circuit:emptyCanvasCircuit(c),layout:{...l,positions:{},...(l.wireRoutes?{wireRoutes:{}}:{})}};}
 else throw Error('Unsupported canvas edit');
 // Retain floating probe/reference nodes, but do not exhaust capacity with removed parts.
 const used=new Set([c.groundNode,...c.components.flatMap(p=>p.terminals.map(t=>t.nodeId)),...(c.externalTerminals||[]).map(t=>t.nodeId),...c.instruments.flatMap(i=>[i.redNode,i.blackNode])]);
 if(action.type==='remove-component')c.nodes=c.nodes.filter(n=>used.has(n.id));
 validateCircuit(c);validateCanvasLayout(l,c);return {circuit:c,layout:l};
}
export function canvasHistoryEdit(circuit,layout,history,action,componentInventory){
 const result=editCircuitCanvas(circuit,layout,action);
 return {...result,history:{schemaVersion:1,undo:[...(history?.undo||[]),{circuit:clone(circuit),layout:clone(layout),...(componentInventory!==undefined?{componentInventory:clone(componentInventory)}:{})}].slice(-50),redo:[]}};
}
export function canvasHistoryRestore(circuit,layout,history,direction,componentInventory){
 if(!['undo','redo'].includes(direction)||!history?.[direction]?.length)throw Error('No '+direction+' available');
 const source=clone(history),value=source[direction].pop(),opposite=direction==='undo'?'redo':'undo';validateCircuit(value.circuit);validateCanvasLayout(value.layout,value.circuit);
 source[opposite]=[...(source[opposite]||[]),{circuit:clone(circuit),layout:clone(layout),...(componentInventory!==undefined?{componentInventory:clone(componentInventory)}:{})}].slice(-50);return {...value,history:source};
}
