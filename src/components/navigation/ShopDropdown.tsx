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
    { name: "Frizz Control", link: "/collections/frizz-control" },
    { name: "Color-Treated Hair", link: "/collections/color-treated-hair" },
    { name: "Dry & Damaged", link: "/collections/dry-damaged" },
    { name: "Fine Hair", link: "/collections/fine-hair" },
    { name: "Curly Hair", link: "/collections/curly-hair" },
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
          <Link to="/collections/juuce">Juuce</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/collections/qiqi">QIQI</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/collections/pure">Pure Organic</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/collections/wet-brush">Wet Brush</Link>
        </DropdownMenuItem>
        <div className="h-px bg-border my-1" />
        <div className="px-2 py-1.5 text-xs font-semibold text-foreground">
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
