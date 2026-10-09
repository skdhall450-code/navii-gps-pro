/* Self-contained public viewer: no libraries, third-party requests or persistent secrets. */
(() => {
  'use strict';
  // Runs synchronously in <head>, before the page is interactive. The fragment never
  // enters HTTP URLs, referrers, logs, history entries or any storage written by us.
  const takeFragment = () => {
    const candidate = window.location.hash.slice(1);
    window.history.replaceState(null, '', window.location.pathname);
    return /^nvl_[A-Za-z0-9_-]{43}$/.test(candidate) ? candidate : '';
  };
  let token = takeFragment();
  let ready = false;
  let latest = null;
  let receivedAt = 0;
  let stopped = false;
  let inFlight = null;
  let poll = null;
  let tick = null;
  let generation = 0;
  const byId = id => document.getElementById(id);
  const clearPosition = () => { latest = null; byId('location').hidden = true; ['vehicle', 'status', 'age', 'coordinates', 'speed', 'expires'].forEach(id => { byId(id).textContent = ''; }); };
  const stop = message => { ++generation; stopped = true; token = ''; inFlight?.abort(); inFlight = null; clearInterval(poll); clearInterval(tick); clearPosition(); byId('refresh').hidden = true; byId('notice').textContent = message; };
  const render = () => {
    if (!latest || stopped) return;
    const elapsed = Math.max(0, performance.now() - receivedAt);
    const serverNow = Date.parse(latest.serverTime) + elapsed;
    if (serverNow >= Date.parse(latest.expiresAt)) { stop('This tracking link has expired. Ask the sender for a new link.'); return; }
    const age = latest.gpsAgeSeconds === null ? null : Math.floor(latest.gpsAgeSeconds + elapsed / 1000);
    const current = latest.status === 'CURRENT' && age !== null && age <= 120;
    byId('vehicle').textContent = latest.vehicleLabel;
    byId('status').textContent = !latest.position ? 'No valid GPS fix' : current ? 'Current GPS fix' : 'Last-known location';
    byId('age').textContent = age === null ? 'GPS time unavailable' : `Last GPS fix: ${age} seconds ago (${new Date(latest.lastGpsAt).toLocaleString()})`;
    byId('coordinates').textContent = latest.position ? `Latitude ${latest.position.latitude.toFixed(6)} · Longitude ${latest.position.longitude.toFixed(6)}` : 'Location unavailable';
    byId('speed').textContent = current && latest.position && latest.position.speedKph !== null ? `Speed at last fix: ${latest.position.speedKph.toFixed(0)} km/h` : '';
    byId('expires').textContent = `Link expires: ${new Date(latest.expiresAt).toLocaleString()}`;
    byId('location').hidden = false;
  };
  const isValid = data => data && typeof data.vehicleLabel === 'string' && data.vehicleLabel.length <= 200 &&
    ['CURRENT', 'LAST_KNOWN', 'NO_GPS'].includes(data.status) && Number.isFinite(Date.parse(data.serverTime)) && Number.isFinite(Date.parse(data.expiresAt)) &&
    (data.status === 'NO_GPS' ? data.position === null && data.gpsAgeSeconds === null && data.lastGpsAt === null : data.position !== null && Number.isFinite(data.gpsAgeSeconds) && data.gpsAgeSeconds >= 0 && Number.isFinite(Date.parse(data.lastGpsAt))) &&
    (data.position === null || (Number.isFinite(data.position?.latitude) && Math.abs(data.position.latitude) <= 90 && Number.isFinite(data.position?.longitude) && Math.abs(data.position.longitude) <= 180 && (data.position.speedKph === null || Number.isFinite(data.position.speedKph))));
  async function refresh() {
    if (stopped || !token || inFlight || document.hidden) return;
    const requestGeneration = ++generation;
    const startedAt = performance.now();
    clearPosition();
    const controller = new AbortController();
    inFlight = controller;
    byId('refresh').disabled = true;
    const timeout = setTimeout(() => controller.abort(), 10_000);
    try {
      const endpoint = document.querySelector('meta[name="tracking-endpoint"]').content;
      const response = await fetch(endpoint, { headers: { Authorization: `Bearer ${token}` }, credentials: 'omit', cache: 'no-store', referrerPolicy: 'no-referrer', redirect: 'error', signal: controller.signal });
      if (stopped || requestGeneration !== generation || document.hidden) return;
      if (response.status === 404 || response.status === 403 || response.status === 401) { stop('This tracking link is unavailable. It may have expired or been revoked.'); return; }
      if (response.status === 429) { clearPosition(); byId('notice').textContent = 'Too many requests. Automatic refresh will retry shortly.'; return; }
      if (!response.ok) throw new Error('Unavailable');
      const body = await response.json();
      if (stopped || controller.signal.aborted || requestGeneration !== generation || document.hidden) return;
      if (!isValid(body.data)) throw new Error('Invalid response');
      latest = body.data; receivedAt = startedAt;
      byId('notice').textContent = 'Location refreshes every 15 seconds while this page is visible.';
      render();
    } catch {
      if (!stopped && requestGeneration === generation && !document.hidden) { clearPosition(); byId('notice').textContent = 'Location could not be verified. Check your connection and try again.'; }
    } finally { clearTimeout(timeout); if (inFlight === controller) { inFlight = null; byId('refresh').disabled = false; } }
  }
  const start = nextToken => {
    stop('Checking tracking link…');
    if (!nextToken) { stop('Open the original tracking link. It may be incomplete, or the secret was cleared after a reload.'); return; }
    token = nextToken;
    stopped = false;
    byId('refresh').hidden = false;
    byId('refresh').disabled = false;
    poll = setInterval(refresh, 15_000); tick = setInterval(render, 1000); void refresh();
  };
  // A second /share#secret is same-document navigation. Never leave its fragment
  // visible or allow an old vehicle's late response to replace the new session.
  window.addEventListener('hashchange', () => {
    const nextToken = takeFragment();
    if (ready) start(nextToken); else token = nextToken;
  });
  window.addEventListener('popstate', () => {
    if (ready && !window.location.hash) stop('For privacy, reopen the original tracking link.');
  });
  document.addEventListener('DOMContentLoaded', () => {
    ready = true;
    byId('refresh').addEventListener('click', refresh);
    document.addEventListener('visibilitychange', () => {
      ++generation; inFlight?.abort(); inFlight = null; clearPosition();
      if (!document.hidden && !stopped) { byId('notice').textContent = 'Rechecking link access…'; void refresh(); }
    });
    // Do not retain a location or capability in the browser back-forward cache.
    window.addEventListener('pagehide', () => stop('For privacy, reopen the original tracking link.'));
    window.addEventListener('pageshow', event => { if (event.persisted) stop('For privacy, reopen the original tracking link.'); });
    start(token);
  });
})();
