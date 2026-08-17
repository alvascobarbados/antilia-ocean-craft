import { Link } from "@tanstack/react-router";
import { Menu, Search, X } from "lucide-react";
import { useState } from "react";

import { useOrder } from "@/lib/order-store";

const NAV = [
  { to: "/collection", label: "Collection" },
  { to: "/how-it-works", label: "How It Works" },
  { to: "/about", label: "About" },
] as const;

export function Header() {
  const { pieces, setOpen } = useOrder();
  const [menu, setMenu] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-background">
      <div className="bg-foreground py-2 text-center">
        <p className="label-xs text-background">Made to order · Factory-direct · Delivered across the Caribbean</p>
      </div>
      <div className="border-b border-border">
        <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-5 md:px-10">
          <div className="flex items-center gap-8">
            <button
              type="button"
              className="md:hidden"
              onClick={() => setMenu((v) => !v)}
              aria-label="Open menu"
            >
              {menu ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
            <Link to="/" className="label-sm whitespace-nowrap">
              Antilia Supply Co.
            </Link>
          </div>

          <nav className="hidden items-center gap-9 md:flex">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="label-xs text-muted-foreground transition-colors hover:text-foreground"
                activeProps={{ className: "label-xs text-foreground" }}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-6">
            <Link to="/collection" aria-label="Search the collection" className="hidden sm:block">
              <Search className="h-4 w-4" />
            </Link>
            <button type="button" onClick={() => setOpen(true)} className="label-xs">
              Your Order
              <span className="ml-2 inline-flex h-4 min-w-4 items-center justify-center border border-foreground px-1 text-[10px] leading-none">
                {pieces}
              </span>
            </button>
          </div>
        </div>
      </div>

      {menu && (
        <div className="border-b border-border bg-background md:hidden">
          <nav className="mx-auto flex max-w-[1600px] flex-col gap-5 px-5 py-6">
            {NAV.map((item) => (
              <Link key={item.to} to={item.to} className="label-sm" onClick={() => setMenu(false)}>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
