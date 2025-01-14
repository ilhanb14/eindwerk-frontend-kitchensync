import { Component, signal, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullCalendarModule, FullCalendarComponent } from '@fullcalendar/angular';
import { Calendar, CalendarOptions, DateSelectArg, EventClickArg, EventApi } from '@fullcalendar/core'; 
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import { SpoonacularService } from '../shared/spoonacular.service';
import listplugin from '@fullcalendar/list';
import { INITIAL_EVENTS } from './event-utils';
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
      initialEvents: INITIAL_EVENTS,
      headerToolbar : {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay'
      },
      selectable: true,
      editable: true,
      select: this.handleDateSelect.bind(this),
      eventClick: this.handleEventClick.bind(this),
      eventsSet: this.handleEvents.bind(this),
      plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],  
      events: []
      };
      currentEvents = signal<EventApi[]>([]);
      handleEventClick(clickInfo: EventClickArg) {
        if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
          clickInfo.event.remove();
        }
      }
      handleEvents(events: EventApi[]) {
        this.currentEvents.set(events);
      }

      constructor(private spoonacularService: SpoonacularService) { }

      handleDateSelect(selectInfo: DateSelectArg) {
        const title = prompt('Please enter a new title for your event');
        const calendarApi = selectInfo.view.calendar;
        calendarApi.unselect();
        if (title) {
          calendarApi.addEvent({
            id: createEventId(),
            title,
            start: selectInfo.startStr,
            end: selectInfo.endStr,
            allDay: selectInfo.allDay
          });
        }
      }
    }

function createEventId(): string | undefined {
  throw new Error('Function not implemented.');
}
