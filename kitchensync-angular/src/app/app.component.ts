import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RecipesComponent } from "./recipes/recipes.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RecipesComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  standalone: true
})
export class AppComponent {
  title = 'kitchensync-angular';
}
