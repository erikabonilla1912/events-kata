import { Component, OnInit, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-event-edit',
  standalone: true,
  templateUrl: './event-edit.component.html',
  imports: [CommonModule, FormsModule],
  styleUrls: ['./event-edit.component.scss']
})
export class EventEditComponent implements OnInit {
  event: any = { name: '', date: '', time: '', location: '', description: '' };
  private http = inject(HttpClient);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  constructor() {}

  ngOnInit(): void {
    const eventId = this.route.snapshot.paramMap.get('id');
    if (eventId) {
      this.loadEvent(eventId);
    }
  }

  loadEvent(id: string): void {
    console.log('Consultando evento con ID:', id);  // Verifica que el ID se pasa correctamente
    this.http.get<any>(`http://localhost:3006/events/${id}`)
      .subscribe(data => {
        console.log('Evento cargado:', data);  // Revisa la respuesta en la consola
        this.event = {
          ...data,
          date: this.formatDate(data.date)
        };
      }, error => {
        console.error('Error al cargar el evento:', error);  // Muestra el error en la consola
      });
  }  
  
  formatDate(isoDate: string): string {
    const date = new Date(isoDate);
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }
  

  updateEvent(): void {
    const { name, date, time, location, description } = this.event;
    this.http.put(`http://localhost:3006/events/${this.event.id}`, { name, date, time, location, description })
      .subscribe(() => {
        alert('Evento actualizado');
        this.router.navigate(['/event-list']);
      });
  }
}
