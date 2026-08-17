import { createFileRoute, Link } from "@tanstack/react-router";

import { btn, Eyebrow } from "@/components/site/atoms";

export const Route = createFileRoute("/how-it-works")({
  head: () => ({
    meta: [
      { title: "How it works — Antilia Supply Co." },
      {
        name: "description",
        content:
          "Build your order, we confirm fabrics and pricing within 2 business days, production runs 6–8 weeks and your pieces are delivered by sea.",
      },
      { property: "og:title", content: "How it works — Antilia Supply Co." },
      {
        property: "og:description",
        content: "From order request to delivery by sea: the five steps behind every made-to-order piece.",
      },
    ],
  }),
  component: HowItWorks,
});

const STEPS = [
  {
    n: "01",
    title: "Build your order",
    body: "Add versions from any series. Your order keeps a running cost and shipping volume as you go, and stays saved in your browser.",
  },
  {
    n: "02",
    title: "We confirm details & fabrics",
    body: "Within 2 business days we come back with fabric and finish options, final pricing and an available production slot.",
  },
  {
    n: "03",
    title: "Deposit, production begins",
    body: "A deposit is invoiced offline once everything is agreed. Nothing is cut or upholstered before that point.",
  },
  {
    n: "04",
    title: "6–8 weeks in production",
    body: "Your pieces are made in sequence at the factory. We update you as items complete and are packed.",
  },
  {
    n: "05",
    title: "Delivery by sea",
    body: "Your order travels together — a shared shipment or a full container — and is delivered to your island.",
  },
];

const FAQ = [
  {
    q: "What does made-to-order mean?",
    a: "Nothing is held in stock. When your order is confirmed, the factory begins making your pieces to your specification. It is why the lead time is real and why the price is what it is.",
  },
  {
    q: "Why are there minimums?",
    a: "Each piece is set up and made as a small production run. Most pieces are made in minimums of two or three; chairs and stools, which are made in longer runs, start at five to ten. If you need fewer, say so in your notes and we will look at it.",
  },
  {
    q: "What is shipping volume?",
    a: "Furniture ships by the space it occupies once packed, measured in cubic metres (m³). We show it beside every version and total it in your order so you can see how much shipping capacity your project needs.",
  },
  {
    q: "Can I mix pieces in one shipment?",
    a: "Yes — that is the point. Living, dining, bedroom and outdoor pieces from different series all travel together in the same shipment.",
  },
  {
    q: "Who do you work with?",
    a: "Interior designers and architects specifying for clients, retailers and developers buying at volume, and private clients furnishing a full home or villa.",
  },
  {
    q: "How is the pricing so competitive?",
    a: "Factory-direct, by design. You are buying at the point of manufacture in USD, before freight and duties, without the layers a showroom adds.",
  },
];

function HowItWorks() {
  return (
    <div>
      <div className="mx-auto max-w-[1600px] px-5 pt-16 md:px-10 md:pt-24">
        <Eyebrow>How it works</Eyebrow>
        <h1 className="mt-6 display-xl max-w-[18ch]">From your order to your island, in five steps.</h1>
      </div>

      <section className="mx-auto max-w-[1600px] px-5 py-20 md:px-10 md:py-24">
        <ol className="border-t border-border">
          {STEPS.map((step) => (
            <li key={step.n} className="grid gap-4 border-b border-border py-9 md:grid-cols-[80px_260px_1fr] md:gap-10">
              <span className="label-xs text-muted-foreground">{step.n}</span>
              <h2 className="display-md">{step.title}</h2>
              <p className="max-w-[58ch] text-[14.5px] leading-relaxed text-muted-foreground">{step.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="border-t border-border bg-surface">
        <div className="mx-auto max-w-[1600px] px-5 py-20 md:px-10 md:py-24">
          <Eyebrow>Questions</Eyebrow>
          <dl className="mt-10 grid gap-x-20 gap-y-10 md:grid-cols-2">
            {FAQ.map((item) => (
              <div key={item.q} className="border-t border-border pt-6">
                <dt className="text-[16px] font-normal">{item.q}</dt>
                <dd className="mt-3 max-w-[54ch] text-[14px] leading-relaxed text-muted-foreground">{item.a}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-16 flex flex-wrap gap-3">
            <Link to="/collection" className={btn.primary}>
              Explore the collection
            </Link>
            <Link to="/order" className={btn.quiet}>
              Your order
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
