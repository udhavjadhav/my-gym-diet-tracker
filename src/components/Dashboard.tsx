import { StatCard } from "./StatCard";
import { useLocalStorage } from "@/hooks/useStorage";
import { WaterLog, ProteinLog, MealLog, UserSettings, WorkoutSession } from "@/types/fitness";
import { Droplets, Zap, Utensils, Dumbbell } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import gymHero from "@/assets/gym-hero.jpg";

export const Dashboard = () => {
  const navigate = useNavigate();
  const [waterLogs, setWaterLogs] = useLocalStorage<WaterLog[]>('waterLogs', []);
  const [proteinLogs, setProteinLogs] = useLocalStorage<ProteinLog[]>('proteinLogs', []);
  const [mealLogs] = useLocalStorage<MealLog[]>('mealLogs', []);
  const [workoutSessions] = useLocalStorage<WorkoutSession[]>('workoutSessions', []);
  const [settings] = useLocalStorage<UserSettings>('userSettings', {
    goals: { water: 4000, protein: 150, calories: 2000 },
    notifications: { water: true, protein: true, gym: true, waterInterval: 1, proteinTimes: ['08:00', '12:00', '18:00'] }
  });
  const { toast } = useToast();

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
    
  const todayWorkouts = workoutSessions
    .filter(session => session.date === today).length;

  const addWater = (amount: number) => {
    const newLog: WaterLog = {
      id: Date.now().toString(),
      amount,
      date: today,
      timestamp: new Date().toISOString()
    };
    
    setWaterLogs(prev => [...prev, newLog]);
    toast({
      title: "Water logged!",
      description: `Added ${amount}ml. Keep hydrating! 💧`,
    });
  };

  const addProtein = (amount: number) => {
    const newLog: ProteinLog = {
      id: Date.now().toString(),
      amount,
      source: "Quick Add",
      date: today,
      timestamp: new Date().toISOString()
    };
    
    setProteinLogs(prev => [...prev, newLog]);
    toast({
      title: "Protein logged!",
      description: `Added ${amount}g protein. Great job! 💪`,
    });
  };

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
          onClick={() => navigate('/water-history')}
        />
        
        <StatCard
          title="Protein"
          current={todayProtein}
          goal={settings.goals.protein}
          unit="grams"
          color="protein"
          icon={<Zap className="w-4 h-4" />}
          onClick={() => navigate('/protein-history')}
        />
        
        <StatCard
          title="Calories"
          current={todayCalories}
          goal={settings.goals.calories}
          unit="kcal"
          color="calories"
          icon={<Utensils className="w-4 h-4" />}
          onClick={() => navigate('/calories-history')}
        />
        
        <StatCard
          title="Workouts"
          current={todayWorkouts}
          goal={1}
          unit="sessions"
          color="workout"
          icon={<Dumbbell className="w-4 h-4" />}
          onClick={() => navigate('/workout-history')}
        />
      </div>

      {/* Quick Actions */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={() => addWater(250)}
            className="p-4 rounded-xl bg-gradient-to-br from-water/10 to-water/5 border border-water/20 hover:from-water/15 hover:to-water/10 transition-all duration-300 active:scale-95"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-water/20 flex items-center justify-center">
                <Droplets className="w-5 h-5 text-water" />
              </div>
              <div className="text-left">
                <p className="font-medium text-foreground">Log Water</p>
                <p className="text-sm text-muted-foreground">+250ml</p>
              </div>
            </div>
          </button>
          
          <button 
            onClick={() => addProtein(25)}
            className="p-4 rounded-xl bg-gradient-to-br from-protein/10 to-protein/5 border border-protein/20 hover:from-protein/15 hover:to-protein/10 transition-all duration-300 active:scale-95"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-protein/20 flex items-center justify-center">
                <Zap className="w-5 h-5 text-protein" />
              </div>
              <div className="text-left">
                <p className="font-medium text-foreground">Add Protein</p>
                <p className="text-sm text-muted-foreground">+25g</p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};