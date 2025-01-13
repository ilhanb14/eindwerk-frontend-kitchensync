import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CalendarEvent, CalendarView } from 'angular-calendar';
import { startOfMonth, endOfMonth } from 'date-fns';
import { CalendarModule } from 'angular-calendar';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CalendarModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})

export class CalendarComponent {
  view: CalendarView = CalendarView.Month;
  viewDate: Date = new Date();
  events: CalendarEvent[] = [
    {
      start: startOfMonth(new Date()),
      end: endOfMonth(new Date()),
      title: 'Sample Event',
      color: {
        primary: '#ad2121',
        secondary: '#FAE3E3'
      },
      actions: [],
    }
  ];
activeDayIsOpen: boolean = true;
calendarHeader: any;
}