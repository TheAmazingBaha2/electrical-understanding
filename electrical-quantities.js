// Shared SI representation/calculation helpers. No grading, persistence or solver.
export const electricalPrefixes=Object.freeze([
 ['p',-12,'pico'],['n',-9,'nano'],['µ',-6,'micro'],['m',-3,'milli'],
 ['c',-2,'centi'],['d',-1,'deci'],['',0,'base'],['k',3,'kilo'],
 ['M',6,'mega'],['G',9,'giga'],['T',12,'tera']
].map(([symbol,exponent,name])=>Object.freeze({symbol,exponent,name})));
const units=new Set(['V','A','Ω','S','W']);
const finite=value=>{if(typeof value!=='number'||!Number.isFinite(value))throw Error('Use a finite electrical quantity');return Object.is(value,-0)?0:value;};
function scale(prefix){const symbol=['u','μ'].includes(prefix)?'µ':prefix,p=electricalPrefixes.find(p=>p.symbol===symbol);if(!p)throw Error('Unknown case-sensitive prefix; use k, and distinguish m from M');return {symbol,factor:10**p.exponent};}
export function displayQuantity(baseValue,unit,prefix=''){
 if(!units.has(unit))throw Error('Unsupported base unit');const {symbol,factor}=scale(prefix);
 return {baseValue:finite(baseValue),unit,prefix:symbol,displayedValue:finite(baseValue/factor),label:symbol+unit};
}
export function quantityFromDisplay(value,unit,prefix=''){
 if(!units.has(unit))throw Error('Unsupported base unit');const {factor}=scale(prefix),base=finite(finite(value)*factor);
 if(value!==0&&base===0)throw Error('Quantity is too small to represent');return base;
}
export function parseElectricalQuantity(text,expectedUnit){
 if(typeof text!=='string')throw Error('Enter a number and its explicit electrical unit');
 const match=text.trim().match(/^([+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?)\s*([pnuµμmcdkMGT]?)(V|A|Ω|ohm|S|W)$/);
 if(!match)throw Error('Use a finite decimal/exponent and explicit case-sensitive unit, without grouping separators');
 const value=finite(Number(match[1])),unit=match[3]==='ohm'?'Ω':match[3];
 if(expectedUnit&&unit!==expectedUnit)throw Error('Prefix conversion cannot change the physical dimension');
 if(value===0&&/[1-9]/.test(match[1].split(/[eE]/)[0]))throw Error('Quantity is too small to represent');
 return {baseValue:quantityFromDisplay(value,unit,match[2]),unit};
}
export function resistanceConductance(resistanceOhm){
 const r=finite(resistanceOhm);if(r<=0)throw Error('Reciprocal practice needs positive resistance');
 return {resistanceOhm:r,conductanceS:finite(1/r)};
}
export function conductanceResistance(conductanceS){
 const g=finite(conductanceS);if(g<=0)throw Error('Reciprocal practice needs positive conductance');
 return {resistanceOhm:finite(1/g),conductanceS:g};
}
// One explicitly supplied uniform conductor, not a loop/ampacity/thermal model.
export function wireQuantities({ohmPerKm,lengthM}){
 finite(ohmPerKm);finite(lengthM);if(ohmPerKm<=0||lengthM<=0)throw Error('Specify positive per-length resistance and physical length');
 return {...resistanceConductance(finite(ohmPerKm*(lengthM/1000))),ohmPerKm,lengthM};
}
// Supplied-data mode only. Circuit mode must use solved V/I from the shared solver.
export function dcSuppliedCalculation(unknown,values){
 const contracts={power:{inputs:['voltageV','currentA'],unit:'W'},current:{inputs:['powerW','voltageV'],unit:'A'},voltage:{inputs:['powerW','currentA'],unit:'V'}},contract=contracts[unknown];
 if(!contract)throw Error('Choose power, current or voltage');
 const [a,b]=contract.inputs.map(k=>finite(values[k]));if(a<0||b<0)throw Error('This supplied-data exercise uses nonnegative magnitudes');
 if(unknown!=='power'&&b===0)return {status:'undefined',value:null,unit:contract.unit,reason:'Cannot determine this unknown by dividing by zero.'};
 return {status:'valid',value:finite(unknown==='power'?a*b:a/b),unit:contract.unit};
}
