import Link from "next/link";

export default function PurchaseChecks() {
  return (
    <aside className="rounded-2xl border border-blue-200 bg-blue-50 p-6" aria-labelledby="purchase-checks-title">
      <h2 id="purchase-checks-title" className="text-xl font-bold text-slate-950">Confirm these details before paying</h2>
      <p className="mt-3 leading-7 text-slate-700">Ask for a written quotation for your model, quantity, vehicle and delivery PIN code. It should confirm:</p>
      <ul className="mt-4 grid list-disc gap-3 pl-5 text-sm leading-6 text-slate-700 sm:grid-cols-2">
        <li>Hardware compatibility, available stock and expected dispatch and delivery dates</li>
        <li>Installation availability, who installs it and any installation or accessory charges</li>
        <li>Warranty duration, coverage, exclusions and how to request service</li>
        <li>Return or cancellation eligibility, process and any charges</li>
        <li>Final payable total, shipping and its tax treatment, SIM/platform term and renewal</li>
        <li>App role, account setup and the features included for your vehicle</li>
      </ul>
      <p className="mt-4 text-sm leading-6 text-slate-600">The listed package does not establish installation inclusion, delivery dates, warranty or return eligibility. Confirm these in the quotation before ordering. Read our <Link href="/terms" className="font-semibold text-blue-800 underline underline-offset-4">Terms & Conditions</Link> and <Link href="/privacy-policy" className="font-semibold text-blue-800 underline underline-offset-4">Privacy Policy</Link>.</p>
    </aside>
  );
}
