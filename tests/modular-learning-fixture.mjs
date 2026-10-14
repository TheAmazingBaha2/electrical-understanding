// Synthetic source and approvals only. No source-derived owner content or records.
import {modularFixture,entity,uid,ref} from './modular-fixture.mjs';
import {preparePublication} from '../modular/publication.js';
export async function learningFixture({published=true,rich=false}={}){
 const b=modularFixture();b.version='2.0.0';b.entities[9].objectiveIds=[uid(6)];b.entities[9].safety=true;
 b.entities[12].reviewPolicy={id:'common-review@1',passFraction:.8,missedDays:1,initialSuccessDays:7,retrySuccessDays:21};
 b.entities[6].text='Synthetic ideal circuit exercise.';
 for(const [platform,number,activity] of [['desktop',60,21],['mobile',61,22]]){
  b.entities.push(entity('LabModuleDefinition',number,{version:'1.0.0',platform,status:published?'published':'draft',activities:[{id:uid(activity),title:'Synthetic divider check',prompt:'Measure the shared output.',hint:'Use both contacts.',explanation:'The ideal divider gives 2.5 V.',required:true,objectiveIds:[uid(6)],evidence:[ref(4)],rubric:{kind:'divider-voltage@1',sourceVolts:5,upperOhms:1000,lowerOhms:1000,fault:'none',expectedVolts:2.5,tolerance:.00001}}]}));
  b.entities[platform==='desktop'?10:11].definition=ref(number);
 }
 if(rich){
  const mobile=b.entities.find(e=>e.kind==='LabModuleDefinition'&&e.platform==='mobile'),base=mobile.activities[0];
  mobile.activities.push({...base,id:uid(23),title:'Synthetic four-band task',explanation:'Brown–black–red–gold encodes 1 kΩ with a separate ±5% tolerance.',prompt:'Choose a four-band 1 kΩ ±5% resistor.',rubric:{kind:'resistor-bands@1',nominalOhms:1000,tolerancePercent:5,bandCount:4}},{...base,id:uid(24),title:'Synthetic five-band task',explanation:'The five selected bands encode exactly 857 Ω ±1%. No divider measurement is claimed by this code exercise.',prompt:'Choose a five-band 857 Ω ±1% resistor.',rubric:{kind:'resistor-bands@1',nominalOhms:857,tolerancePercent:1,bandCount:5}},{...base,id:uid(25),title:'Synthetic isolated resistance',explanation:'The isolated shared test measures the lower 1 kΩ path. Energized Ω testing remains blocked.',prompt:'Power off. Measure output to common in Ω with V/Ω.',rubric:{kind:'meter-state@1',mode:'resistance',powered:false,redRole:'output',blackRole:'common',expectedValue:1000,tolerance:.001}},{...base,id:uid(26),title:'Synthetic current preparation',explanation:'Powered-off preparation selects the virtual upper series branch; its ideal current is 2.5 mA when energized.',prompt:'Power off; select current and A, prepare the upper series path, then power on.',rubric:{kind:'meter-state@1',mode:'current',powered:true,redRole:'source',blackRole:'output',branchRole:'upper',magnitude:true,expectedValue:.0025,tolerance:.000001}});
  b.entities[11].activityIds=mobile.activities.map(a=>a.id);
  b.entities.push(entity('ContentBlock',70,{type:'prediction',title:'Synthetic prediction',text:'Will equal resistors halve the supply?',origin:'source-independent',evidence:[],hint:'Compare the ratio.',choices:['Yes','No'],correctIndex:0,debrief:'The unloaded ideal ratio is one half.'}),entity('ContentBlock',71,{type:'discussion',title:'Synthetic discussion',text:'Why is a floating result not zero?',origin:'source-independent',evidence:[],debrief:'A referenced path is necessary.'}));
  b.entities[12].additionalBlockIds=[uid(70),uid(71)];b.entities[13].regions.push({name:'interact',blockTypes:['prediction','discussion']});
 }
 if(published)for(const e of b.entities)if(['LessonRevision','TopicRevision','AssessmentTemplate'].includes(e.kind))e.status='published';
 const publication=await preparePublication(b),review={reviewer:'Synthetic test reviewer',reviewedAt:'2026-10-14T00:00:00.000Z',rationale:'Synthetic fixture only; never owner approval.'};
 publication.reviews=['technical','educational','owner','source-rights'].map(role=>({...review,role,decision:'approved'}));publication.rights=[{...review,editionId:uid(2),decision:'private-use'}];publication.editionReviews=[{...review,editionId:uid(2),decision:'verified'}];publication.locatorReviews=[{...review,locatorId:uid(3),decision:'preserved-reference-accepted'}];
 return {bundle:b,publication};
}
