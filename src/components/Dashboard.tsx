import { StatCard } from "./StatCard";
import { useLocalStorage } from "@/hooks/useStorage";
import { WaterLog, ProteinLog, MealLog, UserSettings } from "@/types/fitness";
import { Droplets, Zap, Utensils, Dumbbell } from "lucide-react";
import gymHero from "@/assets/gym-hero.jpg";

export const Dashboard = () => {
  const [waterLogs] = useLocalStorage<WaterLog[]>('waterLogs', []);
  const [proteinLogs] = useLocalStorage<ProteinLog[]>('proteinLogs', []);
  const [mealLogs] = useLocalStorage<MealLog[]>('mealLogs', []);
  const [settings] = useLocalStorage<UserSettings>('userSettings', {
    goals: { water: 2000, protein: 150, calories: 2000 },
    notifications: { water: true, protein: true, waterInterval: 1, proteinTimes: ['08:00', '12:00', '18:00'] }
  });

  const today = new Date().toISOString().split('T')[0];
  
  const todayWater = waterLogs
    .filter(log => log.date === today)
    .reduce((sum, log) => sum + log.amount, 0);
    
  const todayProtein = proteinLogs
    .filter(log => log.date === today)
    .reduce((sum, log) => sum + log.amount, 0);
    
  const todayCalories = mealLogs
    .filter(log => log.date === today)
    .reduce((sum, log) => sum + log.calories, 0);

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="relative h-48 rounded-2xl overflow-hidden">
        <img 
          src={gymHero} 
          alt="Gym equipment" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
        <div className="absolute bottom-6 left-6">
          <h1 className="text-2xl font-bold text-foreground mb-1">
            Good morning, Champion!
          </h1>
          <p className="text-muted-foreground">
            Let's crush today's fitness goals
          </p>
        </div>
      </div>

      {/* Daily Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <StatCard
          title="Water Intake"
          current={todayWater}
          goal={settings.goals.water}
          unit="ml"
          color="water"
          icon={<Droplets className="w-4 h-4" />}
        />
        
        <StatCard
          title="Protein"
          current={todayProtein}
          goal={settings.goals.protein}
          unit="grams"
          color="protein"
          icon={<Zap className="w-4 h-4" />}
        />
        
        <StatCard
          title="Calories"
          current={todayCalories}
          goal={settings.goals.calories}
          unit="kcal"
          color="calories"
          icon={<Utensils className="w-4 h-4" />}
        />
        
        <StatCard
          title="Workouts"
          current={0}
          goal={1}
          unit="sessions"
          color="workout"
          icon={<Dumbbell className="w-4 h-4" />}
        />
      </div>

      {/* Quick Actions */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-3">
          <div className="p-4 rounded-xl bg-gradient-to-br from-water/10 to-water/5 border border-water/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-water/20 flex items-center justify-center">
                <Droplets className="w-5 h-5 text-water" />
              </div>
              <div>
                <p className="font-medium text-foreground">Log Water</p>
                <p className="text-sm text-muted-foreground">Quick hydration</p>
              </div>
            </div>
          </div>
          
          <div className="p-4 rounded-xl bg-gradient-to-br from-protein/10 to-protein/5 border border-protein/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-protein/20 flex items-center justify-center">
                <Zap className="w-5 h-5 text-protein" />
              </div>
              <div>
                <p className="font-medium text-foreground">Add Protein</p>
                <p className="text-sm text-muted-foreground">Track intake</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};