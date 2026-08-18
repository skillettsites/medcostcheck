export default function SearchPanel({
  title,
  subtitle,
  children,
}: {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="panel search-shell mb-12">
      {title ? <h2 className="panel-title">{title}</h2> : null}
      {subtitle ? <p className="panel-sub">{subtitle}</p> : title ? <div className="mb-5" /> : null}
      {children}
    </div>
  );
}
