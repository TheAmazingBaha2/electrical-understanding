// Platform preference is device-local. Windows does not become Mobile Lab when its window narrows.
import {renderDesktopLab,attachDesktopLab} from './desktop-lab.js';
import {renderMobileLab,attachMobileLab} from './mobile-lab.js';
import {renderElectronicsWorkspace,attachElectronicsWorkspace} from './electronics-workspace.js';
export const labPlatformPreferenceKey='eu_lab_platform_v1';
export function detectLabPlatform({userAgent='',platform='',mobile=false}={}){
 if(/Win/i.test(platform)||/Windows/i.test(userAgent))return 'desktop';
 return mobile||/Android|iPhone|iPad|iPod/i.test(userAgent)?'mobile':'desktop';
}
export function selectedLabPlatform({storage=globalThis.localStorage,navigator=globalThis.navigator,search=globalThis.location?.search||''}={}){
 const query=new URLSearchParams(search).get('lab');
 if(['desktop','mobile','legacy'].includes(query))return query;
 let value;try{value=storage?.getItem(labPlatformPreferenceKey);}catch{}
 if(['desktop','mobile','legacy'].includes(value))return value;
 return detectLabPlatform({userAgent:navigator?.userAgent||'',platform:navigator?.platform||'',mobile:navigator?.userAgentData?.mobile||false});
}
export function renderLabPlatform({platform=selectedLabPlatform()}={}){
 return '<nav class="lab-platform-picker" aria-label="Laboratory platform"><label>Lab presentation<select data-lab-platform-choice>'+[['auto','Automatic'],['desktop','Desktop Lab'],['mobile','Mobile Lab'],['legacy','Previous lab · compatibility']].map(([id,label])=>'<option value="'+id+'">'+label+'</option>').join('')+'</select></label><span data-platform-indicator>'+platform+' module</span></nav>'+({desktop:renderDesktopLab,mobile:renderMobileLab,legacy:renderElectronicsWorkspace}[platform]||renderDesktopLab)();
}
export function attachLabPlatform(root,storage=localStorage,{onPlatformChange,platform=selectedLabPlatform({storage}),...options}={}){
 const select=root.querySelector('[data-lab-platform-choice]');
 let stored;try{stored=storage.getItem(labPlatformPreferenceKey);}catch{}select.value=stored||'auto';
 const change=async()=>{try{if(select.value==='auto')storage.removeItem(labPlatformPreferenceKey);else storage.setItem(labPlatformPreferenceKey,select.value);await onPlatformChange?.();}catch(e){root.querySelector('[data-platform-indicator]').textContent=e.message;}};select.addEventListener('change',change);
 const dispose=({desktop:attachDesktopLab,mobile:attachMobileLab,legacy:attachElectronicsWorkspace}[platform]||attachDesktopLab)(root,storage,options);
 return async()=>{select.removeEventListener('change',change);await dispose?.();};
}
