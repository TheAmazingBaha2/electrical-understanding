// Small conceptual models, independent of the circuit solver and presentation.
export const PARTICLE_LIMIT = 20;
export function particleState(input) {
 for (const key of ['protons','neutrons','electrons']) if (!Number.isInteger(input?.[key]) || input[key] < 0 || input[key] > PARTICLE_LIMIT) throw Error('Particle counts must be whole numbers from 0 to '+PARTICLE_LIMIT);
 return {protons:input.protons,neutrons:input.neutrons,electrons:input.electrons};
}
export function countProperties(input) {
 const s=particleState(input), netChargeUnits=s.protons-s.electrons;
 return {...s,atomicNumber:s.protons,nuclearParticleCount:s.protons+s.neutrons,netChargeUnits,
  chargeStatus:netChargeUnits===0?'neutral':netChargeUnits>0?'positive':'negative',
  identity:({1:'hydrogen',2:'helium',6:'carbon'})[s.protons]||'element with '+s.protons+' protons',
  pairedCharges:Math.min(s.protons,s.electrons)};
}
export function changeParticle(input,action) {
 const s=particleState(input),match=/^(add|remove)-(proton|neutron|electron)$/.exec(action);
 if (!match) throw Error('Unsupported counting action');
 s[{proton:'protons',neutron:'neutrons',electron:'electrons'}[match[2]]] += match[1]==='add'?1:-1;
 return particleState(s);
}
export function compareCounts(before,after) {
 const a=countProperties(before),b=countProperties(after);
 return {elementIdentityChanged:a.protons!==b.protons,isotopeChanged:a.protons===b.protons&&a.neutrons!==b.neutrons,
  changedCounts:['protons','neutrons','electrons'].filter(k=>a[k]!==b[k]),atomicNumber:b.atomicNumber,nuclearParticleCount:b.nuclearParticleCount,netChargeUnits:b.netChargeUnits};
}
export function energyTransition(from,to) {
 const levels=['lower','middle','higher'];if(!levels.includes(from)||!levels.includes(to)||from===to)throw Error('Choose two distinct qualitative levels');
 return {from,to,energyDirection:levels.indexOf(to)>levels.indexOf(from)?'gain':'loss',particleCountsChanged:false};
}
export function challengeWorking(item) {
 if(item.widgetKey==='shell-energy') return {currentLevel:item.config.fromLevel,actionCount:0};
 if(item.widgetKey==='material-classifier') return {caseIndex:0,actionCount:0};
 return {...particleState(item.config.initialCounts),actionCount:0};
}
export function challengeAction(item,working,action) {
 if(item.widgetKey==='shell-energy')return {...working,currentLevel:item.config.toLevel,actionCount:working.actionCount+1};
 if(!item.config.allowedActions.includes(action))throw Error('Action unavailable in this exercise');
 return {...changeParticle(working,action),actionCount:working.actionCount+1};
}
export function challengeObservation(item,working) {
 if(item.widgetKey==='shell-energy')return item.config.fromLevel===working.currentLevel?{energyDirection:'unchanged',particleCountsChanged:false}:energyTransition(item.config.fromLevel,working.currentLevel);
 return {...countProperties(working),...compareCounts(item.config.initialCounts,working)};
}
