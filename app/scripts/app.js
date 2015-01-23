'use strict';

/**
 * @ngdoc overview
 * @name youKaraokeApp
 * @description
 * # youKaraokeApp
 *
 * Main module of the application.
 */
angular
  .module('youKaraokeApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'firebase',
    'LocalStorageModule'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: '../views/main.html',
        controller: 'MainCtrl'
      })
      .when('/create', {
        templateUrl: '../views/create.html',
        controller: 'CreateCtrl'
      })
      .when('/room/:id', {
        templateUrl:'../views/room.html',
        controller: 'RoomCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
