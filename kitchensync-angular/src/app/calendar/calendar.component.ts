import { Component, Component, Signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterOutlet } from "@angular/router";
import {FullCalendarModule} from "@fullcallendar/angular";
import {calendaroptions} from "@fullcallendar/core";
import daygridPlugin from "@fullcallendar/daygrid";
import interactionplugin from "@fullcallendar/interaction";
import timegridPlugin from "@fullcallendar/timegrid";
import listplugin from "@fullcallendar/list";
@Component({
    selector: 'app-calendar',
    standalone: true,
    imports: [CommonModule, RouterOutlet, FullCalendarModule],
    templateUrl: './calendar.component.html',
    styleUrls: ['./calendar.component.css']
})

export class CalendarComponent {
    calendarvisible = true;
    calendaroptions = signal<calendaroptions>({
        plugins: [
            daygridPlugin,
            interactionplugin,
            timegridPlugin,
            listplugin,
        ],
        headertoolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timelistWeek',
        },
        initialView: 'dayGridMonth',
        initialEvents: INITIAL_EVENTS,
        weekends: true,
        editable: true,
        selectable: true,  
        selectMirror: true,
        dayMaxEvents: true,
        select: this.handleDateSelect.bind(this),
        eventClick: this.handleEventClick.bind(this),
        eventDrop: this.handleEventDrop.bind(this),
    });
    
    handleCalendartoggle() {
        this.calendaroptions.update((bool) => !bool);
        }
        
}
