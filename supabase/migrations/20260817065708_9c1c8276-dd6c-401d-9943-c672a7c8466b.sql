-- roles
CREATE TYPE public.app_role AS ENUM ('admin','staff');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own roles readable" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

-- categories
CREATE TABLE public.categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  parent_id uuid REFERENCES public.categories(id) ON DELETE CASCADE,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.categories TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.categories TO authenticated;
GRANT ALL ON public.categories TO service_role;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "categories public read" ON public.categories FOR SELECT USING (true);
CREATE POLICY "categories admin write" ON public.categories FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- series
CREATE TABLE public.series (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_code text NOT NULL UNIQUE,
  display_name text,
  category_id uuid REFERENCES public.categories(id) ON DELETE SET NULL,
  description text,
  construction_notes text,
  hero_image text,
  gallery_images text[] NOT NULL DEFAULT '{}',
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.series TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.series TO authenticated;
GRANT ALL ON public.series TO service_role;
ALTER TABLE public.series ENABLE ROW LEVEL SECURITY;
CREATE POLICY "series public read" ON public.series FOR SELECT USING (is_published);
CREATE POLICY "series admin all" ON public.series FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- variants
CREATE TABLE public.variants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  series_id uuid NOT NULL REFERENCES public.series(id) ON DELETE CASCADE,
  variant_name text NOT NULL,
  product_size_cm text,
  packing_size_cm text,
  cbm numeric(6,3) NOT NULL DEFAULT 0,
  min_qty int NOT NULL DEFAULT 1,
  unit_price_usd numeric(10,2) NOT NULL DEFAULT 0,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.variants TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.variants TO authenticated;
GRANT ALL ON public.variants TO service_role;
ALTER TABLE public.variants ENABLE ROW LEVEL SECURITY;
CREATE POLICY "variants public read" ON public.variants FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.series s WHERE s.id = series_id AND s.is_published));
CREATE POLICY "variants admin all" ON public.variants FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- orders
CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  contact_name text NOT NULL,
  company text,
  email text NOT NULL,
  phone text,
  country text,
  notes text,
  status text NOT NULL DEFAULT 'submitted',
  total_usd numeric(12,2) NOT NULL DEFAULT 0,
  total_cbm numeric(10,3) NOT NULL DEFAULT 0,
  total_pieces int NOT NULL DEFAULT 0
);
GRANT SELECT, UPDATE, DELETE ON public.orders TO authenticated;
GRANT ALL ON public.orders TO service_role;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "orders admin read" ON public.orders FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "orders admin write" ON public.orders FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "orders admin delete" ON public.orders FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));

CREATE TABLE public.order_lines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  variant_id uuid REFERENCES public.variants(id) ON DELETE SET NULL,
  qty int NOT NULL DEFAULT 1,
  unit_price_usd numeric(10,2) NOT NULL DEFAULT 0,
  cbm numeric(6,3) NOT NULL DEFAULT 0,
  label text
);
GRANT SELECT, UPDATE, DELETE ON public.order_lines TO authenticated;
GRANT ALL ON public.order_lines TO service_role;
ALTER TABLE public.order_lines ENABLE ROW LEVEL SECURITY;
CREATE POLICY "order_lines admin read" ON public.order_lines FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "order_lines admin write" ON public.order_lines FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- seed categories
INSERT INTO public.categories (name, slug, parent_id, sort_order) VALUES ('Living','living',NULL,0);
INSERT INTO public.categories (name, slug, parent_id, sort_order) VALUES ('Sofas','living-sofas',(SELECT id FROM public.categories WHERE slug='living'),0);
INSERT INTO public.categories (name, slug, parent_id, sort_order) VALUES ('Sectionals','living-sectionals',(SELECT id FROM public.categories WHERE slug='living'),1);
INSERT INTO public.categories (name, slug, parent_id, sort_order) VALUES ('Chairs','living-chairs',(SELECT id FROM public.categories WHERE slug='living'),2);
INSERT INTO public.categories (name, slug, parent_id, sort_order) VALUES ('Tables','living-tables',(SELECT id FROM public.categories WHERE slug='living'),3);
INSERT INTO public.categories (name, slug, parent_id, sort_order) VALUES ('Benches & Ottomans','living-benches-ottomans',(SELECT id FROM public.categories WHERE slug='living'),4);
INSERT INTO public.categories (name, slug, parent_id, sort_order) VALUES ('Dining','dining',NULL,1);
INSERT INTO public.categories (name, slug, parent_id, sort_order) VALUES ('Dining Tables','dining-dining-tables',(SELECT id FROM public.categories WHERE slug='dining'),0);
INSERT INTO public.categories (name, slug, parent_id, sort_order) VALUES ('Dining Chairs','dining-dining-chairs',(SELECT id FROM public.categories WHERE slug='dining'),1);
INSERT INTO public.categories (name, slug, parent_id, sort_order) VALUES ('Bar & Counter Stools','dining-bar-counter-stools',(SELECT id FROM public.categories WHERE slug='dining'),2);
INSERT INTO public.categories (name, slug, parent_id, sort_order) VALUES ('Bedroom','bedroom',NULL,2);
INSERT INTO public.categories (name, slug, parent_id, sort_order) VALUES ('Beds','bedroom-beds',(SELECT id FROM public.categories WHERE slug='bedroom'),0);
INSERT INTO public.categories (name, slug, parent_id, sort_order) VALUES ('Nightstands','bedroom-nightstands',(SELECT id FROM public.categories WHERE slug='bedroom'),1);
INSERT INTO public.categories (name, slug, parent_id, sort_order) VALUES ('Benches','bedroom-benches',(SELECT id FROM public.categories WHERE slug='bedroom'),2);
INSERT INTO public.categories (name, slug, parent_id, sort_order) VALUES ('Outdoor','outdoor',NULL,3);
INSERT INTO public.categories (name, slug, parent_id, sort_order) VALUES ('Lounge','outdoor-lounge',(SELECT id FROM public.categories WHERE slug='outdoor'),0);
INSERT INTO public.categories (name, slug, parent_id, sort_order) VALUES ('Dining','outdoor-dining',(SELECT id FROM public.categories WHERE slug='outdoor'),1);
INSERT INTO public.categories (name, slug, parent_id, sort_order) VALUES ('Sunbeds & Daybeds','outdoor-sunbeds-daybeds',(SELECT id FROM public.categories WHERE slug='outdoor'),2);
INSERT INTO public.categories (name, slug, parent_id, sort_order) VALUES ('Tables','outdoor-tables',(SELECT id FROM public.categories WHERE slug='outdoor'),3);

