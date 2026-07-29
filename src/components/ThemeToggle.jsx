import React from 'react';
import { useApp } from '../context/AppContext';
import { Sun, Moon, Monitor } from 'lucide-react';

export const ThemeToggle = ({ compact = false }) => {
  const { theme, setTheme, effectiveTheme } = useApp();

  const themes = [
    { id: 'dark', label: 'Dark', icon: Moon },
    { id: 'light', label: 'White', icon: Sun },
    { id: 'system', label: 'System', icon: Monitor },
  ];

  if (compact) {
    return (
      <div className="flex items-center bg-zinc-900 dark:bg-zinc-900 light:bg-slate-200 p-1 rounded-full border border-zinc-700/50 light:border-slate-300">
        {themes.map((item) => {
          const Icon = item.icon;
          const isActive = theme === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setTheme(item.id)}
              className={`p-1.5 rounded-full transition-all text-xs flex items-center justify-center ${
                isActive
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-zinc-400 hover:text-white light:text-slate-600 light:hover:text-slate-900'
              }`}
              title={`Switch to ${item.label} Mode`}
            >
              <Icon className="w-3.5 h-3.5" />
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1 bg-zinc-900/90 dark:bg-zinc-900/90 light:bg-slate-100 p-1 rounded-2xl border border-zinc-800 light:border-slate-300 shadow-inner">
      {themes.map((item) => {
        const Icon = item.icon;
        const isActive = theme === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setTheme(item.id)}
            className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              isActive
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                : 'text-zinc-400 hover:text-white light:text-slate-600 light:hover:text-slate-900'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};
