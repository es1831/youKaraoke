'use strict';

/**
 * @ngdoc function
 * @name youKaraokeApp.controller:CreateCtrl
 * @description
 * # CreateCtrl
 * Controller of the youKaraokeApp
 */
 angular.module('youKaraokeApp')
 .controller('CreateCtrl', function ($scope,$http, fb, auth) {
 	var creator = auth.getCurrentUser();
 	
 	$scope.room = {
 		creator: creator,
 		playlist: [],
 		users: []
 	}
 	$scope.room.users.push(creator);

 	console.log("this is user: ", auth.getCurrentUser());

 	var api = "AIzaSyABJumn6ZK-Ru4vt1U0hq7wQA99Z6EhXLE";

 	var oAuth = "900189317018-kphukaabv9r3sljqf6hunvfg91s7ihir.apps.googleusercontent.com"


/* 	$http.get("https://www.googleapis.com/youtube/v3/search?order=date&part=id%2C+snippet&channelId=UCqhNRDQE_fqBDBwsvmT8cTg&type=video&key="+api).success(function(data){

 		console.log(data);
 	});*/

/* 	$http.get("https://www.googleapis.com/youtube/v3/subscriptions?part=snippet&mySubscribers=true&key=" +api).success(function(data){

 		console.log(data);
 	})*/

 	$http({
 		url: "https://www.googleapis.com/youtube/v3/subscriptions?",
 		method: "GET",
 		params: {
 			part:"snippet",
 			key: api
 		},
 		headers:{
 			Authorization: creator.data.google.accessToken
 		}
 	})

 	$scope.click = function(){

 		// $http({
 		// 	url: "https://www.googleapis.com/youtube/v3/playlists/this/is/called/params?but=this&is=called&query",
 		// 	method: "POST",
 		// 	params: {
 		// 		part: 'snippet',
 		// 		key: api
 		// 		part: {
 		// 			'snippet': {
 		// 				'title': 'New playlist', 
 		// 				'description': 'Sample playlist for Data API',
 		// 			}
 		// 		},
 		// 	access_token: creator.data.google.accessToken
 		// 	}
 		// })
 		// .success(function(data) {
 		// 	console.log(data);
 		// })


		$http({
 			url: "https://www.googleapis.com/youtube/v3/playlists",
 			method: "POST",
 			params: {
 				part: 'snippet',
 				key: api
 			},
 			data: {
 				'title': 'New Playlist',
 				'description': 'Sample playlist'
 			},
 			headers: {
 				Authorization: creator.data.google.accessToken
 			}
 		})
 		.success(function(data) {
 			console.log(data);
 		})

 	}
 	/*fb.room.push();*/
 });
