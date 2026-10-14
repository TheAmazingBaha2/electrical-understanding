import test from 'node:test';
import assert from 'node:assert/strict';
import {dividerCircuit} from '../circuit-model.js';
import {resistanceReading,sharedMeterReading,prepareCurrentConnection,formatMeterReading} from '../shared-multimeter.js';
import {dividerBreadboard,compileBreadboard,holeNode} from '../breadboard-model.js';
test('equivalent resistance comes from the shared resistor network and rejects live sources',()=>{
 const c=dividerCircuit();assert.equal(resistanceReading(c,'source','common').status,'blocked');c.state.powered=false;
 assert.ok(Math.abs(resistanceReading(c,'source','common').value-2000)<1e-9);assert.ok(Math.abs(resistanceReading(c,'output','common').value-1000)<1e-9);
 c.components[1].state.open=true;assert.equal(resistanceReading(c,'source','common').status,'open-circuit');assert.equal(resistanceReading(c,'common','common').value,0);
});
test('continuity uses actual strips/wires and explicitly modeled threshold',()=>{
 const s=dividerBreadboard();s.powered=false;const c=compileBreadboard(s);c.instruments[0].redNode=holeNode('A1');c.instruments[0].blackNode=holeNode('E1');
 let r=sharedMeterReading(c,{mode:'continuity',jack:'VΩ'});assert.equal(r.continuity,true);assert.equal(r.value,0);assert.equal(r.thresholdOhms,30);
 c.instruments[0].blackNode=holeNode('F1');r=sharedMeterReading(c,{mode:'continuity',jack:'VΩ'});assert.equal(r.continuity,false);assert.ok(Math.abs(r.value-1000)<1e-9);
});
test('current connection requires off-power preparation and reads actual branch/polarity/open state',()=>{
 const c=dividerCircuit();assert.throws(()=>prepareCurrentConnection(c,'R1'),/power off/);assert.equal(sharedMeterReading(c,{mode:'current',jack:'A'}).status,'blocked');
 c.state.powered=false;const connection=prepareCurrentConnection(c,'R1');c.state.powered=true;
 const settings={mode:'current',jack:'A',currentConnection:connection};let r=sharedMeterReading(c,settings);assert.equal(formatMeterReading(r),'2.500 mA');
 connection.polarity='reverse';assert.equal(sharedMeterReading(c,settings).value,-.0025);c.components[1].state.open=true;assert.equal(sharedMeterReading(c,settings).value,0);
 assert.equal(sharedMeterReading(c,{mode:'voltage',jack:'A'}).status,'blocked');assert.equal(sharedMeterReading(c,{mode:'current',jack:'VΩ',currentConnection:connection}).status,'blocked');
});
