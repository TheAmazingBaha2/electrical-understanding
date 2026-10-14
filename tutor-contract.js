// No AI backend or file access. Future tutor sees only explicitly supplied validated state.
import {validateCircuit} from './circuit-model.js';
import {validateProject} from './project-store.js';
import {assertSerializable} from './data-contract.js';
export function tutorContext(project,{includeNotes=false}={}){validateProject(project);return {schemaVersion:1,projectId:project.id,circuit:structuredClone(project.circuit),instrumentSettings:structuredClone(project.instrumentSettings),measurements:structuredClone(project.measurementResults),...(includeNotes?{notes:project.notes}:{}),limitations:'DC ideal model only; no grades, history, attachments or external files included'};}
export function validateTutorProposal(proposal,project){
 assertSerializable(proposal);validateProject(project);
 if(proposal?.schemaVersion!==1||proposal.projectId!==project.id||proposal.baseCircuit!==JSON.stringify(project.circuit)||typeof proposal.explanation!=='string'||!Array.isArray(proposal.operations)||!proposal.operations.length)throw Error('Invalid or stale tutor proposal');
 for(const op of proposal.operations){if(Object.keys(op).some(k=>!['componentId','property','value'].includes(k))||!project.circuit.components.some(c=>c.id===op.componentId)||!['resistanceOhms','voltageVolts','open'].includes(op.property))throw Error('Unsupported proposed change');}
 const next=structuredClone(project);for(const op of proposal.operations){const c=next.circuit.components.find(c=>c.id===op.componentId);if(op.property==='open')c.state.open=op.value;else if(op.property==='resistanceOhms'&&c.type==='resistor'||op.property==='voltageVolts'&&c.type==='dc-source')c.properties[op.property]=op.value;else throw Error('Property incompatible with component');}validateCircuit(next.circuit);return next;
}
export function previewTutorProposal(proposal,project){return {before:structuredClone(project),after:validateTutorProposal(proposal,project),explanation:proposal.explanation};}
export function applyTutorProposal(proposal,project,{approved=false}={}){if(approved!==true)throw Error('Explicit owner approval required');return {project:validateTutorProposal(proposal,project),undo:structuredClone(project)};}
