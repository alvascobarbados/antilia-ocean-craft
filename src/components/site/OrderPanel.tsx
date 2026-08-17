import { Link } from "@tanstack/react-router";
import { Minus, Plus } from "lucide-react";
import { toast } from "sonner";

import { btn } from "@/components/site/atoms";
import { ShippingGauge } from "@/components/site/ShippingGauge";
import { downloadOrderPdf } from "@/components/site/order-pdf";
import { encodeOrder, useOrder, type OrderLine } from "@/lib/order-store";
import { money } from "@/lib/shipping";

function groupBySeries(lines: OrderLine[]) {
  const groups = new Map<string, OrderLine[]>();
  for (const line of lines) {
    const list = groups.get(line.seriesCode) ?? [];
    list.push(line);
    groups.set(line.seriesCode, list);
  }
  return [...groups.entries()];
}

export function OrderPanel({ onNavigate }: { onNavigate?: () => void }) {
  const { lines, pieces, totalCost, totalCbm, setQty, removeLine, notes, setNotes } = useOrder();

  if (lines.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-start justify-center gap-6 py-20">
        <p className="display-md">Your order is empty.</p>
        <p className="max-w-[36ch] text-[14px] leading-relaxed text-muted-foreground">
          Every piece is made for you. Start with a series and add the versions your project needs.
        </p>
        <Link to="/collection" className={btn.outline} onClick={onNavigate}>
          Explore the collection
        </Link>
      </div>
    );
  }

  const share = () => {
    const token = encodeOrder(lines, notes);
    const url = `${window.location.origin}/order?d=${token}`;
    navigator.clipboard.writeText(url).then(
      () => toast.success("Share link copied"),
      () => toast.error("Could not copy the link"),
    );
  };

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex-1 space-y-10">
        {groupBySeries(lines).map(([code, group]) => (
          <div key={code}>
            <div className="flex items-baseline justify-between border-b border-border pb-3">
              <Link
                to="/product/$code"
                params={{ code }}
                className="label-sm hover:underline"
                onClick={onNavigate}
              >
                {code}
              </Link>
              <span className="label-xs text-muted-foreground">
                {group.reduce((s, l) => s + l.qty, 0)} pieces
              </span>
            </div>

            {group.map((line) => {
              return (
                <div key={line.variantId} className="flex gap-4 border-b border-border py-5">
                  <div className="h-20 w-24 shrink-0 bg-surface">
                    {line.image && (
                      <img src={line.image} alt={line.variantName} loading="lazy" className="h-full w-full object-cover" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-[14px]">{line.variantName}</p>
                        <p className="mt-1 text-[13px] text-muted-foreground">
                          {money(line.price)} · {line.cbm.toFixed(2)} m³ each
                        </p>
                      </div>
                      <p className="text-[14px]">{money(line.price * line.qty)}</p>
                    </div>

                    <div className="mt-3 flex items-center gap-4">
                      <div className="flex items-center border border-border">
                        <button
                          type="button"
                          className="px-2 py-1.5"
                          aria-label="Decrease quantity"
                          onClick={() => setQty(line.variantId, line.qty - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <input
                          value={line.qty}
                          onChange={(e) => setQty(line.variantId, Number(e.target.value.replace(/\D/g, "")) || 0)}
                          className="w-10 border-0 bg-transparent text-center text-[13px] outline-none"
                          inputMode="numeric"
                          aria-label={`Quantity for ${line.variantName}`}
                        />
                        <button
                          type="button"
                          className="px-2 py-1.5"
                          aria-label="Increase quantity"
                          onClick={() => setQty(line.variantId, line.qty + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <button
                        type="button"
                        className="label-xs text-muted-foreground hover:text-foreground"
                        onClick={() => removeLine(line.variantId)}
                      >
                        Remove
                      </button>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        ))}

        <div>
          <label htmlFor="order-notes" className="label-xs text-muted-foreground">
            Project notes
          </label>
          <textarea
            id="order-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="Fabrics, timings, site details…"
            className="mt-3 w-full border border-border bg-transparent p-3 text-[14px] outline-none focus:border-foreground"
          />
        </div>
      </div>

      <div className="sticky bottom-0 mt-8 space-y-5 border-t border-border bg-background pt-5">
        <p className="text-[14px]">
          {pieces} pieces <span className="text-muted-foreground">·</span> {money(totalCost)}{" "}
          <span className="text-muted-foreground">·</span> {totalCbm.toFixed(1)} m³
        </p>
        <ShippingGauge cbm={totalCbm} compact />
        <div className="grid gap-2 sm:grid-cols-2">
          <Link to="/order" className={btn.primary} onClick={onNavigate}>
            Review &amp; submit
          </Link>
          <button type="button" className={btn.quiet} onClick={() => downloadOrderPdf(lines, notes)}>
            Download PDF
          </button>
        </div>
        <button type="button" className="label-xs text-muted-foreground hover:text-foreground" onClick={share}>
          Copy share link
        </button>
      </div>
    </div>
  );
}
