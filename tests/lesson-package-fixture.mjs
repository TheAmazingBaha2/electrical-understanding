export function packageFixture(){return {
 schemaVersion:1,id:'TEST-EXTERNAL-01',title:'Explicitly supplied lesson',description:'Synthetic validation fixture.',
 curriculum:{section:'math',source_id:'independent',source_title:'Original practice',chapter_id:'practice',chapter_title:'Practice',order:1,dashboard:true},
 source:{book:'Original practice',edition:'Not applicable',chapter:'Practice',printedPages:'No book pages'},references:[{id:'REF1',description:'Original synthetic test example',printedPages:'No book pages'}],
 objectives:['Compare current in an ideal resistance.'],sections:[{heading:'Current',body:'I = V/R',source_ids:['REF1']}],workedExamples:[{title:'Example',steps:['5 V divided by 1000 Ω'],result:'0.005 A',source_ids:['REF1']}],checkpoints:[],
 activities:[{id:'TEST-A1',title:'Prediction',prompt:'What changes with voltage?',expected:'Current changes.',explanation:'At fixed resistance, I = V/R.',source_ids:['REF1'],widget:{id:'simulation-ohm',version:'1.0.0',config:{}}}],
 questions:[{id:'TEST-Q1',type:'number',prompt:'5 V across 1 kΩ gives how many A?',answer:.005,tolerance:.00001,unit:'A',explain:'Divide voltage by resistance.',safety:false,source_ids:['REF1']}],
 reviewRules:{passFraction:.8,missedDays:1,initialSuccessDays:7,retrySuccessDays:21},prerequisites:[],approval:{status:'owner-approved',reviewedBy:'Synthetic fixture',approvedAt:'2026-10-14T00:00:00Z'}
};}
