import { Card } from "@/components/ui/card";
import { ProgressCircle } from "./ProgressCircle";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  current: number;
  goal: number;
  unit: string;
  color: 'water' | 'protein' | 'calories' | 'workout';
  icon?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const StatCard = ({ 
  title, 
  current, 
  goal, 
  unit, 
  color, 
  icon,
  className,
  onClick 
}: StatCardProps) => {
  const percentage = goal > 0 ? Math.min((current / goal) * 100, 100) : 0;

  return (
    <Card 
      className={cn(
        "p-6 bg-gradient-to-br from-card to-secondary border-border/50 transition-all duration-200", 
        onClick && "cursor-pointer hover:shadow-lg hover:scale-[1.02]",
        className
      )}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </div>
      
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="text-2xl font-bold text-foreground">
            {current.toLocaleString()}
            <span className="text-sm text-muted-foreground ml-1">/ {goal.toLocaleString()}</span>
          </div>
          <div className="text-xs text-muted-foreground">{unit}</div>
        </div>
        
        <ProgressCircle 
          percentage={percentage} 
          size={60} 
          strokeWidth={4}
          color={color}
        >
          <span className="text-xs font-semibold text-foreground">
            {Math.round(percentage)}%
          </span>
        </ProgressCircle>
      </div>
    </Card>
  );
};