export function formatPrice(price: number): string {
  return (
    "$" +
    price.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  );
}

export function formatPriceRound(price: number): string {
  return (
    "$" +
    price.toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
  );
}
