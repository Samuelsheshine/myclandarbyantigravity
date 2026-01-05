import React, { useState, useEffect, useRef } from 'react';
import { TIME_SLOTS, DAYS } from '../utils/constants';
import { getMonday } from '../utils/dateHelpers';

export default function ScheduleTable({ currentViewDate, gridData, setGridData, isEditing, onDateClick, t }) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(null); // { r, c }
  const [dragEnd, setDragEnd] = useState(null);     // { r, c }
  const tableRef = useRef(null);

  // 計算表頭日期
  const mondayDate = getMonday(currentViewDate);
  const headerDates = Array(7).fill(0).map((_, i) => {
    const d = new Date(mondayDate);
    d.setDate(mondayDate.getDate() + i);
    return {
      date: `${d.getMonth() + 1}/${d.getDate()}`,
      day: t('daysShort')[i],
      fullDate: d
    };
  });

  // --- 拖曳邏輯 ---
  const handleCellChange = (r, c, text) => {
    const newGrid = [...gridData];
    newGrid[r] = [...newGrid[r]];
    newGrid[r][c] = { ...newGrid[r][c], text };
    setGridData(newGrid);
  };

  const handleMouseDown = (e, r, c) => {
    if (!isEditing) return; // Disable drag if not editing
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ r, c });
    setDragEnd({ r, c });
  };

  const handleMouseEnter = (r, c) => {
    if (isDragging && dragStart) {
      // 限制只能同列合併
      if (c === dragStart.c) {
        setDragEnd({ r, c });
      }
    }
  };

  const handleMouseUp = () => {
    if (isDragging && dragStart && dragEnd) {
      const col = dragStart.c;
      const startRow = dragStart.r;
      let endRow = dragEnd.r;
      if (endRow < startRow) endRow = startRow;

      const newGrid = JSON.parse(JSON.stringify(gridData));
      const currentCell = newGrid[startRow][col];
      const oldRowSpan = currentCell.rowSpan;
      const oldEndRow = startRow + oldRowSpan - 1;
      const newRowSpan = endRow - startRow + 1;

      // 1. 擴展
      if (newRowSpan > oldRowSpan) {
        for (let r = oldEndRow + 1; r <= endRow; r++) {
          newGrid[r][col].show = false;
          newGrid[r][col].rowSpan = 1;
        }
      }
      // 2. 縮回
      else if (newRowSpan < oldRowSpan) {
        for (let r = endRow + 1; r <= oldEndRow; r++) {
          newGrid[r][col].show = true;
          newGrid[r][col].rowSpan = 1;
        }
      }

      newGrid[startRow][col].rowSpan = newRowSpan;
      setGridData(newGrid);
    }

    setIsDragging(false);
    setDragStart(null);
    setDragEnd(null);
  };

  // 全域 MouseUp 監聽
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isDragging) handleMouseUp();
    };
    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
  }, [isDragging, dragStart, dragEnd]);

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 overflow-hidden rounded-sm transition-colors duration-200">
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-200 dark:border-gray-700 text-sm text-center" ref={tableRef}>
          <thead>
            <tr>
              <th className="sticky-col border border-gray-200 dark:border-gray-700 px-4 py-4 w-24 bg-white dark:bg-gray-800 transition-colors duration-200"></th>
              {headerDates.map((h, i) => (
                <th
                  key={i}
                  onClick={() => onDateClick && onDateClick(h.fullDate)}
                  className="border border-gray-200 dark:border-gray-700 px-2 py-3 text-xs font-bold text-gray-900 dark:text-gray-100 uppercase min-w-[100px] bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors duration-200"
                >
                  {h.date}({h.day})
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TIME_SLOTS.map((slot, r) => (
              <tr key={slot.id} className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors duration-150">
                <td className="sticky-col border border-gray-200 dark:border-gray-700 px-2 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 transition-colors duration-200">
                  <div className="flex flex-col items-center justify-center">
                    <span className="text-xs text-gray-800 dark:text-gray-200 font-bold mb-1">
                      {t('timeSlotLabel').replace('{0}', slot.id)}
                    </span>
                    <span className="text-[10px] text-gray-500 dark:text-gray-400 font-mono">{slot.time}</span>
                  </div>
                </td>
                {gridData[r].map((cell, c) => {
                  if (!cell.show) return null;

                  // 計算拖曳高亮
                  let isHighlight = false;
                  if (isDragging && dragStart && dragEnd && dragStart.c === c) {
                    const minR = Math.min(dragStart.r, dragEnd.r);
                    const maxR = Math.max(dragStart.r, dragEnd.r);
                    if (r >= minR && r <= maxR) isHighlight = true;
                  }

                  return (
                    <td
                      key={`${r}-${c}`}
                      rowSpan={cell.rowSpan}
                      className={`p-0 border border-gray-200 dark:border-gray-700 relative align-top cell-container bg-white dark:bg-gray-800 transition-colors`}
                      onMouseEnter={() => handleMouseEnter(r, c)}
                    >
                      <div
                        contentEditable={isEditing}
                        suppressContentEditableWarning
                        onBlur={(e) => handleCellChange(r, c, e.currentTarget.textContent)}
                        className={`w-full h-full min-h-[60px] p-2 flex items-center justify-center text-gray-700 dark:text-gray-200 outline-none focus:bg-gray-50 dark:focus:bg-gray-700 focus:ring-2 focus:ring-inset focus:ring-gray-300 dark:focus:ring-gray-600 z-10 relative text-sm ${isEditing ? 'cursor-text' : 'cursor-default'} ${isHighlight ? 'drag-over' : ''}`}
                        style={{ height: cell.rowSpan > 1 ? `${cell.rowSpan * 100}%` : 'auto' }}
                      >
                        {cell.text}
                      </div>
                      {isEditing && (
                        <div
                          className="resize-handle"
                          onMouseDown={(e) => handleMouseDown(e, r, c)}
                        />
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}