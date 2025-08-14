import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocalStorage } from "@/hooks/useStorage";
import { WorkoutSession } from "@/types/fitness";
import { ArrowLeft, Dumbbell, Calendar, TrendingUp, Clock } from "lucide-react";

export default function WorkoutHistory() {
  const navigate = useNavigate();
  const [workoutSessions] = useLocalStorage<WorkoutSession[]>('workoutSessions', []);

  // Group sessions by date
  const groupedSessions = workoutSessions.reduce((acc, session) => {
    if (!acc[session.date]) {
      acc[session.date] = [];
    }
    acc[session.date].push(session);
    return acc;
  }, {} as Record<string, WorkoutSession[]>);

  // Sort dates in descending order
  const sortedDates = Object.keys(groupedSessions).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    if (dateStr === today) return "Today";
    if (dateStr === yesterday) return "Yesterday";
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
  };

  const getTotalWorkouts = () => workoutSessions.length;
  const getTotalDuration = () => {
    return workoutSessions.reduce((sum, session) => sum + (session.duration || 0), 0);
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
            <Dumbbell className="h-6 w-6 text-workout" />
            <h1 className="text-2xl font-bold text-foreground">Workout History</h1>
          </div>
        </div>

        {/* Overall Stats */}
        <Card className="p-6 bg-gradient-to-br from-workout/5 to-workout/10 border-workout/20">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-2">Total Workouts</h2>
              <div className="text-3xl font-bold text-workout">
                {getTotalWorkouts()}
              </div>
              <div className="text-sm text-muted-foreground">
                {Math.round(getTotalDuration() / 60)} hours total
              </div>
            </div>
            <TrendingUp className="h-12 w-12 text-workout/60" />
          </div>
        </Card>

        {/* Daily History */}
        <div className="space-y-4">
          {sortedDates.length === 0 ? (
            <Card className="p-8 text-center">
              <Dumbbell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No workouts yet</h3>
              <p className="text-muted-foreground">Start tracking your workouts to see your history here!</p>
            </Card>
          ) : (
            sortedDates.map(date => {
              const daySessions = groupedSessions[date];
              const dayDuration = daySessions.reduce((sum, session) => sum + (session.duration || 0), 0);

              return (
                <Card key={date} className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-workout" />
                      <div>
                        <h3 className="font-semibold text-foreground">{formatDate(date)}</h3>
                        <p className="text-sm text-muted-foreground">{date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-workout">
                        {daySessions.length} workout{daySessions.length !== 1 ? 's' : ''}
                      </div>
                      {dayDuration > 0 && (
                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {Math.round(dayDuration)} min
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-foreground">Sessions ({daySessions.length})</h4>
                    <div className="space-y-1 max-h-32 overflow-y-auto">
                      {daySessions
                        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                        .map(session => (
                          <div key={session.id} className="flex items-center justify-between p-2 rounded bg-workout/5">
                            <div>
                              <span className="text-sm font-medium text-foreground">Workout Session</span>
                              {session.duration && (
                                <span className="text-xs text-muted-foreground ml-2">
                                  {session.duration} min
                                </span>
                              )}
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {new Date(session.timestamp).toLocaleTimeString('en-US', { 
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