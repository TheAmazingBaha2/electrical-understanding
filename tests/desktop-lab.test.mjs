import test from 'node:test';
import assert from 'node:assert/strict';
import {dividerCircuit,solveDC,measureVoltage} from '../circuit-model.js';
import {circuitCanvasLayout,editCircuitCanvas,canvasHistoryEdit,canvasHistoryRestore,canvasTerminals,canvasProbeTerminal,snapCanvasTerminal} from '../circuit-canvas.js';
import {newProject,validateProject,inventoryForCircuit,addSnapshot,restoreSnapshot} from '../project-store.js';
import {defaultDesktopLayout,fitDesktopWindow,resizeDesktopWindow,dockDesktopWindow,validateDesktopLayout} from '../desktop-windows.js';
import {detectLabPlatform,selectedLabPlatform,renderLabPlatform} from '../lab-platform.js';
import {renderPowerSupply} from '../component-editors.js';
import {sharedMeterReading} from '../shared-multimeter.js';
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

test("saved desktop windows stay reachable on smaller monitors without changing electrical state",()=>{const original={...defaultDesktopLayout().windows.scope,x:1600,y:1200,width:780,height:650},fit=fitDesktopWindow(original,{width:1000,height:900});assert.equal(fit.x,220);assert.equal(fit.y,250);assert.ok(fit.x+fit.width<=1000);assert.ok(fit.y+fit.height<=900);assert.equal(original.x,1600);});

test('physical probe endpoints stay on the selected terminal, and clearing/removing contacts refuses readings',()=>{
 const circuit=dividerCircuit(),layout=circuitCanvasLayout(circuit),selected=editCircuitCanvas(circuit,layout,{type:'probe',probe:'red',terminal:'R2.a'});
 assert.equal(canvasProbeTerminal(selected.circuit,selected.layout,'red').id,'R2.a');assert.equal(sharedMeterReading(selected.circuit).value,2.5);
 const moved=editCircuitCanvas(selected.circuit,selected.layout,{type:'move',id:'R2',position:{x:700,y:600}});assert.equal(canvasProbeTerminal(moved.circuit,moved.layout,'red').x,620);assert.equal(sharedMeterReading(moved.circuit).value,2.5);
 const removed=editCircuitCanvas(moved.circuit,moved.layout,{type:'remove-component',id:'R2'});assert.equal(canvasProbeTerminal(removed.circuit,removed.layout,'red'),null);assert.equal(sharedMeterReading(removed.circuit).status,'blocked');
 const clear=canvasHistoryEdit(selected.circuit,selected.layout,null,{type:'clear'});assert.equal(sharedMeterReading(clear.circuit).value,null);assert.equal(sharedMeterReading(clear.circuit).status,'blocked');
 const undo=canvasHistoryRestore(clear.circuit,clear.layout,clear.history,'undo');assert.equal(undo.circuit.instruments[0].redTerminalId,'R2.a');assert.equal(sharedMeterReading(undo.circuit).value,2.5);assert.equal(sharedMeterReading(circuit).value,2.5);
});

test('geometric edits and clear/undo preserve inventory annotations and unknown unlinked stock',()=>{const p=newProject();p.componentInventory[0].annotation={keep:'source calibration note'};p.componentInventory.push({futureStock:'keep',quantity:15});const original=structuredClone(p.componentInventory),layout=circuitCanvasLayout(p.circuit);const moved=editCircuitCanvas(p.circuit,layout,{type:'move',id:'R1',position:{x:800,y:600}});assert.deepEqual(inventoryForCircuit(moved.circuit,p.componentInventory),original);const cleared=canvasHistoryEdit(p.circuit,layout,null,{type:'clear'},p.componentInventory),active=inventoryForCircuit(cleared.circuit,p.componentInventory);assert.deepEqual(active,[{futureStock:'keep',quantity:15}]);const undo=canvasHistoryRestore(cleared.circuit,cleared.layout,cleared.history,'undo',active);assert.deepEqual(undo.componentInventory,original);assert.deepEqual(canvasHistoryRestore(undo.circuit,undo.layout,undo.history,'redo',undo.componentInventory).componentInventory,active);});

