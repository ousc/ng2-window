import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WindowxComponent } from './windowx.component';

describe('WindowxComponent', () => {
  let component: WindowxComponent;
  let fixture: ComponentFixture<WindowxComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WindowxComponent]
    });
    fixture = TestBed.createComponent(WindowxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
