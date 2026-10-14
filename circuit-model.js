// Bounded modified nodal analysis. No graphics, provider calls or hidden scenario readings.
import {assertSerializable} from './data-contract.js';
export const circuitLimitations=['DC steady state only; ideal positive resistors and independent voltage sources.','Ideal voltage instrument has infinite input impedance. No AC, transient, capacitance, inductance, semiconductor or thermal analysis.','Floating potentials are unknown, never silently zero. Redundant/contradictory ideal source constraints fail.','Numerical linear solution within floating-point precision, not a physical measurement.'];
const identifier=v=>typeof v==='string'&&/^[A-Za-z0-9][A-Za-z0-9._:-]*$/.test(v);
function unique(values,label){if(values.some(v=>!identifier(v))||new Set(values).size!==values.length)throw Error('Invalid or duplicate '+label);}
export function validateCircuit(c){
 assertSerializable(c);
 if(c?.schemaVersion!==1||c.analysisMode!=='dc')throw Error('Unsupported circuit schema/analysis mode');
 if(typeof c.state?.powered!=='boolean')throw Error('Explicit circuit power state required');
 if(!Array.isArray(c.nodes)||!Array.isArray(c.components)||!Array.isArray(c.connections)||!Array.isArray(c.instruments))throw Error('Incomplete circuit');
 if(c.nodes.length>64||c.components.length>128||c.connections.length>256)throw Error('Circuit exceeds bounded solver capacity');
 unique(c.nodes.map(n=>n.id),'nodes');unique(c.components.map(n=>n.id),'components');unique(c.connections.map(n=>n.id),'connections');unique(c.instruments.map(n=>n.id),'instruments');
 const nodes=new Set(c.nodes.map(n=>n.id)),terminals=new Map();
 for(const t of c.externalTerminals||[]){if(!identifier(t.id)||terminals.has(t.id)||!nodes.has(t.nodeId))throw Error('Invalid external terminal');terminals.set(t.id,t.nodeId);}
 if(!nodes.has(c.groundNode))throw Error('Missing ground reference');
 for(const part of c.components){
  if(!['resistor','dc-source'].includes(part.type))throw Error('Unsupported component: '+part.type);
  if(!Array.isArray(part.terminals)||part.terminals.length!==2)throw Error('Two terminals required');
  for(const t of part.terminals){if(!identifier(t.id)||terminals.has(t.id)||!nodes.has(t.nodeId))throw Error('Invalid terminal');terminals.set(t.id,t.nodeId);}
  if(!part.properties||typeof part.state?.open!=='boolean')throw Error('Properties and explicit open state required');
  const value=part.type==='resistor'?part.properties.resistanceOhms:part.properties.voltageVolts;
  if(!Number.isFinite(value)||part.type==='resistor'&&(value<.001||value>1e9)||part.type==='dc-source'&&Math.abs(value)>24)throw Error('Unsupported electrical property range');
 }
 for(const wire of c.connections)if(!terminals.has(wire.from)||!terminals.has(wire.to)||typeof wire.closed!=='boolean')throw Error('Invalid wire');
 for(const instrument of c.instruments)if(instrument.type!=='dmm'||instrument.mode!=='dc-voltage'||!nodes.has(instrument.redNode)||!nodes.has(instrument.blackNode))throw Error('Unsupported instrument or probe');
 return c;
}
function linearSolve(matrix,rhs){
 const a=matrix.map((row,i)=>[...row,rhs[i]]),n=a.length;
 for(let col=0;col<n;col++){
  let pivot=col;for(let row=col+1;row<n;row++)if(Math.abs(a[row][col])>Math.abs(a[pivot][col]))pivot=row;
  if(Math.abs(a[pivot][col])<1e-15)throw Error('Singular circuit: ideal sources are redundant/contradictory or state is unsupported');
  [a[col],a[pivot]]=[a[pivot],a[col]];const scale=a[col][col];for(let j=col;j<=n;j++)a[col][j]/=scale;
  for(let row=0;row<n;row++)if(row!==col){const factor=a[row][col];for(let j=col;j<=n;j++)a[row][j]-=factor*a[col][j];}
 }
 const result=a.map(row=>row[n]);if(result.some(v=>!Number.isFinite(v)))throw Error('Unstable circuit calculation');return result;
}
export function circuitNodeMap(c){
 validateCircuit(c);const parent=new Map(c.nodes.map(n=>[n.id,n.id]));
 const root=id=>{while(parent.get(id)!==id)id=parent.get(id);return id;};
 const terminals=new Map([...(c.externalTerminals||[]).map(t=>[t.id,t.nodeId]),...c.components.flatMap(p=>p.terminals.map(t=>[t.id,t.nodeId]))]);
 for(const wire of c.connections)if(wire.closed)parent.set(root(terminals.get(wire.from)),root(terminals.get(wire.to)));
 return Object.fromEntries(c.nodes.map(n=>[n.id,root(n.id)]));
}
export function solveDC(c){
 const netsByNode=circuitNodeMap(c),root=id=>netsByNode[id];
 const ground=root(c.groundNode),parts=c.components.filter(p=>!p.state.open&&(c.state.powered||p.type!=='dc-source')).map(p=>({...p,a:root(p.terminals[0].nodeId),b:root(p.terminals[1].nodeId)}));
 // A wire-short across an active ideal source is invalid even in a subcircuit
 // outside the chosen reference. Floating analysis must not hide this fault.
 for(const p of parts)if(p.type==='dc-source'&&p.a===p.b)throw Error('Ideal voltage source shorted by a connection: '+p.id);
 const adjacent=new Map(c.nodes.map(n=>[root(n.id),new Set()]));
 for(const p of parts){adjacent.get(p.a).add(p.b);adjacent.get(p.b).add(p.a);}
 const grounded=new Set([ground]),todo=[ground];while(todo.length){for(const next of adjacent.get(todo.pop()))if(!grounded.has(next)){grounded.add(next);todo.push(next);}}
 const nets=[...grounded].filter(id=>id!==ground),indices=new Map(nets.map((id,i)=>[id,i]));
 const sources=parts.filter(p=>p.type==='dc-source'&&grounded.has(p.a));
 const size=nets.length+sources.length,matrix=Array.from({length:size},()=>Array(size).fill(0)),rhs=Array(size).fill(0);
 const stamp=(a,b,value)=>{if(indices.has(a)&&indices.has(b))matrix[indices.get(a)][indices.get(b)]+=value;};
 for(const p of parts.filter(p=>p.type==='resistor'&&grounded.has(p.a))){const g=1/p.properties.resistanceOhms;stamp(p.a,p.a,g);stamp(p.b,p.b,g);stamp(p.a,p.b,-g);stamp(p.b,p.a,-g);}
 for(const [i,p] of sources.entries()){const sourceIndex=nets.length+i;for(const [node,sign] of [[p.a,1],[p.b,-1]])if(indices.has(node)){matrix[indices.get(node)][sourceIndex]+=sign;matrix[sourceIndex][indices.get(node)]+=sign;}rhs[sourceIndex]=p.properties.voltageVolts;}
 const values=size?linearSolve(matrix,rhs):[],nodeVoltages={};
 for(const node of c.nodes){const net=root(node.id);nodeVoltages[node.id]=net===ground?0:indices.has(net)?values[indices.get(net)]:null;}
 const componentCurrents={};for(const part of c.components){
  if(part.state.open||!c.state.powered&&part.type==='dc-source'){componentCurrents[part.id]=0;continue;}
  const [a,b]=part.terminals.map(t=>nodeVoltages[t.nodeId]);
  componentCurrents[part.id]=a===null||b===null?null:part.type==='resistor'?(a-b)/part.properties.resistanceOhms:values[nets.length+sources.findIndex(p=>p.id===part.id)];
 }
 return {analysisMode:'dc',nodeVoltages,componentCurrents,floatingNodes:c.nodes.filter(n=>nodeVoltages[n.id]===null).map(n=>n.id),limitations:circuitLimitations};
}
export function measureVoltage(c,redNode,blackNode,result=solveDC(c)){
 if(!c.nodes.some(n=>n.id===redNode)||!c.nodes.some(n=>n.id===blackNode))throw Error('Unknown measurement node');
 const red=result.nodeVoltages[redNode],black=result.nodeVoltages[blackNode];
 return {mode:'dc-voltage',redNode,blackNode,valueVolts:red===null||black===null?null:red-black,status:red===null||black===null?'floating-reference':'valid',model:'ideal-infinite-impedance',analysisMode:'dc'};
}
export function dividerCircuit(){return {
 schemaVersion:1,analysisMode:'dc',groundNode:'common',nodes:[{id:'common'},{id:'source'},{id:'output'}],
 components:[{id:'V1',type:'dc-source',terminals:[{id:'V1.p',nodeId:'source'},{id:'V1.n',nodeId:'common'}],properties:{voltageVolts:5},state:{open:false}},
 {id:'R1',type:'resistor',terminals:[{id:'R1.a',nodeId:'source'},{id:'R1.b',nodeId:'output'}],properties:{resistanceOhms:1000},state:{open:false}},
 {id:'R2',type:'resistor',terminals:[{id:'R2.a',nodeId:'output'},{id:'R2.b',nodeId:'common'}],properties:{resistanceOhms:1000},state:{open:false}}],
 connections:[],instruments:[{id:'DMM1',type:'dmm',mode:'dc-voltage',redNode:'output',blackNode:'common'}],state:{powered:true}
};}
