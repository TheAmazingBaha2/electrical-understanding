// Deterministic, idealized virtual calculations for approved source-backed lessons.
// No AI request, hardware connection, external data, or claim that source images were reread.
const escape=v=>String(v??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const fmt=n=>Number.isFinite(n)?Number(n.toPrecision(5)).toLocaleString("en-US",{maximumFractionDigits:6}):"—";
const item=(label,min,max,value,unit,step=1)=>({label,min,max,value,unit,step});
const experiments={
 prefixes:{title:"SI prefix scale",inputs:[item("Capacitance",100,10000,1000,"pF",100)],
  solve:([p])=>["1 pF = 10⁻¹² F",fmt(p)+" pF = "+fmt(p/1000000)+" µF = "+fmt(p*1e-12)+" F","The pico- and micro-prefixes refer to the same quantity at different scales."]},
 ohm:{title:"Ideal Ohm's law",inputs:[item("Voltage",1,24,5,"V"),item("Resistance",100,10000,1000,"Ω",100)],
  solve:([v,r])=>["I = V / R",fmt(v/r*1000)+" mA","Increasing voltage increases current; increasing resistance lowers it."]},
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
export function simulationFor(title){
 const s=String(title||"").toLowerCase();
 const matches=[[/scientific notation|prefix conversions/,"prefixes"],[/variables|formula rearrangement/,"ohm"],
 [/resistor network/,"network"],[/internal resistance|terminal voltage/,"internal"],
 [/sinusoid|amplitude measure/,"sine"],[/period and frequency/,"period"],[/charge and stored energy/,"energy"],
 [/capacitor network/,"capnetwork"],[/time constant|exponential response/,"rc"],[/capacitive reactance/,"xc"],
 [/combining inductors|inductance and/,"inductors"],[/inductive reactance/,"xl"],
 [/series.rlc|phasor interpretation/,"rlc"],[/resonan/,"resonance"],[/ohm.s law|power calculation/,"ohm"]];
 return matches.find(([p])=>p.test(s))?.[1]||null;
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
   '<p data-sim-explanation></p><p class="muted sm">This visualization supports the lesson but does not independently verify the textbook or authorize real wiring.</p></section>';
  const inputs=[...node.querySelectorAll("[data-sim-input]")];
  const refresh=()=>{
   const values=inputs.map((input,i)=>{const v=Number(input.value);node.querySelector('[data-sim-label="'+i+'"]').textContent=fmt(v)+" "+spec.inputs[i].unit;return v;});
   const [equation,result,explanation]=spec.solve(values);
   node.querySelector("[data-sim-equation]").textContent=equation;
   node.querySelector("[data-sim-result]").textContent=result;
   node.querySelector("[data-sim-explanation]").textContent=explanation;
  };
  inputs.forEach(input=>input.addEventListener("input",refresh));refresh();
 }
}
