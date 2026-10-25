import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { mkdir } from 'node:fs/promises';
const base='http://127.0.0.1:39115';
const server=spawn(process.execPath,['node_modules/next/dist/bin/next','start','--hostname','127.0.0.1','--port','39115'],{stdio:['ignore','pipe','pipe']});
let log='';
for(const stream of [server.stdout,server.stderr]) stream.on('data',data=>{log=(log+data).slice(-6000);});
let browser;
try {
  const deadline=Date.now()+45000; let ready=false;
  while(Date.now()<deadline){if(server.exitCode!==null)throw new Error(log);try{if((await fetch(base+'/shop-now')).ok){ready=true;break;}}catch{}await new Promise(r=>setTimeout(r,500));}
  assert.ok(ready,'Local Shop Now server ready');
  browser=await chromium.launch({headless:true,args:['--no-sandbox']});
  const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
  await context.route('**/*',route=>new URL(route.request().url()).origin===base?route.continue():route.abort());
  const page=await context.newPage();const errors=[];page.on('pageerror',error=>errors.push(error.message));
  await page.goto(base+'/shop-now',{waitUntil:'networkidle'});
  const consent=page.getByRole('button',{name:'Necessary Only',exact:true});if(await consent.isVisible())await consent.click();
  assert.equal(await page.locator('[data-offer]').count(),6);
  assert.equal(await page.locator('[data-variant]').count(),7);
  assert.equal(await page.locator('h1').count(),1);
  assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'),'https://naviigps.com/shop-now');
  for(const [id,amount] of [['g17','₹2,525.00'],['bt50','₹2,525.00'],['gx03','₹2,879.00'],['gs900','₹2,879.00'],['s15','₹4,649.00']])assert.ok((await page.locator(`[data-offer="${id}"]`).innerText()).includes(amount));
  assert.ok((await page.locator('[data-offer="ais140"]').innerText()).includes('₹7,009.00'));
  assert.ok((await page.locator('[data-offer="ais140"]').innerText()).includes('₹8,779.00'));
  assert.ok(!(await page.locator('[data-offer="ais140"]').innerText()).includes('MRP'));
  assert.equal(await page.getByText('−₹0.20',{exact:true}).count(),7);
  assert.equal(await page.getByText('Product photo coming soon',{exact:true}).count(),3);
  assert.ok((await page.locator('#g17').innerText()).includes('₹2,500.00'));
  assert.ok(!(await page.locator('main').innerText()).includes('500 km'));
  for(const link of await page.locator('#device-offers a[href^="https://wa.me/"]').all()){
    const url=new URL(await link.getAttribute('href'));assert.equal(url.pathname,'/917717394007');
    assert.ok(url.searchParams.get('text').includes('Shipping & handling: INR 250.00 + GST INR 45.00'));
  }
  await page.getByRole('link',{name:'View BT-50 GPS specifications'}).click();await page.waitForURL('**/products/bt50-vehicle-gps-tracker');await page.goBack({waitUntil:'networkidle'});
  await mkdir('test-results/shop-browser',{recursive:true});
  for(const width of [1440,768,390,320]){
    await page.setViewportSize({width,height:1000});
    for(const image of await page.locator('main img').all()){await image.scrollIntoViewIfNeeded();await image.evaluate(image=>image.decode());}
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`No overflow ${width}`);
    for(const card of await page.locator('[data-offer]').all()){
      const bounds=await card.boundingBox();assert.ok(bounds.x>=0&&bounds.x+bounds.width<=width,`Card contained ${width}`);
    }
    await page.locator('#device-offers').scrollIntoViewIfNeeded();
    await page.screenshot({path:`test-results/shop-browser/offers-${width}.png`});
    await page.locator('[data-offer="ais140"]').scrollIntoViewIfNeeded();
    await page.screenshot({path:`test-results/shop-browser/ais140-${width}.png`});
  }
  assert.deepEqual(errors,[]);
  const nojs=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});await nojs.route('**/*',r=>new URL(r.request().url()).origin===base?r.continue():r.abort());const staticPage=await nojs.newPage();await staticPage.goto(base+'/shop-now');assert.equal(await staticPage.locator('[data-offer]').count(),6);assert.ok((await staticPage.locator('[data-offer="bt50"]').innerText()).includes('₹2,525.20'));await nojs.close();
  console.log('Shop pricing: seven options, arithmetic, links, responsive cards and no-JS PASS. No WhatsApp message sent.');
}finally{if(browser)await browser.close();server.kill('SIGTERM');}
