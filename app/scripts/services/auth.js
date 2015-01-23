'use strict';

/**
 * @ngdoc service
 * @name youKaraokeApp.auth
 * @description
 * # auth
 * Service in the youKaraokeApp.
 */
angular.module('youKaraokeApp')
    // AngularJS will instantiate a singleton by calling "new" on this 
.factory('auth', function(localStorageService){

	var CurrentUser;

	return {

	setCurrentUser : function(userData){
    	CurrentUser = {
    		data:userData,
    		role: "user"
    	}
    	localStorageService.set('user', CurrentUser);

    	console.log('user set:', CurrentUser);
    },

    getCurrentUser : function(){
    	CurrentUser = localStorageService.get('user');
    	return CurrentUser;
    },

    setAdmin : function(){
    	CurrentUser.role = "admin";
    },
    
    isAdmin : function() {
        return CurrentUser.role === 'admin';
      }

	}
})
