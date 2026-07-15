import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FEATURED_BRANDS, SHOP_BY_CONCERN } from "@/config/commerceNavigation";

const ShopDropdown = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-1 text-foreground hover:text-brand-500 transition-colors duration-fast font-medium">
        Shop
        <ChevronDown className="w-4 h-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuItem asChild>
          <Link to="/collections">Shop All Products</Link>
        </DropdownMenuItem>
        {FEATURED_BRANDS.map((brand) => (
          <DropdownMenuItem key={brand.name} asChild>
            <Link to={brand.href}>{brand.name}</Link>
          </DropdownMenuItem>
        ))}
        <div className="h-px bg-border my-1" />
        <div className="px-2 py-1.5 text-xs font-semibold text-foreground">
          Shop by Concern
        </div>
        {SHOP_BY_CONCERN.map((concern) => (
          <DropdownMenuItem key={concern.name} asChild>
            <Link to={concern.href}>{concern.name}</Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ShopDropdown;
