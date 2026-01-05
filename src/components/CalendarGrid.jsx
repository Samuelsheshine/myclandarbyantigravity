import React from 'react';
import { formatDateKey } from '../utils/dateHelpers';

export default function CalendarGrid({ year, month, events, currentWeekStart, onDateClick, isEditing }) {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay(); // 0(Sun) - 6(Sat)
  const startOffset = (firstDay + 6) % 7; // 調整為週一開始

  const cells = [];
  const today = new Date();

  // 計算本週檢視範圍
  const viewStart = new Date(currentWeekStart).setHours(0, 0, 0, 0);
  const viewEnd = new Date(currentWeekStart);
  viewEnd.setDate(viewEnd.getDate() + 6);
  const viewEndTs = viewEnd.setHours(23, 59, 59, 999);

  // 1. 空白填充
  for (let i = 0; i < startOffset; i++) {
    cells.push(<div key={`empty-${i}`} className="bg-gray-50 dark:bg-gray-800 min-h-[100px] transition-colors" />);
  }

  // 2. 日期填充
  for (let d = 1; d <= daysInMonth; d++) {
    const dateObj = new Date(year, month, d);
    const dateKey = formatDateKey(dateObj);
    const isToday = dateObj.toDateString() === today.toDateString();

    const ts = dateObj.getTime();
    const isActive = ts >= viewStart && ts <= viewEndTs;

    const dayEvents = events[dateKey] || [];

    cells.push(
      <div
        key={d}
        onClick={() => onDateClick(dateObj)}
        className={`bg-white dark:bg-gray-800 min-h-[100px] p-1 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex flex-col ${isActive ? 'bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50' : ''}`}
      >
        <div className={`w-5 h-5 flex items-center justify-center text-xs font-semibold rounded-full mb-1 ${isToday ? 'bg-indigo-600 dark:bg-indigo-500 text-white' : 'text-gray-700 dark:text-gray-300'}`}>
          {d}
        </div>
        <div className="flex-grow flex flex-col gap-0.5 overflow-hidden">
          {dayEvents.map((evt, idx) => (
            <div key={idx} className="text-[10px] px-1 py-0.5 bg-indigo-50 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-200 rounded truncate transition-colors" title={evt}>
              {evt}
            </div>
          ))}
          {/* 簡單的 contentEditable 用於月曆備註，不存入主要 state (可擴充) */}
          <div
            contentEditable={isEditing}
            onClick={e => e.stopPropagation()}
            className={`flex-grow outline-none min-h-[1em] text-gray-700 dark:text-gray-300 ${isEditing ? 'cursor-text' : 'cursor-default'}`}
          />
        </div>
      </div>
    );
  }

  return <>{cells}</>;
}