/** Local synthetic UI acceptance. Never contact live APIs or external providers. */
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {spawn} from 'node:child_process';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {alertFilters} from '../alert-report-fixture.mjs';
import {createAlertRoute,createBlockedWebSocketRoute} from './alert-report-network.mjs';
const base='http://127.0.0.1:39131';
// These origins are fulfilled in memory, never sent to an API server.
// Match the normal CI build and the existing loopback-only QA builds.
const apiOrigins=new Set(['https://api.naviigps.com','http://127.0.0.1:39112','http://127.0.0.1:39999']);
const output=process.env.ALERT_TEST_OUTPUT || 'test-results/alert-report-contract';
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
const browserOptions={headless:true,chromiumSandbox:true,...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH ? {executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH} : process.env.CI ? {channel:'chrome'} : {})};
const checks=['negotiated request bounds','independent source counts/status','25-row pagination','source search/status','all returned CSV/formula safety','print coverage','mobile layout','invalid contract fail closed','503 unavailable fail closed'];
// Configuration/discovery only: no server, socket, browser, or output file.
if(process.argv.includes('--list')) {
  console.log(JSON.stringify({suite:'alert-report-contract',checks,base,apiOrigins:[...apiOrigins],output,browserOptions,prerequisites:['npm ci','npm run build','sandbox-capable Chromium (stable Chrome on CI)'],acceptance:'NOT RUN'},null,2));
  process.exit(0);
}
let server,serverStopped,serverError,serverLog='',browser,failure;
const state={mode:'valid',requests:[],unexpected:[],blocked:[],errors:[]};
async function stopServer() {
  if(!server?.pid || server.exitCode!==null || server.signalCode!==null)return;
  server.kill('SIGTERM');
  let timer;
  await Promise.race([serverStopped,new Promise(resolve=>{timer=setTimeout(resolve,5000);})]);
  clearTimeout(timer);
  if(server.exitCode===null && server.signalCode===null) {
    server.kill('SIGKILL');
    await serverStopped;
  }
}
try {
  await mkdir(output,{recursive:true});
  const buildId=await readFile('.next/BUILD_ID','utf8').catch(()=>{throw Error('Missing production build: run npm run build before alert browser acceptance.');});
  assert.ok(buildId.trim(),'Production build ID must not be empty');
  server=spawn(process.execPath,['node_modules/next/dist/bin/next','start','--hostname','127.0.0.1','--port','39131'],{env:{...process.env,NEXT_TELEMETRY_DISABLED:'1'},stdio:['ignore','pipe','pipe']});
  serverStopped=new Promise(resolve=>{
    server.once('exit',resolve);
    server.once('error',error=>{serverError=error;resolve();});
  });
  for(const stream of [server.stdout,server.stderr])stream.on('data',data=>serverLog=(serverLog+data).slice(-10000));
  let ready=false;
  for(let until=Date.now()+45000;Date.now()<until;) {
    if(serverError)throw serverError;
    if(server.exitCode!==null || server.signalCode!==null)throw Error('Fixture server exited before readiness: '+serverLog);
    // Do not accidentally accept a different process already using this port.
    if(serverLog.includes('Ready in'))try{if((await fetch(base+'/login',{redirect:'error',signal:AbortSignal.timeout(1000)})).ok){ready=true;break;}}catch{}
    await sleep(500);
  }
  assert.ok(ready,'Local fixture server did not become ready within 45 seconds: '+serverLog);
  browser=await chromium.launch({...browserOptions,timeout:30000});
  const context=await browser.newContext({viewport:{width:1440,height:1000},acceptDownloads:true,reducedMotion:'reduce',serviceWorkers:'block'});
  context.setDefaultTimeout(10000);
  context.setDefaultNavigationTimeout(15000);
  await context.route('**/*',createAlertRoute({base,apiOrigins,state}));
  await context.routeWebSocket('**/*',createBlockedWebSocketRoute(state));
  await context.addInitScript(()=>{localStorage.setItem('navii_access_token','synthetic-test-only');localStorage.setItem('navii_user',JSON.stringify({id:'qa-user',name:'Synthetic QA',role:'ADMIN',companyId:'qa-company',customerId:'qa-customer'}));localStorage.setItem('navii_analytics_consent','denied');});
  const page=await context.newPage();page.on('pageerror',e=>state.errors.push(e.message));
  async function chooseReport(){
    await page.goto(base+'/dashboard/reports');
    await page.getByLabel('Vehicle',{exact:true}).selectOption('v1');
    await page.getByRole('radio').nth(1).check();
    await page.getByLabel('Period',{exact:true}).selectOption('CUSTOM');await page.getByLabel('Timezone',{exact:true}).selectOption('UTC');
    await page.getByLabel('Start date & time',{exact:true}).fill(alertFilters.fromLocal);await page.getByLabel('End date & time',{exact:true}).fill(alertFilters.toLocal);
  }
  await chooseReport();await page.getByRole('button',{name:'Generate report',exact:true}).click();
  const canonical=page.getByRole('region',{name:'Customer alert events',exact:true});const legacy=page.getByRole('region',{name:'Legacy alerts',exact:true});
  await canonical.waitFor();assert.equal(await canonical.locator('tbody tr').count(),25);assert.ok((await canonical.innerText()).includes('26 matching among 26 returned source records'));
  assert.ok((await canonical.innerText()).includes('Resolution status is unavailable'));assert.equal(await canonical.locator('tbody').getByText('Open',{exact:true}).count(),0);
  assert.ok((await canonical.innerText()).includes('12 Oct 2026')); // Storage is outside query; observed report time is inside.
  await canonical.getByRole('button',{name:'Next',exact:true}).click();assert.equal(await canonical.locator('tbody tr').count(),1);assert.ok((await canonical.innerText()).includes('SYNTHETIC_ROW_25'));
  await canonical.getByLabel('Search customer alert events',{exact:true}).fill('SYNTHETIC_ROW_25');assert.ok((await canonical.innerText()).includes('1 matching among 26 returned source records'));
  await canonical.getByLabel('Resolution filter',{exact:true}).selectOption('UNAVAILABLE');assert.equal(await canonical.locator('tbody tr').count(),1);
  await legacy.getByLabel('Resolution filter',{exact:true}).selectOption('RESOLVED');assert.ok((await legacy.innerText()).includes('No matching returned records'));
  const [download]=await Promise.all([page.waitForEvent('download'),page.getByRole('button',{name:'Download CSV',exact:true}).click()]);const csvPath=output+'/all-returned.csv';await download.saveAs(csvPath);const csv=await readFile(csvPath,'utf8');
  for(const value of ['SYNTHETIC_ROW_0','SYNTHETIC_ROW_25','"\'=SUM(1,2) ""quoted""\nsecond line"','CURRENT_CUSTOMER_ASSIGNMENT','Unavailable'])assert.ok(csv.includes(value),value);
  assert.equal((csv.match(/"CUSTOMER_ALERT_EVENT","OBSERVED_AT","CURRENT_CUSTOMER_ASSIGNMENT","CUSTOMER_ALERT_EVENT:/g)||[]).length,26);
  await page.screenshot({path:output+'/desktop.png',fullPage:true});
  await page.emulateMedia({media:'print'});
  assert.equal(await canonical.getByText(/Prior customer assignments are omitted/).isVisible(),true);assert.equal(await page.getByText(/Stored records, not unique incidents/).isVisible(),true);
  assert.equal(await canonical.getByLabel('Search customer alert events',{exact:true}).isVisible(),false);
  await page.pdf({path:output+'/print.pdf',format:'A4',printBackground:true});
  await page.emulateMedia({media:'screen'});await page.setViewportSize({width:390,height:844});await page.screenshot({path:output+'/mobile.png',fullPage:true});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'No mobile page overflow');
  state.mode='invalid';await chooseReport();await page.getByRole('button',{name:'Generate report',exact:true}).click();await page.getByRole('alert').filter({hasText:'service contract or source coverage could not be verified'}).waitFor();assert.equal(await page.getByRole('region',{name:'Generated report',exact:true}).count(),0);
  state.mode='unavailable';await page.getByRole('button',{name:'Generate report',exact:true}).click();await page.getByRole('alert').filter({hasText:'Synthetic required source unavailable'}).waitFor();assert.equal(await page.getByRole('region',{name:'Generated report',exact:true}).count(),0);
  assert.deepEqual(state.unexpected,[]);assert.deepEqual(state.blocked,[]);assert.deepEqual(state.errors,[]);
} catch(error) {
  failure=error;
} finally {
  // Stop our server even when browser launch, assertions, or browser close fail.
  try {if(browser)await browser.close();} catch(error) {failure ||= error;}
  try {await stopServer();} catch(error) {failure ||= error;}
  // Closing can settle a pending route callback. Its late failure must not pass.
  if(state.unexpected.length || state.blocked.length || state.errors.length)failure ||= Error('Synthetic fixture or page errors recorded; see browser-result.json');
  await mkdir(output,{recursive:true});
  await writeFile(output+'/server.log',serverLog);
  await writeFile(output+'/browser-result.json',JSON.stringify({...state,status:failure?'failed':'passed',checks,failure:failure?.stack},null,2));
}
if(failure)throw failure;
console.log('PASS: isolated alert report browser acceptance; all external providers blocked');
