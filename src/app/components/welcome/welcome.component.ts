import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { EventFormComponent } from '../event-form/event-form.component';
import { EventListComponent } from '../event-list/event-list.component';

@Component({
  selector: 'app-welcome',
  standalone: true,
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
  imports: [CommonModule, EventFormComponent, EventListComponent],
})
export class WelcomeComponent {
  @ViewChild('eventList') eventList!: EventListComponent;

  constructor(private router: Router) {}
  showEvents = false;

  start() {
    this.showEvents = true;
    this.router.navigate(['/events']);
  }

  onEventCreated() {
    if (this.eventList) {
      this.eventList.loadEvents();
    }
  }
}
