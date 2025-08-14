export interface FoodItem {
  id: string;
  name: string;
  protein: number; // protein per unit
  unit: string;
  category: string;
}

export const foodDatabase: FoodItem[] = [
  // Eggs
  { id: 'egg', name: 'Egg', protein: 6, unit: 'piece', category: 'Eggs' },
  { id: 'egg-white', name: 'Egg White', protein: 3.6, unit: 'piece', category: 'Eggs' },

  // Meat & Poultry
  { id: 'chicken-breast', name: 'Chicken Breast', protein: 31, unit: '100g', category: 'Meat' },
  { id: 'chicken-thigh', name: 'Chicken Thigh', protein: 26, unit: '100g', category: 'Meat' },
  { id: 'lean-beef', name: 'Lean Beef', protein: 26, unit: '100g', category: 'Meat' },
  { id: 'fish-salmon', name: 'Salmon', protein: 25, unit: '100g', category: 'Fish' },
  { id: 'fish-tuna', name: 'Tuna', protein: 30, unit: '100g', category: 'Fish' },

  // Dairy
  { id: 'milk', name: 'Milk', protein: 3.4, unit: '100ml', category: 'Dairy' },
  { id: 'greek-yogurt', name: 'Greek Yogurt', protein: 10, unit: '100g', category: 'Dairy' },
  { id: 'cottage-cheese', name: 'Cottage Cheese', protein: 11, unit: '100g', category: 'Dairy' },
  { id: 'paneer', name: 'Paneer', protein: 18, unit: '100g', category: 'Dairy' },

  // Legumes & Pulses
  { id: 'soya-chunks', name: 'Soya Chunks', protein: 52, unit: '100g', category: 'Legumes' },
  { id: 'chickpeas', name: 'Chickpeas', protein: 19, unit: '100g', category: 'Legumes' },
  { id: 'lentils', name: 'Lentils', protein: 9, unit: '100g', category: 'Legumes' },
  { id: 'kidney-beans', name: 'Kidney Beans', protein: 24, unit: '100g', category: 'Legumes' },
  { id: 'black-beans', name: 'Black Beans', protein: 21, unit: '100g', category: 'Legumes' },

  // Nuts & Seeds
  { id: 'almonds', name: 'Almonds', protein: 21, unit: '100g', category: 'Nuts' },
  { id: 'peanuts', name: 'Peanuts', protein: 26, unit: '100g', category: 'Nuts' },
  { id: 'chia-seeds', name: 'Chia Seeds', protein: 17, unit: '100g', category: 'Seeds' },

  // Supplements
  { id: 'whey-protein', name: 'Whey Protein Powder', protein: 25, unit: '30g scoop', category: 'Supplements' },
  { id: 'casein-protein', name: 'Casein Protein', protein: 24, unit: '30g scoop', category: 'Supplements' },
];