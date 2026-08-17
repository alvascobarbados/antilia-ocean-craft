import { createFileRoute, Link } from "@tanstack/react-router";

import { Eyebrow } from "@/components/site/atoms";
import { SeriesCard } from "@/components/site/SeriesCard";
import { listCategories, listSeries } from "@/lib/catalog.functions";

export const Route = createFileRoute("/collection/")({
  head: () => ({
    meta: [
      { title: "The collection — Antilia Supply Co." },
      {
        name: "description",
        content:
          "Living, dining, bedroom and outdoor series — every piece made to order, factory-direct, shipped by sea to the Caribbean.",
      },
      { property: "og:title", content: "The collection — Antilia Supply Co." },
      {
        property: "og:description",
        content: "Living, dining, bedroom and outdoor series, all made to order.",
      },
    ],
  }),
  loader: async () => {
    const [categories, series] = await Promise.all([listCategories(), listSeries({ data: {} })]);
    return { categories, series };
  },
  component: Collection,
});

function Collection() {
  const { categories, series } = Route.useLoaderData();
  const departments = categories.filter((c) => !c.parent_id);

  return (
    <div className="mx-auto max-w-[1600px] px-5 py-16 md:px-10 md:py-24">
      <Eyebrow>The collection</Eyebrow>
      <h1 className="mt-6 display-xl max-w-[16ch]">Everything is made to order.</h1>
      <p className="mt-5 max-w-[56ch] text-[14.5px] leading-relaxed text-muted-foreground">
        Factory-direct, made to order and shipped by sea. Prices in USD, FOB China.
      </p>

      <nav className="mt-12 flex flex-wrap gap-x-8 gap-y-3 border-y border-border py-4">
        <span className="label-xs">All</span>
        {departments.map((d) => (
          <Link
            key={d.id}
            to="/collection/$slug"
            params={{ slug: d.slug }}
            className="label-xs text-muted-foreground hover:text-foreground"
          >
            {d.name}
          </Link>
        ))}
      </nav>

      <div className="mt-12 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
        {series.map((s) => (
          <SeriesCard key={s.id} series={s} />
        ))}
      </div>
    </div>
  );
}
