import { Link, useMatches, type UIMatch } from "react-router";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";
import React from "react";

export type BreadcrumbHandle = {
  route: string;
  label: (loaderData: unknown) => string;
};

export function AppBreadcrumb() {
  const matches = useMatches() as UIMatch<unknown, BreadcrumbHandle>[];
  const matchesWithHandlers = matches.filter((match) => match.handle);
  console.log({ matchesWithHandlers });

  return (
    <Breadcrumb className="p-2">
      <BreadcrumbList>
        {matchesWithHandlers.map((match, index, arr) => (
          <React.Fragment key={match.id}>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link
                  to={match.handle.route}
                  className="font-medium text-sm text-muted-foreground"
                >
                  {match.handle.label(match.loaderData)}
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            {index < arr.length - 1 && <BreadcrumbSeparator />}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
