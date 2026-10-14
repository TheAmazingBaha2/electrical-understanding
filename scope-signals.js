// Bounded signals/capture contract. Demo signals are generated, never claimed as
// transient solutions. Circuit captures are actual steady DC probe differences.
import {assertSerializable} from './data-contract.js';
import {measureVoltage} from './circuit-model.js';
export function validateSignal(s){
 assertSerializable(s);if(s?.schemaVersion!==1||!['sine','square','triangle'].includes(s.waveform)||![s.amplitude,s.offset,s.frequency].every(Number.isFinite)||s.amplitude<0||Math.abs(s.offset)+s.amplitude>24||s.frequency<=0||s.frequency>50000)throw Error('Unsupported demonstration signal');return s;
}
export function signalValue(s,t){validateSignal(s);const phase=2*Math.PI*s.frequency*t;
 const wave=s.waveform==='sine'?Math.sin(phase):s.waveform==='square'?(Math.sin(phase)>=0?1:-1):2/Math.PI*Math.asin(Math.sin(phase));return s.offset+s.amplitude*wave;
}
export function scopeCapture(circuit,settings){
 const {source='dc',timeDiv=.001,voltsDiv=1,triggerLevel=0}=settings;
 if(!Number.isFinite(timeDiv)||timeDiv<1e-6||timeDiv>.1||!Number.isFinite(voltsDiv)||voltsDiv<.01||voltsDiv>50||!Number.isFinite(triggerLevel))throw Error('Unsupported scope scales');
 let fn,origin,frequency=null,start=0,triggered=false;
 if(source==='dc'){
  const r=measureVoltage(circuit,settings.redNode,settings.blackNode);if(r.valueVolts===null)return {status:'floating-reference',origin:'circuit-dc',points:[],reason:'A DC probe is on a floating node. No waveform can be inferred.'};
  fn=()=>r.valueVolts;origin='circuit-dc';
 }else if(source==='demo'){
  const s=validateSignal(settings.signal);fn=t=>signalValue(s,t);origin='generated-demo';frequency=s.amplitude>0?s.frequency:null;
  const period=1/s.frequency;let previous=fn(0);for(let i=1;i<=512;i++){const t=period*i/512,value=fn(t);if(previous<=triggerLevel&&value>triggerLevel){start=t-period/512+(triggerLevel-previous)/(value-previous)*period/512;triggered=true;break;}previous=value;}
 }else throw Error('Unsupported scope source');
 const duration=timeDiv*10,sampleCount=256,points=Array.from({length:sampleCount},(_,i)=>{const t=start+duration*i/(sampleCount-1);return [t-start,fn(t)];}),values=points.map(p=>p[1]),sampleRate=(sampleCount-1)/duration;
 return {schemaVersion:1,status:'valid',origin,start,points,timeDiv,voltsDiv,triggered,frequency,period:frequency?1/frequency:null,minimum:Math.min(...values),maximum:Math.max(...values),peakToPeak:Math.max(...values)-Math.min(...values),sampleRate,aliasRisk:frequency!==null&&sampleRate<2*frequency,reason:source==='dc'?'Actual DC circuit value repeated across time; no transient/AC solution is computed.':'Generated demonstration signal, independent of the circuit. Frequency/period are known generator settings; extrema come from finite samples.'};
}
