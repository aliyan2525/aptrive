"use client";

import { CalendarDays, CheckCircle2, Download, FileText, LockKeyhole, ReceiptText } from "lucide-react";

type BillingInvoice = {
  id: string;
  label: string;
  date: string;
  amount: string;
  status: "paid" | "pending" | "failed";
  downloadUrl?: string | null;
};

export default function BillingHistorySection({ invoices = [] }: { invoices?: BillingInvoice[] }) {
  return (
    <PanelShell>
      <div className="flex flex-col gap-4 border-b border-line pb-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-violet-700">Account / Billing</p>
          <h2 className="font-display mt-2 text-xl font-bold text-fg">Billing history</h2>
          <p className="mt-1 max-w-xl text-sm leading-6 text-muted">Review past charges and download invoices when billing is connected to your Aptrive account.</p>
        </div>
        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-amber-400/30 bg-amber-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-amber-700"><LockKeyhole className="h-3.5 w-3.5" aria-hidden="true" /> Billing not connected</span>
      </div>

      {invoices.length > 0 ? (
        <div className="mt-5 overflow-hidden rounded-2xl border border-line bg-white/65">
          <div className="hidden grid-cols-[minmax(0,1.4fr)_1fr_0.8fr_auto] gap-4 border-b border-line px-4 py-3 text-[10px] font-bold uppercase tracking-[0.14em] text-muted-2 sm:grid"><span>Invoice</span><span>Date</span><span>Status</span><span>Amount</span></div>
          <div className="divide-y divide-line">{invoices.map((invoice) => <InvoiceRow key={invoice.id} invoice={invoice} />)}</div>
        </div>
      ) : (
        <div className="mt-5 rounded-2xl border border-dashed border-violet-200 bg-[linear-gradient(135deg,rgba(247,245,255,0.8),rgba(239,252,249,0.7))] p-5 sm:p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white text-violet-700 shadow-sm"><ReceiptText className="h-5 w-5" aria-hidden="true" /></span><div><p className="font-semibold text-fg">No invoices yet</p><p className="mt-1 max-w-xl text-sm leading-6 text-muted">Your billing history will appear here after a successful subscription payment. No invoice has been generated for this account.</p></div></div>
            <span className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl border border-line bg-white/80 px-3 text-xs font-semibold text-muted"><Download className="h-4 w-4" aria-hidden="true" /> No downloads</span>
          </div>
        </div>
      )}

      <div className="mt-5 grid gap-3 sm:grid-cols-3"><BillingNote icon={CalendarDays} title="Clear dates" body="Each charge will show its billing date." /><BillingNote icon={CheckCircle2} title="Payment status" body="Paid, pending, or failed status stays visible." /><BillingNote icon={FileText} title="Downloadable" body="Invoice PDFs appear here when available." /></div>
    </PanelShell>
  );
}

function InvoiceRow({ invoice }: { invoice: BillingInvoice }) {
  const statusStyles = invoice.status === "paid" ? "bg-teal-500/10 text-teal-700" : invoice.status === "pending" ? "bg-amber-500/10 text-amber-700" : "bg-red-500/10 text-red-700";
  return <div className="grid gap-3 px-4 py-4 sm:grid-cols-[minmax(0,1.4fr)_1fr_0.8fr_auto] sm:items-center sm:gap-4"><div className="flex items-center gap-3"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-violet-500/10 text-violet-700"><FileText className="h-4 w-4" aria-hidden="true" /></span><div><p className="text-sm font-semibold text-fg">{invoice.label}</p><p className="mt-0.5 text-xs text-muted">{invoice.id}</p></div></div><p className="text-xs text-muted">{invoice.date}</p><span className={`w-fit rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em] ${statusStyles}`}>{invoice.status}</span><div className="flex items-center justify-between gap-3 sm:justify-end"><span className="text-sm font-semibold text-fg">{invoice.amount}</span>{invoice.downloadUrl ? <a href={invoice.downloadUrl} download className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-line bg-white px-2.5 text-xs font-semibold text-fg hover:border-violet-300"><Download className="h-3.5 w-3.5" aria-hidden="true" /> Download</a> : <span className="text-xs text-muted-2">Unavailable</span>}</div></div>;
}

function BillingNote({ icon: Icon, title, body }: { icon: typeof CalendarDays; title: string; body: string }) {
  return <div className="rounded-xl border border-line bg-white/55 p-3"><Icon className="h-4 w-4 text-teal-700" aria-hidden="true" /><p className="mt-2 text-xs font-semibold text-fg">{title}</p><p className="mt-1 text-xs leading-5 text-muted">{body}</p></div>;
}

function PanelShell({ children }: { children: React.ReactNode }) {
  return <section className="premium-shell settings-panel rounded-[1.5rem] border border-white/80 bg-white/80 p-5 shadow-[0_20px_60px_rgba(46,39,97,.08)] backdrop-blur-xl sm:p-6">{children}</section>;
}
