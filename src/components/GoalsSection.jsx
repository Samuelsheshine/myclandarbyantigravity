import React from 'react';
import { Plus } from 'lucide-react';

const DEFAULT_PLACEHOLDERS = ['點擊這裡輸入主要目標...', '輸入次要目標...', '新目標...'];

export default function GoalsSection({ goals, setGoals, isEditing, t }) {
  const addGoal = () => setGoals([...goals, '新目標...']);

  const updateGoal = (idx, text) => {
    const newGoals = [...goals];
    newGoals[idx] = text;
    setGoals(newGoals);
  };

  const removeGoal = (idx) => {
    const newGoals = goals.filter((_, i) => i !== idx);
    setGoals(newGoals);
  };

  const handleFocus = (idx, text) => {
    if (DEFAULT_PLACEHOLDERS.includes(text)) {
      updateGoal(idx, '');
    }
  };

  return (
    <div id="goals-section" className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 sm:p-6 rounded-sm transition-colors duration-200">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">{t('weeklyGoals')}</h2>
        {isEditing && (
          <button onClick={addGoal} className="no-print text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center gap-1 transition-colors">
            <Plus size={14} /> {t('addGoal')}
          </button>
        )}
      </div>
      <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
        {goals.map((goal, idx) => (
          <li key={idx} className="group flex items-center">
            <span className="mr-2 text-gray-300">•</span>
            <input
              type="text"
              value={goal}
              onChange={(e) => updateGoal(idx, e.target.value)}
              onFocus={() => handleFocus(idx, goal)}
              readOnly={!isEditing}
              className={`flex-grow outline-none p-1 border-b border-transparent transition-all rounded text-gray-800 dark:text-gray-200 
                ${!isEditing ? 'cursor-default bg-transparent' : ''}
                ${DEFAULT_PLACEHOLDERS.includes(goal)
                  ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                  : 'bg-transparent hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-100 dark:hover:border-gray-600'
                }`}
            />
            {isEditing && (
              <button onClick={() => removeGoal(idx)} className="no-print opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 ml-2">×</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
