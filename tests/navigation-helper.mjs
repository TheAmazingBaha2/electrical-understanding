export async function go(page,view){
 const menu=page.locator('#menu-toggle'),sidebar=page.locator('.sidebar');
 // Use the state class rather than animated geometry: a just-closed menu
 // can still be crossing the viewport when the next navigation starts.
 if(await menu.isVisible()&&!await sidebar.evaluate(el=>el.classList.contains('open')))await menu.click();
 await sidebar.locator('[data-view="'+view+'"]').click();
}
