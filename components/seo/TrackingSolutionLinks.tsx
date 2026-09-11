import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getTrackingSolutions } from "@/lib/seo/trackingSolutions";

export function TrackingSolutionLinks({ location, sectors }: { location: string; sectors: readonly string[] }) {
  return (
    <section aria-label={`Tracking options for ${location}`} className="bg-slate-50 py-16">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="text-3xl font-bold text-slate-900">Choose GPS tracking for your vehicles in {location}</h2>
        <p className="mt-4 max-w-3xl leading-7 text-slate-600">Compare the workflow for your vehicle type, then share your fleet size and operating routes to confirm a suitable installation.</p>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {getTrackingSolutions(sectors).map((solution) => (
            <article key={solution.id} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6">
              <h3 className="text-xl font-bold text-slate-900"><Link href={solution.href} className="hover:text-blue-700">{solution.title}</Link></h3>
              <p className="mb-5 mt-3 flex-1 leading-7 text-slate-600">{solution.description}</p>
              <Link href={solution.href} className="inline-flex items-center gap-2 font-semibold text-blue-700" aria-label={`Explore ${solution.title.toLowerCase()}`}>Explore guide <ArrowRight size={16} aria-hidden="true" /></Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
