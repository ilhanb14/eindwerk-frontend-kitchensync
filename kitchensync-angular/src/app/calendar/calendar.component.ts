import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, DateSelectArg, EventClickArg, EventApi } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import { SpoonacularService } from '../shared/spoonacular.service';
import { FormsModule } from '@angular/forms';

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
  imports: [CommonModule, FullCalendarModule, FormsModule],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
})
export class CalendarComponent {
  recipes: SpoonacularRecipe[] = [];
  searchQuery: string = '';
  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay',
    },
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin],
    selectable: true,
    editable: true,
    droppable: true,
    select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
    drop: this.handleDrop.bind(this),
  };

  currentEvents = signal<EventApi[]>([]);

  constructor(private spoonacularService: SpoonacularService) {}

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

  onDragStart(event: DragEvent, recipe: SpoonacularRecipe) {
    if (event.dataTransfer) {
      event.dataTransfer.setData('recipe', JSON.stringify(recipe));
    }
  }

  handleDrop(dropInfo: any) {
    const recipeData = dropInfo.draggedEl.getAttribute('data-recipe');
    if (!recipeData) return;

    const recipe: SpoonacularRecipe = JSON.parse(recipeData);
    dropInfo.view.calendar.addEvent({
      id: this.createEventId(),
      title: recipe.title,
      start: dropInfo.date,
      allDay: true,
      extendedProps: {
        recipeId: recipe.id,
        image: recipe.image,
        readyInMinutes: recipe.readyInMinutes,
        servings: recipe.servings,
      },
    });
  }

  handleDateSelect(selectInfo: DateSelectArg) {
    const title = prompt('Please enter a new title for your event');
    const calendarApi = selectInfo.view.calendar;

    calendarApi.unselect();

    if (title) {
      calendarApi.addEvent({
        id: this.createEventId(),
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay,
      });
    }
  }

  handleEventClick(clickInfo: EventClickArg) {
    if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'?`)) {
      clickInfo.event.remove();
    }
  }

  private createEventId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }
}