# H20P camera panel — offline preview

Integrated into the existing authenticated vehicle detail page, after vehicle lookup succeeds. Build with `NEXT_PUBLIC_H20P_PREVIEW=true` to include the development preview. Omitted or any other value keeps the section hidden. Do not enable on production yet.

Front/Cabin selection, explicit demo mode, local MP4/WebM playback (maximum 100 MB), controls and unsupported-format feedback are implemented. No media file is bundled. Local sample files stay in the browser through blob URLs, are not vehicle recordings, and are released on replacement, camera change, close or unmount. No autoplay or camera/microphone access. Samples are never uploaded. Existing vehicle ownership APIs and guards are reused; the UI is not a security boundary for future streaming.

Live video, SD playback/search, download, device commands, ADAS/DMS event feeds and actual H20P validation are NOT implemented. The backend foundation is tracked in navii-gps-backend PR #50. Future integration must enforce current permissions and expiry on media access and immutable historical ownership for recordings.

Validation: `NEXT_PUBLIC_H20P_PREVIEW=true npm run build` then `node test/browser/h20p-camera-panel.mjs`. The browser test intercepts all backend traffic with synthetic fixtures, creates a tiny WebM locally, verifies sample playback, disabled live control, rejection, channel reset, URL cleanup, mobile layout and removal on revoked vehicle access.
