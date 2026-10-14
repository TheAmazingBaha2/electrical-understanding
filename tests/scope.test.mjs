import test from 'node:test';
import assert from 'node:assert/strict';
import {dividerCircuit} from '../circuit-model.js';
import {signalValue,scopeCapture} from '../scope-signals.js';
const signal={schemaVersion:1,waveform:'sine',amplitude:2,offset:1,frequency:1000};
const settings={source:'demo',signal,timeDiv:.001,voltsDiv:1,triggerLevel:1,redNode:'output',blackNode:'common'};
test('demo samples, offset, scales and trigger have explicit independent provenance',()=>{
 assert.equal(signalValue(signal,0),1);assert.equal(signalValue(signal,.00025),3);
 const r=scopeCapture(dividerCircuit(),settings);assert.equal(r.origin,'generated-demo');assert.equal(r.frequency,1000);assert.equal(r.period,.001);assert.equal(r.triggered,true);assert.ok(Math.abs(r.peakToPeak-4)<.02);
 assert.equal(scopeCapture(dividerCircuit(),{...settings,timeDiv:.01,signal:{...signal,frequency:10000}}).aliasRisk,true);
 assert.throws(()=>scopeCapture(dividerCircuit(),{...settings,signal:{...signal,amplitude:100}}),/Unsupported/);
});
test('DC trace comes from shared nodes and floating state never fabricates a waveform',()=>{
 const c=dividerCircuit();let r=scopeCapture(c,{...settings,source:'dc'});assert.equal(r.origin,'circuit-dc');assert.equal(r.peakToPeak,0);assert.ok(r.points.every(p=>p[1]===2.5));assert.equal(r.frequency,null);
 c.components[1].state.open=true;r=scopeCapture(c,{...settings,source:'dc'});assert.ok(r.points.every(p=>p[1]===0));c.components[2].state.open=true;assert.equal(scopeCapture(c,{...settings,source:'dc'}).status,'floating-reference');
});
