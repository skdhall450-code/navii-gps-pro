import assert from 'node:assert/strict';
import test from 'node:test';
import { createHmac } from 'node:crypto';
import { quoteShopItem, verifyRazorpaySignature, confirmCheckoutPayment, processShopWebhook } from '../lib/shop-checkout.ts';
const secret = 'test-fixture-only';
const sign = text => createHmac('sha256', secret).update(text).digest('hex');
const pending = () => ({id:'local1', razorpayOrderId:'order_test1', amount:252500, currency:'INR', status:'pending'});
const payment = () => ({id:'pay_test1', order_id:'order_test1', amount:252500, currency:'INR', status:'captured', captured:true});
function fixture() {
  const order = pending(); let writes = 0;
  return { order, get writes() { return writes; },
    async findByRazorpayOrderId(id) { return id === order.razorpayOrderId ? {...order} : null; },
    async recordCapturedPayment(expected, id) {
      assert.equal(expected.amount, order.amount);
      if(order.status === 'paid') { assert.equal(order.paymentId, id); return 'duplicate'; }
      order.status = 'paid'; order.paymentId = id; writes++; return 'paid';
    }
  };
}
const callback = () => ({paymentId:'pay_test1', signature:sign('order_test1|pay_test1')});
const eventBody = (p = payment(), event = 'payment.captured') => Buffer.from(JSON.stringify({event,payload:{payment:{entity:p}}}));

test('server quote preserves all approved prices, validity and charges', () => {
  for(const [offerId,variantId,amount] of [
    ['g17','device',252500],['bt50','device',252500],['gx03','device',287900],['gs900','device',287900],
    ['s15','device',464900],['obd','device',346900],['non-ai-dashcam','device',619500],['ai-dashcam','device',855500],
    ['ais140','one-year',700900],['ais140','two-years',877900],
  ]) assert.equal(quoteShopItem({offerId,variantId}).amount, amount);
});
test('rejects client prices, quantities, unknown products and malformed selections', () => {
  for(const input of [null,[],{}, {offerId:'g17',variantId:'fake'}, {offerId:'g17',variantId:'device',amount:1},
    {offerId:'g17',variantId:'device',quantity:2}, {offerId:'__proto__',variantId:'device'}]) assert.throws(()=>quoteShopItem(input));
});
test('signature comparison rejects missing secrets, malformed hex and altered bytes', () => {
  assert.equal(verifyRazorpaySignature('body',sign('body'),secret),true);
  for(const signature of ['',null,'z'.repeat(64),'a'.repeat(63),sign('other')]) assert.equal(verifyRazorpaySignature('body',signature,secret),false);
  assert.equal(verifyRazorpaySignature('body',sign('body'),''),false);
});
test('callback verifies signature before API lookup and requires captured matching payment', async () => {
  const store=fixture(); let fetched=false;
  await assert.rejects(confirmCheckoutPayment(store.order,{...callback(),signature:sign('other')},secret,async()=>{fetched=true;return payment();},store));
  assert.equal(fetched,false);
  for(const change of [{id:'pay_other'},{order_id:'order_other'},{amount:1},{currency:'USD'},{status:'authorized'},{captured:false}]) {
    await assert.rejects(confirmCheckoutPayment(store.order,callback(),secret,async()=>({...payment(),...change}),store));
  }
  assert.equal(store.writes,0);
  assert.equal(await confirmCheckoutPayment(store.order,callback(),secret,async()=>payment(),store),'paid');
});
test('callback and duplicate webhooks cause one durable transition', async () => {
  const store=fixture(), body=eventBody();
  const results=await Promise.all([processShopWebhook(body,sign(body),secret,store),processShopWebhook(body,sign(body),secret,store)]);
  assert.deepEqual(results.sort(),['duplicate','paid']);
  assert.equal(await confirmCheckoutPayment(store.order,callback(),secret,async()=>payment(),store),'duplicate');
  assert.equal(store.writes,1);
});
test('forged, mismatched, oversized and malformed webhook bodies cannot mark paid', async () => {
  const store=fixture();
  await assert.rejects(processShopWebhook(eventBody(),sign('other'),secret,store));
  for(const body of [eventBody({...payment(),amount:1}),eventBody({...payment(),currency:'USD'}),Buffer.from('{'),Buffer.alloc(65537)]) {
    await assert.rejects(processShopWebhook(body,sign(body),secret,store));
  }
  assert.equal(store.writes,0);
});
test('failure and authorization events never downgrade paid; unrelated payments ignored', async () => {
  const store=fixture();
  let body=eventBody(payment(),'order.paid');
  await processShopWebhook(body,sign(body),secret,store);
  for(const event of ['payment.failed','payment.authorized']) {
    body=eventBody(payment(),event); assert.equal(await processShopWebhook(body,sign(body),secret,store),'ignored');
  }
  body=eventBody({...payment(),order_id:'order_unrelated'});
  assert.equal(await processShopWebhook(body,sign(body),secret,store),'ignored');
  assert.equal(store.order.status,'paid'); assert.equal(store.writes,1);
});
test('storage and API failures propagate without success acknowledgement', async () => {
  const store=fixture(), body=eventBody();
  await assert.rejects(confirmCheckoutPayment(store.order,callback(),secret,async()=>{throw Error('API unavailable');},store));
  store.recordCapturedPayment=async()=>{throw Error('DB unavailable');};
  await assert.rejects(processShopWebhook(body,sign(body),secret,store));
  assert.equal(store.writes,0);
});
