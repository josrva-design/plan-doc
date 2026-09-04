import { useState } from 'react';

interface DayOption {
  label: string;
  routineId: string | null;
  dayIndex?: number;
}

interface RoutineCardProps {
  label: string;
  subtitle?: string;
  activity?: string;
  primaryActionLabel?: string;
  onPrimaryAction?: (type: string) => void;
  duplicateOptions?: DayOption[];
  onDuplicate?: (opt: DayOption) => void;
  onRemove?: () => void;
  canEdit?: boolean;
  children: React.ReactNode;
}

const BLOCK_TYPES = ['Simple', 'Biserie', 'Triserie', 'Circuito'];

export default function RoutineCard({
  label,
  subtitle,
  activity,
  primaryActionLabel = '+ Ejercicio',
  onPrimaryAction,
  duplicateOptions = [],
  onDuplicate,
  onRemove,
  canEdit = true,
  children,
}: RoutineCardProps) {
  const [openMenu, setOpenMenu] = useState(false);
  const [openDuplicate, setOpenDuplicate] = useState(false);

  return (
    <div className="meal-card">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          {subtitle ? (
            <>
              <span className="text-base font-bold" style={{ color: 'var(--color-navy)' }}>
                {label}
              </span>
              <span className="premium-btn-pill premium-btn-pill--primary" style={{ fontWeight: 800 }}>
                {subtitle}
              </span>
            </>
          ) : (
            <span className="premium-btn-pill premium-btn-pill--primary" style={{ fontWeight: 800 }}>
              {label}
            </span>
          )}
          {activity && (
            <span className="text-sm font-semibold" style={{ color: 'var(--color-navy)' }}>
              {activity}
            </span>
          )}
        </div>

        {canEdit && (
          <div className="flex items-center gap-2">
            <div className="relative">
              <button
                type="button"
                onClick={() => setOpenMenu((prev) => !prev)}
                className="premium-btn-pill premium-btn-pill--primary"
              >
                {primaryActionLabel}
                <span style={{ marginLeft: 6, fontSize: 10 }}>▾</span>
              </button>

              {openMenu && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setOpenMenu(false)}
                  />
                  <div
                    className="absolute right-0 top-full mt-1 z-50 min-w-[180px] rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] shadow-lg py-1"
                  >
                    {BLOCK_TYPES.map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => {
                          setOpenMenu(false);
                          onPrimaryAction?.(type);
                        }}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-[var(--color-bg-subtle)] transition-colors"
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {onDuplicate && (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setOpenDuplicate((prev) => !prev)}
                  className="premium-btn-pill premium-btn-pill--ghost"
                  title="Duplicar día"
                >
                  Duplicar
                </button>

                {openDuplicate && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setOpenDuplicate(false)}
                    />
                    <div
                      className="absolute right-0 top-full mt-1 z-50 min-w-[180px] rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] shadow-lg py-1"
                    >
                      {duplicateOptions.map((opt) => (
                        <button
                          key={opt.dayIndex ?? opt.routineId ?? opt.label}
                          type="button"
                          onClick={() => {
                            setOpenDuplicate(false);
                            onDuplicate?.(opt);
                          }}
                          className="w-full text-left px-3 py-2 text-sm hover:bg-[var(--color-bg-subtle)] transition-colors"
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            {onRemove && (
              <button
                type="button"
                onClick={onRemove}
                className="premium-btn-pill premium-btn-pill--danger"
                title="Eliminar"
              >
                × Eliminar
              </button>
            )}
          </div>
        )}
      </div>

      {children}
    </div>
  );
}
