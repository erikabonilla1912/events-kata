import { Routes } from '@angular/router';
import { EventListComponent } from './components/event-list/event-list.component';
import { EventEditComponent } from './components/event-edit/event-edit.component';


export const routes: Routes = [
    { path: 'event-list', component: EventListComponent },
    { path: 'event-edit/:id', component: EventEditComponent },
    { path: '', redirectTo: '/event-list', pathMatch: 'full' },
];
