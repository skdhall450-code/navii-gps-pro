/** Read-only synthetic unavailable-state previews. No real APIs, writes, or providers. */
import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
const base='http://127.0.0.1:39137',output='test-results/panel-page-previews';
const user={id:'qa-preview',name:'Synthetic Preview',email:'preview@example.invalid',role:'SUPER_ADMIN',companyId:'qa-company'};
const pages=['/dashboard','/dashboard/vehicles','/dashboard/devices','/dashboard/device-setup','/dashboard/live-tracking','/dashboard/history','/dashboard/geofences','/dashboard/alerts','/dashboard/reports','/dashboard/maintenance','/dashboard/billing/plans','/dashboard/billing/subscriptions','/dashboard/billing/invoices','/dashboard/billing/reports','/dashboard/dealers','/dashboard/customers','/dashboard/assignments'];
const server=spawn(process.execPath,['node_modules/next/dist/bin/next','start','--hostname','127.0.0.1','--port','39137'],{stdio:['ignore','pipe','pipe']});
let browser,log='';for(const stream of [server.stdout,server.stderr])stream.on('data',d=>log=(log+d).slice(-6000));
const errors=[],writes=[],coverage=[];
try {
 let ready=false;for(let until=Date.now()+45000;Date.now()<until;){if(server.exitCode!==null)throw Error(log);try{if((await fetch(base+'/login')).ok){ready=true;break;}}catch{}await new Promise(r=>setTimeout(r,500));}assert.ok(ready,log);
 browser=await chromium.launch({headless:true,chromiumSandbox:true,...(process.env.CI?{channel:'chrome'}:{})});
 const context=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce',serviceWorkers:'block'});
 context.setDefaultTimeout(12000);
 await context.routeWebSocket('**/*',socket=>socket.close());
 await context.route('**/*',async route=>{
  try {
   const req=route.request(),url=new URL(req.url());
   if(url.origin===base&&['GET','HEAD'].includes(req.method())&&!url.pathname.startsWith('/api/')&&(url.pathname!=='/_next/image'||url.searchParams.get('url')?.startsWith('/assets/'))){const response=await route.fetch({maxRedirects:0});if(response.status()>=300&&response.status()<400)return route.abort();return route.fulfill({response});}
   if(url.origin==='https://api.naviigps.com'){
    const headers={'access-control-allow-origin':base,'access-control-allow-methods':'GET','access-control-allow-headers':'authorization,content-type'};
    if(req.method()==='OPTIONS')return route.fulfill({status:204,headers});
    if(req.method()!=='GET'){writes.push(url.pathname);return route.abort();}
    const auth=url.pathname==='/api/auth/me';
    return route.fulfill({status:auth?200:503,headers,contentType:'application/json',body:JSON.stringify(auth?{success:true,data:user}:{success:false,message:'Synthetic preview: service unavailable. No production data.'})});
   }
   return route.abort();
  }catch(e){errors.push(String(e));await route.abort().catch(()=>{});}
 });
 await context.addInitScript(u=>{localStorage.setItem('navii_access_token','synthetic-preview-only');localStorage.setItem('navii_user',JSON.stringify(u));if(!sessionStorage.getItem('qa-consent-initialized')){localStorage.setItem('navii_analytics_consent','denied');sessionStorage.setItem('qa-consent-initialized','1');}},user);
 const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
 await mkdir(output,{recursive:true});
 for(const path of pages){
  for(const width of [1440,390]){
   await page.setViewportSize({width,height:width===1440?1000:844});
   await page.goto(base+path,{waitUntil:'networkidle'});
   await page.getByRole('button',{name:'Open analytics cookie settings',exact:true}).waitFor();
   assert.equal(new URL(page.url()).pathname,path,'Requested page remains selected');
   assert.equal(await page.getByRole('link',{name:'Chat on WhatsApp',exact:true}).count(),0,'No floating sales widget on panel');
   const cookie=page.getByRole('button',{name:'Open analytics cookie settings',exact:true});
   assert.equal(await cookie.evaluate(e=>getComputedStyle(e).position),'relative','Cookie control stays in normal flow');
   await page.evaluate(()=>window.scrollTo(0,0));
   const name=path.replaceAll('/','_')+'-'+width+'.png';
   await page.screenshot({path:output+'/'+name,fullPage:true});
   coverage.push({path,width,image:name,state:'SYNTHETIC_SERVICE_UNAVAILABLE',functionalAcceptance:false});
  }
 }
 // Explicit cookie-settings interaction stays usable without covering the report form.
 await page.goto(base+'/dashboard/reports',{waitUntil:'networkidle'});
 await page.getByRole('button',{name:'Open analytics cookie settings'}).click();
 await page.getByRole('button',{name:'Necessary Only',exact:true}).waitFor();
 assert.equal(await page.locator('[data-cookie-consent]').evaluate(e=>getComputedStyle(e).position),'relative');
 await page.getByRole('button',{name:'Necessary Only',exact:true}).click();
 await page.getByRole('button',{name:'Open analytics cookie settings'}).waitFor();
 assert.equal(await page.evaluate(()=>localStorage.getItem('navii_analytics_consent')),'denied');
 // Customer quick-navigation dock spans through 800px; privacy controls must remain reachable.
 user.role='CUSTOMER';user.customerId='qa-customer';
 for(const width of [390,768,800]){
  await page.setViewportSize({width,height:844});
  await page.goto(base+'/dashboard/reports',{waitUntil:'networkidle'});
  await page.locator('[data-customer-portal]').waitFor();
  assert.equal(await page.getByRole('navigation',{name:'Quick navigation',exact:true}).isVisible(),true);
  const privacy=page.getByRole('button',{name:'Open analytics cookie settings',exact:true});
  await privacy.scrollIntoViewIfNeeded();
  assert.equal(await privacy.evaluate(e=>{const r=e.getBoundingClientRect();const hit=document.elementFromPoint(r.x+r.width/2,r.y+r.height/2);return e===hit||e.contains(hit);}),true,'Customer privacy control remains clickable above dock');
  await privacy.click();await page.getByRole('button',{name:'Necessary Only',exact:true}).waitFor();
  const necessary=page.getByRole('button',{name:'Necessary Only',exact:true});
  await necessary.scrollIntoViewIfNeeded();
  assert.equal(await necessary.evaluate(e=>{const r=e.getBoundingClientRect();const hit=document.elementFromPoint(r.x+r.width/2,r.y+r.height/2);return e===hit||e.contains(hit);}),true,'Customer privacy choices remain clickable above dock');
  await necessary.click();
 }
 assert.deepEqual(writes,[]);assert.deepEqual(errors,[]);
 await context.close();
}finally{
 try {if(browser)await browser.close();}finally{
  server.kill('SIGTERM');
  await mkdir(output,{recursive:true});await writeFile(output+'/coverage.json',JSON.stringify({coverage,errors,writes,scope:'Actual current UI with every operational backend response deliberately unavailable; not production/functionality acceptance'},null,2));
 }
}
console.log('PASS read-only panel page preview and non-overlapping privacy controls');
