import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FEATURED_BRANDS, SHOP_BY_CONCERN } from "@/config/commerceNavigation";

const itemClass = "min-h-11 rounded-none px-0 text-[hsl(var(--after-hours-plum))] focus:bg-[hsl(var(--after-hours-plum)/0.07)] focus:text-[hsl(var(--after-hours-plum))]";

const ShopDropdown = () => (
  <DropdownMenu>
    <DropdownMenuTrigger className="inline-flex min-h-11 items-center gap-1 text-sm font-medium text-[hsl(var(--after-hours-plum))] transition-colors duration-fast hover:text-brand-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2">
      Shop
      <ChevronDown className="h-4 w-4" />
    </DropdownMenuTrigger>
    <DropdownMenuContent
      align="start"
      sideOffset={10}
      className="w-[34rem] rounded-none border border-[hsl(var(--after-hours-plum)/0.2)] bg-[hsl(var(--after-hours-cream))] p-0 text-[hsl(var(--after-hours-plum))] shadow-none"
    >
      <div className="grid grid-cols-[1.25fr_0.75fr]">
        <div className="border-r border-[hsl(var(--after-hours-plum)/0.18)] p-5">
          <p className="text-[0.66rem] font-semibold uppercase tracking-[0.2em] text-[hsl(var(--after-hours-copper))]">Shop by concern</p>
          <div className="mt-3 border-t border-[hsl(var(--after-hours-plum)/0.18)]">
            {SHOP_BY_CONCERN.map((concern, index) => (
              <DropdownMenuItem key={concern.name} asChild className={itemClass}>
                <Link to={concern.href} className="border-b border-[hsl(var(--after-hours-plum)/0.16)]">
                  <span className="mr-3 text-[0.62rem] text-[hsl(var(--after-hours-copper))]">0{index + 1}</span>
                  <span>{concern.name}</span>
                </Link>
              </DropdownMenuItem>
            ))}
          </div>
        </div>
        <div className="p-5">
          <p className="text-[0.66rem] font-semibold uppercase tracking-[0.2em] text-[hsl(var(--after-hours-copper))]">Brands</p>
          <div className="mt-3 border-t border-[hsl(var(--after-hours-plum)/0.18)]">
            {FEATURED_BRANDS.map((brand) => (
              <DropdownMenuItem key={brand.name} asChild className={itemClass}>
                <Link to={brand.href} className="border-b border-[hsl(var(--after-hours-plum)/0.16)]">{brand.name}</Link>
              </DropdownMenuItem>
            ))}
          </div>
          <DropdownMenuItem asChild className="mt-5 min-h-11 rounded-none bg-[hsl(var(--after-hours-plum))] px-4 text-[hsl(var(--after-hours-cream))] focus:bg-brand-700 focus:text-white">
            <Link to="/collections">Shop all products</Link>
          </DropdownMenuItem>
        </div>
      </div>
    </DropdownMenuContent>
  </DropdownMenu>
);

export default ShopDropdown;
