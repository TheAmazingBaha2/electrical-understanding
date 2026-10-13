import {drawLabGraphic} from './lab-visuals.js';
// Tested interactive visual exercises for EIM Basic companion lessons.
// Safe simulations only: all physical hookups require separate instrument verification.
const controls=(label,name,min,max,initial,step=1)=>'<label class="lab-control">'+label+' <input type="range" data-x="'+name+'" min="'+min+'" max="'+max+'" step="'+step+'" value="'+initial+'"></label>';
const select=(label,name,options)=>'<label class="lab-control">'+label+'<select data-x="'+name+'">'+options.map(o=>'<option value="'+o[0]+'">'+o[1]+'</option>').join('')+'</select></label>';
const output=()=>'<div class="lab-output" aria-live="polite"></div>';
const val=(el,name)=>el.querySelector('[data-x="'+name+'"]')?.value;
const chosen=(el,name)=>Number(val(el,name));

const predictionChallenges={
  series:{question:"If R3 increases with the supply fixed at 5 V, will total current increase or decrease?",correct:"decrease",reason:"Series resistance grows, so 5 V drives less current through the shared path."},
  divider:{question:"If the middle resistor gets larger, will its own share of the 5 V become larger or smaller?",correct:"increase",reason:"The middle resistor becomes a larger fraction of the series total, so its fraction of the 5 V drop increases."},
  parallel3:{question:"When the third parallel branch's resistance increases, does source current go up or down?",correct:"decrease",reason:"The first two branches still draw 5 mA each, but the third draws less, so total source current falls."},
  fault:{question:"Opening the third parallel branch changes total source current in which direction?",correct:"decrease",reason:"The open branch draws 0 mA while the two remaining 5 mA currents stay the same."}
};
function setupPrediction(el,kind){
 const challenge=predictionChallenges[kind];
 if(!challenge)return;
 const html='<div class="prediction-challenge"><div class="prediction-title"><span aria-hidden="true">✧</span> Prediction checkpoint <small>ungraded</small></div><p>'+challenge.question+'</p><div class="prediction-choices">'+
 '<button type="button" data-predict="increase">Increase / larger ↑</button>'+
 '<button type="button" data-predict="decrease">Decrease / smaller ↓</button>'+
 '</div><div class="prediction-feedback" aria-live="polite" hidden></div></div>';
 el.querySelector('.lab-graphic')?.insertAdjacentHTML("afterend",html);
 for(const button of el.querySelectorAll('[data-predict]')){
  button.addEventListener("click",()=>{
   const correct=button.dataset.predict===challenge.correct;
   for(const b of el.querySelectorAll('[data-predict]'))b.classList.toggle('chosen',b===button);
   const feedback=el.querySelector('.prediction-feedback');feedback.hidden=false;
   feedback.classList.toggle('correct',correct);
   feedback.textContent=(correct?"That's the expected direction. ":"Not quite—compare the branch/path resistance again. ")+challenge.reason;
  });
 }
}

