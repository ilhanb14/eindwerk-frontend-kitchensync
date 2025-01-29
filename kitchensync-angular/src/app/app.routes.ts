import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CalendarComponent } from './calendar/calendar.component';
import { RecipesComponent } from './recipes/recipes.component';
import { RecipeComponent } from './recipe/recipe.component';
import { UserComponent } from './user/user.component';
import { FamilyComponent } from './family/family.component';

import { authGuard } from './auth.guard';
import { LoginComponent } from './login/login.component';
import { RequestComponent } from './request/request.component';

export const routes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'recipes', component: RecipesComponent, canActivate: [authGuard] },
    { path: 'recipe/:id', component: RecipeComponent, canActivate: [authGuard] },
    { path: 'calendar', component: CalendarComponent, canActivate: [authGuard] },
    { path: 'user', component: UserComponent, canActivate: [authGuard] },
    { path: 'family', component: FamilyComponent, canActivate: [authGuard] },
    { path: 'login', component: LoginComponent },
    { path: 'request', component: RequestComponent, canActivate: [authGuard] },
    { path: '**', redirectTo: 'home' }
];