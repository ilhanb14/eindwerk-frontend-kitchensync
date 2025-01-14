import { Component, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullCalendarModule, FullCalendarComponent } from '@fullcalendar/angular';
import { Calendar, CalendarOptions, EventInput } from '@fullcalendar/core'; 
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
@Component({
    selector: 'app-calendar',
    standalone: true,
    imports: [CommonModule, FullCalendarModule],
    templateUrl: './calendar.component.html',
    styleUrls: ['./calendar.component.css',
    ],
})

export class CalendarComponent {
    calendarOptions: CalendarOptions = {
      initialView: 'dayGridMonth',
      dateClick:(arg)  =>this.handleDateClick(arg), 
      headerToolbar : {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay'
      },
      plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],  

      events: []
    
      };
      handleDateClick(arg: any) {
        alert('date click! ' + arg.dateStr)
      }
    }