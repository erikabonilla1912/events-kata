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
  event: any = { 
    firstName: '', 
    lastName: '', 
    identification: '', 
    birthDate: '', 
    address: ''
  };

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
    console.log('Consultando registro con ID:', id);  // Verifica que el ID se pasa correctamente
    this.http.get<any>(`http://localhost:3006/events/${id}`)
      .subscribe(data => {
        console.log('Registro cargado:', data);  // Revisa la respuesta en la consola
        this.event = {
          ...data,
          birthDate: this.formatDate(data.birthDate)
        };
      }, error => {
        console.error('Error al cargar el registro:', error);  // Muestra el error en la consola
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
    const { firstName, lastName, identification, birthDate, address } = this.event;
    this.http.put(`http://localhost:3006/events/${this.event.id}`, { firstName, lastName, identification, birthDate, address })
      .subscribe(() => {
        alert('Registro actualizado');
        this.router.navigate(['/event-list']);
      });
  }
}
