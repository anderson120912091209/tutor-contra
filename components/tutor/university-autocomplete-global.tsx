"use client";

import { useState, useEffect, useRef } from "react";
import { searchUniversities, type University } from "@/lib/data/universities";
import { 
  searchUniversitiesGlobal, 
  POPULAR_COUNTRIES,
  type UniversitySearchResult 
} from "@/lib/api/universities-api";

interface UniversityAutocompleteGlobalProps {
  value: string;
  onSelect: (university: { 
    name: string; 
    universityId: string; 
    website: string;
    country?: string;
  }) => void;
}

export function UniversityAutocompleteGlobal({ 
  value, 
  onSelect 
}: UniversityAutocompleteGlobalProps) {
  const [query, setQuery] = useState(value);
  const [localResults, setLocalResults] = useState<University[]>([]);
  const [globalResults, setGlobalResults] = useState<UniversitySearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Search local (Taiwan) universities
  useEffect(() => {
    if (query.length > 0) {
      const filtered = searchUniversities(query);
      setLocalResults(filtered);
      setIsOpen(true);
    } else {
      setLocalResults([]);
    }
  }, [query]);

  // Search global universities (debounced)
  useEffect(() => {
    if (query.length < 2) {
      setGlobalResults([]);
      return;
    }

    setLoading(true);
    const timer = setTimeout(async () => {
      const results = await searchUniversitiesGlobal(
        query,
        selectedCountry || undefined
      );
      setGlobalResults(results);
      setLoading(false);
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
  }, [query, selectedCountry]);

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

  const handleSelectLocal = (uni: University) => {
    setQuery(uni.name);
    setIsOpen(false);
    onSelect({
      name: uni.name,
      universityId: uni.id,
      website: uni.website,
      country: "Taiwan",
    });
  };

  const handleSelectGlobal = (uni: UniversitySearchResult) => {
    setQuery(uni.name);
    setIsOpen(false);
    onSelect({
      name: uni.name,
      universityId: uni.id,
      website: uni.website,
      country: uni.country,
    });
  };

  const hasResults = localResults.length > 0 || globalResults.length > 0;

  return (
    <div ref={wrapperRef} className="relative space-y-2">
      <div>
        <label className="text-sm font-medium">大學 *</label>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query && setIsOpen(true)}
          className="w-full p-2 border rounded-md mt-1"
          placeholder="輸入大學名稱（支援全球大學）..."
          required
        />
      </div>

      {/* Country Filter */}
      <div className="flex gap-1 flex-wrap">
        <button
          type="button"
          onClick={() => setSelectedCountry("")}
          className={`px-2 py-1 text-xs rounded-full transition-colors ${
            selectedCountry === ""
              ? "bg-primary text-primary-foreground"
              : "bg-gray-100 hover:bg-gray-200"
          }`}
        >
          全部
        </button>
        {POPULAR_COUNTRIES.slice(0, 6).map((country) => (
          <button
            key={country.code}
            type="button"
            onClick={() => setSelectedCountry(country.nameEn)}
            className={`px-2 py-1 text-xs rounded-full transition-colors ${
              selectedCountry === country.nameEn
                ? "bg-primary text-primary-foreground"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            {country.name}
          </button>
        ))}
      </div>

      {isOpen && (query.length > 0) && (
        <div className="absolute z-50 w-full mt-1 bg-white border rounded-md shadow-lg max-h-96 overflow-auto">
          {/* Local (Taiwan) Results */}
          {localResults.length > 0 && (
            <div>
              <div className="px-4 py-2 bg-gray-50 border-b text-xs font-semibold text-gray-600">
                🇹🇼 台灣大學
              </div>
              {localResults.map((uni) => (
                <button
                  key={uni.id}
                  type="button"
                  onClick={() => handleSelectLocal(uni)}
                  className="w-full px-4 py-3 text-left hover:bg-accent transition-colors flex items-center gap-3 border-b"
                >
                  <span className="text-2xl">{uni.logo}</span>
                  <div className="flex-1">
                    <div className="font-medium">{uni.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {uni.location} • 排名 #{uni.ranking}
                    </div>
                  </div>
                  <div className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                    推薦
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Global Results */}
          {globalResults.length > 0 && (
            <div>
              <div className="px-4 py-2 bg-gray-50 border-b text-xs font-semibold text-gray-600">
                🌍 全球大學
              </div>
              {globalResults.map((uni) => (
                <button
                  key={uni.id}
                  type="button"
                  onClick={() => handleSelectGlobal(uni)}
                  className="w-full px-4 py-3 text-left hover:bg-accent transition-colors flex items-center gap-3 border-b"
                >
                  <span className="text-2xl">{uni.logo}</span>
                  <div className="flex-1">
                    <div className="font-medium">{uni.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {uni.location}, {uni.country}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="px-4 py-8 text-center text-sm text-muted-foreground">
              <div className="animate-spin inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full mb-2" />
              <div>搜尋全球大學中...</div>
            </div>
          )}

          {/* No Results */}
          {!loading && !hasResults && query.length >= 2 && (
            <div className="px-4 py-8 text-center text-sm text-muted-foreground">
              <div className="mb-2">😕 找不到「{query}」</div>
              <div className="text-xs">
                試試看：
                <br />• 使用英文名稱
                <br />• 檢查拼寫
                <br />• 選擇國家篩選
              </div>
            </div>
          )}

          {/* Hint */}
          {query.length === 1 && (
            <div className="px-4 py-4 text-center text-xs text-muted-foreground">
              繼續輸入以搜尋全球大學...
            </div>
          )}
        </div>
      )}
    </div>
  );
}

