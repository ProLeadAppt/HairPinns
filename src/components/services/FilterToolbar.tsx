import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface FilterToolbarProps {
  categories: string[];
  activeCategory: string | null;
  onCategoryChange: (category: string | null) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  quickFilters: string[];
  activeQuickFilters: string[];
  onQuickFilterToggle: (filter: string) => void;
}

export const FilterToolbar = ({
  categories,
  activeCategory,
  onCategoryChange,
  searchTerm,
  onSearchChange,
  quickFilters,
  activeQuickFilters,
  onQuickFilterToggle,
}: FilterToolbarProps) => {
  return (
    <div className="sticky top-0 z-20 bg-surface border-b border-border py-4 px-4 sm:px-6 lg:px-8" style={{ boxShadow: '0 2px 8px rgba(36,19,39,0.04)' }}>
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Category pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <button
            onClick={() => onCategoryChange(null)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              activeCategory === null
                ? "bg-brand-500 text-white"
                : "bg-muted text-text hover:bg-accent"
            }`}
          >
            All Services
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                activeCategory === category
                  ? "bg-brand-500 text-white"
                  : "bg-muted text-text hover:bg-accent"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Search and Quick Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <Input
              type="text"
              placeholder="Search services…"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 rounded-btn"
            />
          </div>

          {/* Quick Filters */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
            {quickFilters.map((filter) => (
              <button
                key={filter}
                onClick={() => onQuickFilterToggle(filter)}
                className={`px-3 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all border ${
                  activeQuickFilters.includes(filter)
                    ? "bg-brand-500 text-white border-brand-500"
                    : "bg-surface text-text border-border hover:bg-accent"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
