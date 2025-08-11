import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { QuickAddButton } from "./QuickAddButton";
import { ProgressCircle } from "./ProgressCircle";
import { useLocalStorage } from "@/hooks/useStorage";
import { WaterLog, UserSettings } from "@/types/fitness";
import { Droplets, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const WaterTracker = () => {
  const [waterLogs, setWaterLogs] = useLocalStorage<WaterLog[]>('waterLogs', []);
  const [settings] = useLocalStorage<UserSettings>('userSettings', {
    goals: { water: 2000, protein: 150, calories: 2000 },
    notifications: { water: true, protein: true, gym: true, waterInterval: 1, proteinTimes: ['08:00', '12:00', '18:00'] }
  });
  const [customAmount, setCustomAmount] = useState('');
  const { toast } = useToast();

  const today = new Date().toISOString().split('T')[0];
  const todayWater = waterLogs
    .filter(log => log.date === today)
    .reduce((sum, log) => sum + log.amount, 0);

  const percentage = (todayWater / settings.goals.water) * 100;
  const remaining = Math.max(0, settings.goals.water - todayWater);

  const addWater = (amount: number) => {
    const newLog: WaterLog = {
      id: Date.now().toString(),
      amount,
      timestamp: new Date().toISOString(),
      date: today
    };

    setWaterLogs(prev => [...prev, newLog]);
    
    toast({
      title: "Water logged! 💧",
      description: `Added ${amount}ml to your daily intake`,
    });

    if (todayWater + amount >= settings.goals.water) {
      toast({
        title: "Daily goal reached! 🎉",
        description: "Great job staying hydrated!",
      });
    }
  };

  const handleCustomAdd = () => {
    const amount = parseInt(customAmount);
    if (amount > 0) {
      addWater(amount);
      setCustomAmount('');
    }
  };

  const todayLogs = waterLogs
    .filter(log => log.date === today)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <Card className="p-6 bg-gradient-to-br from-water/5 to-water/10 border-water/20">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-foreground mb-2">Water Intake</h2>
            <div className="space-y-1">
              <div className="text-3xl font-bold text-water">
                {todayWater.toLocaleString()}ml
              </div>
              <div className="text-sm text-muted-foreground">
                Goal: {settings.goals.water.toLocaleString()}ml
              </div>
              {remaining > 0 && (
                <div className="text-sm text-water">
                  {remaining.toLocaleString()}ml remaining
                </div>
              )}
            </div>
          </div>
          
          <ProgressCircle 
            percentage={Math.min(percentage, 100)} 
            size={100} 
            color="water"
          >
            <div className="text-center">
              <div className="text-lg font-bold text-water">
                {Math.round(Math.min(percentage, 100))}%
              </div>
              <Droplets className="w-4 h-4 text-water mx-auto" />
            </div>
          </ProgressCircle>
        </div>
      </Card>

      {/* Quick Add Buttons */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-foreground">Quick Add</h3>
        <div className="grid grid-cols-3 gap-3">
          <QuickAddButton 
            value={250} 
            unit="ml" 
            onClick={addWater}
            variant="water"
          />
          <QuickAddButton 
            value={500} 
            unit="ml" 
            onClick={addWater}
            variant="water"
          />
          <QuickAddButton 
            value={1000} 
            unit="ml" 
            onClick={addWater}
            variant="water"
          />
        </div>
      </div>

      {/* Custom Amount */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-foreground">Custom Amount</h3>
        <div className="flex gap-2">
          <Input
            type="number"
            placeholder="Enter ml"
            value={customAmount}
            onChange={(e) => setCustomAmount(e.target.value)}
            className="flex-1"
          />
          <Button 
            onClick={handleCustomAdd}
            disabled={!customAmount || parseInt(customAmount) <= 0}
            className="bg-gradient-to-r from-water to-water/80 hover:from-water/80 hover:to-water/60"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Today's Logs */}
      {todayLogs.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-foreground">Today's Intake</h3>
          <div className="space-y-2">
            {todayLogs.slice(0, 5).map((log) => (
              <div 
                key={log.id}
                className="flex items-center justify-between p-3 rounded-lg bg-card border border-border"
              >
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-water" />
                  <span className="font-medium text-foreground">{log.amount}ml</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {new Date(log.timestamp).toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};