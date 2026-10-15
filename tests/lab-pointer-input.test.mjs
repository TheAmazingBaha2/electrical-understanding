import test from 'node:test';import assert from 'node:assert/strict';
import {resolvePointerTarget,pointerDraft,attachLabPointerInput,attachLabTapControls} from '../lab-pointer-input.js';
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
function harness(options={}){
 const view=new EventTarget();let frame;view.requestAnimationFrame=fn=>{frame=fn;return 1;};view.cancelAnimationFrame=()=>{frame=null;};
 const root=new EventTarget(),handle={closest:()=>handle};root.ownerDocument={defaultView:view};root.contains=h=>h===handle;let captured=false;handle.setPointerCapture=()=>{captured=true;};handle.hasPointerCapture=()=>captured;handle.releasePointerCapture=()=>{captured=false;};
 const commits=[],previews=[],statuses=[];
 const detach=attachLabPointerInput(root,{handleSelector:'x',targets:()=>[{id:'b',x:100,y:20,label:'B'}],commit:(h,t)=>commits.push(t.id),preview:d=>previews.push(d),status:m=>statuses.push(m),...options});
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

function tapHarness(){
 const view=new EventTarget(),root=new EventTarget(),element={disabled:false,closest:()=>element,getBoundingClientRect:()=>({left:0,right:100,top:0,bottom:100})},calls=[];root.ownerDocument={defaultView:view};root.contains=el=>el===element;
 const detach=attachLabTapControls(root,{selector:'button',activate:el=>calls.push(el)});
 function fire(name,props={},where=name==='pointerdown'||name==='click'?root:view){const {target=element,...fields}=props,event=new Event(name,{cancelable:true});Object.defineProperties(event,Object.fromEntries(Object.entries({pointerId:1,pointerType:'touch',button:0,isPrimary:true,clientX:10,clientY:20,detail:1,...fields}).map(([key,value])=>[key,{value}])));Object.defineProperty(event,'target',{value:target});where.dispatchEvent(event);return event;}
 return {root,view,element,calls,detach,fire};
}
test('a deliberate touch tap executes once without requiring a synthesized click, while mouse and keyboard fallback remain',()=>{
 const h=tapHarness();h.fire('pointerdown');h.fire('pointerup');assert.equal(h.calls.length,1);assert.equal(h.fire('click').defaultPrevented,true);assert.equal(h.fire('click',{detail:0}).defaultPrevented,false);h.fire('pointerup');assert.equal(h.calls.length,1);
 h.fire('pointerdown');h.fire('pointerup');assert.equal(h.calls.length,2);assert.equal(h.fire('click').defaultPrevented,true);h.fire('pointerdown',{pointerType:'mouse'});h.fire('pointerup',{pointerType:'mouse'});assert.equal(h.calls.length,2);assert.equal(h.fire('click').defaultPrevented,false);h.detach();
});
for(const interruption of ['movement','cancel','outside','different-target','second-touch','outside-second-touch','blur','orientationchange','pagehide','keyboard','disabled','unmount'])test('ordinary control tap cancels safely: '+interruption,()=>{
 const h=tapHarness();h.fire('pointerdown');
 if(interruption==='movement')h.fire('pointermove',{clientX:30});
 else if(interruption==='cancel')h.fire('pointercancel');
 else if(interruption==='outside')h.fire('pointerup',{clientX:110});
 else if(interruption==='different-target')h.fire('pointerup',{target:{closest:()=>null}});
 else if(interruption==='second-touch')h.fire('pointerdown',{pointerId:2,isPrimary:false});
 else if(interruption==='outside-second-touch')h.fire('pointerdown',{pointerId:2,isPrimary:false},h.view);
 else if(interruption==='keyboard')h.fire('keydown',{key:'Enter'});
 else if(interruption==='disabled')h.element.disabled=true;
 else if(interruption==='unmount')h.detach();
 else h.fire(interruption);
 h.fire('pointerup');assert.equal(h.calls.length,0);h.detach();
});
test('captured probe taps share the reviewed activation callback while dragging commits only the connection',()=>{
 let taps=0;const h=harness({onTap:()=>taps++});h.fire('pointerdown');h.fire('pointerup');assert.equal(taps,1);assert.equal(h.fire('click',{detail:1}).defaultPrevented,true);h.fire('pointerdown');h.fire('pointermove',{clientX:100});h.fire('pointerup',{clientX:100});assert.equal(taps,1);assert.deepEqual(h.commits,['b']);h.detach();
});
