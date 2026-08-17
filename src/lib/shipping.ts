export type ShippingOption = {
  key: string;
  label: string;
  capacity: number;
};

export const SHIPPING_OPTIONS: ShippingOption[] = [
  { key: "shared", label: "Shared shipment", capacity: 12 },
  { key: "20ft", label: "20ft container", capacity: 28 },
  { key: "40ft", label: "40ft container", capacity: 58 },
  { key: "40hc", label: "40ft high-cube", capacity: 68 },
];

export type ShippingFit = {
  option: ShippingOption;
  next: ShippingOption | null;
  fill: number;
  tone: "calm" | "near" | "over";
  caption: string;
};

export function shippingFit(cbm: number): ShippingFit {
  const index = SHIPPING_OPTIONS.findIndex((o) => cbm <= o.capacity);
  const option = (index === -1 ? SHIPPING_OPTIONS[SHIPPING_OPTIONS.length - 1] : SHIPPING_OPTIONS[index])!;
  const next = index === -1 ? null : (SHIPPING_OPTIONS[index + 1] ?? null);
  const fill = option.capacity === 0 ? 0 : Math.min(cbm / option.capacity, 1);

  if (index === -1) {
    return {
      option,
      next: null,
      fill: 1,
      tone: "over",
      caption: `Beyond a single 40ft high-cube — we will plan this across more than one shipment.`,
    };
  }

  if (fill > 0.9) {
    return {
      option,
      next,
      fill,
      tone: "near",
      caption: next
        ? `Close to the limit of a ${option.label.toLowerCase()} — a ${next.label.toLowerCase()} gives you room.`
        : `Close to the limit of a ${option.label.toLowerCase()}.`,
    };
  }

  if (cbm === 0) {
    return { option, next, fill: 0, tone: "calm", caption: "Add pieces to see how the order ships." };
  }

  return {
    option,
    next,
    fill,
    tone: "calm",
    caption:
      option.key === "shared"
        ? "Travels as part of a shared shipment."
        : `Fits a ${option.label.toLowerCase()} with room to spare.`,
  };
}

export const money = (n: number) =>
  `$${n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

export const volume = (n: number) => `${n.toFixed(1)} m³`;
