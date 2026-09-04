import React, { useState, useMemo } from "react";
import { X } from "lucide-react";

export interface EditableTableColumn<T> {
  key: string;
  label: string;
  width?: string;
  minWidth?: string;
  maxWidth?: string;
  align?: "left" | "center" | "right";
  className?: string;
  style?: Record<string, string>;
  render?: (
    value: any,
    row: T,
    onChange: (field: string, value: any) => void,
    uid: string,
    idx: number
  ) => React.ReactNode;
}

export interface EditableTableGroupConfig {
  label: string;
  color: string;
  className: string;
}

export interface EditableTableProps<T> {
  columns: EditableTableColumn<T>[];
  rows: T[];
  getRowId: (row: T, idx: number) => string;
  groupBy?: string;
  groupConfig?: Record<string, EditableTableGroupConfig>;
  activeGroup?: string;
  onGroupChange?: (key: string) => void;
  onAddRow?: () => void;
  onUpdateRow?: (uid: string, field: string, value: any) => void;
  onRemoveRow?: (uid: string) => void;
  onReorder?: (fromUid: string, toUid: string) => void;
  onReorderGroup?: (fromKey: string, toKey: string, direction: 'up' | 'down') => void;
  onRowEnter?: (uid: string) => void;
  onCopyBlock?: (fromKey: string, targetRoutineId: string) => void;
  copyBlockTargets?: { label: string; value: string }[];
  emptyText?: string;
  addButtonLabel?: string;
  showGroupPills?: boolean;
  showGroupHeaderBadge?: boolean;
  dragBetweenGroups?: boolean;
  onGroupLabelChange?: (key: string, label: string) => void;
  groupAddRow?: Record<string, () => void>;
  groupRemoveRow?: Record<string, () => void>;
  groupAddRowLabel?: string;
  headerStyle?: Record<string, string>;
  headerClassName?: string;
  headerAddRow?: () => void;
  rowBadge?: (row: T, idx: number) => React.ReactNode;
  variant?: 'training' | 'nutrition' | 'default';
  hideEmptyGroups?: boolean;
  renderGroupHeader?: (groupKey: string, groupConfig: EditableTableGroupConfig, groupRowsData: T[]) => React.ReactNode;
}

function useEditableTableDrag<T>({
  rows,
  getRowId,
  groupBy,
  dragBetweenGroups,
  onReorder,
}: {
  rows: T[];
  getRowId: (row: T, idx: number) => string;
  groupBy?: string;
  dragBetweenGroups?: boolean;
  onReorder?: (fromUid: string, toUid: string) => void;
}) {
  const [dragUid, setDragUid] = useState<string | null>(null);
  const [dropUid, setDropUid] = useState<string | null>(null);
  const dragCounterRef = React.useRef(0);

  const handleDragStart = (uid: string) => (e: React.DragEvent) => {
    const handle = e.target.closest("[data-drag-handle]");
    if (!handle) {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA' || tag === 'OPTION') {
        return;
      }
      e.preventDefault();
      return;
    }
    e.dataTransfer.effectAllowed = "move";
    setDragUid(uid);
    dragCounterRef.current = 0;
  };

  const handleDragOver = (uid: string) => (e: React.DragEvent) => {
    e.preventDefault();
    if (!dragUid || dragUid === uid) return;
    if (!dragBetweenGroups && groupBy) {
      const dragRow = rows.find((r) => getRowId(r, -1) === dragUid);
      const targetRow = rows.find((r) => getRowId(r, -1) === uid);
      if (!dragRow || !targetRow) return;
      if ((dragRow as Record<string, any>)[groupBy] !== (targetRow as Record<string, any>)[groupBy]) return;
    }
    setDropUid(uid);
  };

  const handleDrop = (targetUid: string) => (e: React.DragEvent) => {
    e.preventDefault();
    if (!dragUid || dragUid === targetUid || !onReorder) return;
    if (!dragBetweenGroups && groupBy) {
      const dragRow = rows.find((r) => getRowId(r, -1) === dragUid);
      const targetRow = rows.find((r) => getRowId(r, -1) === targetUid);
      if (dragRow && targetRow) {
        if ((dragRow as Record<string, any>)[groupBy] !== (targetRow as Record<string, any>)[groupBy]) {
          setDragUid(null);
          setDropUid(null);
          dragCounterRef.current = 0;
          return;
        }
      }
    }
    onReorder(dragUid, targetUid);
    setDragUid(null);
    setDropUid(null);
    dragCounterRef.current = 0;
  };

  const handleDragEnd = () => {
    setDragUid(null);
    setDropUid(null);
    dragCounterRef.current = 0;
  };

  const handleDragEnter = () => {
    dragCounterRef.current += 1;
  };

  const handleDragLeave = (e: React.DragEvent) => {
    if (e.currentTarget.contains(e.relatedTarget)) return;
    dragCounterRef.current -= 1;
    if (dragCounterRef.current === 0) {
      setDropUid(null);
    }
  };

  return {
    dragUid,
    dropUid,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDragEnd,
    handleDragEnter,
    handleDragLeave,
  };
}

