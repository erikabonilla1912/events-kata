import { Routes } from '@angular/router';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { EventsPageComponent } from './components/event-page/event-page.component';
import { EventEditComponent } from './components/event-edit/event-edit.component';

export const routes: Routes = [
  { path: '', component: WelcomeComponent },
  { path: 'events', component: EventsPageComponent },
  { path: 'event-edit/:id', component: EventEditComponent },
  { path: '**', redirectTo: '' }
];
