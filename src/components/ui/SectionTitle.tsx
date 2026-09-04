interface SectionTitleProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
  subtitle?: string;
}

export default function SectionTitle({ children, icon, subtitle }: SectionTitleProps) {
  return (
    <div className="premium-section-title mb-2">
      <div className="flex items-center gap-2">
        {icon && <span className="text-[var(--color-primary)] shrink-0">{icon}</span>}
        <span>{children}</span>
      </div>
      {subtitle && <span className="block text-[10px] font-medium tracking-normal normal-case text-[var(--color-text-muted)] mt-0.5">{subtitle}</span>}
    </div>
  );
}
