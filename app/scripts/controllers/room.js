'use strict';

angular.module('youKaraokeApp')
    .controller('RoomCtrl', function($scope, $http, auth, localStorageService, $routeParams, $location, fb) {
        localStorageService.set("lastsite", $routeParams.id);
        if (!auth.getCurrentUser()) {
            $location.path('/main');
        }
        $scope.currentUser = auth.getCurrentUser();
        $scope.users = [];

        /* 	fb.ref.on('child_added', function(dataSnapshot){
         		console.log(dataSnapshot.val());
         	})
         	 	console.log($routeParams.id);*/

        var usersRef = fb.room.child($routeParams.id).child("users");
        /* 		var firebaseUsers = usersRef.$asArray();
         		console.log("firbase ", firebaseUsers);
         		usersRef.child("0/uid").once('value', function(dataSnapshot){
         			console.log("please be the naem ", dataSnapshot.val());
         		});*/






        /*console.log('this is usersRef: ', thing);*/
        

        usersRef.on('child_added', function(dataSnapshot) {
            console.log("CHILD ADDED TO USERS", dataSnapshot.val().google.displayName);
            $scope.$apply(function() {
                if ($scope.users.indexOf(dataSnapshot.val().google.displayName) === -1) {
                    $scope.users.push(dataSnapshot.val().google.displayName);
                    usersRef.push($scope.currentUser);
                }
            })
        });

        usersRef.on('child_removed', function(oldChildSnapshot) {
            console.log("CHILD removed", oldChildSnapshot.val().google.displayName); {
              $scope.users.splice(($scope.users.indexOf(oldChildSnapshot.val().google.displayName)), 1)
            }
        });









        //melissa

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
 		})

 	}
    });