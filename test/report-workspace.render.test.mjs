import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createRequire} from 'node:module';
import ts from 'typescript';
import * as React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
const require = createRequire(import.meta.url);
function compile(path, overrides={}) {
  const source=readFileSync(new URL(path,import.meta.url),'utf8');
  const output=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX,target:ts.ScriptTarget.ES2022}}).outputText;
  const compiledModule={exports:{}};
  new Function('require','module','exports',output)(id=>overrides[id]??require(id),compiledModule,compiledModule.exports);
  return compiledModule.exports;
}
const helpers=compile('../lib/report-workspace.ts');
const filters={vehicleId:'v1',fromLocal:'2026-10-11T00:00',toLocal:'2026-10-11T00:05',timezone:'UTC',preset:'CUSTOM',kind:'ACTIVITY'};
const vehicle={id:'v1',vehicleNo:'QA-ONLY',name:null};
const activity={definitionsVersion:'2026-10-11',vehicle,period:{from:'2026-10-11T00:00:00.000Z',to:'2026-10-11T00:05:00.000Z'},summary:{totalPoints:1,totalDistanceKm:0,maxSpeedKph:50,averageSpeedKph:null,runningSeconds:0,idleSeconds:0,parkedSeconds:0,unknownSeconds:0,ignitionOnSeconds:0,ignitionOffSeconds:0,ignitionUnknownSeconds:0},coverage:{requestedSeconds:300,coveredSeconds:0,unobservedSeconds:300,coveragePercent:0,complete:false,dataComplete:true,distanceComplete:false,distanceObservedSeconds:0,truncated:false,pathTruncated:false,pointLimit:20000,firstRecordedAt:null,lastRecordedAt:null,gapCount:0,gapSeconds:0,distanceRejectedSegments:1},positions:[{id:'p1',latitude:null,longitude:null,speed:null,ignition:null,battery:null,recordedAt:'2026-10-11T00:00:00.000Z'}]};
function render({result=null,error='',currentFilters=filters,loading=false}={}) {
  const state=[[vehicle],false,currentFilters,result,loading,error,'',0,''];let i=0;
  const Component=compile('../components/reports/ReportsWorkspace.tsx',{'react':{...React,useState:()=>[state[i++],()=>{}]},'next/navigation':{useRouter:()=>({replace:()=>{}})},'@/lib/report-workspace':helpers}).default;
  return renderToStaticMarkup(React.createElement(Component));
}
test('initial rendered report has explicit dates/timezone and no fabricated metrics',()=>{const html=render();assert.match(html,/Generate report/);assert.match(html,/Timezone/);assert.match(html,/Your report starts here/);assert.doesNotMatch(html,/0\.00 km/);});
test('partial/null report renders unknown values safely and explains gap coverage',()=>{const html=render({result:{filters,vehicle,createdAt:activity.period.to,activity}});assert.match(html,/Partial activity coverage/);assert.match(html,/GPS distance is partial/);assert.match(html,/Unavailable/);assert.match(html,/Unknown/);assert.match(html,/Stored ignition booleans/);assert.doesNotMatch(html,/NaN/);});
test('changing filters preserves a visible snapshot and export warning',()=>{const html=render({currentFilters:{...filters,timezone:'Asia/Kolkata'},result:{filters,vehicle,createdAt:activity.period.to,activity}});assert.match(html,/Filters have changed/);assert.match(html,/Downloads use the dates below/);assert.match(html,/Download CSV/);});

test('rendered and printable report hides legacy ignition and all engine-derived totals despite complete GPS coverage',()=>{
  const candidate={...activity,summary:{...activity.summary,runningSeconds:7321,idleSeconds:7321,parkedSeconds:7321,unknownSeconds:7321,totalDistanceKm:12},coverage:{...activity.coverage,complete:true,coveragePercent:100,distanceObservedSeconds:300,distanceComplete:true},positions:[{...activity.positions[0],speed:35,ignition:true}]};
  const html=render({result:{filters,vehicle,createdAt:activity.period.to,activity:candidate}});
  assert.match(html,/does not verify ACC observations/);
  assert.match(html,/12\.00 km/);
  assert.match(html,/35\.0 km\/h/);
  assert.doesNotMatch(html,/>On<|>Off<|>ON<|>OFF<|2h 2m/);
  for(const title of ['Moving','Engine-on idle','Parked','Unknown state']) assert.match(html,new RegExp(`${title}</p><p[^>]*>Unavailable</p>`));
  const verified={...candidate,positions:[{...candidate.positions[0],ignitionSource:'ACC',ignitionObservedAt:candidate.positions[0].recordedAt}]};
  assert.match(render({result:{filters,vehicle,createdAt:activity.period.to,activity:verified}}),/>ON</);
});
test('loading exposes a cancel button and errors retain earlier report warning',()=>{assert.match(render({loading:true}),/Cancel/);assert.match(render({error:'Synthetic timeout',result:{filters,vehicle,createdAt:activity.period.to,activity}}),/earlier report remains below/);});

test('future period explains why coverage cannot yet be complete without inventing gaps',()=>{const html=render({result:{filters,vehicle,createdAt:activity.period.from,activity}});assert.match(html,/This period includes future time/);assert.match(html,/0 telemetry gaps/);assert.doesNotMatch(render({result:{filters,vehicle,createdAt:activity.period.to,activity}}),/This period includes future time/);});

test('primary report action has unambiguous hover contrast and dark native controls',()=>{
  const html=render();
  const submit=html.match(/<button[^>]*type="submit"[^>]*>/)?.[0];
  assert.ok(submit);
  assert.match(submit,/hover:bg-sky-400/);
  assert.doesNotMatch(submit,/hover:bg-white\/10|text-slate-100/);
  for(const control of html.matchAll(/<input[^>]*type="datetime-local"[^>]*>/g)) assert.match(control[0],/\[color-scheme:dark\]/);
});

test('report print styles hide only report-time shell overlays and wrap all table cells',()=>{
  const css=render().match(/<style>([\s\S]*?)<\/style>/)?.[1];
  assert.ok(css?.trim().startsWith('@media print {'));
  assert.match(css,/body:has\(\.navii-report-workspace\) \[data-cookie-settings\]/);
  assert.match(css,/body:has\(\.navii-report-workspace\) \[data-cookie-consent\]/);
  assert.match(css,/\[data-customer-portal\] > nav/);
  assert.match(css,/table-layout: fixed/);
  assert.match(css,/white-space: normal !important; overflow-wrap: anywhere/);
  assert.match(css,/overflow: visible !important/);
  assert.match(css,/thead \{ display: table-header-group/);
});
