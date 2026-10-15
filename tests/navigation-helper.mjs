export async function go(page,view){
 if(view==='textbooks')view='lessons';
 if(view==='workbench')await page.evaluate(()=>{if(!localStorage.getItem('eu_lab_platform_v1'))localStorage.setItem('eu_lab_platform_v1','legacy');});
 if(!page.__labDialogs){page.__labDialogs=true;page.on('dialog',dialog=>dialog.accept());}
 const menu=page.locator('#menu-toggle'),sidebar=page.locator('.sidebar');
 // Use the state class rather than animated geometry: a just-closed menu
 // can still be crossing the viewport when the next navigation starts.
 if(await menu.isVisible()&&!await sidebar.evaluate(el=>el.classList.contains('open')))await menu.click();
 await sidebar.locator('[data-view="'+view+'"]').click();
 // V3 navigation awaits the locked final project save. A click finishing is
 // not evidence that the route finished; a second click can race menu closing.
 await page.waitForFunction(target=>document.querySelector('.sidebar [data-view="'+target+'"]')?.classList.contains('active')&&!document.querySelector('.sidebar').classList.contains('open'),view);
}
// Historical workspace suites intentionally exercise the retained precision UI.
// New graphical acceptance does not call this helper and checks default disclosure.
export async function enableLabAdvanced(page){const toggle=page.locator('[data-toggle-lab-advanced]');if(await toggle.getAttribute('aria-pressed')!=='true')await toggle.click();}
