// Owner suggestions are data. No automatic updates to behavior, grading or projects.
import {widgetFor} from './widget-registry.js';
export const improvementPriorities=['critical-safety','critical-correctness','high','normal','low'];
export function validateImprovement(item){
 if(!widgetFor(item?.widgetId,item?.widgetVersion))throw Error('Unknown affected widget');
 if(!item.id||!item.suggestion||!improvementPriorities.includes(item.priority)||!Array.isArray(item.affectedLessons)||!Array.isArray(item.affectedProjects)||!Array.isArray(item.testingRequirements)||!item.proposedChange||!item.compatibilityRequirements)throw Error('Incomplete improvement record');
 return {...item,status:'pending-owner-review'};
}
export function prioritizeImprovements(items){return items.map(validateImprovement).sort((a,b)=>improvementPriorities.indexOf(a.priority)-improvementPriorities.indexOf(b.priority));}
