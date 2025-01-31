import { Component, AfterViewInit, ElementRef, ViewChild, signal } from '@angular/core';
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
import { ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router'


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
  @ViewChild('eventDetails', { static: false }) eventDetails!: ElementRef;

  recipes: SpoonacularRecipe[] = [];
  currentEvents: EventApi[] = [];
  familyId: number = Number(sessionStorage.getItem('family_id'));

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    initialView: 'dayGridWeek',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,dayGridWeek,dayGridDay',
    },
    editable: true,
    droppable: true,
    events: [],
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this),
    eventReceive: this.handleEventReceive.bind(this),
    eventDrop: this.handleEventDrop.bind(this),
  };

  constructor(
    private spoonacularService: SpoonacularService,
    private plannedMealsService: PlannedMealsService,
    private cdr: ChangeDetectorRef,
    private router: Router
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
      console.log('Family ID:', this.familyId);
      const plannedMeals = await this.plannedMealsService.getByFamily(this.familyId);
      const recipeIds = plannedMeals.map((meal: any) => meal.meal_id);
      const meals = await this.spoonacularService.getMealsById(recipeIds);
      
      console.log('Loaded meals:', meals);
      
      if (meals) {
        // Validate and log meal data
        meals.forEach((meal: any) => {
          console.log('Meal data:', meal);
        });

        this.calendarOptions.events = [];
        
        for (let plannedMeal of plannedMeals) {
          const meal = meals.find((meal: any) => plannedMeal.meal_id == meal.id);
          if (plannedMeal) { 
            const eventDate = new Date(plannedMeal.date);
            const eventEnd = new Date(new Date(eventDate).getTime() + 3 * 60 * 60 * 1000);
            eventEnd.setHours(eventEnd.getHours() + 3);
            console.log('Creating event for meal:', meal);
        
            const newEvent = {
              
                id: plannedMeal.id.toString(),
                title: meal.title,
                duration: '03:00:00',
                allDay: false,
                start: eventDate,
                end: eventEnd,
                slot: plannedMeal.mealtime_id,
                  extendedProps: {
                    recipeId: plannedMeal.meal_id,
                    servings: plannedMeal.servings,
                    image: meal.image
      
                   }
                
            }
            this.calendarOptions.events.push(newEvent)
          
          }
        
        }
        console.log('loaded events', this.calendarOptions.events)
        console.log('loaded current events', this.currentEvents)
    

      }
      console.log('Updated events:', this.calendarOptions.events);
    } catch (error) {
      console.error("Error loading planned meals:", error);
    }
  }

  async handleEventDrop(info: any) {
    const event = info.event;
    
    try {
      await this.plannedMealsService.put(
        parseInt(event.id),
        event.extendedProps.recipeId,
        this.familyId,
        event.start,
        1,
        event.extendedProps.servings
      );
      console.log('Event succesfully Updated:', event);
    } catch (error) {
      console.error("Error updating meal:", error);
      info.revert();
    }

  }

  async handleEventReceive(info: any) {
    const droppedEvent = info.event;
    
    if (droppedEvent.start) {

      droppedEvent.setStart(droppedEvent.start);
      droppedEvent.setEnd(droppedEvent.start);
  
      try {
        await this.plannedMealsService.post(
          droppedEvent.extendedProps.recipeId,
          this.familyId,
          droppedEvent.start,
          1,
          1
        );

       const plannedMeal = this.recipes.find(recipe => recipe.id == droppedEvent.extendedProps.recipeId);


       
       if (plannedMeal) {
        const newEvent = {
          
            id: plannedMeal.id.toString(),
            title: plannedMeal.title,

            allDay: false,
            start: droppedEvent.start,
            end: droppedEvent.end,
              extendedProps: {
                recipeId: plannedMeal.id,
                servings: plannedMeal.servings,
  
               }
            
        };
        (this.calendarOptions.events! as any[]).push(newEvent);
        this.cdr.detectChanges();
        console.log(this.calendarOptions.events)
        }
      
        console.log('Event successfully recieved:', droppedEvent);
      } catch (error) {
        console.error("Error saving meal plan:", error);
        droppedEvent.remove();
      }
    }
  }

  async handleEventClick(clickInfo: EventClickArg) {
    const event = clickInfo.event;
    const eventId = parseInt(event.id);
    const recipeId = event.extendedProps?.['recipeId'];
    const recipeTitle = event.title;
    let recipeImageUrl = event.extendedProps?.['image'];

    console.log('recipe image url:', recipeImageUrl)

    if (!recipeImageUrl) {
      console.warn("Recipe image URL not found!");
    }

    if (!this.eventDetails) {
      console.error("Event details container not found!");
      return;
    }
  
    const eventDetailsEl = document.getElementById('event-details')!;
    eventDetailsEl.style.display = 'block';
  
    // Find elements inside event details
    const titleEl = document.getElementById('recipe-title')!;
    const imageEl = document.getElementById('recipe-image')!;
    const deleteButton = document.getElementById('delete-button')!;
    const viewRecipeButton = document.getElementById('view-recipe-button')!;
    imageEl.setAttribute('src', recipeImageUrl);
    titleEl.textContent = recipeTitle;


    deleteButton.addEventListener('click', async () => {
      const confirmed = confirm(`Are you sure you want to delete "${recipeTitle}"?`);
      if (confirmed) {
        try {
          await this.plannedMealsService.deletePlannedMeal(eventId);
          event.remove();
          this.hideEventDetails();
        } catch (error) {
          console.error("Error deleting meal:", error);
        }
      }
    });
  
    viewRecipeButton.addEventListener('click', () => {
      this.router.navigate(['/recipe', recipeId]);
    });
      // document.addEventListener('click', this.handleOutsideClick);
    
  
  }

  handleOutsideClick = (event: MouseEvent) => {
    if (this.eventDetails && !this.eventDetails.nativeElement.contains(event.target as Node)) {
      this.hideEventDetails();
    }
  };

  hideEventDetails() {
    if (this.eventDetails) {
      this.eventDetails.nativeElement.style.display = 'none';
    }
    document.removeEventListener('click', this.handleOutsideClick); // Remove event listener
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
console.log(response);
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
