// Lookup and adapters only. Existing lesson renderers/grading remain unchanged.
import {dmmWidgetKinds,attachDmmWidgets} from './dmm-widgets.js';
import {mathWidgetKinds,attachMathWidgets} from './math-widgets.js';
import {cetaWidgetKinds,attachCetaWidgets} from './ceta-widgets.js';
import {attachLabWidgets} from './lab-widgets.js';
import {simulatorCatalog,attachGeneratedSimulations} from './generated-simulations.js';
import {workshopMethods,renderWorkshopActivity,attachWorkshopWidgets} from './workshop-widgets.js';
const labKinds=['tolerance','bands','rating','breadboard','meter','series','divider','parallel3','fault'];
const entries=[];
function register(id,name,category,adapter,configurationParameters={},details={}){
 entries.push({id,version:'1.0.0',displayName:name,category,capabilities:['local-interaction','reusable-view'],configurationParameters,
  assets:category==='dmm'?['dmm-widgets.js#visualDMM']:category==='lab'?['lab-visuals.js']:category==='workshop'?['workshop-widgets.js']:category==='math'?['math-widgets.js']:category==='exam'?['ceta-widgets.js']:['generated-simulations.js'],
  simulationDependencies:[],gradingCapabilities:[],difficultyLevels:['beginner'],inputContract:'Reviewed JSON configuration only',outputContract:'Local educational view; no progress writes',
  limitations:['Existing idealized teaching scenario; does not share a project circuit.','Educational illustration, not a hardware safety certification.'],compatibleLessonSchemas:[1,2],dependencies:[],
  regressionRequirements:['Existing lesson behavior and IDs unchanged','Keyboard and phone controls','No paid requests'],...details,adapter});
}
for(const kind of dmmWidgetKinds)register(kind,kind.replaceAll('-',' '),'dmm',{kind,type:'lab',attach:attachDmmWidgets});
for(const kind of labKinds)register('lab-'+kind,kind,'lab',{kind,type:'lab',attach:attachLabWidgets});
for(const kind of mathWidgetKinds)register(kind,kind.replaceAll('-',' '),'math',{kind,type:'lab',attach:attachMathWidgets});
for(const kind of cetaWidgetKinds)register(kind,kind.replaceAll('-',' '),'exam',{kind,type:'lab',attach:attachCetaWidgets});
for(const [kind,spec] of Object.entries(simulatorCatalog))register('simulation-'+kind,spec.title,'calculation',{kind,type:'simulation',attach:attachGeneratedSimulations},{});
for(const kind of workshopMethods)register('workshop-'+kind,kind,'workshop',{kind,type:'workshop',attach:attachWorkshopWidgets},{activity:{type:'reviewed-workshop-activity'}},{gradingCapabilities:kind==='catalog'?[]:['deterministic-workshop-check'],regressionRequirements:['tests/workshops.test.mjs','Retain checkpoint IDs, answers, and requirements']});
// Shared-model instruments use the project workspace adapter, never legacy hard-coded readings.
for(const [id,name] of [['circuit-dc','Shared DC circuit'],['dmm-shared','Shared-state DC multimeter']])register(id,name,'shared-circuit',{type:'workspace'},{},{capabilities:['dc','shared-state','serializable',...(id==='dmm-shared'?['dc-voltage','resistance','continuity','dc-current']:[])],difficultyLevels:['beginner','intermediate','advanced'],simulationDependencies:['circuit-model.js#solveDC'],assets:['dmm-widgets.js#visualDMM','lab-visuals.js#circuitSvgFrame',...(id==='circuit-dc'?['circuit-canvas.js','circuit-canvas-view.js','desktop-windows.js','mobile-lab.js','lab-graphics.js#resistorBody']:[])],limitations:['Ideal resistors and independent DC voltage sources only.','Voltage is infinite impedance; resistance uses an ideal 1 V test; current is a zero-burden selected series branch. No AC, fuse ratings, loading, tolerances or transients.'],dependencies:id==='dmm-shared'?['circuit-dc']:[]});
register('breadboard-shared','Editable shared-circuit breadboard','shared-circuit',{type:'workspace'},{},{capabilities:['breadboard-connectivity','editing','shared-state','serializable'],simulationDependencies:['breadboard-model.js#compileBreadboard','circuit-model.js#solveDC'],assets:['lab-visuals.js#breadboardHoleArtwork','lab-visuals.js#circuitSvgFrame','graphical-breadboard.js','lab-graphics.js#resistorBody','lab-graphics.js#sourceBody'],dependencies:['circuit-dc','dmm-shared'],limitations:['Compact 12-row board, isolated center gap, split rails after row 6.','Ideal DC sources and resistors; wire shape/lead packing and transient behavior are not modeled.'],regressionRequirements:['tests/breadboard.test.mjs','tests/breadboard-browser.mjs','Existing 62 entries and lesson behavior retained']});
register('scope-foundation','Shared DC observation and demonstration scope','shared-circuit',{type:'workspace'},{},{capabilities:['dc-observation','demo-signals','shared-state','serializable'],assets:['workshop-widgets.js#plotWave'],simulationDependencies:['scope-signals.js#scopeCapture','circuit-model.js#measureVoltage'],dependencies:['circuit-dc'],limitations:['DC trace is steady-state only; demonstration waveforms are independent of the circuit.','No general transient/AC analysis, probe loading, noise, bandwidth or hardware ratings.'],regressionRequirements:['tests/scope.test.mjs','tests/scope-browser.mjs']});
for(const [id,name,assets] of [['lab-graphic-controls','Shared graphical instrument controls',['graphic-controls.js','lab-graphics.js']],['resistor-color-editor','Four/five-band resistor artwork and editor',['resistor-color.js','lab-graphics.js#resistorBody','component-editors.js#renderResistorEditor']],['dc-supply-graphic','Graphical ideal DC supply',['component-editors.js#renderPowerSupply','lab-graphics.js#sourceBody']]])register(id,name,'graphics',{type:'workspace'},{},{capabilities:['graphical-controls','touch','keyboard','serializable-config'],assets,limitations:['Reviewed presentation adapter; does not implement physics or graded assessment.','Tolerance is nominal metadata; no manufacturing variation is simulated.'],regressionRequirements:['tests/graphical-components.test.mjs','tests/graphical-lab-browser.mjs','Original lesson IDs/grading and project compatibility retained']});
// Conceptual count/energy views share one model; they are not circuit simulations.
for(const [id,name] of [['atom-identity','Atom Identity Console'],['charge-balance','Charge Balance Lab'],['shell-energy','Shell Energy Stepper'],['material-classifier','Material Case Sorter']])register(id,name,'foundations',{type:'study'},{mode:{type:'reviewed-mode'}},{compatibleLessonSchemas:[3],capabilities:['conceptual-model','prediction-before-reveal','touch','keyboard','serializable','compact-review'],assets:['study-module-view.js#renderStudyWidget'],simulationDependencies:['foundation-model.js'],gradingCapabilities:['immutable-first-prediction'],limitations:['Conceptual counting and qualitative energy only; stability, physical trajectories and chemical simulation are not evaluated.','Reviewed authored cases; no inference from icon proximity.'],regressionRequirements:['tests/foundations-review.test.mjs','tests/foundations-browser.mjs','Preserve all existing lessons and instrument grading']});
register('particle-motion','Particle Motion Window','foundations',{type:'study'},{statePreset:{type:'reviewed-mode'},temperatureBand:{type:'reviewed-mode'},seed:{type:'integer'}},{compatibleLessonSchemas:[3],capabilities:['conceptual-model','prediction-before-reveal','touch','keyboard','serializable','compact-review','reduced-motion'],assets:['study-continuation-view.js#renderContinuationWidget'],simulationDependencies:['foundation-continuation-model.js'],gradingCapabilities:['immutable-first-prediction'],limitations:['Fixed nine particles; qualitative deterministic motion, no temperature calibration or phase-change physics.'],regressionRequirements:['tests/foundations-continuation.test.mjs','tests/foundations-continuation-browser.mjs']});
const freeze=value=>{if(value&&typeof value==='object'){for(const child of Object.values(value))freeze(child);Object.freeze(value)}return value;};
export const widgetRegistry=freeze(entries);
export const widgetCatalog=widgetRegistry.map(({adapter,...metadata})=>({...metadata,adapterContract:{type:adapter.type,kind:adapter.kind||null}}));
export function widgetFor(id,version='1.0.0'){return widgetRegistry.find(w=>w.id===id&&w.version===version)||null;}
export function searchWidgets({category,capabilities=[]}={}){return widgetRegistry.filter(w=>(!category||w.category===category)&&capabilities.every(c=>w.capabilities.includes(c)));}
export function validateWidgetReference(reference){
 const w=widgetFor(reference?.id,reference?.version);if(!w)throw Error('Unknown widget or version: '+reference?.id);
 const config=reference.config??{};
 if(!config||typeof config!=='object'||Array.isArray(config))throw Error('Widget config must be an object');
 for(const key of Object.keys(config))if(!Object.hasOwn(w.configurationParameters,key))throw Error('Unsupported widget parameter: '+key);
 if(w.adapter.type==='study')throw Error('Concept widgets require the reviewed study-module host, not the legacy package renderer');
 if(w.adapter.type==='workshop')throw Error('Workshop packages require a reviewed native adapter; preserve existing workshop lessons unchanged');
 if(w.adapter.type==='workspace')throw Error('Shared instruments currently belong to the project workspace, not graded lesson packages');
 return w;
}
export function renderRegisteredWidget(reference){
 const w=validateWidgetReference(reference);
 return w.adapter.type==='simulation'?'<div class="generated-simulation" data-generated-simulator="'+w.adapter.kind+'"></div>':'<div class="lab-widget" data-lab-kind="'+w.adapter.kind+'"></div>';
}
export function attachRegisteredWidgets(root){for(const attach of new Set(widgetRegistry.filter(w=>['lab','simulation'].includes(w.adapter.type)).map(w=>w.adapter.attach)))attach(root);}
