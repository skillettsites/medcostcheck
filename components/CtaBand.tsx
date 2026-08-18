import Link from "next/link";

export default function CtaBand({
  title,
  body,
  href,
  label,
}: {
  title: string;
  body: string;
  href: string;
  label: string;
}) {
  return (
    <div className="cta-band mt-10">
      <h2>{title}</h2>
      <p>{body}</p>
      {href.startsWith("mailto:") ? (
        <a href={href} className="btn btn-light">
          {label}
        </a>
      ) : (
        <Link href={href} className="btn btn-light">
          {label}
        </Link>
      )}
    </div>
  );
}
