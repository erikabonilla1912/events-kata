import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { apiKeyInterceptor } from './app/api-key.interceptor';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(
      withFetch(),
      withInterceptors([apiKeyInterceptor])
    ),
    provideRouter(routes)
  ]
})
  .catch(err => console.error(err));