export default function EditableTable<T>({
  columns,
  rows,
  getRowId,
  groupBy,
  groupConfig,
  activeGroup,
  onGroupChange,
  onAddRow,
  onUpdateRow,
  onRemoveRow,
  onReorder,
  onReorderGroup,
  onRowEnter,
  onCopyBlock,
  copyBlockTargets,
  emptyText,
  addButtonLabel,
  showGroupPills,
  showGroupHeaderBadge,
  dragBetweenGroups = false,
  onGroupLabelChange,
  groupAddRow,
  groupRemoveRow,
  groupAddRowLabel = "+ Alimento",
  headerStyle,
  headerClassName,
  headerAddRow,
  rowBadge,
  variant = 'default',
  hideEmptyGroups = false,
  renderGroupHeader,
}: EditableTableProps<T>) {
  const [editingGroupKey, setEditingGroupKey] = useState<string | null>(null);
  const [groupLabelDraft, setGroupLabelDraft] = useState("");

  const startEditingGroup = (key: string, currentLabel: string) => {
    setEditingGroupKey(key);
    setGroupLabelDraft(currentLabel || "");
  };

  const commitGroupLabel = (key: string) => {
    if (onGroupLabelChange) onGroupLabelChange(key, groupLabelDraft);
    setEditingGroupKey(null);
    setGroupLabelDraft("");
  };

  const {
    dragUid,
    dropUid,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDragEnd,
    handleDragEnter,
    handleDragLeave,
  } = useEditableTableDrag<T>({
    rows,
    getRowId,
    groupBy,
    dragBetweenGroups,
    onReorder,
  });

  const shouldShowGroupHeader = (idx: number) => {
    if (!groupBy || !groupConfig) return false;
    if (idx === 0) return true;
    const current = (rows[idx] as Record<string, any>)?.[groupBy];
    const previous = (rows[idx - 1] as Record<string, any>)?.[groupBy];
    return current !== previous;
  };

  const groupRows = useMemo(() => {
    if (!groupBy || !groupConfig) return [{ key: null, rows: rows as T[] }];

    if (hideEmptyGroups) {
      const groups: Record<string, T[]> = {};
      const ungrouped: T[] = [];

      rows.forEach((r) => {
        const val = (r as Record<string, any>)[groupBy];
        if (val && groupConfig[val]) {
          groups[val] = groups[val] || [];
          groups[val].push(r as T);
        } else {
          ungrouped.push(r as T);
        }
      });

      const result: { key: string | null; rows: T[] }[] = [];

      Object.entries(groups).forEach(([key, groupRows]) => {
        if (groupRows.length > 0) {
          result.push({ key, rows: groupRows });
        }
      });

      if (ungrouped.length > 0) {
        result.push({ key: '__ungrouped__', rows: ungrouped });
      }

      return result;
    }

    return Object.keys(groupConfig).map((key) => ({
      key,
      rows: rows.filter((r) => (r as Record<string, any>)[groupBy] === key) as T[],
    }));
  }, [rows, groupBy, groupConfig, hideEmptyGroups]);

  return (
    <div>
      {showGroupPills && groupConfig && (
        <div className="flex items-center gap-2 mb-4">
          <span className="typo-label">AGREGAR A:</span>
          {Object.entries(groupConfig).map(([key, config]) => (
            <button
              key={key}
              onClick={() => onGroupChange && onGroupChange(key)}
              className="pill"
              style={{
                background: activeGroup === key ? config.color : "transparent",
                color: activeGroup === key ? "var(--white)" : config.color,
                border: "1px solid " + config.color,
                padding: "2px 8px",
              }}
            >
              {config.label}
            </button>
          ))}
        </div>
      )}



        <div className="overflow-x-auto">
          <div className="table-wrapper editable-table-wrapper">
          <table
            className={`w-full min-w-[700px] premium-table ${headerClassName || ""}`}
            style={{
              border: "none",
            }}
          >
            <thead>
              <tr>
                <th
                  className={headerClassName ? `${headerClassName}-cell col-action` : "col-action"}
                    style={{
                       padding: "10px 8px",
                       ...(headerStyle
                         ? { padding: "10px 8px", ...headerStyle }
                         : {
                             padding: "10px 8px",
                             background: "var(--color-navy, var(--color-navy))",
                           }),
                     }}
                ></th>
                 {columns.map((col) => (
                   <th
                     key={col.key}
                     className={`${headerClassName ? `${headerClassName}-cell` : ""} premium-table-head-cell editable-table-header-cell`}
                     style={{
                       minWidth: col.minWidth || "auto",
                       maxWidth: col.maxWidth || "none",
                       width: col.width || "auto",
                       ...(headerStyle
                         ? { padding: "10px 8px", ...headerStyle, color: "inherit" }
                         : {}),
                       textAlign: col.align || "left",
                     }}
                   >
                     {col.label}
                   </th>
                 ))}
                 <th
                   className={headerClassName ? `${headerClassName}-cell editable-table-header-cell--action` : "editable-table-header-cell--action"}
                   style={{
                     ...(headerStyle
                       ? { padding: "10px 8px", ...headerStyle }
                       : {
                           padding: "10px 8px",
                           background: "var(--color-navy, var(--color-navy))",
                         }),
                   }}
                 >
                  {headerAddRow ? (
                    <button
                      type="button"
                      onClick={headerAddRow}
                      className="menu-group-add-btn menu-group-add-btn--primary"
                    >
                      {groupAddRowLabel || "+"}
                    </button>
                  ) : null}
                </th>
              </tr>
            </thead>
            <tbody>
                    {groupRows.map(({ key: groupKey, rows: groupRowsData }, gi) => {
                      const isUngrouped = groupKey === '__ungrouped__';
                      const showGroupHeader =
                        groupConfig &&
                        groupKey &&
                        !isUngrouped &&
                        groupConfig[groupKey];
                  const isEmpty = groupRowsData.length === 0;
                  return (
                    <React.Fragment key={groupKey}>
                      {isEmpty && (
                        <tr>
                          <td
                            colSpan={columns.length + 2}
                            className="premium-table-cell text-center typo-muted-sm"
                          >
                            {emptyText || "Sin datos"}
                          </td>
                        </tr>
                      )}
                      {showGroupHeader && (
                        <tr>
                        <td
                            colSpan={columns.length + 2}
                            className="premium-table-cell group-header-cell"
                          >
                            <div
                              className="group-header-content"
                            >
                              {showGroupHeaderBadge !== false && (
                                <span className={`group-header-badge${(groupConfig[groupKey] as any)?.isCardio ? ' is-cardio' : ''}`}>
                                  {groupKey}
                                </span>
                              )}
                              {renderGroupHeader ? (
                                renderGroupHeader(groupKey, groupConfig[groupKey] as EditableTableGroupConfig, groupRowsData)
                              ) : (
                                <span className="group-header-label">
                                  {groupConfig[groupKey]?.label || groupKey}
                                </span>
                              )}
                              {groupAddRow && groupAddRow[groupKey] && (
                                <button
                                  type="button"
                                  onClick={groupAddRow[groupKey]}
                                  className="menu-group-add-btn menu-group-add-btn--primary"
                                >
                                  {groupAddRowLabel || "+ Alimento"}
                                </button>
                              )}
                              {onReorderGroup && groupKey && !isUngrouped && (
                                <>
                                  <button
                                    type="button"
                                    disabled={gi === 0}
                                    onClick={() => onReorderGroup(groupKey, (groupRows[gi - 1] as { key: string | null })?.key || '', 'up')}
                                    className="menu-group-add-btn"
                                    title="Mover bloque hacia arriba"
                                  >
                                    ↑
                                  </button>
                                  <button
                                    type="button"
                                    disabled={gi === groupRows.length - 1}
                                    onClick={() => onReorderGroup(groupKey, (groupRows[gi + 1] as { key: string | null })?.key || '', 'down')}
                                    className="menu-group-add-btn"
                                    title="Mover bloque hacia abajo"
                                  >
                                    ↓
                                  </button>
                                </>
                              )}
                              {onCopyBlock && copyBlockTargets && copyBlockTargets.length > 0 && groupKey && !isUngrouped && (
                                <select
                                  className="menu-group-add-btn menu-group-add-btn--ghost"
                                  value=""
                                  title="Copiar bloque a otro día"
                                  onChange={(e) => {
                                    if (e.target.value) onCopyBlock(groupKey, e.target.value);
                                  }}
                                >
                                  <option value="">Copiar…</option>
                                  {copyBlockTargets.map((t) => (
                                    <option key={t.value} value={t.value}>{t.label}</option>
                                  ))}
                                </select>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                      {groupRowsData.map((row, idx) => (
                        <React.Fragment
                          key={getRowId ? getRowId(row, idx) : String(idx)}
                        >
                             <tr
                               className={
                                 "premium-table-row" +
                                 (row.isFirstInBlock
                                   ? " premium-table-row--first"
                                   : "") +
                                 (row.isLastInBlock
                                   ? " premium-table-row--last"
                                   : "") +
                                 (row.isOption ? " premium-table-row--option" : "") +
                                 (groupKey
                                   ? " premium-table-row--grouped"
                                   : "") +
                                 (row.isAprox ? " premium-table-row--aprox" : "") +
                                 (dropUid === (getRowId ? getRowId(row, idx) : String(idx))
                                   ? " drop-row-active"
                                   : "")
                               }
                              onDragStart={handleDragStart(
                                getRowId ? getRowId(row, idx) : String(idx),
                              )}
                              onDragEnd={handleDragEnd}
                              onDragOver={handleDragOver(
                                getRowId ? getRowId(row, idx) : String(idx),
                              )}
                              onDrop={handleDrop(
                                getRowId ? getRowId(row, idx) : String(idx),
                              )}
                              onDragEnter={handleDragEnter}
                              onDragLeave={handleDragLeave}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' && (e.target as HTMLElement).tagName === 'INPUT') {
                                  e.preventDefault();
                                  onRowEnter && onRowEnter(getRowId ? getRowId(row, idx) : String(idx));
                                }
                              }}
                              style={dropUid === (getRowId ? getRowId(row, idx) : String(idx)) ? undefined : undefined}
                            >
                              <td
                                className="premium-table-cell-base premium-table-cell--center col-drag"
                              >
                              <span
                                draggable
                                data-drag-handle
                                className="drag-handle drag-handle--tooltip"
                                title="Arrastrar para reordenar"
                              >
                                {variant === 'training' && rowBadge ? rowBadge(row, idx) : (rowBadge ? rowBadge(row, idx) : '⋮⋮')}
                              </span>
                            </td>
                            {columns.map((col) => (
                              <td
                                key={col.key}
                                className={
                                  "premium-table-cell-base " +
                                  (col.className || "")
                                }
                                style={{
                                  minWidth: col.minWidth || "auto",
                                  maxWidth: col.maxWidth || "none",
                                  width: col.width || "auto",
                                  textAlign: col.align || "left",
                                  ...(col.style || {}),
                                }}
                              >
                                {col.render
                                  ? col.render(
                                      row[col.key as keyof T],
                                      row,
                                      (field, value) =>
                                        onUpdateRow &&
                                        onUpdateRow(
                                          getRowId
                                            ? getRowId(row, idx)
                                            : String(idx),
                                          field,
                                          value,
                                        ),
                                      getRowId
                                        ? getRowId(row, idx)
                                        : String(idx),
                                      idx,
                                    )
                                  : (row[col.key as keyof T] ?? "")}
                              </td>
                            ))}
                            <td
                              className="premium-table-cell-base premium-table-cell--center col-action"
                            >
                              <button
                                onClick={() =>
                                  onRemoveRow &&
                                  onRemoveRow(
                                    getRowId ? getRowId(row, idx) : String(idx),
                                  )
                                }
                                className="premium-btn-delete"
                                type="button"
                              >
                                <X size={9} />
                              </button>
                            </td>
                          </tr>
                        </React.Fragment>
                      ))}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      {onAddRow && !groupAddRow && (
        <button
          onClick={onAddRow}
          className="menu-group-add-btn menu-group-add-btn--primary mt-4"
        >
          {addButtonLabel || "+ AGREGAR FILA"}
        </button>
      )}
    </div>
  );
}
