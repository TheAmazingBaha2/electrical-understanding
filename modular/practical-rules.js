// Reuses the existing circuit graph, DC solver, shared meter and resistor model.
import {circuitNodeMap,validateCircuit,dividerCircuit} from '../circuit-model.js';
import {sharedMeterReading} from '../shared-multimeter.js';
import {decodeBands,encodeResistance} from '../resistor-color.js';

export function assertPracticalDefinition(definition){
 const ids=definition.activities.map(a=>a.id);if(new Set(ids).size!==ids.length)throw Error('Duplicate practical activity');
 if(!definition.activities.some(a=>a.required))throw Error('Practical module needs a required outcome');
 for(const a of definition.activities){const r=a.rubric;
  if(r.kind==='divider-voltage@1'&&r.sourceVolts>24)throw Error('Practical source exceeds educational bench limit');
  if(r.kind==='divider-voltage@1'){
   const c=dividerCircuit();c.components[0].properties.voltageVolts=r.sourceVolts;c.components.find(p=>p.id==='R1').properties.resistanceOhms=r.upperOhms;c.components.find(p=>p.id==='R2').properties.resistanceOhms=r.lowerOhms;
   const part={source:'V1',upper:'R1',lower:'R2'}[r.fault.split('-')[0]];if(r.fault!=='none'){const target=c.components.find(p=>p.id===part)||c.components[0];target.state.open=true;}
   const reading=sharedMeterReading(c,{mode:'voltage',jack:'VΩ'});if(reading.status!=='valid'||Math.abs(reading.value-r.expectedVolts)>r.tolerance)throw Error('Rubric expectation disagrees with the shared circuit engine');
  }
  if(r.kind==='resistor-bands@1'){const code=encodeResistance(r.nominalOhms,r.bandCount,r.tolerancePercent);if(!code.representable||!code.toleranceRepresentable)throw Error('Unrepresentable resistor rubric');}
  if(r.kind==='meter-state@1'){
   if(['resistance','continuity'].includes(r.mode)&&r.powered)throw Error('Powered resistance/continuity rubric is unsafe');
   if(r.mode==='current'&&(!r.branchRole||!r.powered))throw Error('Current rubric needs an energized prepared branch');
   if(r.mode!=='current'&&(r.branchRole!==undefined||r.magnitude!==undefined))throw Error('Series branch contract belongs to current mode');
  }
 }
 return definition;
}
export function dividerRoles(circuit){
 validateCircuit(circuit);const sources=circuit.components.filter(p=>p.type==='dc-source'),resistors=circuit.components.filter(p=>p.type==='resistor');
 if(sources.length!==1||resistors.length!==2)throw Error('Use one DC source and exactly two resistors for this bounded activity');
 const nets=circuitNodeMap(circuit),source=sources[0],positive=nets[source.terminals[0].nodeId],common=nets[source.terminals[1].nodeId];
 if(positive===common||nets[circuit.groundNode]!==common)throw Error('Verify source polarity and the common reference; a short is not a divider');
 for(const upper of resistors){const upperNets=upper.terminals.map(t=>nets[t.nodeId]);if(!upperNets.includes(positive))continue;const output=upperNets.find(n=>n!==positive);if(output===undefined||output===common)continue;
  const lower=resistors.find(r=>r!==upper),lowerNets=lower.terminals.map(t=>nets[t.nodeId]);if(new Set(lowerNets).size===2&&lowerNets.includes(output)&&lowerNets.includes(common))return {source,upper,lower,nets,nodes:{source:positive,output,common}};
 }
 throw Error('The resistors must form source → upper resistor → output → lower resistor → common');
}
const near=(a,b,t)=>Number.isFinite(a)&&Math.abs(a-b)<=t;
export function evaluatePracticalState(rubric,submission){
 if(rubric.kind==='resistor-bands@1'){
  const decoded=decodeBands(submission.colors);const correct=decoded.bandCount===rubric.bandCount&&decoded.resistanceOhms===rubric.nominalOhms&&decoded.tolerancePercent===rubric.tolerancePercent;
  return {correct,observation:decoded,feedback:correct?'The actual band code matches the requested nominal resistance and tolerance.':'Decode the selected bands; nominal value, tolerance and band count must all match.'};
 }
 const c=submission.circuit,settings=submission.settings||{},roles=dividerRoles(c),meter=c.instruments[0];if(!meter)throw Error('A shared meter is required');
 const reading=sharedMeterReading(c,settings),probeMatches=(red,black)=>roles.nets[meter.redNode]===roles.nodes[red]&&roles.nets[meter.blackNode]===roles.nodes[black];
 if(rubric.kind==='divider-voltage@1'){
  const requiredOpen={source:rubric.fault==='source-open',upper:rubric.fault==='upper-open',lower:rubric.fault==='lower-open'};
  const stateMatches=c.state.powered&&Object.entries(requiredOpen).every(([role,open])=>roles[role].state.open===open)&&near(roles.source.properties.voltageVolts,rubric.sourceVolts,1e-9)&&near(roles.upper.properties.resistanceOhms,rubric.upperOhms,1e-9)&&near(roles.lower.properties.resistanceOhms,rubric.lowerOhms,1e-9);
  const correct=stateMatches&&probeMatches('output','common')&&settings.mode==='voltage'&&reading.status==='valid'&&near(reading.value,rubric.expectedVolts,rubric.tolerance);
  return {correct,observation:{reading,configuredSourceVolts:roles.source.properties.voltageVolts,fault:rubric.fault},feedback:correct?'The actual divider topology, values, fault state and shared meter reading agree.':'Check the wiring, configured values, open connection, voltage jack and both probe contacts. A matching number alone is insufficient.'};
 }
 const branch=roles[rubric.branchRole],connection=settings.currentConnection;
 const contacts=rubric.mode==='current'?connection?.componentId===branch?.id&&connection?.preparedWithPowerOff===true:probeMatches(rubric.redRole,rubric.blackRole);
 const value=rubric.magnitude?Math.abs(reading.value):reading.value;
 const correct=c.state.powered===rubric.powered&&settings.mode===rubric.mode&&contacts&&reading.status==='valid'&&near(value,rubric.expectedValue,rubric.tolerance);
 return {correct,observation:{reading,powered:c.state.powered},feedback:correct?'The shared instrument confirms the required mode, connection, power preparation and electrical result.':'Check the instrument mode, jack, power state and actual contacts/series preparation. Blocked or floating measurements cannot earn credit.'};
}
