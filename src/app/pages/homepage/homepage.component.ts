import { Component, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements AfterViewInit {
  slideIndex = 0;
  totalSlides = 0;

  ngAfterViewInit() {
    this.totalSlides = document.querySelectorAll('.slider img').length;
    setInterval(() => this.moveSlide(1), 3000); // Auto-slide every 3s
  }

  moveSlide(direction: number) {
    const slider = document.querySelector('.slider') as HTMLElement;
    this.slideIndex += direction;

    if (this.slideIndex >= this.totalSlides) {
      this.slideIndex = 0;
    } else if (this.slideIndex < 0) {
      this.slideIndex = this.totalSlides - 1;
    }

    slider.style.transform = `translateX(${-this.slideIndex * 100}%)`;
  }
}
