'use strict';

describe('Service: playlist', function () {

  // load the service's module
  beforeEach(module('youKaraokeApp'));

  // instantiate service
  var playlist;
  beforeEach(inject(function (_playlist_) {
    playlist = _playlist_;
  }));

  it('should do something', function () {
    expect(!!playlist).toBe(true);
  });

});
