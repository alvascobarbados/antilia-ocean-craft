import { createFileRoute, Link } from "@tanstack/react-router";

import { btn, Eyebrow } from "@/components/site/atoms";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Antilia Supply Co." },
      {
        name: "description",
        content:
          "Caribbean-based, design-led and factory-direct. Antilia Supply Co. makes furniture to order for designers, developers and private clients across the islands.",
      },
      { property: "og:title", content: "About — Antilia Supply Co." },
      {
        property: "og:description",
        content: "Caribbean-based, design-led, factory-direct furniture made to order.",
      },
    ],
  }),
  component: About,
});

function About() {
  return (
    <div>
      <div className="mx-auto max-w-[1600px] px-5 pt-16 md:px-10 md:pt-24">
        <Eyebrow>About</Eyebrow>
        <h1 className="mt-6 display-xl max-w-[16ch]">Caribbean-based, design-led, factory-direct.</h1>
      </div>

      <div className="mx-auto mt-14 max-w-[1600px] px-5 md:px-10">
        <div className="zoom-media w-full">
          <img
            src="/images/closing.jpg"
            alt="A plaster archway opening onto the Caribbean sea"
            loading="lazy"
            className="h-[46vh] min-h-[280px] w-full object-cover"
          />
        </div>
      </div>

      <div className="mx-auto max-w-[1600px] px-5 py-20 md:px-10 md:py-28">
        <div className="grid gap-14 lg:grid-cols-[0.8fr_1fr] lg:gap-24">
          <p className="display-md max-w-[20ch]">
            We were tired of paying island prices for ordinary furniture.
          </p>
          <div className="max-w-[62ch] space-y-6 text-[15px] leading-[1.75] text-muted-foreground">
            <p>
              Antilia Supply Co. exists because good furniture reaches the Caribbean slowly and expensively, after
              passing through more hands than it needs to. We removed the hands. We work directly with a small group of
              factories, draw a tight collection with them, and make each piece only once a project calls for it.
            </p>
            <p>
              That single decision changes everything downstream. Nothing sits in a warehouse absorbing cost. Production
              runs six to eight weeks. Pieces travel together by sea, so a whole villa can arrive in one shipment rather
              than a dozen. And the price you see is the factory price, in USD, before freight and duties — not a
              markup pretending to be a discount.
            </p>
            <p>
              We work with interior designers and architects specifying for clients, with retailers and developers
              buying at volume, and with private clients furnishing a home from empty rooms. The scale differs; the
              process does not.
            </p>
            <p>
              Everything is made to order. That is a constraint, and it is also the point: the piece that arrives was
              made for your project, not for a shelf.
            </p>
          </div>
        </div>

        <div className="mt-16 flex flex-wrap gap-3 border-t border-border pt-10">
          <Link to="/collection" className={btn.primary}>
            Explore the collection
          </Link>
          <Link to="/how-it-works" className={btn.quiet}>
            How it works
          </Link>
        </div>
      </div>
    </div>
  );
}
