export default function PageHeader({ title, subtitle, titleClassName, icon }) {
  return (
    <div className="mb-6">
      <div className={"premium-page-title " + (titleClassName || '')}>
        {icon && <span className="mr-2 inline-flex items-center justify-center text-[var(--color-primary)]">{icon}</span>}
        {title}
      </div>
      {subtitle && <div className="premium-subtitle">{subtitle}</div>}
    </div>
  );
}
