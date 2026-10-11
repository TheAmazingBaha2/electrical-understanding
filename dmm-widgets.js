// Original, source-informed virtual digital multimeter activities; NEVER connect to real live equipment from these diagrams.
const escapeDMM=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const choose=(key,label,choices)=>'<label class="lab-control">'+escapeDMM(label)+'<select data-x="'+key+'">'+choices.map(pair=>'<option value="'+pair[0]+'">'+escapeDMM(pair[1])+'</option>').join('')+'</select></label>';
const slide=(key,label,min,max,start,step)=>'<label class="lab-control">'+escapeDMM(label)+'<input type="range" data-x="'+key+'" min="'+min+'" max="'+max+'" step="'+step+'" value="'+start+'"></label>';
const get=(el,key)=>el.querySelector('[data-x="'+key+'"]')?.value;
const val=(el,key)=>Number(get(el,key));
function visualDMM(reading,scene,label,warning=false){
 const title='<text x="22" y="28" fill="#D8F6FF" font-size="18" font-weight="700">'+escapeDMM(label)+'</text>';
 const housing='<rect x="413" y="36" width="186" height="203" rx="22" fill="#4A9EB8" stroke="#C7F4FF" stroke-width="3"/>'+
 '<rect x="431" y="53" width="150" height="78" rx="10" fill="'+(warning?"#67453E":"#15384D")+'" stroke="#BDE7F6" stroke-width="2"/>'+
 '<text x="441" y="98" fill="#DDFDFF" font-size="27" font-weight="750">'+escapeDMM(reading)+'</text>'+
 '<circle cx="505" cy="182" r="27" fill="#D7F8FF" stroke="#29566C" stroke-width="4"/><path d="M506 182 l13 -16" stroke="#234F63" stroke-width="5"/>';
 return '<svg viewBox="0 0 640 270" role="img" aria-label="'+escapeDMM(label)+'" class="lab-illustration dmm-illustration">'+title+scene+housing+'</svg>';
}
function trace(wobble=0,pulse=false){
 const coords=Array.from({length:50},(_,i)=>{
 const y=108+(pulse&&i>=24&&i<=27?85:0)+Math.sin(i*.85)*wobble*3;
 return (34+i*7).toFixed(0)+','+y.toFixed(1);
 }).join(' ');
 return '<rect x="20" y="46" width="372" height="184" rx="14" fill="#123B54" stroke="#477B96"/>'+
 '<path d="M35 110 H380 M35 165 H380" stroke="#56758A" stroke-width="2"/>'+
 '<polyline fill="none" stroke="#8BEFFD" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" points="'+coords+'"/>'+
 '<text x="28" y="254" fill="#C6F0FD" font-size="15">Time →</text>';
}
function graph(el,kind){
 const pulse=get(el,"signal")==="pulse"||get(el,"wave")==="pulse"||get(el,"choice")==="pulse";
 const noise=kind==="dmm-noise"?val(el,"noise"):0;
 return visualDMM("5.00 V",trace(noise,pulse),pulse?"A short dropout is visible on the trace":kind==="dmm-noise"?"A small amount of variation":"Steady voltage over time");
}
function tolerance(el){
 const actual=val(el,"reading");
 const x=cl=>Math.max(32,Math.min(374,32+(cl-4.5)*342));
 const scene='<path d="M32 143 H374" stroke="#496C84" stroke-width="14" stroke-linecap="round"/>'+
 '<path d="M'+x(4.75)+' 143 H'+x(5.25)+'" stroke="#8AEDDB" stroke-width="14"/>'+
 '<circle cx="'+x(actual)+'" cy="143" r="14" fill="#E6F9FF" stroke="#37C9EF" stroke-width="4"/>'+
 '<text x="25" y="112" fill="#DFF5FF" font-size="17">5 V ±5%: 4.75–5.25 V</text>'+
 '<text x="26" y="194" fill="#A9D8EE" font-size="16">Example specification, not universal</text>';
 return visualDMM(actual.toFixed(2)+" V",scene,"Expected vs measured voltage");
}
function digits(el){
 const places=val(el,"digits"),error=val(el,"offset");
 const scene='<rect x="20" y="54" width="360" height="162" rx="14" fill="#173D57" stroke="#477B97"/>'+
 '<text x="35" y="91" fill="#DFF5FF" font-size="17">Actual model: 5.000 V</text>'+
 '<text x="35" y="134" fill="#DFF5FF" font-size="17">Independent error: '+error.toFixed(2)+' V</text>'+
 '<text x="35" y="176" fill="#87EFFE" font-size="17">More digits ≠ better accuracy</text>';
 return visualDMM((5+error).toFixed(places)+" V",scene,"Resolution compared with measurement error");
}
function probing(el){
 const potentials={common:0,source:5,load:5};
 const red=get(el,"red"),black=get(el,"black"),reading=potentials[red]-potentials[black];
 const nodes={source:[80,92],load:[331,92],common:[80,208]};
 const wires='<path d="M80 92 H331 V208 H80 V92" class="lab-wire"/><rect x="224" y="76" width="45" height="32" rx="4" class="lab-resistor"/>'+
 '<text x="37" y="76" fill="#C9F2FF" font-size="15">+5 V</text><text x="37" y="234" fill="#C9F2FF" font-size="15">COM</text>';
 const tip=(id,color)=>{const [px,py]=nodes[id];return '<path d="M'+px+' '+py+' Q'+(px+80)+' '+(py+35)+' 423 162" fill="none" stroke="'+color+'" stroke-width="4"/><circle cx="'+px+'" cy="'+py+'" r="10" fill="'+color+'"/>'};
 return visualDMM((reading>=0?"+":"")+reading.toFixed(1)+" V",wires+tip(red,"#FFB59E")+tip(black,"#9DE7FA"),"Red probe potential minus black probe potential");
}
function reference(el){
 const ref=get(el,"reference"),verified=ref==="common";
 const names=[["common","Known common"],["sink","Unverified heat sink"],["speaker","Unverified speaker terminal"]];
 const nodes=names.map(([id,label],i)=>'<circle cx="50" cy="'+(96+i*56)+'" r="9" fill="'+(ref===id?"#81F2FF":"#5486A4")+'"/>'+
 '<text x="71" y="'+(102+i*56)+'" fill="#D7F5FF" font-size="16">'+label+'</text>').join('');
 return visualDMM(verified?"0.0 V":"VERIFY",nodes,"Only identified circuit common can serve as verified reference",!verified);
}
function fault(el){
 const closed=get(el,"switch")==="closed";
 const scene='<path d="M70 78 H145 M210 78 H333 V210 H70 V78" class="lab-wire"/>'+
 '<path d="M145 78 L'+(closed?"210 78":"202 45")+'" stroke="#C1F1FF" stroke-width="4"/>'+
 '<rect x="318" y="138" width="30" height="35" rx="4" class="lab-resistor"/>'+
 '<text x="70" y="52" fill="#D9F8FF" font-size="16">Source +5 V</text>'+
 '<text x="70" y="240" fill="#92EAF8" font-size="16">Load: '+(closed?"5 V":"0 V")+'</text>';
 return visualDMM(closed?"+5.0 V":"0.0 V",scene,closed?"Closed path reaches load":"Open switch interrupts modeled path");
}
function range(el){
 const mode=get(el,"mode"),limit=val(el,"range"),valid=mode==="dc"&&limit>=5;
 const scene='<path d="M70 132 H338" class="lab-wire"/><circle cx="186" cy="132" r="24" class="lab-battery"/>'+
 '<text x="46" y="86" fill="#DDF8FF" font-size="19">Known-safe virtual 5 V DC source</text>'+
 '<text x="46" y="208" fill="#B4E6F7" font-size="16">'+mode.toUpperCase()+' · '+limit+' V range</text>';
 return visualDMM(mode!=="dc"?"AC?":limit<5?"OL":"5.00 V",scene,valid?"Suitable DC range":"Wrong mode or overrange",!valid);
}
const config={
 "dmm-signal":{title:"Steady versus brief dropout",fields:choose("signal","Signal",[["steady","Steady 5 V"],["pulse","Very short dropout"]]),render:graph,answer:e=>get(e,"signal")==="pulse"?"A slow display may miss brief events; a time-domain trace helps reveal them.":"A stable quantity is a useful starting point for a DMM voltage check."},
 "dmm-tolerance":{title:"Are you inside the stated tolerance?",fields:slide("reading","Example reading (V)",4.5,5.5,5.04,.01),render:tolerance,answer:e=>val(e,"reading")>=4.75&&val(e,"reading")<=5.25?"This example reading meets the stated ±5% specification.":"The reading lies beyond this example ±5% band; investigate conditions and instrument accuracy."},
 "dmm-digits":{title:"Extra decimals do not prove accuracy",fields:choose("digits","Display resolution",[["2","2 decimals"],["3","3 decimals"]])+slide("offset","Modeled meter error (V)",-.1,.1,.04,.01),render:digits,answer:e=>"The display resolution and the independent error ("+val(e,"offset").toFixed(2)+" V) are different properties."},
 "dmm-noise":{title:"Small measurement fluctuations",fields:slide("noise","Amount of wobble",0,6,2,1),render:graph,answer:e=>"This is a simulated time trace, not a diagnosis: compare measured variation with the circuit and meter specifications."},
 "dmm-choice":{title:"What evidence does your instrument show?",fields:choose("choice","Type of signal",[["steady","Approximately steady voltage"],["pulse","Short voltage dropout"]]),render:graph,answer:e=>get(e,"choice")==="pulse"?"Use a suitable scope to examine timing; first verify grounding, probe and voltage ratings.":"For approximately steady DC voltage, a correctly configured DMM is a good starting tool."},
 "dmm-probes":{title:"Compare two points with the probes",fields:choose("red","Red probe",[["source","+5 V source"],["load","+5 V load node"],["common","0 V common"]])+choose("black","Black probe",[["common","0 V common"],["source","+5 V source"],["load","+5 V load node"]]),render:probing,answer:e=>{const v={source:5,load:5,common:0};return "Red minus black: "+(v[get(e,"red")]-v[get(e,"black")])+" V. The circuit did not change when you swapped the probes."}},
 "dmm-reference":{title:"Verify the black-probe reference",fields:choose("reference","Selected reference",[["common","Verified common"],["sink","Heat sink (unverified)"],["speaker","Speaker negative (unverified)"]]),render:reference,answer:e=>get(e,"reference")==="common"?"Correctly identified circuit common provides a usable reference in this model.":"Do not assume this connection is common or safe. Check actual documentation."},
 "dmm-fault":{title:"Use readings to locate an open",fields:choose("switch","Modeled switch",[["open","Open"],["closed","Closed"]]),render:fault,answer:e=>get(e,"switch")==="open"?"Source stays at +5 V, but the modeled load node is 0 V. Investigate the open switch/path with power disconnected.":"The closed switch connects the load to the 5 V source in this simplified circuit."},
 "dmm-range":{title:"Choose DC V and a suitable range",fields:choose("mode","Function",[["dc","DC volts"],["ac","AC volts"]])+choose("range","Manual range",[["2","2 V"],["20","20 V"],["200","200 V"]]),render:range,answer:e=>get(e,"mode")!=="dc"?"DC voltage requires a DC voltage measurement function.":val(e,"range")<5?"2 V is too low for the example 5 V source; this model displays overrange.":"This range covers the virtual 5 V signal. Check real meter jack and category ratings separately."},
 "dmm-dropout":{title:"Time trace versus numeric snapshot",fields:choose("wave","Signal",[["steady","Steady rail"],["pulse","Brief interruption"]]),render:graph,answer:e=>get(e,"wave")==="pulse"?"The dropout is visible on the trace, though the numerical snapshot might still show about 5 V.":"A steady level can be measured effectively with a DMM."}
};
export const dmmWidgetKinds=Object.keys(config);
export function attachDmmWidgets(root=document){
 for(const el of root.querySelectorAll('.lab-widget[data-lab-kind^="dmm-"]')){
  const c=config[el.dataset.labKind];if(!c)continue;
  el.innerHTML='<p class="lab-prompt">'+escapeDMM(c.title)+'</p><div class="lab-graphic"></div>'+c.fields+'<div class="lab-output" aria-live="polite"></div>';
  const refresh=()=>{el.querySelector('.lab-graphic').innerHTML=c.render(el,el.dataset.labKind);el.querySelector('.lab-output').textContent=c.answer(el)};
  for(const control of el.querySelectorAll('[data-x]')){control.addEventListener("input",refresh);control.addEventListener("change",refresh)}
  refresh();
 }
}
