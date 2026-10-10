import Link from "next/link";
import type { PunjabHaryanaCoverage as Coverage } from "@/lib/seo/punjabHaryanaCoverage";
import { toPunjabCitySlug } from "@/lib/seo/punjabCities";
import { toHaryanaCitySlug } from "@/lib/seo/haryanaCities";

export function PunjabHaryanaCoverage({ coverage }: { coverage: Coverage }) {
  const toSlug = coverage.slug === "punjab" ? toPunjabCitySlug : toHaryanaCitySlug;
  return <>
    <section className="bg-[#06142E] py-20 text-white">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="text-3xl font-bold md:text-4xl">GPS tracking for {coverage.name} vehicle operations</h2>
        <p className="mt-5 max-w-4xl leading-8 text-slate-300">{coverage.intro}</p>
        <div className="mt-9 grid gap-6 lg:grid-cols-3">
          {coverage.cases.map(item => <article key={item.title} className="rounded-2xl border border-cyan-300/20 bg-white/5 p-6">
            <h3 className="text-xl font-bold text-cyan-200">{item.title}</h3>
            <p className="mt-4 leading-7 text-slate-300">{item.text}</p>
          </article>)}
        </div>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link href="/products/g17-gps-tracker" className="rounded-xl bg-cyan-500 px-5 py-3 font-semibold text-slate-950">G17 vehicle GPS tracker</Link>
          <Link href="/software" className="rounded-xl border border-cyan-300/40 px-5 py-3 text-cyan-100">Explore fleet tracking software</Link>
        </div>
      </div>
    </section>
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="text-3xl font-bold text-slate-900">Find a GPS tracker guide in your {coverage.name} city</h2>
        <p className="mt-4 max-w-3xl leading-7 text-slate-600">Open a district or town guide to review local routes and vehicle requirements. Share the actual installation location when requesting a quotation.</p>
        <div className="mt-9 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {coverage.districts.map(district => {
            const districtPath = `/gps-tracker/${coverage.slug}/${district.slug}`;
            return <article key={district.slug} className="rounded-2xl border border-slate-200 p-6">
              <h3 className="text-lg font-bold text-blue-800"><Link href={districtPath}>{district.name} district</Link></h3>
              <ul className="mt-4 space-y-3">{district.cities.map(city => {
                const slug = toSlug(city);
                const path = slug === district.slug ? districtPath : `${districtPath}/${slug}`;
                return <li key={city}><Link href={path} className="text-slate-700 underline decoration-cyan-300 underline-offset-4 hover:text-blue-700">GPS tracker in {city}</Link></li>;
              })}</ul>
            </article>;
          })}
        </div>
      </div>
    </section>
    <section className="bg-slate-50 py-20">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-2">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Before booking GPS installation in {coverage.name}</h2>
          <ol className="mt-6 list-decimal space-y-4 pl-5 leading-7 text-slate-700">
            <li>Share the vehicle type, power supply, daily routes and fleet size so the team can assess compatible hardware.</li>
            <li>Choose the location, trip history, geofence and supported alerts your dispatchers need. Confirm any relay or accessory requirement for the selected device.</li>
            <li>Review the device, SIM, platform, installation and renewal charges in the quotation before booking.</li>
            <li>After fitting, test location reporting, ignition events where supported, and authorized user access on an actual journey.</li>
          </ol>
        </div>
        <aside className="rounded-3xl bg-[#06142E] p-8 text-white">
          <h2 className="text-2xl font-bold">Discuss your {coverage.name} fleet with NAVII GPS</h2>
          <p className="mt-5 leading-7 text-slate-300">Contact our Dera Bassi office for product and fleet enquiries. Tell us where the vehicle operates so installation arrangements and network requirements can be discussed for that location.</p>
          <p className="mt-5 leading-7 text-slate-300">NAVII GPS INDIA (OPC) PRIVATE LIMITED<br />SCO 46, 2nd Floor, GBP Business Square,<br />Barwala Road, Dera Bassi, Punjab – 140507</p>
          <a href="tel:+918899729705" className="mt-6 inline-block rounded-xl bg-cyan-500 px-5 py-3 font-semibold text-slate-950">Call +91 88997 29705</a>
          <div className="mt-5 flex flex-wrap gap-5 text-cyan-200"><Link href="/contact" className="underline">Request a quotation</Link><Link href={`/gps-tracker/${coverage.otherSlug}`} className="underline">GPS tracking in {coverage.otherName}</Link><Link href="/gps-tracker/chandigarh" className="underline">Chandigarh GPS tracker guide</Link></div>
        </aside>
      </div>
    </section>
    <section className="bg-white py-20">
      <div className="mx-auto max-w-5xl px-6">
        <h2 className="text-3xl font-bold text-slate-900">{coverage.name} GPS tracker questions</h2>
        <div className="mt-8 space-y-5">{coverage.faqs.map(faq => <article key={faq.question} className="rounded-2xl border border-slate-200 p-6">
          <h3 className="text-lg font-bold text-slate-900">{faq.question}</h3><p className="mt-3 leading-7 text-slate-600">{faq.answer}</p>
        </article>)}</div>
      </div>
    </section>
  </>;
}
