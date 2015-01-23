'use strict';

/**
 * @ngdoc function
 * @name youKaraokeApp.controller:RoomCtrl
 * @description
 * # RoomCtrl
 * Controller of the youKaraokeApp
 */
 angular.module('youKaraokeApp')
 .controller('RoomCtrl', function ($scope) {

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
	 	function onYouTubeIframeAPIReady() {
	 		$scope.player = new YT.Player('player', {
	 			height: '390',
	 			width: '640',
	 			videoId: 'JW5meKfy3fY',
	 			events: {
	 				'onReady': onPlayerReady,
	 				'onStateChange': onPlayerStateChange
	 			}
	 		});
	 	}

	 }
 	function onPlayerReady(evt) {
 		evt.target.playVideo();
 	}
 	function onPlayerStateChange(evt) {
 		if (evt.data == YT.PlayerState.PLAYING && !done) {
 			setTimeout(stopVideo, 6000);
 			done = true;
 		}
 	}
 	function stopVideo() {
 		player.stopVideo();
 	}
 });