import test from 'node:test';import assert from 'node:assert/strict';
import {electricalPrefixes,parseElectricalQuantity,displayQuantity,quantityFromDisplay,resistanceConductance,conductanceResistance,wireQuantities,dcSuppliedCalculation} from '../electrical-quantities.js';
const close=(a,b)=>assert.ok(Math.abs(a-b)<=1e-12*Math.max(Math.abs(a),Math.abs(b),1e-12),`${a} != ${b}`);
test('SI conversions preserve dimensions, case, centi/deci and all three documented micro spellings',()=>{
 for(const [text,unit,expected] of [['250 mV','V',.25],['1 kV','V',1000],['400 mA','A',.4],['250 µA','A',.00025],['250 μA','A',.00025],['250 uA','A',.00025],['500 nA','A',.0000005],['1 kohm','Ω',1000],['2 cV','V',.02],['2 dV','V',.2],['1e-3 A','A',.001],['-5 V','V',-5]])close(parseElectricalQuantity(text,unit).baseValue,expected);
 close(displayQuantity(parseElectricalQuantity('250 µA','A').baseValue,'A','m').displayedValue,.25);close(displayQuantity(parseElectricalQuantity('500 nA','A').baseValue,'A','µ').displayedValue,.5);
 assert.notEqual(parseElectricalQuantity('1 mA').baseValue,parseElectricalQuantity('1 MA').baseValue);
 for(const prefix of electricalPrefixes)for(const unit of ['V','A','Ω','S','W'])for(const base of [0,.0000025,1,12000])close(quantityFromDisplay(displayQuantity(base,unit,prefix.symbol).displayedValue,unit,prefix.symbol),base);
});
test('malformed, dimensional, overflow and ambiguous separator inputs fail explicitly without evaluating text',()=>{
 for(const text of ['1 KV','1,000 V','1_000 V','Infinity V','NaN A','1e999 W','1e-999 V','1 v','1 S/m','2 Ω/km','1;alert(1) V'])assert.throws(()=>parseElectricalQuantity(text));
 assert.throws(()=>parseElectricalQuantity('1 V','A'));assert.throws(()=>displayQuantity(Infinity,'A'));assert.throws(()=>quantityFromDisplay(Infinity,'V'));assert.equal(displayQuantity(-0,'V').displayedValue,0);
});
test('positive resistance/conductance and uniform single-wire examples match the source-bound arithmetic',()=>{
 for(const [r,g] of [[50,.02],[1000,.001],[.05,20]]){close(resistanceConductance(r).conductanceS,g);close(conductanceResistance(g).resistanceOhm,r);close(r*g,1);}
 close(wireQuantities({ohmPerKm:21,lengthM:100}).resistanceOhm,2.1);close(wireQuantities({ohmPerKm:8.4,lengthM:500}).resistanceOhm,4.2);
 for(const [lengthM,r,g] of [[500,5,.2],[1000,10,.1],[2000,20,.05]]){const q=wireQuantities({ohmPerKm:10,lengthM});close(q.resistanceOhm,r);close(q.conductanceS,g);}
 for(const bad of [0,-1,Infinity,NaN]){assert.throws(()=>resistanceConductance(bad));assert.throws(()=>conductanceResistance(bad));assert.throws(()=>wireQuantities({ohmPerKm:10,lengthM:bad}));}
});
test('matched supplied DC power examples normalize first and handle zero divisions honestly',()=>{
 for(const [v,a,p] of [[3,.2,.6],[220,.4,88],[24,.05,1.2]])close(dcSuppliedCalculation('power',{voltageV:v,currentA:a}).value,p);
 close(dcSuppliedCalculation('current',{powerW:6,voltageV:12}).value,.5);close(dcSuppliedCalculation('voltage',{powerW:24,currentA:2}).value,12);
 assert.equal(dcSuppliedCalculation('power',{voltageV:0,currentA:0}).value,0);
 for(const [unknown,values] of [['current',{powerW:0,voltageV:0}],['voltage',{powerW:24,currentA:0}]])assert.equal(dcSuppliedCalculation(unknown,values).status,'undefined');
 assert.throws(()=>dcSuppliedCalculation('power',{voltageV:Infinity,currentA:.1}));assert.throws(()=>dcSuppliedCalculation('power',{voltageV:1,currentA:-1}));
});
