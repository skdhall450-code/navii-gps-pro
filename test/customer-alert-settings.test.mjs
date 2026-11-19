import test from 'node:test';
import assert from 'node:assert/strict';
import { blankCustomerSetting, blankCustomerCircle, parseCustomerRecipients, validateCustomerSetting, validateCustomerCircle } from '../lib/customer-alert-settings.ts';
test('customer preferences default to no events or email request',()=>{const input=blankCustomerSetting();assert.equal(input.emailRequested,false);assert.equal(input.overspeedEnabled,false);assert.equal(input.revision,0);assert.equal(validateCustomerSetting(input),null);});
test('recipient normalization and boundaries',()=>{assert.deepEqual(parseCustomerRecipients(' A@EXAMPLE.COM; a@example.com\nb@example.com'),['a@example.com','b@example.com']);const input=blankCustomerSetting();assert.ok(validateCustomerSetting({...input,emailRequested:true}));assert.ok(validateCustomerSetting({...input,emailRecipients:['bad']}));assert.ok(validateCustomerSetting({...input,emailRecipients:Array.from({length:6},(_,n)=>`${n}@example.com`)}));assert.equal(validateCustomerSetting({...input,emailRequested:true,emailRecipients:['a@example.com']}),null);});
test('speed and cooldown validation',()=>{for(const speedLimitKph of [0,251,NaN,1.5])assert.ok(validateCustomerSetting({...blankCustomerSetting(),speedLimitKph}));for(const cooldownMinutes of [0,1441,NaN,1.5])assert.ok(validateCustomerSetting({...blankCustomerSetting(),cooldownMinutes}));});
test('circle radius, coordinate, and name validation',()=>{const valid={...blankCustomerCircle(),name:'Home'};assert.equal(validateCustomerCircle(valid),null);for(const radius of [0,49,100001,NaN])assert.ok(validateCustomerCircle({...valid,radius}));assert.ok(validateCustomerCircle({...valid,latitude:91}));assert.ok(validateCustomerCircle({...valid,longitude:-181}));assert.ok(validateCustomerCircle({...valid,name:' '}));assert.ok(validateCustomerCircle({...valid,name:'x'.repeat(81)}));});

test('uncertain create stays blocked on successful reads before commit; UUID match resolves it',async()=>{const {isCustomerWriteVerified}=await import('../lib/customer-alert-settings.ts');const pending={path:'/api/gps/customer-geofences',method:'POST',vehicleId:'v',beforeIds:[],payload:{vehicleId:'v',name:'Home',latitude:1,longitude:2,radius:500,isActive:true,alertOnEntry:true,alertOnExit:true,clientRequestId:'operation-1'}};assert.equal(isCustomerWriteVerified(pending,[],[]),false);const row={...pending.payload,id:'circle',revision:1};assert.equal(isCustomerWriteVerified(pending,[],[{...row,clientRequestId:'another-operation'}]),false);assert.equal(isCustomerWriteVerified(pending,[],[row]),true);});
test('settings verification needs matching payload and newer revision',async()=>{const {isCustomerWriteVerified}=await import('../lib/customer-alert-settings.ts');const payload={...blankCustomerSetting(),revision:2,speedLimitKph:65};const pending={path:'/settings/v',method:'PUT',vehicleId:'v',beforeIds:[],payload};assert.equal(isCustomerWriteVerified(pending,[{...payload,vehicleId:'v'}],[]),false);assert.equal(isCustomerWriteVerified(pending,[{...payload,vehicleId:'v',revision:3}],[]),true);assert.equal(isCustomerWriteVerified(pending,[{...payload,vehicleId:'v',revision:3,speedLimitKph:80}],[]),false);});
test('delete absence requires complete, still-eligible vehicle scope',async()=>{const {isCustomerWriteVerified}=await import('../lib/customer-alert-settings.ts');const pending={path:'/circles/circle',method:'DELETE',vehicleId:'v',beforeIds:['circle'],payload:{revision:1}};assert.equal(isCustomerWriteVerified(pending,[],[]),false);assert.equal(isCustomerWriteVerified(pending,[],[],{complete:false,eligibleVehicleIds:['v']}),false);assert.equal(isCustomerWriteVerified(pending,[],[],{complete:true,eligibleVehicleIds:[]}),false);assert.equal(isCustomerWriteVerified(pending,[],[],{complete:true,eligibleVehicleIds:['v']}),true);});

test('email syntax matches backend-supported domains before a save', async () => {
 const { isValidCustomerRecipient } = await import('../lib/customer-alert-settings.ts');
 for (const email of ['a@example.com', 'User.Name+tag@sub.example.co.in', "o'neil@example.com", ' A@EXAMPLE.COM ']) {
  assert.equal(isValidCustomerRecipient(email), true, email);
 }
 for (const email of ['a@-example.com', 'a@example-.com', 'a@exam_ple.com', 'a@例子.com', 'é@example.com', 'a@localhost', 'a@example..com', 'a@@example.com', 'a@example.com;z@example.com']) {
  assert.equal(isValidCustomerRecipient(email), false, email);
  assert.ok(validateCustomerSetting({...blankCustomerSetting(), emailRecipients: [email]}), email);
 }
 assert.equal(isValidCustomerRecipient(`${'a'.repeat(242)}@example.com`), true);
 assert.equal(isValidCustomerRecipient(`${'a'.repeat(243)}@example.com`), false);
});

test('truncation considers both settings and geofence lists; completeness is explicit', async () => {
 const { customerAlertListsTruncated, customerAlertListsComplete } = await import('../lib/customer-alert-settings.ts');
 for (const left of [true, false, undefined]) for (const right of [true, false, undefined]) {
  assert.equal(customerAlertListsTruncated({truncated:left}, {truncated:right}), left === true || right === true);
  assert.equal(customerAlertListsComplete({truncated:left}, {truncated:right}), left === false && right === false);
 }
});

test('geofence-only truncation cannot verify uncertain delete by absence', async () => {
 const { isCustomerWriteVerified, customerAlertListsComplete } = await import('../lib/customer-alert-settings.ts');
 const pending={path:'/circles/circle',method:'DELETE',vehicleId:'v',beforeIds:['circle'],payload:{revision:1}};
 assert.equal(isCustomerWriteVerified(pending, [], [], {complete:customerAlertListsComplete({truncated:false}, {truncated:true}), eligibleVehicleIds:['v']}), false);
});
