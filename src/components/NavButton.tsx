import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface NavButtonProps {
  children: React.ReactNode;
  active?: boolean;
  onClick: () => void;
  className?: string;
}

export const NavButton = ({ children, active, onClick, className }: NavButtonProps) => {
  return (
    <Button
      variant="ghost"
      onClick={onClick}
      className={cn(
        "flex-1 flex flex-col items-center gap-1 h-16 text-xs font-medium transition-all duration-300",
        active 
          ? "bg-primary/20 text-primary border-t-2 border-primary" 
          : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
        className
      )}
    >
      {children}
    </Button>
  );
};