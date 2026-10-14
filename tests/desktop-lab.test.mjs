import test from 'node:test';
import assert from 'node:assert/strict';
import {dividerCircuit,solveDC,measureVoltage} from '../circuit-model.js';
import {circuitCanvasLayout,editCircuitCanvas,canvasHistoryEdit,canvasHistoryRestore,canvasTerminals,snapCanvasTerminal} from '../circuit-canvas.js';
import {newProject,validateProject,addSnapshot,restoreSnapshot} from '../project-store.js';
import {defaultDesktopLayout,resizeDesktopWindow,dockDesktopWindow,validateDesktopLayout} from '../desktop-windows.js';
import {detectLabPlatform,selectedLabPlatform,renderLabPlatform} from '../lab-platform.js';
import {renderPowerSupply} from '../component-editors.js';
import {renderCircuitCanvas} from '../circuit-canvas-view.js';
test('freeform graph builds a divider from supported parts, wires and reference without a new solver',()=>{
 let c=editCircuitCanvas(dividerCircuit(),circuitCanvasLayout(dividerCircuit()),{type:'clear'}),p=(id,type,properties,x,y)=>{c=editCircuitCanvas(c.circuit,c.layout,{type:'place',id,componentType:type,properties,position:{x,y}});};
 p('S','dc-source',{voltageVolts:5},190,300);p('A','resistor',{resistanceOhms:1000,tolerancePercent:5,bandCount:4},500,210);p('B','resistor',{resistanceOhms:1000,tolerancePercent:5,bandCount:4},500,450);
 for(const [id,from,to] of [['W1','S.p','A.p'],['W2','A.n','B.p'],['W3','B.n','S.n']])c=editCircuitCanvas(c.circuit,c.layout,{type:'connect',id,from,to});
 c=editCircuitCanvas(c.circuit,c.layout,{type:'reference',terminal:'S.n'});c=editCircuitCanvas(c.circuit,c.layout,{type:'probe',probe:'red',terminal:'A.n'});c=editCircuitCanvas(c.circuit,c.layout,{type:'probe',probe:'black',terminal:'S.n'});c=editCircuitCanvas(c.circuit,c.layout,{type:'power',powered:true});
 assert.equal(measureVoltage(c.circuit,'A.b','S.b').valueVolts,2.5);
 const moved=editCircuitCanvas(c.circuit,c.layout,{type:'move',id:'A',position:{x:800,y:400}});assert.deepEqual(moved.circuit,c.circuit);assert.equal(canvasTerminals(moved.circuit,moved.layout).find(t=>t.id==='A.p').x,720);assert.equal(snapCanvasTerminal(moved.circuit,moved.layout,{x:725,y:407}).id,'A.p');assert.equal(snapCanvasTerminal(moved.circuit,moved.layout,{x:0,y:0}),null);
 const open=editCircuitCanvas(c.circuit,c.layout,{type:'open',id:'W1',open:true});assert.equal(measureVoltage(open.circuit,'A.b','S.b').valueVolts,0);
 const removed=editCircuitCanvas(c.circuit,c.layout,{type:'remove-component',id:'B'});assert.equal(removed.circuit.connections.length,1);assert.equal(removed.circuit.components.length,2);assert.equal(measureVoltage(removed.circuit,'A.b','S.b').valueVolts,5);
 assert.match(renderCircuitCanvas(c.circuit,c.layout),/data-canvas-from="S.p" data-canvas-to="A.p"/);assert.throws(()=>editCircuitCanvas(c.circuit,c.layout,{type:'place',id:'x',componentType:'capacitor',properties:{},position:{x:100,y:100}}));
});
test('confirmed clear adapter and undo/snapshots preserve notes, independent project identity and original data',()=>{
 let p=newProject('preserved');p.notes='Keep notes';p.experimentState.canvasLayout=circuitCanvasLayout(p.circuit);p=addSnapshot(p,'Before clear','stable-snapshot');const original=structuredClone(p);
 const clear=canvasHistoryEdit(p.circuit,p.experimentState.canvasLayout,null,{type:'clear'});p.circuit=clear.circuit;p.experimentState.canvasLayout=clear.layout;p.experimentState.canvasHistory=clear.history;p.componentInventory=[];validateProject(p);
 assert.equal(p.circuit.components.length,0);assert.equal(p.circuit.state.powered,false);assert.equal(p.circuit.nodes.length,1);assert.equal(p.notes,original.notes);assert.deepEqual(p.snapshots,original.snapshots);
 const undo=canvasHistoryRestore(p.circuit,clear.layout,clear.history,'undo');assert.deepEqual(undo.circuit,original.circuit);assert.equal(canvasHistoryRestore(undo.circuit,undo.layout,undo.history,'redo').circuit.components.length,0);assert.deepEqual(restoreSnapshot(p,'stable-snapshot').circuit,original.circuit);
 assert.throws(()=>validateProject({...p,experimentState:{canvasLayout:{schemaVersion:9,positions:{}}}}));assert.equal(original.circuit.components.length,3);
});
test('ordinary supply is unipolar; old signed sources and signed meter readings remain unchanged',()=>{
 const c=dividerCircuit(),l=circuitCanvasLayout(c);assert.throws(()=>editCircuitCanvas(c,l,{type:'properties',id:'V1',properties:{voltageVolts:-1}}),/Unipolar/);
 assert.match(renderPowerSupply(c.components[0],true),/min="0" max="24"/);c.components[0].properties.voltageVolts=-5;
 assert.equal(measureVoltage(c,'output','common').valueVolts,-2.5);assert.match(renderPowerSupply(c.components[0],true),/Historical signed source preserved/);assert.doesNotMatch(renderPowerSupply(c.components[0],true),/data-graphic-range="supply-voltage"/);
 const changed=editCircuitCanvas(c,l,{type:'properties',id:'V1',properties:{voltageVolts:-9}});assert.equal(solveDC(changed.circuit).nodeVoltages.output,-4.5);
});
test('desktop geometry supports all edges/corners, docking and independent validated layout',()=>{
 const l=defaultDesktopLayout();validateDesktopLayout(l);for(const edge of ['n','s','e','w','ne','nw','se','sw']){const resized=resizeDesktopWindow({...l.windows.circuit,x:100,y:100},edge,20,20);validateDesktopLayout({...l,windows:{...l.windows,circuit:resized}});assert.equal(resized.dock,'free');}
 const right=dockDesktopWindow(l.windows.meter,'right',1200);assert.equal(right.x,816);assert.equal(right.width,384);assert.equal(dockDesktopWindow(right,'max',1200).width,1200);assert.throws(()=>validateDesktopLayout({...l,schemaVersion:2}));assert.throws(()=>resizeDesktopWindow(l.windows.circuit,'bad',0,0));
});
test('platform uses OS rather than viewport, override remains local, separate phone renderer is not desktop shell',()=>{
 assert.equal(detectLabPlatform({platform:'Win32',mobile:true}),'desktop');assert.equal(detectLabPlatform({userAgent:'Android'}),'mobile');assert.equal(detectLabPlatform({userAgent:'iPhone'}),'mobile');
 const storage={getItem:()=> 'mobile'};assert.equal(selectedLabPlatform({storage,navigator:{platform:'Win32'},search:''}),'mobile');assert.equal(selectedLabPlatform({storage,navigator:{},search:'?lab=desktop'}),'desktop');
 const mobile=renderLabPlatform({platform:'mobile'});assert.match(mobile,/mobile-lab/);assert.doesNotMatch(mobile,/data-canvas-world|data-meter-mode|input type="number"/);assert.match(renderLabPlatform({platform:'desktop'}),/data-lab-platform="desktop"/);
});
