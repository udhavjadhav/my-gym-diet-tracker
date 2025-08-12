import { Calendar } from "@/components/ui/calendar";
import { useLocalStorage } from "@/hooks/useStorage";
import { GymLog } from "@/types/fitness";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday } from "date-fns";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export const GymCalendar = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [gymLogs, setGymLogs] = useLocalStorage<GymLog[]>('gymLogs', []);
  const { toast } = useToast();

  const currentMonth = selectedDate || new Date();
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getGymLogForDate = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return gymLogs.find(log => log.date === dateStr);
  };

  const markAttendance = (attended: boolean) => {
    if (!selectedDate) return;
    
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    const existingLog = gymLogs.find(log => log.date === dateStr);
    
    if (existingLog) {
      // Update existing log
      setGymLogs(prev => prev.map(log => 
        log.date === dateStr 
          ? { ...log, attended, timestamp: new Date().toISOString() }
          : log
      ));
    } else {
      // Create new log
      const newLog: GymLog = {
        id: Date.now().toString(),
        date: dateStr,
        attended,
        timestamp: new Date().toISOString()
      };
      setGymLogs(prev => [...prev, newLog]);
    }

    toast({
      title: attended ? "Gym session logged! 💪" : "Rest day marked",
      description: attended ? "Great job on your workout!" : "Recovery is important too!",
    });
  };

  const modifiers = {
    attended: (day: Date) => {
      const log = getGymLogForDate(day);
      return log?.attended === true;
    },
    missed: (day: Date) => {
      const log = getGymLogForDate(day);
      return log?.attended === false;
    },
    today: (day: Date) => isToday(day)
  };

  const modifiersStyles = {
    attended: {
      backgroundColor: 'hsl(var(--success))',
      color: 'hsl(var(--success-foreground))',
    },
    missed: {
      backgroundColor: 'hsl(var(--destructive))',
      color: 'hsl(var(--destructive-foreground))',
    },
    today: {
      fontWeight: 'bold',
      border: '2px solid hsl(var(--primary))'
    }
  };

  const selectedLog = selectedDate ? getGymLogForDate(selectedDate) : null;

  const attendanceStats = () => {
    const thisMonth = gymLogs.filter(log => log.date.startsWith(format(currentMonth, 'yyyy-MM')));
    const attended = thisMonth.filter(log => log.attended).length;
    const total = thisMonth.length;
    const percentage = total > 0 ? Math.round((attended / total) * 100) : 0;
    
    return { attended, total, percentage };
  };

  const stats = attendanceStats();

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-foreground mb-2">Gym Attendance</h1>
        <p className="text-muted-foreground">Track your fitness journey</p>
      </div>

      {/* Monthly Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-card rounded-xl p-4 text-center border border-border">
          <p className="text-2xl font-bold text-success">{stats.attended}</p>
          <p className="text-sm text-muted-foreground">Attended</p>
        </div>
        <div className="bg-card rounded-xl p-4 text-center border border-border">
          <p className="text-2xl font-bold text-destructive">{stats.total - stats.attended}</p>
          <p className="text-sm text-muted-foreground">Missed</p>
        </div>
        <div className="bg-card rounded-xl p-4 text-center border border-border">
          <p className="text-2xl font-bold text-primary">{stats.percentage}%</p>
          <p className="text-sm text-muted-foreground">Success Rate</p>
        </div>
      </div>

      <div className="bg-card rounded-2xl p-6 border border-border">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-foreground mb-2">
            {format(currentMonth, 'MMMM yyyy')}
          </h3>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-success h-2 rounded-full transition-all duration-500"
              style={{ width: `${stats.percentage}%` }}
            />
          </div>
        </div>
        
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          modifiers={modifiers}
          modifiersStyles={modifiersStyles}
          className="w-full pointer-events-auto"
        />
      </div>

      {selectedDate && (
        <div className="bg-card rounded-2xl p-6 border border-border space-y-4">
          <h3 className="text-lg font-semibold text-foreground">
            {format(selectedDate, 'EEEE, MMMM d, yyyy')}
          </h3>
          
          {selectedLog ? (
            <div className="space-y-3">
              <div className={cn(
                "p-3 rounded-lg",
                selectedLog.attended 
                  ? "bg-success/10 text-success-foreground border border-success/20" 
                  : "bg-destructive/10 text-destructive-foreground border border-destructive/20"
              )}>
                <p className="font-medium">
                  {selectedLog.attended ? "✅ Attended gym" : "❌ Missed gym"}
                </p>
              </div>
              <div className="flex gap-3">
                <Button 
                  onClick={() => markAttendance(true)}
                  variant={selectedLog.attended ? "default" : "outline"}
                  className="flex-1"
                >
                  Mark as Attended
                </Button>
                <Button 
                  onClick={() => markAttendance(false)}
                  variant={!selectedLog.attended ? "destructive" : "outline"}
                  className="flex-1"
                >
                  Mark as Missed
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-muted-foreground">No record for this day</p>
              <div className="flex gap-3">
                <Button 
                  onClick={() => markAttendance(true)}
                  className="flex-1"
                >
                  Mark as Attended
                </Button>
                <Button 
                  onClick={() => markAttendance(false)}
                  variant="destructive"
                  className="flex-1"
                >
                  Mark as Missed
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="bg-card rounded-2xl p-6 border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-3">Legend</h3>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-success"></div>
            <span>Attended gym</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-destructive"></div>
            <span>Missed gym</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded border-2 border-primary"></div>
            <span>Today</span>
          </div>
        </div>
      </div>
    </div>
  );
};