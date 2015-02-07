'use strict';

/**
 * @ngdoc function
 * @name youKaraokeApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the youKaraokeApp
 */
 angular.module('youKaraokeApp')
 .controller('MainCtrl', function ($scope, $location, fb, auth) {

 	$scope.login = function(){
 		fb.ref.authWithOAuthPopup("google", function(error, authData) {
 			if (error) {
 				console.log("Login Failed!", error);
 			} else {
 				console.log("Authenticated successfully with payload:", authData);
 				auth.setCurrentUser(authData);
 				if(localStorage["ls.lastsite"]){
 					$location.path('/room/'+localStorage["ls.lastsite"]);
 					$scope.$apply();
 				}
 				else{
 					$location.path('/create');
 					$scope.$apply();
 				}
 			}
 		},{
 			scope: "https://www.googleapis.com/auth/youtube, https://www.googleapis.com/auth/plus.login"
 		});
 	}	
 	console.log(localStorage["ls.lastsite"]);
});
