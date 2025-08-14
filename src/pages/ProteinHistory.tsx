import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocalStorage } from "@/hooks/useStorage";
import { ProteinLog, UserSettings } from "@/types/fitness";
import { ArrowLeft, Zap, Calendar, TrendingUp } from "lucide-react";
import { ProgressCircle } from "@/components/ProgressCircle";

export default function ProteinHistory() {
  const navigate = useNavigate();
  const [proteinLogs] = useLocalStorage<ProteinLog[]>('proteinLogs', []);
  const [settings] = useLocalStorage<UserSettings>('userSettings', {
    goals: { water: 4000, protein: 150, calories: 2000 },
    notifications: { water: true, protein: true, gym: true, waterInterval: 1, proteinTimes: ['08:00', '12:00', '18:00'] }
  });

  // Group logs by date
  const groupedLogs = proteinLogs.reduce((acc, log) => {
    if (!acc[log.date]) {
      acc[log.date] = [];
    }
    acc[log.date].push(log);
    return acc;
  }, {} as Record<string, ProteinLog[]>);

  // Sort dates in descending order
  const sortedDates = Object.keys(groupedLogs).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );

  const getDailyTotal = (logs: ProteinLog[]) => {
    return logs.reduce((sum, log) => sum + log.amount, 0);
  };

  const getDailyPercentage = (dailyTotal: number) => {
    return Math.min((dailyTotal / settings.goals.protein) * 100, 100);
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
            <Zap className="h-6 w-6 text-protein" />
            <h1 className="text-2xl font-bold text-foreground">Protein History</h1>
          </div>
        </div>

        {/* Overall Stats */}
        <Card className="p-6 bg-gradient-to-br from-protein/5 to-protein/10 border-protein/20">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-2">Total Intake</h2>
              <div className="text-3xl font-bold text-protein">
                {proteinLogs.reduce((sum, log) => sum + log.amount, 0)}g
              </div>
              <div className="text-sm text-muted-foreground">
                {proteinLogs.length} entries recorded
              </div>
            </div>
            <TrendingUp className="h-12 w-12 text-protein/60" />
          </div>
        </Card>

        {/* Daily History */}
        <div className="space-y-4">
          {sortedDates.length === 0 ? (
            <Card className="p-8 text-center">
              <Zap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No protein logs yet</h3>
              <p className="text-muted-foreground">Start tracking your protein intake to see your history here!</p>
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
                      <Calendar className="h-5 w-5 text-protein" />
                      <div>
                        <h3 className="font-semibold text-foreground">{formatDate(date)}</h3>
                        <p className="text-sm text-muted-foreground">{date}</p>
                      </div>
                    </div>
                    <ProgressCircle 
                      percentage={percentage} 
                      size={60} 
                      color="protein"
                    >
                      <span className="text-xs font-semibold text-protein">
                        {Math.round(percentage)}%
                      </span>
                    </ProgressCircle>
                  </div>

                  <div className="mb-4">
                    <div className="text-2xl font-bold text-protein">
                      {dailyTotal}g
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Goal: {settings.goals.protein}g
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-foreground">Daily entries ({dayLogs.length})</h4>
                    <div className="space-y-1 max-h-32 overflow-y-auto">
                      {dayLogs
                        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                        .map(log => (
                          <div key={log.id} className="flex items-center justify-between p-2 rounded bg-protein/5">
                            <div>
                              <span className="text-sm font-medium text-foreground">{log.amount}g</span>
                              <span className="text-xs text-muted-foreground ml-2">{log.source}</span>
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