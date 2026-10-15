import test from 'node:test';import assert from 'node:assert/strict';
import {dividerCircuit,probeContact,withProbeContact} from '../circuit-model.js';
import {sharedMeterReading} from '../shared-multimeter.js';
import {circuitCanvasLayout,canvasProbeTerminal,editCircuitCanvas,canvasHistoryEdit,canvasHistoryRestore} from '../circuit-canvas.js';
import {compileBreadboard,dividerBreadboard,editBreadboard} from '../breadboard-model.js';
import {renderMobileCircuit,mobileContacts} from '../mobile-lab.js';
import {newProject,addSnapshot,restoreSnapshot} from '../project-store.js';
test('one physical contact contract preserves exact equivalent pins and refuses stale contacts',()=>{
 const original=dividerCircuit(),old=structuredClone(original);let c=withProbeContact(original,'red','R2.a');c=withProbeContact(c,'black','V1.n');
 assert.equal(probeContact(c,'red').id,'R2.a');assert.equal(sharedMeterReading(c).value,2.5);
 assert.equal(canvasProbeTerminal(c,circuitCanvasLayout(c),'red').id,'R2.a');
 c=withProbeContact(c,'red','R1.b');assert.equal(probeContact(c,'red').id,'R1.b');assert.equal(sharedMeterReading(c).value,2.5);
 const bad=structuredClone(c);bad.instruments[0].redTerminalId='missing';assert.equal(canvasProbeTerminal(bad,circuitCanvasLayout(bad),'red'),null);assert.equal(sharedMeterReading(bad).status,'blocked');
 bad.instruments[0].redTerminalId='R1.a';assert.equal(sharedMeterReading(bad).status,'blocked');
 assert.throws(()=>withProbeContact(c,'red','missing'));assert.deepEqual(original,old);assert.equal(probeContact(original,'red').state,'legacy-node');assert.equal(sharedMeterReading(original).value,2.5);
});
test('polarity, same-node and explicit detach are real shared measurements and survive undo/snapshot',()=>{
 let c=withProbeContact(withProbeContact(dividerCircuit(),'red','V1.n'),'black','R2.a');assert.equal(sharedMeterReading(c).value,-2.5);
 c=withProbeContact(c,'red','R1.b');assert.equal(sharedMeterReading(c).value,0);
 const l=circuitCanvasLayout(c),detached=canvasHistoryEdit(c,l,null,{type:'detach-probe',probe:'red'});
 assert.equal(probeContact(detached.circuit,'red').state,'unattached');assert.equal(sharedMeterReading(detached.circuit).value,null);
 assert.equal(canvasHistoryRestore(detached.circuit,detached.layout,detached.history,'undo').circuit.instruments[0].redTerminalId,'R1.b');
 let p=newProject();p.circuit=c;p=addSnapshot(p,'Exact contacts','contact-snapshot');p.circuit=detached.circuit;assert.equal(restoreSnapshot(p,'contact-snapshot').circuit.instruments[0].redTerminalId,'R1.b');
 const removed=editCircuitCanvas(c,l,{type:'remove-component',id:'R1'});assert.equal(sharedMeterReading(removed.circuit).status,'blocked');
});
test('breadboard contacts retain the selected physical hole and detach without rewriting its node',()=>{
 let board=dividerBreadboard();board=editBreadboard(board,{type:'probe',probe:'red',hole:'J1'});
 let c=compileBreadboard(board);assert.equal(probeContact(c,'red').id,'BB.J1');assert.equal(sharedMeterReading(c).value,2.5);
 board=editBreadboard(board,{type:'detach-probe',probe:'red'});assert.equal(board.probes.red,'J1');c=compileBreadboard(board);assert.equal(probeContact(c,'red').state,'unattached');assert.equal(sharedMeterReading(c).value,null);
 board=editBreadboard(board,{type:'probe',probe:'red',hole:'F1'});assert.equal(probeContact(compileBreadboard(board),'red').id,'BB.F1');
});
test('phone lead metadata and exact electrical contacts agree; detached probes draw no connected lead',()=>{
 let c=dividerCircuit();for(const contact of mobileContacts(c)){c=withProbeContact(c,'red',contact.terminalId);const html=renderMobileCircuit(c);assert.ok(html.includes('data-probe-contact="'+contact.terminalId+'" data-probe-node="'+contact.nodeId+'"'));}
 c=withProbeContact(c,'red',null);assert.doesNotMatch(renderMobileCircuit(c),/data-mobile-lead="red"/);
 assert.doesNotMatch(renderMobileCircuit(c,{settings:{mode:'current'}}),/data-mobile-lead=/);
});
test('wire endpoint rerouting preserves identity and open state, and invalid edits retain originals',()=>{
 const c=dividerCircuit(),l=circuitCanvasLayout(c);let x=editCircuitCanvas(c,l,{type:'connect',id:'W','from':'R1.b','to':'R2.a'});x=editCircuitCanvas(x.circuit,x.layout,{type:'open',id:'W',open:true});
 const prior=structuredClone(x),next=editCircuitCanvas(x.circuit,x.layout,{type:'reroute-wire',id:'W',to:'V1.n'});
 assert.deepEqual(next.circuit.connections,[{id:'W',from:'R1.b',to:'V1.n',closed:false}]);assert.deepEqual(x,prior);
 assert.throws(()=>editCircuitCanvas(x.circuit,x.layout,{type:'reroute-wire',id:'W',to:'R1.b'}));assert.throws(()=>editCircuitCanvas(x.circuit,x.layout,{type:'reroute-wire',id:'W',to:'missing'}));
});
