// Electrical connectivity adapter, not a simulation engine. Rows and rail sections
// map to the shared circuit graph; the existing solveDC supplies all measurements.
import {assertSerializable} from './data-contract.js';
import {validateCircuit} from './circuit-model.js';
export const breadboardRows=12;
export function holeNode(hole){
 const match=/^([A-J]|LP|LN|RP|RN)([1-9]|1[0-2])$/.exec(hole||'');if(!match)throw Error('Unknown breadboard hole');
 const [,column,index]=match,row=Number(index);
 return column.length===1?'bb.row.'+(column<'F'?'left':'right')+'.'+row:'bb.rail.'+column+'.'+(row<=6?'upper':'lower');
}
export const breadboardHoles=[...Array.from({length:12},(_,i)=>[...'ABCDEFGHIJ'].map(c=>c+(i+1))).flat(),...['LP','LN','RP','RN'].flatMap(c=>Array.from({length:12},(_,i)=>c+(i+1)))];
const label=node=>node.startsWith('bb.row.')?(node.includes('.left.')?'Left A–E':'Right F–J')+' row '+node.split('.').at(-1):node.replace('bb.rail.','Rail ').replaceAll('.',' ');
export function emptyBreadboard(){return {schemaVersion:1,rows:12,railSplitAfter:6,placements:[],wires:[],probes:{red:'F1',black:'LN1'},groundHole:'LN1',powered:true};}
export function validateBreadboard(s){
 assertSerializable(s);if(s?.schemaVersion!==1||s.rows!==12||s.railSplitAfter!==6||!Array.isArray(s.placements)||!Array.isArray(s.wires)||typeof s.powered!=='boolean')throw Error('Unsupported breadboard layout');
 holeNode(s.groundHole);holeNode(s.probes?.red);holeNode(s.probes?.black);
 const ids=new Set(),occupied=new Set();for(const p of s.placements){
  if(!p.id||ids.has(p.id)||!['resistor','dc-source'].includes(p.type)||!Array.isArray(p.holes)||p.holes.length!==2)throw Error('Invalid component placement');ids.add(p.id);
  for(const hole of p.holes){holeNode(hole);if(occupied.has(hole))throw Error('A component terminal already occupies this hole');occupied.add(hole);}
 }
 const wireIds=new Set();for(const w of s.wires){if(!w.id||wireIds.has(w.id)||w.fromHole===w.toHole||typeof w.closed!=='boolean')throw Error('Invalid wire');wireIds.add(w.id);holeNode(w.fromHole);holeNode(w.toHole);}
 return s;
}
export function compileBreadboard(s){
 validateBreadboard(s);const used=new Set([s.groundHole,s.probes.red,s.probes.black,...s.placements.flatMap(p=>p.holes),...s.wires.filter(w=>w.closed).flatMap(w=>[w.fromHole,w.toHole])].map(holeNode));
 const c={schemaVersion:1,analysisMode:'dc',groundNode:holeNode(s.groundHole),nodes:[...new Set(breadboardHoles.map(holeNode))].map(id=>({id,label:label(id),used:used.has(id)})),
  externalTerminals:breadboardHoles.map(hole=>({id:'BB.'+hole,nodeId:holeNode(hole)})),
  components:s.placements.map(p=>({id:p.id,label:p.label||p.id,type:p.type,terminals:p.holes.map((hole,i)=>({id:p.id+'.'+(i?'b':'a'),nodeId:holeNode(hole)})),properties:structuredClone(p.properties),state:structuredClone(p.state)})),
  connections:s.wires.map(w=>({id:w.id,from:'BB.'+w.fromHole,to:'BB.'+w.toHole,closed:w.closed})),instruments:[{id:'DMM1',type:'dmm',mode:'dc-voltage',redNode:holeNode(s.probes.red),blackNode:holeNode(s.probes.black)}],state:{powered:s.powered}};
 validateCircuit(c);return c;
}
export function dividerBreadboard(){
 const s=emptyBreadboard();s.placements=[{id:'V1',type:'dc-source',holes:['LP1','LN1'],properties:{voltageVolts:5},state:{open:false}},{id:'R1',type:'resistor',holes:['A1','F1'],properties:{resistanceOhms:1000},state:{open:false}},{id:'R2',type:'resistor',holes:['G1','F2'],properties:{resistanceOhms:1000},state:{open:false}}];
 s.wires=[{id:'W1',fromHole:'LP2',toHole:'B1',closed:true},{id:'W2',fromHole:'LN2',toHole:'G2',closed:true}];s.probes={red:'H1',black:'LN3'};return s;
}
export function editBreadboard(s,action){
 const next=structuredClone(s),p=next.placements.find(p=>p.id===action.id),w=next.wires.find(w=>w.id===action.id);
 if(action.type==='place')next.placements.push(structuredClone(action.component));
 else if(action.type==='move'){if(!p)throw Error('Component not found');p.holes=[...action.holes];}
 else if(action.type==='remove-component'){if(!p)throw Error('Component not found');next.placements=next.placements.filter(p=>p.id!==action.id);}
 else if(action.type==='connect')next.wires.push(structuredClone(action.wire));
 else if(action.type==='remove-wire'){if(!w)throw Error('Wire not found');next.wires=next.wires.filter(w=>w.id!==action.id);}
 else if(action.type==='reroute-wire'){if(!w)throw Error('Wire not found');w.fromHole=action.fromHole;w.toHole=action.toHole;}
 else if(action.type==='probe'){if(!['red','black'].includes(action.probe))throw Error('Unknown probe');next.probes[action.probe]=action.hole;}
 else if(action.type==='reference'){holeNode(action.hole);next.groundHole=action.hole;}
 else if(action.type==='power')next.powered=action.powered;
 else if(action.type==='open'){if(p)p.state.open=action.open;else if(w)w.closed=!action.open;else throw Error('Path not found');}
 else if(action.type==='value'){if(!p)throw Error('Component not found');p.properties[p.type==='resistor'?'resistanceOhms':'voltageVolts']=action.value;}
 else if(action.type==='properties'){
  if(!p)throw Error('Component not found');const allowed=p.type==='resistor'?['resistanceOhms','tolerancePercent','bandCount']:['voltageVolts'];
  if(Object.keys(action.properties||{}).some(k=>!allowed.includes(k)))throw Error('Unsupported component configuration');
  if(action.properties.tolerancePercent!==undefined&&(!Number.isFinite(action.properties.tolerancePercent)||action.properties.tolerancePercent<=0||action.properties.tolerancePercent>20))throw Error('Tolerance must be greater than 0 and at most 20 percent');
  if(action.properties.bandCount!==undefined&&![4,5].includes(action.properties.bandCount))throw Error('Use four or five band positions');
  Object.assign(p.properties,action.properties);
 }
 else throw Error('Unsupported board edit');
 compileBreadboard(next);return next;
}
export function newBoardHistory(state=dividerBreadboard()){compileBreadboard(state);return {schemaVersion:1,state:structuredClone(state),undo:[],redo:[]};}
export function boardHistoryEdit(history,action){const next=editBreadboard(history.state,action);return {schemaVersion:1,state:next,undo:[...history.undo,structuredClone(history.state)].slice(-50),redo:[]};}
export function boardUndo(history){if(!history.undo.length)return history;const state=history.undo.at(-1);compileBreadboard(state);return {schemaVersion:1,state:structuredClone(state),undo:history.undo.slice(0,-1),redo:[...history.redo,structuredClone(history.state)]};}
export function boardRedo(history){if(!history.redo.length)return history;const state=history.redo.at(-1);compileBreadboard(state);return {schemaVersion:1,state:structuredClone(state),undo:[...history.undo,structuredClone(history.state)],redo:history.redo.slice(0,-1)};}
