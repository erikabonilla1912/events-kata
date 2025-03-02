import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-event-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.scss']
})
export class EventFormComponent {
  eventForm: FormGroup;
  private http = inject(HttpClient);
  events: any[] = [];

  constructor(private fb: FormBuilder) {
    this.eventForm = this.fb.group({
      name: ['', Validators.required],
      date: ['', Validators.required],
      time: ['', Validators.required],
      location: ['', Validators.required],
      description: ['']
    });
  }

  onSubmit() {
    if (this.eventForm.valid) {
      const newEvent = this.eventForm.value;
      console.log('Evento enviado:', newEvent);
      this.http.post('http://localhost:3006/events', newEvent)
        .subscribe({
          next: response => {
            console.log('Evento guardado:', response);
            alert('Evento guardado con éxito!');
            this.events.push(newEvent);
            this.eventForm.reset();
          },
          error: err => console.error('Error al guardar evento:', err)
        });
    }
  }
}
