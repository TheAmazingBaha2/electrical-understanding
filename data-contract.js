// Shared JSON safety contract; independent of lesson and instrument rendering.
function object(v,label){if(!v||typeof v!=='object'||Array.isArray(v)||Object.getPrototypeOf(v)!==Object.prototype)throw Error(label+' must be a plain object');}
export function assertSerializable(value){
 const seen=new Set();function visit(v){
  if(v===null||typeof v==='string'||typeof v==='boolean')return;
  if(typeof v==='number'){if(!Number.isFinite(v))throw Error('Nonfinite number');return;}
  if(typeof v!=='object'||seen.has(v))throw Error('Nonserializable or cyclic data');
  seen.add(v);if(!Array.isArray(v))object(v,'JSON value');
  for(const [k,x] of Object.entries(v)){if(['__proto__','prototype','constructor'].includes(k))throw Error('Unsafe object key');visit(x);}seen.delete(v);
 }visit(value);return value;
}
