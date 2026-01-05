import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Sun, Moon, Download, Upload, Pencil, Check, Settings, Menu } from 'lucide-react';
import { getMonday, getDateRangeStr } from '../utils/dateHelpers';

export default function Header({ currentViewDate, changeWeek, resetToToday, isDarkMode, toggleTheme, onExport, onImport, isEditing, onToggleEdit, language, setLanguage, t }) {
  const mondayDate = getMonday(currentViewDate);
  const dateRangeStr = getDateRangeStr(mondayDate);
  const isCurrentWeek = mondayDate.getTime() === getMonday(new Date()).getTime();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const settingsRef = useRef(null);

  // Close settings on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setIsSettingsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50 no-print transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">

        {/* Left: Navigation & Date */}
        <div className="flex items-center gap-2 sm:gap-4 overflow-hidden">
          <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1 transition-colors duration-200 flex-shrink-0">
            <button onClick={() => changeWeek(-1)} className="p-1.5 sm:p-2 text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white dark:hover:bg-gray-700 rounded-md transition-all">
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={resetToToday}
              className={`hidden sm:block px-3 py-1 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white dark:hover:bg-gray-700 rounded-md transition-all ${isCurrentWeek ? 'hidden' : ''}`}
            >
              {t('backToWeek')}
            </button>
            <button
              onClick={resetToToday}
              className={`sm:hidden px-2 py-1 text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white dark:hover:bg-gray-700 rounded-md transition-all ${isCurrentWeek ? 'hidden' : ''}`}
            >
              Today
            </button>
            <button onClick={() => changeWeek(1)} className="p-1.5 sm:p-2 text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white dark:hover:bg-gray-700 rounded-md transition-all">
              <ChevronRight size={16} />
            </button>
          </div>
          <div className="text-sm sm:text-xl font-bold text-gray-800 dark:text-gray-200 tracking-wider font-mono whitespace-nowrap truncate">
            {dateRangeStr}
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">

          {/* Edit Button (Always Visible) */}
          <button
            onClick={onToggleEdit}
            className={`inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 border shadow-sm text-sm font-medium rounded-md transition-colors whitespace-nowrap ${isEditing
              ? 'border-indigo-300 dark:border-indigo-700 text-indigo-700 dark:text-indigo-200 bg-indigo-50 dark:bg-indigo-900/30 hover:bg-indigo-100 dark:hover:bg-indigo-800/50'
              : 'border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
          >
            {isEditing ? (
              <>
                <Check size={16} className="mr-0 sm:mr-2" /> <span className="hidden sm:inline">{t('done')}</span>
              </>
            ) : (
              <>
                <Pencil size={16} className="mr-0 sm:mr-2" /> <span className="hidden sm:inline">{t('editContent')}</span>
              </>
            )}
          </button>

          {/* Settings Dropdown */}
          <div className="relative" ref={settingsRef}>
            <button
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
              className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
              title="Settings"
            >
              <Settings size={20} />
            </button>

            {isSettingsOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 dark:divide-gray-700 animate-in fade-in zoom-in-95 duration-100 origin-top-right">

                {/* Theme & Language */}
                <div className="p-1">
                  <button
                    onClick={() => { toggleTheme(); }}
                    className="w-full text-left flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    {isDarkMode ? <Sun size={16} className="mr-2" /> : <Moon size={16} className="mr-2" />}
                    {t('toggleTheme')}
                  </button>

                  <div className="flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-200">
                    <span className="flex-grow">Language</span>
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="ml-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:outline-none"
                    >
                      <option value="zh">繁體中文</option>
                      <option value="en">English</option>
                      <option value="ja">日本語</option>
                    </select>
                  </div>
                </div>

                {/* Import/Export */}
                <div className="p-1">
                  <label className="w-full text-left flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                    <Upload size={16} className="mr-2" />
                    {t('importJSON')}
                    <input type="file" accept=".json" className="hidden" onChange={(e) => {
                      onImport(e);
                      setIsSettingsOpen(false);
                    }} />
                  </label>
                  <button
                    onClick={() => { onExport(); setIsSettingsOpen(false); }}
                    className="w-full text-left flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <Download size={16} className="mr-2" />
                    {t('exportJSON')}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
