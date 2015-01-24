'use strict';

 angular.module('youKaraokeApp')
 .controller('RoomCtrl', function ($scope, $http, auth, localStorageService, $routeParams, $location, fb) {
 	localStorageService.set("lastsite", $routeParams.id);
 	if(!auth.getCurrentUser()){
 		$location.path('/main');
 	}
 	$scope.currentUser = auth.getCurrentUser();

 	fb.ref.on('child_added', function(dataSnapshot){
 		// console.log(dataSnapshot.val());
 	})

 	var tag = document.createElement('script');
 	tag.src = "https://www.youtube.com/iframe_api";
 	var firstScriptTag = document.getElementsByTagName('script')[0];
 	firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

 	var done = false;
 	$scope.player;
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
	 		});
	 }

 	function onPlayerReady(evt) {
	 		$scope.player.loadPlaylist({
	 			listType: "playlist",
	 			list: "PLSZ99_lv80OxtO4gJzelWVB_e5HJDsLfX" // whatever the playlist id actually is
	 		})
 		// evt.target.playVideo();
 	}
 	function onPlayerStateChange(evt) {
 		if (evt.data == YT.PlayerState.PLAYING && !done) {
 			setTimeout(stopVideo, 6000);
 			done = true;
 		}
 	}
 	function stopVideo() {
 		$scope.player.stopVideo();
 	}

 	// my crappy functions
 	$scope.searchResults = [];
 	$scope.search = function(query) {
 		$http({
	 		url: "https://www.googleapis.com/youtube/v3/search",
	 		method: "GET",
	 		params: {
	 			part: "snippet",
	 			q: "karaoke " + query,
	 			maxResults: 4
	 		},
	 		headers: {
	 				Authorization: 'Bearer ya29.BAE5Zt5ET5BEc1V6thMNeDXDIDkgip_-FU9rg_SFe-HRqf94XgztziRMxbwVrsux8MggCaYu3jm9pw'
	 			}
	 	})
 		.success(function(res) {
 			$scope.searchResults = res.items;
 		});
 	}

 	$scope.addToPlaylist = function(videoId) {
 		$http({
	 		url: "https://www.googleapis.com/youtube/v3/playlistItems",
	 		method: "POST",
	 		params: {
	 			part: "snippet",
	 		},
	 		data: {
	 			snippet: {
	 				playlistId: "PLSZ99_lv80OxtO4gJzelWVB_e5HJDsLfX",
	 				resourceId: videoId
	 			}
	 		},
	 		headers: {
	 				Authorization: 'Bearer ya29.BAE5Zt5ET5BEc1V6thMNeDXDIDkgip_-FU9rg_SFe-HRqf94XgztziRMxbwVrsux8MggCaYu3jm9pw'
	 			}
	 	})
 		.success(function(res) {
 			console.log(res);
 			angular.element("#"+videoId).css{display: block};
 		});
 	}
});