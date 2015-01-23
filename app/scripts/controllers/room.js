'use strict';

/**
 * @ngdoc function
 * @name youKaraokeApp.controller:RoomCtrl
 * @description
 * # RoomCtrl
 * Controller of the youKaraokeApp
 */
 angular.module('youKaraokeApp')
 .controller('RoomCtrl', function ($scope, auth, localStorageService, $routeParams, $location, fb) {

 	localStorageService.set("lastsite", $routeParams.id);
 	if(!auth.getCurrentUser()){
 		$location.path('/main');
 	}
 	$scope.currentUser = auth.getCurrentUser();

 	fb.ref.on('child_added', function(dataSnapshot){
 		console.log(dataSnapshot.val());
 	})
 	console.log($routeParams.id);
 	fb.room[$routeParams.id].push($scope.currentUser);

 });