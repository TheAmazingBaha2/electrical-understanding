// Original CETa Chapter 3 numeric mini-labs (based on TOC topic, not on unseen book text).
const def=[
 ["ceta-ladder","Prefix ladder",[["p","Prefix",[["micro","µ micro"],["milli","m milli"],["base","base"],["kilo","k kilo"],["mega","M mega"]]]]],
 ["ceta-powers","Powers of ten",[["e","Exponent",[["-6","−6"],["-3","−3"],["0","0"],["3","+3"],["6","+6"]]]]],
 ["ceta-notation","Scientific notation",[["coef","Coefficient",[["1.0","1.0"],["2.2","2.2"],["4.7","4.7"],["9.9","9.9"]]],["e","Exponent",[["-6","micro"],["-3","milli"],["0","base"],["3","kilo"],["6","mega"]]]]],
 ["ceta-convert","Electronics unit conversions",[["example","Example",[["ma","2.5 mA"],["ohm","4.7 kΩ"],["farad","330 µF"],["hz","1 MHz"]]]]],
 ["ceta-sanity","Current scale and resistor power",[["V","Voltage",[["3","3 V"],["5","5 V"],["9","9 V"],["12","12 V"]]],["R","Resistance",[["100","100 Ω"],["1000","1 kΩ"],["10000","10 kΩ"]]]]]
];
export const cetaWidgetKinds=def.map(x=>x[0]);
const get=(el,k)=>el.querySelector('[data-x="'+k+'"]')?.value;
const expText=e=>e>=0?'⁺'+e:'⁻'+Math.abs(e);
const fmt=n=>Math.abs(n)<0.00001?n.toExponential(2):new Intl.NumberFormat('en-US',{maximumFractionDigits:9}).format(n);
function result(kind,el){
 if(kind==='ceta-ladder'){
  const choice=get(el,'p'), map={micro:-6,milli:-3,base:0,kilo:3,mega:6};
  const v=map[choice];return {title:'10'+expText(v)+' amperes',value:'1 '+({micro:'µ',milli:'m',base:'',kilo:'k',mega:'M'}[choice])+'A = '+fmt(10**v)+' A',note:'The prefix changes the scale, not the electrical quantity.',factor:v};
 }
 if(kind==='ceta-powers'){const e=Number(get(el,'e'));return {title:'10'+expText(e),value:'10'+expText(e)+' = '+fmt(10**e),note:e<0?'Negative exponent: divide by a power of ten.':e>0?'Positive exponent: multiply by a power of ten.':'10⁰ = 1.',factor:e};}
 if(kind==='ceta-notation'){const e=Number(get(el,'e')),coef=Number(get(el,'coef'));return {title:coef+' × 10'+expText(e),value:fmt(coef*10**e)+' base units',note:'Equivalent expression: '+coef+' '+({[-6]:'µ',[-3]:'m',[0]:'',[3]:'k',[6]:'M'}[e])+' (same quantity).',factor:e};}
 if(kind==='ceta-convert'){
  const cases={ma:[2.5,-3,'A','mA'],ohm:[4.7,3,'Ω','kΩ'],farad:[330,-6,'F','µF'],hz:[1,6,'Hz','MHz']};
  const [v,e,unit,pref]=cases[get(el,'example')];
  return {title:v+' '+pref,value:fmt(v*10**e)+' '+unit,note:'Multiply by 10'+expText(e)+' to get the base unit.',factor:e};
 }
 const V=Number(get(el,'V')),R=Number(get(el,'R')),mA=V*1000/R,W=V*V/R;
 return {title:V+' V ÷ '+fmt(R)+' Ω',value:fmt(mA)+' mA = '+fmt(V/R)+' A',note:'Ideal resistor dissipation: '+fmt(W*1000)+' mW.'+(W>.25?' This exceeds an illustrative 0.25 W rating. Keep this virtual; verify real ratings.':''),factor:Math.round(mA)};
}
function graphic(k,r){
 const length=Math.min(460,Math.max(0,230+r.factor*29));
 const xy='<rect x="30" y="25" width="580" height="215" rx="20" fill="#163D59" stroke="#80CBE8" stroke-width="2"/>'+
 '<text x="53" y="72" fill="#CCF7FF" font-size="19" font-weight="700">'+r.title+'</text>'+
 '<text x="53" y="127" fill="#A0F8FF" font-size="26" font-weight="750">'+r.value+'</text>'+
 '<path d="M53 176 H553" stroke="#3C6981" stroke-width="12" stroke-linecap="round"/>'+
 '<path d="M53 176 H'+(53+length)+'" stroke="#8AE9FF" stroke-width="12" stroke-linecap="round"/>'+
 '<circle cx="'+(53+length)+'" cy="176" r="13" fill="#EDFBFF" stroke="#4394B9" stroke-width="4"/>'+
 '<text x="53" y="213" fill="#C2E7F8" font-size="15">'+(k==='ceta-sanity'?'V and R determine the modeled current':'Move the control and compare equivalent scales')+'</text>';
 return '<svg class="lab-illustration ceta-illustration" viewBox="0 0 640 270" role="img" aria-label="Interactive '+k+' quantity conversion with responsive visual scale">'+xy+'</svg>';
}
export function attachCetaWidgets(root=document){
 for(const el of root.querySelectorAll('.lab-widget[data-lab-kind^="ceta-"]')){
  const spec=def.find(d=>d[0]===el.dataset.labKind);if(!spec)continue;
  el.innerHTML='<p class="lab-prompt">Adjust the example, predict its scale, then compare the displayed equivalent value.</p><div class="lab-graphic"></div>'+
   spec[2].map(([key,label,choices])=>'<label class="lab-control">'+label+'<select data-x="'+key+'">'+choices.map(([value,title])=>'<option value="'+value+'">'+title+'</option>').join('')+'</select></label>').join('')+
   '<div class="lab-output" aria-live="polite"></div>';
  const update=()=>{const r=result(spec[0],el);el.querySelector('.lab-graphic').innerHTML=graphic(spec[0],r);el.querySelector('.lab-output').textContent=r.note;};
  el.querySelectorAll('[data-x]').forEach(x=>x.addEventListener('change',update));update();
 }
}
