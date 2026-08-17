import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { publicClient } from "./catalog.server";

export const listCategories = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = publicClient();
  const { data, error } = await supabase
    .from("categories")
    .select("id, name, slug, parent_id, sort_order")
    .order("sort_order");
  if (error) throw new Error(error.message);
  return data ?? [];
});

export const listSeries = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) => z.object({ categorySlug: z.string().optional() }).parse(data ?? {}))
  .handler(async ({ data }) => {
    const supabase = publicClient();
    let categoryIds: string[] | null = null;

    if (data.categorySlug) {
      const { data: cats } = await supabase.from("categories").select("id, slug, parent_id");
      const match = (cats ?? []).find((c) => c.slug === data.categorySlug);
      if (!match) return [];
      const children = (cats ?? []).filter((c) => c.parent_id === match.id).map((c) => c.id);
      categoryIds = [match.id, ...children];
    }

    let query = supabase
      .from("series")
      .select(
        "id, item_code, display_name, description, hero_image, category_id, variants(id, unit_price_usd, min_qty)",
      )
      .eq("is_published", true)
      .order("item_code");

    if (categoryIds) query = query.in("category_id", categoryIds);

    const { data: rows, error } = await query;
    if (error) throw new Error(error.message);

    return (rows ?? []).map((s) => ({
      id: s.id,
      itemCode: s.item_code,
      displayName: s.display_name,
      description: s.description,
      heroImage: s.hero_image,
      categoryId: s.category_id,
      versionCount: s.variants?.length ?? 0,
      fromPrice: Math.min(...(s.variants ?? []).map((v) => Number(v.unit_price_usd)), Infinity),
    }));
  });

export const getSeries = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) => z.object({ code: z.string() }).parse(data))
  .handler(async ({ data }) => {
    const supabase = publicClient();
    const { data: series, error } = await supabase
      .from("series")
      .select(
        "id, item_code, display_name, description, construction_notes, hero_image, gallery_images, category_id, variants(id, variant_name, product_size_cm, packing_size_cm, cbm, min_qty, unit_price_usd, sort_order)",
      )
      .eq("item_code", data.code.toUpperCase())
      .eq("is_published", true)
      .maybeSingle();

    if (error) throw new Error(error.message);
    if (!series) return null;

    const { data: category } = await supabase
      .from("categories")
      .select("id, name, slug, parent_id")
      .eq("id", series.category_id ?? "")
      .maybeSingle();

    let parent = null;
    if (category?.parent_id) {
      const { data: p } = await supabase
        .from("categories")
        .select("id, name, slug")
        .eq("id", category.parent_id)
        .maybeSingle();
      parent = p;
    }

    const { data: related } = await supabase
      .from("series")
      .select("id, item_code, hero_image, variants(unit_price_usd)")
      .eq("is_published", true)
      .neq("id", series.id)
      .eq("category_id", series.category_id ?? "")
      .limit(3);

    return {
      id: series.id,
      itemCode: series.item_code,
      displayName: series.display_name,
      description: series.description,
      constructionNotes: series.construction_notes,
      heroImage: series.hero_image,
      gallery: series.gallery_images ?? [],
      category,
      parent,
      variants: (series.variants ?? [])
        .slice()
        .sort((a, b) => a.sort_order - b.sort_order)
        .map((v) => ({
          id: v.id,
          name: v.variant_name,
          productSize: v.product_size_cm,
          packingSize: v.packing_size_cm,
          cbm: Number(v.cbm),
          minQty: v.min_qty,
          price: Number(v.unit_price_usd),
        })),
      related: (related ?? []).map((r) => ({
        itemCode: r.item_code,
        heroImage: r.hero_image,
        fromPrice: Math.min(...(r.variants ?? []).map((v) => Number(v.unit_price_usd)), Infinity),
      })),
    };
  });

const submitSchema = z.object({
  contactName: z.string().min(1).max(120),
  company: z.string().max(160).optional().nullable(),
  email: z.string().email().max(200),
  phone: z.string().max(60).optional().nullable(),
  country: z.string().max(80).optional().nullable(),
  notes: z.string().max(4000).optional().nullable(),
  lines: z
    .array(
      z.object({
        variantId: z.string().uuid(),
        qty: z.number().int().min(1).max(10000),
        label: z.string().max(200),
        belowMinimum: z.boolean().optional(),
      }),
    )
    .min(1)
    .max(200),
});

export const submitOrder = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => submitSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: variants, error: variantError } = await supabaseAdmin
      .from("variants")
      .select("id, unit_price_usd, cbm")
      .in(
        "id",
        data.lines.map((l) => l.variantId),
      );
    if (variantError) throw new Error(variantError.message);

    const byId = new Map((variants ?? []).map((v) => [v.id, v]));
    let totalUsd = 0;
    let totalCbm = 0;
    let pieces = 0;
    for (const line of data.lines) {
      const v = byId.get(line.variantId);
      if (!v) continue;
      totalUsd += Number(v.unit_price_usd) * line.qty;
      totalCbm += Number(v.cbm) * line.qty;
      pieces += line.qty;
    }

    const { data: order, error } = await supabaseAdmin
      .from("orders")
      .insert({
        contact_name: data.contactName,
        company: data.company ?? null,
        email: data.email,
        phone: data.phone ?? null,
        country: data.country ?? null,
        notes: data.notes ?? null,
        status: "submitted",
        total_usd: totalUsd,
        total_cbm: totalCbm,
        total_pieces: pieces,
      })
      .select("id")
      .single();
    if (error) throw new Error(error.message);

    const { error: lineError } = await supabaseAdmin.from("order_lines").insert(
      data.lines.map((l) => ({
        order_id: order.id,
        variant_id: l.variantId,
        qty: l.qty,
        unit_price_usd: Number(byId.get(l.variantId)?.unit_price_usd ?? 0),
        cbm: Number(byId.get(l.variantId)?.cbm ?? 0),
        label: l.label,
        below_minimum: Boolean(l.belowMinimum),
      })),
    );
    if (lineError) throw new Error(lineError.message);

    return { id: order.id };
  });

export const listOrders = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: roles } = await context.supabase.from("user_roles").select("role").eq("user_id", context.userId);
    if (!(roles ?? []).some((r) => r.role === "admin")) throw new Error("Not authorised");

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("orders")
      .select("*, order_lines(id, qty, label, unit_price_usd, cbm)")
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const isAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await context.supabase.from("user_roles").select("role").eq("user_id", context.userId);
    return (data ?? []).some((r) => r.role === "admin");
  });
