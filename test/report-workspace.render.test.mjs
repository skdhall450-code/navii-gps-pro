import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createRequire} from 'node:module';
import ts from 'typescript';
import {alertFixture,alertFilters} from './alert-report-fixture.mjs';
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
function render({result=null,error='',currentFilters=filters,loading=false,copies=1}={}) {
  const state=[[vehicle],false,currentFilters,result,loading,error,'',0,''];let i=0;
  const Component=compile('../components/reports/ReportsWorkspace.tsx',{'react':{...React,useState:initial=>[i < state.length ? state[i++] : initial,()=>{}]},'next/navigation':{useRouter:()=>({replace:()=>{}})},'@/lib/report-workspace':helpers}).default;
  // Each workspace gets the same synthetic state; nested source sections retain
  // their own initial values. Real React useId is intentionally not mocked.
  function Instance() { i=0; return React.createElement(Component); }
  return renderToStaticMarkup(React.createElement(React.Fragment,null,
    Array.from({length:copies},(_,key)=>React.createElement(Instance,{key}))));
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


test('alert source render includes unavailable status, timestamps, separate counts and printable scope warnings',()=>{
  const alerts=alertFixture();const html=render({currentFilters:alertFilters,result:{filters:alertFilters,vehicle,createdAt:alerts.period.to,alerts}});
  for(const text of ['LEGACY_ALERT','CUSTOMER_ALERT_EVENT','Created time','Observed time','ownership at the time of each record is not established','Prior customer assignments are omitted','Resolution status is unavailable','not unique incidents','not deduplicated','Event capture or evaluation may be disabled','1 stored records returned from this source','1 matching among 1 returned source records','Stored at','Print includes this source coverage'])assert.ok(html.includes(text),text);
  assert.match(html,/>Unavailable</);assert.doesNotMatch(html,/All matching records in this period are included/);
  const canonical=html.slice(html.indexOf('aria-label="Customer alert events"'));
  assert.doesNotMatch(canonical,/>Open<|>Resolved<|value="OPEN"|value="RESOLVED"/);
});
test('empty source and truncation copy never claim no incidents or complete history',()=>{
  const alerts=alertFixture();for(const source of alerts.sources){source.data=[];source.coverage.returnedCount=0;}
  let html=render({currentFilters:alertFilters,result:{filters:alertFilters,vehicle,createdAt:alerts.period.to,alerts}});
  assert.match(html,/No stored records in this source/);assert.match(html,/does not establish that no real-world alerts occurred/);
  alerts.sources[0].coverage.truncated=true;
  html=render({currentFilters:alertFilters,result:{filters:alertFilters,vehicle,createdAt:alerts.period.to,alerts}});
  assert.match(html,/Partial stored result: record limit reached/);assert.match(html,/Omitted records remain/);
});
test('source pagination renders 25 rows while preserving returned source count',()=>{
  const alerts=alertFixture();const source=alerts.sources[1];const row=source.data[0];
  source.data=Array.from({length:26},(_,i)=>({...row,id:`CUSTOMER_ALERT_EVENT:${i}`,sourceId:String(i),message:`SYNTHETIC_ROW_${i}`}));source.coverage.returnedCount=26;
  const html=render({currentFilters:alertFilters,result:{filters:alertFilters,vehicle,createdAt:alerts.period.to,alerts}});
  assert.match(html,/26 matching among 26 returned source records/);assert.match(html,/Page 1 of 2/);assert.ok(html.includes('SYNTHETIC_ROW_24'));assert.ok(!html.includes('SYNTHETIC_ROW_25'));
});


test('unavailable historical ownership error without a prior result exposes no report or export',()=>{
  const html=render({currentFilters:alertFilters,error:'Alert history unavailable: historical ownership cannot be verified.'});
  assert.match(html,/historical ownership cannot be verified/);assert.doesNotMatch(html,/aria-label="Generated report"|Download CSV|stored records returned from this source/);
});

// Focused SSR inspection, not a general HTML parser. These controls use plain
// text labels and quoted attributes; exact Playwright label lookup must not
// inherit option text from a select nested inside the label.
function htmlAttribute(attributes,name) {
  return attributes.match(new RegExp(`(?:^|\\s)${name}="([^"]*)"`))?.[1];
}
function exactLabelledSelects(html,title,expectedCount=1) {
  const labels=[...html.matchAll(/<label\b([^>]*)>([\s\S]*?)<\/label>/g)]
    .filter(match=>match[2]===title);
  assert.equal(labels.length,expectedCount,`${title}: expected text-only labels outside the select/options`);
  const controls=[...html.matchAll(/<select\b([^>]*)>([\s\S]*?)<\/select>/g)];
  const ids=[...html.matchAll(/\bid="([^"]*)"/g)].map(match=>match[1]);
  return labels.map(label=>{
    assert.doesNotMatch(label[2],/<(?:select|option)\b/);
    const target=htmlAttribute(label[1],'for');
    assert.ok(target,`${title}: label needs a nonempty for attribute`);
    assert.equal(ids.filter(id=>id===target).length,1,`${title}: for must resolve to exactly one element`);
    const matches=controls.filter(control=>htmlAttribute(control[1],'id')===target);
    assert.equal(matches.length,1,`${title}: for must resolve to a select`);
    const options=[...matches[0][2].matchAll(/<option\b([^>]*)>([\s\S]*?)<\/option>/g)];
    return {id:target,values:options.map(option=>htmlAttribute(option[1],'value')),
      selected:options.filter(option=>/(?:^|\s)selected(?:\s|=|$)/.test(option[1])).map(option=>htmlAttribute(option[1],'value'))};
  });
}
const labelledReportControls=[
  ['Vehicle',['','v1'],'v1'],
  ['Period',['TODAY','LAST_7_DAYS','THIS_MONTH','CUSTOM'],'CUSTOM'],
  ['Timezone',['Asia/Kolkata','UTC'],'UTC'],
];
for(const [title,values,selected] of labelledReportControls) {
  test(`${title} select has a text-only exact label and preserves options/selection`,()=>{
    const [control]=exactLabelledSelects(render(),title);
    assert.deepEqual(control.values,values);
    assert.deepEqual(control.selected,[selected]);
  });
}
function renderAlertLabels(copies=1) {
  const alerts=alertFixture();
  return render({copies,currentFilters:alertFilters,result:{filters:alertFilters,vehicle,createdAt:alerts.period.to,alerts}});
}
test('both alert source resolution selects have explicit text-only labels and preserve status options',()=>{
  const controls=exactLabelledSelects(renderAlertLabels(),'Resolution filter',2);
  assert.deepEqual(controls.map(control=>control.values),[['ALL','OPEN','RESOLVED'],['ALL','UNAVAILABLE']]);
  assert.deepEqual(controls.map(control=>control.selected),[['ALL'],['ALL']]);
  assert.equal(new Set(controls.map(control=>control.id)).size,2,'Source labels must not share a target');
});
test('repeated workspaces and repeated source sections retain unique label targets and selections',()=>{
  const html=renderAlertLabels(2),targets=[];
  for(const [title,values,selected] of labelledReportControls) {
    const controls=exactLabelledSelects(html,title,2);
    for(const control of controls){assert.deepEqual(control.values,values);assert.deepEqual(control.selected,[selected]);targets.push(control.id);}
  }
  const sources=exactLabelledSelects(html,'Resolution filter',4);
  assert.deepEqual(sources.map(control=>control.values),[
    ['ALL','OPEN','RESOLVED'],['ALL','UNAVAILABLE'],['ALL','OPEN','RESOLVED'],['ALL','UNAVAILABLE'],
  ]);
  for(const control of sources){assert.deepEqual(control.selected,['ALL']);targets.push(control.id);}
  assert.equal(targets.length,10);
  assert.equal(new Set(targets).size,10,'Every control target must stay unique across repeated workspace/source instances');
});