// SVG illustrations for virtual low-voltage electrical challenges.
// Visualizations are generated from the actual controls, not photographs of physical kit hardware.
const v=(el,key)=>el.querySelector('[data-x="'+key+'"]')?.value;
const n=(el,key)=>Number(v(el,key));
const wire='<path d="M96 126 V55 H543 V196 H96 V155" class="lab-wire"/>';
const base=(inner,description,viewBox="0 0 640 250")=>'<svg viewBox="'+viewBox+'" role="img" class="lab-illustration" aria-label="'+description+'">'+
 '<defs><linearGradient id="resGlow" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#EAF9FD"/><stop offset="1" stop-color="#91C8DA"/></linearGradient></defs>'+inner+'</svg>';
const txt=(x,y,s,cl="lab-svg-label")=>'<text x="'+x+'" y="'+y+'" class="'+cl+'">'+s+'</text>';
function schematic(kind,el){
 const isSeries=kind==="series"||kind==="divider";
 const opened=kind==="fault"&&v(el,"open")==="open";
 const source='<circle cx="96" cy="139" r="19" class="lab-battery"/>'+txt(84,144,"5 V","lab-svg-info");
 const resistor=(x,y,label)=>'<rect x="'+(x-22)+'" y="'+(y-12)+'" width="44" height="24" rx="5" class="lab-resistor"/>'+txt(x-23,y-22,label,"lab-svg-info");
 if(isSeries){
   const variable=n(el,"r");
   const title=kind==="divider"?"Series voltage division":"One path, one current";
   const mid=kind==="divider"?variable:1000;
   const r3=kind==="series"?variable:1000;
   const curr=(5000/(1000+mid+r3)).toFixed(2);
   let inner='<path class="lab-wire lab-path" d="M96 119 V72 H542 V195 H96 V160"/>'+
     '<circle class="lab-battery" cx="96" cy="139" r="20"/>'+txt(75,175,"5 V","lab-svg-info")+
     resistor(232,72,"R1 · 1kΩ")+resistor(372,72,"R2 · "+(mid/1000)+"kΩ")+resistor(542,137,"R3 · "+(r3/1000)+"kΩ")+
     txt(238,225,"I = "+curr+" mA","lab-svg-strong")+
     txt(20,22,title,"lab-svg-label");
   return base(inner,"Interactive schematic: series resistors and shared current");
 }
 const r3=kind==="parallel3"?n(el,"r"):1000;
 const i3=opened?0:5000/r3;
 const total=10+i3;
 let inner='<path class="lab-wire" d="M102 107 V49 H555 V198 H102 V168"/>'+
 '<circle class="lab-battery" cx="102" cy="137" r="21"/>'+txt(75,178,"5 V","lab-svg-info")+
 '<path class="lab-wire" d="M250 49 V93 M250 116 V198 M380 49 V93 M380 116 V198 M511 49 V93"/>'+
 (opened?'<path class="lab-wire" d="M511 144 V198"/><path d="M507 118 l26 -15" stroke="#F5C29F" stroke-width="4"/>': '<path class="lab-wire" d="M511 116 V198"/>')+
 resistor(250,105,"R1 · 1kΩ")+resistor(380,105,"R2 · 1kΩ")+
 (opened?txt(488,110,"OPEN","lab-svg-warn"):resistor(511,105,"R3 · "+(r3/1000)+"kΩ"))+
 txt(225,160,"5 mA","lab-svg-info")+txt(355,160,"5 mA","lab-svg-info")+
 txt(488,160,i3.toFixed(2)+" mA","lab-svg-info")+
 txt(205,233,"Source: "+total.toFixed(2)+" mA","lab-svg-strong")+
 txt(15,22,opened?"Fault diagnosis: third branch open":"Parallel branches share 5 V","lab-svg-label");
 return base(inner,"Three parallel branches with simulated voltage, current and optional open fault");
}
function meter(el){
 const mode=v(el,"mode"),pos=v(el,"position"),powered=v(el,"power")==="on";
 const bad=(mode==="a"&&pos==="across")||(mode==="ohm"&&powered);
 const across=pos==="across";
 const leads=across?'<path d="M390 97 C355 67 291 95 254 116 M477 99 C545 75 540 162 565 163" class="lab-probe-wire '+(bad?'danger':'')+'"/>':
 '<path d="M390 95 C348 73 338 57 308 52 M477 98 C520 89 525 55 549 51" class="lab-probe-wire '+(bad?'danger':'')+'"/>';
 const inner='<path class="lab-wire" d="M82 102 V48 H252 M288 48 H551 V183 H82 V145"/>'+
 '<circle class="lab-battery" cx="82" cy="123" r="21"/>'+txt(54,165,powered?"5 V":"OFF","lab-svg-info")+
 '<rect x="252" y="33" width="36" height="30" rx="5" class="lab-resistor"/>'+txt(250,23,"1 kΩ","lab-svg-info")+
 '<rect x="374" y="83" width="110" height="125" rx="16" class="lab-meter-body"/>'+
 '<rect x="387" y="99" width="85" height="40" rx="7" class="lab-meter-screen"/>'+
 txt(393,126,mode==="v"?"V DC":mode==="a"?"A DC":"Ω","lab-svg-meter-reading")+
 '<circle cx="430" cy="164" r="15" class="lab-meter-dial"/>'+
 '<path d="M425 164 l9 -11" stroke="#10334A" stroke-width="4" stroke-linecap="round"/>'+
 leads+txt(332,226,across?"Across two nodes":"In series","lab-svg-info")+
 (bad?'<rect x="492" y="184" width="118" height="34" rx="9" class="lab-warning-shape"/>'+txt(502,206,"⚠ UNSAFE","lab-svg-warn"):txt(507,209,"Virtual circuit","lab-svg-info"));
 return base(inner,"Visual digital multimeter with mode, leads and circuit status");
}
function board(el){
 const first=v(el,"first"),second=v(el,"second");
 const rowIdx=hole=>Number(hole.slice(1));
 const side=hole=>hole.charCodeAt(0)<70?"left":"right";
 const same=rowIdx(first)===rowIdx(second)&&side(first)===side(second);
 const holes=[];
 const cols="ABCDEFGHIJ";
 for(let row=1;row<=2;row++)for(let col=0;col<10;col++){
  const x=col<5?89+col*46:382+(col-5)*46;
  const y=row===1?104:180;
  const id=cols[col]+row;
  const sel=id===first?" probe-a":id===second?" probe-b":"";
  holes.push('<circle class="lab-hole'+sel+'" data-board-hole="'+id+'" role="button" tabindex="0" aria-label="Select breadboard hole '+id+'" cx="'+x+'" cy="'+y+'" r="14"/>'+
   txt(x-6,y+4,id,"lab-svg-hole-label"));
 }
 const rect='<rect x="30" y="42" width="580" height="174" rx="20" class="lab-board-body"/><rect x="321" y="65" width="18" height="137" rx="6" class="lab-board-trench"/>'+
 txt(90,35,"A–E","lab-svg-info")+txt(385,35,"F–J","lab-svg-info")+
 txt(31,248,same?"Same internal five-hole strip":"Separate internal strips","lab-svg-strong");
 return base(rect+holes.join(""),"Interactive breadboard: click holes to position two continuity probes","0 0 640 260");
}
function resistor(el,kind){
 const colors=["#181E25","#875C42","#D95F55","#EF944C","#EFD06A","#57B986","#74BDED","#BA80DD","#C4D1D8","#F9FCFF"];
 const d1=n(el,"d1")||1,d2=n(el,"d2")||0,m=n(el,"mul")||100;
 const value=(d1*10+d2)*m;
 const r=kind==="rating"?1000:kind==="tolerance"?n(el,"r"):value;
 const power=kind==="rating"?n(el,"v")**2/1000:0;
 const stripe=(x,color)=>'<rect x="'+x+'" y="76" width="21" height="94" rx="4" fill="'+color+'" stroke="rgba(4,26,38,.28)"/>';
 const core='<path class="lab-wire" d="M48 124 H153 M493 124 H594"/>'+
 '<rect x="147" y="75" width="350" height="97" rx="31" class="lab-resistor-picture"/>'+
 stripe(205,kind==="bands"?colors[d1]:"#875C42")+stripe(279,kind==="bands"?colors[d2]:"#181E25")+
 stripe(355,kind==="bands"?colors[({1:0,10:1,100:2,1000:3}[m]||0)]:"#D95F55")+stripe(435,"#D4AA59")+
 txt(234,44,kind==="rating"?(power*1000).toFixed(1)+" mW":r+" Ω","lab-svg-strong")+
 txt(219,221,kind==="rating"?"Example 0.25 W rating":kind==="tolerance"?"1 kΩ nominal · ±5%":"Four-band resistor decoder","lab-svg-info");
 return base(core,"Interactive resistor with value, bands or dissipation readout");
}
export function drawLabGraphic(el,kind){
 const frame=el.querySelector(".lab-graphic");
 if(!frame)return;
 frame.innerHTML=kind==="breadboard"?board(el):kind==="meter"?meter(el):
   ["series","divider","parallel3","fault"].includes(kind)?schematic(kind,el):
   ["bands","tolerance","rating"].includes(kind)?resistor(el,kind):"";
 if(kind==="breadboard"){
  const sel=el.querySelector('[data-x="first"]'),other=el.querySelector('[data-x="second"]');
  for(const dot of frame.querySelectorAll('[data-board-hole]')){
   const select=()=>{const target=el.dataset.nextProbe==="second"?other:sel;target.value=dot.dataset.boardHole;
    el.dataset.nextProbe=target===sel?"second":"first";target.dispatchEvent(new Event("change",{bubbles:true}));};
   dot.addEventListener("click",select);
   dot.addEventListener("keydown",event=>{if(event.key==="Enter"||event.key===" "){event.preventDefault();select()}});
  }
 }
}

// Reuse the existing visual frame for project circuit scenes without scenario calculations.
export const circuitSvgFrame = (inner,label,viewBox) => base(inner,label,viewBox);
