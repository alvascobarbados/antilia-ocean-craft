import { Link } from "@tanstack/react-router";

const DEPARTMENTS = [
  { slug: "living", label: "Living" },
  { slug: "dining", label: "Dining" },
  { slug: "bedroom", label: "Bedroom" },
  { slug: "outdoor", label: "Outdoor" },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-[1600px] px-5 py-16 md:px-10">
        <div className="grid gap-12 md:grid-cols-4">
          <div>
            <p className="label-sm">Antilia Supply Co.</p>
            <p className="mt-4 max-w-[24ch] text-[13.5px] leading-relaxed text-muted-foreground">
              Made-to-order furniture, factory-direct to the Caribbean.
            </p>
          </div>

          <div>
            <p className="label-xs text-muted-foreground">Departments</p>
            <ul className="mt-5 space-y-3">
              {DEPARTMENTS.map((d) => (
                <li key={d.slug}>
                  <Link to="/collection/$slug" params={{ slug: d.slug }} className="text-[13.5px] hover:underline">
                    {d.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="label-xs text-muted-foreground">Company</p>
            <ul className="mt-5 space-y-3 text-[13.5px]">
              <li>
                <Link to="/about" className="hover:underline">
                  About
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="hover:underline">
                  How it works
                </Link>
              </li>
              <li>
                <Link to="/collection" className="hover:underline">
                  Collection
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="label-xs text-muted-foreground">Contact</p>
            <ul className="mt-5 space-y-3 text-[13.5px]">
              <li>
                <a href="mailto:studio@antiliasupply.com" className="hover:underline">
                  studio@antiliasupply.com
                </a>
              </li>
              <li className="text-muted-foreground">WhatsApp · +1 (000) 000-0000</li>
            </ul>
          </div>
        </div>

        <p className="mt-16 max-w-[70ch] border-t border-border pt-8 text-[12px] leading-relaxed text-muted-foreground">
          Pricing shown is factory-direct (FOB) in USD; freight, duties and taxes are confirmed with your order.
        </p>
      </div>
    </footer>
  );
}
