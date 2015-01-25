'use strict';

 angular.module('youKaraokeApp')
 .controller('RoomCtrl', function ($scope, $http, auth, localStorageService, $routeParams, $location, fb) {
 	localStorageService.set("lastsite", $routeParams.id);
 	if(!auth.getCurrentUser()){
 		$location.path('/main');
 	}
 	$scope.currentUser = auth.getCurrentUser();
 	$scope.users = [];

 	fb.ref.on('child_added', function(dataSnapshot){
 		// console.log(dataSnapshot.val());
 	})

 	 	console.log($routeParams.id);
 	var usersRef = fb.room.child($routeParams.id).child("users");
 	usersRef.push($scope.currentUser);

 	usersRef.on('child_added', function(dataSnapshot) {
 		console.log("CHILD ADDED TO USERS", dataSnapshot.val().data.google.displayName);
		$scope.users.push(dataSnapshot.val().data.google.displayName);
 	});


//melissa
 	var tag = document.createElement('script');
 	tag.src = "https://www.youtube.com/iframe_api";
 	var firstScriptTag = document.getElementsByTagName('script')[0];
 	firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

 	var done = false;
 	$scope.player;
 	$scope.queue;
 	$scope.youTubeIframeAPIReady = false;
 	window.onYouTubeIframeAPIReady = runWhenAPIReady;

 	if (window.YT) runWhenAPIReady();

 	function runWhenAPIReady(){
 		$scope.youTubeIframeAPIReady = window.youTubeIframeAPIReady = true;
	 		$scope.player = new YT.Player('player', {
	 			playerVars: {autoplay: 0},
	 			height: '390',
	 			width: '640',
	 			events: {
	 				'onReady': onPlayerReady,
	 				'onStateChange': onPlayerStateChange
	 			}
	 			//optional: playerVars
	 		});
	 };

 	function onPlayerReady(evt) {
 		$scope.player.loadPlaylist({
 			listType: 'playlist',
 			list: 'PLSZ99_lv80OxtO4gJzelWVB_e5HJDsLfX' // whatever the playlist id actually is
 		});
 		// evt.target.playVideo();
		$http({
 			url: 'https://www.googleapis.com/youtube/v3/playlistItems',
 			method: 'GET',
 			params: {
 				part: 'snippet',
 				playlistId: 'PLSZ99_lv80OxtO4gJzelWVB_e5HJDsLfX', // whatever the playlist id actually is
 				maxResults: 50
 			},
 			headers: {
 				Authorization: 'Bearer ' + $scope.currentUser.data.google.accessToken
	 		}
 		})
 		.success(function(res) {
 			$scope.queue = res.items.map(function(item) {return {title: item.snippet.title, status: 'non'}});
 			$scope.queue[0].status = 'current';
 		});
 	};
 	function onPlayerStateChange(evt) {
 		if (evt.data == YT.PlayerState.PLAYING && !done) {
 			setTimeout(stopVideo, 6000);
 			done = true;
 		}
 		if (evt.data == 0) {
 			var i = $scope.player.getPlaylistIndex();
 			if ($scope.queue[i - 1].status !== 'non' || i === 1) {
	 			$scope.queue[i - 1].status = 'non';
	 			$scope.queue[i].status = 'current';
	 			$scope.$apply();
 			}
 		}
 	};
 	function stopVideo() {
 		$scope.player.stopVideo();
 	};

 	$scope.searchResults = [];
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
 				Authorization: 'Bearer ' + $scope.currentUser.data.google.accessToken
	 		}
	 	})
 		.success(function(res) {
 			$scope.searchResults = res.items;
 		});
 	};

 	var index = 0;
 	var reloadWhenDone = function(evt) {
		if (evt.data == 0) {
			// don't even look at me
			if (typeof $scope.player.getPlaylistIndex() !== 'undefined') {
				index = $scope.player.getPlaylistIndex();
				$scope.player.loadPlaylist({
					listType: 'playlist',
					list: 'PLSZ99_lv80OxtO4gJzelWVB_e5HJDsLfX', // whatever the playlist id actually is
					index: index
				});
			}
			$scope.player.removeEventListener('onStateChange', reloadWhenDone);
		}
	}

 	$scope.addToPlaylist = function(videoId) {
 		console.log(videoId);
 		$http({
	 		url: 'https://www.googleapis.com/youtube/v3/playlistItems',
	 		method: 'POST',
	 		params: {
	 			part: 'snippet',
	 		},
	 		data: {
	 			snippet: {
	 				playlistId: 'PLSZ99_lv80OxtO4gJzelWVB_e5HJDsLfX',
	 				resourceId: {
	 					kind: 'youtube#video',
	 					videoId: videoId
	 				}
	 			}
	 		},
	 		headers: {
	 				Authorization: 'Bearer ' + $scope.currentUser.data.google.accessToken
	 			}
	 	})
 		.success(function(res) {
 			angular.element('#'+videoId).css({display: 'block'});
 			$scope.player.addEventListener('onStateChange', reloadWhenDone);

 			$http({
	 			url: 'https://www.googleapis.com/youtube/v3/playlistItems',
	 			method: 'GET',
	 			params: {
	 				part: 'snippet',
	 				playlistId: 'PLSZ99_lv80OxtO4gJzelWVB_e5HJDsLfX', // whatever the playlist id actually is
	 				maxResults: 50
	 			},
	 			headers: {
	 				Authorization: 'Bearer ' + $scope.currentUser.data.google.accessToken
		 		}
	 		})
	 		.success(function(res) {
	 			$scope.queue = res.items.map(function(item) {return {title: item.snippet.title, status: 'non'}});
	 			$scope.queue[$scope.player.getPlaylistIndex()].status = 'current';
	 		});
 		});
 	};
});
