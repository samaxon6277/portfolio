import React from 'react';

export interface TabOption<T = string> {
  id: T;
  label: string;
  icon?: React.ReactNode;
  badge?: string | number;
  disabled?: boolean;
}

export interface CustomTabsProps<T = string> {
  tabs: TabOption<T>[];
  activeTab: T;
  onChange: (tabId: T) => void;
  variant?: 'pills' | 'underline' | 'boxed';
  className?: string;
}

export default function CustomTabs<T extends string = string>({
  tabs,
  activeTab,
  onChange,
  variant = 'pills',
  className = ''
}: CustomTabsProps<T>) {
  if (variant === 'underline') {
    return (
      <div className={`border-b border-neutral-200 overflow-x-auto scrollbar-none ${className}`}>
        <div className="flex items-center gap-6 min-w-max">
          {tabs.map((tab) => {
            const isActive = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                type="button"
                disabled={tab.disabled}
                onClick={() => onChange(tab.id)}
                className={`pb-3 relative text-xs font-bold transition-colors cursor-pointer flex items-center gap-2 ${
                  tab.disabled
                    ? 'text-neutral-300 cursor-not-allowed'
                    : isActive
                    ? 'text-[#111111]'
                    : 'text-neutral-500 hover:text-neutral-800'
                }`}
              >
                {tab.icon && <span className="w-3.5 h-3.5">{tab.icon}</span>}
                <span>{tab.label}</span>
                {tab.badge !== undefined && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
                    isActive ? 'bg-[#111111] text-[#D6B46A]' : 'bg-neutral-100 text-neutral-600'
                  }`}>
                    {tab.badge}
                  </span>
                )}
                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D6B46A]" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className={`p-1.5 bg-neutral-100/90 rounded-2xl flex items-center gap-1 border border-neutral-200/80 overflow-x-auto scrollbar-none ${className}`}>
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            type="button"
            disabled={tab.disabled}
            onClick={() => onChange(tab.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              tab.disabled
                ? 'text-neutral-300 cursor-not-allowed'
                : isActive
                ? 'bg-[#111111] text-[#D6B46A] shadow-md'
                : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/60'
            }`}
          >
            {tab.icon && <span className="w-3.5 h-3.5">{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-mono font-bold ${
                isActive ? 'bg-[#D6B46A]/20 text-[#D6B46A]' : 'bg-neutral-200 text-neutral-600'
              }`}>
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