-- seed series
INSERT INTO public.series (item_code, category_id, description, construction_notes, hero_image, gallery_images) VALUES
('M042',(SELECT id FROM public.categories WHERE slug='living-sofas'),'A low, softly curved sofa with a deep seat and a continuous back roll. Designed to sit generously in open, light-filled rooms.','Kiln-dried hardwood frame, webbed suspension, high-resilience foam wrapped in feather-down. Removable performance-weave covers.','/images/series/m042.jpg',ARRAY['/images/series/m042.jpg','/images/series/m042-b.jpg']),
('M203',(SELECT id FROM public.categories WHERE slug='living-sectionals'),'A modular family that lets you draw a seating plan rather than choose a sofa. Build it long, build it around a corner, build it again next year.','Solid frame modules with concealed steel connectors. Uniform seat height across every module.','/images/series/m203.jpg',ARRAY['/images/series/m203.jpg','/images/series/m203-b.jpg']),
('M117',(SELECT id FROM public.categories WHERE slug='living-chairs'),'A quiet lounge chair with a shallow shell and slim tapered legs. Comfortable enough to read in, light enough to move.','Moulded shell over a hardwood base, seat cushion in high-resilience foam. Swivel version on a low brushed-metal disc.','/images/series/m117.jpg',ARRAY['/images/series/m117.jpg']),
('M330',(SELECT id FROM public.categories WHERE slug='living-tables'),'A low table with a thick honest top and a recessed base, so the surface appears to float.','Solid oak or travertine top with a mitred edge. Powder-coated steel understructure.','/images/series/m330.jpg',ARRAY['/images/series/m330.jpg']),
('M418',(SELECT id FROM public.categories WHERE slug='living-benches-ottomans'),'An upholstered bench and matching ottoman — the pieces a room needs once the sofa is placed.','Hardwood frame, webbed platform, one-piece foam with a tailored boxed edge.','/images/series/m418.jpg',ARRAY['/images/series/m418.jpg']),
('M501',(SELECT id FROM public.categories WHERE slug='dining-dining-tables'),'A long dining table on two sculpted plinths, offered with a warm oak or a pale stone top.','Solid oak veneer over engineered core, or 20mm honed stone. Plinths in solid timber with a levelling foot.','/images/series/m501.jpg',ARRAY['/images/series/m501.jpg','/images/series/m501-b.jpg']),
('M512',(SELECT id FROM public.categories WHERE slug='dining-dining-chairs'),'A dining chair with a soft curved back and a webbed seat, in a side and an arm version.','Solid ash frame, hand-woven seat or upholstered pad. Finished in a low-sheen natural oil.','/images/series/m512.jpg',ARRAY['/images/series/m512.jpg']),
('M528',(SELECT id FROM public.categories WHERE slug='dining-bar-counter-stools'),'A slim stool built to the same line as the M512 chair, in counter and bar heights.','Solid ash frame with a steel footrest, upholstered or woven seat.','/images/series/m528.jpg',ARRAY['/images/series/m528.jpg']),
('M610',(SELECT id FROM public.categories WHERE slug='bedroom-beds'),'A low platform bed with a wide upholstered headboard and a shadow-gap base.','Hardwood platform with slatted support, headboard upholstered over a foam-wrapped panel.','/images/series/m610.jpg',ARRAY['/images/series/m610.jpg','/images/series/m610-b.jpg']),
('M622',(SELECT id FROM public.categories WHERE slug='bedroom-nightstands'),'A quiet nightstand with a routed pull and a recessed plinth, in one and two drawer versions.','Solid timber carcass, soft-close undermount runners, hand-finished edges.','/images/series/m622.jpg',ARRAY['/images/series/m622.jpg']),
('M702',(SELECT id FROM public.categories WHERE slug='outdoor-lounge'),'An outdoor lounge group with a thick woven back and deep quick-dry cushions.','Powder-coated aluminium frame, marine-grade rope, quick-dry foam in solution-dyed acrylic covers.','/images/series/m702.jpg',ARRAY['/images/series/m702.jpg']),
('M715',(SELECT id FROM public.categories WHERE slug='outdoor-sunbeds-daybeds'),'A sunbed and a canopied daybed for terraces that face the afternoon sun.','Teak or powder-coated aluminium base, adjustable back, quick-dry cushions in solution-dyed acrylic.','/images/series/m715.jpg',ARRAY['/images/series/m715.jpg']);

