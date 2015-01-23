'use strict';

describe('Service: google', function () {

  // load the service's module
  beforeEach(module('youKaraokeApp'));

  // instantiate service
  var google;
  beforeEach(inject(function (_google_) {
    google = _google_;
  }));

  it('should do something', function () {
    expect(!!google).toBe(true);
  });

});
