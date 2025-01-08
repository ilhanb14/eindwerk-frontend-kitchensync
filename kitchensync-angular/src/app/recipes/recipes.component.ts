import { Component } from '@angular/core';
import { SpoonacularService } from '../shared/spoonacular.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-recipes',
  imports: [FormsModule],
  templateUrl: './recipes.component.html',
  styleUrl: './recipes.component.css'
})

export class RecipesComponent{
  recipes: any = null; // Holds the fetched recipes
  loading = false; // Tracks loading state
  error: string | null = null; // Holds error message
  query: string = '';

  constructor(private spoonacularService: SpoonacularService) {
    this.fetchRecipes();
   }

  async fetchRecipes() {
    this.loading = true; // Show loading message
    this.error = null; // Reset error

    try {
      this.recipes = await this.spoonacularService.getRecipes({ query: this.query, number: 20});
      console.log('Fetched recipes:', this.recipes)
    } catch (err) {
      this.error = 'Failed to load recipes. Please try again.';
    } finally {
      this.loading = false; // Hide loading message
    }
  }
}
