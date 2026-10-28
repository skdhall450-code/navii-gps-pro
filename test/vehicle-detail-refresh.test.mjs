import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { registerHooks } from 'node:module';
import { test } from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ts from 'typescript';

// Exercise the actual page and polling hook with deterministic React effect cells.
const root = new URL('../', import.meta.url).href;
const state = { React };
globalThis.__detailRefresh = state;
const dataUrl = text => 'data:text/javascript,' + encodeURIComponent(text);
const mocked = new Map([
  ['next/link', dataUrl(`export default p => globalThis.__detailRefresh.React.createElement('a', { href:p.href }, p.children);`)],
  ['next/navigation', dataUrl(`export const useParams=()=>({id:'A'}); export const useRouter=()=>globalThis.__detailRefresh.router;`)],
  ['@/components/auth/RoleRouteGuard', dataUrl('export default p => p.children;')],
  ['@/hooks/use-tracking-now', dataUrl('export const useTrackingNow=()=>globalThis.__detailRefresh.now;')],
]);
const hookMock = dataUrl(`
const s=globalThis.__detailRefresh;
export function useState(initial){const i=s.cursor++;if(!s.cells[i])s.cells[i]={value:typeof initial==='function'?initial():initial};return[s.cells[i].value,value=>{s.cells[i].value=typeof value==='function'?value(s.cells[i].value):value}];}
export function useRef(value){const i=s.cursor++;if(!s.cells[i])s.cells[i]={current:value};return s.cells[i];}
export function useMemo(fn,deps){const i=s.cursor++,old=s.cells[i];if(!old||deps.some((x,k)=>!Object.is(x,old.deps[k])))s.cells[i]={deps,value:fn()};return s.cells[i].value;}
export const useCallback=(fn,deps)=>useMemo(()=>fn,deps);
export function useEffect(fn,deps){const i=s.cursor++,old=s.cells[i];if(!old||!deps||deps.some((x,k)=>!Object.is(x,old.deps[k]))){s.effects.push(()=>{old?.cleanup?.();s.cells[i]={deps,cleanup:fn()};});}}
`);
registerHooks({
  resolve(specifier, context, next) {
    const local=context.parentURL?.startsWith(root)&&!context.parentURL.includes('/node_modules/');
    if(specifier==='react'&&local)return{shortCircuit:true,url:hookMock};
    if(mocked.has(specifier))return{shortCircuit:true,url:mocked.get(specifier)};
    if(specifier.startsWith('@/')){
      const base=new URL('../'+specifier.slice(2),import.meta.url);
      const url=['','.ts','.tsx'].map(ext=>new URL(base.href+ext)).find(u=>/\.tsx?$/.test(u.href)&&existsSync(u));
      if(url)return{shortCircuit:true,url:url.href};
    }
    return next(specifier,context);
  },
  load(url,context,next){
    if(url.startsWith(root)&&!url.includes('/node_modules/')&&/\.tsx?$/.test(url))return{format:'module',shortCircuit:true,source:ts.transpileModule(readFileSync(new URL(url),'utf8'),{compilerOptions:{jsx:ts.JsxEmit.ReactJSX,module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText};
    return next(url,context);
  },
});
const { default: Detail } = await import('../app/dashboard/vehicles/[id]/page.tsx');
const now=Date.parse('2026-10-28T00:00:00Z');
const vehicle=speed=>({id:'A',vehicleNo:'QA-A',name:'Synthetic',latitude:30,longitude:76,speed,ignition:true,battery:12,lastUpdate:new Date(now).toISOString(),device:{isActive:true,lastSeenAt:new Date(now).toISOString()}});
const flush=async()=>{for(let i=0;i<20;i++)await Promise.resolve();};
function harness(t){
  t.mock.timers.enable({apis:['setTimeout','setInterval']});
  Object.assign(state,{cursor:0,cells:[],effects:[],now,router:{replace(){}}});
  const originalFetch=globalThis.fetch;
  globalThis.window=Object.assign(new EventTarget(),{setTimeout,clearTimeout,setInterval,clearInterval});
  globalThis.document=Object.assign(new EventTarget(),{hidden:false});
  globalThis.localStorage={getItem:()=> 'synthetic',removeItem(){}};
  const requests=[];
  globalThis.fetch=(url,options)=>new Promise(resolve=>requests.push({url,signal:options.signal,reply:(data,status=200)=>resolve(new Response(JSON.stringify({success:status===200,data}),{status}))}));
  const render=()=>{state.cursor=0;state.effects=[];const html=renderToStaticMarkup(React.createElement(Detail));for(const effect of state.effects)effect();return html;};
  const cleanup=()=>{for(const cell of state.cells)cell?.cleanup?.();};
  t.after(async()=>{cleanup();await flush();globalThis.fetch=originalFetch;delete globalThis.window;delete globalThis.document;delete globalThis.localStorage;});
  render();
  return{requests,render,cleanup};
}

test('detail slow request is bounded, and a retired response cannot replace recovered readings',async t=>{
  const h=harness(t);
  assert.equal(h.requests.length,1);
  t.mock.timers.tick(10000);
  assert.equal(h.requests.length,1,'slow vehicle requests must not overlap');
  t.mock.timers.tick(5000);await flush();
  assert.equal(h.requests[0].signal.aborted,true);
  window.dispatchEvent(new Event('online'));
  assert.equal(h.requests.length,2);
  h.requests[1].reply([vehicle(47)]);await flush();
  assert.match(h.render(),/47\.0 km\/h/);
  h.requests[0].reply([vehicle(35)]);await flush();
  assert.doesNotMatch(h.render(),/35\.0 km\/h/);
});

test('unmount retires pending vehicle work before it can start a history request',async t=>{
  const h=harness(t);h.cleanup();
  h.requests[0].reply([vehicle(35)]);await flush();
  assert.equal(h.requests.length,1,'unmounted page must not fetch history');
  assert.equal(h.requests[0].signal.aborted,true);
});

test('history timeout stays visible while current detail refreshes and revoked access clears cache',async t=>{
  const h=harness(t);
  h.requests[0].reply([vehicle(35)]);await flush();h.render();
  const history=h.requests.find(r=>r.url.includes('/history/'));assert.ok(history);
  t.mock.timers.tick(5000);
  const next=h.requests.filter(r=>r.url.endsWith('/vehicles')).at(-1);
  next.reply([vehicle(47)]);await flush();assert.match(h.render(),/47\.0 km\/h/);
  t.mock.timers.tick(10001);await flush();
  assert.match(h.render(),/History Error: Request timed out/);
  const pending=h.requests.filter(r=>r.url.endsWith('/vehicles')).at(-1);
  pending.reply([vehicle(51)]);await flush();
  assert.match(h.render(),/History Error: Request timed out/);
  t.mock.timers.tick(5000);
  h.requests.filter(r=>r.url.endsWith('/vehicles')).at(-1).reply([],403);await flush();
  const html=h.render();assert.match(html,/Vehicle Unavailable/);assert.doesNotMatch(html,/QA-A|51\.0 km\/h/);
  history.reply([]);await flush();assert.match(h.render(),/Vehicle Unavailable/);
});

test('malformed success responses keep a last known snapshot without manufacturing fresh GPS',async t=>{
  const h=harness(t);
  h.requests[0].reply([vehicle(35)]);await flush();h.render();
  t.mock.timers.tick(5000);h.requests.filter(r=>r.url.endsWith('/vehicles')).at(-1).reply(null);await flush();
  state.now=now+121000;
  const html=h.render();assert.match(html,/invalid response/);assert.match(html,/Unavailable/);assert.doesNotMatch(html,/35\.0 km\/h/);
});
