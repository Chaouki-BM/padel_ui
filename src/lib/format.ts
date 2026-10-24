export function formatTnd(amount: number): string {
  return new Intl.NumberFormat("fr-TN", {
    style: "currency",
    currency: "TND",
  }).format(amount);
}

export function formatTunisDate(iso: string): string {
  return new Intl.DateTimeFormat("fr-TN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Africa/Tunis",
  }).format(new Date(iso));
}
