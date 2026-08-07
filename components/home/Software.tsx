export default function Software() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">

        <div className="grid items-center gap-12 lg:grid-cols-2">

          {/* Left Side */}
          <div>

            <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
              GPS Tracking Platform
            </span>

            <h2 className="mt-6 text-5xl font-bold text-slate-900">
              Powerful Fleet
              <br />
              Management Software
            </h2>

            <p className="mt-8 text-lg leading-8 text-slate-600">
              Manage your complete fleet from one dashboard with
              Live Tracking, Geo Fence, Fuel Monitoring,
              Driver Behaviour Reports, Alerts and Analytics.
            </p>

            <div className="mt-10 grid gap-4">

              <div className="rounded-xl border p-4">
                ✅ Live Vehicle Tracking
              </div>

              <div className="rounded-xl border p-4">
                ✅ Route Playback
              </div>

              <div className="rounded-xl border p-4">
                ✅ Geo Fence Alerts
              </div>

              <div className="rounded-xl border p-4">
                ✅ Fuel Monitoring
              </div>

              <div className="rounded-xl border p-4">
                ✅ Reports & Analytics
              </div>

            </div>

          </div>

          {/* Right Side */}

          <div className="flex justify-center">

            <div className="flex h-[500px] w-full max-w-xl items-center justify-center rounded-3xl border-2 border-dashed border-blue-300 bg-slate-100">

              <div className="text-center">

                <div className="text-7xl">
                  💻
                </div>

                <h3 className="mt-6 text-3xl font-bold text-blue-700">
                  Software Dashboard
                </h3>

                <p className="mt-3 text-slate-500">
                  Dashboard Screenshot will be added here
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}