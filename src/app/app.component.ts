import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventFormComponent } from './components/event-form/event-form.component';
import { EventListComponent } from './components/event-list/event-list.component';


@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [CommonModule, EventFormComponent, EventListComponent]
})

export class AppComponent {
  showEvents = false;

  start() {
    this.showEvents = true;
  }

  logout() {
    console.log('Cerrando sesión...');
    this.showEvents = false;
  }
}
