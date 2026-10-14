import {assertSerializable} from '../data-contract.js';
import {validateEntity} from './validation.js';
import {evaluatePracticalState} from './practical-rules.js';
export function evaluatePractical(definition,activityId,submission,{purpose='graded'}={}){
 validateEntity(definition,'LabModuleDefinition');assertSerializable(submission);
 if(!['practice','graded'].includes(purpose))throw Error('Unknown practical purpose');
 if(purpose==='graded'&&!['reviewed','published'].includes(definition.status))throw Error('Unreviewed practical module cannot award credit');
 const activity=definition.activities.find(a=>a.id===activityId);if(!activity)throw Error('Unknown practical activity');
 const allowed=activity.rubric.kind==='resistor-bands@1'?['colors']:['circuit','settings'];
 if(!submission||typeof submission!=='object'||Array.isArray(submission)||Object.keys(submission).some(k=>!allowed.includes(k)))throw Error('Unsupported practical input');
 let result;try{result=evaluatePracticalState(activity.rubric,submission);}catch(error){result={correct:false,observation:{status:'invalid',reason:error.message},feedback:error.message};}
 return {...result,purpose,creditEligible:purpose==='graded',explanation:activity.explanation};
}
