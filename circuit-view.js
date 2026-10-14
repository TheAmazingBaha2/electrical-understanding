import {circuitSvgFrame} from './lab-visuals.js';
import {isDivider} from './lab-guidance.js';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function voltageDisplay(v){if(v===null)return 'UNKNOWN';if(Math.abs(v)>0&&Math.abs(v)<.001)return (v*1e6).toFixed(3)+' µV';if(Math.abs(v)>0&&Math.abs(v)<1)return (v*1000).toFixed(3)+' mV';return (Math.abs(v)<5e-13?0:v).toFixed(3)+' V';}
export function voltageExplanation(c,measurement,result){
 const source=c.components.find(p=>p.type==='dc-source'),sourceNote=source?.state.open||!c.state.powered?'The configured source is disconnected; its setting is not the voltage available at every node. ':'';
 if(measurement.valueVolts===null)return sourceNote+'The probe is connected to a floating node with no defined potential in this model. UNKNOWN is different from 0 V. Reconnect a supported path to establish a reference.';
 let text=sourceNote+'Red '+measurement.redNode+' minus black '+measurement.blackNode+' = '+voltageDisplay(measurement.valueVolts)+'. ';
 if(isDivider(c)&&c.state.powered&&!c.components.some(p=>p.state.open)){const v=c.components.find(p=>p.id==='V1'),r1=c.components.find(p=>p.id==='R1'),r2=c.components.find(p=>p.id==='R2');const a=r1.properties.resistanceOhms,b=r2.properties.resistanceOhms;text+='Connected divider: '+v.properties.voltageVolts+' V × '+b+' / ('+a+' + '+b+') = '+voltageDisplay(result.nodeVoltages.output)+' at output relative to common. ';}
 return text+'Display is rounded; the ideal voltage meter does not load the circuit.';
}
export function renderCircuitView(c,{hidden=false,instrumentSettings={}}={}){
 const current=instrumentSettings.mode==='current',connection=instrumentSettings.currentConnection,probe=current?null:c.instruments[0];
 if(isDivider(c)){
  const part=id=>c.components.find(p=>p.id===id),v=part('V1'),a=part('R1'),b=part('R2');
  const resistor=(p,y)=>'<g><path d="M410 '+(y-30)+' V'+(y-15)+' M410 '+(y+15)+' V'+(y+30)+'" class="lab-wire"/><rect x="387" y="'+(y-15)+'" width="46" height="30" rx="5" class="lab-resistor"/>'+ (p.state.open?'<path d="M387 '+(y+15)+' L433 '+(y-15)+'" stroke="#f9bb71" stroke-width="5"/>':'')+'<text x="448" y="'+y+'" class="lab-svg-label">'+p.id+' · '+esc(p.properties.resistanceOhms)+' Ω</text><text x="448" y="'+(y+18)+'" class="lab-svg-info">'+(p.state.open?'DISCONNECTED':'Connected')+'</text></g>';
  const node=(id,x,y)=>'<g><circle cx="'+x+'" cy="'+y+'" r="8" fill="'+(probe?.redNode===id?'#ff8e88':probe?.blackNode===id?'#dce9f1':'#75edee')+'"/><text x="'+(x+14)+'" y="'+(y+4)+'" class="lab-svg-label">'+id+(probe?.redNode===id?' · RED':'')+(probe?.blackNode===id?' · BLACK':'')+'</text></g>';
  return circuitSvgFrame('<path d="M145 65 V90 M145 190 V285 H410 V255 M145 65 H410 V95 M410 155 V195" class="lab-wire"/><circle cx="145" cy="140" r="50" class="lab-battery"/><text x="125" y="123" class="lab-svg-strong">+</text><text x="125" y="177" class="lab-svg-strong">−</text><text x="110" y="144" class="lab-svg-label">V1</text><text x="24" y="220" class="lab-svg-info">Configured '+esc(v.properties.voltageVolts)+' V</text><text x="24" y="240" class="lab-svg-info">'+(v.state.open||!c.state.powered?'SOURCE DISCONNECTED':'Source connected')+'</text>'+((v.state.open||!c.state.powered)?'<path d="M95 190 L195 90" stroke="#f9bb71" stroke-width="5"/>':'')+resistor(a,125)+resistor(b,225)+node('source',410,65)+node('output',410,175)+node('common',145,285), 'Voltage divider: source through R1 to output, through R2 to common. Probe colors identify measured nodes.','0 0 640 330');
 }
 const rows=c.components.map((p,i)=>{const y=45+i*64;return '<text x="15" y="'+y+'" class="lab-svg-label">'+esc(p.id)+' · '+(p.type==='resistor'?esc(p.properties.resistanceOhms)+' Ω':esc(p.properties.voltageVolts)+' V configured')+'</text><path d="M175 '+(y-5)+' H400" class="lab-wire"/><text x="175" y="'+(y+20)+'" class="lab-svg-info">'+esc(p.terminals[0].nodeId)+' ↔ '+esc(p.terminals[1].nodeId)+' · '+(p.state.open?'DISCONNECTED':'connected')+'</text>';}).join('');
 return circuitSvgFrame(rows,'Components joined by named circuit nodes','0 0 640 '+Math.max(250,c.components.length*64+30));
}
