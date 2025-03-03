import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { EventFormComponent } from './event-form.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';

describe('EventFormComponent', () => {
  let component: EventFormComponent;
  let fixture: ComponentFixture<EventFormComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ReactiveFormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(EventFormComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have an invalid form when empty', () => {
    expect(component.eventForm.valid).toBeFalse();
  });

  it('should have a valid form when all fields are filled', () => {
    component.eventForm.setValue({
      name: 'Test Event',
      date: '2025-03-05',
      time: '12:00',
      location: 'Room 1',
      description: 'Event description'
    });
    expect(component.eventForm.valid).toBeTrue();
  });

  it('should not submit the form if invalid', () => {
    spyOn(window, 'alert');
    component.eventForm.setValue({
      name: '',
      date: '',
      time: '',
      location: '',
      description: ''
    });

    component.onSubmit();

    httpMock.expectNone('http://localhost:3006/events');
    expect(window.alert).not.toHaveBeenCalledWith('Evento guardado con éxito!');
  });

  it('should submit the form and emit event when valid', fakeAsync(() => {
    spyOn(window, 'alert');
    spyOn(component.eventCreated, 'emit');

    component.eventForm.setValue({
      name: 'Test Event',
      date: '2025-03-05',
      time: '12:00',
      location: 'Room 1',
      description: 'Event description'
    });

    component.onSubmit();

    const req = httpMock.expectOne('http://localhost:3006/events');
    expect(req.request.method).toBe('POST');
    expect(req.request.body.name).toBe('Test Event');

    req.flush({});

    tick();

    expect(window.alert).toHaveBeenCalledWith('Evento guardado con éxito!');
    expect(component.eventCreated.emit).toHaveBeenCalled();
    expect(component.eventForm.value).toEqual({
      name: null,
      date: null,
      time: null,
      location: null,
      description: null
    });
  }));
});
