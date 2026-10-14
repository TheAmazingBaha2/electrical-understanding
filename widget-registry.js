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
  assets:category==='dmm'?['dmm-widgets.js#visualDMM']:category==='lab'?['lab-visuals.js']:category==='workshop'?['workshop-widgets.js']:['generated-simulations.js'],
  simulationDependencies:[],gradingCapabilities:[],difficultyLevels:['beginner'],inputContract:'Reviewed JSON configuration only',outputContract:'Local educational view; no progress writes',
  limitations:['Existing idealized teaching scenario; does not share a project circuit.','Educational illustration, not a hardware safety certification.'],compatibleLessonSchemas:[1],dependencies:[],
  regressionRequirements:['Existing lesson behavior and IDs unchanged','Keyboard and phone controls','No paid requests'],...details,adapter});
}
for(const kind of dmmWidgetKinds)register(kind,kind.replaceAll('-',' '),'dmm',{kind,type:'lab',attach:attachDmmWidgets});
for(const kind of labKinds)register('lab-'+kind,kind,'lab',{kind,type:'lab',attach:attachLabWidgets});
for(const kind of mathWidgetKinds)register(kind,kind.replaceAll('-',' '),'math',{kind,type:'lab',attach:attachMathWidgets});
for(const kind of cetaWidgetKinds)register(kind,kind.replaceAll('-',' '),'exam',{kind,type:'lab',attach:attachCetaWidgets});
for(const [kind,spec] of Object.entries(simulatorCatalog))register('simulation-'+kind,spec.title,'calculation',{kind,type:'simulation',attach:attachGeneratedSimulations},{});
for(const kind of workshopMethods)register('workshop-'+kind,kind,'workshop',{kind,type:'workshop',attach:attachWorkshopWidgets},{activity:{type:'reviewed-workshop-activity'}},{gradingCapabilities:kind==='catalog'?[]:['deterministic-workshop-check'],regressionRequirements:['tests/workshops.test.mjs','Retain checkpoint IDs, answers, and requirements']});
// Shared-model instruments use the project workspace adapter, never legacy hard-coded readings.
for(const [id,name] of [['circuit-dc','Shared DC circuit'],['dmm-shared','Shared-state DC multimeter']])register(id,name,'shared-circuit',{type:'workspace'},{},{capabilities:['dc','shared-state','serializable'],difficultyLevels:['beginner','intermediate','advanced'],simulationDependencies:['circuit-model.js#solveDC'],assets:['dmm-widgets.js#visualDMM','lab-visuals.js#circuitSvgFrame'],limitations:['Ideal resistors and independent DC voltage sources only.','Ideal infinite-impedance voltage meter; no AC, loading, tolerances, transients or current/resistance mode.'],dependencies:id==='dmm-shared'?['circuit-dc']:[]});
const freeze=value=>{if(value&&typeof value==='object'){for(const child of Object.values(value))freeze(child);Object.freeze(value)}return value;};
export const widgetRegistry=freeze(entries);
export function widgetFor(id,version='1.0.0'){return widgetRegistry.find(w=>w.id===id&&w.version===version)||null;}
export function searchWidgets({category,capabilities=[]}={}){return widgetRegistry.filter(w=>(!category||w.category===category)&&capabilities.every(c=>w.capabilities.includes(c)));}
export function validateWidgetReference(reference){
 const w=widgetFor(reference?.id,reference?.version);if(!w)throw Error('Unknown widget or version: '+reference?.id);
 const config=reference.config??{};
 if(!config||typeof config!=='object'||Array.isArray(config))throw Error('Widget config must be an object');
 for(const key of Object.keys(config))if(!Object.hasOwn(w.configurationParameters,key))throw Error('Unsupported widget parameter: '+key);
 if(w.adapter.type==='workshop')throw Error('Workshop packages require a reviewed native adapter; preserve existing workshop lessons unchanged');
 if(w.adapter.type==='workspace')throw Error('Shared instruments currently belong to the project workspace, not graded lesson packages');
 return w;
}
export function renderRegisteredWidget(reference){
 const w=validateWidgetReference(reference);
 return w.adapter.type==='simulation'?'<div class="generated-simulation" data-generated-simulator="'+w.adapter.kind+'"></div>':'<div class="lab-widget" data-lab-kind="'+w.adapter.kind+'"></div>';
}
export function attachRegisteredWidgets(root){for(const attach of new Set(widgetRegistry.filter(w=>['lab','simulation'].includes(w.adapter.type)).map(w=>w.adapter.attach)))attach(root);}
