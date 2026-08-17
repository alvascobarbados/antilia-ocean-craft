import { createFileRoute, Link } from "@tanstack/react-router";

import { btn, Eyebrow } from "@/components/site/atoms";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Antilia Supply Co. — Made-to-order furniture, factory-direct" },
      {
        name: "description",
        content:
          "Made-to-order furniture, factory-direct to the Caribbean. Designed profiles, 6–8 week production, delivered by sea for designers, developers and private clients.",
      },
      { property: "og:title", content: "Antilia Supply Co. — Made-to-order furniture, factory-direct" },
      {
        property: "og:description",
        content: "Made-to-order furniture, factory-direct to the Caribbean. Production 6–8 weeks, ships by sea.",
      },
    ],
  }),
  component: Home,
});

const DEPARTMENTS = [
  { slug: "living", label: "Living", image: "/images/dept-living.jpg" },
  { slug: "dining", label: "Dining", image: "/images/dept-dining.jpg" },
  { slug: "bedroom", label: "Bedroom", image: "/images/dept-bedroom.jpg" },
  { slug: "outdoor", label: "Outdoor", image: "/images/dept-outdoor.jpg" },
];

const PROMISE = [
  {
    title: "Designed profiles",
    body: "A tight collection of design families, drawn once and made well — not a catalogue of everything.",
  },
  {
    title: "Made for your project",
    body: "Nothing sits in a warehouse. Each piece begins production after your order is confirmed.",
  },
  {
    title: "Production 6–8 weeks",
    body: "A real timeline you can put in a project schedule, confirmed in writing before deposit.",
  },
  {
    title: "Ships by sea",
    body: "Pieces travel together in one shipment, whether that is a shared load or a full container.",
  },
  {
    title: "Factory-direct pricing",
    body: "You buy at the factory, not through three floors of markup. That is the whole price advantage.",
  },
];

function Home() {
  return (
    <div>
      <section className="relative">
        <div className="h-[72vh] min-h-[460px] w-full overflow-hidden md:h-[86vh]">
          <img
            src="/images/hero.jpg"
            alt="Sunlit Caribbean living room with a low curved linen sofa"
            width={1920}
            height={1088}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="absolute inset-0 flex items-end">
          <div className="mx-auto w-full max-w-[1600px] px-5 pb-12 md:px-10 md:pb-20">
            <h1 className="display-xl max-w-[18ch] text-background">
              Made-to-order furniture, factory-direct to the Caribbean.
            </h1>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                to="/collection"
                className="inline-flex items-center justify-center border border-background bg-background px-6 py-3 label-xs text-foreground transition-colors hover:bg-transparent hover:text-background"
              >
                Explore the collection
              </Link>
              <Link
                to="/how-it-works"
                className="inline-flex items-center justify-center border border-background px-6 py-3 label-xs text-background transition-colors hover:bg-background hover:text-foreground"
              >
                How it works
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1600px] px-5 py-20 md:px-10 md:py-28">
        <Eyebrow>Departments</Eyebrow>
        <div className="mt-8 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {DEPARTMENTS.map((d) => (
            <Link key={d.slug} to="/collection/$slug" params={{ slug: d.slug }} className="group block">
              <div className="zoom-media aspect-[4/5] w-full bg-surface">
                <img src={d.image} alt={d.label} loading="lazy" className="h-full w-full object-cover" />
              </div>
              <p className="mt-4 label-sm">{d.label}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-surface">
        <div className="mx-auto max-w-[1600px] px-5 py-20 md:px-10 md:py-28">
          <div className="grid gap-14 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
            <div>
              <Eyebrow>The made-to-order promise</Eyebrow>
              <h2 className="mt-6 display-lg max-w-[16ch]">Every piece is made for you.</h2>
              <div className="mt-10 zoom-media w-full">
                <img
                  src="/images/craft.jpg"
                  alt="Hand-finished upholstery in the workshop"
                  loading="lazy"
                  className="w-full object-cover"
                />
              </div>
            </div>
            <dl className="divide-y divide-border border-t border-border">
              {PROMISE.map((item) => (
                <div key={item.title} className="py-6">
                  <dt className="label-sm">{item.title}</dt>
                  <dd className="mt-3 max-w-[46ch] text-[14px] leading-relaxed text-muted-foreground">{item.body}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1600px] px-5 py-20 md:px-10 md:py-28">
        <div className="grid gap-14 lg:grid-cols-2 lg:items-center lg:gap-20">
          <div className="zoom-media w-full">
            <img
              src="/images/designers.jpg"
              alt="A villa interior being specified from drawings"
              loading="lazy"
              className="w-full object-cover"
            />
          </div>
          <div>
            <Eyebrow>For designers &amp; developers</Eyebrow>
            <h2 className="mt-6 display-lg max-w-[18ch]">Built for whole projects, not single rooms.</h2>
            <ul className="mt-10 space-y-6 border-t border-border pt-8">
              <li>
                <p className="label-sm">Full-build support</p>
                <p className="mt-2 max-w-[48ch] text-[14px] leading-relaxed text-muted-foreground">
                  Specify a villa, a floor of apartments or a hotel wing from one collection, on one production
                  schedule.
                </p>
              </li>
              <li>
                <p className="label-sm">Volume-friendly</p>
                <p className="mt-2 max-w-[48ch] text-[14px] leading-relaxed text-muted-foreground">
                  Pieces are made in small minimums, so repeated rooms cost less and arrive together.
                </p>
              </li>
              <li>
                <p className="label-sm">Share your order with a client</p>
                <p className="mt-2 max-w-[48ch] text-[14px] leading-relaxed text-muted-foreground">
                  Build a draft order, send it as a link or a clean PDF, and let your client see exactly what you have
                  specified.
                </p>
              </li>
            </ul>
            <div className="mt-10">
              <Link to="/collection" className={btn.outline}>
                Start an order
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="relative">
        <div className="h-[52vh] min-h-[320px] w-full overflow-hidden">
          <img
            src="/images/closing.jpg"
            alt="A plaster archway opening onto the Caribbean sea"
            loading="lazy"
            className="h-full w-full object-cover"
          />
        </div>
      </section>
    </div>
  );
}
