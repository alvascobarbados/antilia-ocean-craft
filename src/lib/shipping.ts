export type ContainerMark = {
  key: string;
  label: string;
  capacity: number;
};

export const CONTAINER_SCALE_MAX = 68;

export const CONTAINER_MARKS: ContainerMark[] = [
  { key: "20ft", label: "20ft Container", capacity: 28 },
  { key: "40ft", label: "40ft Container", capacity: 56 },
  { key: "40hc", label: "40ft High Cube", capacity: 68 },
];

export type ShippingFit = {
  fill: number;
  tone: "calm" | "near" | "over";
  caption: string;
};

export function shippingFit(cbm: number): ShippingFit {
  const fill = Math.min(cbm / CONTAINER_SCALE_MAX, 1);

  if (cbm > CONTAINER_SCALE_MAX) {
    return {
      fill: 1,
      tone: "over",
      caption: "68+ m³ — this order spans more than one container; we'll plan the split with you.",
    };
  }

  if (cbm === 0) {
    return { fill: 0, tone: "calm", caption: "Add pieces to see how the order ships." };
  }

  if (cbm > 56) {
    return { fill, tone: "near", caption: `${cbm.toFixed(1)} m³ — fits a 40ft High Cube` };
  }

  if (cbm > 28) {
    return { fill, tone: "calm", caption: `${cbm.toFixed(1)} m³ — fits a 40ft container` };
  }

  return {
    fill,
    tone: "calm",
    caption: `${cbm.toFixed(1)} m³ — ${Math.round((cbm / 28) * 100)}% of a 20ft container`,
  };
}

export const money = (n: number) =>
  `$${n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

export const volume = (n: number) => `${n.toFixed(1)} m³`;
