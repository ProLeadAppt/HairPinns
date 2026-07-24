import type { ReactNode, RefObject } from "react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";

interface MobileMenuSheetProps {
  children: ReactNode;
  firstLinkRef: RefObject<HTMLAnchorElement>;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCloseAutoFocus: () => void;
}

const MobileMenuSheet = ({
  children,
  firstLinkRef,
  open,
  onOpenChange,
  onCloseAutoFocus,
}: MobileMenuSheetProps) => (
  <Sheet open={open} onOpenChange={onOpenChange}>
    <SheetContent
      side="right"
      className="w-[calc(100%-2rem)] max-w-sm overflow-y-auto border-l border-[hsl(var(--after-hours-copper)/0.55)] bg-[hsl(var(--after-hours-cream))] p-0 text-[hsl(var(--after-hours-plum))] [&>button]:inline-flex [&>button]:h-11 [&>button]:w-11 [&>button]:items-center [&>button]:justify-center"
      onOpenAutoFocus={(event) => {
        event.preventDefault();
        firstLinkRef.current?.focus();
      }}
      onCloseAutoFocus={(event) => {
        event.preventDefault();
        onCloseAutoFocus();
      }}
    >
      <SheetTitle className="sr-only">Mobile menu</SheetTitle>
      <div className="px-6 pb-6 pt-14">{children}</div>
    </SheetContent>
  </Sheet>
);

export default MobileMenuSheet;
