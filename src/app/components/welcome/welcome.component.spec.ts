import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WelcomeComponent } from './welcome.component';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { EventFormComponent } from '../event-form/event-form.component';
import { EventListComponent } from '../event-list/event-list.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';

describe('WelcomeComponent', () => {
  let component: WelcomeComponent;
  let fixture: ComponentFixture<WelcomeComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        WelcomeComponent,
        EventFormComponent,
        EventListComponent
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(WelcomeComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should set showEvents to true and navigate to /events on start()', () => {
    const navigateSpy = spyOn(router, 'navigate');

    component.start();

    expect(component.showEvents).toBeTrue();
    expect(navigateSpy).toHaveBeenCalledWith(['/events']);
  });

  it('should call loadEvents() on the eventList when onEventCreated() is triggered', () => {
    const mockEventList = jasmine.createSpyObj('EventListComponent', ['loadEvents']);
    component.eventList = mockEventList;

    component.onEventCreated();

    expect(mockEventList.loadEvents).toHaveBeenCalled();
  });
});
