import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Recipe } from '../interfaces/recipe';
import { SpoonacularService } from '../shared/spoonacular.service';
import { SafeHtmlPipe } from '../pipes/safe-html.pipe';
import { LikedMealsService } from '../shared/likedmeals.service';
import { RequestsService } from '../shared/requests.service';
import { FormsModule } from '@angular/forms';
import { MealtimesService } from '../shared/mealtimes.service';

@Component({
  selector: 'app-recipe',
  imports: [SafeHtmlPipe, FormsModule],
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

  constructor(
    private route: ActivatedRoute, 
    private spoonacularService: SpoonacularService,
    private likedMealsService: LikedMealsService,
    private requestsService: RequestsService,
    private mealtimesService: MealtimesService
  ) { 
    mealtimesService.getAll().then(response => this.mealtimes = response);
  }

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
    this.likedMealsService.likeMeal(Number(this.id!), this.userId)
  }

  // Show form for making a request with this meal
  showRequestForm() {
    document.getElementById('request-form')!.style.display = "block";
  }

  // Submit request with this meal and form options
  request() {
    document.getElementById('request-form')!.style.display = "none";
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
}
