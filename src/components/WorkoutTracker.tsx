import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useLocalStorage } from "@/hooks/useStorage";
import { WorkoutTemplate, WorkoutSession, Exercise, CompletedExercise } from "@/types/fitness";
import { Dumbbell, Plus, Edit3, Save, Play, CheckCircle, Calendar, ArrowLeft, Target, Clock, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { GymCalendar } from "@/components/GymCalendar";

// Import workout images
import chestTricepsImg from "@/assets/chest-triceps.jpg";
import backBicepsImg from "@/assets/back-biceps.jpg";
import legsShoulders from "@/assets/legs-shoulders.jpg";
import restDayImg from "@/assets/rest-day.jpg";

const defaultWorkoutTemplates: WorkoutTemplate[] = [
  {
    id: "monday",
    day: "Monday",
    name: "Chest & Triceps",
    muscleGroups: ["Chest", "Triceps"],
    exercises: [
      { id: "1", name: "Bench Press", sets: 4, reps: "8-10" },
      { id: "2", name: "Incline Dumbbell Press", sets: 3, reps: "10-12" },
      { id: "3", name: "Chest Flyes", sets: 3, reps: "12-15" },
      { id: "4", name: "Tricep Dips", sets: 3, reps: "10-12" },
      { id: "5", name: "Tricep Pushdowns", sets: 3, reps: "12-15" }
    ]
  },
  {
    id: "tuesday",
    day: "Tuesday", 
    name: "Back & Biceps",
    muscleGroups: ["Back", "Biceps"],
    exercises: [
      { id: "6", name: "Pull-ups", sets: 4, reps: "6-10" },
      { id: "7", name: "Barbell Rows", sets: 4, reps: "8-10" },
      { id: "8", name: "Lat Pulldowns", sets: 3, reps: "10-12" },
      { id: "9", name: "Bicep Curls", sets: 3, reps: "12-15" },
      { id: "10", name: "Hammer Curls", sets: 3, reps: "12-15" }
    ]
  },
  {
    id: "wednesday",
    day: "Wednesday",
    name: "Legs & Shoulders", 
    muscleGroups: ["Legs", "Shoulders"],
    exercises: [
      { id: "11", name: "Squats", sets: 4, reps: "8-12" },
      { id: "12", name: "Leg Press", sets: 3, reps: "12-15" },
      { id: "13", name: "Leg Curls", sets: 3, reps: "12-15" },
      { id: "14", name: "Shoulder Press", sets: 4, reps: "8-12" },
      { id: "15", name: "Lateral Raises", sets: 3, reps: "12-15" }
    ]
  },
  {
    id: "thursday",
    day: "Thursday",
    name: "Chest & Triceps",
    muscleGroups: ["Chest", "Triceps"],
    exercises: [
      { id: "16", name: "Incline Barbell Press", sets: 4, reps: "8-10" },
      { id: "17", name: "Dumbbell Press", sets: 3, reps: "10-12" },
      { id: "18", name: "Cable Crossovers", sets: 3, reps: "12-15" },
      { id: "19", name: "Close Grip Bench", sets: 3, reps: "8-10" },
      { id: "20", name: "Overhead Extension", sets: 3, reps: "12-15" }
    ]
  },
  {
    id: "friday",
    day: "Friday",
    name: "Back & Biceps",
    muscleGroups: ["Back", "Biceps"],
    exercises: [
      { id: "21", name: "Deadlifts", sets: 4, reps: "6-8" },
      { id: "22", name: "Seated Rows", sets: 4, reps: "8-10" },
      { id: "23", name: "T-Bar Rows", sets: 3, reps: "10-12" },
      { id: "24", name: "Preacher Curls", sets: 3, reps: "10-12" },
      { id: "25", name: "Cable Curls", sets: 3, reps: "12-15" }
    ]
  },
  {
    id: "saturday",
    day: "Saturday",
    name: "Legs & Shoulders",
    muscleGroups: ["Legs", "Shoulders"],
    exercises: [
      { id: "26", name: "Romanian Deadlifts", sets: 4, reps: "8-10" },
      { id: "27", name: "Leg Extensions", sets: 3, reps: "12-15" },
      { id: "28", name: "Calf Raises", sets: 4, reps: "15-20" },
      { id: "29", name: "Arnold Press", sets: 3, reps: "10-12" },
      { id: "30", name: "Rear Delt Flyes", sets: 3, reps: "12-15" }
    ]
  },
  {
    id: "sunday",
    day: "Sunday",
    name: "Rest Day",
    muscleGroups: ["Rest"],
    exercises: []
  }
];

// Helper function to get workout image
const getWorkoutImage = (workoutName: string) => {
  if (workoutName.includes('Chest') || workoutName.includes('Tricep')) return chestTricepsImg;
  if (workoutName.includes('Back') || workoutName.includes('Bicep')) return backBicepsImg;
  if (workoutName.includes('Legs') || workoutName.includes('Shoulder')) return legsShoulders;
  if (workoutName.includes('Rest')) return restDayImg;
  return chestTricepsImg; // fallback
};

// Helper function to get muscle group color
const getMuscleGroupColor = (workoutName: string) => {
  if (workoutName.includes('Chest') || workoutName.includes('Tricep')) return 'from-orange-500/20 to-red-500/20';
  if (workoutName.includes('Back') || workoutName.includes('Bicep')) return 'from-blue-500/20 to-purple-500/20';
  if (workoutName.includes('Legs') || workoutName.includes('Shoulder')) return 'from-green-500/20 to-teal-500/20';
  if (workoutName.includes('Rest')) return 'from-gray-500/20 to-slate-500/20';
  return 'from-primary/20 to-accent/20';
};

export const WorkoutTracker = () => {
  const [workoutTemplates, setWorkoutTemplates] = useLocalStorage<WorkoutTemplate[]>('workoutTemplates', defaultWorkoutTemplates);
  const [workoutSessions, setWorkoutSessions] = useLocalStorage<WorkoutSession[]>('workoutSessions', []);
  const [editingTemplate, setEditingTemplate] = useState<string | null>(null);
  const [activeWorkout, setActiveWorkout] = useState<WorkoutSession | null>(null);
  const [currentView, setCurrentView] = useState<'main' | 'attendance'>('main');
  const { toast } = useToast();

  const today = new Date();
  const todayName = format(today, 'EEEE');
  const todayTemplate = workoutTemplates.find(t => t.day === todayName);

  const startWorkout = (template: WorkoutTemplate) => {
    const session: WorkoutSession = {
      id: Date.now().toString(),
      templateId: template.id,
      date: format(today, 'yyyy-MM-dd'),
      exercises: template.exercises.map(ex => ({
        exerciseId: ex.id,
        name: ex.name,
        sets: Array(ex.sets).fill(null).map(() => ({ reps: 0, weight: 0, completed: false }))
      })),
      timestamp: new Date().toISOString()
    };
    setActiveWorkout(session);
  };

  const completeWorkout = () => {
    if (!activeWorkout) return;
    
    setWorkoutSessions(prev => [...prev, activeWorkout]);
    setActiveWorkout(null);
    
    toast({
      title: "Workout completed! 💪",
      description: "Great job on finishing your session!",
    });
  };

  const updateExerciseSet = (exerciseId: string, setIndex: number, field: 'reps' | 'weight', value: number) => {
    if (!activeWorkout) return;
    
    setActiveWorkout(prev => {
      if (!prev) return prev;
      
      return {
        ...prev,
        exercises: prev.exercises.map(ex => 
          ex.exerciseId === exerciseId 
            ? {
                ...ex,
                sets: ex.sets.map((set, idx) => 
                  idx === setIndex ? { ...set, [field]: value } : set
                )
              }
            : ex
        )
      };
    });
  };

  const toggleSetComplete = (exerciseId: string, setIndex: number) => {
    if (!activeWorkout) return;
    
    setActiveWorkout(prev => {
      if (!prev) return prev;
      
      return {
        ...prev,
        exercises: prev.exercises.map(ex => 
          ex.exerciseId === exerciseId 
            ? {
                ...ex,
                sets: ex.sets.map((set, idx) => 
                  idx === setIndex ? { ...set, completed: !set.completed } : set
                )
              }
            : ex
        )
      };
    });
  };

  const addExercise = (templateId: string) => {
    const newExercise: Exercise = {
      id: Date.now().toString(),
      name: "New Exercise",
      sets: 3,
      reps: "8-12"
    };
    
    setWorkoutTemplates(prev => prev.map(template => 
      template.id === templateId 
        ? { ...template, exercises: [...template.exercises, newExercise] }
        : template
    ));
  };

  const updateExercise = (templateId: string, exerciseId: string, updates: Partial<Exercise>) => {
    setWorkoutTemplates(prev => prev.map(template => 
      template.id === templateId 
        ? {
            ...template,
            exercises: template.exercises.map(ex => 
              ex.id === exerciseId ? { ...ex, ...updates } : ex
            )
          }
        : template
    ));
  };

  if (activeWorkout) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Play className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">Active Workout</h1>
          </div>
          <Button onClick={completeWorkout} className="bg-success hover:bg-success/80">
            <CheckCircle className="w-4 h-4 mr-2" />
            Complete
          </Button>
        </div>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">{workoutTemplates.find(t => t.id === activeWorkout.templateId)?.name}</h2>
          
          <div className="space-y-6">
            {activeWorkout.exercises.map((exercise) => (
              <div key={exercise.exerciseId} className="border border-border rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-3">{exercise.name}</h3>
                
                <div className="space-y-2">
                  <div className="grid grid-cols-4 gap-2 text-sm font-medium text-muted-foreground">
                    <span>Set</span>
                    <span>Reps</span>
                    <span>Weight</span>
                    <span>Done</span>
                  </div>
                  
                  {exercise.sets.map((set, setIndex) => (
                    <div key={setIndex} className="grid grid-cols-4 gap-2 items-center">
                      <span className="text-sm">{setIndex + 1}</span>
                      <Input
                        type="number"
                        value={set.reps}
                        onChange={(e) => updateExerciseSet(exercise.exerciseId, setIndex, 'reps', parseInt(e.target.value) || 0)}
                        className="h-8"
                      />
                      <Input
                        type="number"
                        value={set.weight}
                        onChange={(e) => updateExerciseSet(exercise.exerciseId, setIndex, 'weight', parseFloat(e.target.value) || 0)}
                        className="h-8"
                      />
                      <Button
                        variant={set.completed ? "default" : "outline"}
                        size="sm"
                        onClick={() => toggleSetComplete(exercise.exerciseId, setIndex)}
                        className="h-8"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    );
  }

  if (currentView === 'attendance') {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setCurrentView('main')}
            className="p-1"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <Calendar className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">Gym Attendance</h1>
        </div>
        <GymCalendar />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Dumbbell className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">Workout Tracker</h1>
        </div>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setCurrentView('attendance')}
          className="flex items-center gap-2"
        >
          <Calendar className="w-4 h-4" />
          Gym Attendance
        </Button>
      </div>

      {/* Today's Workout */}
      {todayTemplate && (
        <Card className="overflow-hidden">
          <div 
            className={`relative h-40 bg-gradient-to-br ${getMuscleGroupColor(todayTemplate.name)} flex items-center justify-center`}
            style={{
              backgroundImage: `url(${getWorkoutImage(todayTemplate.name)})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="absolute inset-0 bg-black/50" />
            <div className="relative z-10 text-center text-white">
              <Target className="w-8 h-8 mx-auto mb-2" />
              <h2 className="text-2xl font-bold">Today's Workout</h2>
              <p className="text-white/90">{todayTemplate.name}</p>
            </div>
          </div>
          
          <CardContent className="p-6">
            {todayTemplate.exercises.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">🧘‍♂️</div>
                <h3 className="text-xl font-semibold mb-2">Rest Day</h3>
                <p className="text-muted-foreground">Take time to recover and relax. Your muscles need this!</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {todayTemplate.exercises.length} exercises • Est. {todayTemplate.exercises.length * 5}min
                    </span>
                  </div>
                  <Button onClick={() => startWorkout(todayTemplate)} size="lg" className="px-8">
                    <Play className="w-4 h-4 mr-2" />
                    Start Workout
                  </Button>
                </div>
                
                <div className="grid gap-3">
                  {todayTemplate.exercises.map((exercise, index) => (
                    <div key={exercise.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border/50 hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium">{exercise.name}</p>
                          <p className="text-sm text-muted-foreground">{exercise.sets} sets × {exercise.reps} reps</p>
                        </div>
                      </div>
                      <TrendingUp className="w-4 h-4 text-muted-foreground" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Weekly Schedule */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-foreground mb-6">Weekly Schedule</h2>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {workoutTemplates.map((template) => (
            <Card key={template.id} className="overflow-hidden group hover:shadow-lg transition-all duration-300">
              <div 
                className={`relative h-32 bg-gradient-to-br ${getMuscleGroupColor(template.name)} flex items-center justify-center`}
                style={{
                  backgroundImage: `url(${getWorkoutImage(template.name)})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                <div className="absolute inset-0 bg-black/40" />
                <div className="relative z-10 text-center text-white">
                  <h3 className="text-lg font-bold">{template.day}</h3>
                  <p className="text-white/90 text-sm">{template.name}</p>
                </div>
              </div>
              
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {template.exercises.length} exercises
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingTemplate(editingTemplate === template.id ? null : template.id)}
                    >
                      <Edit3 className="w-4 h-4" />
                    </Button>
                    {template.exercises.length > 0 && (
                      <Button
                        size="sm"
                        onClick={() => startWorkout(template)}
                      >
                        <Play className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>

                {editingTemplate === template.id && (
                  <div className="space-y-3 mt-4 border-t border-border pt-4">
                    {template.exercises.map((exercise) => (
                      <div key={exercise.id} className="grid grid-cols-2 gap-2">
                        <Input
                          value={exercise.name}
                          onChange={(e) => updateExercise(template.id, exercise.id, { name: e.target.value })}
                          placeholder="Exercise name"
                          className="col-span-2"
                        />
                        <Input
                          type="number"
                          value={exercise.sets}
                          onChange={(e) => updateExercise(template.id, exercise.id, { sets: parseInt(e.target.value) || 0 })}
                          placeholder="Sets"
                        />
                        <Input
                          value={exercise.reps}
                          onChange={(e) => updateExercise(template.id, exercise.id, { reps: e.target.value })}
                          placeholder="Reps"
                        />
                      </div>
                    ))}
                    
                    <Button
                      variant="outline"
                      onClick={() => addExercise(template.id)}
                      className="w-full"
                      size="sm"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Exercise
                    </Button>
                  </div>
                )}

                {editingTemplate !== template.id && (
                  <div className="space-y-2">
                    {template.exercises.length === 0 ? (
                      <div className="text-center py-4">
                        <p className="text-2xl mb-2">😴</p>
                        <p className="text-sm text-muted-foreground">Rest & Recovery</p>
                      </div>
                    ) : (
                      <div className="space-y-1 max-h-32 overflow-y-auto">
                        {template.exercises.slice(0, 3).map((exercise, index) => (
                          <div key={exercise.id} className="text-xs text-muted-foreground bg-muted/30 rounded px-2 py-1">
                            {exercise.name} - {exercise.sets}×{exercise.reps}
                          </div>
                        ))}
                        {template.exercises.length > 3 && (
                          <div className="text-xs text-muted-foreground text-center py-1">
                            +{template.exercises.length - 3} more exercises
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Sessions */}
      {workoutSessions.length > 0 && (
        <Card className="overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Recent Sessions
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid gap-3">
              {workoutSessions.slice(-5).reverse().map((session) => {
                const template = workoutTemplates.find(t => t.id === session.templateId);
                const completedSets = session.exercises.reduce((total, ex) => 
                  total + ex.sets.filter(set => set.completed).length, 0
                );
                const totalSets = session.exercises.reduce((total, ex) => 
                  total + ex.sets.length, 0
                );
                
                return (
                  <div key={session.id} className="flex items-center justify-between p-4 bg-muted/20 rounded-lg border border-border/50 hover:bg-muted/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-12 h-12 rounded-lg bg-cover bg-center flex items-center justify-center"
                        style={{
                          backgroundImage: `url(${getWorkoutImage(template?.name || '')})`,
                        }}
                      >
                        <div className="w-full h-full bg-black/50 rounded-lg flex items-center justify-center">
                          <CheckCircle className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      <div>
                        <p className="font-medium">{template?.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(session.date), 'MMM d, yyyy')} • {session.exercises.length} exercises
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-primary">
                        {completedSets}/{totalSets} sets
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {Math.round((completedSets / totalSets) * 100)}% completed
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};