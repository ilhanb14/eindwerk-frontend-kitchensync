import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Recipe } from '../interfaces/recipe';
import { SpoonacularService } from '../shared/spoonacular.service';
import { SafeHtmlPipe } from '../pipes/safe-html.pipe';
import { LikedMealsService } from '../shared/likedmeals.service';
import { RequestsService } from '../shared/requests.service';
import { FormsModule } from '@angular/forms';
import { MealtimesService } from '../shared/mealtimes.service';
import { ClickOutsideDirective } from '../click-outside.directive';

@Component({
  selector: 'app-recipe',
  imports: [SafeHtmlPipe, FormsModule, ClickOutsideDirective],
  templateUrl: './recipe.component.html',
  styleUrl: './recipe.component.css'
})

export class RecipeComponent implements OnInit {
  id: string | undefined;
  recipe: Recipe | undefined;
  userId: number = Number(sessionStorage.getItem('id'));
  familyId: number = Number(sessionStorage.getItem('family_id'));
  includeDate: boolean = true;
  mealtimes: any[] = [];
  servings: number = 0;

  constructor(
    private route: ActivatedRoute, 
    private spoonacularService: SpoonacularService,
    private likedMealsService: LikedMealsService,
    private requestsService: RequestsService,
    private mealtimesService: MealtimesService
  ) { 
    this.mealtimesService.getAll().then(response => this.mealtimes = response);

    this.likedMealsService.getByUser(this.userId).then(likedMeals => {
      if (likedMeals.some((row: any) => row.meal_id == this.id)) {  // If this meal is already liked
        document.getElementById('like-button')!.style.display = "none"; // Hide like button and replace with unlike button
        document.getElementById('unlike-button')!.style.display = "inline-block";
      }
    })
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = params['id'];
      this.spoonacularService.getMealById(Number(this.id)).then((recipe) => {
        this.recipe = recipe;
        console.log(this.recipe);
      this.servings = recipe.servings;
        console.log(this.servings);
      });
    })
  }

  // Like this recipe
  like() {
    this.likedMealsService.likeMeal(Number(this.id!), this.userId)
    document.getElementById('like-button')!.style.display = "none"; // Hide like button and replace with unlike button
    document.getElementById('unlike-button')!.style.display = "inline-block";
  }

  unlike() {
    this.likedMealsService.deleteLikedMealByData(Number(this.id), this.userId);
    document.getElementById('unlike-button')!.style.display = "none"; // Hide unlike button and replace with like button
    document.getElementById('like-button')!.style.display = "inline-block";
  }

  // Show form for making a request with this meal
  showRequestForm() {
    document.getElementById('request-form')!.style.display = "block";
  }

  hideRequestForm() {
    document.getElementById('request-form')!.style.display = "none";
    (document.getElementById('comment')! as HTMLInputElement).value = "";
    (document.getElementById('date')! as HTMLInputElement).value = "";
    (document.getElementById('mealtime-option')! as HTMLInputElement).value = "none";
  }

  // Submit request with this meal and form options
  request() {
    this.hideRequestForm();
    let comment = (document.getElementById('comment')! as HTMLInputElement).value;
    let date:string | null = (document.getElementById('date') as HTMLInputElement)?.value;
    let mealtime:string | null = (document.getElementById('mealtime-option')! as HTMLSelectElement).value;

    if(!this.includeDate)
      date = null;
    if(mealtime == 'none')
      mealtime = null;

    let newRequest = {
      user_id: this.userId,
      family_id: this.familyId,
      meal_id: this.id,
      comment: comment,
      date: date,
      mealtime_id: mealtime
    }

    console.log(newRequest);
    this.requestsService.makeRequest(newRequest);
    alert("Request made!");
  }

  nutrient100Grams(number: number) {
    if (this.recipe) {
      return ((this.recipe.nutrition.nutrients[number].amount/this.recipe.nutrition.weightPerServing.amount) * 100).toFixed(1);
    }
    return 0;
  }

  decreaseServing() { 
    if (this.servings > 1) {
      this.servings--;
    }
  }

  increaseServing() {
    this.servings++;
  }

  changeAmount(amount: number) {
    const normalServings = this.recipe!.servings;
    const newAmount = amount * this.servings / normalServings;

    // Format to remove unnecessary decimals
    return newAmount % 1 === 0 ? newAmount.toFixed(0) : newAmount.toFixed(2).replace(/\.?0+$/, '');
  }
}
