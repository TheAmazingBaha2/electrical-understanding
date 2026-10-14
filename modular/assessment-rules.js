// Safe declarative arithmetic; no evaluator code or external provider.
const operators={
 choice:{unit:'',arity:0,calculate:(_,t)=>t.evaluator.correctIndex},
 'ohm-current':{unit:'A',arity:2,calculate:([v,r])=>{if(r<=0)throw Error('Resistance must be positive');return v/r;}},
 'ohm-voltage':{unit:'V',arity:2,calculate:([i,r])=>{if(r<=0)throw Error('Resistance must be positive');return i*r;}},
 'voltage-difference':{unit:'V',arity:2,calculate:([red,black])=>red-black},
 'voltage-divider':{unit:'V',arity:3,calculate:([v,a,b])=>{if(a<=0||b<=0)throw Error('Divider resistances must be positive');return v*b/(a+b);}},
 'series-resistance':{unit:'Ω',calculate:rs=>{if(!rs.length||rs.some(r=>r<0))throw Error('Invalid series resistance');return rs.reduce((a,b)=>a+b,0);}},
 'parallel-resistance':{unit:'Ω',calculate:rs=>{if(!rs.length||rs.some(r=>r<=0))throw Error('Invalid parallel resistance');return 1/rs.reduce((a,b)=>a+1/b,0);}}
};
const compare={positive:v=>v.length===1&&v[0]>0,nonzero:v=>v.length===1&&v[0]!==0,'greater-than':v=>v.length===2&&v[0]>v[1]};
export function answerFor(template,parameters){const values=Object.fromEntries(parameters.map(p=>[p.name,p.value]));const result=operators[template.evaluator.op].calculate(template.evaluator.inputs.map(name=>values[name]),template);if(!Number.isFinite(result))throw Error('Nonfinite assessment result');return result;}
export function parameterSets(template){
 let sets=[[]];for(const parameter of template.parameters)sets=sets.flatMap(values=>parameter.values.map(value=>[...values,{name:parameter.name,value}]));
 return sets.filter(set=>{const values=Object.fromEntries(set.map(p=>[p.name,p.value]));return template.constraints.every(c=>compare[c.op](c.inputs.map(name=>values[name])));});
}
export function assertAssessmentSemantics(template){
 const names=template.parameters.map(p=>p.name),op=operators[template.evaluator.op];
 if(new Set(names).size!==names.length||names.some(n=>['constructor','prototype','__proto__'].includes(n)))throw Error('Unsafe/duplicate parameter name');
 if(template.parameters.some(p=>new Set(p.values).size!==p.values.length))throw Error('Duplicate allowed parameter value');
 let combinations=1;for(const p of template.parameters){combinations*=p.values.length;if(combinations>16384)throw Error('Assessment exceeds bounded 16384-combination validation budget');}
 if(template.evaluator.inputs.some(name=>!names.includes(name))||template.constraints.some(c=>c.inputs.some(name=>!names.includes(name))))throw Error('Unknown evaluator/constraint parameter');
 if(op.arity!==undefined&&template.evaluator.inputs.length!==op.arity||template.unit!==op.unit)throw Error('Evaluator arity/unit mismatch');
 if(template.constraints.some(c=>c.inputs.length!==(c.op==='greater-than'?2:1)))throw Error('Constraint arity mismatch');
 if(template.type==='static-choice'){
  if(template.evaluator.op!=='choice'||template.renderer!=='selectable-choice@1'||template.parameters.length||template.constraints.length||template.choices.length<2||!Number.isInteger(template.evaluator.correctIndex)||template.evaluator.correctIndex>=template.choices.length)throw Error('Invalid static choice contract');
 }else if(template.evaluator.op==='choice'||template.renderer!=='numeric-unit@1'||!template.parameters.length||template.choices.length||Object.hasOwn(template.evaluator,'correctIndex'))throw Error('Invalid numeric template contract');
 for(const text of [template.prompt,template.explanation])for(const match of text.matchAll(/\{\{([^}]+)\}\}/g))if(!names.includes(match[1]))throw Error('Unknown prompt parameter');
 const sets=parameterSets(template);if(!sets.length)throw Error('Constraints exclude all parameter combinations');
 for(const set of sets)answerFor(template,set);
 return template;
}
