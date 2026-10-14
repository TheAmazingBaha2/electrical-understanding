// Purpose-built short phone activities. Models/artwork/project persistence are shared.
import {renderMobileCircuit} from '../mobile-lab.js';
import {renderResistorEditor} from '../component-editors.js';
import {renderGraphicMeter} from '../instrument-graphics.js';
import {graphicButton,attachGraphicControls,powerSwitch} from '../graphic-controls.js';
import {decodeBands,encodeResistance} from '../resistor-color.js';
import {sharedMeterReading,formatMeterReading,prepareCurrentConnection} from '../shared-multimeter.js';
import {ProjectStore,newProject} from '../project-store.js';
export function attachPrivateMobilePractical(root,{storage,bandActivity=false,onExperiment}={}){
 const store=new ProjectStore(storage,'private-phone');let project=newProject(bandActivity?'private-bands-practical':'private-meter-practical'),revision=0,probe='red',selectedBand=0,timer,queue=Promise.resolve(),blocked=false;
 const saved=store.read(project.id);if(saved){project=saved.project;revision=saved.revision;blocked=!!saved.conflicts.length;}
 const settings=()=>project.instrumentSettings.DMM1||(project.instrumentSettings.DMM1={mode:'voltage',jack:'VΩ'}),part=()=>project.circuit.components.find(p=>p.id==='R1');
 let message='';
 function draw(){const p=part();p.properties.bandCount||=4;p.properties.tolerancePercent??=5;const reading=sharedMeterReading(project.circuit,settings());
  root.innerHTML='<section class="private-phone-practical">'+(bandActivity?'<h3>Build the requested band code</h3>'+renderResistorEditor(p,{selectedBand})+'<div class="graphic-presets">'+graphicButton('resistor-value',857,'857 Ω · five-band example')+'</div>':'<div class="private-phone-grid"><div>'+renderMobileCircuit(project.circuit)+powerSwitch('pilot-power',project.circuit.state.powered,'Modeled power')+'</div><div>'+renderGraphicMeter(settings(),formatMeterReading(reading))+(settings().mode==='current'?graphicButton('pilot-series','','Prepare upper branch in series'):'')+'</div></div><p role="status">'+(reading.status==='valid'?'Actual ideal reading: '+formatMeterReading(reading):reading.reason||reading.status)+' · configured source 5 V; power '+(project.circuit.state.powered?'ON':'OFF')+'.</p>')+'<p data-mobile-practical-status role="status"></p><p class="sm muted">Phone-specific exercise using the shared ideal DC engine. Not physical safety certification. Local experiment state is separate from lesson grades.</p></section>';
  root.querySelector('[data-mobile-practical-status]').textContent=message;
  const code=encodeResistance(p.properties.resistanceOhms,p.properties.bandCount,p.properties.tolerancePercent);onExperiment?.(bandActivity?{colors:code.colors.filter(Boolean)}:{circuit:structuredClone(project.circuit),settings:structuredClone(settings())});
 }
 function save(){clearTimeout(timer);queue=queue.then(async()=>{if(blocked)return;const r=await store.save(project,revision);revision=r.revision;if(r.conflict||r.conflicts.length){blocked=true;message='Saved phone copies disagree; both are preserved. Export before resolving.';draw();}}).catch(e=>{blocked=true;message='Saving paused; experiment retained: '+e.message;draw();});return queue;}
 function changed(){draw();clearTimeout(timer);timer=setTimeout(save,150);}
 const graphics=attachGraphicControls(root,(command,value)=>{try{
  if(blocked)throw Error('Resolve/export the saved phone copies before editing');const p=part().properties;
  if(command==='meter-mode')settings().mode=value;else if(command==='meter-jack')settings().jack=value;else if(command==='probe-select'){probe=value;message='Tap the '+(value==='red'?'red':'black')+' contact location.';}else if(command==='pilot-power')project.circuit.state.powered=value==='true';
  else if(['pilot-series','choose-current-branch'].includes(command))settings().currentConnection=prepareCurrentConnection(project.circuit,'R1');
  else if(command==='resistor-select-band')selectedBand=Number(value);else if(command==='resistor-bands'){p.bandCount=Number(value);selectedBand=0;}
  else if(command==='resistor-value')p.resistanceOhms=Number(value);else if(command==='resistor-tolerance')p.tolerancePercent=Number(value);
  else if(command==='resistor-color'){const code=encodeResistance(p.resistanceOhms,p.bandCount,p.tolerancePercent);if(!code.representable)throw Error('Choose an exactly representable value or switch band count first');const colors=[...code.colors];colors[selectedBand]=value;const d=decodeBands(colors);p.resistanceOhms=d.resistanceOhms;p.tolerancePercent=d.tolerancePercent;}
  else return;changed();
 }catch(e){message=e.message;draw();}});
 const click=e=>{const contact=e.target.closest('[data-mobile-contact]');if(contact&&!blocked){project.circuit.instruments[0][probe==='red'?'redNode':'blackNode']=contact.dataset.mobileContact;message=probe+' probe connected to '+contact.dataset.mobileContact;changed();}};
 const key=e=>{if(e.target.matches('[data-mobile-contact]')&&['Enter',' '].includes(e.key)){e.preventDefault();e.target.dispatchEvent(new MouseEvent('click',{bubbles:true}));}};
 const precision=e=>{try{const p=part().properties;if(blocked)throw Error('Saving paused');if(e.target.matches('[data-precision-resistance]')){const v=Number(e.target.value);if(!Number.isFinite(v)||v<.001||v>1e9)throw Error('Use .001 Ω to 1 GΩ');p.resistanceOhms=v;}else if(e.target.matches('[data-precision-tolerance]')){const v=Number(e.target.value);if(!Number.isFinite(v)||v<=0||v>20)throw Error('Use >0 to 20% tolerance');p.tolerancePercent=v;}else return;changed();}catch(e){message=e.message;draw();}};
 root.addEventListener('click',click);root.addEventListener('keydown',key);root.addEventListener('change',precision);window.addEventListener('pagehide',save);draw();
 return async()=>{clearTimeout(timer);graphics();root.removeEventListener('click',click);root.removeEventListener('keydown',key);root.removeEventListener('change',precision);window.removeEventListener('pagehide',save);await save();};
}
