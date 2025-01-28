import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
import {
  CalendarOptions,
  EventClickArg,
  EventApi,
} from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin, { Draggable } from '@fullcalendar/interaction';
import { SpoonacularService } from '../shared/spoonacular.service';
import { PlannedMealsService } from '../shared/plannedmeals.service';


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
  mealtimeId: number;
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
  familyId = 4; // Replace with actual family ID from authentication

  mealSlots: MealSlot[] = [
    { time: '09:00:00', label: 'Breakfast', mealtimeId: 1 },
    { time: '12:00:00', label: 'Lunch', mealtimeId: 2 },
    { time: '15:00:00', label: 'Dinner', mealtimeId: 3 },
    { time: '18:00:00', label: 'Snack', mealtimeId: 4 },
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
        slotMinTime: '09:00:00',
        slotMaxTime: '21:00:00',
        allDaySlot: false,
        slotLabelContent: (arg: any) => this.generateSlotLabel(arg),
        dayHeaderFormat: { weekday: 'short', month: 'numeric', day: 'numeric' },
        nowIndicator: true,
      },
      timeGridDay: {
        slotDuration: '03:00:00',
        slotMinTime: '09:00:00',
        slotMaxTime: '21:00:00',
        allDaySlot: false,
        slotLabelContent: (arg: any) => this.generateSlotLabel(arg),
        dayHeaderFormat: { weekday: 'short', month: 'numeric', day: 'numeric' },
        nowIndicator: true,
      },
      dayGridMonth: {
        allDaySlot: true,
      }
    },
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this),
    eventReceive: this.handleEventReceive.bind(this),
    eventDrop: this.handleEventDrop.bind(this),
  };

  constructor(
    private spoonacularService: SpoonacularService,
    private plannedMealsService: PlannedMealsService
  ) {}

  ngAfterViewInit() {
    this.loadPlannedMeals();
    this.initializeDraggable();
  }

  private initializeDraggable() {
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

  async loadPlannedMeals() {
    try {
      const meals = await this.plannedMealsService.getByFamily(this.familyId);
      if (meals && this.calendarOptions.events) {
        this.calendarOptions.events = meals.map((meal: any) => ({
          id: meal.id.toString(),
          title: meal.meal_name,
          start: new Date(meal.date),
          extendedProps: {
            recipeId: meal.meal_id,
            servings: meal.servings,
            mealtimeId: meal.mealtime_id,
          }
        }));
        console.log('loaded meals:', meals);
      }
    } catch (error) {
      console.error("Error loading planned meals:", error);
    }
  }

  async handleEventDrop(info: any) {
    const event = info.event;
    const mealSlot = this.findNearestMealSlot(event.start);
    
    try {
      const response = await this.plannedMealsService.put(
        parseInt(event.id),
        event.extendedProps.recipeId,
        this.familyId,
        event.start,
        mealSlot.mealtimeId,
        event.extendedProps.servings
      );
        event.setStart(this.combineDateAndTime(event.start, mealSlot.time));

    } catch (error) {
      console.error("Error updating meal:", error);
      info.revert();
    }
  }

  async handleEventReceive(info: any) {
    const droppedEvent = info.event;
    
    if (droppedEvent.start) {
      const mealSlot = this.findNearestMealSlot(droppedEvent.start);
      droppedEvent.setStart(this.combineDateAndTime(droppedEvent.start, mealSlot.time));
  
      try {
        await this.plannedMealsService.post(
          droppedEvent.extendedProps.recipeId,
          this.familyId,
          droppedEvent.start,
          mealSlot.mealtimeId,
          droppedEvent.extendedProps.servings || 4
        );
        this.loadPlannedMeals();
      } catch (error) {
        console.error("Error saving meal plan:", error);
        droppedEvent.remove();
      }
    }
  }

  async handleEventClick(clickInfo: EventClickArg) {
    if (confirm(`Are you sure you want to delete '${clickInfo.event.title}'?`)) {
      try {
        const eventId = parseInt(clickInfo.event.id);
        await this.plannedMealsService.deletePlannedMeal(eventId);
        clickInfo.event.remove();
      } catch (error) {
        console.error("Error deleting meal:", error);
      }
    }
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

  stringify(recipe: SpoonacularRecipe): string {
    return JSON.stringify(recipe);
  }

  handleEvents(events: EventApi[]) {
    this.currentEvents = events;
  }
}