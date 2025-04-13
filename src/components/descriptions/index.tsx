import * as React from "react";
import { useIsMobile } from "@/hooks/shared/use-mobile";
import { cn } from "@/libs/clsx";

type DescriptionsProps = Omit<React.HTMLAttributes<HTMLDivElement>, "title"> & {
  title?: React.ReactNode;
  bordered?: boolean;
  column?: number;
  children?: React.ReactNode;
};

type DescriptionsItemProps = React.HTMLAttributes<HTMLTableCellElement> & {
  label: React.ReactNode;
  span?: number;
  labelClassName?: string;
  contentClassName?: string;
};

const useDescriptionsGrid = (
  children: React.ReactNode,
  responsiveColumn: number
): Array<Array<React.ReactElement | null>> => {
  const childrenArray = React.Children.toArray(children);
  const grid: Array<Array<React.ReactElement | null>> = [];
  let currentRow = 0;
  let currentCol = 0;

  childrenArray.forEach((child) => {
    if (!React.isValidElement(child)) return;

    const itemProps = child.props as DescriptionsItemProps;
    const span = Math.min(itemProps.span || 1, responsiveColumn);

    if (currentCol + span > responsiveColumn) {
      currentRow++;
      currentCol = 0;
    }

    if (!grid[currentRow]) {
      grid[currentRow] = Array<React.ReactElement | null>(responsiveColumn).fill(null);
    }

    grid[currentRow][currentCol] = child;
    currentCol += span;
  });

  return grid;
};

const renderDescriptionItem = (
  item: React.ReactElement,
  colIndex: number,
  row: Array<React.ReactElement | null>,
  isMobile: boolean
) => {
  // Skip rendering if this cell is covered by a previous item's span
  if (shouldSkipRendering(item, colIndex, row)) return null;

  const itemProps = item.props as DescriptionsItemProps;
  const { label, labelClassName, children, contentClassName, span = 1 } = itemProps;

  return (
    <React.Fragment key={colIndex}>
      <th
        className={cn(
          "min-h-10 w-48 max-w-56 border-r border-b border-gray-200 bg-gray-50 p-2 px-4 text-left text-sm font-medium",
          labelClassName
        )}
      >
        {label}
      </th>
      <td
        className={cn(
          "min-h-10 overflow-hidden border-b border-gray-200 p-2 px-4 text-sm text-ellipsis",
          contentClassName
        )}
        colSpan={isMobile ? 1 : span > 1 ? span * 2 - 1 : 1}
      >
        {children}
      </td>
    </React.Fragment>
  );
};

const shouldSkipRendering = (
  item: React.ReactElement,
  colIndex: number,
  row: Array<React.ReactElement | null>
): boolean => {
  if (!item || colIndex === 0) return false;

  const prevItem = row[colIndex - 1];
  if (!prevItem) return false;

  const prevItemProps = prevItem.props as DescriptionsItemProps;
  const prevSpan = prevItemProps.span || 1;

  return prevSpan > 1 && colIndex < prevSpan;
};

const Descriptions = ({
  title,
  bordered = true,
  column = 2,
  className,
  children,
  ...props
}: DescriptionsProps) => {
  const isMobile = useIsMobile(1024);
  const responsiveColumn = isMobile ? 1 : column;
  const grid = useDescriptionsGrid(children, responsiveColumn);

  return (
    <div className={cn("w-full", className)} {...props}>
      {title && <span className="mb-2 text-lg font-medium">{title}</span>}
      <table
        className={cn(
          "w-full table-fixed border-separate border-spacing-0 overflow-hidden",
          bordered && "rounded-sm border border-gray-200"
        )}
      >
        <tbody>
          {grid.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map(
                (item, colIndex) => item && renderDescriptionItem(item, colIndex, row, isMobile)
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

Descriptions.displayName = "Descriptions";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const DescriptionsItem = (_props: DescriptionsItemProps) => {
  // This is just a placeholder component - the actual rendering is handled by Descriptions
  return null;
};

DescriptionsItem.displayName = "DescriptionsItem";

Descriptions.Item = DescriptionsItem;

export { Descriptions, DescriptionsItem };
