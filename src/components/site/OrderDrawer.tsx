import { X } from "lucide-react";
import { useEffect } from "react";

import { OrderPanel } from "@/components/site/OrderPanel";
import { useOrder } from "@/lib/order-store";
import { cn } from "@/lib/utils";

export function OrderDrawer() {
  const { open, setOpen, pieces } = useOrder();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <div
        aria-hidden={!open}
        onClick={() => setOpen(false)}
        className={cn(
          "fixed inset-0 z-50 bg-foreground/20 transition-opacity duration-300",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />
      <aside
        aria-label="Your order"
        className={cn(
          "fixed z-50 flex flex-col bg-background transition-transform duration-300 ease-out",
          "inset-x-0 bottom-0 max-h-[88vh] border-t border-border",
          "md:inset-y-0 md:left-auto md:right-0 md:max-h-none md:w-[460px] md:border-l md:border-t-0",
          open ? "translate-y-0 md:translate-x-0" : "translate-y-full md:translate-y-0 md:translate-x-full",
        )}
      >
        <div className="flex items-center justify-between border-b border-border px-6 py-5">
          <p className="label-sm">Your Order · {pieces}</p>
          <button type="button" onClick={() => setOpen(false)} aria-label="Close order">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="flex flex-1 flex-col overflow-y-auto px-6 pb-6">
          <OrderPanel variant="drawer" onNavigate={() => setOpen(false)} />
        </div>
      </aside>
    </>
  );
}
