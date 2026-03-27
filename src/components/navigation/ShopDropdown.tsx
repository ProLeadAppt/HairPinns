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
    { name: "Frizz Control", link: "/collections/frizz-free-must-haves" },
    { name: "Heat Protection", link: "/collections/heat-protection" },
    { name: "Blonde Care", link: "/collections/blonde-bombshells" },
    { name: "Volume & Fine Hair", link: "/collections/pump-up-the-volume" },
    { name: "Curly Hair", link: "/collections/curly-girlys" },
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
          <Link to="/collections/juuce-botanicals">Juuce</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/collections/qiqi">QIQI</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/collections/pure-certified-organic-hair-care">Pure Organic</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/collections/wet-brush-detanglers">Wet Brush</Link>
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
