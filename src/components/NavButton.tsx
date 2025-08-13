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
          ? "text-primary" 
          : "text-muted-foreground hover:text-foreground",
        className
      )}
    >
      {icon}
      <span>{label}</span>
    </Button>
  );
};