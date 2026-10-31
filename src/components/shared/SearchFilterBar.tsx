import React from 'react';
import { Search, X } from 'lucide-react';

interface CategoryOption {
  id: string;
  label: string;
  count?: number;
}

interface SearchFilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  categories?: CategoryOption[];
  activeCategory?: string;
  onCategoryChange?: (categoryId: string) => void;
  placeholder?: string;
  totalResults?: number;
  rightAction?: React.ReactNode;
}

export const SearchFilterBar: React.FC<SearchFilterBarProps> = ({
  searchQuery,
  onSearchChange,
  categories,
  activeCategory,
  onCategoryChange,
  placeholder = 'Search by title, subject code, or keyword...',
  totalResults,
  rightAction,
}) => {
  return (
    <div className="space-y-3 mb-6">
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        {/* Search Field */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={placeholder}
            className="block w-full pl-10 pr-9 py-2.5 text-sm bg-white border border-slate-200 rounded-xl placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-shadow shadow-sm"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Right actions (e.g. Export, Add New, Sort) */}
        {rightAction && <div className="flex-shrink-0 flex items-center gap-2">{rightAction}</div>}
      </div>

      {/* Category Filter Pills & Results Counter */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
        {categories && categories.length > 0 && onCategoryChange && (
          <div className="flex flex-wrap items-center gap-1.5">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => onCategoryChange(cat.id)}
                  className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <span>{cat.label}</span>
                  {cat.count !== undefined && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                        isActive ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {cat.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {totalResults !== undefined && (
          <div className="text-xs text-slate-500 ml-auto font-medium">
            Showing <span className="font-semibold text-slate-800">{totalResults}</span> {totalResults === 1 ? 'record' : 'records'}
          </div>
        )}
      </div>
    </div>
  );
};
