const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function addMonths(date: Date, months: number): Date {
  const day = date.getDate();
  const target = new Date(date.getFullYear(), date.getMonth() + months, 1);
  const lastDay = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate();
  target.setDate(Math.min(day, lastDay));
  return target;
}

export type DeliveryWindow = {
  start: Date;
  end: Date;
  /** e.g. "19 November – 19 December 2026" */
  full: string;
  /** e.g. "19 Nov – 19 Dec" */
  short: string;
};

export function deliveryWindow(from: Date = new Date()): DeliveryWindow {
  const start = addMonths(from, 3);
  const end = addMonths(from, 4);

  const sameYear = start.getFullYear() === end.getFullYear();
  const startFull = `${start.getDate()} ${MONTHS[start.getMonth()]}${sameYear ? "" : ` ${start.getFullYear()}`}`;
  const endFull = `${end.getDate()} ${MONTHS[end.getMonth()]} ${end.getFullYear()}`;

  const short = `${start.getDate()} ${MONTHS[start.getMonth()]!.slice(0, 3)} – ${end.getDate()} ${MONTHS[end.getMonth()]!.slice(0, 3)}`;

  return { start, end, full: `${startFull} – ${endFull}`, short };
}
