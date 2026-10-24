import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { mkdir } from 'node:fs/promises';
const base='http://127.0.0.1:39111';
const user={id:'test-user',name:'Synthetic QA',email:'test@example.invalid',role:'CUSTOMER',companyId:'test-company',customerId:'test-customer'};
const now=Date.now();
let scenario='stale'; let outage=false;
function vehicle(){return {id:'test-vehicle',vehicleNo:'SYNTHETIC-QA',vehicleType:'CAR',name:'Synthetic QA',companyId:user.companyId,customerId:user.customerId,dealerId:null,status:'MOVING',speed:scenario==='zero'?0:35,ignition:true,battery:12.3,latitude:30,longitude:76,lastUpdate:new Date(now-(scenario==='stale'?3*3600000:1000)).toISOString(),device:{id:'test-device',imei:'synthetic',model:'test',simNumber:null,isActive:true,lastSeenAt:new Date(now-1000).toISOString()}};}
(async()=>{
 const server=spawn(process.execPath,['node_modules/next/dist/bin/next','start','--hostname','127.0.0.1','--port','39111'],{stdio:['ignore','pipe','pipe']});
 let serverLog='';
 for(const stream of [server.stdout,server.stderr])stream.on('data',data=>{serverLog=(serverLog+data).slice(-6000);});
 let browser;
 try{
  const deadline=Date.now()+45000;
  let ready=false;
  while(Date.now()<deadline){
   if(server.exitCode!==null)throw new Error('Local Next server exited: '+serverLog);
   try{const r=await fetch(base+'/login');if(r.ok){ready=true;break;}}catch{ /* Wait for the local test server. */ }
   await new Promise(resolve=>setTimeout(resolve,500));
  }
  assert.ok(ready,'Local Next server readiness timeout: '+serverLog);
  browser=await chromium.launch({headless:true,args:['--no-sandbox']});
  const context=await browser.newContext({viewport:{width:1440,height:1000}});
  const unexpected=[];
  await context.route('**/*',async route=>{
   const req=route.request(),url=new URL(req.url());
   if(url.origin===base)return route.continue();
   if(['http://127.0.0.1:39112','https://api.naviigps.com'].includes(url.origin)){
    if(req.method()==='OPTIONS')return route.fulfill({status:204,headers:{'access-control-allow-origin':base,'access-control-allow-methods':'GET','access-control-allow-headers':'authorization'}});
    assert.equal(req.method(),'GET','No writes allowed');
    if(outage&&url.pathname.startsWith('/api/gps'))return route.fulfill({status:503,contentType:'application/json',headers:{'access-control-allow-origin':base},body:JSON.stringify({success:false,message:'Synthetic outage'})});
    let data;
    if(url.pathname==='/api/auth/me')data=user;
    else if(['/api/gps/vehicles','/api/gps/latest'].includes(url.pathname))data=[vehicle()];
    else if(url.pathname.startsWith('/api/gps/history/'))data=[];
    else {unexpected.push(url.pathname);data=[];}
    return route.fulfill({status:200,contentType:'application/json',headers:{'access-control-allow-origin':base},body:JSON.stringify({success:true,data})});
   }
   return route.abort();
  });
  await context.addInitScript(({user})=>{localStorage.setItem('navii_access_token','synthetic-test-only');localStorage.setItem('navii_user',JSON.stringify(user));}, {user});
  const page=await context.newPage();
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.clock.install({time:now});
  const routes=['/dashboard','/dashboard/vehicles','/dashboard/vehicles/test-vehicle','/dashboard/live-tracking'];
  for(const path of routes){
   scenario='stale';outage=false;await page.clock.setSystemTime(now);
   await page.goto(base+path,{waitUntil:'domcontentloaded',timeout:60000});
   await page.getByText('Awaiting GPS',{exact:true}).filter({visible:true}).first().waitFor({timeout:30000});
   const text=await page.locator('body').innerText();
   assert.match(text,/Unavailable/); assert.doesNotMatch(text,/35\.0 km\/h|12\.300 V/);
   if(path.endsWith('/test-vehicle')||path.endsWith('/live-tracking')){
    assert.match(text,/Last GPS fix/);assert.match(text,/Last communication/);
    assert.match(text,/30\.000000/);assert.match(text,/76\.000000/);
   }
   console.log('PASS stale fix + fresh heartbeat:',path);
   await mkdir('test-results/gps-browser',{recursive:true});
   await page.screenshot({path:'test-results/gps-browser/'+path.replaceAll('/','_')+'-stale.png',fullPage:true});
   scenario='zero'; await page.clock.setSystemTime(now); await page.reload({waitUntil:'domcontentloaded'});
   await page.getByText('0.0 km/h',{exact:true}).first().waitFor({timeout:30000});
   assert.match(await page.locator('body').innerText(),/Idle/);
   console.log('PASS measured zero:',path);
   scenario='moving'; await page.clock.setSystemTime(now); await page.reload({waitUntil:'domcontentloaded'});
   await page.getByText('35.0 km/h',{exact:true}).first().waitFor({timeout:30000});
   assert.match(await page.locator('body').innerText(),/Moving/);
   console.log('PASS fresh moving fix:',path);
  }
  outage=true;
  await page.clock.fastForward(130000);
  await page.getByText('Awaiting GPS',{exact:true}).filter({visible:true}).first().waitFor({timeout:15000});
  assert.doesNotMatch(await page.locator('body').innerText(),/35\.0 km\/h|12\.300 V/);
  console.log('PASS cached GPS expires during API outage');
  assert.deepEqual(unexpected,[]);
  assert.deepEqual(errors,[]);
  console.log('PASS: real Chromium/React/Next/Leaflet screens; synthetic API responses only; no production access');
 }finally{if(browser)await browser.close();server.kill('SIGTERM');}
})().catch(e=>{console.error(e);process.exitCode=1;});
