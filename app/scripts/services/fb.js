'use strict';

/**
 * @ngdoc service
 * @name youKaraokeApp.fb
 * @description
 * # fb
 * Factory in the youKaraokeApp.
 */
angular.module('youKaraokeApp')
  .factory('fb', function ($firebase) {
    var ref = new Firebase("https://youkaraoke.firebaseio.com/");

    // Public API here
    return {
      ref: ref,
      room: ref.child('room'),
      users: ref.child('users')
    };
  });
