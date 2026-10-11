"use client";

import { Mail, ShieldCheck } from "lucide-react";
import type { DeliveryContact } from "@/lib/customer-handover";
import { hasConfirmedDelivery } from "@/lib/customer-handover";

export default function DeliveryEmailFields({ email, confirmed, savedContact, onEmailChange, onConfirmedChange }: {
  email: string;
  confirmed: boolean;
  savedContact?: DeliveryContact;
  onEmailChange: (value: string) => void;
  onConfirmedChange: (value: boolean) => void;
}) {
  const unchanged = email.trim().toLowerCase() === savedContact?.deliveryEmail?.trim().toLowerCase();
  return (
    <div className="space-y-3 rounded-xl border border-sky-500/20 bg-sky-500/[0.04] p-4">
      <div className="flex items-center gap-2 text-sm font-semibold text-sky-300"><Mail className="h-4 w-4" /> Customer handover</div>
      <div>
        <label htmlFor="customer-delivery-email" className="mb-2 block text-xs text-slate-300">Delivery email (optional)</label>
        <input id="customer-delivery-email" name="deliveryEmail" type="email" autoComplete="off" maxLength={254} value={email}
          onChange={(event) => { onEmailChange(event.target.value); onConfirmedChange(false); }}
          placeholder="Customer's reachable email address" aria-describedby="delivery-email-help"
          className="w-full rounded-xl border border-white/10 bg-[#07101f] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-sky-500/60" />
        <p id="delivery-email-help" className="mt-2 text-xs leading-relaxed text-slate-400">Enter this separately from the login email. If left blank, handover email is blocked; the login email is never used as a fallback.</p>
      </div>
      <label className="flex cursor-pointer items-start gap-3 text-xs leading-relaxed text-slate-300">
        <input type="checkbox" checked={confirmed} disabled={!email.trim()} onChange={(event) => onConfirmedChange(event.target.checked)} className="mt-0.5 h-4 w-4 shrink-0 accent-sky-500 disabled:opacity-40" />
        <span>I confirm this is the customer&apos;s intended, reachable address for their welcome email and handover files.</span>
      </label>
      {unchanged && confirmed && hasConfirmedDelivery(savedContact || {}) && (
        <p className="flex items-start gap-2 text-xs leading-relaxed text-emerald-300"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" /><span>Confirmed by operator on {new Date(savedContact!.deliveryEmailConfirmedAt!).toLocaleString()}. Changing the address requires confirmation again.</span></p>
      )}
      <p className="text-[11px] leading-relaxed text-slate-500">Confirmation records the signed-in operator and time. It does not verify mailbox ownership. Saving this contact does not send an email.</p>
    </div>
  );
}
