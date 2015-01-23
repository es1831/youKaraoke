'use strict';

describe('Service: fb', function () {

  // load the service's module
  beforeEach(module('youKaraokeApp'));

  // instantiate service
  var fb;
  beforeEach(inject(function (_fb_) {
    fb = _fb_;
  }));

  it('should do something', function () {
    expect(!!fb).toBe(true);
  });

});
