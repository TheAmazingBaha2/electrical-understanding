import test from 'node:test';import assert from 'node:assert/strict';
import {resolvePointerTarget,pointerDraft,attachLabPointerInput} from '../lab-pointer-input.js';
import {flowWorking,flowAction,dcSceneReading} from '../foundation-flow-model.js';
import {flowFixture} from './foundations-flow-fixture.mjs';
test('CSS-space targeting rejects ambiguity, preserves threshold and excludes disabled terminals',()=>{
 const terminals=[{id:'a',x:10,y:10},{id:'b',x:40,y:10}];
 assert.equal(resolvePointerTarget({x:0,y:10},terminals).target.id,'a');
 assert.equal(resolvePointerTarget({x:25,y:10},terminals).ambiguous,true);
 assert.equal(resolvePointerTarget({x:100,y:10},terminals).target,null);
 assert.equal(resolvePointerTarget({x:10,y:10},[{...terminals[0],disabled:true}]).target,null);
 assert.equal(pointerDraft({x:5,y:10},{x:11,y:10}).dragged,false);assert.equal(pointerDraft({x:5,y:10},{x:13,y:10}).dragged,true);
});
function harness(){
 const view=new EventTarget();let frame;view.requestAnimationFrame=fn=>{frame=fn;return 1;};view.cancelAnimationFrame=()=>{frame=null;};
 const root=new EventTarget(),handle={closest:()=>handle};root.ownerDocument={defaultView:view};root.contains=h=>h===handle;let captured=false;handle.setPointerCapture=()=>{captured=true;};handle.hasPointerCapture=()=>captured;handle.releasePointerCapture=()=>{captured=false;};
 const commits=[],previews=[],statuses=[];
 const detach=attachLabPointerInput(root,{handleSelector:'x',targets:()=>[{id:'b',x:100,y:20,label:'B'}],commit:(h,t)=>commits.push(t.id),preview:d=>previews.push(d),status:m=>statuses.push(m)});
 const fire=(name,props={})=>{const {target:destination=handle,...fields}=props;const event=new Event(name,{cancelable:true});Object.defineProperties(event,Object.fromEntries(Object.entries({pointerId:1,clientX:10,clientY:20,button:0,isPrimary:true,...fields}).map(([k,value])=>[k,{value}])));Object.defineProperty(event,'target',{value:destination});root.dispatchEvent(event);return event;};
 return {root,view,fire,commits,previews,statuses,detach,paint:()=>frame?.(),get captured(){return captured;}};
}
test('one successful drag commits once; its compatibility click is suppressed but a tap remains a tap',()=>{
 const h=harness();h.fire('pointerdown');h.fire('pointermove',{clientX:100});h.paint();assert.equal(h.previews.at(-1).target.id,'b');h.fire('pointerup',{clientX:100});assert.deepEqual(h.commits,['b']);assert.equal(h.captured,false);assert.equal(h.fire('click').defaultPrevented,true);h.fire('pointerup',{clientX:100});assert.equal(h.commits.length,1);h.fire('pointerdown');h.fire('pointerup');assert.equal(h.fire('click').defaultPrevented,false);h.detach();
 const tap=harness();tap.fire('pointerdown');tap.fire('pointerup');assert.deepEqual(tap.commits,[]);assert.equal(tap.fire('click').defaultPrevented,false);tap.detach();
});
for(const interruption of ['pointercancel','lostpointercapture','blur','orientationchange','pagehide','escape','second-pointer','unmount','invalid-drop'])test('draft cancellation preserves committed state: '+interruption,()=>{
 const h=harness();h.fire('pointerdown');h.fire('pointermove',{clientX:100});
 if(['blur','orientationchange','pagehide'].includes(interruption))h.view.dispatchEvent(new Event(interruption));
 else if(interruption==='escape')h.fire('keydown',{key:'Escape'});
 else if(interruption==='second-pointer')h.fire('pointerdown',{pointerId:2,isPrimary:false});
 else if(interruption==='unmount')h.detach();
 else if(interruption==='invalid-drop')h.fire('pointerup',{clientX:400});
 else h.fire(interruption);
 h.fire('pointerup',{clientX:100});assert.deepEqual(h.commits,[]);assert.equal(h.captured,false);h.detach();
});
test('tap-pair and atomic drag connection share topology and solved electrical state',()=>{
 const item=flowFixture().bank.challenges.find(c=>c.widgetKey==='simple-dc-scene'),initial=flowWorking(item);
 const drag=flowAction(item,initial,'connect-path'),tap=flowAction(item,flowAction(item,initial,'terminal:V1.p'),'terminal:R1.a');
 assert.deepEqual(drag.connection,tap.connection);assert.deepEqual(dcSceneReading(drag),dcSceneReading(tap));assert.deepEqual(initial,flowWorking(item));
});

test('post-drag suppression affects only the dragged handle, never keyboard activation or unrelated controls',()=>{
 const h=harness();h.fire('pointerdown');h.fire('pointermove',{clientX:100});h.fire('pointerup',{clientX:100});assert.equal(h.fire('click',{detail:1}).defaultPrevented,true);assert.equal(h.fire('click',{detail:0}).defaultPrevented,false);assert.equal(h.fire('click',{detail:1,target:{closest:()=>null}}).defaultPrevented,false);h.detach();
});
