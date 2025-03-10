import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./header/header.component";


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  standalone: true,
  template: `<app-calendar></app-calendar>`,
})
export class AppComponent {
  title = 'kitchensync-angular';
CalendarOptions: any;
}