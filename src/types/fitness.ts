export interface WaterLog {
  id: string;
  amount: number; // in ml
  timestamp: string;
  date: string; // YYYY-MM-DD
}

export interface ProteinLog {
  id: string;
  amount: number; // in grams
  source: string; // protein shake, chicken, etc.
  timestamp: string;
  date: string;
}

export interface MealLog {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  timestamp: string;
  date: string;
}

export interface WorkoutLog {
  id: string;
  exercise: string;
  sets: number;
  reps: number;
  weight?: number; // in kg
  duration?: number; // in minutes
  timestamp: string;
  date: string;
}

export interface DailyGoals {
  water: number; // ml
  protein: number; // grams
  calories: number;
}

export interface GymLog {
  id: string;
  date: string; // YYYY-MM-DD
  attended: boolean;
  exercises?: WorkoutLog[];
  notes?: string;
  timestamp: string;
}

export interface UserProfile {
  name: string;
  age: number;
  weight: number; // kg
  height: number; // cm
  gender: 'male' | 'female';
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  createdAt: string;
}

export interface WorkoutTemplate {
  id: string;
  day: string;
  name: string;
  muscleGroups: string[];
  exercises: Exercise[];
}

export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: string; // e.g., "8-12" or "15"
  weight?: number;
  notes?: string;
}

export interface WorkoutSession {
  id: string;
  templateId: string;
  date: string;
  exercises: CompletedExercise[];
  duration?: number; // minutes
  notes?: string;
  timestamp: string;
}

export interface CompletedExercise {
  exerciseId: string;
  name: string;
  sets: CompletedSet[];
}

export interface CompletedSet {
  reps: number;
  weight?: number;
  completed: boolean;
}

export interface UserSettings {
  goals: DailyGoals;
  notifications: {
    water: boolean;
    protein: boolean;
    gym: boolean;
    waterInterval: number; // hours
    proteinTimes: string[]; // HH:MM format
  };
}