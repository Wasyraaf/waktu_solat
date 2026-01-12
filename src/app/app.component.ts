import { Component, OnInit, Inject, Renderer2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { DatePipe } from '@angular/common';
import { SolatService, SolatResponse, Zone } from './solat.service';

@Component({
  selector: 'app-root',
  imports: [DatePipe],
  templateUrl: 'app.component.html',
  styleUrl: 'app.component.css'
})
export class AppComponent implements OnInit {
  title = 'Waktu Solat';

  // Dummy data for display - in a real app this would come from a service
  currentLocation = 'Kuala Lumpur, Putrajaya'; // Defaulting to KL (WLY01)
  currentDate = new Date();
  hijriDate = '';

  // Theme State
  isDarkMode = true;

  // Search State
  showSearch = false;
  zones: Zone[] = [];

  uniqueStates: string[] = [];
  filteredStates: string[] = [];
  selectedState: string | null = null;
  filteredZones: Zone[] = [];

  currentZone = 'WLY01';

  nextPrayer = 'Menuju...';

  prayerTimes: { name: string; time: string; active: boolean; timestamp: number }[] = [
    { name: 'Subuh', time: '-', active: false, timestamp: 0 },
    { name: 'Syuruk', time: '-', active: false, timestamp: 0 },
    { name: 'Zohor', time: '-', active: false, timestamp: 0 },
    { name: 'Asar', time: '-', active: false, timestamp: 0 },
    { name: 'Maghrib', time: '-', active: false, timestamp: 0 },
    { name: 'Isyak', time: '-', active: false, timestamp: 0 },
  ];

  constructor(
    private solatService: SolatService,
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2
  ) { }

  ngOnInit() {
    // Set initial theme (default dark)
    this.toggleTheme(true);
    this.loadPrayerTimes(this.currentZone);
    this.loadZones();

    // Update active prayer every minute
    setInterval(() => {
      this.currentDate = new Date();
      this.determineActivePrayer();
    }, 60000);
  }

  loadPrayerTimes(zone: string) {
    this.solatService.getPrayerTimes(zone).subscribe({
      next: (data: SolatResponse) => {
        const today = new Date().getDate();
        const todaysPrayer = data.prayers.find(p => p.day === today);

        if (todaysPrayer) {
          this.hijriDate = todaysPrayer.hijri;

          this.updatePrayerTime('Subuh', todaysPrayer.fajr);
          this.updatePrayerTime('Syuruk', todaysPrayer.syuruk);
          this.updatePrayerTime('Zohor', todaysPrayer.dhuhr);
          this.updatePrayerTime('Asar', todaysPrayer.asr);
          this.updatePrayerTime('Maghrib', todaysPrayer.maghrib);
          this.updatePrayerTime('Isyak', todaysPrayer.isha);

          this.determineActivePrayer();
        }
      },
      error: (err: any) => console.error('Error fetching prayer times:', err)
    });
  }

  loadZones() {
    this.solatService.getZones().subscribe({
      next: (data) => {
        this.zones = data;
        // Extract unique states
        const states = new Set(data.map(z => z.negeri));
        this.uniqueStates = Array.from(states).sort();
        this.filteredStates = this.uniqueStates;
      },
      error: (err) => console.error('Error loading zones:', err)
    });
  }

  toggleSearch() {
    this.showSearch = !this.showSearch;
    if (this.showSearch) {
      // Reset search state
      this.selectedState = null;
      this.filteredStates = this.uniqueStates;
    }
  }

  onSearchInput(event: any) {
    const query = event.target.value.toLowerCase();

    if (!this.selectedState) {
      // Filter states
      this.filteredStates = this.uniqueStates.filter(state =>
        state.toLowerCase().includes(query)
      );
    } else {
      // Filter zones within selected state
      this.filteredZones = this.zones.filter(z =>
        z.negeri === this.selectedState &&
        (z.daerah.toLowerCase().includes(query) || z.jakimCode.toLowerCase().includes(query))
      );
    }
  }

  selectState(state: string) {
    this.selectedState = state;
    this.filteredZones = this.zones.filter(z => z.negeri === state);
    // Clear search input (visually this requires binding, but for now we assume user clears or we handle in template)
    // In a reactive form or ngModel we would reset the model.
    // For now, we might rely on re-rendering the input or manual clear logic if possible.
  }

  backToStates() {
    this.selectedState = null;
    this.filteredStates = this.uniqueStates;
  }

  selectZone(zone: Zone) {
    this.currentZone = zone.jakimCode;
    this.currentLocation = zone.daerah;
    this.loadPrayerTimes(this.currentZone);
    this.showSearch = false;
  }

  toggleTheme(forceDark?: boolean) {
    if (forceDark !== undefined) {
      this.isDarkMode = forceDark;
    } else {
      this.isDarkMode = !this.isDarkMode;
    }

    if (this.isDarkMode) {
      this.renderer.removeAttribute(this.document.documentElement, 'data-theme');
    } else {
      this.renderer.setAttribute(this.document.documentElement, 'data-theme', 'light');
    }
  }

  private updatePrayerTime(name: string, timestamp: number) {
    const date = new Date(timestamp * 1000);
    const timeStr = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const prayer = this.prayerTimes.find(p => p.name === name);
    if (prayer) {
      prayer.time = timeStr;
      prayer.timestamp = date.getTime();
    }
  }

  private determineActivePrayer() {
    const now = new Date().getTime();
    this.prayerTimes.forEach(p => p.active = false);

    // Find the first prayer that is in the future
    const next = this.prayerTimes.find(p => p.timestamp > now);

    if (next) {
      next.active = true;
      this.nextPrayer = `Menuju ${next.name}...`;
    } else {
      // If no prayer is next (meaning after Isyak), then next is Subuh (tomorrow)
      // Since we don't have tomorrow's data loaded easily here without efficient logic handling,
      // For now we can just say "Menuju Subuh" or leave it. 
      // Or we can highlight Subuh as the next cycle.
      const subuh = this.prayerTimes.find(p => p.name === 'Subuh');
      if (subuh) {
        // subuh.active = true; // Optional: highlight subuh for tomorrow
        this.nextPrayer = 'Menuju Subuh (Esok)...';
      }
    }
  }


}
