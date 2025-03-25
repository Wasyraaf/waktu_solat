import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http';
import { PrayerTimeService } from './app/prayer-time.service';

bootstrapApplication(AppComponent, {
  providers: [provideHttpClient()] // Provide HTTP Client globally
}).catch(err => console.error(err));
