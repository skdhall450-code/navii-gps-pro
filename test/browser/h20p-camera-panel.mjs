import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { mkdir } from 'node:fs/promises';
const base = 'http://127.0.0.1:39116';
const user = { id:'qa', name:'Camera QA', email:'qa@example.invalid', role:'CUSTOMER', companyId:'qa' };
let forbidden = false;
const unexpected = [], errors = [];
const server = spawn(process.execPath, ['node_modules/next/dist/bin/next','start','--hostname','127.0.0.1','--port','39116'], {stdio:'pipe'});
let logs = '', browser;
for(const s of [server.stdout,server.stderr]) s.on('data', d => {logs=(logs+d).slice(-4000);});
try {
  const deadline = Date.now()+30000;
  while(true){try {if((await fetch(base+'/login')).ok) break;}catch{} assert.ok(Date.now()<deadline,logs); await new Promise(r=>setTimeout(r,100));}
  browser=await chromium.launch({headless:true,executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE || undefined,args:['--no-sandbox']});
  const context=await browser.newContext();
  await context.route('**/*',async route=>{
    const url=new URL(route.request().url());
    if(url.origin===base) return route.continue();
    const headers={'access-control-allow-origin':base,'access-control-allow-headers':'authorization','access-control-allow-methods':'GET'};
    if(route.request().method()==='OPTIONS')return route.fulfill({status:204,headers});
    assert.equal(route.request().method(),'GET');
    let data, status=200;
    if(url.origin!=='https://api.naviigps.com'){unexpected.push(url.href);return route.abort();}
    if(url.pathname==='/api/auth/me')data=user;
    else if(url.pathname==='/api/gps/vehicles'){
      status=forbidden?403:200;
      data=[{id:'A',vehicleNo:'SYNTHETIC-A',name:'Test vehicle',speed:0,ignition:false,battery:12,latitude:30,longitude:76,lastUpdate:new Date().toISOString(),device:null}];
    } else if(url.pathname==='/api/gps/history/A')data=[];
    else {unexpected.push(url.pathname);return route.abort();}
    return route.fulfill({status,headers,contentType:'application/json',body:JSON.stringify({success:status===200,data})});
  });
  await context.addInitScript(user=>{
    localStorage.setItem('navii_access_token','synthetic-only');localStorage.setItem('navii_user',JSON.stringify(user));
    window.revoked=[];const revoke=URL.revokeObjectURL.bind(URL);URL.revokeObjectURL=url=>{window.revoked.push(url);revoke(url);};
  },user);
  const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base+'/dashboard/vehicles/A');
  const panel=page.getByRole('region',{name:'Vehicle camera preview'});
  await panel.waitFor();
  assert.equal(await panel.getByRole('button',{name:'Start live video — unavailable'}).isDisabled(),true);
  await panel.getByText('Hardware unverified',{exact:true}).waitFor();
  await panel.getByRole('button',{name:'Open demo',exact:true}).click();
  await panel.getByText('SIMULATED DEMO • NOT LIVE',{exact:true}).waitFor();
  await panel.locator('input[type=file]').setInputFiles({name:'invalid.txt',mimeType:'text/plain',buffer:Buffer.from('test')});
  await panel.getByText('Choose an MP4 or WebM file no larger than 100 MB.').waitFor();
  // Generate a genuine tiny video fixture locally; never download third-party footage.
  const bytes=await page.evaluate(async()=>{
    const canvas=document.createElement('canvas');canvas.width=160;canvas.height=90;
    const stream=canvas.captureStream(10), recorder=new MediaRecorder(stream,{mimeType:'video/webm'}), chunks=[];
    recorder.ondataavailable=e=>chunks.push(e.data);
    const complete=new Promise(resolve=>recorder.onstop=async()=>resolve(Array.from(new Uint8Array(await new Blob(chunks).arrayBuffer()))));
    recorder.start();const ctx=canvas.getContext('2d');
    for(let frame=0;frame<24;frame++){
      ctx.fillStyle='#0369a1';ctx.fillRect(0,0,160,90);
      ctx.fillStyle='#ffffff';ctx.fillRect(frame*5,30,20,20);
      await new Promise(r=>setTimeout(r,100));
    }
    recorder.stop();stream.getTracks().forEach(t=>t.stop());return complete;
  });
  await panel.locator('input[type=file]').setInputFiles({name:'synthetic.webm',mimeType:'video/webm',buffer:Buffer.from(bytes)});
  await panel.getByText('LOCAL SAMPLE • NOT LIVE',{exact:true}).waitFor();
  await page.waitForFunction(()=>document.querySelector('video')?.readyState>=2);
  const url=await panel.locator('video').getAttribute('src');assert.ok(url.startsWith('blob:'));
  await panel.locator('video').evaluate(video=>video.play());
  await page.waitForFunction(()=>document.querySelector('video')?.currentTime>0.1);
  await panel.locator('video').evaluate(video=>video.pause());
  await panel.getByRole('button',{name:'Remove sample',exact:true}).click();
  assert.ok(await page.evaluate(url=>window.revoked.includes(url),url));
  assert.equal(await panel.locator('input[type=file]').inputValue(),'');
  await panel.locator('input[type=file]').setInputFiles({name:'synthetic.webm',mimeType:'video/webm',buffer:Buffer.from(bytes)});
  await page.waitForFunction(()=>document.querySelector('video')?.readyState>=2);
  const replacementUrl=await panel.locator('video').getAttribute('src');
  console.log('PASS unverified/live-disabled state, explicit demo, rejected file and real local sample playback');
  await page.setViewportSize({width:390,height:844});
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth),'mobile overflow');
  await mkdir('test-results/h20p',{recursive:true});await page.screenshot({path:'test-results/h20p/mobile.png',fullPage:true});
  await panel.getByRole('button',{name:'Cabin camera',exact:true}).click();
  assert.equal(await panel.locator('video').count(),0);
  assert.ok(await page.evaluate(url=>window.revoked.includes(url),replacementUrl));
  await panel.getByText('NOT CONNECTED',{exact:true}).waitFor();
  await panel.getByRole('button',{name:'Open demo',exact:true}).click();
  await panel.getByText('Cabin demo layout',{exact:true}).waitFor();
  await page.setViewportSize({width:1440,height:1000});await page.screenshot({path:'test-results/h20p/desktop.png',fullPage:true});
  forbidden=true;await page.getByRole('button',{name:'Refresh',exact:true}).click();
  await page.getByRole('heading',{name:'Vehicle Unavailable'}).waitFor();
  assert.equal(await panel.count(),0);
  assert.deepEqual(unexpected,[]);assert.deepEqual(errors,[]);
  console.log('PASS responsive layout, channel reset/blob cleanup, revoked vehicle removes panel, zero video/network commands');
}finally{await browser?.close();server.kill('SIGTERM');}
