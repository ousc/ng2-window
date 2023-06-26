import { TestBed } from '@angular/core/testing';

import { WindowxService } from './components/ng-windowx/window.service';

describe('WindowxService', () => {
  let service: WindowxService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WindowxService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
