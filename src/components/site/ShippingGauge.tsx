import { shippingFit, SHIPPING_OPTIONS } from "@/lib/shipping";
import { cn } from "@/lib/utils";

export function ShippingGauge({ cbm, compact = false }: { cbm: number; compact?: boolean }) {
  const fit = shippingFit(cbm);

  return (
    <div className={cn("w-full", compact ? "space-y-2" : "space-y-3")}>
      <div className="flex items-baseline justify-between">
        <span className="label-xs text-foreground">{fit.option.label}</span>
        <span className="label-xs text-muted-foreground">
          {cbm.toFixed(1)} / {fit.option.capacity} m³
        </span>
      </div>
      <div className="relative h-[3px] w-full bg-border">
        <div
          className={cn(
            "absolute left-0 top-0 h-full transition-[width] duration-500",
            fit.tone === "calm" && "bg-foreground",
            fit.tone === "near" && "bg-caution",
            fit.tone === "over" && "bg-caution",
          )}
          style={{ width: `${Math.max(fit.fill * 100, cbm > 0 ? 2 : 0)}%` }}
        />
      </div>
      <p className="text-[12.5px] leading-relaxed text-muted-foreground">{fit.caption}</p>
      {!compact && (
        <div className="flex flex-wrap gap-x-6 gap-y-1 pt-1">
          {SHIPPING_OPTIONS.map((o) => (
            <span
              key={o.key}
              className={cn(
                "label-xs",
                o.key === fit.option.key ? "text-foreground" : "text-muted-foreground/60",
              )}
            >
              {o.label} · {o.capacity} m³
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
