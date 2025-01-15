import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CalenderComponent } from './calender/calender.component';
import { RecipesComponent } from './recipes/recipes.component';
import { UserComponent } from './user/user.component';

import { LoginComponent } from './login/login.component';

export const routes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'recipes', component: RecipesComponent },
    { path: 'calendar', component: CalendarComponent },
    { path: 'user', component: UserComponent },
    { path: 'login', component: LoginComponent },
    { path: '**', redirectTo: '' }
];