export function formatValue(value: number, options?: Intl.NumberFormatOptions) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    ...options,
  }).format(value);
}

export function formatYAxisValue(value: number) {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
  }).format(value);
}
