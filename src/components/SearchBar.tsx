import { useState, useCallback } from "react";

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export default function SearchBar({ onSearch, placeholder = "Search stations..." }: SearchBarProps) {
  const [value, setValue] = useState("");

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const trimmed = value.trim();
      if (trimmed) onSearch(trimmed);
    },
    [value, onSearch]
  );

  const handleClear = useCallback(() => {
    setValue("");
    onSearch("");
  }, [onSearch]);

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <div className="relative flex items-center group">
        {/* Search icon */}
        <div className="absolute left-5 flex items-center justify-center">
          <svg
            className="h-5 w-5 text-accent-secondary group-focus-within:text-accent transition-colors duration-300"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        </div>

        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-white border-2 border-border/60 rounded-2xl pl-14 pr-12 py-4 text-base text-text-primary placeholder:text-text-dim/50 outline-none transition-all duration-500 focus:border-accent/40 focus:bg-surface-light/30 shadow-sm focus:shadow-retro group-hover:border-accent/20"
        />

        {value ? (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-4 w-8 h-8 rounded-full flex items-center justify-center text-text-dim hover:bg-surface-light hover:text-danger transition-all duration-300"
            aria-label="Clear search"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        ) : (
          <div className="absolute right-4 w-8 h-8 rounded-full flex items-center justify-center text-accent-secondary/30">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
               <path d="M5 12h14" />
            </svg>
          </div>
        )}
      </div>
    </form>
  );
}
