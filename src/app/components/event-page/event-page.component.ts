import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventFormComponent } from '../event-form/event-form.component';
import { EventListComponent } from '../event-list/event-list.component';

@Component({
  selector: 'app-events-page',
  standalone: true,
  templateUrl: './event-page.component.html',
  styleUrls: ['./event-page.component.scss'],
  imports: [CommonModule, EventFormComponent, EventListComponent],
})
export class EventsPageComponent {}
