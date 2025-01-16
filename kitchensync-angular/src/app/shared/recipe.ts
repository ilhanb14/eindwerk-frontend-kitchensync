export interface Recipe {
    id: number; // Unique identifier for the recipe
    title: string; // Title of the recipe
    image: string; // URL of the recipe image
    imageType: string; // Type of the recipe image
    summary?: string; // Brief summary of the recipe (optional)
    cookingMinutes: number; // Cooking time in minutes
    readyInMinutes: number; // Preparation time in minutes
    servings: number; // Number of servings
    analyzedInstructions?: Instructions[]; // Array of analyzed cooking instructions (optional)
    instructions?: string; // Cooking instructions (optional)
    extendedIngredients?: ExtendedIngredient[]; // Array of ingredients (optional)
    sourceUrl?: string; // Original source URL for the recipe (optional)
    cuisine?: string[]; // Array of cuisines associated with the recipe (optional)
    diets?: string[]; // Array of diets compatible with the recipe (e.g., vegetarian, vegan) (optional)
    dairyFree?: boolean; // Flag indicating if the recipe is dairy-free (optional)
    glutenFree?: boolean; // Flag indicating if the recipe is gluten-free (optional)
    dishTypes?: string[]; // Array of dish types (e.g., main course, side dish) (optional)
    cheap?: boolean; // Flag indicating if the recipe is considered cheap (optional)
    healthScore?: number; // Health score rating (optional)
    nutrition: Nutrition; // Nutrition information (optional)  
}
      
export interface ExtendedIngredient {
    id: number; // Unique identifier for the ingredient
    name: string; // Name of the ingredient
    nameClean: string; // Cleaned name of the ingredient
    amount: number; // Quantity of the ingredient
    measures?: Measures[]; // Measurement details
    image: string; // URL of the ingredient image
    aisle: string; // Aisle where the ingredient is found
    consistency: string; // Consistency of the ingredient
    meta: string[]; // Additional information about the ingredient
    unit: string; // Measurement unit (e.g., grams, cups)
}

export interface Measures {
    amount: number; // Quantity of the ingredient
    unitShort: string; // Short measurement unit (e.g., g, c)
    unitLong: string; // Long measurement unit (e.g., grams, cups)
}


export interface Nutrition {
    caloricBreakdown: CaloricBreakdown;
    flavonoids: Flavonoid[];
    ingredients: Ingredient[];
    nutrients: Nutrient[];
    properties: Property[];
    weightPerServing: WeightPerServing;
  }
  
  export interface CaloricBreakdown {
    percentCarbs: number;
    percentFat: number;
    percentProtein: number;
  }
  
  export interface Flavonoid {
    name: string;
    amount: number;
    unit: string;
  }
  
  export interface Ingredient {
    id: number;
    name: string;
    amount: number;
    unit: string;
    nutrients: Nutrient[];
  }
  
  export interface Nutrient {
    name: string;
    amount: number;
    unit: string;
    percentOfDailyNeeds?: number; // Optional field
  }
  
  export interface Property {
    name: string;
    amount: number;
    unit: string;
  }
  
  export interface WeightPerServing {
    amount: number;
    unit: string;
  }

export interface RecipeResponse {
    "results": Recipe[]
}

export interface Instructions {
    name: string;
    steps: Step[];
}

export interface Step {
    number: number;
    step: string;
    ingredients: IngredientStep[];
    equipment: Equipment[];
}

export interface IngredientStep {
    id: number;
    name: string;
    localizedName: string;
    image: string;
}

export interface Equipment {
    id: number;
    name: string;
    localizedName: string;
    image: string;
}