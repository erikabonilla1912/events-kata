import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { EventEditComponent } from './event-edit.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';

describe('EventEditComponent', () => {
  let component: EventEditComponent;
  let fixture: ComponentFixture<EventEditComponent>;
  let httpMock: HttpTestingController;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        { 
          provide: ActivatedRoute, 
          useValue: { snapshot: { paramMap: { get: () => '1' } } } 
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EventEditComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should update the event', fakeAsync(() => {
    spyOn(window, 'alert');
    const navigateSpy = spyOn(router, 'navigate');

    component.event = {
      id: 1,
      name: 'Updated Event',
      date: '2025-03-05',
      time: '12:00',
      location: 'Room 2',
      description: 'Updated description'
    };

    component.updateEvent();

    const req = httpMock.expectOne('http://localhost:3006/events/1');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body.name).toBe('Updated Event');

    req.flush({});

    tick();

    expect(window.alert).toHaveBeenCalledWith('Evento actualizado');
    expect(navigateSpy).toHaveBeenCalledWith(['/event-list']);
  }));
});
