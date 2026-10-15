// Bounded private activity adapters. Data selects reviewed templates, never code.
import {newProject} from '../project-store.js';
import {withProbeContact} from '../circuit-model.js';
import {circuitCanvasLayout,editCircuitCanvas} from '../circuit-canvas.js';
import {prepareCurrentConnection} from '../shared-multimeter.js';
export function activityProjectId(definition,activity){return 'activity-'+definition.id+'-'+definition.version+'-'+activity.id;}
export function makeActivityProject(definition,activity,platform,{mode=activity.experiment.start}={}){
 const id=activityProjectId(definition,activity),p=newProject(id),r=activity.rubric,example=mode==='completed-example',bands=r.kind==='resistor-bands@1';
 p.metadata.title=activity.title+' · '+platform;p.metadata.description='Lesson-specific activity. Earlier module and personal projects are preserved separately.';p.experimentState.guidance={mode:'free'};p.circuit.state.powered=false;
 if(bands){p.circuit.components=p.circuit.components.filter(c=>c.id==='R1');Object.assign(p.circuit.components[0].properties,{resistanceOhms:example?r.nominalOhms:100,bandCount:example?r.bandCount:4,tolerancePercent:example?r.tolerancePercent:5});}
 else if(!example&&platform==='desktop'){
  let edit={circuit:p.circuit,layout:circuitCanvasLayout(p.circuit)};
  for(const id of ['R1','R2'])edit=editCircuitCanvas(edit.circuit,edit.layout,{type:'remove-component',id});
  if(mode==='blank')edit=editCircuitCanvas(edit.circuit,edit.layout,{type:'clear'});
  p.circuit=edit.circuit;p.experimentState.canvasLayout=edit.layout;
 }
 if(example){
  if(r.kind==='divider-voltage@1'){p.circuit.components[0].properties.voltageVolts=r.sourceVolts;p.circuit.components.find(p=>p.id==='R1').properties.resistanceOhms=r.upperOhms;p.circuit.components.find(p=>p.id==='R2').properties.resistanceOhms=r.lowerOhms;if(r.fault!=='none')p.circuit.components.find(p=>p.id===({'upper-open':'R1','lower-open':'R2','source-open':'V1'}[r.fault])).state.open=true;}
  if(!bands){const roles={source:'V1.p',output:'R1.b',common:'V1.n'};p.circuit=withProbeContact(withProbeContact(p.circuit,'red',roles[r.redRole||'output']),'black',roles[r.blackRole||'common']);}
  p.instrumentSettings.DMM1={...p.instrumentSettings.DMM1,mode:r.mode||'voltage',jack:r.mode==='current'?'A':'VΩ'};
  if(r.mode==='current')p.instrumentSettings.DMM1.currentConnection=prepareCurrentConnection(p.circuit,r.branchRole==='lower'?'R2':'R1');
  p.circuit.state.powered=bands?false:r.powered??true;
 }else{
  p.circuit=withProbeContact(withProbeContact(p.circuit,'red',null),'black',null);p.instrumentSettings.DMM1={...p.instrumentSettings.DMM1,mode:'voltage',jack:'VΩ'};
 }
 p.componentInventory=p.circuit.components.map(c=>({componentId:c.id,quantity:1}));
 p.experimentState.activityPreset={version:'1.0.0',definition:{id:definition.id,version:definition.version},activityId:activity.id,template:activity.experiment.template,start:mode};
 p.experimentState.activitySession={activityId:activity.id,version:1,mode:'guided',stepId:'predict',completedStepIds:[],predictions:{},example};
 return p;
}
