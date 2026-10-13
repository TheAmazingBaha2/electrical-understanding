export async function go(page,view){
 const target=page.locator('.sidebar [data-view="'+view+'"]');
 if(await target.evaluate(el=>el.getBoundingClientRect().left<0))await page.locator('#menu-toggle').click();
 await target.click();
}
