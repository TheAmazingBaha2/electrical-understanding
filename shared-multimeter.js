// Reusable ideal instrument adapter. Every number derives from the shared graph/solver.
import {solveDC,measureVoltage,circuitNodeMap,validateCircuit} from './circuit-model.js';
export const circuitEnergized=c=>c.state.powered&&c.components.some(p=>p.type==='dc-source'&&!p.state.open);
export function resistanceReading(c,redNode,blackNode){
 validateCircuit(c);if(circuitEnergized(c))return {status:'blocked',value:null,unit:'Ω',reason:'Disconnect modeled sources before resistance or continuity measurement. Actual equipment also requires stored-energy verification.'};
 const nets=circuitNodeMap(c);if(!Object.hasOwn(nets,redNode)||!Object.hasOwn(nets,blackNode))throw Error('Unknown resistance probe node');
 if(nets[redNode]===nets[blackNode])return {status:'valid',value:0,unit:'Ω',model:'ideal-1V-test'};
 const test=structuredClone(c);test.groundNode=blackNode;test.state.powered=true;
 for(const p of test.components)if(p.type==='dc-source')p.state.open=true;
 let id='METER.TEST';while(test.components.some(p=>p.id===id))id+='X';
 test.components.push({id,type:'dc-source',terminals:[{id:id+'.p',nodeId:redNode},{id:id+'.n',nodeId:blackNode}],properties:{voltageVolts:1},state:{open:false}});
 const result=solveDC(test),current=-result.componentCurrents[id];
 return current>1e-15?{status:'valid',value:1/current,unit:'Ω',model:'ideal-1V-test'}:{status:'open-circuit',value:null,unit:'Ω',model:'ideal-1V-test',reason:'No conductive resistor path between the probes.'};
}
export function prepareCurrentConnection(c,componentId){
 validateCircuit(c);if(circuitEnergized(c))throw Error('Turn modeled power off before preparing a series current connection');
 if(!c.components.some(p=>p.id===componentId))throw Error('Select an existing component branch');
 return {kind:'series',componentId,polarity:'forward',preparedWithPowerOff:true};
}
export function sharedMeterReading(c,settings={}){
 validateCircuit(c);const mode=settings.mode||'voltage',jack=settings.jack||'VΩ',probe=c.instruments[0];
 if(!probe)throw Error('Meter probes are unavailable');
 if(!['voltage','resistance','continuity','current'].includes(mode))return {status:'unsupported',value:null,unit:'',reason:'Unsupported instrument mode'};
 if(jack!==(mode==='current'?'A':'VΩ'))return {status:'blocked',value:null,unit:'',reason:'Use '+(mode==='current'?'A':'VΩ')+' for red and COM for black. No unsafe connection was energized.'};
 if(mode==='voltage'){const result=measureVoltage(c,probe.redNode,probe.blackNode);return {...result,value:result.valueVolts,unit:'V',mode};}
 if(mode==='resistance'||mode==='continuity'){
  const result=resistanceReading(c,probe.redNode,probe.blackNode);return {...result,mode,...(mode==='continuity'?{continuity:result.status==='valid'&&result.value<=30,thresholdOhms:30}:{})};
 }
 const connection=settings.currentConnection,part=c.components.find(p=>p.id===connection?.componentId);
 if(connection?.kind!=='series'||connection.preparedWithPowerOff!==true||!part)return {status:'blocked',value:null,unit:'A',reason:'Turn power off, select a component branch, and explicitly prepare the virtual meter in series. Across-node current probing is blocked.'};
 const current=solveDC(c).componentCurrents[part.id],raw=current===null?null:current*(connection.polarity==='reverse'?-1:1),value=Object.is(raw,-0)?0:raw;
 return {status:value===null?'floating-reference':'valid',value,unit:'A',mode,componentId:part.id,model:'ideal-zero-burden-series',reason:'Ideal series measurement through '+(part.label||part.id)+', terminal 1 → terminal 2. The zero-burden meter leaves this DC circuit state unchanged.'};
}
export function formatMeterReading(r){
 if(r.status==='blocked')return 'TEST BLOCKED';if(r.status==='open-circuit')return 'OL';if(r.value===null||!Number.isFinite(r.value))return 'UNKNOWN';
 if(r.unit==='V')return (Math.abs(r.value)<5e-13?0:r.value).toFixed(3)+' V';
 const a=Math.abs(r.value),scale=r.unit==='A'?(a>0&&a<.001?1e6:a<1?1000:1):a>=1e6?1e-6:a>=1000?1e-3:1;
 const prefix=r.unit==='A'?(scale===1e6?'µ':scale===1000?'m':''):(scale===1e-6?'M':scale===1e-3?'k':'');
 return (r.value*scale).toFixed(3)+' '+prefix+r.unit;
}
