
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
import { Title } from '@angular/platform-browser';

interface SpoonacularRecipe {
  id: number;
  title: string;
  image: string;
  readyInMinutes?: number;
  servings?: number;
}

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, FullCalendarModule],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
})
export class CalendarComponent implements AfterViewInit {
  @ViewChild('recipeContainer', { static: false }) recipeContainer!: ElementRef;

  recipes: SpoonacularRecipe[] = [];
  currentEvents: EventApi[] = [];

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay',
    },
    editable: true,
    droppable: true, // Accept external draggables
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this),
    eventReceive: this.handleEventRecieve.bind(this),
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
  };

  constructor(private spoonacularService: SpoonacularService) {}

  ngAfterViewInit() {
    // Initialize Draggable for recipe items
    new Draggable(this.recipeContainer.nativeElement, {
      itemSelector: '.recipe', // CSS class for draggable items
      eventData: function (el) {
        const recipeData = el.getAttribute('data-recipe');
        if (recipeData) {
          const recipe: SpoonacularRecipe = JSON.parse(recipeData);
          return {
            title: recipe.title, // Event title
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

  handleEventRecieve(info: any) {
    const droppedEvent = info.event;
    const title = droppedEvent.title;
    console.log('dropped event data:',{
      event: droppedEvent,
      Title: droppedEvent.title,
      extendedProps: droppedEvent.extendedProps,
    });
    if (droppedEvent.extendedProps?.recipeId) {
      droppedEvent.setProp('title', droppedEvent.title);
    }else{
      console.error('no data found for dropped event');
    }
  }
  stringify(recipe: SpoonacularRecipe): string {
    return JSON.stringify(recipe);
  }
  handleEvents(events: EventApi[]) {
    this.currentEvents = events;
  }
}
