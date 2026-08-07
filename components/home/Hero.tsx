import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-[#071a55] via-[#1543d2] to-[#0694c8] text-white">

      {/* Background Glow */}
      <div className="absolute inset-0 overflow-hidden">

        <div className="absolute -left-32 top-20 h-96 w-96 rounded-full bg-cyan-500/20 blur-[120px]" />

        <div className="absolute right-0 top-40 h-[500px] w-[500px] rounded-full bg-blue-600/20 blur-[150px]" />

        <div className="absolute bottom-0 left-1/2 h-72 w-72 rounded-full bg-sky-400/20 blur-[100px]" />

      </div>

      <div className="relative mx-auto flex min-h-[90vh] max-w-7xl flex-col items-center px-6 py-20 lg:flex-row">

        {/* LEFT */}

        <div className="w-full lg:w-1/2">

          <span className="rounded-full bg-white/10 px-5 py-2 text-sm backdrop-blur">
            We&apos;re India&apos;s Best GPS Company
          </span>

          <h1 className="mt-8 text-6xl font-extrabold leading-tight">

            Smart GPS

            <br />

            Tracking

            <br />

            <span className="text-cyan-300">
              Solutions
            </span>

          </h1>

          <p className="mt-8 max-w-xl text-xl text-blue-100 leading-9">

            Live Vehicle Tracking, Fleet Management,
            AIS-140 GPS, Dash Cameras,
            Fuel Monitoring and Complete IoT Solutions
            for Businesses across India.

          </p>

          <div className="mt-10 flex gap-5">

            <Link
              href="/products"
              className="rounded-xl bg-white px-8 py-4 font-semibold text-blue-700 shadow-xl transition duration-300 hover:-translate-y-1 hover:scale-105"
            >
              Explore Products
            </Link>

            <Link
              href="/contact"
              className="rounded-xl border border-white px-8 py-4 font-semibold transition duration-300 hover:bg-white hover:text-blue-700 hover:-translate-y-1"
            >
              Book Demo
            </Link>

          </div>

        </div>

        {/* RIGHT */}

        <div className="relative mt-20 flex w-full justify-center lg:mt-0 lg:w-1/2">

          {/* Floating Card */}

          <div className="absolute left-0 top-10 rounded-2xl border border-white/20 bg-white/10 px-5 py-4 backdrop-blur-xl">

            <p className="text-sm text-cyan-300">
              Live Tracking
            </p>

            <h3 className="text-2xl font-bold">
              2500+
            </h3>

          </div>

          <div className="absolute bottom-10 right-0 rounded-2xl border border-white/20 bg-white/10 px-5 py-4 backdrop-blur-xl">

            <p className="text-sm text-cyan-300">
              Vehicles Online
            </p>

            <h3 className="text-2xl font-bold text-green-400">
              98%
            </h3>

          </div>

          {/* Hero Image */}

          <div className="relative h-[600px] w-[480px] rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur-xl">

            <Image
              src="/assets/hero/hero.png"
              alt="NAVII GPS"
              fill
              priority
              className="object-contain p-5"
            />

          </div>

        </div>

      </div>

    </section>
  );
}