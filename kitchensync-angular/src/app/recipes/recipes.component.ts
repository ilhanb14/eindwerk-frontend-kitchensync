import { Component, signal } from '@angular/core';
import { SpoonacularService } from '../shared/spoonacular.service';
import { FormsModule } from '@angular/forms';
import { SmallRecipesResponse } from '../shared/small-recipe';
import { Recipe } from '../shared/recipe';
import { Router, RouterLink } from '@angular/router';
import { SafeHtmlPipe } from '../pipes/safe-html.pipe';

@Component({
  selector: 'app-recipes',
  imports: [FormsModule, RouterLink, SafeHtmlPipe],
  templateUrl: './recipes.component.html',
  styleUrl: './recipes.component.css'
})

export class RecipesComponent {
  smallRecipes: SmallRecipesResponse = { results: [] } // Holds the fetched recipes
  loading = false; // Tracks loading state
  error: string | null = null; // Holds error message
  query: string = '';
  selectedMeal = signal<Recipe | null>(null); // Selected recipe
  expandedMeal: number | null = null; // Track currently expanded recipe

  constructor(
    private spoonacularService: SpoonacularService,
    private router: Router
  ) {
    this.fetchRecipes();
  }

  async fetchRecipes() {
    this.loading = true; // Show loading message
    this.error = null; // Reset error

    try {
      this.smallRecipes = await this.spoonacularService.getRecipes({ query: this.query, number: 20});
      console.log('Fetched recipes:', this.smallRecipes)
    } catch (err) {
      this.error = 'Failed to load recipes. Please try again.';
    } finally {
      this.loading = false; // Hide loading message
    }
  }

  async getRecipeDetails(id: number): Promise<void> {
    try {
      if (this.expandedMeal === id) {
        //close the expanded section
        this.expandedMeal = null;
        this.selectedMeal.set(null);
      } else {
        // Open the expanded section
        this.expandedMeal = id; // Set the expandedMeal to the id;
        const mealDetails = await this.spoonacularService.getMealById(id);
        this.selectedMeal.set(mealDetails);
      }
    } catch (err) {
      console.error('Error fetching recipe details:', err);
      // Handle error appropriately
      this.expandedMeal = null;
      this.selectedMeal.set(null);
    }
  }
}
