"use client";

import { useMemo, useRef, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  FileSpreadsheet,
  FileText,
  Filter,
  Mail,
  Paperclip,
  Search,
  ShieldCheck,
  Upload,
  Users,
} from "lucide-react";
import RoleRouteGuard from "@/components/auth/RoleRouteGuard";

type DealerContact = {
  id: string;
  name: string;
  email: string;
  district: string;
  state: string;
  company?: string;
};

type CampaignDraft = {
  id: string;
  subject: string;
  district: string;
  recipients: number;
  createdAt: string;
  status: "DRAFT" | "APPROVED";
};

function parseCsvLine(line: string): string[] {
  const cells: string[] = [];
  let value = "";
  let quoted = false;
  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    if (char === '"' && line[i + 1] === '"' && quoted) {
      value += '"';
      i += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === "," && !quoted) {
      cells.push(value.trim());
      value = "";
    } else {
      value += char;
    }
  }
  cells.push(value.trim());
  return cells;
}

function parseDealerCsv(text: string): DealerContact[] {
  const lines = text.replace(/^\uFEFF/, "").split(/\r?\n/).filter((line) => line.trim());
  if (lines.length < 2) return [];
  const headers = parseCsvLine(lines[0]).map((item) => item.toLowerCase().replace(/[\s_-]+/g, ""));
  const index = (names: string[]) => headers.findIndex((header) => names.includes(header));
  const nameIndex = index(["name", "dealername", "contactname"]);
  const emailIndex = index(["email", "emailaddress", "dealeremail"]);
  const districtIndex = index(["district", "city"]);
  const stateIndex = index(["state", "region"]);
  const companyIndex = index(["company", "companyname", "firm"]);
  if (nameIndex < 0 || emailIndex < 0) {
    throw new Error("CSV must contain Name and Email columns. District, State and Company are optional.");
  }
  return lines.slice(1).map((line, row) => {
    const cells = parseCsvLine(line);
    return {
      id: `dealer-${row}-${cells[emailIndex] ?? ""}`,
      name: cells[nameIndex] ?? "",
      email: (cells[emailIndex] ?? "").toLowerCase(),
      district: districtIndex >= 0 ? cells[districtIndex] ?? "" : "",
      state: stateIndex >= 0 ? cells[stateIndex] ?? "" : "",
      company: companyIndex >= 0 ? cells[companyIndex] ?? "" : "",
    };
  }).filter((item) => item.name && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(item.email));
}

