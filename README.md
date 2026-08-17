# ANTILIA SUPPLY

ANTILIA SUPPLY

Lovable Prompt — Antilia Supply Co.

Paste everything below the line into Lovable as one prompt.

THE CONCEPT

Build the website for Antilia Supply Co. — imagine CB2, Rove Concepts and Arhaus created a Caribbean concept together: made-to-order, factory-direct luxury furniture at the best possible price. That sentence is the entire brand. This is a beautiful, editorial, design-led furniture site first; the ordering mechanics underneath are quietly different because nothing sits in a warehouse — every piece is made to order and arrives by sea.

Who uses it: interior designers and architects specifying for clients, retailers and developers buying at volume, and private clients doing full home builds and villas. The site must feel aspirational enough for a designer to send a client a link, and functional enough for a buyer to assemble a real order.

LOOK & FEEL

Model the aesthetic directly on CB2 with Rove's softness:

Near-black (#141414) on white. Generous whitespace. Thin 1px hairline rules (#e4e2de). One warm off-white surface tone (#f6f4f1) for panels. No other UI color except a muted green for confirmation states.

Typography: a clean grotesque sans (Inter/Neue Haas style). Large quiet headlines at light weight. Small uppercase labels with wide letter-spacing (0.12–0.16em) for nav, eyebrows, prices' context lines, and buttons.

Photography is the hero: full-bleed lifestyle imagery, airy room scenes, sun-washed neutral palettes with Caribbean light. Product cards on soft neutral grounds. Subtle zoom on hover (scale 1.03, 600ms).

Buttons: rectangular, 1px border, uppercase letterspaced 10.5px labels; primary is solid near-black. No pills, shadows, or gradients.

The whole site should pass this test: screenshot any page, place it next to cb2.com and roveconcepts.com, and it belongs in the family — with slightly warmer light.

THE MADE-TO-ORDER DIFFERENCE (tone this correctly)

This is NOT an in-stock retailer, and the site should never pretend to be one — but it expresses that difference the way Rove Concepts does: as craft and honesty, not logistics jargon.

Language to use: "Made to order," "Crafted for your project," "Production 6–8 weeks," "Ships by sea," "Factory-direct pricing."

Language to avoid in headline UI: FOB, CBM, MOQ, container jargon, wholesale/trade-only framing, and any industrial tone. These concepts appear in the interface as clean details (a small "min. 3" note on a quantity field; a shipping-volume figure in the order summary) and are explained plainly in the FAQ — never shouted.

No retail theater: no "in stock," "only 3 left," countdown timers, reviews, or discount banners. Instead of urgency, confidence: "Every piece is made for you."

HOW ORDERING WORKS (the quiet mechanics)

There is a normal, familiar cart experience — "Add to order" from any product — but checkout is an order request, not a payment. No payment processing anywhere. The flow: build your order → submit it → the Antilia team confirms fabrics, final pricing and production slots within 2 business days → deposit invoiced offline → production begins.

The cart (call it "Your Order") has one elegant extra layer: because orders ship by sea, it keeps a running total of cost AND shipping volume (CBM), and shows how the order maps to shipping options:

A slim, refined summary bar in the order drawer: 18 pieces · $12,440 · 16.8 m³

A "shipping fit" indicator: shared shipment (small orders), 20ft container (~28 m³), 40ft (~58 m³), 40ft high-cube (~68 m³) — rendered as a minimal horizontal gauge with a caption like "Fits a 20ft container with room to spare," turning amber near capacity and suggesting the next size when exceeded. This is a helpful planning nuance, styled like everything else on the site — not a freight dashboard.

Quantity fields respect each piece's minimum (most pieces min. 2–3, chairs 5–10). Show it as a quiet inline note ("made in minimums of 3"); if under minimum, a gentle inline prompt, not an error wall.

Order persists in localStorage; shareable by link (a designer sends the draft to a client); downloadable as a clean PDF summary.

Submission form: name, company (optional — private clients exist), email, phone, country, project notes. Confirmation screen sets expectations: "We'll come back within 2 business days with fabric options, final pricing and a production slot."

DATA MODEL (Supabase)

categories: id, name, slug, parent_id — 3 levels. Departments: Living, Dining, Bedroom, Outdoor. (Living → Sofas / Sectionals / Chairs / Tables / Benches & Ottomans · Dining → Dining Tables / Dining Chairs / Bar & Counter Stools · Bedroom → Beds / Nightstands / Benches · Outdoor → Lounge / Dining / Sunbeds & Daybeds / Tables.)

series: id, item_code ("M042"), display_name (nullable — real names come later; until then the item code is the displayed title), category_id, description, construction_notes, hero_image, gallery_images[], is_published. A series is a design family: one item code often has several versions.

variants: id, series_id, variant_name ("2 Seater", "3 Seater", "Left Arm Single", "Corner", "Ottoman", "King 180×200"), product_size_cm, packing_size_cm, cbm (per packed unit), min_qty, unit_price_usd, sort_order.

orders: id, created_at, contact fields, status (draft/submitted), notes. order_lines: order_id, variant_id, qty.

Simple auth-protected /admin for CRUD on all of it, plus an order-request inbox.

Seed ~12 series across the four departments with realistic data. Examples: M042 Curved Sofa — 2 Seater ($308, 1.32 m³, min 3), 3 Seater ($374, 1.68 m³, min 3). M203 modular family — Left Arm ($157), Right Arm ($157), Corner ($159), Armless ($120), Ottoman ($83), each ~0.26–0.63 m³, min 3. A bed, a dining table with two top options, lounge chairs (min 5), dining chairs (min 10), and two outdoor pieces.

PAGES

Home — Full-bleed hero, one line: "Made-to-order furniture, factory-direct to the Caribbean." CTAs: "Explore the collection" / "How it works." Then: 4-tile department grid; an editorial band on the made-to-order promise (designed profiles, made for your project, 6–8 weeks, sea freight, the price advantage of skipping the middle); a "For designers & developers" band (full-build support, volume-friendly, share your order with a client); a quiet closing image band.

Collection (/collection + category pages) — CB2-style grid of series cards: photo, title (item code for now), "from $—" price, small caption line ("6 versions" or "Made to order · 6–8 weeks"). Category tree navigation with the taxonomy above, price filter, sort. Clean breadcrumbs.

Product / series page — Gallery left, info right: title, "from" price, short description, construction notes, "Made to order · ships by sea" line. Then the versions table, styled like a beautiful spec sheet: Version · Dimensions (cm) · Price · quantity field (respecting minimums) · "Add to order." Volume (m³) per version shown as a subtle secondary detail. Related pieces below.

Your Order (drawer + /order page) — as specified above: lines grouped by series, editable quantities, cost + volume totals, shipping-fit gauge, notes field, submit/download/share.

How it works (/how-it-works) — elegant 5-step timeline (Build your order → We confirm details & fabrics → Deposit, production begins → 6–8 weeks in production → Delivery by sea). FAQ in plain language: What does made-to-order mean? Why minimums? What is shipping volume/CBM? Can I mix pieces in one shipment? (yes — that's the point). Who do you work with? (designers, retailers, developers, and private clients doing full builds). How is pricing so competitive? (factory-direct, by design).

About — one elegant page: Caribbean-based, design-led, factory-direct. Warm, confident, brief.

GLOBAL

Header: ANTILIA SUPPLY CO. wordmark left (uppercase, wide tracking); nav: Collection, How It Works, About; right: search icon + "Your Order" button with a live piece-count badge.

Slim utility bar above header: "Made to order · Factory-direct · Delivered across the Caribbean."

Footer: departments, company, contact (email + WhatsApp placeholder), and one quiet legal line: "Pricing shown is factory-direct (FOB) in USD; freight, duties and taxes are confirmed with your order."

Fully responsive; order drawer becomes a bottom sheet on mobile; version tables scroll horizontally with a sticky first column.

BUILD ORDER

Design system, Home, Collection, Product pages with seeded data — get the look perfect first.

Your Order drawer + page with cost/volume totals, minimums, shipping-fit gauge, submission to Supabase.

Admin CRUD + order inbox. 4. Share links + PDF summary.

Do not build: payments, stock levels, reviews, wishlists, urgency mechanics, currency switching.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/67b11af9-3780-457e-9e3d-fdf0079db762).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
