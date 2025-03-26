import { Component, AfterViewInit } from '@angular/core';
import { PrayerTimeService } from '../../prayer-time.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements AfterViewInit {
  slideIndex = 0;
  totalSlides = 0;
  prayerTimes: any = {};

  constructor(private prayerTimeService: PrayerTimeService) {}

  ngOnInit() {
    this.prayerTimeService.getPrayerTimes().subscribe((data: any) => {
      this.prayerTimes = data.data.timings;
    });
  }

  ngAfterViewInit() {
    const slides = document.querySelectorAll('.slider img');
    this.totalSlides = slides.length;

    setInterval(() => {
      this.moveSlide(1);
    }, 3000);
  }

  moveSlide(direction: number) {
    const slider = document.querySelector('.slider') as HTMLElement;
    this.slideIndex += direction;

    if (this.slideIndex >= this.totalSlides) {
      this.slideIndex = 0; // ✅ Reset to first slide smoothly
    } else if (this.slideIndex < 0) {
      this.slideIndex = this.totalSlides - 1;
    }

    slider.style.transition = "transform 0.5s ease-in-out"; // ✅ Smooth transition
    slider.style.transform = `translateX(${-this.slideIndex * 100}%)`;
  }
}
