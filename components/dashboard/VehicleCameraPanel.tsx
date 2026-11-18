"use client";

import { useEffect, useRef, useState } from "react";
import { Camera, ShieldCheck, VideoOff } from "lucide-react";

type Channel = "front" | "cabin";
type Sample = { url: string; name: string };

/** Offline UI preview only: never creates a device session or uploads footage. */
export default function VehicleCameraPanel({ vehicleNo }: { vehicleNo: string }) {
  const [channel, setChannel] = useState<Channel>("front");
  const [demo, setDemo] = useState(false);
  const [sample, setSample] = useState<Sample | null>(null);
  const [error, setError] = useState("");
  const activeUrl = useRef<string | null>(null);
  const fileInput = useRef<HTMLInputElement | null>(null);

  function clearSample() {
    if (activeUrl.current) URL.revokeObjectURL(activeUrl.current);
    activeUrl.current = null;
    if (fileInput.current) fileInput.current.value = "";
    setSample(null);
    setError("");
  }

  useEffect(() => () => {
    if (activeUrl.current) URL.revokeObjectURL(activeUrl.current);
  }, []);

  return (
    <section aria-label="Vehicle camera preview" className="mb-6 rounded-2xl border border-sky-500/30 bg-[#0a1426] p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold tracking-widest text-sky-300">NAVII VIDEO • DEVELOPMENT PREVIEW</p>
          <h2 className="mt-2 flex items-center gap-2 text-2xl font-bold"><Camera aria-hidden className="h-6 w-6" /> Vehicle cameras</h2>
          <p className="mt-2 text-sm text-slate-300">{vehicleNo} · Proposed H20P front and cabin views</p>
        </div>
        <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-2 text-sm text-amber-200">Hardware unverified</span>
      </div>
      <p className="mt-4 text-sm leading-6 text-slate-300">No camera is connected. This preview does not confirm an installed dashcam or show vehicle footage. Live video and device recordings remain unavailable until integration and hardware testing are complete.</p>

      <div className="my-5 flex flex-wrap gap-3" aria-label="Camera selection">
        {(["front", "cabin"] as const).map(value => (
          <button key={value} type="button" aria-pressed={channel === value}
            onClick={() => { clearSample(); setChannel(value); setDemo(false); }}
            className={`rounded-xl border px-5 py-3 text-base font-semibold ${channel === value ? "border-sky-400 bg-sky-500/20 text-sky-200" : "border-white/15 text-slate-300"}`}>
            {value === "front" ? "Front camera" : "Cabin camera"}
          </button>
        ))}
      </div>

      <div className="relative overflow-hidden rounded-xl border border-white/10 bg-[#050b16]">
        <div className="flex flex-wrap justify-between gap-2 border-b border-white/10 px-4 py-3 text-sm">
          <span>{channel === "front" ? "Front-road view" : "Cabin / driver view"}</span>
          <strong className="text-amber-200">{sample ? "LOCAL SAMPLE • NOT LIVE" : demo ? "SIMULATED DEMO • NOT LIVE" : "NOT CONNECTED"}</strong>
        </div>
        {sample ? (
          <video key={sample.url} aria-label="Local sample video" controls playsInline preload="metadata" className="aspect-video w-full bg-black"
            src={sample.url} onError={() => setError("This sample cannot be played in this browser. Try a supported MP4 or WebM file.")} />
        ) : (
          <div className="flex aspect-video min-h-48 flex-col items-center justify-center gap-4 px-5 text-center">
            {demo ? <Camera aria-hidden className="h-16 w-16 text-sky-400" /> : <VideoOff aria-hidden className="h-12 w-12 text-slate-500" />}
            <p className="text-xl font-semibold">{demo ? `${channel === "front" ? "Front" : "Cabin"} demo layout` : "Waiting for camera integration"}</p>
            <p className="max-w-lg text-sm text-slate-300">{demo ? "Simulated preview only. Load a local sample below to test the video player; no sample is supplied or fetched automatically." : "Live viewing will require an authorised video session and a verified device."}</p>
          </div>
        )}
      </div>
      <div role="status" aria-live="polite" className="mt-3 text-sm text-amber-200">{error || (sample ? `Local sample: ${sample.name}. This file is not associated with the vehicle.` : "No vehicle video or recordings have been requested.")}</div>
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button type="button" onClick={() => { clearSample(); setDemo(!demo); }} className="rounded-xl bg-sky-500 px-4 py-3 font-semibold text-black hover:bg-sky-400">{demo ? "Close demo" : "Open demo"}</button>
        <button type="button" disabled className="rounded-xl border border-white/15 px-4 py-3 text-slate-500">Start live video — unavailable</button>
      </div>
      {demo && (
        <div className="mt-4 rounded-xl border border-white/10 p-4">
          <label htmlFor="camera-local-sample" className="block text-sm font-semibold">Local sample video (optional, maximum 100 MB)</label>
          <input ref={fileInput} id="camera-local-sample" key={channel} type="file" accept="video/mp4,video/webm" className="mt-3 block w-full max-w-full text-sm"
            onChange={event => {
              const file = event.target.files?.[0];
              clearSample();
              if (!file) return;
              if (!["video/mp4", "video/webm"].includes(file.type) || file.size > 100 * 1024 * 1024) {
                setError("Choose an MP4 or WebM file no larger than 100 MB.");
                event.target.value = "";
                return;
              }
              const url = URL.createObjectURL(file);
              activeUrl.current = url;
              setSample({ url, name: file.name });
            }} />
          <p className="mt-3 text-sm text-slate-400">Played only in this browser. No upload, cloud storage or automatic playback. Switching cameras clears the sample.</p>
          {sample && <button type="button" onClick={clearSample} className="mt-3 rounded-lg border border-white/20 px-3 py-2">Remove sample</button>}
        </div>
      )}
      <div className="mt-5 grid gap-3 md:grid-cols-2">
        <div className="rounded-xl border border-white/10 p-4"><h3 className="font-semibold">Device recordings</h3><p className="mt-2 text-sm text-slate-300">SD-card search, date/time playback and downloads are not connected. Local sample controls do not access vehicle history.</p></div>
        <div className="rounded-xl border border-white/10 p-4"><h3 className="flex items-center gap-2 font-semibold"><ShieldCheck aria-hidden className="h-4 w-4" /> Access & safety</h3><p className="mt-2 text-sm text-slate-300">Production streaming requires server-side assigned-vehicle checks, expiring sessions and revocation. ADAS/DMS events remain unverified.</p></div>
      </div>
    </section>
  );
}
