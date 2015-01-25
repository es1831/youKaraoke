'use strict';

angular.module('youKaraokeApp')
    .controller('RoomCtrl', function($scope, $http, auth, localStorageService, $routeParams, $location, fb) {
        localStorageService.set("lastsite", $routeParams.id);
        if (!auth.getCurrentUser()) {
            $location.path('/main');
        }
        $scope.currentUser = auth.getCurrentUser();
        $scope.users = [];

        //CREATOR
        var creatorRef = fb.room.child($routeParams.id).child("creator");

        creatorRef.on('value', function(dataSnapshot) {
            localStorageService.set("creator", dataSnapshot.val());
        })

        $scope.creator = JSON.parse(localStorage["ls.creator"]);

        $scope.isCreator = function() {
            if ($scope.creator.uid === $scope.currentUser.uid) {
                return true;
            } else {
                return false;
            }
        }

        //PLAYLIST

        var playlistRef = fb.room.child($routeParams.id).child("playlist");

        playlistRef.on('value', function(dataSnapshot) {
            localStorageService.set("playlist", dataSnapshot.val());
            console.log("this is a playlist: ", localStorage["ls.playlist"]);
        })

        $scope.playlist = JSON.parse(localStorage["ls.playlist"]);

        console.log("this outsdie: ", $scope.playlist);




        //ASYNC ISSUES
        //
        //
        //

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
        	console.log("Videos been added ", dataSnapshot.val());
            $http({
                    url: 'https://www.googleapis.com/youtube/v3/videos',
                    method: 'GET',
                    params: {
                        part: 'snippet',
                        id: dataSnapshot.val(),
                        maxResults: 4
                    },
                    headers: {
                        Authorization: 'Bearer ' + $scope.currentUser.google.accessToken
                    }
                })
                .success(function(res) {
                    $scope.queue2 = res;
                    console.log("fuck this: ", $scope.queue2.items[0].snippet.title);
                });	
        });


        



        //USERS
        var usersRef = fb.room.child($routeParams.id).child("users");


        usersRef.on('child_added', function(dataSnapshot) {
            console.log("CHILD ADDED TO USERS", dataSnapshot.val().google.displayName);
            if ($scope.users.indexOf(dataSnapshot.val().google.displayName) === -1) {
                $scope.$apply(function() {
                    $scope.users.push(dataSnapshot.val().google.displayName);
                    usersRef.push($scope.currentUser);
                })
            }
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
        $scope.queue;
        $scope.youTubeIframeAPIReady = false;
        window.onYouTubeIframeAPIReady = runWhenAPIReady;

        if (window.YT) runWhenAPIReady();

        function runWhenAPIReady() {
            $scope.youTubeIframeAPIReady = window.youTubeIframeAPIReady = true;
            $scope.player = new YT.Player('player', {
                playerVars: {
                    autoplay: 0
                },
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
                list: $scope.playlist[0].id // whatever the playlist id actually is
            });
            // evt.target.playVideo();
            $http({
                    url: 'https://www.googleapis.com/youtube/v3/playlistItems',
                    method: 'GET',
                    params: {
                        part: 'snippet',
                        playlistId: $scope.playlist[0].id, // whatever the playlist id actually is
                        maxResults: 50
                    },
                    headers: {
                        Authorization: 'Bearer ' + $scope.currentUser.google.accessToken
                    }
                })
                .success(function(res) {
                    console.log(res);
                    $scope.queue = res.items.map(function(item) {
                        return {
                            title: item.snippet.title,
                            id: item.id,
                            status: 'non'
                        }
                    });
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
                // shhhhhh it's going to be okay
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
            $scope.query = "";
            $http({
                    url: 'https://www.googleapis.com/youtube/v3/search',
                    method: 'GET',
                    params: {
                        part: 'snippet',
                        q: 'karaoke ' + query,
                        maxResults: 4
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
        var reloadWhenDone = function(evt) {
            if (evt.data == 0) {
                // don't even look at me
                console.log("WE MADE IT HEREREERERER");
                if (typeof $scope.player.getPlaylistIndex() !== 'undefined') {
                    index = $scope.player.getPlaylistIndex();
                    $scope.player.loadPlaylist({
                        listType: 'playlist',
                        list: $scope.playlist[0].id, // whatever the playlist id actually is
                        index: index
                    });
                }
                $scope.player.removeEventListener('onStateChange', reloadWhenDone);
            }
        }

        $scope.addToPlaylist = function(videoId) {
        	videosRef.push(videoId);
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
                    
                    $scope.player.addEventListener('onStateChange', reloadWhenDone);
                    
                    $http({
                            url: 'https://www.googleapis.com/youtube/v3/playlistItems',
                            method: 'GET',
                            params: {
                                part: 'snippet',
                                playlistId: $scope.playlist[0].id, // whatever the playlist id actually is
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
	                                    status: 'non'
	                                }
	                            });
                            $scope.queue[$scope.player.getPlaylistIndex()].status = 'current';
                        });
                        
                });
        };

        $scope.removeFromPlaylist = function(id) {
            $http({
                    url: 'https://www.googleapis.com/youtube/v3/playlistItems',
                    method: 'DELETE',
                    params: {
                        id: id
                    },
                    headers: {
                        Authorization: 'Bearer ' + $scope.creator.google.accessToken
                    }
                })
                .success(function(res) {
                    $scope.player.addEventListener('onStateChange', reloadWhenDone);
                    $http({
                            url: 'https://www.googleapis.com/youtube/v3/playlistItems',
                            method: 'GET',
                            params: {
                                part: 'snippet',
                                playlistId: $scope.playlist[0].id, // whatever the playlist id actually is
                                maxResults: 50
                            },
                            headers: {
                                Authorization: 'Bearer ' + $scope.currentUser.google.accessToken
                            }
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
    });