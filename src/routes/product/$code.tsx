import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { btn, Eyebrow } from "@/components/site/atoms";
import { ShippingGauge } from "@/components/site/ShippingGauge";
import { getSeries } from "@/lib/catalog.functions";
import { useOrder } from "@/lib/order-store";
import { money } from "@/lib/shipping";

export const Route = createFileRoute("/product/$code")({
  loader: async ({ params }) => {
    const series = await getSeries({ data: { code: params.code } });
    if (!series) throw notFound();
    return series;
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Unavailable — Antilia Supply Co." }, { name: "robots", content: "noindex" }] };
    }
    const title = `${loaderData.displayName ?? loaderData.itemCode} — Antilia Supply Co.`;
    const description =
      loaderData.description ?? `${loaderData.itemCode} made to order, factory-direct, shipped by sea.`;
    return {
      meta: [
        { title },
        { name: "description", content: description.slice(0, 155) },
        { property: "og:title", content: title },
        { property: "og:description", content: description.slice(0, 155) },
      ],
    };
  },
  component: Product,
});

function Product() {
  const series = Route.useLoaderData();
  const { addLine, setOpen } = useOrder();
  const [qty, setQty] = useState<Record<string, number>>({});

  const images = [series.heroImage, ...(series.gallery as string[])].filter(Boolean) as string[];

  const add = (variant: (typeof series.variants)[number]) => {
    const n = qty[variant.id] ?? 1;
    addLine({
      variantId: variant.id,
      variantName: variant.name,
      seriesCode: series.itemCode,
      seriesTitle: series.displayName ?? series.itemCode,
      image: series.heroImage,
      price: variant.price,
      cbm: variant.cbm,
      minQty: variant.minQty,
      qty: n,
    });
    toast.success(`${variant.name} added to your order`);
    setOpen(true);
  };

  return (
    <div className="mx-auto max-w-[1600px] px-5 py-10 md:px-10 md:py-16">
      <nav className="flex flex-wrap items-center gap-2 label-xs text-muted-foreground">
        <Link to="/collection" className="hover:text-foreground">
          Collection
        </Link>
        {series.parent && (
          <>
            <span>/</span>
            <Link to="/collection/$slug" params={{ slug: series.parent.slug }} className="hover:text-foreground">
              {series.parent.name}
            </Link>
          </>
        )}
        {series.category && (
          <>
            <span>/</span>
            <Link to="/collection/$slug" params={{ slug: series.category.slug }} className="hover:text-foreground">
              {series.category.name}
            </Link>
          </>
        )}
      </nav>

      <div className="mt-8 grid gap-12 lg:grid-cols-[1.25fr_1fr] lg:gap-20">
        <div className="space-y-3">
          {images.map((src) => (
            <div key={src} className="w-full bg-surface">
              <img
                src={src}
                alt={series.displayName ?? series.itemCode}
                loading="lazy"
                className="w-full object-cover"
              />
            </div>
          ))}
        </div>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <Eyebrow>{series.itemCode}</Eyebrow>
          <h1 className="mt-4 display-lg">{series.displayName ?? series.itemCode}</h1>
          {series.description && (
            <p className="mt-5 max-w-[52ch] text-[15px] leading-[1.75] text-muted-foreground">{series.description}</p>
          )}

          <p className="mt-6 label-xs text-muted-foreground">Made to order · Production 6–8 weeks</p>

          <div className="mt-10 border-t border-border">
            <p className="py-4 label-xs text-muted-foreground">Versions</p>
            <ul className="divide-y divide-border border-t border-border">
              {series.variants.map((v) => {
                const value = qty[v.id] ?? 1;
                return (
                  <li key={v.id} className="py-5">
                    <div className="flex items-start justify-between gap-6">
                      <div>
                        <p className="text-[15px]">{v.name}</p>
                        <p className="mt-1.5 text-[13px] text-muted-foreground">
                          {v.productSize ?? "—"} · {v.cbm.toFixed(2)} m³
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="whitespace-nowrap text-[15px]">{money(v.price)}</p>
                        <p className="mt-1 label-xs text-muted-foreground">USD · FOB</p>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-3">
                      <input
                        aria-label={`Quantity for ${v.name}`}
                        inputMode="numeric"
                        value={value}
                        onChange={(e) =>
                          setQty((q) => ({ ...q, [v.id]: Math.max(1, Number(e.target.value.replace(/\D/g, "")) || 1) }))
                        }
                        className="w-16 border border-border bg-transparent px-3 py-2 text-center text-[13px] outline-none focus:border-foreground"
                      />
                      <button type="button" className={btn.primary} onClick={() => add(v)}>
                        Add to order
                      </button>
                      <span className="text-[12.5px] text-muted-foreground">
                        {(v.cbm * value).toFixed(2)} m³ · {money(v.price * value)}
                      </span>
                    </div>
                    {v.minQty && value < v.minQty && (
                      <p className="mt-2 label-xs text-muted-foreground">
                        Below typical minimum of {v.minQty} — we'll confirm with your quote.
                      </p>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          {series.constructionNotes && (
            <div className="mt-10 border-t border-border pt-6">
              <p className="label-xs text-muted-foreground">Construction</p>
              <p className="mt-3 max-w-[52ch] text-[14px] leading-relaxed text-muted-foreground">
                {series.constructionNotes}
              </p>
            </div>
          )}

          <div className="mt-10 border-t border-border pt-6">
            <p className="label-xs text-muted-foreground">Shipping</p>
            <div className="mt-4">
              <ShippingGauge cbm={series.variants[0]?.cbm ?? 0} compact />
            </div>
          </div>
        </div>
      </div>

      {series.related.length > 0 && (
        <section className="mt-24 border-t border-border pt-12">
          <Eyebrow>Related series</Eyebrow>
          <div className="mt-8 grid gap-x-6 gap-y-10 sm:grid-cols-3">
            {series.related.map((r) => (
              <Link key={r.itemCode} to="/product/$code" params={{ code: r.itemCode }} className="group block">
                <div className="zoom-media aspect-[4/3] w-full bg-surface">
                  {r.heroImage && (
                    <img src={r.heroImage} alt={r.itemCode} loading="lazy" className="h-full w-full object-cover" />
                  )}
                </div>
                <p className="mt-3 text-[14px]">{r.itemCode}</p>
                <p className="text-[13px] text-muted-foreground">
                  from {Number.isFinite(r.fromPrice) ? money(r.fromPrice) : "—"}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
