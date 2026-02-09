import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const ShopDropdown = () => {
  const concerns = [
    { name: "Frizz Control", link: "/collections?filter=frizz" },
    { name: "Color-Treated Hair", link: "/collections?filter=color" },
    { name: "Dry & Damaged", link: "/collections?filter=repair" },
    { name: "Fine Hair", link: "/collections?filter=volume" },
    { name: "Curly Hair", link: "/collections?filter=curl" },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-1 text-foreground hover:text-brand-500 transition-colors duration-fast font-medium">
        Shop
        <ChevronDown className="w-4 h-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuItem asChild>
          <Link to="/collections">All Collections</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/collections/christmas-gift-packs">Gift Packs</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/collections/hair-care">Hair Care</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/collections/treatments">Treatments</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/collections/styling">Styling Products</Link>
        </DropdownMenuItem>
        <div className="h-px bg-border my-1" />
        <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
          Shop by Concern
        </div>
        {concerns.map((concern) => (
          <DropdownMenuItem key={concern.name} asChild>
            <Link to={concern.link}>{concern.name}</Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ShopDropdown;
