'use strict';

/**
 * @ngdoc function
 * @name youKaraokeApp.controller:CreateCtrl
 * @description
 * # CreateCtrl
 * Controller of the youKaraokeApp
 */
 angular.module('youKaraokeApp')
 .controller('CreateCtrl', function ($scope, $http, fb, auth, $location) {
 	var creator = auth.getCurrentUser();
 	var api = "AIzaSyABJumn6ZK-Ru4vt1U0hq7wQA99Z6EhXLE";
 	var oAuth = "900189317018-kphukaabv9r3sljqf6hunvfg91s7ihir.apps.googleusercontent.com";
 	
 	$scope.room = {
 		creator: creator,
 		playlist: [],
 		users: []
 	}
 	console.log(creator);
 	
 	$scope.room.users.push(creator);

 	$scope.createPlaylist = function(){

 		$http({
 			url: "https://www.googleapis.com/youtube/v3/playlists",
 			method: "POST",
 			params: {
 				part: 'snippet, status',
 				key: api
 			},
 			data: {
 				snippet:{
 					'title': $scope.playlist.title,
 					'description': $scope.playlist.description
 				},
 				status:{
 					'privacyStatus': 'public'
 				}
 			},
 			headers: {
 				Authorization: 'Bearer ' + creator.google.accessToken
 			}
 		})
 		.success(function(playlist) {
 			$scope.room.playlist.push(playlist);
 			console.log(playlist);
 			var key = fb.room.push($scope.room);
 			var roomKey = key.toString().split("room/")[1];
 			$location.path('/room/' + roomKey);
 		})
 	}

 });
