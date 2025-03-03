import { Component, OnInit, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-event-list',
  standalone: true,
  templateUrl: './event-list.component.html',
  imports: [CommonModule],
  styleUrls: ['./event-list.component.scss']
})
export class EventListComponent implements OnInit {
  events: any[] = [];
  private http = inject(HttpClient);
  private router = inject(Router);

  constructor() {}

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.http.get<any[]>('http://localhost:3006/events')
      .subscribe(data => {
        this.events = data;
      });
  }
    
  deleteEvent(id: number): void {
    if (confirm('¿Estás seguro de eliminar este evento?')) {
      this.http.delete(`http://localhost:3006/events/${id}`)
        .subscribe(() => {
          this.events = this.events.filter(event => event.id !== id);
        });
    }
  }

  editEvent(id: number): void {
    this.router.navigate(['/event-edit', id]);
  }
}
