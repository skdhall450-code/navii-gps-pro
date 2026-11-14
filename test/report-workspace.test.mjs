import test from 'node:test';
import assert from 'node:assert/strict';
import { localToIso, presetRange, reportQuery, durationLabel, csvCell, csvRows, isActivityReport, activityCsv, historicalIgnitionLabel } from '../lib/report-workspace.ts';
const base={vehicleId:'vehicle-1',fromLocal:'2026-10-11T00:00',toLocal:'2026-10-12T00:00',timezone:'Asia/Kolkata',preset:'TODAY',kind:'ACTIVITY'};
test('India time converts to UTC without using browser timezone',()=>assert.equal(localToIso(base.fromLocal,base.timezone),'2026-10-10T18:30:00.000Z'));
test('UTC preserves selected wall-clock time',()=>assert.equal(localToIso(base.fromLocal,'UTC'),'2026-10-11T00:00:00.000Z'));
test('invalid dates and incomplete times are rejected',()=>{ for(const date of ['2026-02-30T12:00','2026-10-11','2026-10-11T24:00'])assert.throws(()=>localToIso(date,'UTC')); });
test('today uses the selected timezone around midnight',()=>assert.deepEqual(presetRange('TODAY','Asia/Kolkata',Date.parse('2026-10-10T20:00Z')),{fromLocal:'2026-10-11T00:00',toLocal:'2026-10-12T00:00'}));
test('last seven days and month preserve calendar boundaries',()=>{assert.equal(presetRange('LAST_7_DAYS','UTC',Date.parse('2026-10-03T10:00Z')).fromLocal,'2026-09-27T00:00');assert.equal(presetRange('THIS_MONTH','UTC',Date.parse('2026-10-03T10:00Z')).fromLocal,'2026-10-01T00:00');});
test('queries include timezone and same 20k point cap',()=>{const query=new URLSearchParams(reportQuery(base));assert.equal(query.get('limit'),'20000');assert.equal(query.get('timezone'),'Asia/Kolkata');});
test('queries reject missing vehicle, reversed, equal and overlong range',()=>{for(const f of [{...base,vehicleId:''},{...base,toLocal:base.fromLocal},{...base,toLocal:'2026-10-10T00:00'},{...base,toLocal:'2026-12-01T00:00'}])assert.throws(()=>reportQuery(f));});
test('unknown duration does not look like zero',()=>{assert.equal(durationLabel(undefined),'Unavailable');assert.equal(durationLabel(0),'0s');assert.equal(durationLabel(3660),'1h 1m');});
test('CSV quoting neutralizes formula prefixes and escapes quotes',()=>{assert.equal(csvCell('=cmd'), '"\'=cmd"');assert.equal(csvCell('  @sum'), '"\'  @sum"');assert.equal(csvCell('a"b'), '"a""b"');assert.ok(csvRows([['a'],['b']]).includes('\r\n'));});
test('legacy report payload fails closed for missing coverage',()=>assert.equal(isActivityReport({vehicle:{id:'1',vehicleNo:'X'},summary:{totalDistanceKm:0},positions:[]}),false));

test('negative numeric coordinates remain numeric CSV cells',()=>assert.equal(csvCell(-73.5),'"-73.5"'));

test('historical ignition needs ACC provenance relative to the recorded row, not today',()=>{
  const recordedAt='2020-01-01T00:10:00.000Z';
  for(const ignition of [true,false]) {
    const p={ignition,recordedAt};
    assert.equal(historicalIgnitionLabel(p),'Unavailable');
    assert.equal(historicalIgnitionLabel({...p,ignitionSource:'CHARGING',ignitionObservedAt:recordedAt}),'Unavailable');
    const acc={...p,ignitionSource:'ACC',ignitionObservedAt:recordedAt};
    assert.equal(historicalIgnitionLabel(acc),ignition?'ON':'OFF');
    assert.equal(historicalIgnitionLabel({...acc,recordedAt:'2020-01-01T00:15:00.000Z'}),ignition?'ON':'OFF');
    assert.equal(historicalIgnitionLabel({...acc,recordedAt:'2020-01-01T00:15:00.001Z'}),'Stale');
    for(const ignitionObservedAt of [undefined,null,'invalid','2020-01-01T00:10:30.001Z']) assert.equal(historicalIgnitionLabel({...acc,ignitionObservedAt}),'Unavailable');
    assert.equal(historicalIgnitionLabel({...acc,recordedAt:'invalid'}),'Unavailable');
  }
});

test('CSV withholds unverified engine classifications even for complete coverage and plausible totals',()=>{
  const p={id:'p',latitude:30,longitude:76,speed:35,ignition:true,battery:12,recordedAt:'2020-01-01T00:10:00Z'};
  const report={vehicle:{id:'v',vehicleNo:'QA'},period:{from:p.recordedAt,to:'2020-01-01T01:00:00Z'},summary:{totalDistanceKm:12,runningSeconds:600,idleSeconds:700,parkedSeconds:800,unknownSeconds:900,averageSpeedKph:35},coverage:{coveragePercent:100,unobservedSeconds:0,complete:true,dataComplete:true,distanceComplete:true,distanceObservedSeconds:100,truncated:false,pathTruncated:false},positions:[p]};
  const csv=activityCsv(report,base);
  for(const title of ['Moving seconds','Engine-on idle seconds','Parked seconds','Unknown state seconds']) assert.ok(csv.includes(`"${title}","Unavailable"`));
  assert.ok(csv.includes('"GPS distance km","12"'));
  assert.ok(csv.includes('"35","Unavailable","12"'));
  assert.ok(csv.includes('does not verify ACC observations'));
  assert.equal(report.summary.runningSeconds,600);
  assert.equal(p.ignition,true);
  report.positions=[{...p,ignitionSource:'ACC',ignitionObservedAt:p.recordedAt}];
  const verifiedRowCsv=activityCsv(report,base);
  assert.ok(verifiedRowCsv.includes('"35","ON","12"'));
  assert.ok(verifiedRowCsv.includes('"Engine-on idle seconds","Unavailable"'),'a verified exported row does not verify aggregate coverage');
});
test('CSV preserves distance and activity completeness independently',()=>{
  const report={vehicle:{id:'v',vehicleNo:'QA'},period:{from:'2026-10-11T00:00:00Z',to:'2026-10-11T00:05:00Z'},summary:{totalDistanceKm:0,runningSeconds:300,idleSeconds:0,parkedSeconds:0,unknownSeconds:0,averageSpeedKph:40},coverage:{coveragePercent:100,unobservedSeconds:0,complete:true,dataComplete:true,distanceComplete:false,distanceRejectedSegments:1,distanceObservedSeconds:0,truncated:false,pathTruncated:false},positions:[]};
  const csv=activityCsv(report,base);
  assert.ok(csv.includes('"Activity coverage complete","true"'));
  assert.ok(csv.includes('"Distance coverage complete","false"'));
  assert.ok(csv.includes('"Rejected distance segments","1"'));
  assert.ok(csv.includes('"GPS distance km","Unavailable"'));
});
