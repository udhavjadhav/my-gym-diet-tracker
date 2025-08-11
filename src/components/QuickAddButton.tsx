import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface QuickAddButtonProps {
  value: number;
  unit: string;
  onClick: (value: number) => void;
  variant?: 'water' | 'protein' | 'default';
  className?: string;
}

export const QuickAddButton = ({ 
  value, 
  unit, 
  onClick, 
  variant = 'default',
  className 
}: QuickAddButtonProps) => {
  const variantClasses = {
    water: "bg-gradient-to-r from-water/10 to-water/20 border-water/30 hover:from-water/20 hover:to-water/30 text-water",
    protein: "bg-gradient-to-r from-protein/10 to-protein/20 border-protein/30 hover:from-protein/20 hover:to-protein/30 text-protein",
    default: "bg-gradient-to-r from-primary/10 to-primary/20 border-primary/30 hover:from-primary/20 hover:to-primary/30 text-primary"
  };

  return (
    <Button
      variant="outline"
      onClick={() => onClick(value)}
      className={cn(
        "h-16 flex flex-col items-center justify-center border-2 transition-all duration-300",
        variantClasses[variant],
        className
      )}
    >
      <span className="font-bold text-lg">+{value}</span>
      <span className="text-xs opacity-80">{unit}</span>
    </Button>
  );
};