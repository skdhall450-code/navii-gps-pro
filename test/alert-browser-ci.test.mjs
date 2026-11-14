import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,readFileSync,readdirSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
import {createAlertRoute,createBlockedWebSocketRoute} from './browser/alert-report-network.mjs';

const suite=fileURLToPath(new URL('./browser/alert-report-contract.mjs',import.meta.url));
const base='http://127.0.0.1:39131';
const apiOrigins=new Set(['https://api.naviigps.com','http://127.0.0.1:39112','http://127.0.0.1:39999']);
function temporary(run) {
  const cwd=mkdtempSync(join(tmpdir(),'navii-alert-ci-'));
  try {return run(cwd);} finally {rmSync(cwd,{recursive:true,force:true});}
}
function list(env={}) {
  return temporary(cwd=>{
    const result=spawnSync(process.execPath,[suite,'--list'],{cwd,env:{...process.env,CI:'',PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH:'',ALERT_TEST_OUTPUT:'',...env},encoding:'utf8'});
    assert.equal(result.status,0,result.stderr);
    assert.deepEqual(readdirSync(cwd),[],'Discovery never creates build or browser output');
    return JSON.parse(result.stdout);
  });
}

test('CI directly executes alert browser acceptance after build and uploads diagnostics on failure',()=>{
  const workflow=readFileSync(new URL('../.github/workflows/seo-quality.yml',import.meta.url),'utf8');
  const steps=workflow.split(/^      - name: /m);
  const alert=steps.find(step=>step.startsWith('Check alert reports, CSV and print in Chromium\n'));
  assert.ok(alert);
  assert.match(alert,/run: node test\/browser\/alert-report-contract\.mjs\s*$/);
  assert.match(alert,/if: \$\{\{ !cancelled\(\) && steps\.build\.outcome == 'success' \}\}/);
  assert.match(alert,/timeout-minutes: 3/);
  assert.doesNotMatch(alert,/continue-on-error|--list/);
  assert.ok(workflow.indexOf('id: build')<workflow.indexOf(alert));
  assert.ok(workflow.indexOf('npx playwright install --with-deps chromium')<workflow.indexOf(alert));
  const artifact=steps.find(step=>step.startsWith('Upload alert report browser diagnostics\n'));
  assert.match(artifact,/if: always\(\)/);
  assert.match(artifact,/path: test-results\/alert-report-contract/);
  assert.match(artifact,/uses: actions\/upload-artifact@v4/);
  const source=readFileSync(suite,'utf8');
  assert.match(source,/context\.setDefaultTimeout\(10000\)/);
  assert.match(source,/context\.setDefaultNavigationTimeout\(15000\)/);
  assert.match(source,/redirect:'error',signal:AbortSignal\.timeout\(1000\)/);
  assert.match(source,/await Promise\.all\(\[page\.waitForEvent\('download'\)/);
  const finalVerdict=source.indexOf('if(state.unexpected.length || state.blocked.length || state.errors.length)failure ||=');
  assert.ok(finalVerdict>source.indexOf('try {await stopServer();}'));
  assert.ok(finalVerdict<source.indexOf("await writeFile(output+'/browser-result.json'"));
});

test('Browser-free discovery lists nine existing acceptance checks without claiming execution',()=>{
  const config=list();
  assert.equal(config.acceptance,'NOT RUN');
  assert.equal(config.checks.length,9);
  assert.ok(config.checks.includes('all returned CSV/formula safety'));
  assert.ok(config.checks.includes('print coverage'));
  assert.deepEqual(config.apiOrigins,[...apiOrigins]);
  assert.equal(config.base,base);
  assert.deepEqual(config.browserOptions,{headless:true,chromiumSandbox:true});
});

test('CI selects the established stable Chrome channel without weakening its sandbox',()=>{
  assert.deepEqual(list({CI:'true'}).browserOptions,{headless:true,chromiumSandbox:true,channel:'chrome'});
});

test('An explicit browser path keeps sandbox protection and overrides the CI channel',()=>{
  assert.deepEqual(list({CI:'true',PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH:'/synthetic/browser'}).browserOptions,{headless:true,chromiumSandbox:true,executablePath:'/synthetic/browser'});
});

test('A missing production build fails before starting any server/browser and saves failure diagnostics',()=>temporary(cwd=>{
  const result=spawnSync(process.execPath,[suite],{cwd,env:{...process.env,ALERT_TEST_OUTPUT:'diagnostics'},encoding:'utf8'});
  assert.notEqual(result.status,0);
  assert.match(result.stderr,/Missing production build/);
  const failure=JSON.parse(readFileSync(join(cwd,'diagnostics/browser-result.json'),'utf8'));
  assert.equal(failure.status,'failed');
  assert.match(failure.failure,/Missing production build/);
  assert.deepEqual(failure.requests,[]);
  assert.equal(readFileSync(join(cwd,'diagnostics/server.log'),'utf8'),'');
}));

function routeFixture(url,method='GET',localStatus=200) {
  const state={mode:'valid',requests:[],unexpected:[],blocked:[],errors:[]};
  const calls=[];
  const response={status:()=>localStatus};
  const route={
    request:()=>({url:()=>url,method:()=>method}),
    continue:()=>assert.fail('A request must never be continued to a real external service'),
    fetch:async options=>{assert.equal(new URL(url).origin,base);assert.deepEqual(options,{maxRedirects:0});calls.push('loopback-fetch');return response;},
    fulfill:async options=>{calls.push('fulfill');return options;},
    abort:async()=>{calls.push('abort');},
  };
  return {state,calls,response,route,run:()=>createAlertRoute({base,apiOrigins,state})(route)};
}

test('Local pages are fetched with redirects disabled and fulfilled in place',async()=>{
  const fixture=routeFixture(base+'/dashboard/reports');
  assert.deepEqual(await fixture.run(),{response:fixture.response});
  assert.deepEqual(fixture.calls,['loopback-fetch','fulfill']);
});

test('Local redirect responses cannot navigate to a real API or external host',async()=>{
  const fixture=routeFixture(base+'/login','GET',302);await fixture.run();
  assert.deepEqual(fixture.calls,['loopback-fetch','abort']);
  assert.equal(fixture.state.unexpected.length,1);
});

test('Default CI and loopback build API origins are fulfilled entirely from synthetic data',async()=>{
  for(const api of apiOrigins)for(const path of ['/api/auth/me','/api/gps/vehicles','/api/gps/reports/v2/alerts/v1?alertContract=source-records-v1&from=2026-10-11T00%3A00%3A00.000Z&to=2026-10-12T00%3A00%3A00.000Z']) {
    const fixture=routeFixture(api+path);const result=await fixture.run();
    assert.equal(result.status,200);assert.equal(JSON.parse(result.body).success,true);
    assert.deepEqual(fixture.calls,['fulfill']);assert.deepEqual(fixture.state.unexpected,[]);
  }
});

test('Unmatched external API, auth and telemetry, local API/proxy and local writes abort and fail the acceptance state',async()=>{
  for(const [url,method] of [
    ['https://other.example.invalid/api/auth/me','GET'],
    ['https://www.google-analytics.com/g/collect','POST'],
    ['https://www.googletagmanager.com/gtag/js','GET'],
    [base+'/api/auth/me','GET'],[base+'/api','GET'],
    [base+'/_next/image?url=https://api.naviigps.com/api/auth/me','GET'],
    [base+'/dashboard/reports','POST'],
  ]) {
    const fixture=routeFixture(url,method);await fixture.run();
    assert.deepEqual(fixture.calls,['abort']);assert.deepEqual(fixture.state.blocked,[url]);assert.equal(fixture.state.unexpected.length,1);
  }
});

test('Unknown routes and writes on an intercepted API cannot reach a real backend',async()=>{
  for(const [path,method,status] of [['/api/auth/login','GET',404],['/api/gps/vehicles','POST',405]]) {
    const fixture=routeFixture('https://api.naviigps.com'+path,method);const result=await fixture.run();
    assert.equal(result.status,status);assert.deepEqual(fixture.calls,['fulfill']);assert.equal(fixture.state.unexpected.length,1);
  }
});

test('WebSockets are closed without connecting to any server and fail the acceptance state',async()=>{
  const state={blocked:[],unexpected:[],errors:[]};let closed;
  await createBlockedWebSocketRoute(state)({url:()=>'wss://api.naviigps.com/socket',connectToServer:()=>assert.fail('No server socket allowed'),close:async options=>{closed=options;}});
  assert.equal(closed.code,1008);assert.equal(state.unexpected.length,1);assert.equal(state.blocked.length,1);
});


test('Invalid report query assertions become recorded failures and abort without escaping the route callback',async()=>{
  const fixture=routeFixture('https://api.naviigps.com/api/gps/reports/v2/alerts/v1');
  await assert.doesNotReject(fixture.run());
  assert.deepEqual(fixture.calls,['abort']);assert.equal(fixture.state.errors.length,1);
  assert.match(fixture.state.errors[0],/HTTP fixture callback: AssertionError/);
});

test('Rejected local fetch, fixture fulfillment and abort stay in failed diagnostics without unhandled rejection',async()=>{
  for(const failing of ['fetch','fulfill','abort']) {
    const fixture=routeFixture(failing==='fetch'?base+'/login':failing==='fulfill'?'https://api.naviigps.com/api/auth/me':'https://other.example.invalid/api');
    fixture.route[failing]=async()=>{throw Error(`synthetic ${failing} rejection`);};
    await assert.doesNotReject(fixture.run());
    assert.ok(fixture.state.errors.some(error=>error.includes(`synthetic ${failing} rejection`)));
  }
});

test('Rejected WebSocket close is recorded without escaping the callback or connecting externally',async()=>{
  const state={blocked:[],unexpected:[],errors:[]};
  await assert.doesNotReject(createBlockedWebSocketRoute(state)({url:()=>'wss://api.naviigps.com/socket',connectToServer:()=>assert.fail('No server connection'),close:async()=>{throw Error('synthetic close rejection');}}));
  assert.equal(state.unexpected.length,1);assert.match(state.errors[0],/synthetic close rejection/);
});
