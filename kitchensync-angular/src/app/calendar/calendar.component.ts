import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core'; 
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

@Component({
    selector: 'app-calendar',
    standalone: true,
    imports: [CommonModule, FullCalendarModule],
    templateUrl: './calendar.component.html',
    styleUrls: ['./calendar.component.css']
})

export class CalendarComponent {
    calendarOptions: CalendarOptions = {
        initialView: 'dayGridMonth',
        plugins: [dayGridPlugin, interactionPlugin],
        dateClick: (arg) =>this.handleDateClick(arg),
        events: [
          { title: 'event 1', date: '2023-06-01' },
          { title: 'event 2', date: '2023-06-02' },
        ]
      };

      handleDateClick(arg: any) {
        alert('date click! ' + arg.dateStr);
      }
    }