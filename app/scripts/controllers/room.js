'use strict';

angular.module('youKaraokeApp')
    .controller('RoomCtrl', function($scope, $http, auth, localStorageService, $routeParams, $location, fb, $firebase) {
        localStorageService.set("lastsite", $routeParams.id);
        if (!auth.getCurrentUser()) {
            $location.path('/main');
        }
        else{
            localStorageService.remove('lastsite');
        }
        $scope.currentUser = auth.getCurrentUser();
        $scope.users = [];
        // $scope.queueIndex = 0; // nothing i do makes any sense i'm so sorry

        //CREATOR
        var creatorRef = fb.room.child($routeParams.id).child("creator");
        creatorRef.on('value', function(dataSnapshot) {

            $scope.creator = dataSnapshot.val();

            if ($scope.isCreator()) {

                var tag = document.createElement('script');
                tag.src = "https://www.youtube.com/iframe_api";

                var firstScriptTag = document.getElementsByTagName('script')[0];
                firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

                $scope.player;
                $scope.queue;
                $scope.youTubeIframeAPIReady = false;
                window.onYouTubeIframeAPIReady = runWhenAPIReady;

                if (window.YT) runWhenAPIReady();
            }

        })


        $scope.isCreator = function() {
          if($scope.creator){
            if ($scope.creator.uid === $scope.currentUser.uid) {
                return true;
            } else {
                return false;
            }
          }
          else{
            return false;
          }
        }

        // CURRENT?  i don't know i'm sorry if this is not okay
        var currentRef = fb.room.child($routeParams.id).child('current');
        currentRef.on('value', function(dataSnapshot) {
        	// console.log("current values have changed: ", dataSnapshot.val());
        	$scope.current = dataSnapshot.val();
        	if(dataSnapshot.val().neg >= 80 && $scope.isCreator()) {
        		$scope.player.nextVideo();
        		var index = $scope.player.getPlaylistIndex();
        		currentRef.set({
		        	title: $scope.queue[index + 1].title,
		        	pos: 50,
		        	neg: 50
		        });
		        $scope.queue[index].status = null;
		        $scope.queue[index + 1].status = 'current';
	        	$scope.$apply();
        	}
        	else {
                $scope.stacked = [
                        {value: $scope.current.pos, type: 'info'},
                        {value: $scope.current.neg, type: 'danger'}
                    ];
	        	// $scope.queue[$scope.queueIndex].status = null;
                // $scope.queueIndex++;
	        	// if ($scope.queue[$scope.queueIndex]) $scope.queue[$scope.queueIndex].status = 'current'; // don't know if this will work
	        	$scope.$apply();
        	}
        })

        //PLAYLIST
        var playlistRef = fb.room.child($routeParams.id).child("playlist");

        playlistRef.on('value', function(dataSnapshot) {
            $scope.playlist = dataSnapshot.val();
            /***** POPULATE QUEUE IMMEDIATELY *****/

            $http({
                    url: 'https://www.googleapis.com/youtube/v3/playlistItems',
                    method: 'GET',
                    params: {
                        part: 'snippet',
                        playlistId: $scope.playlist[0].id,
                        maxResults: 50
                    },
                    headers: {
                        Authorization: 'Bearer ' + $scope.currentUser.google.accessToken
                    }
                })
                .success(function(res) {
                    // console.log(res);
                    $scope.queue = res.items.map(function(item) {
                        return {
                            title: item.snippet.title,
                            id: item.id,
                            status: 'non'
                        }
                    });
                    if($scope.isCreator()) {
                        $scope.queue[0].status = 'current';
                        currentRef.set({
                            title: $scope.queue[0].title,
                            pos: 50,
                            neg: 50
                        });
                    }
                });
        })

        // var playlistArr = $firebase(playlistRef).$asArray();
        // playlistArr.$loaded().then(function(playlist) {
        // 	$scope.playlist = playlist;
        // 	console.log("this is a playlist: ", $scope.playlist[0]);
        // 	$scope.apply();
        // });


        //ASYNC ISSUES
        /*        playlistRef.on('value', function(dataSnapshot){
                	$scope.$apply(function(){
                		$scope.playlist = dataSnapshot.val();
                		console.log("this is a playlist: ", $scope.playlist);
                	})

                })
        console.log("this is a playlist outside: ", $scope.playlist);*/


        //VIDEOS

        var videosRef = fb.room.child($routeParams.id).child("videos");

        videosRef.on('child_added', function(dataSnapshot) {
            // console.log("Videos been added ", dataSnapshot.val());
            if ($scope.isCreator()) {
                $scope.player.addEventListener('onStateChange', reloadWhenDone);
            }

	        $http({
                url: 'https://www.googleapis.com/youtube/v3/playlistItems',
                method: 'GET',
                params: {
                    part: 'snippet',
                    playlistId: $scope.playlist[0].id,
                    maxResults: 50
                },
                headers: {
                    Authorization: 'Bearer ' + $scope.creator.google.accessToken
                }
            })
            .success(function(res) {
                $scope.queue = res.items.map(function(item) {
                    return {
                        title: item.snippet.title,
                        id: item.id,
                        videoId: item.snippet.resourceId.videoId,
                        status: 'non'
                    }
                });
                if ($scope.isCreator()) $scope.queue[$scope.player.getPlaylistIndex()].status = 'current';
            });
        });

		videosRef.on('child_removed', function(dataSnapshot) {
			// console.log("Video removed ", dataSnapshot.val());
	        $http({
                url: 'https://www.googleapis.com/youtube/v3/playlistItems',
                method: 'GET',
                params: {
                    part: 'snippet',
                    playlistId: $scope.playlist[0].id,
                    maxResults: 50
                },
                headers: {
                    Authorization: 'Bearer ' + $scope.creator.google.accessToken
                }
            })
            .success(function(res) {
                $scope.queue = res.items.map(function(item) {
                    return {
                        title: item.snippet.title,
                        id: item.id,
                        videoId: item.snippet.resourceId.videoId,
                        status: 'non'
                    }
                });
                if ($scope.isCreator()) $scope.queue[$scope.player.playlistIndex()].status = 'current';
            });
		});





        //USERS
        var usersRef = fb.room.child($routeParams.id).child("users");

        usersRef.on('child_added', function(dataSnapshot) {
            // console.log("CHILD ADDED TO USERS", dataSnapshot.val().google.displayName);
            if ($scope.users.indexOf(dataSnapshot.val().google.displayName) === -1) {
                $scope.$apply(function() {
                    $scope.users.push(dataSnapshot.val().google.displayName);
                    usersRef.push($scope.currentUser);
                })
            }
        });

        usersRef.on('child_removed', function(oldChildSnapshot) {
            // console.log("CHILD removed", oldChildSnapshot.val().google.displayName);
            $scope.users.splice(($scope.users.indexOf(oldChildSnapshot.val().google.displayName)), 1);
        });


        var done = false;

        /***** RELOADING EVENT LISTENER.  GETS ADDED UPON CHILD ADD *****/

        var reloadWhenDone = function(evt) {
            if (evt.data == 0) {
                if (typeof $scope.player.getPlaylistIndex() !== 'undefined') {
                    index = $scope.player.getPlaylistIndex();
                    if (index == 0) index++; // I DON'T KNOW OKAY
                    $scope.player.loadPlaylist({
                        listType: 'playlist',
                        list: $scope.playlist[0].id,
                        index: index
                    });
                }
                $scope.player.removeEventListener('onStateChange', reloadWhenDone);
            }
        }

        /***** PLAYER FUNCTIONS *****/
        function runWhenAPIReady() {
            $scope.youTubeIframeAPIReady = window.youTubeIframeAPIReady = true;
            $scope.player = new YT.Player('player', {
                playerVars: {
                    autoplay: 0,
                    iv_load_policy: 3
                },
                height: '480',
                width: '853',
                events: {
                    'onReady': onPlayerReady,
                    'onStateChange': onPlayerStateChange
                }
            });
        };

        function onPlayerReady(evt) {
            $scope.player.loadPlaylist({
                listType: 'playlist',
                list: $scope.playlist[0].id
            });
            // console.log($scope.playlist);
        };

        function onPlayerStateChange(evt) {
            if (evt.data == YT.PlayerState.PLAYING && !done) {
                setTimeout(stopVideo, 6000);
                done = true;
            }
            if (evt.data == 0) {
                var i = $scope.player.getPlaylistIndex();
                // console.log(i);
                if (i === 0) {
                	$scope.queue[0].status = 'non';
                	$scope.queue[1].status = 'current';
                	i++
                }
                else if ($scope.queue[i - 1].status !== 'non' || i === 1) {
                    $scope.queue[i - 1].status = 'non';
                    $scope.queue[i].status = 'current';
                    $scope.$apply();
                }
                currentRef.set({
		        	title: $scope.queue[i].title,
		        	pos: 50,
		        	neg: 50
		        });
            }
        };

        function stopVideo() {
            $scope.player.stopVideo();
        };

        /***** SEARCH *****/

        $scope.searchResults = [];
        $scope.search = function(query) {
            $scope.query = "";
            $http({
                    url: 'https://www.googleapis.com/youtube/v3/search',
                    method: 'GET',
                    params: {
                        part: 'snippet',
                        q: 'karaoke ' + query,
                        maxResults: 20,
                        type: 'video',
                        videoEmbeddable: 'true'
                    },
                    headers: {
                        Authorization: 'Bearer ' + $scope.currentUser.google.accessToken
                    }
                })
                .success(function(res) {
                    $scope.searchResults = res.items;
                });
        };

        var index = 0;

        /***** ADD TO PLAYLIST--FOR USERS ALSO *****/

        $scope.addToPlaylist = function(videoId) {
            // console.log($scope.creator.google.accessToken);
            $http({
                    url: 'https://www.googleapis.com/youtube/v3/playlistItems',
                    method: 'POST',
                    params: {
                        part: 'snippet',
                    },
                    data: {
                        snippet: {
                            playlistId: $scope.playlist[0].id,
                            resourceId: {
                                kind: 'youtube#video',
                                videoId: videoId
                            }
                        }
                    },
                    headers: {
                        Authorization: 'Bearer ' + $scope.creator.google.accessToken
                    }
                })
                .success(function(res) {
                    angular.element('#' + videoId).css({
                        display: 'block'
                    });
                    videosRef.push(videoId);
                });
        };

        /***** REMOVE FROM PLAYLIST - FOR CREATOR ONLY *****/

        $scope.removeFromPlaylist = function(video) {
            if (!$scope.isCreator()) return false;
            $http({
                    url: 'https://www.googleapis.com/youtube/v3/playlistItems',
                    method: 'DELETE',
                    params: {
                        id: video.id
                    },
                    headers: {
                        Authorization: 'Bearer ' + $scope.creator.google.accessToken
                    }
                })
                .success(function(res) {
                    var videosArr = $firebase(videosRef).$asArray();
                    videosArr.$loaded().then(function() {
                        videosArr.forEach(function(item) {
                            if (item.$value == video.videoId) {
                                var videoChildRef = fb.room.child($routeParams.id).child("videos").child(item.$id);
                                videoChildRef.remove();
                            }
                        })
                    })

                    $scope.player.addEventListener('onStateChange', reloadWhenDone);
                    $http({
                            url: 'https://www.googleapis.com/youtube/v3/playlistItems',
                            method: 'GET',
                            params: {
                                part: 'snippet',
                                playlistId: $scope.playlist[0].id,
                                maxResults: 50
                            },
                            headers: {
                                Authorization: 'Bearer ' + $scope.currentUser.google.accessToken
                            } //
                        })
                        .success(function(res) {
                            $scope.queue = res.items.map(function(item) {
                                return {
                                    title: item.snippet.title,
                                    id: item.id,
                                    status: 'non'
                                }
                            });
                            $scope.queue[$scope.player.getPlaylistIndex()].status = 'current';
                        });
                });
        }

/***** VOTING FUNCTIONS OMG THIS CONTROLLER IS SO LONG WHY DO I EXIST *****/
        $scope.increment = function(num) {
        	$scope.stacked[0].value += num;
        	$scope.stacked[1].value -= num;
        	currentRef.set({
		        	title: $scope.current.title,
		        	pos: $scope.stacked[0].value,
		        	neg: $scope.stacked[1].value
		        });
        }
    });

