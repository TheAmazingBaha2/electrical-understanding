import test from 'node:test';import assert from 'node:assert/strict';
import {encodeResistance,decodeBands,resistancePresets,resistorColors} from '../resistor-color.js';
import {resistorArtwork,componentPalette} from '../lab-graphics.js';
import {dividerBreadboard,editBreadboard,compileBreadboard} from '../breadboard-model.js';
import {componentPlacementGraphic,boardPoint,renderGraphicalBreadboard} from '../graphical-breadboard.js';
import {measureVoltage} from '../circuit-model.js';
test('standard four/five band rules round trip all supported presets and tolerance colors',()=>{
 for(const value of resistancePresets)for(const count of [4,5])for(const tol of resistorColors.filter(c=>c.tolerance!==null)){const code=encodeResistance(value,count,tol.tolerance);assert.equal(code.representable,true);const decoded=decodeBands(code.colors);assert.ok(Math.abs(decoded.resistanceOhms-value)<1e-8);assert.equal(decoded.tolerancePercent,tol.tolerance);assert.ok(decoded.minimum<=value&&decoded.maximum>=value);}
 assert.equal(decodeBands(['brown','black','red','gold']).resistanceOhms,1000);assert.equal(decodeBands(['gray','green','violet','black','brown']).resistanceOhms,857);
 assert.equal(encodeResistance(857,4).representable,false);assert.deepEqual(encodeResistance(857,4).alternatives,[850,860]);assert.equal(encodeResistance(857,5).representable,true);
 assert.throws(()=>decodeBands(['black','black','red','gold']));assert.throws(()=>decodeBands(['gold','black','red','gold']));assert.throws(()=>decodeBands(['brown','black','none','red']));assert.throws(()=>decodeBands(['brown','black','red','orange']));
 assert.equal(encodeResistance(1000,4,1.5).toleranceRepresentable,false);assert.equal(encodeResistance(1000,4,null).minimum,null);
});
test('shared part graphics do not advertise unsupported electrical models',()=>{assert.match(resistorArtwork({resistanceOhms:1000,tolerancePercent:5}),/data-resistor-band/);assert.ok(componentPalette.every(c=>!['capacitor','diode','led','transistor'].includes(c.id)));});
test('graphic endpoints use actual board contacts; tolerance metadata never changes nominal physics',()=>{
 const s=dividerBreadboard(),p=s.placements[1],art=componentPlacementGraphic(p);assert.match(art,/data-terminal-a="A1" data-terminal-b="F1"/);assert.equal(boardPoint('A1').y,boardPoint('F1').y);assert.notEqual(boardPoint('A1').x,boardPoint('F1').x);
 const updated=editBreadboard(s,{type:'properties',id:'R1',properties:{tolerancePercent:1,bandCount:5}}),c=compileBreadboard(updated);assert.equal(measureVoltage(c,c.instruments[0].redNode,c.instruments[0].blackNode).valueVolts,2.5);assert.equal(updated.placements[1].properties.tolerancePercent,1);assert.equal(s.placements[1].properties.tolerancePercent,undefined);const boardArt=renderGraphicalBreadboard({state:s,undo:[],redo:[]},{tool:'resistor',newValue:1000});assert.match(boardArt,/data-graphic-command="draft-resistance"/);assert.match(boardArt,/data-graphic-command="board-edit-draft"/);assert.match(resistorArtwork({resistanceOhms:1000,tolerancePercent:5},{interactive:true}),/role="button" tabindex="0"/);
 const changed=editBreadboard(updated,{type:'properties',id:'R1',properties:{resistanceOhms:2000}}),d=compileBreadboard(changed);assert.ok(Math.abs(measureVoltage(d,d.instruments[0].redNode,d.instruments[0].blackNode).valueVolts-5/3)<1e-12);
 assert.throws(()=>editBreadboard(s,{type:'properties',id:'R1',properties:{tolerancePercent:30}}));assert.throws(()=>editBreadboard(s,{type:'properties',id:'R1',properties:{bandCount:7}}));
});
