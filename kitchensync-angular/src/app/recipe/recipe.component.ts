import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Recipe } from '../interfaces/recipe';
import { SpoonacularService } from '../shared/spoonacular.service';
import { SafeHtmlPipe } from '../pipes/safe-html.pipe';
import { LikedMealsService } from '../shared/likedmeals.service';
import { RequestsService } from '../shared/requests.service';

@Component({
  selector: 'app-recipe',
  imports: [SafeHtmlPipe],
  templateUrl: './recipe.component.html',
  styleUrl: './recipe.component.css'
})

export class RecipeComponent implements OnInit {
  id: string | undefined;
  recipe: Recipe | undefined;
  userId: number = Number(sessionStorage.getItem('id'));
  familyId: number = Number(sessionStorage.getItem('family_id'));

  constructor(
    private route: ActivatedRoute, 
    private spoonacularService: SpoonacularService,
    private likedMealsService: LikedMealsService,
    private requestsService: RequestsService
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

  // Like this recipe
  like() {

  }

  // Show form for making a request with this meal
  showRequestForm() {

  }

  // Submit request with this meal and form options
  request() {

  }
}
