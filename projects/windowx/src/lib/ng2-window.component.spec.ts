import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Ng2WindowComponent } from './ng2-window.component';

describe('WindowxComponent', () => {
  let component: Ng2WindowComponent;
  let fixture: ComponentFixture<Ng2WindowComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Ng2WindowComponent]
    });
    fixture = TestBed.createComponent(Ng2WindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
