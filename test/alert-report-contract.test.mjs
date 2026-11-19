import test from 'node:test';
import assert from 'node:assert/strict';
import {alertFixture,alertFilters} from './alert-report-fixture.mjs';
import {isAlertReport,reportQuery,alertsCsv,filterAlertRecords,alertResolutionLabel} from '../lib/report-workspace.ts';

test('only ALERTS negotiates source-records-v1 without changing bounds',()=>{
  const alerts=new URLSearchParams(reportQuery(alertFilters));const activity=new URLSearchParams(reportQuery({...alertFilters,kind:'ACTIVITY'}));
  assert.equal(alerts.get('alertContract'),'source-records-v1');assert.equal(activity.has('alertContract'),false);
  for(const key of ['from','to','timezone'])assert.equal(alerts.get(key),activity.get(key));assert.equal(alerts.get('limit'),'500');
});
test('accepts separate stored sources with observed time independent of later storage and colliding raw IDs',()=>{
  const report=alertFixture();assert.equal(isAlertReport(report,alertFilters),true);
  assert.equal(report.sources[0].data[0].sourceId,report.sources[1].data[0].sourceId);
  assert.notEqual(report.sources[0].data[0].id,report.sources[1].data[0].id);
  assert.equal(isAlertReport({...report,sources:[...report.sources].reverse()},alertFilters),true);
});
const invalid={
  'missing contract':r=>delete r.alertContractVersion,'wrong contract':r=>r.alertContractVersion='next',
  'wrong definitions':r=>r.definitionsVersion='2026-10-10','missing success':r=>delete r.success,'unavailable status':r=>r.status='unavailable',
  'wrong vehicle':r=>r.vehicle.id='another','invalid vehicle':r=>r.vehicle=null,
  'wrong from':r=>r.period.from='2026-10-10T00:00:00.000Z','wrong to':r=>r.period.to='2026-10-13T00:00:00.000Z',
  'wrong timezone':r=>r.period.timezone='Asia/Kolkata','inclusive end':r=>r.period.endExclusive=false,'defaulted period':r=>r.period.defaulted=true,
  'missing source':r=>r.sources.pop(),'unknown source':r=>r.sources[1].source='UNKNOWN','duplicate source':r=>r.sources[1]=structuredClone(r.sources[0]),
  'wrong time basis':r=>r.sources[1].timeBasis='CREATED_AT','wrong access scope':r=>r.sources[1].scope='CURRENT_VEHICLE_ACCESS',
  'count mismatch':r=>r.sources[0].coverage.returnedCount=2,'wrong cap':r=>r.sources[0].coverage.pointLimit=501,
  'truncation nonboolean':r=>r.sources[0].coverage.truncated=0,'inconsistent complete':r=>r.sources[0].coverage.complete=false,
  'inconsistent dataComplete':r=>r.sources[0].coverage.dataComplete=false,
  'short truncated result':r=>Object.assign(r.sources[0].coverage,{truncated:true,complete:false,dataComplete:false}),
  'canonical OPEN':r=>r.sources[1].data[0].resolutionStatus='OPEN','canonical RESOLVED':r=>r.sources[1].data[0].resolutionStatus='RESOLVED',
  'canonical resolved time':r=>r.sources[1].data[0].resolvedAt='2026-10-11T02:00:00.000Z','legacy UNAVAILABLE':r=>r.sources[0].data[0].resolutionStatus='UNAVAILABLE',
  'missing status':r=>delete r.sources[1].data[0].resolutionStatus,'legacy stale resolution':r=>r.sources[0].data[0].resolvedAt='2026-10-11T02:00:00.000Z',
  'wrong namespace':r=>r.sources[1].data[0].id='LEGACY_ALERT:same-id','missing raw id':r=>delete r.sources[1].data[0].sourceId,
  'invalid date':r=>r.sources[1].data[0].reportTime='invalid','noncanonical timestamp':r=>r.sources[1].data[0].reportTime='2026-10-11T01:00:00Z',
  'end excluded':r=>r.sources[1].data[0].reportTime=r.period.to,'before start':r=>r.sources[1].data[0].reportTime='2026-10-10T23:59:59.999Z',
  'legacy unequal timestamps':r=>r.sources[0].data[0].storedAt='2026-10-11T02:00:00.000Z','unsafe message type':r=>r.sources[0].data[0].message={},
};
for(const [name,mutate] of Object.entries(invalid))test(`fails closed: ${name}`,()=>{const report=alertFixture();mutate(report);assert.equal(isAlertReport(report,alertFilters),false);});
test('empty sources remain valid scoped queries and resolved legacy timestamp remains nullable',()=>{
  const report=alertFixture();report.sources[0].data[0].resolutionStatus='RESOLVED';assert.equal(isAlertReport(report,alertFilters),true);
  report.sources[0].data[0].resolvedAt='2026-10-12T04:00:00.000Z';assert.equal(isAlertReport(report,alertFilters),true);
  for(const source of report.sources){source.data=[];source.coverage.returnedCount=0;}assert.equal(isAlertReport(report,alertFilters),true);
});
test('per-source cap and deterministic ordering are validated without deduplicating streams',()=>{
  const report=alertFixture();const source=report.sources[1];const row=source.data[0];
  source.data=Array.from({length:500},(_,i)=>({...row,sourceId:String(i).padStart(4,'0'),id:`CUSTOMER_ALERT_EVENT:${String(i).padStart(4,'0')}`}));
  Object.assign(source.coverage,{returnedCount:500,truncated:true,complete:false,dataComplete:false});assert.equal(isAlertReport(report,alertFilters),true);
  const swapped=structuredClone(report);[swapped.sources[1].data[0],swapped.sources[1].data[1]]=[swapped.sources[1].data[1],swapped.sources[1].data[0]];assert.equal(isAlertReport(swapped,alertFilters),false);
  source.data.push({...row});source.coverage.returnedCount++;assert.equal(isAlertReport(report,alertFilters),false);
});
test('unavailable resolution is never labelled or filtered as open/resolved',()=>{
  const rows=alertFixture().sources[1].data;
  assert.equal(alertResolutionLabel(rows[0].resolutionStatus),'Unavailable');
  for(const status of ['OPEN','RESOLVED'])assert.equal(filterAlertRecords(rows,'',status).length,0);
  assert.equal(filterAlertRecords(rows,'unavailable','UNAVAILABLE').length,1);
  assert.equal(filterAlertRecords(rows,'open').length,0);assert.equal(filterAlertRecords(rows,'resolved').length,0);
});
test('CSV preserves independent times, both streams, scopes and unavailable status with safe untrusted text',()=>{
  const report=alertFixture();report.sources[0].data[0].message='=SUM(1,2) "quoted"\nnext line';report.sources[1].data[0].message='  @cmd';
  const csv=alertsCsv(report,alertFilters);
  assert.ok(csv.includes('"\'=SUM(1,2) ""quoted""\nnext line"'));assert.ok(csv.includes('"\'  @cmd"'));
  for(const prefix of ['+cmd','-cmd','\t=cmd']){report.sources[1].data[0].message=prefix;assert.ok(alertsCsv(report,alertFilters).includes(`"'${prefix}"`));}
  for(const phrase of ['LEGACY_ALERT:same-id','CUSTOMER_ALERT_EVENT:same-id','CREATED_AT','OBSERVED_AT','CURRENT_CUSTOMER_ASSIGNMENT','Prior customer assignments are omitted','ownership at the time of each record is not established','Stored records returned','not unique incidents','not deduplicated','Stored query truncated','Event capture or evaluation may be disabled','Unavailable','2026-10-11T01:00:00.000Z','2026-10-12T03:00:00.000Z'])assert.ok(csv.includes(phrase),phrase);
  assert.equal(csv.match(/"CUSTOMER_ALERT_EVENT","OBSERVED_AT","CURRENT_CUSTOMER_ASSIGNMENT","CUSTOMER_ALERT_EVENT:same-id"/g)?.length,1);
});
test('malformed payloads never throw and obsolete flat contract fails closed',()=>{
  for(const value of [null,[],0,'x',{}, {sources:[null]}, {data:[],count:0,definitionsVersion:'2026-10-11'}])assert.equal(isAlertReport(value,alertFilters),false);
});


test('historical ownership unavailable response cannot masquerade as an empty complete source report',()=>{
  const unavailable={success:false,status:'unavailable',reason:'HISTORICAL_OWNERSHIP_UNVERIFIED',message:'Alert history unavailable: historical ownership cannot be verified.'};
  assert.equal(isAlertReport(unavailable,alertFilters),false);
  const partial=alertFixture();partial.status='partial';partial.sources[0]={source:'LEGACY_ALERT',timeBasis:'CREATED_AT',scope:'CURRENT_VEHICLE_ACCESS',status:'unavailable',coverage:null,data:[]};
  assert.equal(isAlertReport(partial,alertFilters),false,'a partial-source union is not silently accepted under source-records-v1');
});