test('measured workspaces have no legacy 1800px cap and all resize edges remain bounded',async()=>{
 const {presentDesktopLayout}=await import('../desktop-windows.js'),state=defaultDesktopLayout();
 for(const width of [280,768,1280,1440,1650,1920,2560,3440]){
  const area={width,height:900},projected=presentDesktopLayout(state,area);
  assert.equal(projected.meter.x+projected.meter.width,width);
  assert.equal(projected.circuit.height,900);assert.equal(projected.scope.visible,false);assert.equal(projected.project.visible,false);
  assert.equal(dockDesktopWindow(state.windows.circuit,'max',area).width,width);
  for(const w of Object.values(projected))for(const edge of ['n','s','e','w','ne','nw','se','sw'])for(const delta of [-10000,10000]){
   const r=resizeDesktopWindow(w,edge,delta,delta,area);assert.ok(r.x>=0&&r.y>=0);assert.ok(r.width>0&&r.height>0);assert.ok(r.x+r.width<=width&&r.y+r.height<=900);
  }
 }
});
test('temporary viewport fitting is a projection and preserves saved free layouts for enlargement',async()=>{
 const {presentDesktopLayout}=await import('../desktop-windows.js'),state=defaultDesktopLayout();state.windows.meter={...state.windows.meter,x:2700,y:1200,width:600,height:800,dock:'free'};validateDesktopLayout(state);
 const original=structuredClone(state),small=presentDesktopLayout(state,{width:700,height:500});assert.equal(small.meter.x,100);assert.equal(small.meter.y,0);assert.deepEqual(state,original);
 const restored=presentDesktopLayout(state,{width:3440,height:2200});assert.equal(restored.meter.x,2700);assert.equal(restored.meter.y,1200);assert.deepEqual(state,original);
});
test('pointer coordinates follow measured stage scaling, borders and scroll rather than screen pixels',async()=>{
 const {desktopPointerPoint}=await import('../desktop-windows.js');
 for(const scale of [.67,.8,1,1.25,2]){const geometry={left:73,top:-120,width:1200*scale,height:800*scale,offsetWidth:1200,offsetHeight:800,clientLeft:2,clientTop:2,scrollLeft:61,scrollTop:29};
  const p=desktopPointerPoint({clientX:73+402*scale,clientY:-120+202*scale},geometry);assert.ok(Math.abs(p.x-461)<1e-9);assert.ok(Math.abs(p.y-229)<1e-9);
 }
});

test('illustrative wire routes preserve exact topology, readings, physical properties and reversible project history',()=>{
 const original=dividerCircuit(),layout=circuitCanvasLayout(original),wired=editCircuitCanvas(original,layout,{type:'connect',id:'route-test',from:'V1.p',to:'R1.a'}),before=structuredClone(wired.circuit),reading=sharedMeterReading(before,{mode:'voltage',jack:'VΩ'});
 const routed=canvasHistoryEdit(wired.circuit,wired.layout,null,{type:'route-wire',id:'route-test',points:[{x:240,y:370}]});assert.deepEqual(routed.circuit,before);assert.deepEqual(sharedMeterReading(routed.circuit,{mode:'voltage',jack:'VΩ'}),reading);assert.match(renderCircuitCanvas(routed.circuit,routed.layout,{selectedWire:'route-test'}),/L240 370/);assert.match(renderCircuitCanvas(routed.circuit,routed.layout,{selectedWire:'route-test'}),/data-canvas-bend="route-test"/);
 const undo=canvasHistoryRestore(routed.circuit,routed.layout,routed.history,'undo');assert.deepEqual(undo.layout,wired.layout);assert.deepEqual(canvasHistoryRestore(undo.circuit,undo.layout,undo.history,'redo').layout,routed.layout);
 const p=newProject('route-project');p.circuit=routed.circuit;p.experimentState.canvasLayout=routed.layout;validateProject(p);const copy=JSON.parse(JSON.stringify(p));validateProject(copy);assert.deepEqual(copy.experimentState.canvasLayout,routed.layout);
 assert.throws(()=>editCircuitCanvas(before,wired.layout,{type:'route-wire',id:'absent',points:[]}));assert.throws(()=>editCircuitCanvas(before,wired.layout,{type:'route-wire',id:'route-test',points:[{x:Infinity,y:2}]}));assert.deepEqual(wired.circuit,before);
});
