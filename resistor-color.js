// Common IEC resistor color rules. Pure nominal metadata; no tolerance simulation.
export const resistorColors=[
 ['black','#151719',0,1,null],['brown','#875638',1,10,1],['red','#d84a48',2,100,2],['orange','#f39736',3,1000,null],['yellow','#f4da54',4,10000,null],['green','#45946b',5,100000,.5],['blue','#4387c6',6,1000000,.25],['violet','#9965bd',7,10000000,.1],['gray','#a1a5a8',8,100000000,.05],['white','#f4f6ed',9,1000000000,null],['gold','#d4ae55',null,.1,5],['silver','#c5cdd2',null,.01,10],['none','transparent',null,null,20]
].map(([id,hex,digit,multiplier,tolerance])=>Object.freeze({id,hex,digit,multiplier,tolerance}));
export const colorFor=id=>resistorColors.find(c=>c.id===id);
export function decodeBands(colors){
 if(!Array.isArray(colors)||![4,5].includes(colors.length))throw Error('Use four or five band positions');
 const n=colors.length-2,significant=colors.slice(0,n).map(id=>colorFor(id)?.digit),mult=colorFor(colors[n])?.multiplier,tol=colorFor(colors[n+1])?.tolerance;
 if(significant.some(d=>!Number.isInteger(d))||significant[0]===0||!Number.isFinite(mult)||!Number.isFinite(tol))throw Error('Invalid significant, multiplier or tolerance color');
 const resistanceOhms=Number(significant.join(''))*mult;
 return {resistanceOhms,tolerancePercent:tol,bandCount:colors.length,colors:[...colors],minimum:resistanceOhms*(1-tol/100),maximum:resistanceOhms*(1+tol/100)};
}
export function encodeResistance(value,bandCount=4,tolerance=5){
 if(!Number.isFinite(value)||value<=0||![4,5].includes(bandCount))throw Error('Positive resistance and four/five bands required');
 const n=bandCount-2,min=10**(n-1),max=10**n-1,tol=tolerance===null?undefined:resistorColors.find(c=>c.tolerance===tolerance);
 for(const mult of resistorColors.filter(c=>c.multiplier!==null)){
  const coefficient=Math.round(value/mult.multiplier);
  if(coefficient>=min&&coefficient<=max&&Math.abs(coefficient*mult.multiplier-value)<=Math.max(1e-12,value*1e-12)){
   const colors=String(coefficient).split('').map(d=>resistorColors.find(c=>c.digit===Number(d)).id).concat(mult.id,tol?.id||null);
   return {representable:true,resistanceOhms:value,bandCount,tolerancePercent:tolerance,colors,toleranceRepresentable:Boolean(tol),minimum:tolerance===null?null:value*(1-tolerance/100),maximum:tolerance===null?null:value*(1+tolerance/100)};
  }
 }
 const candidates=[];for(const m of resistorColors.filter(c=>c.multiplier!==null))for(const coefficient of [Math.floor(value/m.multiplier),Math.ceil(value/m.multiplier)])if(coefficient>=min&&coefficient<=max)candidates.push(coefficient*m.multiplier);
 const alternatives=[...new Set(candidates)].sort((a,b)=>Math.abs(a-value)-Math.abs(b-value)).slice(0,2).sort((a,b)=>a-b);
 return {representable:false,resistanceOhms:value,bandCount,tolerancePercent:tolerance,colors:[],alternatives};
}
export const resistancePresets=[10,22,47,100,220,330,470,680,1000,2000,2200,3300,4700,6800,10000,22000,47000,100000,220000,470000,1000000];
export function formatResistance(value){return value>=1e6?Number((value/1e6).toPrecision(5))+' MΩ':value>=1000?Number((value/1000).toPrecision(5))+' kΩ':Number(value.toPrecision(5))+' Ω';}

// Validate only requested edits; do not rewrite unknown metadata on saved content.
export function validateResistorMetadata(properties){
 const t=properties.tolerancePercent;if(t!==undefined&&(!Number.isFinite(t)||t<=0||t>20))throw Error('Tolerance must be greater than 0% and at most 20%');
 if(properties.bandCount!==undefined&&![4,5].includes(properties.bandCount))throw Error('Choose four or five resistor bands');return properties;
}
