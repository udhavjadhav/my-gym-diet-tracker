import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocalStorage } from "@/hooks/useStorage";
import { MealLog, UserSettings } from "@/types/fitness";
import { ArrowLeft, Utensils, Calendar, TrendingUp } from "lucide-react";
import { ProgressCircle } from "@/components/ProgressCircle";

export default function CaloriesHistory() {
  const navigate = useNavigate();
  const [mealLogs] = useLocalStorage<MealLog[]>('mealLogs', []);
  const [settings] = useLocalStorage<UserSettings>('userSettings', {
    goals: { water: 4000, protein: 150, calories: 2000 },
    notifications: { water: true, protein: true, gym: true, waterInterval: 1, proteinTimes: ['08:00', '12:00', '18:00'] }
  });

  // Group logs by date
  const groupedLogs = mealLogs.reduce((acc, log) => {
    if (!acc[log.date]) {
      acc[log.date] = [];
    }
    acc[log.date].push(log);
    return acc;
  }, {} as Record<string, MealLog[]>);

  // Sort dates in descending order
  const sortedDates = Object.keys(groupedLogs).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );

  const getDailyTotal = (logs: MealLog[]) => {
    return logs.reduce((sum, log) => sum + log.calories, 0);
  };

  const getDailyPercentage = (dailyTotal: number) => {
    return Math.min((dailyTotal / settings.goals.calories) * 100, 100);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    if (dateStr === today) return "Today";
    if (dateStr === yesterday) return "Yesterday";
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3 pt-2">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate('/')}
            className="h-10 w-10"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <Utensils className="h-6 w-6 text-calories" />
            <h1 className="text-2xl font-bold text-foreground">Calories History</h1>
          </div>
        </div>

        {/* Overall Stats */}
        <Card className="p-6 bg-gradient-to-br from-calories/5 to-calories/10 border-calories/20">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-2">Total Intake</h2>
              <div className="text-3xl font-bold text-calories">
                {mealLogs.reduce((sum, log) => sum + log.calories, 0).toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">
                {mealLogs.length} meals recorded
              </div>
            </div>
            <TrendingUp className="h-12 w-12 text-calories/60" />
          </div>
        </Card>

        {/* Daily History */}
        <div className="space-y-4">
          {sortedDates.length === 0 ? (
            <Card className="p-8 text-center">
              <Utensils className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No meals logged yet</h3>
              <p className="text-muted-foreground">Start tracking your meals to see your calorie history here!</p>
            </Card>
          ) : (
            sortedDates.map(date => {
              const dayLogs = groupedLogs[date];
              const dailyTotal = getDailyTotal(dayLogs);
              const percentage = getDailyPercentage(dailyTotal);

              return (
                <Card key={date} className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-calories" />
                      <div>
                        <h3 className="font-semibold text-foreground">{formatDate(date)}</h3>
                        <p className="text-sm text-muted-foreground">{date}</p>
                      </div>
                    </div>
                    <ProgressCircle 
                      percentage={percentage} 
                      size={60} 
                      color="calories"
                    >
                      <span className="text-xs font-semibold text-calories">
                        {Math.round(percentage)}%
                      </span>
                    </ProgressCircle>
                  </div>

                  <div className="mb-4">
                    <div className="text-2xl font-bold text-calories">
                      {dailyTotal.toLocaleString()} cal
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Goal: {settings.goals.calories.toLocaleString()} cal
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-foreground">Meals ({dayLogs.length})</h4>
                    <div className="space-y-1 max-h-32 overflow-y-auto">
                      {dayLogs
                        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                        .map(log => (
                          <div key={log.id} className="flex items-center justify-between p-2 rounded bg-calories/5">
                            <div>
                              <span className="text-sm font-medium text-foreground">{log.calories} cal</span>
                              <span className="text-xs text-muted-foreground ml-2">{log.name}</span>
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {new Date(log.timestamp).toLocaleTimeString('en-US', { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </span>
                          </div>
                        ))
                      }
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}