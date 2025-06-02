import { Command as CommandPrimitive, useCommandState } from "cmdk";
import { Check, ChevronsUpDown, X } from "lucide-react";
import {
  memo,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { Command, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { useDebounce } from "@/hooks/shared/use-debounce";
import { cn } from "@/libs/clsx";
import { ScrollArea } from "./scroll-area";

export interface Option {
  value: string;
  label: string;
  disable?: boolean;
  /** Group the options by providing key. */
  [key: string]: string | boolean | undefined;
}
interface GroupOption {
  [key: string]: Option[];
}

interface ComboboxProps {
  value?: Option;
  defaultOptions?: Option[];
  /** manually controlled options */
  options?: Option[];
  placeholder?: string;
  /** Loading component. */
  loadingIndicator?: React.ReactNode;
  /** Empty component. */
  emptyIndicator?: React.ReactNode;
  /** Debounce time for async search. Only work with `onSearch`. */
  delay?: number;
  /**
   * Only work with `onSearch` prop. Trigger search when `onFocus`.
   * For example, when user click on the input, it will trigger the search to get initial options.
   **/
  triggerSearchOnFocus?: boolean;
  /** async search */
  onSearch?: (value: string) => Promise<Option[]>;
  /**
   * sync search. This search will not showing loadingIndicator.
   * The rest props are the same as async search.
   * i.e.: creatable, groupBy, delay.
   **/
  onSearchSync?: (value: string) => Option[];
  onChange?: (option: Option | undefined) => void;
  disabled?: boolean;
  /** Group the options base on provided key. */
  groupBy?: string;
  className?: string;
  /**
   * First item selected is a default behavior by cmdk. That is why the default is true.
   * This is a workaround solution by add a dummy item.
   *
   * @reference: https://github.com/pacocoursey/cmdk/issues/171
   */
  selectFirstItem?: boolean;
  /** Allow user to create option when there is no option matched. */
  creatable?: boolean;
  /** Props of `Command` */
  commandProps?: React.ComponentPropsWithoutRef<typeof Command>;
  /** Props of `CommandInput` */
  inputProps?: Omit<
    React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>,
    "value" | "placeholder" | "disabled"
  >;
  ref?: React.Ref<ComboboxRef>;
}

export interface ComboboxRef {
  selectedValue: Option | undefined;
  input: HTMLInputElement;
  focus: () => void;
  reset: () => void;
}

const transToGroupOption = (options: Option[], groupBy?: string) => {
  if (options.length === 0) {
    return {};
  }
  if (!groupBy) {
    return { "": options };
  }

  const groupOption: GroupOption = {};
  options.forEach((option) => {
    const key = (option[groupBy] as string) || "";
    if (!groupOption[key]) {
      groupOption[key] = [];
    }
    groupOption[key].push(option);
  });
  return groupOption;
};

/**
 * The `CommandEmpty` of shadcn/ui will cause the cmdk empty not rendering correctly.
 * So we create one and copy the `Empty` implementation from `cmdk`.
 *
 * @reference: https://github.com/hsuanyi-chou/shadcn-ui-expansions/issues/34#issuecomment-1949561607
 **/
const CommandEmpty = memo(
  ({
    className,
    ref,
    ...props
  }: React.ComponentProps<typeof CommandPrimitive.Empty> & {
    ref?: React.Ref<HTMLDivElement>;
  }) => {
    const render = useCommandState((state) => state.filtered.count === 0);

    if (!render) return null;

    return (
      <div
        className={cn("py-6 text-center text-sm", className)}
        ref={ref}
        role="presentation"
        {...props}
      />
    );
  }
);
CommandEmpty.displayName = "CommandEmpty";

function Combobox({
  value,
  onChange,
  placeholder,
  defaultOptions: arrayDefaultOptions = [],
  options: arrayOptions,
  delay = 1000,
  onSearch,
  onSearchSync,
  loadingIndicator = "Loading...",
  emptyIndicator = "No options found.",
  disabled,
  groupBy,
  className,
  selectFirstItem = true,
  creatable = false,
  triggerSearchOnFocus = false,
  commandProps,
  inputProps,
  ref,
}: ComboboxProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [open, setOpen] = useState(false);
  const [onScrollbar, setOnScrollbar] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selected, setSelected] = useState<Option | undefined>(value);
  const [inputValue, setInputValue] = useState("");

  // Initialize options with memoized default options
  const initialOptions = useMemo(
    () => transToGroupOption(arrayDefaultOptions, groupBy),
    [arrayDefaultOptions, groupBy]
  );

  const [options, setOptions] = useState<GroupOption>(initialOptions);
  const debouncedSearchTerm = useDebounce(inputValue, delay);

  // Check if current input value exists in options
  const optionExists = useMemo(() => {
    let exists = false;
    if (selected && (selected.value === inputValue || selected.label === inputValue)) {
      return true;
    }

    Object.values(options).some((optionGroup) => {
      if (
        optionGroup.some((option) => option.value === inputValue || option.label === inputValue)
      ) {
        exists = true;
        return true;
      }
      return false;
    });
    return exists;
  }, [selected, options, inputValue]);

  // Memoize imperative handle
  useImperativeHandle(
    ref,
    () => ({
      selectedValue: selected,
      input: inputRef.current as HTMLInputElement,
      focus: () => inputRef?.current?.focus(),
      reset: () => setSelected(undefined),
    }),
    [selected]
  );

  // Memoize click outside handler
  const handleClickOutside = useCallback((event: MouseEvent | TouchEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node) &&
      buttonRef.current &&
      !buttonRef.current.contains(event.target as Node)
    ) {
      setOpen(false);
      inputRef.current?.blur();
    }
  }, []);

  const handleClear = useCallback(() => {
    setSelected(undefined);
    onChange?.(undefined);
    setInputValue("");
  }, [onChange]);

  // Event listener effect
  useEffect(() => {
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchend", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchend", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchend", handleClickOutside);
    };
  }, [open, handleClickOutside]);

  // Handle value prop changes
  useEffect(() => {
    if (value !== undefined) {
      setSelected(value);
    }
  }, [value]);

  // Handle manual options changes with memoized comparison
  useEffect(() => {
    if (!arrayOptions || onSearch) return;

    const newOptions = transToGroupOption(arrayOptions, groupBy);
    // Avoid unnecessary state updates with deep comparison
    if (JSON.stringify(newOptions) !== JSON.stringify(options)) {
      setOptions(newOptions);
    }
  }, [arrayOptions, groupBy, onSearch, options]);

  // Sync search effect with memoized handler
  const doSearchSync = useCallback(() => {
    if (!onSearchSync) return;
    const res = onSearchSync(debouncedSearchTerm);
    setOptions(transToGroupOption(res || [], groupBy));
  }, [debouncedSearchTerm, groupBy, onSearchSync]);

  useEffect(() => {
    if (!onSearchSync || !open) return;

    if (triggerSearchOnFocus || debouncedSearchTerm) {
      doSearchSync();
    }
  }, [debouncedSearchTerm, open, triggerSearchOnFocus, doSearchSync, onSearchSync]);

  // Async search effect with memoized handler
  const doSearch = useCallback(async () => {
    if (!onSearch) return;
    setIsLoading(true);
    try {
      const res = await onSearch(debouncedSearchTerm);
      setOptions(transToGroupOption(res || [], groupBy));
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearchTerm, groupBy, onSearch]);

  useEffect(() => {
    if (!onSearch || !open) return;

    const exec = async () => {
      if (triggerSearchOnFocus || debouncedSearchTerm) {
        await doSearch();
      }
    };

    void exec();
  }, [debouncedSearchTerm, open, triggerSearchOnFocus, doSearch, onSearch]);

  // Memoize CreatableItem to prevent recreation on every render
  const CreatableItem = useMemo(() => {
    if (!creatable || !inputValue || optionExists) return undefined;

    const Item = (
      <CommandItem
        className="cursor-pointer"
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onSelect={(value: string) => {
          const newOption = { value, label: value };
          setInputValue("");
          setSelected(newOption);
          onChange?.(newOption);
          setOpen(false);
        }}
        value={inputValue}
      >
        {`Create "${inputValue}"`}
      </CommandItem>
    );

    // Only show for appropriate conditions
    if (
      (!onSearch && inputValue.length > 0) ||
      (onSearch && debouncedSearchTerm.length > 0 && !isLoading)
    ) {
      return Item;
    }

    return undefined;
  }, [creatable, inputValue, debouncedSearchTerm, isLoading, onSearch, onChange, optionExists]);

  // Memoize EmptyItem
  const EmptyItem = useCallback(() => {
    if (!emptyIndicator) return undefined;

    // For async search that showing emptyIndicator
    if (onSearch && !creatable && Object.keys(options).length === 0) {
      return (
        <CommandItem disabled value="-">
          {emptyIndicator}
        </CommandItem>
      );
    }

    return <CommandEmpty>{emptyIndicator}</CommandEmpty>;
  }, [creatable, emptyIndicator, onSearch, options]);

  // Memoize command filter to prevent recreation
  const commandFilter = useMemo(() => {
    if (commandProps?.filter) {
      return commandProps.filter;
    }

    if (creatable) {
      return (value: string, search: string) => {
        return value.toLowerCase().includes(search.toLowerCase()) ? 1 : -1;
      };
    }

    return undefined;
  }, [creatable, commandProps?.filter]);

  // Memoize shouldFilter
  const shouldFilter = useMemo(
    () => (commandProps?.shouldFilter !== undefined ? commandProps.shouldFilter : !onSearch),
    [commandProps?.shouldFilter, onSearch]
  );

  // Memoize button click handler
  const handleButtonClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      if (disabled) return;
      setOpen(true);
      setTimeout(() => {
        inputRef?.current?.focus();
      }, 0);
    },
    [disabled]
  );

  return (
    <Command
      ref={dropdownRef}
      {...commandProps}
      className={cn("h-auto overflow-visible bg-transparent", commandProps?.className)}
      filter={commandFilter}
      shouldFilter={shouldFilter}
    >
      <button
        className={cn(
          "border-input file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          "focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          disabled && "cursor-not-allowed opacity-50",
          className
        )}
        onClick={handleButtonClick}
        ref={buttonRef}
      >
        <div className="flex flex-1 items-center gap-1">
          {selected ? (
            <div className="text-sm">{selected.label}</div>
          ) : (
            <CommandPrimitive.Input
              {...inputProps}
              className={cn(
                "placeholder:text-muted-foreground flex-1 bg-transparent outline-none",
                inputProps?.className
              )}
              disabled={disabled}
              onBlur={(event) => {
                setTimeout(() => {
                  if (!onScrollbar) {
                    setOpen(false);
                  }
                }, 100);
                inputProps?.onBlur?.(event);
              }}
              onFocus={(event) => {
                setOpen(true);
                inputProps?.onFocus?.(event);
              }}
              onValueChange={(value) => {
                setInputValue(value);
                inputProps?.onValueChange?.(value);
                if (value) {
                  setOpen(true);
                }
              }}
              placeholder={placeholder}
              ref={inputRef}
              value={inputValue}
            />
          )}
        </div>
        <div className="flex items-center gap-1">
          {selected ? (
            <span
              aria-label="Clear selection"
              className={cn(
                "inline-flex h-4 w-4 cursor-pointer items-center justify-center p-0",
                disabled && "hidden"
              )}
              onClick={(e) => {
                e.stopPropagation();
                handleClear();
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.stopPropagation();
                  e.preventDefault();
                  handleClear();
                }
              }}
              role="button"
              tabIndex={0}
            >
              <X className="h-4 w-4" />
            </span>
          ) : (
            <ChevronsUpDown className="h-4 w-4 opacity-50" />
          )}
        </div>
      </button>
      <div className="relative">
        {open && (
          <CommandList
            className="bg-popover text-popover-foreground animate-in absolute top-1 z-10 w-full rounded-md border shadow-md outline-none"
            onMouseEnter={() => setOnScrollbar(true)}
            onMouseLeave={() => setOnScrollbar(false)}
          >
            {isLoading ? (
              <div className="p-2 text-center">{loadingIndicator}</div>
            ) : (
              <>
                <EmptyItem />
                {CreatableItem}
                {!selectFirstItem && <CommandItem className="hidden" value="-" />}
                {Object.entries(options).map(([key, dropdowns]) => (
                  <CommandGroup className="h-full" heading={key} key={key}>
                    <ScrollArea className={cn(dropdowns.length > 5 ? "h-52" : "h-auto")}>
                      {dropdowns.map((option) => {
                        const isSelected = selected?.value === option.value;
                        return (
                          <CommandItem
                            className={cn(
                              "my-0.5 flex cursor-pointer items-center justify-between",
                              option.disable && "text-muted-foreground cursor-default",
                              isSelected && "bg-accent"
                            )}
                            disabled={option.disable}
                            key={option.value}
                            onMouseDown={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                            }}
                            onSelect={() => {
                              setInputValue("");
                              setSelected(option);
                              onChange?.(option);
                              setOpen(false);
                            }}
                            value={option.label}
                          >
                            {option.label}
                            {isSelected && <Check className="h-4 w-4" />}
                          </CommandItem>
                        );
                      })}
                    </ScrollArea>
                  </CommandGroup>
                ))}
              </>
            )}
          </CommandList>
        )}
      </div>
    </Command>
  );
}

Combobox.displayName = "Combobox";
export default Combobox;
