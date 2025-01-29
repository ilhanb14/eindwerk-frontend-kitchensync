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
import { PlannedMealsService } from '../shared/plannedmeals.service';

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
  userTypeId: number = Number(sessionStorage.getItem('user_type_id'));
  includeDate: boolean = true;
  mealtimes: any[] = [];
  servings: number = 0;

  constructor(
    private route: ActivatedRoute, 
    private spoonacularService: SpoonacularService,
    private likedMealsService: LikedMealsService,
    private requestsService: RequestsService,
    private mealtimesService: MealtimesService,
    private plannedMealsService: PlannedMealsService
  ) { 
    this.mealtimesService.getAll().then(response => this.mealtimes = response);

    this.likedMealsService.getByUser(this.userId).then(likedMeals => {
      if (likedMeals.some((row: any) => row.meal_id == this.id)) {  // If this meal is already liked
        document.getElementById('like-button')!.style.display = "none"; // Hide like button and replace with unlike button
        document.getElementById('unlike-button')!.style.display = "inline-block";
      }
    })
  }

  /**
   * Get the id from URL and use it to get the recipe
   */
  ngOnInit() {
    // Get id from URL
    this.route.params.subscribe(params => {
      this.id = params['id'];

      // Get recipe from spoonacular
      this.spoonacularService.getMealById(Number(this.id)).then((recipe) => {
        this.recipe = recipe;
        console.log(this.recipe);

      // Set servings
      this.servings = recipe.servings;
      });
    })
  }

  /**
   * Like this meal
   */
  like() {
    this.likedMealsService.likeMeal(Number(this.id!), this.userId)
    document.getElementById('like-button')!.style.display = "none"; // Hide like button and replace with unlike button
    document.getElementById('unlike-button')!.style.display = "inline-block";
  }

  /**
   * Unlike this meal
   */
  unlike() {
    this.likedMealsService.deleteLikedMealByData(Number(this.id), this.userId);
    document.getElementById('unlike-button')!.style.display = "none"; // Hide unlike button and replace with like button
    document.getElementById('like-button')!.style.display = "inline-block";
  }

  /**
   * Show form for making a request with this meal
   */
  showRequestForm() {
    document.getElementById('request-form')!.style.display = "block";
  }

  /**
   * Hide form for making a request with this meal
   */
  hideRequestForm() {
    document.getElementById('request-form')!.style.display = "none";
    (document.getElementById('comment')! as HTMLInputElement).value = "";
    (document.getElementById('date')! as HTMLInputElement).value = "";
    (document.getElementById('mealtime-option')! as HTMLInputElement).value = "none";
  }

  /**
   * Make a request with this meal
   */
  request() {
    let comment = (document.getElementById('comment')! as HTMLInputElement).value;
    let date:string | null = (document.getElementById('date') as HTMLInputElement)?.value;
    let mealtime:string | null = (document.getElementById('mealtime-option')! as HTMLSelectElement).value;

    console.log(this.userId, this.familyId, this.id, comment, date, mealtime);

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
    this.hideRequestForm();
  }

  showPlanForm() {
    document.getElementById('plan-form')!.style.display = "block";
  }

  /**
   * Hide form for making a request with this meal
   */
  hidePlanForm() {
    document.getElementById('plan-form')!.style.display = "none";
    (document.getElementById('servings')! as HTMLInputElement).value = "";
    (document.getElementById('date-plan')! as HTMLInputElement).value = "";
    (document.getElementById('mealtime-option-plan')! as HTMLInputElement).value = "none";
  }

  /**
   * Make a request with this meal
   */
  plan() {
    let servings = (document.getElementById('servings')! as HTMLInputElement).value;
    let date:string = (document.getElementById('date-plan') as HTMLInputElement)?.value;
    let mealtime:string = (document.getElementById('mealtime-option-plan')! as HTMLSelectElement).value;

    console.log(Number(this.id), this.familyId, new Date(date), Number(mealtime), Number(servings));

    this.plannedMealsService.post(Number(this.id), this.familyId, new Date(date), Number(mealtime), Number(servings));
    alert("Meal is planned!");
    this.hidePlanForm();
  }

  /**
   * Calculate the amount of a nutrient in 100 grams
   * @param number amount of nutrient in serving
   * @returns amount of nutrient in 100 grams or 0 if no recipe
   */
  nutrient100Grams(number: number) {
    if (this.recipe) {
      return ((this.recipe.nutrition.nutrients[number].amount/this.recipe.nutrition.weightPerServing.amount) * 100).toFixed(1);
    }
    return 0;
  }

  /**
   * Decrease the number of servings
   */
  decreaseServing() { 
    if (this.servings > 1) {
      this.servings--;
    }
  }

  /**
   * Increase the number of servings
   */
  increaseServing() {
    this.servings++;
  }

  /**
   * Change the amount of an ingredient if the amount of servings changes
   * @param amount amount of ingredient with normal amount of servings
   * @returns amount of ingredient with new amount of servings
   */
  changeAmount(amount: number) {
    const normalServings = this.recipe!.servings;
    const newAmount = amount * this.servings / normalServings;

    // Format to remove unnecessary decimals
    return newAmount % 1 === 0 ? newAmount.toFixed(0) : newAmount.toFixed(2).replace(/\.?0+$/, '');
  }
}
