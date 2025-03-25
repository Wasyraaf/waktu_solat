import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasjidComponent } from './masjid.component';

describe('MasjidComponent', () => {
  let component: MasjidComponent;
  let fixture: ComponentFixture<MasjidComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MasjidComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MasjidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
