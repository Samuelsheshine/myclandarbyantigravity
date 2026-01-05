import React from 'react';
import { ChevronLeft, ChevronRight, Sun, Moon, Download, Upload, Pencil, Check, Languages } from 'lucide-react';
import { getMonday, getDateRangeStr } from '../utils/dateHelpers';

export default function Header({ currentViewDate, changeWeek, resetToToday, isDarkMode, toggleTheme, onExport, onImport, isEditing, onToggleEdit, language, setLanguage, t }) {
  const mondayDate = getMonday(currentViewDate);
  const dateRangeStr = getDateRangeStr(mondayDate);
  const isCurrentWeek = mondayDate.getTime() === getMonday(new Date()).getTime();

  return (

    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50 no-print transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1 transition-colors duration-200">
            <button onClick={() => changeWeek(-1)} className="p-2 text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white dark:hover:bg-gray-700 rounded-md transition-all">
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={resetToToday}
              className={`px-3 py-1 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white dark:hover:bg-gray-700 rounded-md transition-all ${isCurrentWeek ? 'hidden' : ''}`}
            >
              {t('backToWeek')}
            </button>
            <button onClick={() => changeWeek(1)} className="p-2 text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white dark:hover:bg-gray-700 rounded-md transition-all">
              <ChevronRight size={16} />
            </button>
          </div>
          <div className="text-xl font-bold text-gray-800 dark:text-gray-200 tracking-wider font-mono">
            {dateRangeStr}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
            title={t('toggleTheme')}
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <div className="relative flex items-center">
            <Languages size={16} className="absolute left-2 text-gray-500 dark:text-gray-400 pointer-events-none" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-sm border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              title={t('selectLanguage')}
            >
              <option value="zh">繁體中文</option>
              <option value="en">English</option>
              <option value="ja">日本語</option>
            </select>
          </div>

          <button
            onClick={onToggleEdit}
            className={`inline-flex items-center px-4 py-2 border shadow-sm text-sm font-medium rounded-md transition-colors ${isEditing
              ? 'border-indigo-300 dark:border-indigo-700 text-indigo-700 dark:text-indigo-200 bg-indigo-50 dark:bg-indigo-900/30 hover:bg-indigo-100 dark:hover:bg-indigo-800/50'
              : 'border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
          >
            {isEditing ? (
              <>
                <Check size={16} className="mr-2" /> {t('done')}
              </>
            ) : (
              <>
                <Pencil size={16} className="mr-2" /> {t('editContent')}
              </>
            )}
          </button>

          <label className="inline-flex items-center px-4 py-2 border border-blue-300 dark:border-blue-700 shadow-sm text-sm font-medium rounded-md text-blue-700 dark:text-blue-200 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-800/50 transition-colors cursor-pointer">
            <Upload size={16} className="mr-2" /> {t('importJSON')}
            <input type="file" accept=".json" className="hidden" onChange={onImport} />
          </label>

          <button onClick={onExport} className="inline-flex items-center px-4 py-2 border border-green-300 dark:border-green-700 shadow-sm text-sm font-medium rounded-md text-green-700 dark:text-green-200 bg-green-50 dark:bg-green-900/30 hover:bg-green-100 dark:hover:bg-green-800/50 transition-colors">
            <Download size={16} className="mr-2" /> {t('exportJSON')}
          </button>
        </div>
      </div>
    </header>
  );
}
