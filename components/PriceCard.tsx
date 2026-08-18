export default function PriceCard({
  label,
  price,
  sublabel,
  highlight,
}: {
  label: string;
  price: string;
  sublabel?: string;
  highlight?: boolean;
}) {
  return (
    <div className={`price-card ${highlight ? "price-card-featured" : ""}`}>
      <div className="label">{label}</div>
      <div className="amount">{price}</div>
      {sublabel ? <div className="sub">{sublabel}</div> : null}
    </div>
  );
}
