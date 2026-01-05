import React from 'react';
import { Plus, Calendar, CheckSquare, Square, Trash2 } from 'lucide-react';
import { DAYS } from '../utils/constants';

export default function DailySection({ date, tasks, setTasks, events, isEditing, t }) {
    const dayIndex = date.getDay() === 0 ? 6 : date.getDay() - 1;
    const dayName = t('daysShort')[dayIndex];
    const dateStr = `${date.getFullYear()}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')} (${dayName})`;

    const addTask = () => setTasks([...tasks, { text: '新事項...', completed: false }]);

    const updateTask = (idx, text) => {
        const newTasks = [...tasks];
        newTasks[idx] = { ...newTasks[idx], text };
        setTasks(newTasks);
    };

    const toggleTask = (idx) => {
        if (!tasks[idx].completed) {
            if (window.confirm(t('confirmComplete'))) {
                const newTasks = [...tasks];
                newTasks[idx] = { ...newTasks[idx], completed: true };
                setTasks(newTasks);
            }
        } else {
            // Allowing uncheck without confirm, or maybe confirm too? Defaulting to no confirm to uncheck.
            const newTasks = [...tasks];
            newTasks[idx] = { ...newTasks[idx], completed: false };
            setTasks(newTasks);
        }
    };

    const removeTask = (idx) => {
        const newTasks = tasks.filter((_, i) => i !== idx);
        setTasks(newTasks);
    };

    const handleFocus = (idx, text) => {
        if (text === '新事項...') {
            updateTask(idx, '');
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 sm:p-6 rounded-sm transition-colors duration-200">
            <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    <span>{t('dailyTasks')}</span>
                    <span className="text-sm font-normal text-gray-500 dark:text-gray-400"> - {dateStr}</span>
                </h2>
                {isEditing && (
                    <button onClick={addTask} className="no-print text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center gap-1 transition-colors">
                        <Plus size={14} /> {t('addTask')}
                    </button>
                )}
            </div>

            <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                {/* Calendar Events (Read-only) */}
                {events && events.map((event, idx) => (
                    <li key={`evt-${idx}`} className="flex items-center text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 px-2 py-1.5 rounded border border-indigo-100 dark:border-indigo-800/50">
                        <Calendar size={16} className="mr-2 flex-shrink-0" />
                        <span className="text-sm font-medium">{event}</span>
                    </li>
                ))}

                {/* Manual Tasks */}
                {tasks.map((taskObj, idx) => {
                    // Safe handling if migration failed or legacy state transiently exists
                    const taskText = typeof taskObj === 'string' ? taskObj : taskObj.text;
                    const isCompleted = typeof taskObj === 'string' ? false : taskObj.completed;

                    return (
                        <li key={`task-${idx}`} className="group flex items-center">
                            <button
                                onClick={() => toggleTask(idx)}
                                className={`mr-2 flex-shrink-0 transition-colors ${isCompleted ? 'text-green-500 hover:text-green-600' : 'text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300'}`}
                            >
                                {isCompleted ? <CheckSquare size={18} /> : <Square size={18} />}
                            </button>

                            <input
                                type="text"
                                value={taskText}
                                onChange={(e) => updateTask(idx, e.target.value)}
                                onFocus={() => handleFocus(idx, taskText)}
                                readOnly={!isEditing}
                                className={`flex-grow outline-none p-1 border-b border-transparent transition-all rounded text-gray-800 dark:text-gray-200 
                                    ${!isEditing ? 'cursor-default bg-transparent' : ''}
                                    ${taskText === '新事項...'
                                        ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                                        : 'bg-transparent hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-100 dark:hover:border-gray-600'
                                    }
                                    ${isCompleted ? 'line-through text-gray-400 dark:text-gray-500' : ''}
                                `}
                            />
                            {isEditing && (
                                <button onClick={() => removeTask(idx)} className="no-print opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 ml-2">
                                    <Trash2 size={16} />
                                    {/* Using Trash2 instead of x text for better UI */}
                                </button>
                            )}
                        </li>
                    );
                })}

                {(!events || events.length === 0) && tasks.length === 0 && (
                    <li className="text-gray-400 dark:text-gray-600 italic text-sm py-2">
                        {t('noEvents')}
                    </li>
                )}
            </ul>
        </div>
    );
}
