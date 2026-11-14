import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createRequire} from 'node:module';
import ts from 'typescript';
import * as React from 'react';
import * as helpers from '../lib/customer-alert-settings.ts';
const require = createRequire(import.meta.url);
const compiled = ts.transpileModule(readFileSync(new URL('../components/customer/CustomerAlertSettings.tsx', import.meta.url), 'utf8'), {compilerOptions: {module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022, esModuleInterop: true}}).outputText;
function harness() {
  const capabilities = {geofenceWrite:true, overspeedConfiguration:true, eventEvaluation:false, emailDelivery:false, smsDelivery:false, lowBattery:false};
  const vehicles = [{id:'v', vehicleNo:'SYNTHETIC', name:null}];
  const states = [vehicles,[],[],capabilities,'v',helpers.blankCustomerSetting(),'',helpers.blankCustomerCircle(),null,false,false,false,false,'','',false,false];
  const refs = []; let stateIndex=0, refIndex=0;
  const fixture = {storageFails:true, networkFails:false, writes:[], stored:null, settings:[], persistenceAttempts:0};
  const hooks = {...React, useState() {const i=stateIndex++; return [states[i], next => {states[i]=typeof next==='function'?next(states[i]):next;}];}, useRef(initial) {return refs[refIndex++] ??= {current:initial};}, useEffect() {}, useCallback:callback=>callback};
  const overrides = {react:hooks, 'next/navigation':{useRouter:()=>({replace(){}})}, 'next/dynamic':()=>()=>null, '@/lib/customer-alert-settings':helpers, './CustomerSession':{useCustomerSession:()=>({id:'u',sessionToken:'synthetic-token',role:'CUSTOMER'})}, './customer-settings.module.css':{}};
  const compiledModule = {exports:{}};
  new Function('require','module','exports','fetch','localStorage','sessionStorage','window',compiled)(id=>overrides[id]??require(id),compiledModule,compiledModule.exports,async(url,init)=>{
    if(init.method) {
      assert.ok(fixture.stored, 'Recovery record must persist before sending');
      fixture.writes.push(JSON.parse(init.body));
      if(fixture.networkFails) throw Error('Synthetic lost response');
      fixture.settings=[{...JSON.parse(init.body),vehicleId:'v',revision:1}];
    }
    return {ok:true,status:200,json:async()=>({success:true,data:url.endsWith('customer-geofences')?[]:fixture.settings,vehicles,capabilities,truncated:false})};
  },{getItem:()=> 'synthetic-token'}, {setItem(key,value){fixture.persistenceAttempts++;if(fixture.storageFails)throw Error('Synthetic quota failure');fixture.stored=value;},removeItem(){fixture.stored=null;}},{setTimeout,clearTimeout});
  function tree(){stateIndex=refIndex=0;return compiledModule.exports.default();}
  function all(node,type){if(!node||typeof node!=='object')return [];return [...(node.type===type?[node]:[]),...React.Children.toArray(node.props?.children).flatMap(child=>all(child,type))];}
  const settle=()=>new Promise(resolve=>setImmediate(resolve));
  return {fixture,states,refs,async save(){all(tree(),'form')[0].props.onSubmit({preventDefault(){}});await settle();}, async refresh(){all(tree(),'button').find(button=>button.props.children==='Refresh saved settings').props.onClick();await settle();}, disabled:()=>all(tree(),'fieldset')[0].props.disabled};
}
test('failed pre-request persistence sends nothing and storage recovery permits retry',async()=>{
  const app=harness();await app.save();assert.equal(app.fixture.writes.length,0);assert.equal(app.refs[2].current,null);assert.equal(app.disabled(),false);
  app.fixture.storageFails=false;await app.refresh();await app.save();assert.equal(app.fixture.writes.length,1);assert.equal(app.refs[2].current,null);assert.equal(app.disabled(),false);
});
test('an existing uncertain operation stays protected even if later storage fails',async()=>{
  const app=harness();app.fixture.storageFails=false;app.fixture.networkFails=true;await app.save();const pending=app.refs[2].current;const stored=app.fixture.stored;assert.ok(pending);assert.equal(app.disabled(),true);
  app.fixture.storageFails=true;await app.save();await app.refresh();assert.equal(app.fixture.writes.length,1);assert.equal(app.fixture.persistenceAttempts,1);assert.equal(app.refs[2].current,pending);assert.equal(app.fixture.stored,stored);assert.equal(app.disabled(),true);
});
