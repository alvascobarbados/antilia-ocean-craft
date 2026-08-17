import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { btn, Eyebrow } from "@/components/site/atoms";
import { OrderPanel } from "@/components/site/OrderPanel";
import { ShippingGauge } from "@/components/site/ShippingGauge";
import { submitOrder } from "@/lib/catalog.functions";
import { decodeOrder, useOrder } from "@/lib/order-store";
import { money } from "@/lib/shipping";

type Search = { d?: string };

export const Route = createFileRoute("/order")({
  validateSearch: (search: Record<string, unknown>): Search => ({
    d: typeof search.d === "string" ? search.d : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Your order — Antilia Supply Co." },
      {
        name: "description",
        content:
          "Review your made-to-order selection, check how it ships by sea, and send it to us as an order request. No payment is taken online.",
      },
      { property: "og:title", content: "Your order — Antilia Supply Co." },
      { property: "og:description", content: "Review your selection and send it to us as an order request." },
    ],
  }),
  component: OrderPage,
});

const field =
  "mt-2 w-full border border-border bg-transparent px-3 py-2.5 text-[14px] outline-none focus:border-foreground";

function OrderPage() {
  const { d } = Route.useSearch();
  const { lines, pieces, totalCost, totalCbm, notes, replaceAll, setNotes, clear } = useOrder();
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!d) return;
    const decoded = decodeOrder(d);
    if (decoded) {
      replaceAll(decoded.lines);
      setNotes(decoded.notes);
      toast.success("Shared order loaded");
    }
  }, [d, replaceAll, setNotes]);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (lines.length === 0) return;
    const form = new FormData(event.currentTarget);
    setSubmitting(true);
    try {
      await submitOrder({
        data: {
          contactName: String(form.get("contactName") ?? ""),
          company: String(form.get("company") ?? "") || null,
          email: String(form.get("email") ?? ""),
          phone: String(form.get("phone") ?? "") || null,
          country: String(form.get("country") ?? "") || null,
          notes: notes || null,
          lines: lines.map((l) => ({
            variantId: l.variantId,
            qty: l.qty,
            label: `${l.seriesCode} — ${l.variantName}`,
          })),
        },
      });
      clear();
      setDone(true);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong sending your order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="mx-auto max-w-[720px] px-5 py-28 md:px-10">
        <Eyebrow>Order request received</Eyebrow>
        <h1 className="mt-6 display-lg">Thank you — we have your order.</h1>
        <p className="mt-5 text-[15px] leading-[1.75] text-muted-foreground">
          We'll come back within 2 business days with fabric and finish options, final pricing and an available
          production slot. Nothing is charged online; a deposit is invoiced only once everything is agreed.
        </p>
        <div className="mt-10">
          <a href="/collection" className={btn.outline}>
            Back to the collection
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1600px] px-5 py-16 md:px-10 md:py-24">
      <Eyebrow>Your order</Eyebrow>
      <h1 className="mt-6 display-xl max-w-[18ch]">Review, then send it to us.</h1>
      <p className="mt-5 max-w-[56ch] text-[14.5px] leading-relaxed text-muted-foreground">
        This is an order request, not a payment. Prices are factory-direct in USD, before freight and duties.
      </p>

      <div className="mt-14 grid gap-16 lg:grid-cols-[1.15fr_1fr] lg:gap-24">
        <div className="flex flex-col">
          <OrderPanel />
        </div>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="border border-border p-6">
            <p className="label-xs text-muted-foreground">Summary</p>
            <p className="mt-4 text-[15px]">
              {pieces} pieces <span className="text-muted-foreground">·</span> {money(totalCost)}{" "}
              <span className="text-muted-foreground">·</span> {totalCbm.toFixed(1)} m³
            </p>
            <div className="mt-5">
              <ShippingGauge cbm={totalCbm} />
            </div>
          </div>

          <form onSubmit={onSubmit} className="mt-10">
            <p className="label-xs text-muted-foreground">Your details</p>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <label className="block sm:col-span-2">
                <span className="label-xs text-muted-foreground">Name</span>
                <input name="contactName" required maxLength={120} className={field} />
              </label>
              <label className="block">
                <span className="label-xs text-muted-foreground">Company (optional)</span>
                <input name="company" maxLength={160} className={field} />
              </label>
              <label className="block">
                <span className="label-xs text-muted-foreground">Country / island</span>
                <input name="country" maxLength={80} className={field} />
              </label>
              <label className="block">
                <span className="label-xs text-muted-foreground">Email</span>
                <input name="email" type="email" required maxLength={200} className={field} />
              </label>
              <label className="block">
                <span className="label-xs text-muted-foreground">Phone (optional)</span>
                <input name="phone" maxLength={60} className={field} />
              </label>
            </div>

            <button type="submit" disabled={submitting || lines.length === 0} className={`${btn.primary} mt-8 w-full`}>
              {submitting ? "Sending…" : "Send order request"}
            </button>
            <p className="mt-4 text-[12.5px] leading-relaxed text-muted-foreground">
              No payment is taken online. We reply within 2 business days.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
