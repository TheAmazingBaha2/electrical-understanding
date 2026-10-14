import test from 'node:test';
import assert from 'node:assert/strict';
import {holeNode,dividerBreadboard,compileBreadboard,editBreadboard,newBoardHistory,boardHistoryEdit,boardUndo,boardRedo} from '../breadboard-model.js';
import {solveDC,measureVoltage} from '../circuit-model.js';
test('breadboard five-hole rows, center gap and split rails map correctly',()=>{
 assert.equal(holeNode('A1'),holeNode('E1'));assert.equal(holeNode('F1'),holeNode('J1'));assert.notEqual(holeNode('E1'),holeNode('F1'));assert.notEqual(holeNode('A1'),holeNode('A2'));
 assert.equal(holeNode('LP1'),holeNode('LP6'));assert.notEqual(holeNode('LP6'),holeNode('LP7'));assert.notEqual(holeNode('LP1'),holeNode('RP1'));assert.notEqual(holeNode('LP1'),holeNode('LN1'));assert.throws(()=>holeNode('A13'));
});
test('breadboard wires and component changes feed the shared solver without canned readings',()=>{
 const s=dividerBreadboard(),c=compileBreadboard(s);assert.equal(c.nodes.length,32);assert.equal(c.connections[0].id,'W1');
 assert.equal(measureVoltage(c,c.instruments[0].redNode,c.instruments[0].blackNode).valueVolts,2.5);
 const changed=compileBreadboard(editBreadboard(s,{type:'value',id:'R2',value:2000}));assert.ok(Math.abs(measureVoltage(changed,changed.instruments[0].redNode,changed.instruments[0].blackNode).valueVolts-10/3)<1e-12);
 const opened=compileBreadboard(editBreadboard(s,{type:'open',id:'R1',open:true}));assert.equal(measureVoltage(opened,opened.instruments[0].redNode,opened.instruments[0].blackNode).valueVolts,0);
 const both=compileBreadboard(editBreadboard(editBreadboard(s,{type:'open',id:'R1',open:true}),{type:'open',id:'R2',open:true}));assert.equal(measureVoltage(both,both.instruments[0].redNode,both.instruments[0].blackNode).status,'floating-reference');
});
test('invalid placement is rejected; moving, rewiring, short diagnostics and undo preserve stable identity',()=>{
 const s=dividerBreadboard();assert.throws(()=>editBreadboard(s,{type:'move',id:'R1',holes:['LP1','F1']}),/occupies/);
 let history=newBoardHistory(s);history=boardHistoryEdit(history,{type:'move',id:'R1',holes:['A2','F3']});assert.equal(history.state.placements.find(p=>p.id==='R1').holes[1],'F3');
 history=boardUndo(history);assert.deepEqual(history.state,s);history=boardRedo(history);assert.equal(history.state.placements.find(p=>p.id==='R1').holes[1],'F3');
 const rerouted=editBreadboard(s,{type:'reroute-wire',id:'W1',fromHole:'LP2',toHole:'C1'});assert.equal(rerouted.wires[0].id,'W1');
 const short=editBreadboard(s,{type:'connect',wire:{id:'SHORT',fromHole:'LP3',toHole:'LN3',closed:true}});assert.throws(()=>solveDC(compileBreadboard(short)),/shorted/);
 const removed=editBreadboard(s,{type:'remove-component',id:'R2'});assert.equal(removed.placements.length,2);assert.equal(s.placements.length,3);
 assert.deepEqual(JSON.parse(JSON.stringify(history)),history);
});
