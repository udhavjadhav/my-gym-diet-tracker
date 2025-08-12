import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useLocalStorage } from "@/hooks/useStorage";
import { WorkoutTemplate, WorkoutSession, Exercise, CompletedExercise } from "@/types/fitness";
import { Dumbbell, Plus, Edit3, Save, Play, CheckCircle, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

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

export const WorkoutTracker = () => {
  const [workoutTemplates, setWorkoutTemplates] = useLocalStorage<WorkoutTemplate[]>('workoutTemplates', defaultWorkoutTemplates);
  const [workoutSessions, setWorkoutSessions] = useLocalStorage<WorkoutSession[]>('workoutSessions', []);
  const [editingTemplate, setEditingTemplate] = useState<string | null>(null);
  const [activeWorkout, setActiveWorkout] = useState<WorkoutSession | null>(null);
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

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Dumbbell className="w-6 h-6 text-primary" />
        <h1 className="text-2xl font-bold text-foreground">Workout Tracker</h1>
      </div>

      {/* Today's Workout */}
      {todayTemplate && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold">Today's Workout</h2>
              <p className="text-muted-foreground">{todayTemplate.name}</p>
            </div>
            {todayTemplate.exercises.length > 0 && (
              <Button onClick={() => startWorkout(todayTemplate)}>
                <Play className="w-4 h-4 mr-2" />
                Start Workout
              </Button>
            )}
          </div>
          
          {todayTemplate.exercises.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">🎉 Rest Day - Enjoy your recovery!</p>
          ) : (
            <div className="space-y-2">
              {todayTemplate.exercises.map((exercise, index) => (
                <div key={exercise.id} className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                  <div>
                    <p className="font-medium">{exercise.name}</p>
                    <p className="text-sm text-muted-foreground">{exercise.sets} sets × {exercise.reps} reps</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {/* Weekly Schedule */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Weekly Schedule</h2>
        
        <div className="space-y-4">
          {workoutTemplates.map((template) => (
            <div key={template.id} className="border border-border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-semibold">{template.day}</h3>
                  <p className="text-sm text-muted-foreground">{template.name}</p>
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
                <div className="space-y-4 mt-4 border-t border-border pt-4">
                  {template.exercises.map((exercise) => (
                    <div key={exercise.id} className="grid grid-cols-1 md:grid-cols-4 gap-2">
                      <Input
                        value={exercise.name}
                        onChange={(e) => updateExercise(template.id, exercise.id, { name: e.target.value })}
                        placeholder="Exercise name"
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
                      <Input
                        type="number"
                        value={exercise.weight || ''}
                        onChange={(e) => updateExercise(template.id, exercise.id, { weight: parseFloat(e.target.value) || undefined })}
                        placeholder="Weight (kg)"
                      />
                    </div>
                  ))}
                  
                  <Button
                    variant="outline"
                    onClick={() => addExercise(template.id)}
                    className="w-full"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Exercise
                  </Button>
                </div>
              )}

              {editingTemplate !== template.id && template.exercises.length > 0 && (
                <div className="space-y-1">
                  {template.exercises.map((exercise) => (
                    <div key={exercise.id} className="text-sm text-muted-foreground">
                      {exercise.name} - {exercise.sets} sets × {exercise.reps}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Recent Sessions */}
      {workoutSessions.length > 0 && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Sessions</h2>
          <div className="space-y-3">
            {workoutSessions.slice(-5).reverse().map((session) => {
              const template = workoutTemplates.find(t => t.id === session.templateId);
              return (
                <div key={session.id} className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                  <div>
                    <p className="font-medium">{template?.name}</p>
                    <p className="text-sm text-muted-foreground">{format(new Date(session.date), 'MMM d, yyyy')}</p>
                  </div>
                  <div className="text-right text-sm text-muted-foreground">
                    {session.exercises.length} exercises
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
};