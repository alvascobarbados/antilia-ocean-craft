import { Link } from "@tanstack/react-router";

import { money } from "@/lib/shipping";

export type SeriesCardData = {
  itemCode: string;
  displayName?: string | null;
  heroImage: string | null;
  fromPrice: number;
  versionCount: number;
};

export function SeriesCard({ series }: { series: SeriesCardData }) {
  return (
    <Link to="/product/$code" params={{ code: series.itemCode }} className="group block">
      <div className="zoom-media aspect-[4/3] w-full bg-surface">
        {series.heroImage && (
          <img
            src={series.heroImage}
            alt={series.displayName ?? series.itemCode}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        )}
      </div>
      <div className="mt-4 space-y-1.5">
        <h3 className="text-[15px] font-normal tracking-tight">{series.displayName ?? series.itemCode}</h3>
        <p className="text-[13.5px] text-muted-foreground">
          from {Number.isFinite(series.fromPrice) ? money(series.fromPrice) : "—"}
        </p>
        <p className="label-xs text-muted-foreground/80">
          {series.versionCount} {series.versionCount === 1 ? "version" : "versions"} · Made to order
        </p>
      </div>
    </Link>
  );
}
