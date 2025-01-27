import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
import {
  CalendarOptions,
  DateSelectArg,
  EventClickArg,
  EventApi,
} from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin, { Draggable } from '@fullcalendar/interaction';
import { SpoonacularService } from '../shared/spoonacular.service';
import { EventService, Event } from '../shared/event.service';
import { HttpClientModule } from '@angular/common/http';
interface SpoonacularRecipe {
  id: number;
  title: string;
  image: string;
  readyInMinutes?: number;
  servings?: number;
}

interface MealSlot {
  time: string;
  label: string;
}

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, FullCalendarModule, HttpClientModule],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
})
export class CalendarComponent implements AfterViewInit {
  @ViewChild('recipeContainer', { static: false }) recipeContainer!: ElementRef;

  recipes: SpoonacularRecipe[] = [];
  currentEvents: EventApi[] = [];

  mealSlots: MealSlot[] = [
    { time: '08:00:00', label: 'Breakfast' },
    { time: '11:00:00', label: 'Lunch' },
    { time: '14:00:00', label: 'Dinner' },
    { time: '17:00:00', label: 'Snack' }
  ];

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay',
    },
    editable: true,
    droppable: true,
    views: {
      timeGridWeek: {
        slotDuration: '03:00:00',
        slotMinTime: '08:00:00',
        slotMaxTime: '20:00:00',
        allDaySlot: false,
        slotLabelContent: (arg: any) => this.generateSlotLabel(arg),
        dayHeaderFormat: { weekday: 'short', month: 'numeric', day: 'numeric' },
      },
      timeGridDay: {
        slotDuration: '03:00:00',
        slotMinTime: '08:00:00',
        slotMaxTime: '20:00:00',
        allDaySlot: false,
        slotLabelContent: (arg: any) => this.generateSlotLabel(arg),
        dayHeaderFormat: { weekday: 'short', month: 'numeric', day: 'numeric' },
      },
      dayGridMonth: {
        allDaySlot: true,
      }
    },
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this),
    eventReceive: this.handleEventReceive.bind(this),
    eventDrop: (info: any) => {
      const currentView = info.view.type;
      if (currentView === 'timeGridWeek' || currentView === 'timeGridDay') {
        const eventDate = info.event.start;
        if (eventDate) {
          const nearestSlot = this.findNearestMealSlot(eventDate);
          info.event.setStart(this.combineDateAndTime(eventDate, nearestSlot.time));
        }
      }
    },
  };

  constructor(
    private spoonacularService: SpoonacularService,
    private eventService: EventService
  ) {}

  ngOnInit() {
    this.eventService.getEvents().subscribe(events => {
      this.calendarOptions.events = events.map((event) => ({
        ...event,
        start: new Date(event.start),
        end: event.end ? new Date(event.end) : undefined,
        id: event.id?.toString(),
      }));
    });
  }

  ngAfterViewInit() {
    new Draggable(this.recipeContainer.nativeElement, {
      itemSelector: '.recipe',
      eventData: (el) => {
        const recipeData = el.getAttribute('data-recipe');
        if (recipeData) {
          const recipe: SpoonacularRecipe = JSON.parse(recipeData);
          return {
            title: recipe.title,
            duration: '03:00:00',
            extendedProps: {
              recipeId: recipe.id,
              image: recipe.image,
              readyInMinutes: recipe.readyInMinutes,
              servings: recipe.servings,
            },
          };
        }
        return {};
      },
    });
  }

  private generateSlotLabel(arg: any) {
    const hour = arg.date.getHours();
    const matchingSlot = this.mealSlots.find(slot => 
      parseInt(slot.time.split(':')[0]) === hour
    );
    if (matchingSlot) {
      return { html: `<div class="meal-slot-label">${matchingSlot.label}</div>` };
    } else {
      return { html: '' };
    }
  }

  private findNearestMealSlot(date: Date): MealSlot {
    const hour = date.getHours();
    const defaultSlot = this.mealSlots[0];
    
    return this.mealSlots.reduce((prev, curr) => {
      const currHour = parseInt(curr.time.split(':')[0]);
      const prevHour = parseInt(prev.time.split(':')[0]);
      return Math.abs(currHour - hour) < Math.abs(prevHour - hour) ? curr : prev;
    }, defaultSlot);
  }

  private combineDateAndTime(date: Date, timeString: string): Date {
    const [hours, minutes, seconds] = timeString.split(':').map(Number);
    const newDate = new Date(date);
    newDate.setHours(hours, minutes, seconds);
    return newDate;
  }

  handleEventReceive(info: any) {
    const currentView = info.view.type;
    const droppedEvent = info.event;
  
    if (currentView === 'dayGridMonth') {
      const mealSlotLabels = this.mealSlots.map((slot: MealSlot) => slot.label).join(', ');
      const userSelection = prompt(`Select a meal slot for "${droppedEvent.title}" (${mealSlotLabels}):`);
      const selectedSlot = this.mealSlots.find(
        (slot) => slot.label.toLowerCase() === userSelection?.toLowerCase()
      );
  
      if (selectedSlot && droppedEvent.start) {
        droppedEvent.setStart(this.combineDateAndTime(droppedEvent.start, selectedSlot.time));
      } else {
        alert('Invalid selection. Please try again.');
        return; // Exit if selection is invalid
      }
    }
  
    if ((currentView === 'timeGridWeek' || currentView === 'timeGridDay') && droppedEvent.start) {
      const nearestSlot = this.findNearestMealSlot(droppedEvent.start);
      droppedEvent.setStart(this.combineDateAndTime(droppedEvent.start, nearestSlot.time));
    }
  
    if (droppedEvent.extendedProps?.recipeId) {
      droppedEvent.setProp('title', droppedEvent.title);
  
      // **Save the dropped event to the database**
      const newEvent = {
        title: droppedEvent.title,
        start: droppedEvent.start?.toISOString() || '',
        end: droppedEvent.end?.toISOString() || null,
        extended_props: droppedEvent.extendedProps, // Includes data like recipeId
      };
  
      this.eventService.createEvent(newEvent).subscribe({
        next: (savedEvent) => {
          // Update the event ID in case it's needed later
          droppedEvent.setProp('id', savedEvent.id);
          console.log('Event saved successfully:', savedEvent);
        },
        error: (err) => {
          console.error('Error saving event:', err);
        },
      });
    } else {
      console.error('No data found for the dropped event');
    }
  }

  async searchRecipes(query: string) {
    if (!query.trim()) return;

    try {
      const response = await this.spoonacularService.getRecipes({
        query: query,
        number: 10,
        addRecipeInformation: 'true',
      });

      this.recipes = response.results.map((recipe: any) => ({
        id: recipe.id,
        title: recipe.title,
        image: recipe.image,
        readyInMinutes: recipe.readyInMinutes,
        servings: recipe.servings,
      }));
    } catch (error) {
      console.error('Error searching recipes:', error);
    }
  }

  handleEventClick(clickInfo: EventClickArg) {
    if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'?`)) {
      clickInfo.event.remove();
    }
  }

  stringify(recipe: SpoonacularRecipe): string {
    return JSON.stringify(recipe);
  }

  handleEvents(events: EventApi[]) {
    this.currentEvents = events;
  }
}