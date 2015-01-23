'use strict';

 angular.module('youKaraokeApp')
 .controller('RoomCtrl', function ($scope, $routeParams, $http) {
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
	 			list: "PLSZ99_lv80OxtO4gJzelWVB_e5HJDsLfX" // $routeParams.id
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
	 				Authorization: 'Bearer ya29.BAHqTD8wrPOD8mhXwVlImR-1EmbI-WBhuhYkv5sX5U7TamO_gvoF1SHIvdFxjny6BmFF2WS8-cyXew'
	 			}
	 	})
 		.success(function(res) {
 			$scope.searchResults = res.items;
			// document.getElementById("search-results").innerHTML = "";
 		// 	var results = res.items.forEach(function(vid) {
 		// 		document.getElementById("search-results").insertAdjacentHTML("beforeend", "<div class='result col-lg-3'><img src='http://img.youtube.com/vi/"+vid.id.videoId+"/default.jpg' /><p>"+vid.snippet.title+"</p></div>");
 		// 	})

 		})
 	}
 });