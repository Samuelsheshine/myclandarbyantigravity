import React, { useState, useEffect } from 'react';
import { LayoutGrid, Calendar } from 'lucide-react';
import Header from './components/Header';
import GoalsSection from './components/GoalsSection';
import DailySection from './components/DailySection';
import ScheduleTable from './components/ScheduleTable';
import CalendarSection from './components/CalendarSection';
import { NUM_ROWS, NUM_DAYS } from './utils/constants';
import { parseICS } from './utils/icsParser';
import { getMonday, formatDateKey } from './utils/dateHelpers';
import { translations } from './utils/translations';

export default function App() {
  // 1. 狀態管理
  const [currentViewDate, setCurrentViewDate] = useState(new Date());
  const [calendarViewDate, setCalendarViewDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState('schedule'); // 'schedule' | 'calendar'

  // Language State
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('language') || 'zh';
  });
  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const t = (key) => translations[language][key] || key;

  // Theme State
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (localStorage.getItem('theme') === 'dark') return true;
    return false;
  });

  // Edit Mode State
  const [isEditing, setIsEditing] = useState(false);
  const toggleEditMode = () => setIsEditing(prev => !prev);

  // Goals State (Key: Week Start Date "YYYY-MM-DD", Value: Array of goals)
  const [allGoals, setAllGoals] = useState(() => {
    const saved = localStorage.getItem('allGoals');
    return saved ? JSON.parse(saved) : {
      [formatDateKey(getMonday(new Date()))]: ['點擊這裡輸入主要目標...', '輸入次要目標...']
    };
  });

  useEffect(() => {
    localStorage.setItem('allGoals', JSON.stringify(allGoals));
  }, [allGoals]);

  // Computed: Current Goals
  const currentWeekMonday = getMonday(currentViewDate);
  const currentWeekKey = formatDateKey(currentWeekMonday);

  const currentGoals = allGoals[currentWeekKey] || ['點擊這裡輸入主要目標...', '輸入次要目標...'];

  const updateCurrentGoals = (newGoals) => {
    setAllGoals(prev => ({
      ...prev,
      [currentWeekKey]: newGoals
    }));
  };

  const [calendarEvents, setCalendarEvents] = useState(() => {
    const saved = localStorage.getItem('calendarEvents');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem('calendarEvents', JSON.stringify(calendarEvents));
  }, [calendarEvents]);

  // Daily Tasks State (Key: Date "YYYY-MM-DD", Value: Array of tasks)
  const [allDailyTasks, setAllDailyTasks] = useState(() => {
    const saved = localStorage.getItem('allDailyTasks');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem('allDailyTasks', JSON.stringify(allDailyTasks));
  }, [allDailyTasks]);
  const currentDateKey = formatDateKey(currentViewDate);
  const currentDailyTasks = allDailyTasks[currentDateKey] || [];
  const currentDayEvents = calendarEvents[currentDateKey] || [];

  const updateCurrentDailyTasks = (newTasks) => {
    setAllDailyTasks(prev => ({
      ...prev,
      [currentDateKey]: newTasks
    }));
  };

  // 課表資料初始值
  const [gridData, setGridData] = useState(() => {
    const saved = localStorage.getItem('gridData');
    if (saved) {
      return JSON.parse(saved);
    }
    const grid = [];
    for (let r = 0; r < NUM_ROWS; r++) {
      const row = [];
      for (let c = 0; c < NUM_DAYS; c++) {
        row.push({ text: '', rowSpan: 1, show: true });
      }
      grid.push(row);
    }
    return grid;
  });

  useEffect(() => {
    localStorage.setItem('gridData', JSON.stringify(gridData));
  }, [gridData]);

  // 2. 連動 Effect: 當週次改變，同步日曆月份
  // 2. 連動 Effect: 當週次改變，同步日曆月份
  useEffect(() => {
    setCalendarViewDate(new Date(currentViewDate));
  }, [currentViewDate]);

  // Dark Mode Effect
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  // 3. 動作處理
  const changeWeek = (offset) => {
    const newDate = new Date(currentViewDate);
    newDate.setDate(newDate.getDate() + offset * 7);
    setCurrentViewDate(newDate);
  };

  const resetToToday = () => {
    setCurrentViewDate(new Date());
  };

  const toggleTheme = () => setIsDarkMode(prev => !prev);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const parsed = parseICS(e.target.result);
      setCalendarEvents(prev => ({ ...prev, ...parsed }));
      alert('匯入成功！');
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleExportJSON = () => {
    const dataStr = JSON.stringify({ gridData, allGoals, allDailyTasks, calendarEvents }, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "schedule_backup.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJSON = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target.result);
        if (json.gridData) setGridData(json.gridData);

        // Handle legacy goals (array) or new allGoals (object)
        if (json.allGoals) {
          setAllGoals(json.allGoals);
        } else if (json.goals) {
          // Legacy: Assign imported goals to current week
          setAllGoals(prev => ({
            ...prev,
            [currentWeekKey]: json.goals
          }));
        }

        if (json.allDailyTasks) {
          setAllDailyTasks(json.allDailyTasks);
        }

        if (json.calendarEvents) setCalendarEvents(json.calendarEvents);
        alert('JSON 匯入成功！');
      } catch (error) {
        alert('JSON 格式錯誤，無法匯入。');
        console.error(error);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 font-sans min-h-screen flex flex-col select-none transition-colors duration-200">

      <Header
        currentViewDate={currentViewDate}
        changeWeek={changeWeek}
        resetToToday={resetToToday}
        isDarkMode={isDarkMode}
        toggleTheme={toggleTheme}
        onExport={handleExportJSON}
        onImport={handleImportJSON}
        isEditing={isEditing}
        onToggleEdit={toggleEditMode}
        language={language}
        setLanguage={setLanguage}
        t={t}
      />

      <main className="flex-grow p-4 md:p-6 lg:p-8 flex flex-col lg:flex-row gap-6">

        {/* Left Sidebar Navigation */}
        <aside className="w-full lg:w-64 flex-shrink-0 flex flex-col gap-2">
          <button
            onClick={() => setActiveTab('schedule')}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors font-medium
              ${activeTab === 'schedule'
                ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
          >
            <LayoutGrid size={20} className="flex-shrink-0" />
            <span className="truncate">{t('weeklySchedule')}</span>
          </button>

          <button
            onClick={() => setActiveTab('calendar')}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors font-medium
               ${activeTab === 'calendar'
                ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
          >
            <Calendar size={20} className="flex-shrink-0" />
            <span className="truncate">{t('calendar')}</span>
          </button>
        </aside>

        {/* Main Content Area */}
        <div className="flex-grow min-w-0 bg-transparent rounded-xl">
          {activeTab === 'schedule' ? (
            <div className="space-y-8 animate-in fade-in duration-300 slide-in-from-bottom-2">
              <GoalsSection goals={currentGoals} setGoals={updateCurrentGoals} isEditing={isEditing} t={t} />

              <DailySection
                date={currentViewDate}
                tasks={(currentDailyTasks || []).map(t => typeof t === 'string' ? { text: t, completed: false } : t)}
                setTasks={updateCurrentDailyTasks}
                events={currentDayEvents}
                isEditing={isEditing}
                t={t}
              />

              <ScheduleTable
                currentViewDate={currentViewDate}
                gridData={gridData}
                setGridData={setGridData}
                isEditing={isEditing}
                onDateClick={setCurrentViewDate}
                t={t}
                language={language}
              />
            </div>
          ) : (
            <div className="animate-in fade-in duration-300 slide-in-from-bottom-2">
              <CalendarSection
                calendarViewDate={calendarViewDate}
                setCalendarViewDate={setCalendarViewDate}
                calendarEvents={calendarEvents}
                handleFileUpload={handleFileUpload}
                currentViewDate={currentViewDate}
                setCurrentViewDate={(date) => {
                  setCurrentViewDate(date);
                  // Optional: Switch back to schedule when clicking a date?
                  // setActiveTab('schedule');
                }}
                isEditing={isEditing}
                t={t}
                language={language}
              />
            </div>
          )}
        </div>
      </main>

      <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 mt-auto py-8 no-print transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-400 text-sm">
          &copy; 2024 School Timetable Prototype.
        </div>
      </footer>
    </div>
  );
}
