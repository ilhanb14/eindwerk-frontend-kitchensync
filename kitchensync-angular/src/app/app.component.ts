import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./header/header.component";
import { CalendarComponent } from "./calendar/calendar.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, CalendarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  standalone: true
})
export class AppComponent {
  title = 'kitchensync-angular';
CalendarOptions: any;
}