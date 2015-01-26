'use strict';

/**
 * @ngdoc function
 * @name youKaraokeApp.controller:CreateCtrl
 * @description
 * # CreateCtrl
 * Controller of the youKaraokeApp
 */
 angular.module('youKaraokeApp')
 .controller('CreateCtrl', function ($scope, $http, fb, auth, $location, localStorageService) {
 	var creator = auth.getCurrentUser();
 	var api = "AIzaSyABJumn6ZK-Ru4vt1U0hq7wQA99Z6EhXLE";
 	var oAuth = "900189317018-kphukaabv9r3sljqf6hunvfg91s7ihir.apps.googleusercontent.com";
 	
 	$scope.videoId = "";
 	$scope.searchResults = [];
 	$scope.room = {
 		creator: creator,
 		playlist: [],
 		users: [],
 		videos: []
 	}

 	console.log(creator);
 	$scope.room.users.push(creator);

 	$scope.search = function(query) {
 		$http({
	 		url: 'https://www.googleapis.com/youtube/v3/search',
	 		method: 'GET',
	 		params: {
	 			part: 'snippet',
	 			q: 'karaoke ' + query,
	 			maxResults: 4
	 		},
	 		headers: {
 				Authorization: 'Bearer ' + creator.google.accessToken
	 		}
	 	})
 		.success(function(res) {
 			$scope.searchResults = res.items;
 		});
 	};

 	$scope.addToIdsArray = function(videoId) {
 		$scope.videoId = videoId;
 		angular.element('#search-results').css({display: 'none'});
 	}

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
 			console.log(playlist);
 			$scope.room.playlist.push(playlist);
 			var key = fb.room.push($scope.room);
 			var roomKey = key.toString().split("room/")[1];

 			$http({
		 		url: 'https://www.googleapis.com/youtube/v3/playlistItems',
		 		method: 'POST',
		 		params: {
		 			part: 'snippet',
		 		},
		 		data: {
		 			snippet: {
		 				playlistId: playlist.id,
		 				resourceId: {
		 					kind: 'youtube#video',
		 					videoId: $scope.videoId
		 				}
		 			}
		 		},
		 		headers: {
	 				Authorization: 'Bearer ' + creator.google.accessToken
	 			}
		 	})
		 	.success(function(){
		 		localStorageService.set("creator", creator);
	 			$location.path('/room/' + roomKey);
		 	});
 		});
 	}

 });
