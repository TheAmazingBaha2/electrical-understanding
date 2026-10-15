import {solveDC,measureVoltage,validateCircuit} from './circuit-model.js';
export function chargeFlowRun(input){
 const {chargeMagnitudeC:q,intervalS:t,packetChargeMagnitudeC:p,packetCount:n,playbackRate=1}=input||{};
 if(![q,t,p].every(Number.isFinite)||q<=0||t<=0||p<=0||!Number.isInteger(n)||n<1||n>32||![.5,1,2].includes(playbackRate)||!Number.isFinite(p*n)||Math.abs(p*n-q)>Number.EPSILON*8*Math.max(q,p*n)||!Number.isFinite(q/t)||!Number.isFinite(t/playbackRate))throw Error('Positive finite charge/time, 1–32 aggregate packets and consistent charge totals required');
 return {chargeMagnitudeC:q,intervalS:t,packetChargeMagnitudeC:p,packetCount:n,playbackRate,currentA:q/t,displayDurationS:t/playbackRate,ledger:Array.from({length:n},(_,i)=>({id:'packet-'+(i+1),simulatedTimeS:(i+1)*t/n,chargeC:p,cumulativeChargeC:(i+1)*p}))};
}
export function bulkTransfer(initialExcessUnits,transferredUnits){
 if(!Number.isInteger(initialExcessUnits)||Math.abs(initialExcessUnits)>20||!Number.isInteger(transferredUnits)||transferredUnits<0||transferredUnits>Math.abs(initialExcessUnits))throw Error('Use a bounded signed imbalance and a finite transfer toward balance');
 return {initialExcessUnits,transferredUnits,finalExcessUnits:initialExcessUnits-Math.sign(initialExcessUnits)*transferredUnits,units:'arbitrary illustrative tokens',physicalVoltage:null,energy:null,safetyThreshold:null};
}
const validPair=(from,to)=>from==='V1.p'&&to==='R1.a'||from==='R1.a'&&to==='V1.p';
export function dcSceneCircuit(input){
 const {voltageV,resistanceOhm,connection}=input||{};
 if(!Number.isFinite(voltageV)||voltageV<0||voltageV>24||!Number.isFinite(resistanceOhm)||resistanceOhm<.001||resistanceOhm>1e9||!connection||typeof connection.closed!=='boolean'||!validPair(connection.from,connection.to))throw Error('Unsupported DC scene settings or actual connection endpoints');
 return validateCircuit({schemaVersion:1,analysisMode:'dc',groundNode:'common',state:{powered:true},nodes:[{id:'source'},{id:'load'},{id:'common'}],components:[{id:'V1',type:'dc-source',terminals:[{id:'V1.p',nodeId:'source'},{id:'V1.n',nodeId:'common'}],properties:{voltageVolts:voltageV},state:{open:false}},{id:'R1',type:'resistor',terminals:[{id:'R1.a',nodeId:'load'},{id:'R1.b',nodeId:'common'}],properties:{resistanceOhms:resistanceOhm},state:{open:false}}],connections:[{id:'path-link',...structuredClone(connection)}],instruments:[{id:'DMM1',type:'dmm',mode:'dc-voltage',redNode:'source',blackNode:'common',redTerminalId:'V1.p',blackTerminalId:'V1.n',contactContractVersion:1}]});
}
export function dcSceneReading(state){const circuit=dcSceneCircuit(state),solution=solveDC(circuit),measurement=measureVoltage(circuit,'source','common',solution),raw=solution.componentCurrents.R1;return {circuit,sourceTerminalVoltageV:measurement.valueVolts,loadVoltageV:measureVoltage(circuit,'load','common',solution).valueVolts,loadCurrentA:Object.is(raw,-0)?0:raw,pathClosed:state.connection.closed,model:'ideal resistive DC teaching scene; not a build specification',limitations:solution.limitations};}
export const isFlowWidget=item=>['charge-flow','simple-dc-scene'].includes(item?.widgetKey)||(item?.widgetKey==='charge-balance'&&item.config?.mode==='bulk-imbalance');
export function flowWorking(item){
 const c=item.config;if(item.widgetKey==='charge-flow'){const run=chargeFlowRun(c);return {...run,crossed:0,actionCount:0};}
 if(item.widgetKey==='charge-balance'){const result=bulkTransfer(c.initialExcessUnits,c.transferredUnits);return {initialExcessUnits:result.initialExcessUnits,currentExcessUnits:result.initialExcessUnits,applied:false,actionCount:0};}
 const voltageV=c.initialVoltageV??c.sourceVoltageV,resistanceOhm=c.resistanceOhm,path=c.initialPath??c.path;
 if(c.lockedVariable!==undefined&&!['voltage','resistance',null].includes(c.lockedVariable))throw Error('Unknown comparison lock');
 const state={voltageV,resistanceOhm,connection:{from:'V1.p',to:'R1.a',closed:path==='closed'},selectedEndpoint:null,lockedVariable:c.lockedVariable||null,componentPositions:{V1:{x:30,y:40},R1:{x:220,y:40}},actionCount:0};dcSceneCircuit(state);if(!['open','closed'].includes(path))throw Error('An explicit external path state is required');return state;
}
export function flowAction(item,working,action){
 const s=structuredClone(working),c=item.config;
 if(item.widgetKey==='charge-flow'){
  if(action==='run'){s.crossed=s.packetCount;s.actionCount++;}
  else if(action==='step'){s.crossed=Math.min(s.packetCount,s.crossed+1);s.actionCount++;}
  else if(action==='replay')s.crossed=0;
  else if(action.startsWith('playback:'))Object.assign(s,chargeFlowRun({...s,playbackRate:Number(action.slice(9))}));
  else throw Error('Unsupported charge-flow action');return s;
 }
 if(item.widgetKey==='charge-balance'){
  if(action==='discharge'){if(s.applied)throw Error('This finite event has already been applied');s.currentExcessUnits=bulkTransfer(c.initialExcessUnits,c.transferredUnits).finalExcessUnits;s.applied=true;s.actionCount++;}
  else if(action==='reset'){s.currentExcessUnits=c.initialExcessUnits;s.applied=false;}
  else throw Error('Unsupported bulk action');return s;
 }
 if(action==='open-path'){s.connection.closed=false;s.selectedEndpoint=null;s.actionCount++;}
 else if(action==='cancel-connection')s.selectedEndpoint=null;
 else if(action.startsWith('terminal:')){
  const id=action.slice(9);if(!['V1.p','R1.a'].includes(id))throw Error('Choose one of the marked actual terminals');
  if(!s.selectedEndpoint)s.selectedEndpoint=id;
  else {if(!validPair(s.selectedEndpoint,id))throw Error('Choose the other marked endpoint');s.connection={from:s.selectedEndpoint,to:id,closed:true};s.selectedEndpoint=null;s.actionCount++;}
 }else if(action==='change-voltage'){if(s.lockedVariable==='voltage')throw Error('Voltage is locked');s.voltageV=c.targetVoltageV;s.actionCount++;}
 else if(action.startsWith('voltage:')){if(s.lockedVariable==='voltage')throw Error('Voltage is locked');s.voltageV=Number(action.slice(8));s.actionCount++;}
 else if(action.startsWith('resistance:')){if(s.lockedVariable==='resistance')throw Error('Resistance is locked');s.resistanceOhm=Number(action.slice(11));s.actionCount++;}
 else if(action.startsWith('lock:')){const lock=action.slice(5);if(!['voltage','resistance','none'].includes(lock))throw Error('Unknown comparison lock');s.lockedVariable=lock==='none'?null:lock;}
 else if(action==='double-both'){if(s.lockedVariable)throw Error('Unlock both variables for the optional comparison');s.voltageV*=2;s.resistanceOhm*=2;s.actionCount++;}
 else throw Error('Unsupported DC scene action');dcSceneCircuit(s);return s;
}
export function flowObservation(item,state){
 if(item.widgetKey==='charge-flow'){
  const run=chargeFlowRun(state);if(!Number.isInteger(state.crossed)||state.crossed<0||state.crossed>run.packetCount)throw Error('Invalid crossing ledger position');
  return {...run,crossed:state.crossed,crossings:run.ledger.slice(0,state.crossed),recordedTimeS:state.crossed*run.intervalS/run.packetCount};
 }
 if(item.widgetKey==='charge-balance')return {...bulkTransfer(item.config.initialExcessUnits,item.config.transferredUnits),currentExcessUnits:state.currentExcessUnits,applied:state.applied};
 return dcSceneReading(state);
}
export function validateFlowWidget(item){
 if(!isFlowWidget(item))throw Error('Unsupported flow scene; atom charge mode stays separate');
 const c=item.config,expected=item.grading?.expectedPrediction,s=flowWorking(item);
 if(item.widgetKey==='charge-flow'){if(expected?.currentA!==chargeFlowRun(c).currentA)throw Error('Prediction contradicts Q / interval');}
 else if(item.widgetKey==='charge-balance'){
  const result=bulkTransfer(c.initialExcessUnits,c.transferredUnits),change=Math.abs(result.finalExcessUnits)<Math.abs(result.initialExcessUnits)?'reduced':'unchanged';
  if(expected?.finalExcessUnits!==result.finalExcessUnits||expected?.change!==change)throw Error('Prediction contradicts the specified finite transfer');
 }else if(c.targetPath!==undefined){
  if(!['open','closed'].includes(c.targetPath))throw Error('Unsupported target path');const target=dcSceneReading({...s,connection:{...s.connection,closed:c.targetPath==='closed'}});
  if(expected?.sourceVoltageState!==(target.sourceTerminalVoltageV===0?'zero':'present')||expected?.loadCurrentState!==(target.loadCurrentA===0?'zero':'nonzero'))throw Error('Paired prediction contradicts the shared circuit state');
 }else{
  const before=dcSceneReading(s).loadCurrentA,after=dcSceneReading(flowAction(item,s,'change-voltage')).loadCurrentA,trend=after===before?'same':after===2*before?'double':after*2===before?'half':after>before?'increase':'decrease';
  if(expected?.currentTrend!==trend||expected?.initialCurrentA!==before||expected?.targetCurrentA!==after)throw Error('Prediction contradicts the shared V/R comparison');
 }
 return item;
}
