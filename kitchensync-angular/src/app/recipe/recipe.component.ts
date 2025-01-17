import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Recipe } from '../interfaces/recipe';
import { SpoonacularService } from '../shared/spoonacular.service';
import { SafeHtmlPipe } from '../pipes/safe-html.pipe';

@Component({
  selector: 'app-recipe',
  imports: [SafeHtmlPipe],
  templateUrl: './recipe.component.html',
  styleUrl: './recipe.component.css'
})

export class RecipeComponent implements OnInit {
  id: string | undefined;
  recipe: Recipe | undefined;

  constructor(
    private route: ActivatedRoute, 
    private spoonacularService: SpoonacularService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = params['id'];
      this.spoonacularService.getMealById(Number(this.id)).then((recipe) => {
        this.recipe = recipe;
        console.log(this.recipe);
      });
    })
  }
}
