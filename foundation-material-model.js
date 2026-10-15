// Authored qualitative cards only. No conductivity curves or physical test procedures.
const cards={
 'copper-wire-room-conditions':{mode:'conductors',material:'Copper wire',conditions:'Stated room conditions; metallic sample',movement:'easy',carrier:'metal-electrons',reason:'An authored metallic conductor case.'},
 'aluminum-room-conditions':{mode:'conductors',material:'Aluminum',conditions:'Stated ordinary conditions; metallic sample',movement:'easy',carrier:'metal-electrons',reason:'An authored metallic conductor case.'},
 'ordinary-gas':{mode:'conductors',material:'Gas',conditions:'Ordinary, not specified as ionized',movement:'difficult',carrier:'description-only',reason:'The condition matters; do not silently substitute an ionized gas.'},
 'ionized-gas':{mode:'conductors',material:'Gas',conditions:'Explicitly stated as ionized',movement:'easier',carrier:'description-only',reason:'A descriptive conditional case, without a fabricated current reading.'},
 'saltwater-described':{mode:'conductors',material:'Water with dissolved salt',conditions:'Qualitative source example; concentration matters',movement:'condition-dependent',carrier:'ions-note',reason:'Conducting solutions can use dissolved ions; the metal-electron diagram is not reused.'},
 'glass-normal':{mode:'insulators',material:'Glass support',conditions:'Intact; ordinary stated conditions',separatesCharges:true,reason:'An authored intact-insulation example, not an unconditional safety promise.'},
 'dry-wood-normal':{mode:'insulators',material:'Dry wood',conditions:'Dry; ordinary stated conditions',separatesCharges:true,reason:'The stated dry condition is part of the card.'},
 'insulator-damaged-loss-stated':{mode:'insulators',material:'Damaged insulating support',conditions:'The supplied case explicitly states that insulating properties have been lost',separatesCharges:false,reason:'Former insulation is not guaranteed after the stated loss. Read-only conceptual comparison.'}
};
export function materialCard(id,mode){const c=cards[id];if(!c||c.mode!==mode)throw Error('Unknown or incompatible authored material card');return {id,...structuredClone(c)};}
export function materialCards(mode){return Object.keys(cards).filter(id=>cards[id].mode===mode).map(id=>materialCard(id,mode));}
export function resistanceDirection(before,after){const values={easier:0,harder:1};if(!(before in values)||!(after in values)||before===after)throw Error('Distinct qualitative conduction conditions required');return values[after]>values[before]?'increase':'decrease';}
export function vacancyState(occupancy){if(!Array.isArray(occupancy)||occupancy.length<4||occupancy.length>7||occupancy.some(v=>v!==0&&v!==1)||occupancy.filter(v=>v===0).length!==1)throw Error('Use 4–7 binary slots with exactly one vacancy');return [...occupancy];}
export function vacancyMove(input,from){const occupancy=vacancyState(input),to=occupancy.indexOf(0);if(!Number.isInteger(from)||occupancy[from]!==1||Math.abs(from-to)!==1)throw Error('Move an occupied adjacent slot into the vacancy');occupancy[to]=1;occupancy[from]=0;return {occupancy,electronCount:occupancy.filter(Boolean).length,electronFrom:from,electronTo:to,vacancyFrom:to,vacancyTo:from,electronDirection:to<from?'left':'right',vacancyDirection:from<to?'left':'right'};}
export function carrierMajority(electrons,holes){if(![electrons,holes].every(n=>Number.isInteger(n)&&n>0&&n<=20)||electrons===holes)throw Error('Two distinct positive bounded illustrative counts required');return {electrons,holes,majority:electrons>holes?'electrons':'holes',minority:electrons>holes?'holes':'electrons',type:electrons>holes?'N':'P'};}
export const isMaterialWidget=item=>['material-response','carrier-vacancy'].includes(item?.widgetKey);
export function validateMaterialWidget(item){
 const c=item.config;if(item.widgetKey==='carrier-vacancy'){
  const moved=vacancyMove(c.occupancy,c.fromIndex),expected=item.grading?.expectedPrediction;
  if(c.toIndex!==moved.electronTo||JSON.stringify(expected?.finalOccupancy)!==JSON.stringify(moved.occupancy)||expected?.holeDirection!==moved.vacancyDirection||expected?.electronCount!==moved.electronCount)throw Error('Carrier prediction contradicts its legal move');
 }else if(['conductors','insulators'].includes(c.mode)){
  const card=materialCard(c.caseId,c.mode),expected=item.grading?.expectedPrediction;
  if(c.mode==='conductors'?expected?.movement!==card.movement:expected?.formerInsulationGuaranteed!==card.separatesCharges)throw Error('Prediction contradicts the stated material card');
 } else if(['resistance_role','semiconductor_conditions'].includes(c.mode)){
  if(item.grading?.expectedPrediction?.resistanceDirection!==resistanceDirection(c.initialConduction,c.targetConduction))throw Error('Prediction contradicts the stated conduction conditions');
 }
 else throw Error('Unsupported progressive material mode');
 return item;
}
export function materialWorking(item){validateMaterialWidget(item);return item.widgetKey==='carrier-vacancy'?{occupancy:vacancyState(item.config.occupancy),moves:[],majorityExample:{electrons:3,holes:9},actionCount:0}:{mode:item.config.mode,caseId:item.config.caseId||null,initialConduction:item.config.initialConduction||null,targetConduction:item.config.targetConduction||null,comparisonApplied:false,termAnswers:{},purpose:'wire',actionCount:0};}
export function materialAction(item,working,action){const s=structuredClone(working);
 if(item.widgetKey==='carrier-vacancy'){
  if(action.startsWith('move:')){const move=vacancyMove(s.occupancy,Number(action.slice(5)));s.occupancy=move.occupancy;s.moves.push(move);s.actionCount++;}
  else if(action==='reset'){s.occupancy=vacancyState(item.config.occupancy);s.moves=[];}
  else if(action==='majority:N')s.majorityExample={electrons:10,holes:2};
  else if(action==='majority:P')s.majorityExample={electrons:3,holes:9};
  else throw Error('Unsupported carrier action');
 }else if(action==='compare'){s.comparisonApplied=true;s.actionCount++;}
 else if(action==='swap'&&['resistance_role','semiconductor_conditions'].includes(s.mode)){[s.initialConduction,s.targetConduction]=[s.targetConduction,s.initialConduction];}
 else if(action==='purpose:wire'||action==='purpose:heater')s.purpose=action.slice(8);
 else if(action.startsWith('case:')){materialCard(action.slice(5),s.mode);s.caseId=action.slice(5);s.comparisonApplied=true;}
 else if(action.startsWith('term:')){const [term,role]=action.slice(5).split('/');if(!['resistor','resistance','ohm'].includes(term)||!['component','property','unit'].includes(role))throw Error('Unsupported term choice');s.termAnswers[term]=role;}
 else throw Error('Unsupported material action');return s;
}
export function materialObservation(item,s){
 if(item.widgetKey==='carrier-vacancy')return {electronCount:vacancyState(s.occupancy).filter(Boolean).length,lastMove:s.moves.at(-1)||null,majority:carrierMajority(s.majorityExample.electrons,s.majorityExample.holes)};
 if(['conductors','insulators'].includes(s.mode))return materialCard(s.caseId,s.mode);
 return {mode:s.mode,initialConduction:s.initialConduction,targetConduction:s.targetConduction,resistanceDirection:resistanceDirection(s.initialConduction,s.targetConduction),geometry:'unchanged',quantitativeOutput:false,purpose:s.purpose};
}
