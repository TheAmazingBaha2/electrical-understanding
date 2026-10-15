const maps=Object.freeze({battery:{input:'chemical',outputs:['electrical']},solar:{input:'light',outputs:['electrical']},motor:{input:'electrical',outputs:['mechanical']},generator:{input:'mechanical',outputs:['electrical']},lamp:{input:'electrical',outputs:['light','heat']}});
export const energyDevices=Object.keys(maps);
export function energyDevice(id){if(!maps[id])throw Error('Choose a reviewed functional device card');return structuredClone(maps[id]);}
export function validateEnergyWidget(item){const m=energyDevice(item.config.deviceId),p=item.grading?.expectedPrediction;if(p?.input!==m.input||!m.outputs.includes(p?.output))throw Error('Energy prediction contradicts the reviewed conversion');return item;}
export function energyWorking(item){validateEnergyWidget(item);return {deviceId:item.config.deviceId,input:null,output:null,chain:[],actionCount:0};}
export function energyAction(item,working,action){
 const s=structuredClone(working),[kind,value]=action.split(':');
 if(kind==='device'){energyDevice(value);s.deviceId=value;s.input=null;s.output=null;s.chain=[];}
 else if(['input','output'].includes(kind)){if(!['chemical','electrical','light','heat','mechanical'].includes(value))throw Error('Unknown energy category');s[kind]=value;}
 else if(action==='compare'){if(!s.input||!s.output)throw Error('Choose both sides of the conversion first');s.actionCount++;}
 else if(kind==='chain'){const next=['battery','electrical','motor','mechanical'][s.chain.length];if(value!==next)throw Error('Follow the battery, electrical transfer, motor and mechanical output links in order');s.chain.push(value);}
 else throw Error('Unsupported energy-map action');return s;
}
export function energyObservation(working){const m=energyDevice(working.deviceId);return {...m,deviceId:working.deviceId,selectionMatches:working.input===m.input&&m.outputs.includes(working.output),efficiency:null,chargeConsumed:false};}
