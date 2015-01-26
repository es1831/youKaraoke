'use strict';

/**
 * @ngdoc service
 * @name youKaraokeApp.playlist
 * @description
 * # playlist
 * Factory in the youKaraokeApp.
 */
angular.module('youKaraokeApp')
  .factory('Playlist', function (fb, $firebase) {
    // Service logic
    var playlistRefStore;
    // Public API here
    return {
        setPlaylistAndCreator: function(roomId, playlist, creator) {
          var playlistRef = fb.room.child(roomId).child('playlist');
          playlistRef.set(playlist);
          var sync = $firebase(playlistRef);
          var obj = sync.$asObject();
          obj.$loaded().then(function() {
            playlistRefStore = obj;
            console.log("this is not undefined at all: ", obj);
          })
          // var creatorRef = fb.room.child(roomId).child('creator');
          // creatorRef.set(creator);
        },
        getPlaylist: function() {
          console.log("GETTING!" + playlistRefStore);
           return playlistRefStore;
        }
      }
    });
