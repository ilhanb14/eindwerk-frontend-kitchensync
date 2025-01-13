import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, EventInput } from '@fullcalendar/core'; 
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
@Component({
    selector: 'app-calendar',
    standalone: true,
    imports: [CommonModule, FullCalendarModule,],
    templateUrl: './calendar.component.html',
    styleUrls: ['./calendar.component.css',
    ],
})

export class CalendarComponent {
    calendarOptions: CalendarOptions = {
        initialView: 'dayGridMonth',
        plugins: [dayGridPlugin, interactionPlugin],
        dateClick: (arg) =>this.handleDateClick(arg),
        events: []
      };

      eventsPromise: Promise<EventInput[]> = Promise.resolve([]);
dayGridPlugin: any;
interactionPlugin: any;
events: any;

      handleDateClick(arg: any) {
        alert('date click! ' + arg.dateStr);
      }
    }