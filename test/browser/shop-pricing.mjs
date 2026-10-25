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
  assert.equal(await page.locator('[data-offer]').count(),9);
  assert.equal(await page.locator('[data-variant]').count(),10);
  assert.equal(await page.locator('h1').count(),1);
  assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'),'https://naviigps.com/shop-now');
  for(const [id,amount] of [['g17','₹2,525.00'],['bt50','₹2,525.00'],['gx03','₹2,879.00'],['gs900','₹2,879.00'],['s15','₹4,649.00'],['obd','₹3,469.00'],['ai-dashcam','₹8,555.00'],['non-ai-dashcam','₹6,195.00']])assert.ok((await page.locator(`[data-offer="${id}"]`).innerText()).includes(amount));
  assert.ok((await page.locator('[data-offer="ais140"]').innerText()).includes('₹7,009.00'));
  assert.ok((await page.locator('[data-offer="ais140"]').innerText()).includes('₹8,779.00'));
  assert.ok(!(await page.locator('[data-offer="ais140"]').innerText()).includes('MRP'));
  assert.equal(await page.getByText('−₹0.20',{exact:true}).count(),8);
  assert.equal(await page.getByText('Product photo coming soon',{exact:true}).count(),6);
  for(const id of ['ai-dashcam','non-ai-dashcam']){
    const card=page.locator(`[data-offer="${id}"]`);
    assert.doesNotMatch(await card.innerText(),/Airtel SIM|Software platform fee/);
    assert.match(await card.innerText(),/Shipping & handling/);
    const enquiry=new URL(await card.locator('a[href^="https://wa.me/"]').getAttribute('href')).searchParams.get('text');
    assert.doesNotMatch(enquiry,/Airtel SIM|Software platform fee/);
  }
  assert.equal(await page.getByText('+₹0.00',{exact:true}).count(),2);
  assert.ok((await page.locator('#g17').innerText()).includes('₹2,500.00'));
  assert.ok(!(await page.locator('main').innerText()).includes('500 km'));
  for(const link of await page.locator('#device-offers a[href^="https://wa.me/"]').all()){
    const url=new URL(await link.getAttribute('href'));assert.equal(url.pathname,'/917717394007');
    assert.ok(url.searchParams.get('text').includes('Shipping & handling: INR 250.00 + GST INR 45.00'));
  }
  await page.getByRole('link',{name:'View BT-50 GPS specifications'}).click();await page.waitForURL('**/products/bt50-vehicle-gps-tracker');await page.goBack({waitUntil:'domcontentloaded'});
  await mkdir('test-results/shop-browser',{recursive:true});
  // Both shared header implementations must expose Shop Now as a direct route.
  // Keep all requests loopback-only: no WhatsApp enquiry or external action is sent.
  for(const width of [320,390,768,1024,1440]){
    await page.setViewportSize({width,height:1000});
    for(const route of ['/', '/software', '/products', '/shop-now', '/about', '/contact']){
      await page.goto(base+route,{waitUntil:'networkidle'});
      await page.evaluate(()=>window.scrollTo(0,0));
      const header=page.locator('header');
      assert.equal(await header.count(),1,`One shared header on ${route}`);
      const trigger=header.getByRole('button',{name:'Open navigation menu',exact:true});
      const desktopShop=header.getByRole('link',{name:'Shop Now',exact:true});
      const tag=route==='/'?'home':route.slice(1);
      assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`Page contained ${route} at ${width}`);
      const assertContained=async locator=>{
        const box=await locator.boundingBox();
        assert.ok(box&&box.x>=0&&box.x+box.width<=width,`Navigation contained ${route} at ${width}`);
      };
      if(width>=1280){
        assert.equal(await trigger.isVisible(),false,`Desktop hides burger ${route}`);
        assert.equal(await desktopShop.count(),1,`One top-level desktop Shop Now ${route}`);
        assert.equal(await desktopShop.isVisible(),true);
        assert.equal(await desktopShop.getAttribute('href'),'/shop-now');
        assert.equal(await desktopShop.getAttribute('aria-current'),route==='/shop-now'?'page':null);
        await assertContained(desktopShop);
        // Reach the actual link by keyboard rather than programmatic focus.
        await page.evaluate(()=>{document.activeElement?.blur();window.scrollTo(0,0);});
        let reached=false;
        for(let tab=0;tab<35;tab++){
          await page.keyboard.press('Tab');
          if(await desktopShop.evaluate(el=>el===document.activeElement)){reached=true;break;}
        }
        assert.ok(reached,`Keyboard reaches direct Shop Now ${route}`);
        assert.ok(await desktopShop.evaluate(el=>{
          const css=getComputedStyle(el);
          return (css.outlineStyle!=='none'&&parseFloat(css.outlineWidth)>0)||css.boxShadow!=='none';
        }),`Visible keyboard focus ${route}`);
        await page.screenshot({path:`test-results/shop-browser/header-${tag}-${width}.png`});
        if(route!=='/shop-now'){
          await page.keyboard.press('Enter');
          await page.waitForURL(base+'/shop-now');
          await page.goBack({waitUntil:'domcontentloaded'});
          assert.equal(new URL(page.url()).pathname,route,`Back restores ${route}`);
        }
      }else{
        assert.equal(await trigger.isVisible(),true,`Mobile/tablet burger ${route} at ${width}`);
        assert.equal(await desktopShop.isVisible(),false,`No crowded desktop nav ${route} at ${width}`);
        await assertContained(trigger);
        await page.screenshot({path:`test-results/shop-browser/header-${tag}-${width}.png`});
        await trigger.click();
        const drawer=page.getByRole('dialog',{name:'Mobile navigation',exact:true});
        await drawer.waitFor({state:'visible'});
        const mobileShop=drawer.getByRole('link',{name:'Shop Now',exact:true});
        assert.equal(await mobileShop.count(),1);
        assert.equal(await mobileShop.isVisible(),true);
        assert.equal(await mobileShop.getAttribute('href'),'/shop-now');
        assert.equal(await mobileShop.getAttribute('aria-current'),route==='/shop-now'?'page':null);
        assert.equal(await trigger.getAttribute('aria-expanded'),'true');
        await page.waitForFunction(()=>document.querySelector('[role="dialog"]')?.contains(document.activeElement));
        // Cycle past both focus boundaries; focus must never escape the modal.
        const focusCount=await drawer.locator('a[href],button:not([disabled])').count();
        for(const key of ['Tab','Shift+Tab'])for(let step=0;step<focusCount+1;step++){
          await page.keyboard.press(key);
          assert.ok(await drawer.evaluate(el=>el.contains(document.activeElement)),`Focus trapped ${key} ${route} at ${width}`);
        }
        await mobileShop.scrollIntoViewIfNeeded();
        await page.screenshot({path:`test-results/shop-browser/menu-${tag}-${width}.png`});
        await page.keyboard.press('Escape');
        await drawer.waitFor({state:'detached'});
        assert.equal(await trigger.getAttribute('aria-expanded'),'false');
        assert.ok(await trigger.evaluate(el=>el===document.activeElement),'Escape restores menu-trigger focus');
        assert.notEqual(await page.evaluate(()=>document.body.style.overflow),'hidden','Escape restores body scroll');
        // Repeated open/close and navigation must not leave a stale modal behind.
        await trigger.click();
        await drawer.waitFor({state:'visible'});
        await drawer.getByRole('button',{name:'Close navigation menu',exact:true}).click();
        await drawer.waitFor({state:'detached'});
        await trigger.click();
        await drawer.waitFor({state:'visible'});
        await drawer.getByRole('link',{name:'Shop Now',exact:true}).click();
        await page.waitForURL(base+'/shop-now');
        await page.getByRole('dialog',{name:'Mobile navigation',exact:true}).waitFor({state:'detached'});
        assert.notEqual(await page.evaluate(()=>document.body.style.overflow),'hidden','Route navigation restores body scroll');
        if(route!=='/shop-now'){
          await page.goBack({waitUntil:'domcontentloaded'});
          assert.equal(new URL(page.url()).pathname,route,`Mobile Back restores ${route}`);
          assert.equal(await page.getByRole('dialog',{name:'Mobile navigation',exact:true}).count(),0,'Back does not reopen menu');
        }
      }
    }
  }
  await page.goto(base+'/shop-now',{waitUntil:'networkidle'});
  for(const width of [1440,1024,768,390,320]){
    await page.setViewportSize({width,height:1000});
    for(const image of await page.locator('main img').all()){await image.scrollIntoViewIfNeeded();await image.evaluate(image=>image.decode());}
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`No overflow ${width}`);
    for(const card of await page.locator('[data-offer]').all()){
      const bounds=await card.boundingBox();assert.ok(bounds.x>=0&&bounds.x+bounds.width<=width,`Card contained ${width}`);
    }
    await page.evaluate(()=>window.scrollTo(0,0));
    await page.screenshot({path:`test-results/shop-browser/hero-${width}.png`});
    await page.locator('#device-offers').scrollIntoViewIfNeeded();
    await page.screenshot({path:`test-results/shop-browser/offers-${width}.png`});
    await page.locator('[data-offer="ais140"]').scrollIntoViewIfNeeded();
    await page.screenshot({path:`test-results/shop-browser/ais140-${width}.png`});
  }
  // Verify published app-access destinations without visiting external services.
  await page.goto(base+'/software',{waitUntil:'networkidle'});
  const apps=page.locator('#app-access');
  assert.equal(await apps.count(),1);
  for(const [name,href] of [
    ['Web Login','https://naviigps.com/login'],
    ['Download App','https://play.google.com/store/apps/details?id=com.naviigps.customer'],
  ]){
    const link=apps.getByRole('link',{name,exact:true});
    assert.equal(await link.count(),1,`${name} is a real anchor`);
    assert.equal(await link.getAttribute('href'),href);
    if(await link.getAttribute('target')==='_blank'){
      const rel=(await link.getAttribute('rel')??'').split(/\s+/);
      assert.ok(rel.includes('noopener')&&rel.includes('noreferrer'),`${name} safely opens a new tab`);
    }
  }
  assert.equal(await apps.getByRole('button',{name:/Download App|Scan QR|Web Login/}).count(),0,'App actions are not inert buttons');
  assert.doesNotMatch(await apps.innerText(),/iPhone|iOS|App Store/i,'Do not advertise an unverified iOS app');
  const scan=apps.getByRole('link',{name:'Scan QR',exact:true});
  assert.equal(await scan.getAttribute('href'),'#navii-app-qr');
  const qr=apps.locator('#navii-app-qr img');
  assert.equal(await qr.count(),1,'A real QR image is rendered');
  assert.ok((await qr.getAttribute('src')).includes('navii-gps-customer-qr.svg'));
  assert.ok((await qr.getAttribute('alt')??'').trim().length>0,'QR has descriptive alt text');
  for(const width of [320,390,768,1440]){
    await page.setViewportSize({width,height:1000});
    await apps.scrollIntoViewIfNeeded();
    for(const img of await apps.locator('img').all()){
      await img.scrollIntoViewIfNeeded();
      await img.evaluate(el=>el.decode());
      assert.ok(await img.evaluate(el=>el.complete&&el.naturalWidth>0),'App-access image loaded');
    }
    await scan.click();
    assert.equal(new URL(page.url()).hash,'#navii-app-qr');
    assert.equal(await qr.isVisible(),true);
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`App access does not overflow ${width}`);
    for(const locator of [apps,qr,apps.getByRole('link',{name:'Web Login',exact:true}),apps.getByRole('link',{name:'Download App',exact:true})]){
      const box=await locator.boundingBox();
      assert.ok(box&&box.x>=0&&box.x+box.width<=width,`App access element contained at ${width}`);
    }
    const qrBox=await qr.boundingBox();
    assert.ok(qrBox.width>=180&&Math.abs(qrBox.width-qrBox.height)<1,`QR stays legible and square at ${width}`);
    await apps.screenshot({path:`test-results/shop-browser/apps-${width}.png`});
  }
  assert.deepEqual(errors,[]);
  const nojs=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});await nojs.route('**/*',r=>new URL(r.request().url()).origin===base?r.continue():r.abort());const staticPage=await nojs.newPage();await staticPage.goto(base+'/shop-now');assert.equal(await staticPage.locator('[data-offer]').count(),9);assert.ok((await staticPage.locator('[data-offer="bt50"]').innerText()).includes('₹2,525.20'));await nojs.close();
  console.log('Shop pricing: ten options, arithmetic, links, responsive cards, both shared headers, keyboard/mobile navigation and no-JS PASS. No WhatsApp message sent.');
}finally{if(browser)await browser.close();server.kill('SIGTERM');}
