import Link from 'next/link';
import { customerReadiness, type ReadinessEvidence } from '@/lib/customer-readiness';
import type { SetupDevice } from '@/lib/device-setup';

export default function CustomerReadiness({ device, evidence, now }: { device: SetupDevice; evidence: ReadinessEvidence; now: number }) {
  const steps = customerReadiness(device, evidence, now);
  const manager = evidence.role === 'ADMIN' || evidence.role === 'SUPER_ADMIN';
  return <details className="min-w-64 max-w-sm rounded-xl border border-white/10 p-3">
    <summary className="cursor-pointer text-sm font-medium text-sky-300">Customer readiness checklist</summary>
    <ol className="mt-3 space-y-3 text-xs">{steps.map(step => <li key={step.label}>
      <p className={step.state === 'pass' ? 'text-emerald-300' : step.state === 'pending' ? 'text-amber-300' : 'text-slate-300'}>{step.label}: {step.state === 'pass' ? 'Confirmed' : step.state === 'pending' ? 'Needs attention' : 'Not confirmed'}</p>
      <p className="mt-1 text-slate-400">{step.detail}</p>
    </li>)}</ol>
    <p className="mt-3 text-xs leading-5 text-slate-400">A device can be connected before it is ready for a customer. Customer login visibility must be checked with that customer account.</p>
    <div className="mt-3 flex flex-wrap gap-3 text-xs text-sky-300">
      <Link href="/dashboard/assignments">Assignments</Link>
      {manager && <Link href="/dashboard/billing/subscriptions">Review subscriptions</Link>}
    </div>
  </details>;
}
