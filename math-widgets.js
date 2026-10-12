// Small, self-contained numeric explorers for the mathematics track.
// All work offline in the browser; values are idealized examples, not live circuit advice.
export const mathWidgetKinds=[
 'math-prefix-current','math-prefix-capacitance','math-ohm-current','math-ohm-voltage',
 'math-series','math-divider','math-parallel','math-tolerance','math-error',
 'math-power','math-energy','math-period','math-cutoff'
];
const configs={
 'math-prefix-current':{title:'From milliamperes to amperes',label:'Current',min:1,max:50,step:1,value:5,unit:'mA',
  solve:x=>({formula:'I(A) = I(mA) ÷ 1,000',working:x+' ÷ 1,000',answer:(x/1000).toFixed(3)+' A',meaning:'The same current looks like a smaller number when expressed in base amperes.'})},
 'math-prefix-capacitance':{title:'From microfarads to farads',label:'Capacitance',min:100,max:1000,step:10,value:330,unit:'µF',
  solve:x=>({formula:'C(F) = C(µF) × 10⁻⁶',working:x+' × 0.000001',answer:(x/1e6).toFixed(6)+' F',meaning:'A fractional scale factor does not mean negative capacitance.'})},
 'math-ohm-current':{title:'Predict current from voltage',label:'Applied voltage',min:1,max:12,step:1,value:5,unit:'V',
  solve:x=>({formula:'I = V ÷ R; R = 1,000 Ω',working:x+' V ÷ 1,000 Ω',answer:(x).toFixed(1)+' mA',meaning:'The current increases when voltage rises across the same resistor. This is an ideal DC model.'})},
 'math-ohm-voltage':{title:'Predict resistor voltage',label:'Current',min:1,max:12,step:1,value:5,unit:'mA',
  solve:x=>({formula:'V = I × R; R = 1,000 Ω',working:(x/1000).toFixed(3)+' A × 1,000 Ω',answer:x.toFixed(1)+' V',meaning:'Convert milliamperes to amperes before multiplying by ohms.'})},
 'math-series':{title:'Add series resistances',label:'Third resistor',min:1,max:8,step:1,value:3,unit:'kΩ',
  solve:x=>({formula:'Rtotal = R1 + R2 + R3',working:'1 kΩ + 2 kΩ + '+x+' kΩ',answer:(x+3)+' kΩ',meaning:'Adding one resistor in the same current path always increases the series total.'})},
 'math-divider':{title:'Voltage drop across a series resistor',label:'First resistor',min:1,max:9,step:1,value:2,unit:'kΩ',
  solve:x=>({formula:'V1 = Vsupply × R1 ÷ (R1 + R2)',working:'10 V × '+x+' kΩ ÷ ('+x+' + 2) kΩ',answer:(10*x/(x+2)).toFixed(2)+' V',meaning:'The resistor receives the same fraction of total voltage as its fraction of total series resistance.'})},
 'math-parallel':{title:'Add branch currents',label:'Third branch resistance',min:1,max:8,step:1,value:1,unit:'kΩ',
  solve:x=>({formula:'Itotal = V/R1 + V/R2 + V/R3',working:'6 V / 1 kΩ + 6 V / 2 kΩ + 6 V / '+x+' kΩ',answer:(6+3+6/x).toFixed(2)+' mA',meaning:'The 6 V across each branch stays the same. A larger third resistance means less added current.'})},
 'math-tolerance':{title:'Find an acceptable example range',label:'Allowed tolerance',min:1,max:10,step:1,value:5,unit:'%',
  solve:x=>({formula:'Vmin,max = Vnominal × (1 ± tolerance ÷ 100)',working:'5 V ± '+(5*x/100).toFixed(2)+' V',answer:(5*(1-x/100)).toFixed(2)+' to '+(5*(1+x/100)).toFixed(2)+' V',meaning:'This is a hypothetical tolerance. Real acceptable limits require actual specifications.'})},
 'math-error':{title:'Calculate measurement percent error',label:'Displayed voltage',min:480,max:520,step:1,value:510,unit:'centivolts',
  solve:x=>({formula:'% error = |reading − reference| ÷ reference × 100',working:'|'+(x/100).toFixed(2)+' V − 5.00 V| ÷ 5 V × 100',answer:(Math.abs(x/100-5)/5*100).toFixed(1)+'%',meaning:'Reference 5.00 V is assumed known here. Error percent alone does not give a meter accuracy specification.'})},
 'math-power':{title:'Power in an ideal load',label:'Load current',min:1,max:10,step:1,value:2,unit:'× 0.1 A',
  solve:x=>({formula:'P = V × I',working:'5 V × '+(x/10).toFixed(1)+' A',answer:(5*x/10).toFixed(2)+' W',meaning:'Steady DC power is volts multiplied by amperes, or joules transferred per second.'})},
 'math-energy':{title:'Energy over minutes',label:'Operating time',min:1,max:10,step:1,value:5,unit:'minutes',
  solve:x=>({formula:'E = P × t ; P = 24 W',working:'24 W × ('+x+' min × 60 s/min)',answer:(24*x*60)+' J',meaning:'Use seconds to obtain joules. Doubling the duration doubles the energy transferred at constant power.'})},
 'math-period':{title:'Frequency and signal period',label:'Signal frequency',min:50,max:1000,step:50,value:100,unit:'Hz',
  solve:x=>({formula:'T = 1 ÷ f',working:'1 ÷ '+x+' Hz × 1,000 ms/s',answer:(1000/x).toFixed(2)+' ms',meaning:'Higher frequency means less time per cycle.'})},
 'math-cutoff':{title:'First-order RC low-pass cutoff',label:'Capacitance',min:1,max:10,step:1,value:1,unit:'µF',
  solve:x=>({formula:'fc = 1 ÷ (2πRC); R = 1,000 Ω',working:'1 / (2 × π × 1,000 Ω × '+x+' × 10⁻⁶ F)',answer:(1/(2*Math.PI*1000*x*1e-6)).toFixed(2)+' Hz',meaning:'Increasing C lowers cutoff. The cutoff is not a brick-wall filter for signals above it.'})}
};
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
export function renderMathWidget(kind){
 const cfg=configs[kind];if(!cfg)return '<div class="flash">Math explorer unavailable for this lesson.</div>';
 const s=cfg.solve(cfg.value);
 return '<div class="math-explorer" data-math-kind="'+esc(kind)+'"><p class="v2-kicker">TRY THE RELATIONSHIP</p><h4>'+esc(cfg.title)+'</h4>'+
 '<label class="math-control">'+esc(cfg.label)+': <output data-math-value>'+cfg.value+' '+esc(cfg.unit)+'</output>'+
 '<input type="range" min="'+cfg.min+'" max="'+cfg.max+'" step="'+cfg.step+'" value="'+cfg.value+'" aria-label="'+esc(cfg.label)+'"></label>'+
 '<div class="math-calculation"><div><strong>1. Equation</strong><p data-math-formula>'+esc(s.formula)+'</p></div>'+
 '<div><strong>2. Substitution</strong><p data-math-working>'+esc(s.working)+'</p></div>'+
 '<div><strong>3. Result</strong><p data-math-answer>'+esc(s.answer)+'</p></div></div>'+
 '<p class="math-explanation" data-math-meaning>'+esc(s.meaning)+'</p>'+
 '<p class="muted sm">Move the slider and predict whether the result increases or decreases before checking the new calculation.</p></div>';
}
export function attachMathWidgets(scope=document){
 for(const element of scope.querySelectorAll('.lab-widget[data-lab-kind^="math-"]')){
  const kind=element.dataset.labKind,cfg=configs[kind];if(!cfg)continue;
  element.innerHTML=renderMathWidget(kind);
  const slider=element.querySelector('input[type=range]'),set=(name,val)=>{element.querySelector('[data-math-'+name+']').textContent=val};
  slider.addEventListener('input',()=>{
   const x=Number(slider.value),s=cfg.solve(x);
   set('value',x+' '+cfg.unit);set('formula',s.formula);set('working',s.working);set('answer',s.answer);set('meaning',s.meaning);
  });
 }
}
