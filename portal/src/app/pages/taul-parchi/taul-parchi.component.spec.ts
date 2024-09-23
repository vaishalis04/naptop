import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaulParchiComponent } from './taul-parchi.component';

describe('TaulParchiComponent', () => {
  let component: TaulParchiComponent;
  let fixture: ComponentFixture<TaulParchiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaulParchiComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TaulParchiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
