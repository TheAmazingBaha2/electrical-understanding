import test from 'node:test';
import assert from 'node:assert/strict';
import {materialCard,resistanceDirection,vacancyMove,vacancyState,carrierMajority,validateMaterialWidget,materialWorking,materialAction,materialObservation} from '../foundation-material-model.js';
const carrier={widgetKey:'carrier-vacancy',config:{occupancy:[1,1,0,1,1],fromIndex:3,toIndex:2},grading:{expectedPrediction:{holeDirection:'right',finalOccupancy:[1,1,1,0,1],electronCount:4}}};
test('vacancy moves are legal, bounded, conserve electrons and have opposite directions',()=>{
 for(let length=4;length<=7;length++)for(let hole=0;hole<length;hole++)for(const from of [hole-1,hole+1].filter(i=>i>=0&&i<length)){
  const occupancy=Array.from({length},(_,i)=>Number(i!==hole)),m=vacancyMove(occupancy,from);assert.equal(m.electronCount,length-1);assert.equal(m.occupancy.indexOf(0),from);assert.notEqual(m.electronDirection,m.vacancyDirection);assert.equal(occupancy[hole],0);
 }
 for(const invalid of [[1,1,1,1],[0,0,1,1],[1,0,2,1],[1,0,1]])assert.throws(()=>vacancyState(invalid));assert.throws(()=>vacancyMove([1,1,0,1,1],0));assert.throws(()=>vacancyMove([1,1,0,1,1],2));
 const working=materialWorking(carrier),moved=materialAction(carrier,working,'move:3');assert.deepEqual(moved.occupancy,[1,1,1,0,1]);assert.deepEqual(working.occupancy,[1,1,0,1,1]);assert.equal(materialObservation(carrier,moved).lastMove.electronDirection,'left');assert.equal(materialAction(carrier,moved,'reset').actionCount,1);
});
test('carrier abundance is separate from atom charge or absence of minority carriers',()=>{
 assert.deepEqual(carrierMajority(3,9),{electrons:3,holes:9,majority:'holes',minority:'electrons',type:'P'});assert.equal(carrierMajority(10,2).type,'N');for(const pair of [[0,2],[2,2],[NaN,2],[-1,4],[2,21]])assert.throws(()=>carrierMajority(...pair));
 assert.throws(()=>validateMaterialWidget({...carrier,grading:{expectedPrediction:{holeDirection:'left',finalOccupancy:[1,1,1,0,1],electronCount:4}}}),/contradicts/);
});
test('material conditions and carrier presentation are explicit; liquids never reuse metal animation',()=>{
 assert.equal(materialCard('copper-wire-room-conditions','conductors').carrier,'metal-electrons');assert.equal(materialCard('saltwater-described','conductors').carrier,'ions-note');assert.equal(materialCard('ionized-gas','conductors').carrier,'description-only');assert.equal(materialCard('ordinary-gas','conductors').movement,'difficult');assert.equal(materialCard('insulator-damaged-loss-stated','insulators').separatesCharges,false);assert.throws(()=>materialCard('copper-wire-room-conditions','insulators'));
 const card={widgetKey:'material-response',config:{mode:'conductors',caseId:'copper-wire-room-conditions'},grading:{expectedPrediction:{movement:'easy'}}};assert.equal(materialWorking(card).comparisonApplied,false);assert.equal(materialAction(card,materialWorking(card),'compare').actionCount,1);assert.throws(()=>validateMaterialWidget({...card,grading:{expectedPrediction:{movement:'difficult'}}}));
});
test('the relative resistance direction follows conditions rather than condition labels',()=>{
 assert.equal(resistanceDirection('easier','harder'),'increase');assert.equal(resistanceDirection('harder','easier'),'decrease');assert.throws(()=>resistanceDirection('unknown','harder'));const item={widgetKey:'material-response',config:{mode:'semiconductor_conditions',initialConduction:'easier',targetConduction:'harder'},grading:{expectedPrediction:{resistanceDirection:'increase'}}},state=materialWorking(item),swapped=materialAction(item,state,'swap');assert.equal(materialObservation(item,state).resistanceDirection,'increase');assert.equal(materialObservation(item,swapped).resistanceDirection,'decrease');assert.equal(materialObservation(item,swapped).quantitativeOutput,false);
});
