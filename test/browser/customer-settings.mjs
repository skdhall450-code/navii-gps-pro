/** Customer settings QA: synthetic fixture API only; no external writes. */
import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { mkdir } from 'node:fs/promises';
const base='http://127.0.0.1:39123';
const user={id:'qa-customer',name:'Synthetic customer',role:'CUSTOMER',companyId:'qa-company'};
const caps={geofenceWrite:true,overspeedConfiguration:true,eventEvaluation:false,emailDelivery:false,smsDelivery:false,lowBattery:false};
const vehicles=[{id:'qa-vehicle',vehicleNo:'QA VEHICLE',name:'Synthetic vehicle'}];
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const server=spawn(process.execPath,['node_modules/next/dist/bin/next','start','--hostname','127.0.0.1','--port','39123'],{stdio:['ignore','pipe','pipe']});
let log='',browser;
for(const stream of [server.stdout,server.stderr])stream.on('data',data=>log=(log+data).slice(-6000));
try {
 let ready=false;for(let until=Date.now()+45000;Date.now()<until;){if(server.exitCode!==null)throw Error(log);try{if((await fetch(base+'/login')).ok){ready=true;break;}}catch{}await sleep(500);}assert.ok(ready,log);
 browser=await chromium.launch({headless:true,chromiumSandbox:true});await mkdir('test-results/customer-settings',{recursive:true});
 const context=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'});
 await context.addInitScript(u=>{localStorage.setItem('navii_access_token','synthetic-only');localStorage.setItem('navii_user',JSON.stringify(u));},user);
 const state={unsupported:true,failReads:false,loseWrite:false,deferCreate:false,pendingCreate:null,settings:[],circles:[],writes:[],unexpected:[]};
 await context.route('**/*',async route=>{
  const req=route.request(),url=new URL(req.url());if(url.origin===base)return route.continue();
  if(url.hostname.endsWith('tile.openstreetmap.org'))return route.fulfill({status:200,contentType:'image/svg+xml',body:'<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256"><rect width="256" height="256" fill="#edf1ef"/><path d="M0 100H256M100 0V256" stroke="#fff" stroke-width="16"/><text x="15" y="40" font-size="12" fill="#789">SYNTHETIC QA MAP</text></svg>'});
  if(url.origin!=='https://api.naviigps.com')return route.fulfill({status:204,body:''});
  const headers={'access-control-allow-origin':base,'access-control-allow-methods':'GET,PUT,POST,PATCH,DELETE','access-control-allow-headers':'authorization,content-type'};
  const reply=(status,data)=>route.fulfill({status,headers,contentType:'application/json',body:JSON.stringify(data)});
  if(req.method()==='OPTIONS')return route.fulfill({status:204,headers});
  if(url.pathname==='/api/auth/me')return reply(200,{success:true,data:user});
  if(!url.pathname.startsWith('/api/gps/customer-')){state.unexpected.push(url.pathname);return reply(404,{});}
  if(state.unsupported)return reply(state.unsupported===503?503:404,{});
  if(req.method()==='GET'){
   if(state.failReads)return reply(503,{});
   return reply(200,{success:true,data:url.pathname.endsWith('settings')?state.settings:state.circles,vehicles,capabilities:caps,mode:'DRAFT_CHANNELS_DISABLED'});
  }
  const body=req.postDataJSON();state.writes.push({method:req.method(),path:url.pathname,body});
  if(req.method()==='PUT'){
   assert.deepEqual(Object.keys(body).sort(),['revision','overspeedEnabled','speedLimitKph','cooldownMinutes','emailRequested','emailRecipients'].sort());
   const current=state.settings[0];if(body.revision!==(current?.revision||0))return reply(409,{});
   state.settings=[{...body,id:'qa-setting',vehicleId:vehicles[0].id,companyId:'qa-company',revision:body.revision+1}];
  } else if(req.method()==='POST'){assert.match(body.clientRequestId,/^[0-9a-f-]{36}$/);const created={...body,id:'qa-circle',revision:1};if(state.deferCreate){state.pendingCreate=created;state.deferCreate=false;return route.abort('failed');}state.circles.push(created);}
  else if(req.method()==='PATCH')state.circles=state.circles.map(c=>({...c,...body,revision:c.revision+1}));
  else if(req.method()==='DELETE')state.circles=[];
  if(state.loseWrite){state.loseWrite=false;state.failReads=true;return route.abort('failed');}
  return reply(200,{success:true,data:state.settings[0],capabilities:caps});
 });
 const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(base+'/dashboard/customer-settings');await page.getByRole('heading',{name:'Setup is not available yet'}).waitFor();assert.equal(state.writes.length,0);
 state.unsupported=503;await page.getByRole('button',{name:'Refresh saved settings'}).click();await page.getByRole('heading',{name:'Setup is not available yet'}).waitFor();state.unsupported=false;await page.getByRole('button',{name:'Refresh saved settings'}).click();await page.getByLabel('Speed limit (km/h)',{exact:true}).waitFor();
 await page.getByText('Configuration only — email and SMS are not sending.',{exact:true}).waitFor();
 await page.getByLabel('Speed limit (km/h)',{exact:true}).fill('65');await page.getByLabel('Future email recipients',{exact:true}).fill('QA@example.invalid');await page.getByRole('button',{name:'Save preferences',exact:true}).click();await page.getByRole('status').filter({hasText:'Save request completed'}).waitFor();assert.equal(state.settings[0].speedLimitKph,65);assert.equal(state.settings[0].emailRequested,false);
 await page.getByRole('button',{name:'Save preferences',exact:true}).click();await page.getByRole('status').filter({hasText:'Save request completed'}).waitFor();assert.equal(state.settings[0].revision,2,'Second save sends exact allowed fields, not server identifiers');
 await page.getByLabel('Area name',{exact:true}).fill('Synthetic home');await page.getByLabel('Latitude',{exact:true}).fill('28.6');await page.getByLabel('Longitude',{exact:true}).fill('77.2');const beforeCentre=state.writes.length;await page.getByRole('button',{name:'Create area',exact:true}).click();await page.getByRole('alert').filter({hasText:'Choose an area centre'}).waitFor();assert.equal(state.writes.length,beforeCentre,'Placeholder or unconfirmed centre never writes');await page.getByRole('button',{name:'Use these coordinates',exact:true}).click();await page.getByLabel('Radius (metres)',{exact:true}).fill('700');state.deferCreate=true;await page.getByRole('button',{name:'Create area',exact:true}).click();await page.getByRole('status').filter({hasText:'Changes remain blocked'}).waitFor();assert.equal(await page.getByRole('button',{name:'Create area',exact:true}).isDisabled(),true);const beforeCreateRecovery=state.writes.length;await page.getByRole('button',{name:'Refresh saved settings'}).click();await page.waitForTimeout(200);assert.equal(await page.getByRole('button',{name:'Create area',exact:true}).isDisabled(),true,'Successful GET before delayed commit cannot unlock POST');state.circles.push(state.pendingCreate);await page.getByRole('button',{name:'Refresh saved settings'}).click();await page.getByRole('button',{name:'Edit Synthetic home',exact:true}).waitFor();assert.equal(state.writes.length,beforeCreateRecovery,'No duplicate create while reconciling UUID');assert.equal(state.circles[0].radius,700);
 await page.getByRole('button',{name:'Edit Synthetic home',exact:true}).click();await page.getByLabel('Radius (metres)',{exact:true}).fill('800');await page.getByRole('button',{name:'Save area',exact:true}).click();await page.getByRole('status').filter({hasText:'Save request completed'}).waitFor();assert.equal(state.circles[0].radius,800);
 state.loseWrite=true;await page.getByLabel('Speed limit (km/h)',{exact:true}).fill('75');await page.getByRole('button',{name:'Save preferences',exact:true}).click();await page.getByRole('status').filter({hasText:'Save result not verified'}).waitFor();await page.getByRole('heading',{name:'Setup is not available yet'}).waitFor();assert.equal(await page.getByRole('button',{name:'Save preferences',exact:true}).count(),0);const writesBefore=state.writes.length;
 state.failReads=false;await page.getByRole('button',{name:'Refresh saved settings'}).click();await page.getByLabel('Speed limit (km/h)',{exact:true}).waitFor();await page.waitForFunction(()=>document.querySelector('input[max="250"]')?.value==='75');assert.equal(state.writes.length,writesBefore,'Recovery refresh performs no repeated write');
 await page.screenshot({path:'test-results/customer-settings/mobile-fixture-settings.png',fullPage:true});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
 await page.setViewportSize({width:1440,height:1000});await page.screenshot({path:'test-results/customer-settings/desktop-fixture-settings.png',fullPage:true});
 caps.geofenceWrite=false;await page.getByRole('button',{name:'Refresh saved settings'}).click();await page.waitForTimeout(200);assert.equal(await page.getByRole('button',{name:'Edit Synthetic home',exact:true}).isDisabled(),true);assert.equal(await page.getByRole('button',{name:'Delete Synthetic home',exact:true}).isDisabled(),true);caps.geofenceWrite=true;await page.getByRole('button',{name:'Refresh saved settings'}).click();await page.waitForTimeout(200);page.on('dialog',d=>d.accept());await page.getByRole('button',{name:'Delete Synthetic home',exact:true}).click();await page.getByText('No customer-created areas for this vehicle.',{exact:true}).waitFor();assert.equal(state.circles.length,0);assert.deepEqual(state.unexpected,[]);assert.deepEqual(errors,[]);
 await context.close();console.log('PASS customer settings fixture-only unsupported, saves, exact payload, circle CRUD, uncertain-write recovery, responsive screenshots');
} finally{if(browser)await browser.close();server.kill('SIGTERM');}
