// Deterministic, idealized virtual calculations for approved source-backed lessons.
// No AI request, hardware connection, external data, or claim that source images were reread.
const escape=v=>String(v??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const fmt=n=>Number.isFinite(n)?Number(n.toPrecision(5)).toLocaleString("en-US",{maximumFractionDigits:6}):"—";
const item=(label,min,max,value,unit,step=1)=>({label,min,max,value,unit,step});
const experiments={
 prefixes:{title:"SI prefix scale",inputs:[item("Capacitance",100,10000,1000,"pF",100)],
  solve:([p])=>["1 pF = 10⁻¹² F",fmt(p)+" pF = "+fmt(p/1000000)+" µF = "+fmt(p*1e-12)+" F","The pico- and micro-prefixes refer to the same quantity at different scales."]},
 algebra:{title:"Rearrange an equation",inputs:[item("Coefficient",1,20,4,""),item("Right-hand side",1,40,2,"")],
  solve:([b,a])=>["If "+fmt(b)+" × y = "+fmt(a)+", divide both sides by "+fmt(b),
   "y = "+fmt(a)+"/"+fmt(b)+" = "+fmt(a/b),
   "An inverse operation isolates the unknown without changing the equality."]},
 ohm:{title:"Ideal Ohm's law",inputs:[item("Voltage",1,24,5,"V"),item("Resistance",100,10000,1000,"Ω",100)],
  solve:([v,r])=>["I = V / R",fmt(v/r*1000)+" mA","Increasing voltage increases current; increasing resistance lowers it."]},
 power:{title:"Resistive power",inputs:[item("Voltage",1,24,5,"V"),item("Resistance",100,10000,1000,"Ω",100)],
  solve:([v,r])=>["P = V²/R; I = V/R","Power: "+fmt(v*v/r*1000)+" mW; current: "+fmt(v/r*1000)+" mA","At fixed resistance, doubling voltage doubles current and quadruples power."]},
 network:{title:"Resistor combinations",inputs:[item("R1",100,10000,1000,"Ω",100),item("R2",100,10000,2000,"Ω",100)],
  solve:([a,b])=>["Series = R1 + R2; parallel = R1 × R2 / (R1 + R2)","Series: "+fmt(a+b)+" Ω; parallel: "+fmt(a*b/(a+b))+" Ω","For two positive resistances, the parallel equivalent is below either branch resistance."]},
 internal:{title:"Battery internal resistance",inputs:[item("EMF",1,24,6,"V"),item("Load",1,20,6,"Ω"),item("Internal resistance",0.1,4,1,"Ω",0.1)],
  solve:([e,r,ri])=>["I = EMF / (Rload + r); Vterminal = I × Rload",
   "Current: "+fmt(e/(r+ri))+" A; terminal voltage: "+fmt(e*r/(r+ri))+" V","Some voltage is dropped inside the modeled source whenever load current flows."]},
 sine:{title:"Sinusoidal amplitude",inputs:[item("Peak amplitude",1,24,10,"V")],
  solve:([v])=>["Sine wave: Vpeak-to-peak = 2 × Vpeak; Vrms = Vpeak / √2",
   "Peak-to-peak: "+fmt(v*2)+" V; RMS: "+fmt(v/Math.sqrt(2))+" V","The RMS relationship applies to ideal sinusoidal waveforms, not arbitrary signal shapes."]},
 period:{title:"Frequency and period",inputs:[item("Frequency",50,10000,1000,"Hz",50)],
  solve:([f])=>["T = 1 / f","Period: "+fmt(1000/f)+" ms","Higher frequency means each cycle takes less time."]},
 energy:{title:"Capacitor charge and energy",inputs:[item("Capacitance",1,1000,100,"µF"),item("Voltage",1,24,5,"V")],
  solve:([c,v])=>["Q = CV; E = ½CV²","Charge: "+fmt(c*v)+" µC; stored energy: "+fmt(0.5*c*v*v)+" µJ",
   "Doubling voltage doubles charge but quadruples stored energy at fixed capacitance."]},
 capnetwork:{title:"Capacitor combinations",inputs:[item("C1",1,1000,100,"µF"),item("C2",1,1000,200,"µF")],
  solve:([a,b])=>["Parallel = C1 + C2; series = C1 × C2 / (C1 + C2)",
   "Parallel: "+fmt(a+b)+" µF; series: "+fmt(a*b/(a+b))+" µF",
   "Ideal capacitor networks combine opposite to resistors: parallel adds, series uses a reciprocal relation."]},
 rc:{title:"RC time constant",inputs:[item("Resistance",1,100,10,"kΩ"),item("Capacitance",1,100,5,"µF")],
  solve:([r,c])=>["τ = R × C","Time constant: "+fmt(r*c)+" ms","An ideal charging capacitor reaches about 63.2% of its final voltage after one time constant."]},
 xc:{title:"Capacitive reactance",inputs:[item("Frequency",0.1,20,1,"kHz",0.1),item("Capacitance",1,1000,100,"nF")],
  solve:([f,c])=>["Xc = 1 / (2πfC)","Capacitive reactance: "+fmt(1/(2*Math.PI*f*1000*c*1e-9))+" Ω",
   "For an ideal capacitor, higher frequency or capacitance lowers reactance."]},
 inductors:{title:"Uncoupled inductors",inputs:[item("L1",1,100,10,"mH"),item("L2",1,100,20,"mH")],
  solve:([a,b])=>["Series = L1 + L2; parallel = L1 × L2 / (L1 + L2)",
   "Series: "+fmt(a+b)+" mH; parallel: "+fmt(a*b/(a+b))+" mH",
   "This simplified comparison assumes negligible mutual magnetic coupling."]},
 xl:{title:"Inductive reactance",inputs:[item("Frequency",0.1,20,1,"kHz",0.1),item("Inductance",1,100,10,"mH")],
  solve:([f,l])=>["XL = 2πfL","Inductive reactance: "+fmt(2*Math.PI*f*1000*l/1000)+" Ω",
   "For an ideal inductor, higher frequency or inductance raises reactance."]},
 rlc:{title:"Series RLC impedance",inputs:[item("Frequency",0.1,20,1,"kHz",0.1),item("Inductance",1,100,10,"mH"),item("Capacitance",1,1000,100,"nF"),item("Resistance",1,100,10,"Ω")],
  solve:([f,l,c,r])=>{const xl=2*Math.PI*f*l,xc=1/(2*Math.PI*f*1e3*c*1e-9);return [
   "Z = √(R² + (XL − XC)²)",
   "XL: "+fmt(xl)+" Ω; XC: "+fmt(xc)+" Ω; |Z|: "+fmt(Math.hypot(r,xl-xc))+" Ω",
   "When reactances cancel, an ideal series RLC impedance equals its resistance."]}},
 resonance:{title:"Ideal resonance",inputs:[item("Inductance",10,1000,200,"µH",10),item("Capacitance",10,1000,200,"pF",10)],
  solve:([l,c])=>["fr = 1 / (2π√(LC))","Resonant frequency: "+fmt(1/(2*Math.PI*Math.sqrt(l*1e-6*c*1e-12))/1000)+" kHz",
   "At resonance, ideal inductive and capacitive reactance magnitudes are equal."]}
};
export const simulatorCatalog=Object.fromEntries(Object.entries(experiments).map(([id,spec])=>[id,{title:spec.title,inputs:spec.inputs}]));
export function simulationFor(title){
 const s=String(title||"").toLowerCase();
 const matches=[[/scientific notation|prefix conversions/,"prefixes"],[/variables|formula rearrangement/,"algebra"],
 [/resistor network/,"network"],[/internal resistance|terminal voltage/,"internal"],
 [/sinusoid|amplitude measure/,"sine"],[/period and frequency/,"period"],[/charge and stored energy/,"energy"],
 [/capacitor network/,"capnetwork"],[/time constant|exponential response/,"rc"],[/capacitive reactance/,"xc"],
 [/combining inductors|inductance and/,"inductors"],[/inductive reactance/,"xl"],
 [/series.rlc|phasor interpretation/,"rlc"],[/resonan/,"resonance"],[/ohm.s law|power calculation/,"ohm"]];
 return matches.find(([p])=>p.test(s))?.[1]||null;
}
// Trusted graph definitions; model output can select a template but cannot
// supply executable plotting expressions or arbitrary SVG.
export function simulationCurve(name,values){
 const [a,b]=values;
 const curves={
  ohm:{title:"Current rises with voltage",x:"Voltage (V)",y:"Current (mA)",min:0,max:24,fn:x=>x/b*1000},
  power:{title:"Resistive power grows with voltage squared",x:"Voltage (V)",y:"Power (mW)",min:0,max:24,fn:x=>x*x/b*1000},
  network:{title:"Parallel resistance as R1 changes",x:"R1 (Ω)",y:"Equivalent resistance (Ω)",min:100,max:10000,fn:x=>x*b/(x+b)},
  rc:{title:"Ideal capacitor charging",x:"Time (ms)",y:"Final voltage (%)",min:0,max:5*a*b,fn:x=>100*(1-Math.exp(-x/(a*b)))},
  sine:{title:"One ideal sinusoidal cycle",x:"Phase (radians)",y:"Voltage (V)",min:0,max:2*Math.PI,fn:x=>a*Math.sin(x)},
  xc:{title:"Capacitive reactance falls with frequency",x:"Frequency (kHz)",y:"Reactance (Ω)",min:.1,max:20,fn:x=>1/(2*Math.PI*x*1000*b*1e-9)},
  xl:{title:"Inductive reactance rises with frequency",x:"Frequency (kHz)",y:"Reactance (Ω)",min:.1,max:20,fn:x=>2*Math.PI*x*b},
  resonance:{title:"Resonance as capacitance changes",x:"Capacitance (pF)",y:"Frequency (kHz)",min:10,max:1000,fn:x=>1/(2*Math.PI*Math.sqrt(a*1e-6*x*1e-12))/1000}
 };
 const curve=curves[name];if(!curve||!values.every(Number.isFinite))return null;
 const points=Array.from({length:81},(_,i)=>{const x=curve.min+(curve.max-curve.min)*i/80;return [x,curve.fn(x)];});
 return points.every(p=>p.every(Number.isFinite))?{title:curve.title,x:curve.x,y:curve.y,points}:null;
}
function curveMarkup(curve){
 if(!curve)return '';
 const xmin=curve.points[0][0],xmax=curve.points.at(-1)[0],ys=curve.points.map(p=>p[1]);
 const ymin=Math.min(0,...ys),ymax=Math.max(...ys),span=ymax-ymin||1;
 const path=curve.points.map(([x,y],i)=>(i?'L':'M')+(42+(x-xmin)/(xmax-xmin)*400).toFixed(2)+','+(145-(y-ymin)/span*110).toFixed(2)).join(' ');
 return '<figure class="math-visual"><svg viewBox="0 0 500 190" style="width:100%;max-width:650px" role="img" aria-label="'+escape(curve.title)+'"><path d="M42 30 V145 H445" fill="none" stroke="#8ac7df"/><path d="'+path+'" fill="none" stroke="#35e0f2" stroke-width="3"/><text x="44" y="20" fill="currentColor" font-size="12">'+escape(curve.y)+'</text><text x="440" y="180" text-anchor="end" fill="currentColor" font-size="12">'+escape(curve.x)+'</text><text x="42" y="162" fill="currentColor" font-size="11">'+fmt(xmin)+'</text><text x="440" y="162" text-anchor="end" fill="currentColor" font-size="11">'+fmt(xmax)+'</text></svg><figcaption class="muted sm">'+escape(curve.title)+'. The curve updates with the slider settings; axes are linear and the circuit is idealized.</figcaption></figure>';
}
export function attachGeneratedSimulations(scope=document){
 for(const node of scope.querySelectorAll("[data-generated-simulator]")){
  const spec=experiments[node.dataset.generatedSimulator];
  if(!spec){node.textContent="This virtual comparison is unavailable.";continue;}
  node.innerHTML='<section class="panel"><p class="v2-kicker">VIRTUAL CIRCUIT MATH · NOT A PHYSICAL BENCH TEST</p><h4>'+escape(spec.title)+'</h4>'+
   '<p class="muted sm">Predict what changes, then move the sliders. All values are idealized and independent of real component ratings.</p>'+
   '<div class="controls">'+spec.inputs.map((x,i)=>'<label class="control">'+escape(x.label)+': <output data-sim-label="'+i+'"></output>'+
    '<input type="range" min="'+x.min+'" max="'+x.max+'" step="'+x.step+'" value="'+x.value+'" data-sim-input="'+i+'" aria-label="'+escape(x.label)+'"></label>').join("")+'</div>'+
   '<div class="math-calculation"><div><strong>Equation</strong><p data-sim-equation></p></div><div><strong>Result</strong><p data-sim-result></p></div></div>'+
   '<div data-sim-curve></div><p data-sim-explanation></p><p class="muted sm">This visualization supports the lesson but does not independently verify the textbook or authorize real wiring.</p></section>';
  const inputs=[...node.querySelectorAll("[data-sim-input]")];
  const refresh=()=>{
   const values=inputs.map((input,i)=>{const v=Number(input.value);node.querySelector('[data-sim-label="'+i+'"]').textContent=fmt(v)+" "+spec.inputs[i].unit;return v;});
   const [equation,result,explanation]=spec.solve(values);
   node.querySelector("[data-sim-equation]").textContent=equation;
   node.querySelector("[data-sim-result]").textContent=result;
   node.querySelector("[data-sim-explanation]").textContent=explanation;
   node.querySelector("[data-sim-curve]").innerHTML=curveMarkup(simulationCurve(node.dataset.generatedSimulator,values));
  };
  inputs.forEach(input=>input.addEventListener("input",refresh));refresh();
 }
}
