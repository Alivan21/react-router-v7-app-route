import { ChevronRight, Home } from "lucide-react";
import React from "react";
import { Link } from "react-router";
import { ROUTES } from "@/common/constants/routes";

export type BreadcrumbsItem = {
  text: string | React.ReactNode;
  url: string;
};

type BreadcrumbsProps = {
  items?: BreadcrumbsItem[];
  showHomeIcon?: boolean;
};

export function Breadcrumbs({ items = [], showHomeIcon = true }: BreadcrumbsProps) {
  const hasBreadcrumbs = items.length > 0;

  if (!hasBreadcrumbs) {
    return null;
  }

  return (
    <nav aria-label="Breadcrumb" className="flex px-4 py-3">
      <ol className="flex flex-wrap items-center space-x-2">
        {showHomeIcon && (
          <li className="inline-flex items-center">
            <Link
              className="text-muted-foreground hover:text-foreground inline-flex items-center text-sm font-medium"
              to={ROUTES.DASHBOARD}
            >
              <Home className="h-4 w-4" />
              <span className="sr-only">Home</span>
            </Link>
          </li>
        )}

        {showHomeIcon && hasBreadcrumbs && (
          <li className="flex items-center">
            <ChevronRight aria-hidden="true" className="text-muted-foreground h-4 w-4" />
          </li>
        )}

        {items.map((breadcrumb, index) => {
          const isLastItem = index === items.length - 1;

          return (
            <React.Fragment key={breadcrumb.url}>
              <li className="inline-flex items-center">
                {isLastItem ? (
                  <span aria-current="page" className="text-foreground text-sm font-medium">
                    {breadcrumb.text}
                  </span>
                ) : (
                  <Link
                    className="text-muted-foreground hover:text-foreground text-sm font-medium"
                    to={breadcrumb.url}
                  >
                    {breadcrumb.text}
                  </Link>
                )}
              </li>

              {!isLastItem && (
                <li className="flex items-center">
                  <ChevronRight aria-hidden="true" className="text-muted-foreground h-4 w-4" />
                </li>
              )}
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
