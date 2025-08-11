import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface NavButtonProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
  className?: string;
}

export const NavButton = ({ icon, label, isActive, onClick, className }: NavButtonProps) => {
  return (
    <Button
      variant="ghost"
      onClick={onClick}
      className={cn(
        "flex flex-col items-center gap-1 h-16 text-xs font-medium transition-all duration-300",
        isActive 
          ? "bg-primary/20 text-primary border-t-2 border-primary" 
          : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
        className
      )}
    >
      {icon}
      <span>{label}</span>
    </Button>
  );
};