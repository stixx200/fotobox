import { TestBed, inject } from '@angular/core/testing';

import { LiveViewService } from './live-view.service';

describe('LiveViewService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LiveViewService]
    });
  });

  it('should be created', inject([LiveViewService], (service: LiveViewService) => {
    expect(service).toBeTruthy();
  }));
});