function DealerEmailContent() {
  const fileRef = useRef<HTMLInputElement>(null);
  const pdfRef = useRef<HTMLInputElement>(null);
  const [contacts, setContacts] = useState<DealerContact[]>([]);
  const [district, setDistrict] = useState("ALL");
  const [search, setSearch] = useState("");
  const [subject, setSubject] = useState("NAVII GPS – Dealer Partnership Proposal");
  const [body, setBody] = useState("Dear {{name}},\n\nGreetings from NAVII GPS.\n\nWe would like to invite you to explore our GPS tracking and fleet management solutions for your business. Our dealer programme offers product support, platform access and assistance for your market.\n\nPlease reply to this email if you would like our catalogue and commercial details.\n\nRegards,\nNAVII GPS Team");
  const [pdfName, setPdfName] = useState("");
  const [importMessage, setImportMessage] = useState("");
  const [error, setError] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [approved, setApproved] = useState(false);
  const [history, setHistory] = useState<CampaignDraft[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const districts = useMemo(
    () => [...new Set(contacts.map((item) => item.district).filter(Boolean))].sort(),
    [contacts],
  );
  const filtered = useMemo(() => contacts.filter((item) => {
    const matchesDistrict = district === "ALL" || item.district.toLowerCase() === district.toLowerCase();
    const term = search.trim().toLowerCase();
    const matchesSearch = !term || [item.name, item.email, item.company ?? "", item.district, item.state]
      .some((value) => value.toLowerCase().includes(term));
    return matchesDistrict && matchesSearch;
  }), [contacts, district, search]);
  const selectedRecipients = contacts.filter((item) =>
    selectedIds.includes(item.id) &&
    (district === "ALL" || item.district.toLowerCase() === district.toLowerCase()),
  );
  const recipientCount = selectedRecipients.length;
  const firstRecipient = selectedRecipients[0];

  async function importCsv(file?: File) {
    if (!file) return;
    setError("");
    setImportMessage("");
    try {
      if (!file.name.toLowerCase().endsWith(".csv")) {
        throw new Error("For this first preview, please export your Excel sheet as CSV (UTF-8) and upload it.");
      }
      const parsed = parseDealerCsv(await file.text());
      if (!parsed.length) throw new Error("No valid dealer rows found. Check the Name and Email columns.");
      const unique = new Map<string, DealerContact>();
      [...contacts, ...parsed].forEach((item) => unique.set(item.email, item));
      const merged = [...unique.values()];
      setContacts(merged);
      setSelectedIds(merged.map((item) => item.id));
      setApproved(false);
      setDistrict("ALL");
      setImportMessage(`${parsed.length} valid rows imported. ${merged.length} unique dealer contacts are now in this working session.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to import this file.");
    } finally {
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  function toggleContact(id: string) {
    setSelectedIds((current) => current.includes(id) ? current.filter((value) => value !== id) : [...current, id]);
    setApproved(false);
  }

  function approveDraft() {
    if (!subject.trim() || !body.trim() || recipientCount === 0) return;
    const draft: CampaignDraft = {
      id: `NAV-${Date.now()}`,
      subject: subject.trim(),
      district: district === "ALL" ? "All selected districts" : district,
      recipients: recipientCount,
      createdAt: new Date().toLocaleString(),
      status: "APPROVED",
    };
    setHistory((current) => [draft, ...current]);
    setApproved(true);
    setShowPreview(false);
  }

  const previewBody = body.replaceAll("{{name}}", firstRecipient?.name || "Dealer");

  return (
    <div className="min-h-[calc(100vh-78px)] p-4 text-white sm:p-6">
      <div className="mx-auto max-w-[1500px] space-y-6">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold tracking-[0.24em] text-sky-400">NAVII GPS · OUTREACH WORKSPACE</p>
            <h1 className="mt-2 text-3xl font-bold sm:text-4xl">Dealer Email Marketing</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-400">Import dealer contacts, target districts and prepare personalised proposals with a catalogue attachment.</p>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-amber-400/20 bg-amber-400/5 px-4 py-3 text-xs font-medium text-amber-200">
            <ShieldCheck className="h-4 w-4" /> Gmail connection required · Sending disabled
          </div>
        </header>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { label: "Dealer contacts", value: contacts.length, icon: Users },
            { label: "Districts detected", value: districts.length, icon: Filter },
            { label: "Selected recipients", value: recipientCount, icon: Mail },
            { label: "Approved drafts", value: history.length, icon: CheckCircle2 },
          ].map((stat) => {
            const Icon = stat.icon;
            return <div key={stat.label} className="rounded-2xl border border-white/10 bg-[#0a1426] p-5">
              <div className="flex items-center justify-between text-slate-400"><span className="text-sm">{stat.label}</span><Icon className="h-5 w-5 text-sky-400" /></div>
              <p className="mt-3 text-3xl font-semibold">{stat.value}</p>
            </div>;
          })}
        </div>

        <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
          <section className="space-y-5 rounded-2xl border border-white/10 bg-[#0a1426] p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div><h2 className="text-lg font-semibold">Dealer contact list</h2><p className="mt-1 text-xs text-slate-400">CSV import · duplicate email addresses are merged</p></div>
              <button type="button" onClick={() => fileRef.current?.click()} className="inline-flex items-center gap-2 rounded-xl bg-sky-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-sky-400"><Upload className="h-4 w-4" /> Import CSV</button>
              <input ref={fileRef} type="file" accept=".csv,text/csv" className="hidden" onChange={(event) => void importCsv(event.target.files?.[0])} />
            </div>
            <div className="rounded-xl border border-dashed border-slate-600 bg-white/[0.02] p-4 text-sm text-slate-400">
              <div className="flex items-start gap-3"><FileSpreadsheet className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" /><div><p className="font-medium text-slate-200">Prepare your dealer sheet</p><p className="mt-1">Required columns: Name, Email. Optional: District, State, Company. In Excel, use Save As → CSV UTF-8.</p></div></div>
            </div>
            {importMessage && <p className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3 text-sm text-emerald-300">{importMessage}</p>}
            {error && <p className="flex items-start gap-2 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300"><AlertCircle className="h-4 w-4 shrink-0" />{error}</p>}
            <div className="grid gap-3 sm:grid-cols-[1fr_190px]">
              <div className="relative"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search name, email or company" className="w-full rounded-xl border border-white/10 bg-[#07101f] py-3 pl-10 pr-3 text-sm outline-none focus:border-sky-500" /></div>
              <select value={district} onChange={(event) => { setDistrict(event.target.value); setApproved(false); }} className="rounded-xl border border-white/10 bg-[#07101f] px-3 py-3 text-sm outline-none focus:border-sky-500"><option value="ALL">All districts</option>{districts.map((item) => <option key={item} value={item}>{item}</option>)}</select>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-400"><span>{filtered.length} contacts shown</span><button type="button" onClick={() => { setSelectedIds((current) => [...new Set([...current, ...filtered.map((item) => item.id)])]); setApproved(false); }} className="font-semibold text-sky-400 hover:text-sky-300">Select all shown</button></div>
            <div className="max-h-[380px] overflow-auto rounded-xl border border-white/10">
              {filtered.length === 0 ? <div className="p-8 text-center text-sm text-slate-500">No dealer contacts yet. Import a CSV file to begin.</div> : <table className="w-full min-w-[540px] text-left text-sm">
                <thead className="sticky top-0 bg-[#111f33] text-xs uppercase tracking-wide text-slate-400"><tr><th className="p-3">Select</th><th className="p-3">Dealer</th><th className="p-3">District / State</th><th className="p-3">Email</th></tr></thead>
                <tbody>{filtered.map((item) => <tr key={item.id} className="border-t border-white/5 hover:bg-white/[0.025]"><td className="p-3"><input aria-label={`Select ${item.name}`} type="checkbox" checked={selectedIds.includes(item.id)} onChange={() => toggleContact(item.id)} className="h-4 w-4 accent-sky-500" /></td><td className="p-3"><p className="font-medium text-slate-200">{item.name}</p><p className="text-xs text-slate-500">{item.company || "—"}</p></td><td className="p-3 text-slate-300">{item.district || "—"}<p className="text-xs text-slate-500">{item.state}</p></td><td className="p-3 text-slate-400">{item.email}</td></tr>)}</tbody>
              </table>}
            </div>
          </section>

          <section className="space-y-5 rounded-2xl border border-white/10 bg-[#0a1426] p-5">
            <div><h2 className="text-lg font-semibold">Proposal composer</h2><p className="mt-1 text-xs text-slate-400">Personalised with the {"{{name}}"} field for each dealer</p></div>
            <label className="block text-sm"><span className="mb-2 block text-slate-400">Email subject</span><input value={subject} onChange={(event) => { setSubject(event.target.value); setApproved(false); }} className="w-full rounded-xl border border-white/10 bg-[#07101f] px-3 py-3 outline-none focus:border-sky-500" /></label>
            <label className="block text-sm"><span className="mb-2 block text-slate-400">Email message</span><textarea rows={12} value={body} onChange={(event) => { setBody(event.target.value); setApproved(false); }} className="w-full resize-y rounded-xl border border-white/10 bg-[#07101f] px-3 py-3 leading-6 outline-none focus:border-sky-500" /><span className="mt-2 block text-xs text-slate-500">Use {"{{name}}"} to insert the dealer's name automatically.</span></label>
            <div className="rounded-xl border border-white/10 bg-[#07101f] p-4">
              <div className="flex flex-wrap items-center justify-between gap-3"><div className="flex items-center gap-2 text-sm font-medium"><Paperclip className="h-4 w-4 text-sky-400" /> Proposal / catalogue PDF</div><button type="button" onClick={() => pdfRef.current?.click()} className="rounded-lg border border-white/10 px-3 py-2 text-xs font-semibold hover:bg-white/5">Choose PDF</button><input ref={pdfRef} type="file" accept="application/pdf,.pdf" className="hidden" onChange={(event) => { setPdfName(event.target.files?.[0]?.name ?? ""); setApproved(false); }} /></div>
              {pdfName ? <p className="mt-3 flex items-center gap-2 text-xs text-emerald-300"><FileText className="h-4 w-4" />{pdfName}</p> : <p className="mt-2 text-xs text-slate-500">No PDF selected. The file stays in this browser session; upload/send integration is not connected yet.</p>}
            </div>
            <div className="rounded-xl border border-sky-500/20 bg-sky-500/5 p-4 text-xs leading-5 text-slate-300"><p className="font-semibold text-sky-300">Approval safety</p><p className="mt-1">Preview and approval only create a local campaign record. No email is sent until the free Gmail authorisation and send workflow are configured and separately enabled.</p></div>
            <div className="flex flex-wrap gap-3"><button type="button" disabled={!recipientCount || !subject.trim() || !body.trim()} onClick={() => setShowPreview(true)} className="flex-1 rounded-xl bg-sky-500 px-4 py-3 text-sm font-semibold text-white hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-40">Preview campaign</button><button type="button" onClick={() => { setSelectedIds([]); setApproved(false); }} className="rounded-xl border border-white/10 px-4 py-3 text-sm text-slate-300 hover:bg-white/5">Clear selection</button></div>
            {approved && <p className="flex items-center gap-2 text-sm text-emerald-300"><CheckCircle2 className="h-4 w-4" /> Draft approved and saved in this session. Nothing was sent.</p>}
          </section>
        </div>

        <section className="rounded-2xl border border-white/10 bg-[#0a1426] p-5">
          <div className="flex items-center justify-between"><div><h2 className="text-lg font-semibold">Campaign history</h2><p className="mt-1 text-xs text-slate-400">Draft and approval activity in this browser session</p></div><span className="text-xs text-slate-500">Session only</span></div>
          {history.length === 0 ? <div className="mt-4 rounded-xl border border-dashed border-white/10 p-7 text-center text-sm text-slate-500">No campaign drafts approved yet.</div> : <div className="mt-4 overflow-x-auto"><table className="w-full min-w-[620px] text-left text-sm"><thead className="text-xs uppercase text-slate-500"><tr><th className="p-3">Campaign</th><th className="p-3">Target</th><th className="p-3">Recipients</th><th className="p-3">Date</th><th className="p-3">Status</th></tr></thead><tbody>{history.map((item) => <tr key={item.id} className="border-t border-white/10"><td className="p-3"><p className="font-medium">{item.subject}</p><p className="text-xs text-slate-500">{item.id}</p></td><td className="p-3 text-slate-300">{item.district}</td><td className="p-3">{item.recipients}</td><td className="p-3 text-slate-400">{item.createdAt}</td><td className="p-3"><span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300">Approved · Not sent</span></td></tr>)}</tbody></table></div>}
        </section>
      </div>

      {showPreview && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4" role="dialog" aria-modal="true" aria-labelledby="campaign-preview-title">
        <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/10 bg-[#0a1426] p-5 shadow-2xl sm:p-6">
          <div className="flex items-start justify-between gap-4"><div><p className="text-xs font-semibold tracking-widest text-sky-400">FINAL REVIEW</p><h2 id="campaign-preview-title" className="mt-1 text-2xl font-bold">Campaign preview</h2></div><button type="button" onClick={() => setShowPreview(false)} className="rounded-lg border border-white/10 px-3 py-2 text-sm text-slate-300">Close</button></div>
          <div className="mt-5 space-y-3 rounded-xl border border-white/10 bg-[#07101f] p-4 text-sm"><p><span className="text-slate-500">From:</span> NAVIIGPSINDIA@GMAIL.COM <span className="text-xs text-amber-300">(pending Gmail connection)</span></p><p><span className="text-slate-500">To:</span> {recipientCount} selected dealers (individual personalised emails)</p><p><span className="text-slate-500">Personalisation sample:</span> {firstRecipient?.name || "Dealer"} · {firstRecipient?.email || "No recipient"}</p><p><span className="text-slate-500">Subject:</span> {subject}</p><p><span className="text-slate-500">Attachment:</span> {pdfName || "None"}</p></div>
          <div className="mt-4 whitespace-pre-wrap rounded-xl border border-white/10 bg-white/[0.02] p-4 text-sm leading-6 text-slate-200">{previewBody}</div>
          <div className="mt-5 flex flex-wrap justify-end gap-3"><button type="button" onClick={() => setShowPreview(false)} className="rounded-xl border border-white/10 px-4 py-3 text-sm text-slate-300">Edit draft</button><button type="button" onClick={approveDraft} className="rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-500">Approve draft (do not send)</button></div>
          <p className="mt-3 text-right text-xs text-slate-500">Approval saves a draft only. No messages will be sent.</p>
        </div>
      </div>}
    </div>
  );
}

export default function DealerEmailPage() {
  return <RoleRouteGuard allowedRoles={["SUPER_ADMIN", "ADMIN"]}><DealerEmailContent /></RoleRouteGuard>;
}
