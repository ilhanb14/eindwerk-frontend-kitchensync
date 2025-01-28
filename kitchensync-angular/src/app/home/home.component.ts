import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SpoonacularService } from '../shared/spoonacular.service';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  randomRecipes: any[] = [];

  constructor(private spoonacularService: SpoonacularService) {
    this.spoonacularService.getRandomMeals(3).then(response => this.randomRecipes = response.recipes);
  }
}