-- seed variants
INSERT INTO public.variants (series_id, variant_name, product_size_cm, packing_size_cm, cbm, min_qty, unit_price_usd, sort_order)
SELECT s.id, v.name, v.psize, v.pack, v.cbm, v.minq, v.price, v.so FROM (VALUES
('M042','2 Seater','180×95×72','188×103×80',1.320,3,308.00,0),
('M042','3 Seater','230×95×72','238×103×80',1.680,3,374.00,1),
('M203','Left Arm Single','100×95×72','108×103×80',0.420,3,157.00,0),
('M203','Right Arm Single','100×95×72','108×103×80',0.420,3,157.00,1),
('M203','Corner','95×95×72','103×103×80',0.450,3,159.00,2),
('M203','Armless','85×95×72','93×103×80',0.340,3,120.00,3),
('M203','Ottoman','85×85×40','93×93×48',0.260,3,83.00,4),
('M117','Lounge Chair','76×80×70','84×88×78',0.310,5,96.00,0),
('M117','Swivel Lounge Chair','76×80×72','84×88×80',0.340,5,112.00,1),
('M330','Round 90','Ø90×32','98×98×40',0.290,3,88.00,0),
('M330','Rectangular 120','120×70×32','128×78×40',0.380,3,104.00,1),
('M418','Bench 120','120×40×45','128×48×53',0.240,3,74.00,0),
('M418','Ottoman 70','70×70×42','78×78×50',0.190,3,61.00,1),
('M501','Oak Top 200','200×100×75','210×110×22',0.940,2,286.00,0),
('M501','Stone Top 200','200×100×75','210×110×26',1.120,2,348.00,1),
('M512','Side Chair','48×54×80','56×62×88',0.140,10,58.00,0),
('M512','Arm Chair','56×56×80','64×64×88',0.170,10,66.00,1),
('M528','Counter Stool 65','44×48×90','52×56×98',0.160,6,71.00,0),
('M528','Bar Stool 75','44×48×100','52×56×108',0.180,6,76.00,1),
('M610','Queen 160×200','172×214×95','180×60×40',1.050,2,268.00,0),
('M610','King 180×200','192×214×95','200×60×40',1.180,2,296.00,1),
('M622','1 Drawer','50×40×48','58×48×56',0.220,3,84.00,0),
('M622','2 Drawer','50×40×58','58×48×66',0.270,3,98.00,1),
('M702','Lounge Sofa 2 Seater','170×88×70','178×96×78',1.240,3,246.00,0),
('M702','Lounge Chair','80×88×70','88×96×78',0.520,5,118.00,1),
('M715','Sunbed','200×75×35','208×83×43',0.860,3,164.00,0),
('M715','Daybed with Canopy','200×160×200','208×85×90',2.100,2,412.00,1)
) AS v(code,name,psize,pack,cbm,minq,price,so)
JOIN public.series s ON s.item_code = v.code;