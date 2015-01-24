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
 	$scope.users = [];

 	fb.ref.on('child_added', function(dataSnapshot){
 		console.log(dataSnapshot.val());
 	})
 	console.log($routeParams.id);
 	var usersRef = fb.room.child($routeParams.id).child("users");
 	usersRef.push($scope.currentUser);

 	usersRef.on('child_added', function(dataSnapshot) {
 		console.log("CHILD ADDED TO USERS", dataSnapshot.val().data.google.displayName);
 		$scope.$apply(function() {
 			$scope.users.push(dataSnapshot.val().data.google.displayName);
 		})
 	});


 });