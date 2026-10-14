export async function go(page,view){
 const menu=page.locator('#menu-toggle'),sidebar=page.locator('.sidebar');
 // Use the state class rather than animated geometry: a just-closed menu
 // can still be crossing the viewport when the next navigation starts.
 if(await menu.isVisible()&&!await sidebar.evaluate(el=>el.classList.contains('open')))await menu.click();
 await sidebar.locator('[data-view="'+view+'"]').click();
 // V3 navigation awaits the locked final project save. A click finishing is
 // not evidence that the route finished; a second click can race menu closing.
 await page.waitForFunction(target=>document.querySelector('.sidebar [data-view="'+target+'"]')?.classList.contains('active')&&!document.querySelector('.sidebar').classList.contains('open'),view);
}
