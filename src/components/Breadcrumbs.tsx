import { Link } from "react-router-dom";
import { Fragment } from "react";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
  variant?: "default" | "dark";
}

const Breadcrumbs = ({ items, className, variant = "default" }: BreadcrumbsProps) => {
  const isDark = variant === "dark";

  return (
    <Breadcrumb className={className}>
      <BreadcrumbList style={isDark ? { color: "hsl(var(--after-hours-cream) / 0.7)" } : undefined}>
        {items.map((item, index) => (
          <Fragment key={`${item.label}-${index}`}>
            <BreadcrumbItem>
              {item.href && index !== items.length - 1 ? (
                <BreadcrumbLink asChild>
                  <Link
                    to={item.href}
                    className={isDark ? undefined : "text-foreground/80 hover:text-foreground"}
                    style={isDark ? { color: "hsl(var(--after-hours-cream) / 0.72)" } : undefined}
                  >
                    {item.label}
                  </Link>
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage
                  className={isDark ? undefined : "text-foreground"}
                  style={isDark ? { color: "hsl(var(--after-hours-cream) / 0.86)" } : undefined}
                >
                  {item.label}
                </BreadcrumbPage>
              )}
            </BreadcrumbItem>
            {index < items.length - 1 && <BreadcrumbSeparator />}
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default Breadcrumbs;
