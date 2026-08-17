import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type OrderLine = {
  variantId: string;
  variantName: string;
  seriesCode: string;
  seriesTitle: string;
  image: string | null;
  price: number;
  cbm: number;
  qty: number;
};

type OrderContextValue = {
  lines: OrderLine[];
  pieces: number;
  totalCost: number;
  totalCbm: number;
  open: boolean;
  setOpen: (open: boolean) => void;
  addLine: (line: OrderLine) => void;
  setQty: (variantId: string, qty: number) => void;
  removeLine: (variantId: string) => void;
  clear: () => void;
  replaceAll: (lines: OrderLine[]) => void;
  notes: string;
  setNotes: (notes: string) => void;
};

const STORAGE_KEY = "antilia.order.v1";

const OrderContext = createContext<OrderContextValue | null>(null);

export function encodeOrder(lines: OrderLine[], notes: string): string {
  const payload = JSON.stringify({ l: lines, n: notes });
  if (typeof window === "undefined") return "";
  return btoa(encodeURIComponent(payload));
}

export function decodeOrder(token: string): { lines: OrderLine[]; notes: string } | null {
  try {
    const parsed = JSON.parse(decodeURIComponent(atob(token)));
    if (!parsed || !Array.isArray(parsed.l)) return null;
    return { lines: parsed.l as OrderLine[], notes: typeof parsed.n === "string" ? parsed.n : "" };
  } catch {
    return null;
  }
}

export function OrderProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<OrderLine[]>([]);
  const [notes, setNotes] = useState("");
  const [open, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed.lines)) setLines(parsed.lines);
        if (typeof parsed.notes === "string") setNotes(parsed.notes);
      }
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ lines, notes }));
  }, [lines, notes, hydrated]);

  const addLine = useCallback((line: OrderLine) => {
    setLines((current) => {
      const existing = current.find((l) => l.variantId === line.variantId);
      if (existing) {
        return current.map((l) => (l.variantId === line.variantId ? { ...l, qty: l.qty + line.qty } : l));
      }
      return [...current, line];
    });
  }, []);

  const setQty = useCallback((variantId: string, qty: number) => {
    setLines((current) =>
      current.map((l) => (l.variantId === variantId ? { ...l, qty: Math.max(0, qty) } : l)).filter((l) => l.qty > 0),
    );
  }, []);

  const removeLine = useCallback((variantId: string) => {
    setLines((current) => current.filter((l) => l.variantId !== variantId));
  }, []);

  const clear = useCallback(() => {
    setLines([]);
    setNotes("");
  }, []);

  const replaceAll = useCallback((next: OrderLine[]) => setLines(next), []);

  const value = useMemo<OrderContextValue>(() => {
    const pieces = lines.reduce((sum, l) => sum + l.qty, 0);
    const totalCost = lines.reduce((sum, l) => sum + l.qty * l.price, 0);
    const totalCbm = lines.reduce((sum, l) => sum + l.qty * l.cbm, 0);
    return {
      lines,
      pieces,
      totalCost,
      totalCbm,
      open,
      setOpen,
      addLine,
      setQty,
      removeLine,
      clear,
      replaceAll,
      notes,
      setNotes,
    };
  }, [lines, open, notes, addLine, setQty, removeLine, clear, replaceAll]);

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
}

export function useOrder() {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error("useOrder must be used inside OrderProvider");
  return ctx;
}
