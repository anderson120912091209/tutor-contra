"use client";

import { useState, useEffect, useRef } from "react";
import { searchUniversities, type University } from "@/lib/data/universities";

interface UniversityAutocompleteProps {
  value: string;
  onSelect: (university: University) => void;
}

export function UniversityAutocomplete({ value, onSelect }: UniversityAutocompleteProps) {
  const [query, setQuery] = useState(value);
  const [results, setResults] = useState<University[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.length > 0) {
      const filtered = searchUniversities(query);
      setResults(filtered);
      setIsOpen(true);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  }, [query]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (uni: University) => {
    setQuery(uni.name);
    setIsOpen(false);
    onSelect(uni);
  };

  return (
    <div ref={wrapperRef} className="relative">
      <label className="text-sm font-medium">大學 *</label>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => query && setIsOpen(true)}
        className="w-full p-2 border rounded-md mt-1"
        placeholder="輸入大學名稱..."
        required
      />

      {isOpen && results.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
          {results.map((uni) => (
            <button
              key={uni.id}
              type="button"
              onClick={() => handleSelect(uni)}
              className="w-full px-4 py-2 text-left hover:bg-accent transition-colors flex items-center gap-3"
            >
              <span className="text-2xl">{uni.logo}</span>
              <div className="flex-1">
                <div className="font-medium">{uni.name}</div>
                <div className="text-xs text-muted-foreground">
                  {uni.location} • 排名 #{uni.ranking}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

