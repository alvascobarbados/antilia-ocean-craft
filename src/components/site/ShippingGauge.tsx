import { shippingFit, CONTAINER_MARKS, CONTAINER_SCALE_MAX } from "@/lib/shipping";
import { cn } from "@/lib/utils";

export function ShippingGauge({ cbm, compact = false }: { cbm: number; compact?: boolean }) {
  const fit = shippingFit(cbm);

  return (
    <div className={cn("w-full", compact ? "space-y-2" : "space-y-3")}>
      <div className="flex items-baseline justify-between">
        <span className="label-xs text-foreground">Shipping volume</span>
        <span className="label-xs text-muted-foreground">
          {cbm.toFixed(1)} / {CONTAINER_SCALE_MAX} m³
        </span>
      </div>

      <div className="relative w-full pb-14">
        <div className="relative h-[3px] w-full bg-border">
          <div
            className={cn(
              "absolute left-0 top-0 h-full transition-[width] duration-700 ease-out",
              fit.tone === "calm" && "bg-foreground",
              fit.tone === "near" && "bg-caution",
              fit.tone === "over" && "bg-caution",
            )}
            style={{ width: `${Math.max(fit.fill * 100, cbm > 0 ? 1 : 0)}%` }}
          />
          {CONTAINER_MARKS.map((m, i) => {
            const left = (m.capacity / CONTAINER_SCALE_MAX) * 100;
            const passed = cbm >= m.capacity;
            const rowTop = [10, 24, 38][i] ?? 10;
            return (
              <div key={m.key} className="absolute top-0" style={{ left: `${left}%` }}>
                <div
                  className={cn("h-[9px] w-px -translate-x-1/2 -translate-y-[3px]", passed ? "bg-foreground" : "bg-border")}
                />
                <span
                  className={cn(
                    "absolute left-0 whitespace-nowrap label-xs",
                    left >= 100 ? "-translate-x-full" : "-translate-x-1/2",
                    passed ? "text-foreground" : "text-muted-foreground/60",
                  )}
                  style={{ top: `${rowTop}px` }}
                >
                  {m.capacity} m³ · {m.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <p className="text-[12.5px] leading-relaxed text-muted-foreground">{fit.caption}</p>
    </div>
  );
}
