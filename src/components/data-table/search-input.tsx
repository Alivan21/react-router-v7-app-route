import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/shared/use-debounce";

interface SearchInputProps {
  initialValue: string;
  placeholder: string;
  onSearch: (value: string) => void;
}

export function SearchInput({ initialValue = "", placeholder, onSearch }: SearchInputProps) {
  const [searchValue, setSearchValue] = useState(initialValue);
  const debouncedSearchValue = useDebounce<string>(searchValue, 800);

  useEffect(() => {
    onSearch(debouncedSearchValue);
  }, [debouncedSearchValue, onSearch]);

  return (
    <div className="relative w-full sm:max-w-sm">
      <Input
        className="bg-background/70 border-muted focus-visible:bg-background w-full transition-colors"
        onChange={(e) => setSearchValue(e.target.value)}
        placeholder={placeholder}
        value={searchValue}
      />
      {searchValue && debouncedSearchValue !== searchValue && (
        <div className="absolute top-1/2 right-10 -translate-y-1/2">
          <span className="border-foreground/20 border-t-foreground/80 inline-block h-3 w-3 animate-spin rounded-full border-2" />
        </div>
      )}
      {searchValue && (
        <button
          aria-label="Clear search"
          className="text-muted-foreground hover:text-foreground absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer transition-colors"
          onClick={() => setSearchValue("")}
          type="button"
        >
          ✕
        </button>
      )}
    </div>
  );
}
