import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { QuickAddButton } from "./QuickAddButton";
import { ProgressCircle } from "./ProgressCircle";
import { useLocalStorage } from "@/hooks/useStorage";
import { ProteinLog, UserSettings } from "@/types/fitness";
import { Zap, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const ProteinTracker = () => {
  const [proteinLogs, setProteinLogs] = useLocalStorage<ProteinLog[]>('proteinLogs', []);
  const [settings] = useLocalStorage<UserSettings>('userSettings', {
    goals: { water: 2000, protein: 150, calories: 2000 },
    notifications: { water: true, protein: true, gym: true, waterInterval: 1, proteinTimes: ['08:00', '12:00', '18:00'] }
  });
  const [customAmount, setCustomAmount] = useState('');
  const [source, setSource] = useState('');
  const { toast } = useToast();

  const today = new Date().toISOString().split('T')[0];
  const todayProtein = proteinLogs
    .filter(log => log.date === today)
    .reduce((sum, log) => sum + log.amount, 0);

  const percentage = (todayProtein / settings.goals.protein) * 100;
  const remaining = Math.max(0, settings.goals.protein - todayProtein);

  const addProtein = (amount: number, proteinSource = 'Quick add') => {
    const newLog: ProteinLog = {
      id: Date.now().toString(),
      amount,
      source: proteinSource,
      timestamp: new Date().toISOString(),
      date: today
    };

    setProteinLogs(prev => [...prev, newLog]);
    
    toast({
      title: "Protein logged! ⚡",
      description: `Added ${amount}g from ${proteinSource}`,
    });

    if (todayProtein + amount >= settings.goals.protein) {
      toast({
        title: "Daily goal reached! 🎯",
        description: "Excellent protein intake today!",
      });
    }
  };

  const handleCustomAdd = () => {
    const amount = parseInt(customAmount);
    if (amount > 0) {
      addProtein(amount, source || 'Custom');
      setCustomAmount('');
      setSource('');
    }
  };

  const todayLogs = proteinLogs
    .filter(log => log.date === today)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <Card className="p-6 bg-gradient-to-br from-protein/5 to-protein/10 border-protein/20">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-foreground mb-2">Protein Intake</h2>
            <div className="space-y-1">
              <div className="text-3xl font-bold text-protein">
                {todayProtein}g
              </div>
              <div className="text-sm text-muted-foreground">
                Goal: {settings.goals.protein}g
              </div>
              {remaining > 0 && (
                <div className="text-sm text-protein">
                  {remaining}g remaining
                </div>
              )}
            </div>
          </div>
          
          <ProgressCircle 
            percentage={Math.min(percentage, 100)} 
            size={100} 
            color="protein"
          >
            <div className="text-center">
              <div className="text-lg font-bold text-protein">
                {Math.round(Math.min(percentage, 100))}%
              </div>
              <Zap className="w-4 h-4 text-protein mx-auto" />
            </div>
          </ProgressCircle>
        </div>
      </Card>

      {/* Quick Add Buttons */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-foreground">Quick Add</h3>
        <div className="grid grid-cols-3 gap-3">
          <QuickAddButton 
            value={25} 
            unit="g shake" 
            onClick={(value) => addProtein(value, 'Protein shake')}
            variant="protein"
          />
          <QuickAddButton 
            value={30} 
            unit="g chicken" 
            onClick={(value) => addProtein(value, 'Chicken breast')}
            variant="protein"
          />
          <QuickAddButton 
            value={20} 
            unit="g eggs" 
            onClick={(value) => addProtein(value, 'Eggs')}
            variant="protein"
          />
        </div>
      </div>

      {/* Custom Amount */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-foreground">Custom Entry</h3>
        <div className="space-y-3">
          <Input
            type="text"
            placeholder="Protein source (e.g., Greek yogurt)"
            value={source}
            onChange={(e) => setSource(e.target.value)}
          />
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Enter grams"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              className="flex-1"
            />
            <Button 
              onClick={handleCustomAdd}
              disabled={!customAmount || parseInt(customAmount) <= 0}
              className="bg-gradient-to-r from-protein to-protein/80 hover:from-protein/80 hover:to-protein/60"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
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
                  <div className="w-2 h-2 rounded-full bg-protein" />
                  <div>
                    <span className="font-medium text-foreground">{log.amount}g</span>
                    <span className="text-sm text-muted-foreground ml-2">{log.source}</span>
                  </div>
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