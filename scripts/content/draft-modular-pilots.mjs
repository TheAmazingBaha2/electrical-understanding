// Private semantic draft composition from already approved principles, never publication.
import {writeFile,mkdir} from 'node:fs/promises';
import {join,resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {migrationId} from './legacy-inventory.mjs';
import {exportPrivateBundle} from './modular-file-repository.mjs';
import {validateBundle} from '../../modular/validation.js';
import {BLOCK_TYPES} from '../../modular/contracts.js';

export function draftModularPilots(){
 const entities=[],id=key=>migrationId('canonical-pilot:'+key),r=key=>({id:id(key),version:'1.0.0'});
 const add=(kind,key,fields)=>{const e={schemaVersion:3,kind,id:id(key),...fields};entities.push(e);return e;};
 add('SourceWork','source:eim',{title:'EIM Basic Electric Circuits',authors:[],publisher:null});
 add('SourceEdition','edition:eim',{workId:id('source:eim'),edition:null,isbn:null,fingerprint:null,status:'preserved-artifact'});
 add('SourceWork','source:geier',{title:'How to Diagnose and Fix Everything Electronic',authors:[],publisher:null});
 add('SourceEdition','edition:geier',{workId:id('source:geier'),edition:'Third edition',isbn:null,fingerprint:null,status:'preserved-artifact'});
 for(const [key,edition,chapter,start,end,citation] of [
  ['prelab','eim','Component Basics',1,12,'EIM Basic Electric Circuits, Component Basics, pp. 1–12'],
  ['series','eim','Series & Parallel Circuits',21,27,'EIM Basic Electric Circuits, Series & Parallel Circuits, pp. 21–27'],
  ['dmm-overview','geier','Chapter 6: Digital Multimeter subsection',97,98,'Geier, third edition, Chapter 6, pp. 97–98'],
  ['dmm-polarity','geier','Chapter 6: DC Voltage',98,99,'Geier, third edition, Chapter 6, pp. 98–99'],
  ['dmm-safety','geier','Chapter 6: Digital Multimeter subsection',97,103,'Geier, third edition, supplied DMM subsection only, pp. 97–103']
 ])add('SourceLocator','locator:'+key,{editionId:id('edition:'+edition),chapter,section:null,printedPages:{start,end},digitalPages:null,pageLabel:null,citation,verification:'preserved-reference'});
 const claim=(key,text,locators,type='fact')=>add('EvidenceClaim','evidence:'+key,{version:'1.0.0',claimType:type,text,state:'under-review',locatorIds:locators.map(k=>id('locator:'+k)),conflictsWith:[]});
 claim('nominal','A resistor label gives its nominal resistance; a real reading and its measurement uncertainty must be considered separately.',['prelab']);
 claim('tolerance','Tolerance expresses an allowable interval about nominal resistance. It is distinct from meter uncertainty and from the ideal model value.',['prelab','dmm-overview'],'definition');
 claim('bands','For an ordinary four-band resistor the first two bands encode significant digits, the third the multiplier, and the fourth tolerance.',['prelab'],'convention');
 claim('rating','A resistor has a power rating. An illustrative virtual calculation is not permission to apply that voltage to physical hardware.',['prelab'],'safety-rule');
 claim('ohm','For a reviewed ideal resistor calculation, I = V/R with volts, ohms and amperes.',['series'],'formula');
 claim('dmm','A numerical display is evidence with mode/range/accuracy and timing limitations, not a complete description of an electrical signal.',['dmm-overview'],'definition');
 claim('polarity','DC voltage is the potential at the red probe minus that at the black probe; swapping probes changes the sign, not the circuit.',['dmm-polarity'],'formula');
 claim('reference','A circuit reference must be verified; exposed metal and chassis parts are not automatically the same node.',['dmm-polarity'],'procedure');
 claim('modes','Voltage connects across two points; current needs an appropriate series path; resistance/continuity testing requires isolated power and appropriate discharge. Jack/function/rating checks remain essential.',['prelab','dmm-safety'],'safety-rule');

 const block=(key,type,title,text,evidence,origin='source-derived')=>add('ContentBlock','block:'+key,{type,title,text,origin,evidence:evidence.map(k=>r('evidence:'+k))});
 block('nominal','concept','Read a nominal value','Treat 1 kΩ as a nominal value. A real measurement may differ; an ideal circuit model uses its configured value.',['nominal']);
 block('tolerance','definition','Tolerance is an interval','A ±5% part allows five percent above or below nominal. This does not automatically simulate manufacturing variation or certify a meter reading.',['tolerance']);
 block('tolerance-example','worked-example','A 1 kΩ ±5% example','Five percent of 1,000 Ω is 50 Ω. The nominal interval is 1,000 − 50 = 950 Ω to 1,000 + 50 = 1,050 Ω. Meter uncertainty must still be considered. These example numbers illustrate the principle.',['tolerance'],'authored-example');
 block('bands','procedure','Decode four bands','Read the two significant digits, multiply by the third band, then interpret the tolerance band. Use the shared color-band widget rather than guessing a part value from its appearance.',['bands']);
 block('rating','safety-note','Power limits matter','The virtual model is ideal. A real resistor dissipates heat and must be selected within its ratings; model adjustments never authorize physical hookups.',['rating']);
 block('dmm','concept','Understand the instrument','Choose the function and appropriate jacks before interpreting the display. Resolution is distinct from accuracy, and a slowly updated reading may miss brief changes.',['dmm']);
 block('polarity','formula','Red minus black','Interpret a DC voltage as a difference between the two selected nodes. Changing the reference changes the reported difference.',['polarity','reference']);
 block('polarity-example','worked-example','Two nonzero probe points','If red is at +2.5 V and black at +5 V relative to the same verified common, the reading is 2.5 − 5 = −2.5 V. This is authored arithmetic, not an actual live measurement.',['polarity'],'authored-example');
 block('modes','procedure','Use the right connection','Use voltage across two points. A current measurement needs an appropriate series path and rated current jack. Resistance and continuity require the circuit isolated from external power.',['modes']);
 block('modes-safety','safety-note','Virtual practice has limits','A passed simulation does not certify physical competency. Verify ratings, lead condition, manuals, isolation/discharge and the actual schematic before real work. This pilot provides no live-mains procedure.',['modes']);

 const topic=(key,title,aliases,blocks,evidence,objective)=>{
  add('Topic','topic:'+key,{title,aliases});add('LearningObjective','objective:'+key,{text:objective,evidence:evidence.map(k=>r('evidence:'+k))});
  add('TopicRevision','revision:'+key,{topicId:id('topic:'+key),version:'1.0.0',status:'draft',blockIds:blocks.map(k=>id('block:'+k)),objectiveIds:[id('objective:'+key)],evidence:evidence.map(k=>r('evidence:'+k)),supersedes:null});
 };
 topic('resistors','Resistors',['resistor','nominal resistance'],['nominal'],['nominal'],'Distinguish nominal resistance from measured resistance.');
 topic('tolerance','Resistor tolerance',['tolerance interval'],['tolerance','tolerance-example'],['tolerance'],'Calculate and explain a nominal resistance interval.');
 topic('bands','Resistor color codes',['four-band resistor'],['bands'],['bands'],'Identify the role of each four-band color position.');
 topic('rating','Resistor power ratings',['power limit'],['rating'],['rating'],'Explain why an ideal example is not physical hookup authorization.');
 topic('dmm','Digital multimeters',['DMM'],['dmm'],['dmm'],'Explain what a DMM display can and cannot establish.');
 topic('polarity','DMM probe polarity',['red minus black','reference'],['polarity','polarity-example'],['polarity','reference'],'Predict a signed reading using a verified common reference.');
 topic('modes','DMM measurement preparation',['resistance safety','current jack'],['modes','modes-safety'],['modes'],'Choose safe mode/jack/connection/power preparation.');
 for(const [a,b] of [['tolerance','resistors'],['bands','resistors'],['rating','resistors'],['polarity','dmm'],['modes','dmm']])add('TopicRelation','relation:'+a+':'+b,{fromTopicId:id('topic:'+a),toTopicId:id('topic:'+b),relation:'narrower',rationale:'Independently teachable part of the broader topic, derived from approved material.'});
 add('TopicRelation','relation:tolerance:modes',{fromTopicId:id('topic:tolerance'),toTopicId:id('topic:modes'),relation:'related',rationale:'Resistance measurements need both interpretation and safe instrument preparation.'});

 const choice=(key,prompt,choices,correct,evidence,safety=false)=>add('AssessmentTemplate','assessment:'+key,{version:'1.0.0',status:'draft',type:'static-choice',prompt,explanation:choices[correct],parameters:[],constraints:[],choices,renderer:'selectable-choice@1',evaluator:{op:'choice',inputs:[],correctIndex:correct},unit:'',tolerance:{absolute:0,relative:0},safety,evidence:evidence.map(k=>r('evidence:'+k))});
 choice('bands','What do the first two bands of an ordinary four-band resistor encode?',['Significant digits','Power rating','Supply polarity'],0,['bands']);
 choice('tolerance','Which interval matches an illustrative nominal 1 kΩ ±5% resistor?',['950–1,050 Ω','995–1,005 Ω','50–1,000 Ω'],0,['tolerance']);
 choice('preparation','Before selecting resistance or continuity on a circuit, what preparation is required?',['Isolate external power and discharge as appropriate; verify the function and jacks.','Leave power on and use the current jack.','Assume the displayed zero means the circuit is safe.'],0,['modes'],true);
 add('AssessmentTemplate','assessment:ohm',{version:'1.0.0',status:'draft',type:'parameterized-number',prompt:'For an ideal resistor with {{voltage}} V across {{resistance}} Ω, calculate current in A.',explanation:'Use I = V/R. This is a numerical ideal-model exercise, not a physical hookup instruction.',parameters:[{name:'voltage',values:[3,5,9]},{name:'resistance',values:[1000,2200,4700]}],constraints:[],choices:[],renderer:'numeric-unit@1',evaluator:{op:'ohm-current',inputs:['voltage','resistance']},unit:'A',tolerance:{absolute:.000001,relative:.001},safety:false,evidence:[r('evidence:ohm')]});
 add('AssessmentTemplate','assessment:polarity',{version:'1.0.0',status:'draft',type:'parameterized-number',prompt:'Both potentials use one verified common: red {{red}} V, black {{black}} V. Predict red-minus-black in V.',explanation:'Subtract the black-probe potential from the red-probe potential. A negative answer is legitimate.',parameters:[{name:'red',values:[0,2.5,5]},{name:'black',values:[0,2.5,5]}],constraints:[],choices:[],renderer:'numeric-unit@1',evaluator:{op:'voltage-difference',inputs:['red','black']},unit:'V',tolerance:{absolute:.00001,relative:0},safety:false,evidence:[r('evidence:polarity')]});
 for(const [key,title,topics,assessments] of [
  ['resistors','Resistors',['resistors','tolerance','bands','rating','modes'],['bands','tolerance','ohm','preparation']],
  ['dmm','DMM fundamentals',['dmm','polarity','modes'],['polarity','preparation']]
 ]){
  add('LessonDefinition','lesson:'+key,{title,aliases:[key],description:'Private modular migration draft. Existing approved lessons remain intact.'});
  for(const platform of ['desktop','mobile'])add('LabModuleReference','lab:'+key+':'+platform,{version:'1.0.0',platform,adapter:platform+'-lab@1',activityIds:[id('lab-activity:'+key+':'+platform)],capabilities:[{widgetId:'dmm-shared',version:'1.0.0'},{widgetId:'circuit-dc',version:'1.0.0'}],evidence:[r('evidence:modes')]});
  add('LessonRevision','lesson-revision:'+key,{lessonId:id('lesson:'+key),version:'1.0.0',status:'draft',topicRevisions:topics.map(k=>r('revision:'+k)),additionalBlockIds:[],assessments:assessments.map(k=>r('assessment:'+k)),objectives:topics.map(k=>id('objective:'+k)),prerequisites:[],labs:{completionPolicy:'either-platform',desktop:r('lab:'+key+':desktop'),mobile:r('lab:'+key+':mobile')},supersedes:null});
 }
 add('PresentationProfile','profile:classic',{version:'1.0.0',name:'Classic five tabs',renderer:'classic-five-tab@1',regions:[{name:'overview',blockTypes:['reference']},{name:'learn',blockTypes:BLOCK_TYPES.filter(t=>!['reference','prediction','discussion','assessment-launcher','lab-launcher'].includes(t))},{name:'interact',blockTypes:['prediction','discussion','lab-launcher']},{name:'quiz',blockTypes:['assessment-launcher']},{name:'review',blockTypes:[]}]});
 const bundle={schemaVersion:3,id:id('bundle'),version:'1.0.0',entities};validateBundle(bundle);
 return {bundle,coverage:{status:'private-draft',sources:2,locators:5,topics:7,evidenceClaims:9,semanticBlocks:10,lessonDrafts:2,lessonsMigrated:0,legacyCreditGranted:0,ownerUsablePilots:false,unresolved:['Human technical/source/taxonomy review pending.','EIM edition unknown; raw source binaries not independently reviewed.','Practical module references are manifests, not implemented lesson-specific assessments.','Classic presentation plan exists; browser renderer/progress-pie integration pending.','Legacy question/activity mappings still REQUIRES_REVIEW.']}};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){
 if(process.argv.length!==3)throw Error('Usage: node scripts/content/draft-modular-pilots.mjs /absolute/private/output-directory');
 const output=resolve(process.argv[2]);await mkdir(output,{recursive:true,mode:0o700});const result=draftModularPilots(),hash=await exportPrivateBundle(result.bundle,join(output,'modular-pilots.bundle.json'));
 await writeFile(join(output,'modular-pilots.coverage.json'),JSON.stringify({...result.coverage,hash},null,2)+'\n',{flag:'wx',mode:0o600});console.log(JSON.stringify({...result.coverage,hash}));
}
