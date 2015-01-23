'use strict';

describe('Controller: RoomCtrl', function () {

  // load the controller's module
  beforeEach(module('youKaraokeApp'));

  var RoomCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    RoomCtrl = $controller('RoomCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
