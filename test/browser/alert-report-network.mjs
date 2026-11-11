/** Fixture-only routing. No production API, auth, analytics or socket connection. */
import assert from 'node:assert/strict';
import {alertFixture} from '../alert-report-fixture.mjs';

async function fulfillAlertRoute(route,{base,apiOrigins,state}) {
    const request=route.request();const url=new URL(request.url());
    if(url.origin===base && ['GET','HEAD'].includes(request.method()) && !/^\/api(?:\/|$)/.test(url.pathname) && url.pathname!=='/_next/image') {
      // Never follow a local redirect to an external destination, or invoke
      // Next's image proxy with an external URL. Only this loopback fetch runs.
      const response=await route.fetch({maxRedirects:0});
      if(response.status()<300 || response.status()>=400)return route.fulfill({response});
    }
    if(!apiOrigins.has(url.origin)) {
      state.blocked.push(request.url());
      state.unexpected.push(`${request.method()} ${request.url()}`);
      return route.abort();
    }
    const headers={'access-control-allow-origin':base,'access-control-allow-methods':'GET','access-control-allow-headers':'authorization,content-type'};
    if(request.method()==='OPTIONS')return route.fulfill({status:204,headers});
    state.requests.push(request.url());
    let body,status=200;
    if(request.method()!=='GET'){state.unexpected.push(`${request.method()} ${url.pathname}`);status=405;body={success:false};}
    else if(url.pathname==='/api/auth/me')body={success:true,data:{id:'qa-user',name:'Synthetic QA',email:'qa@example.invalid',role:'ADMIN',companyId:'qa-company',customerId:'qa-customer'}};
    else if(url.pathname==='/api/gps/vehicles')body={success:true,data:[alertFixture().vehicle]};
    else if(url.pathname==='/api/gps/reports/v2/alerts/v1'){
      assert.equal(url.searchParams.get('alertContract'),'source-records-v1');assert.equal(url.searchParams.get('from'),'2026-10-11T00:00:00.000Z');assert.equal(url.searchParams.get('to'),'2026-10-12T00:00:00.000Z');
      body=alertFixture();body.sources[0].data[0].message='=SUM(1,2) "quoted"\nsecond line';
      const source=body.sources[1],row=source.data[0];source.data=Array.from({length:26},(_,i)=>({...row,sourceId:String(i).padStart(3,'0'),id:`CUSTOMER_ALERT_EVENT:${String(i).padStart(3,'0')}`,message:`SYNTHETIC_ROW_${i}`}));source.coverage.returnedCount=26;
      if(state.mode==='invalid')body.sources[1].data[0].resolutionStatus='OPEN';
      if(state.mode==='unavailable'){status=503;body={success:false,status:'unavailable',message:'Synthetic required source unavailable'};}
    } else {state.unexpected.push(`GET ${url.pathname}`);status=404;body={success:false};}
    return route.fulfill({status,headers,contentType:'application/json',body:JSON.stringify(body)});
}

export function createAlertRoute(options) {
  return async route=>{
    try {return await fulfillAlertRoute(route,options);}
    catch(error) {
      options.state.errors.push(`HTTP fixture callback: ${error?.stack || String(error)}`);
      // Event-driven Playwright callbacks must not escape the suite's cleanup.
      try {await route.abort();}
      catch(abortError) {options.state.errors.push(`HTTP fixture abort: ${abortError?.stack || String(abortError)}`);}
    }
  };
}

export function createBlockedWebSocketRoute(state) {
  return async socket=>{
    state.blocked.push(socket.url());
    state.unexpected.push(`WebSocket ${socket.url()}`);
    // Do not call connectToServer: Playwright keeps this socket fully mocked.
    try {await socket.close({code:1008,reason:'No WebSockets permitted in synthetic report acceptance'});}
    catch(error) {state.errors.push(`WebSocket fixture close: ${error?.stack || String(error)}`);}
  };
}
