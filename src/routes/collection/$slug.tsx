import { createFileRoute, Link } from "@tanstack/react-router";

import { Eyebrow } from "@/components/site/atoms";
import { SeriesCard } from "@/components/site/SeriesCard";
import { listCategories, listSeries } from "@/lib/catalog.functions";

export const Route = createFileRoute("/collection/$slug")({
  loader: async ({ params }) => {
    const [categories, series] = await Promise.all([
      listCategories(),
      listSeries({ data: { categorySlug: params.slug } }),
    ]);
    const category = categories.find((c) => c.slug === params.slug) ?? null;
    return { categories, series, category };
  },
  head: ({ loaderData }) => {
    const name = loaderData?.category?.name ?? "Collection";
    const title = `${name} — Antilia Supply Co.`;
    const description = `${name} pieces made to order and shipped factory-direct to the Caribbean.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: Department,
});

function Department() {
  const { categories, series, category } = Route.useLoaderData();
  const departments = categories.filter((c) => !c.parent_id);
  const children = category ? categories.filter((c) => c.parent_id === category.id) : [];

  return (
    <div className="mx-auto max-w-[1600px] px-5 py-16 md:px-10 md:py-24">
      <Eyebrow>The collection</Eyebrow>
      <h1 className="mt-6 display-xl">{category?.name ?? "Not found"}</h1>

      <nav className="mt-12 flex flex-wrap gap-x-8 gap-y-3 border-y border-border py-4">
        <Link to="/collection" className="label-xs text-muted-foreground hover:text-foreground">
          All
        </Link>
        {departments.map((d) => (
          <Link
            key={d.id}
            to="/collection/$slug"
            params={{ slug: d.slug }}
            className="label-xs text-muted-foreground hover:text-foreground"
            activeProps={{ className: "label-xs text-foreground" }}
          >
            {d.name}
          </Link>
        ))}
      </nav>

      {children.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
          {children.map((c) => (
            <Link
              key={c.id}
              to="/collection/$slug"
              params={{ slug: c.slug }}
              className="text-[13px] text-muted-foreground hover:text-foreground"
            >
              {c.name}
            </Link>
          ))}
        </div>
      )}

      {series.length === 0 ? (
        <p className="mt-16 text-[14px] text-muted-foreground">Nothing published in this department yet.</p>
      ) : (
        <div className="mt-12 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {series.map((s) => (
            <SeriesCard key={s.id} series={s} />
          ))}
        </div>
      )}
    </div>
  );
}
