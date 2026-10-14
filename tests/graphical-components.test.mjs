import test from 'node:test';import assert from 'node:assert/strict';
import {encodeResistance,decodeBands,resistancePresets,resistorColors} from '../resistor-color.js';
import {resistorArtwork,componentPalette} from '../lab-graphics.js';
test('standard four/five band rules round trip all supported presets and tolerance colors',()=>{
 for(const value of resistancePresets)for(const count of [4,5])for(const tol of resistorColors.filter(c=>c.tolerance!==null)){const code=encodeResistance(value,count,tol.tolerance);assert.equal(code.representable,true);const decoded=decodeBands(code.colors);assert.ok(Math.abs(decoded.resistanceOhms-value)<1e-8);assert.equal(decoded.tolerancePercent,tol.tolerance);assert.ok(decoded.minimum<=value&&decoded.maximum>=value);}
 assert.equal(decodeBands(['brown','black','red','gold']).resistanceOhms,1000);assert.equal(decodeBands(['gray','green','violet','black','brown']).resistanceOhms,857);
 assert.equal(encodeResistance(857,4).representable,false);assert.deepEqual(encodeResistance(857,4).alternatives,[850,860]);assert.equal(encodeResistance(857,5).representable,true);
 assert.throws(()=>decodeBands(['black','black','red','gold']));assert.throws(()=>decodeBands(['gold','black','red','gold']));assert.throws(()=>decodeBands(['brown','black','none','red']));assert.throws(()=>decodeBands(['brown','black','red','orange']));
 assert.equal(encodeResistance(1000,4,1.5).toleranceRepresentable,false);assert.equal(encodeResistance(1000,4,null).minimum,null);
});
test('shared part graphics do not advertise unsupported electrical models',()=>{assert.match(resistorArtwork({resistanceOhms:1000,tolerancePercent:5}),/data-resistor-band/);assert.ok(componentPalette.every(c=>!['capacitor','diode','led','transistor'].includes(c.id)));});
