import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CalendarComponent } from './calendar/calendar.component';
import { RecipesComponent } from './recipes/recipes.component';
import { UserComponent } from './user/user.component';

import { authGuard } from './auth.guard';
import { LoginComponent } from './login/login.component';

export const routes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'recipes', component: RecipesComponent }, // Add canActivate: [authGuard]
    { path: 'calendar', component: CalendarComponent }, // Add canActivate: [authGuard]
    { path: 'user', component: UserComponent }, // Add canActivate: [authGuard]
    { path: 'login', component: LoginComponent },
    { path: '**', redirectTo: 'home' }
];