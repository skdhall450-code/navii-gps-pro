export const alertFilters = {vehicleId:'v1',fromLocal:'2026-10-11T00:00',toLocal:'2026-10-12T00:00',timezone:'UTC',preset:'CUSTOM',kind:'ALERTS'};
export function alertFixture() {
  const coverage={pointLimit:500,returnedCount:1,truncated:false,dataComplete:true,complete:true};
  const row={sourceId:'same-id',type:'POWER_CUT',message:'Synthetic stored record',reportTime:'2026-10-11T01:00:00.000Z',storedAt:'2026-10-11T01:00:00.000Z',resolvedAt:null};
  return {success:true,status:'available',definitionsVersion:'2026-10-11',alertContractVersion:'source-records-v1',vehicle:{id:'v1',vehicleNo:'QA-ONLY',name:null},period:{from:'2026-10-11T00:00:00.000Z',to:'2026-10-12T00:00:00.000Z',timezone:'UTC',endExclusive:true,defaulted:false},sources:[
    {source:'LEGACY_ALERT',timeBasis:'CREATED_AT',scope:'CURRENT_VEHICLE_ACCESS',coverage:{...coverage},data:[{...row,id:'LEGACY_ALERT:same-id',resolutionStatus:'OPEN'}]},
    {source:'CUSTOMER_ALERT_EVENT',timeBasis:'OBSERVED_AT',scope:'CURRENT_CUSTOMER_ASSIGNMENT',coverage:{...coverage},data:[{...row,id:'CUSTOMER_ALERT_EVENT:same-id',storedAt:'2026-10-12T03:00:00.000Z',resolutionStatus:'UNAVAILABLE'}]},
  ]};
}
