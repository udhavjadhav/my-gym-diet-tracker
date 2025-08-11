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

export interface UserSettings {
  goals: DailyGoals;
  notifications: {
    water: boolean;
    protein: boolean;
    waterInterval: number; // hours
    proteinTimes: string[]; // HH:MM format
  };
}