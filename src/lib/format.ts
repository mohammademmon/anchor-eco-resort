export function taka(n: number): string {
  return "৳" + n.toLocaleString("en-US");
}

// "৳4,800 / night" or "৳4,800–৳5,600 / night"
export function roomPrice(
  weekday: number,
  weekend: number,
  perNight: string,
): string {
  if (!weekday && !weekend) return "";
  if (weekday === weekend || !weekend) return `${taka(weekday)} ${perNight}`;
  const lo = Math.min(weekday, weekend);
  const hi = Math.max(weekday, weekend);
  return `${taka(lo)}–${taka(hi)} ${perNight}`;
}
