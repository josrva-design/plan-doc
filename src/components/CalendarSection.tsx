import { useCallback } from 'react';
import SectionTitle from './ui/SectionTitle.tsx';
import { DAY_LABELS } from '../utils/calendarConstants.ts';
import { isCardioDay } from '../utils/cardioDetection.ts';
import { Dumbbell, Moon } from 'lucide-react';

const SessionIcon = ({ isRest, isCardio }: { isRest: boolean; isCardio: boolean }) => {
  if (isRest) {
    return (
      <span className="week-strip__day-icon week-strip__day-icon--rest" aria-hidden="true">
        <Moon size={16} strokeWidth={2.2} />
      </span>
    );
  }
  // Cardio usa el mismo icono Dumbbell que strength.
  // La diferenciación cardio se hace únicamente por la pill "+ cardio".
  return (
    <span
      className={`week-strip__day-icon week-strip__day-icon--${isCardio ? 'cardio' : 'strength'}`}
      aria-hidden="true"
    >
      <Dumbbell size={16} strokeWidth={2.2} />
    </span>
  );
};

interface CalendarSectionProps {
  calendar: any[];
  routines: any[];
  selectedDayIdx: number;
  editingDay: number | null;
  onSelectDay: (i: number) => void;
  onSetEditingDay: (i: number | null) => void;
  onActividadBlur: (i: number, value: string) => void;
  onCalendarDayClick: (i: number) => void;
}

const isCardioActivity = (actividad: string) => {
  const act = (actividad || '').toLowerCase();
  return act.includes('cardio');
};

export default function CalendarSection({
  calendar,
  routines,
  selectedDayIdx,
  editingDay,
  onSelectDay,
  onSetEditingDay,
  onActividadBlur,
  onCalendarDayClick,
}: CalendarSectionProps) {
  const handleCellClick = useCallback((i: number) => {
    if (editingDay !== i) {
      onCalendarDayClick(i);
      onSelectDay(i);
    }
  }, [editingDay, onCalendarDayClick, onSelectDay]);

  const handleDoubleClick = useCallback((i: number) => {
    onSetEditingDay(i);
  }, [onSetEditingDay]);

  const handleBlur = useCallback((i: number, e: React.FocusEvent<HTMLInputElement>) => {
    onActividadBlur(i, e.target.value);
    onSetEditingDay(null);
  }, [onActividadBlur, onSetEditingDay]);

  const handleKeyDown = useCallback((i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onActividadBlur(i, e.currentTarget.value);
      onSetEditingDay(null);
    }
  }, [onActividadBlur, onSetEditingDay]);

  return (
    <>
      <SectionTitle>CALENDARIO SEMANAL</SectionTitle>
      <div className="week-strip" role="tablist" aria-label="Días de la semana">
        {DAY_LABELS.map((diaKey, i) => {
          const row = calendar[i] || {};
          const actividad = (row.actividad || '').trim();
          const isSelected = selectedDayIdx === i;
          const isEmpty = !actividad;
          const isRest = isEmpty || actividad.toLowerCase() === 'descanso';
          const isCardio = !isRest && isCardioDay(row, routines);
          const isEditing = editingDay === i;

          const cellClasses = [
            'week-strip__day',
            isSelected && 'week-strip__day--active',
            isRest && 'week-strip__day--rest',
            isCardio && 'week-strip__day--cardio',
            isEditing && 'week-strip__day--editing',
          ].filter(Boolean).join(' ');

          const displayActivity = isRest
            ? 'Descanso'
            : isEmpty
              ? '—'
              : actividad;

          return (
            <div
              key={diaKey}
              className={cellClasses}
              role="tab"
              aria-selected={isSelected}
              onClick={() => handleCellClick(i)}
              onDoubleClick={() => handleDoubleClick(i)}
            >
              <span className="week-strip__day-name">{diaKey}</span>
              <div className="week-strip__day-center">
                <SessionIcon isRest={isRest} isCardio={isCardio} />
                {isEditing ? (
                  <input
                    autoFocus
                    defaultValue={isRest ? '' : actividad}
                    onBlur={(e) => handleBlur(i, e)}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                    placeholder="Actividad"
                  />
                ) : (
                  <>
                    <span className={`week-strip__day-activity${isEmpty ? ' week-strip__day-activity--empty' : ''}`}>
                      {displayActivity}
                    </span>
                    {isCardio && (
                      <span className="week-strip__day-cardio-badge">+ cardio</span>
                    )}
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