function setup(el) {
 const kind=el.dataset.labKind;
 let content='',update=()=>{};
 if(kind==='tolerance'){
  content='<p class="lab-prompt">Predict whether the reading is within 950–1050 Ω, then move the slider.</p>'+controls('Measured resistance','r',900,1100,1030,5)+output();
  update=()=>{const r=chosen(el,'r');el.querySelector('.lab-output').textContent=r+' Ω is '+(r>=950&&r<=1050?'within':'outside')+' the nominal 1 kΩ ±5% range. The tolerance band describes manufacturing variation, not the accuracy of your meter.'};
 }
 if(kind==='bands'){
  const digits=[['0','Black'],['1','Brown'],['2','Red'],['3','Orange'],['4','Yellow'],['5','Green'],['6','Blue'],['7','Violet'],['8','Gray'],['9','White']];
  const mult=[['1','Black ×1'],['10','Brown ×10'],['100','Red ×100'],['1000','Orange ×1,000']];
  content='<p class="lab-prompt">Change the bands and predict the nominal ohmic value. Gold is the ±5% tolerance band.</p>'+select('Band 1','d1',digits)+select('Band 2','d2',digits)+select('Multiplier','mul',mult)+output();
  update=()=>{const a=chosen(el,'d1'),b=chosen(el,'d2'),m=chosen(el,'mul');el.querySelector('.lab-output').textContent=(10*a+b)*m+' Ω ±5%. First two colors form '+a+b+'; the third color multiplies that number.'};
 }
 if(kind==='rating'){
  content='<p class="lab-prompt">At what voltage does an ideal 1 kΩ resistor exceed a 0.25 W rating?</p>'+controls('Voltage across 1 kΩ resistor','v',0,20,5,0.5)+output();
  update=()=>{const v=chosen(el,'v'),p=v*v/1000;el.querySelector('.lab-output').textContent=v+' V → '+(1000*p).toFixed(1)+' mW dissipated. '+(p>.25?'Above the example 250 mW rating: unsuitable in this model.':'At or below 250 mW (do not operate real parts at their limit without checking ratings and derating).')};
 }
 if(kind==='breadboard'){
  const pts=Array.from({length:2},(_,row)=>'ABCDEFGHIJ'.split('').map(c=>[c+(row+1),c+(row+1)])).flat();
  content='<p class="lab-prompt">Choose two breadboard holes and predict whether a continuity test would beep on a typical unpowered training board.</p>'+select('First hole','first',pts)+select('Second hole','second',pts)+output();
  update=()=>{const a=val(el,'first'),b=val(el,'second'),n1=a.slice(1),n2=b.slice(1),side=c=>(c.charCodeAt(0)<70?'left':'right'),connected=n1===n2&&side(a)===side(b);el.querySelector('.lab-output').textContent=a+' ↔ '+b+': '+(connected?'connected strip':'not the same strip')+'. Real board power rails and layout must be verified separately.'};
 }
 if(kind==='meter'){
  content='<p class="lab-prompt">Choose a meter mode and connection on a simplified low-voltage circuit. Unsafe combinations are flagged rather than energized.</p>'+
  select('Meter function','mode',[['v','DC volts'],['a','DC current'],['ohm','Resistance / continuity']])+
  select('Probe arrangement','position',[['across','Across the two nodes'],['series','Inserted in series']])+
  '<label class="lab-control">Circuit power <select data-x="power"><option value="on">On</option><option value="off">Off, safely discharged</option></select></label>'+output();
  update=()=>{
   const mode=val(el,'mode'),pos=val(el,'position'),power=val(el,'power');
   let msg='';
   if(mode==='a'&&pos==='across')msg='UNSAFE: current mode placed across a source/load can create a low-resistance short. Never do this.';
   else if(mode==='ohm'&&power==='on')msg='UNSAFE: do not use ohms or continuity mode on an energized circuit.';
   else if(mode==='v'&&pos==='across')msg='Correct arrangement for voltage: compare two nodes by placing the voltmeter across them.';
   else if(mode==='a'&&pos==='series'&&power==='on')msg='Correct general idea for current: insert a correctly fused/rated ammeter in series, with power off while rewiring.';
   else if(mode==='ohm'&&pos==='across'&&power==='off')msg='Correct general idea for resistance: power off/discharge first, then probe across an isolated component or network.';
   else msg='This arrangement does not provide the intended measurement; revise the mode, circuit state or connection.';
   el.querySelector('.lab-output').textContent=msg;
  };
 }
 if(kind==='series'){
  content='<p class="lab-prompt">Predict how increasing R3 changes the total current through the one path.</p>'+controls('Third resistor R3','r',1000,3000,1000,250)+output();
  update=()=>{const r=chosen(el,'r'),rt=2000+r;el.querySelector('.lab-output').textContent='Rtotal = '+rt+' Ω · Itotal = '+(5000/rt).toFixed(3)+' mA · All three resistors have the same current.'};
 }
 if(kind==='divider'){
  content='<p class="lab-prompt">The 5 V source is across R1=1 kΩ, R2 (adjustable), R3=1 kΩ in series. Predict how R2 changes its own voltage drop.</p>'+controls('Middle resistor R2','r',1000,3000,1000,250)+output();
  update=()=>{const r=chosen(el,'r'),t=2000+r,i=5/t;el.querySelector('.lab-output').textContent='Series current: '+(1000*i).toFixed(3)+' mA · Drop on each 1 kΩ: '+(1000*i).toFixed(3)+' V · Drop on R2: '+(r*i).toFixed(3)+' V. All drops sum to 5 V.'};
 }
 if(kind==='parallel3'){
  content='<p class="lab-prompt">All three branches see 5 V. Change the third branch to predict source current.</p>'+controls('Third parallel resistor R3','r',1000,3000,1000,250)+output();
  update=()=>{const r=chosen(el,'r'),it=10+5000/r,eq=5000/it;el.querySelector('.lab-output').textContent='Rtotal = '+eq.toFixed(1)+' Ω · Branch currents: 5.00, 5.00, '+(5000/r).toFixed(2)+' mA · Source current: '+it.toFixed(2)+' mA.'};
 }
 if(kind==='fault'){
  content='<p class="lab-prompt">A connection opens on the third branch of three 1 kΩ resistors in parallel. Predict what happens to the other two.</p>'+
  select('Third branch state','open',[['closed','Connected'],['open','Open / disconnected']])+output();
  update=()=>{const open=val(el,'open')==='open';el.querySelector('.lab-output').textContent='Source current: '+(open?10:15)+' mA · Surviving branch voltage: 5 V each · Open branch current: '+(open?0:5)+' mA. An open branch removes a path; it does not distribute extra current.'};
 }
 if(!content)return;
 el.innerHTML=content;
 el.querySelector('.lab-prompt')?.insertAdjacentHTML('afterend','<div class="lab-graphic" aria-label="Visual circuit simulation"></div>');
 setupPrediction(el,kind);
 const first=el.querySelector('[data-x="d1"]');if(first)first.value='1';
 const second=el.querySelector('[data-x="d2"]');if(second)second.value='0';
 const multiplier=el.querySelector('[data-x="mul"]');if(multiplier)multiplier.value='100';
 const b2=el.querySelector('[data-x="second"]');if(b2)b2.value='E1';
 const paint=()=>{update();drawLabGraphic(el,kind)};
 for(const input of el.querySelectorAll('[data-x]')){input.addEventListener('input',paint);input.addEventListener('change',paint)}
 paint();
}
export function attachLabWidgets(root=document){root.querySelectorAll('.lab-widget[data-lab-kind]').forEach(setup)}
