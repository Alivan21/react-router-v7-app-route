import { SearchIcon } from "lucide-react";
import { useState, useEffect, memo } from "react";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/shared/use-debounce";

type TSearchInputProps = {
  initialValue: string;
  placeholder: string;
  onSearch: (value: string) => void;
  debounceDelay?: number;
};

export const SearchInput = memo(function SearchInput({
  initialValue = "",
  placeholder,
  onSearch,
  debounceDelay = 800,
}: TSearchInputProps) {
  const [searchValue, setSearchValue] = useState(initialValue);
  const debouncedSearchValue = useDebounce<string>(searchValue, debounceDelay);

  useEffect(() => {
    setSearchValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    onSearch(debouncedSearchValue);
  }, [debouncedSearchValue, onSearch]);

  function handleClear() {
    setSearchValue("");
  }

  const isPending = searchValue !== debouncedSearchValue;

  return (
    <div className="relative w-full">
      <SearchIcon className="text-muted-foreground absolute top-1/2 left-3 size-4 shrink-0 -translate-y-1/2" />
      <Input
        className="bg-background/70 border-muted focus-visible:bg-background w-full pr-10 pl-10 transition-colors"
        onChange={(e) => setSearchValue(e.target.value)}
        placeholder={placeholder}
        value={searchValue}
      />
      {isPending && (
        <div
          aria-label="Searching"
          className="absolute top-1/2 right-10 -translate-y-1/2"
          role="status"
        >
          <span className="border-foreground/20 border-t-foreground/80 inline-block h-3 w-3 animate-spin rounded-full border-2" />
        </div>
      )}
      {searchValue && (
        <button
          aria-label="Clear search"
          className="text-muted-foreground hover:text-foreground absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer transition-colors"
          onClick={handleClear}
          type="button"
        >
          ✕
        </button>
      )}
    </div>
  );
});
