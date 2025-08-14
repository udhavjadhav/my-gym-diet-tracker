import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocalStorage } from "@/hooks/useStorage";
import { WaterLog, UserSettings } from "@/types/fitness";
import { ArrowLeft, Droplets, Calendar, TrendingUp } from "lucide-react";
import { ProgressCircle } from "@/components/ProgressCircle";

export default function WaterHistory() {
  const navigate = useNavigate();
  const [waterLogs] = useLocalStorage<WaterLog[]>('waterLogs', []);
  const [settings] = useLocalStorage<UserSettings>('userSettings', {
    goals: { water: 4000, protein: 150, calories: 2000 },
    notifications: { water: true, protein: true, gym: true, waterInterval: 1, proteinTimes: ['08:00', '12:00', '18:00'] }
  });

  // Group logs by date
  const groupedLogs = waterLogs.reduce((acc, log) => {
    if (!acc[log.date]) {
      acc[log.date] = [];
    }
    acc[log.date].push(log);
    return acc;
  }, {} as Record<string, WaterLog[]>);

  // Sort dates in descending order
  const sortedDates = Object.keys(groupedLogs).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );

  const getDailyTotal = (logs: WaterLog[]) => {
    return logs.reduce((sum, log) => sum + log.amount, 0);
  };

  const getDailyPercentage = (dailyTotal: number) => {
    return Math.min((dailyTotal / settings.goals.water) * 100, 100);
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
            <Droplets className="h-6 w-6 text-water" />
            <h1 className="text-2xl font-bold text-foreground">Water History</h1>
          </div>
        </div>

        {/* Overall Stats */}
        <Card className="p-6 bg-gradient-to-br from-water/5 to-water/10 border-water/20">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-2">Total Intake</h2>
              <div className="text-3xl font-bold text-water">
                {(waterLogs.reduce((sum, log) => sum + log.amount, 0) / 1000).toFixed(1)}L
              </div>
              <div className="text-sm text-muted-foreground">
                {waterLogs.length} entries recorded
              </div>
            </div>
            <TrendingUp className="h-12 w-12 text-water/60" />
          </div>
        </Card>

        {/* Daily History */}
        <div className="space-y-4">
          {sortedDates.length === 0 ? (
            <Card className="p-8 text-center">
              <Droplets className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No water logs yet</h3>
              <p className="text-muted-foreground">Start tracking your water intake to see your history here!</p>
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
                      <Calendar className="h-5 w-5 text-water" />
                      <div>
                        <h3 className="font-semibold text-foreground">{formatDate(date)}</h3>
                        <p className="text-sm text-muted-foreground">{date}</p>
                      </div>
                    </div>
                    <ProgressCircle 
                      percentage={percentage} 
                      size={60} 
                      color="water"
                    >
                      <span className="text-xs font-semibold text-water">
                        {Math.round(percentage)}%
                      </span>
                    </ProgressCircle>
                  </div>

                  <div className="mb-4">
                    <div className="text-2xl font-bold text-water">
                      {dailyTotal.toLocaleString()}ml
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Goal: {settings.goals.water.toLocaleString()}ml
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-foreground">Daily entries ({dayLogs.length})</h4>
                    <div className="space-y-1 max-h-32 overflow-y-auto">
                      {dayLogs
                        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                        .map(log => (
                          <div key={log.id} className="flex items-center justify-between p-2 rounded bg-water/5">
                            <span className="text-sm text-foreground">{log.amount}ml</span>
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