import { Command as CommandPrimitive, useCommandState } from "cmdk";
import { Check, ChevronsUpDown, X } from "lucide-react";
import * as React from "react";
import { forwardRef, useEffect } from "react";
import { Command, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/libs/clsx";

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
}

export interface ComboboxRef {
  selectedValue: Option | undefined;
  input: HTMLInputElement;
  focus: () => void;
  reset: () => void;
}

export function useDebounce<T>(value: T, delay?: number): T {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay || 500);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

function transToGroupOption(options: Option[], groupBy?: string) {
  if (options.length === 0) {
    return {};
  }
  if (!groupBy) {
    return {
      "": options,
    };
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
}

/**
 * The `CommandEmpty` of shadcn/ui will cause the cmdk empty not rendering correctly.
 * So we create one and copy the `Empty` implementation from `cmdk`.
 *
 * @reference: https://github.com/hsuanyi-chou/shadcn-ui-expansions/issues/34#issuecomment-1949561607
 **/
const CommandEmpty = forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof CommandPrimitive.Empty>
>(({ className, ...props }, forwardedRef) => {
  const render = useCommandState((state) => state.filtered.count === 0);

  if (!render) return null;

  return (
    <div
      className={cn("py-6 text-center text-sm", className)}
      ref={forwardedRef}
      role="presentation"
      {...props}
    />
  );
});

CommandEmpty.displayName = "CommandEmpty";

const Combobox = React.forwardRef<ComboboxRef, ComboboxProps>(
  (
    {
      value,
      onChange,
      placeholder,
      defaultOptions: arrayDefaultOptions = [],
      options: arrayOptions,
      delay,
      onSearch,
      onSearchSync,
      loadingIndicator,
      emptyIndicator,
      disabled,
      groupBy,
      className,
      selectFirstItem = true,
      creatable = false,
      triggerSearchOnFocus = false,
      commandProps,
      inputProps,
    }: ComboboxProps,
    ref: React.Ref<ComboboxRef>
  ) => {
    const inputRef = React.useRef<HTMLInputElement>(null);
    const [open, setOpen] = React.useState(false);
    const [onScrollbar, setOnScrollbar] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);
    const dropdownRef = React.useRef<HTMLDivElement>(null);

    const [selected, setSelected] = React.useState<Option | undefined>(value);
    const [options, setOptions] = React.useState<GroupOption>(
      transToGroupOption(arrayDefaultOptions, groupBy)
    );
    const [inputValue, setInputValue] = React.useState("");
    const debouncedSearchTerm = useDebounce(inputValue, delay || 500);

    React.useImperativeHandle(
      ref,
      () => ({
        selectedValue: selected,
        input: inputRef.current as HTMLInputElement,
        focus: () => inputRef?.current?.focus(),
        reset: () => setSelected(undefined),
      }),
      [selected]
    );

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
        inputRef.current.blur();
      }
    };

    const handleClear = React.useCallback(() => {
      setSelected(undefined);
      onChange?.(undefined);
      setInputValue("");
    }, [onChange]);

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
    }, [open]);

    useEffect(() => {
      if (value !== undefined) {
        setSelected(value);
      }
    }, [value]);

    useEffect(() => {
      /** If `onSearch` is provided, do not trigger options updated. */
      if (!arrayOptions || onSearch) {
        return;
      }
      const newOption = transToGroupOption(arrayOptions || [], groupBy);
      if (JSON.stringify(newOption) !== JSON.stringify(options)) {
        setOptions(newOption);
      }
    }, [arrayDefaultOptions, arrayOptions, groupBy, onSearch, options]);

    useEffect(() => {
      /** sync search */
      const doSearchSync = () => {
        const res = onSearchSync?.(debouncedSearchTerm);
        setOptions(transToGroupOption(res || [], groupBy));
      };

      // eslint-disable-next-line @typescript-eslint/require-await
      const exec = async () => {
        if (!onSearchSync || !open) return;

        if (triggerSearchOnFocus) {
          doSearchSync();
        }

        if (debouncedSearchTerm) {
          doSearchSync();
        }
      };

      void exec();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedSearchTerm, groupBy, open, triggerSearchOnFocus]);

    useEffect(() => {
      /** async search */
      const doSearch = async () => {
        setIsLoading(true);
        const res = await onSearch?.(debouncedSearchTerm);
        setOptions(transToGroupOption(res || [], groupBy));
        setIsLoading(false);
      };

      const exec = async () => {
        if (!onSearch || !open) return;

        if (triggerSearchOnFocus) {
          await doSearch();
        }

        if (debouncedSearchTerm) {
          await doSearch();
        }
      };

      void exec();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedSearchTerm, groupBy, open, triggerSearchOnFocus]);

    const CreatableItem = () => {
      if (!creatable) return undefined;

      // Check if the input value already exists as an option
      let optionExists = false;
      Object.values(options).forEach((optionGroup) => {
        if (
          optionGroup.some((option) => option.value === inputValue || option.label === inputValue)
        ) {
          optionExists = true;
        }
      });

      if (
        optionExists ||
        (selected && (selected.value === inputValue || selected.label === inputValue))
      ) {
        return undefined;
      }

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

      // For normal creatable
      if (!onSearch && inputValue.length > 0) {
        return Item;
      }

      // For async search creatable. avoid showing creatable item before loading at first.
      if (onSearch && debouncedSearchTerm.length > 0 && !isLoading) {
        return Item;
      }

      return undefined;
    };

    const EmptyItem = React.useCallback(() => {
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

    /** Avoid Creatable Selector freezing or lagging when paste a long string. */
    const commandFilter = React.useCallback(() => {
      if (commandProps?.filter) {
        return commandProps.filter;
      }

      if (creatable) {
        return (value: string, search: string) => {
          return value.toLowerCase().includes(search.toLowerCase()) ? 1 : -1;
        };
      }
      // Using default filter in `cmdk`. We don't have to provide it.
      return undefined;
    }, [creatable, commandProps?.filter]);

    return (
      <Command
        ref={dropdownRef}
        {...commandProps}
        className={cn("h-auto overflow-visible bg-transparent", commandProps?.className)}
        filter={commandFilter()}
        shouldFilter={
          commandProps?.shouldFilter !== undefined ? commandProps.shouldFilter : !onSearch
        } // When onSearch is provided, we don't want to filter the options. You can still override it.
      >
        <button
          className={cn(
            "border-input bg-background ring-offset-background focus-within:ring-ring flex h-10 w-full items-center justify-between rounded-md border px-3 py-2 text-sm focus-within:ring-2 focus-within:ring-offset-2",
            disabled && "cursor-not-allowed opacity-50",
            className
          )}
          onClick={(e) => {
            e.preventDefault();
            if (disabled) return;
            setOpen(true);
            setTimeout(() => {
              inputRef?.current?.focus();
            }, 0);
          }}
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
            {selected && (
              <button
                className={cn("h-4 w-4 p-0", disabled && "hidden")}
                onClick={(e) => {
                  e.stopPropagation();
                  handleClear();
                }}
                type="button"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            <ChevronsUpDown className="h-4 w-4 opacity-50" />
          </div>
        </button>
        <div className="relative">
          {open && (
            <CommandList
              className="bg-popover text-popover-foreground animate-in absolute top-1 z-10 w-full rounded-md border shadow-md outline-none"
              onMouseEnter={() => {
                setOnScrollbar(true);
              }}
              onMouseLeave={() => {
                setOnScrollbar(false);
              }}
            >
              {isLoading ? (
                <>{loadingIndicator}</>
              ) : (
                <>
                  {EmptyItem()}
                  {CreatableItem()}
                  {!selectFirstItem && <CommandItem className="hidden" value="-" />}
                  {Object.entries(options).map(([key, dropdowns]) => (
                    <CommandGroup className="h-full overflow-auto" heading={key} key={key}>
                      <>
                        {dropdowns.map((option) => {
                          const isSelected = selected?.value === option.value;
                          return (
                            <CommandItem
                              className={cn(
                                "flex cursor-pointer items-center justify-between",
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
                      </>
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
);

Combobox.displayName = "Combobox";
export default Combobox;
