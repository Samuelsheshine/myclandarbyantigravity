import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Upload, Pencil, Check } from 'lucide-react';
import CalendarGrid from './CalendarGrid';

export default function CalendarSection({
  calendarViewDate,
  setCalendarViewDate,
  calendarEvents,
  handleFileUpload,
  currentViewDate,
  setCurrentViewDate,

  isEditing,
  t,
  language
}) {

  const changeMonth = (offset) => {
    const newDate = new Date(calendarViewDate);
    newDate.setMonth(newDate.getMonth() + offset);
    setCalendarViewDate(newDate);
  };

  return (
    <div id="calendar-section" className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-sm overflow-hidden transition-colors duration-200">
      <div className="p-4 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 flex flex-wrap justify-between items-center gap-4 transition-colors">
        <div className="flex items-center gap-3">
          <button onClick={() => changeMonth(-1)} className="p-1 text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white dark:hover:bg-gray-700 rounded transition-colors">
            <ChevronLeft size={16} />
          </button>
          <h3 className="font-bold text-gray-800 dark:text-gray-200 text-lg w-32 text-center">
            {language === 'en'
              ? `${t('months')[calendarViewDate.getMonth()]} ${calendarViewDate.getFullYear()}`
              : `${calendarViewDate.getFullYear()}年 ${calendarViewDate.getMonth() + 1}月`
            }
          </h3>
          <button onClick={() => changeMonth(1)} className="p-1 text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white dark:hover:bg-gray-700 rounded transition-colors">
            <ChevronRight size={16} />
          </button>
        </div>

        <div className="flex items-center gap-2">

          <label className="no-print inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 shadow-sm text-xs font-medium rounded text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer transition-colors">
            <Upload size={14} className="mr-1.5 text-indigo-500 dark:text-indigo-400" /> {t('importICS')}
            <input type="file" accept=".ics" className="hidden" onChange={handleFileUpload} />
          </label>
          <span className="text-xs text-gray-400 no-print">{t('clickToSwitchWeek')}</span>
        </div>
      </div>



      <div className="grid grid-cols-7 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-center text-xs font-bold text-gray-500 dark:text-gray-400 py-2 transition-colors">
        {t('weekDays').map(d => <div key={d}>{d}</div>)}
      </div>

      <div className="grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-700 border border-gray-200 dark:border-gray-700 transition-colors">
        <CalendarGrid
          year={calendarViewDate.getFullYear()}
          month={calendarViewDate.getMonth()}
          events={calendarEvents}
          currentWeekStart={currentViewDate} // 傳入當前週檢視以計算 Highlight
          onDateClick={(d) => setCurrentViewDate(d)}
          isEditing={isEditing}
        />
      </div>
    </div >
  );
}