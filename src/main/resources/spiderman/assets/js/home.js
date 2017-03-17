var BlogModule = angular.module('Blog-App', ['ngRoute','ngWebSocket']);

BlogModule.service('BakBakService', ['$http','$rootScope','$location',function($http,$rootScope,$location){
	this.getHomePath = function(prot="http") {
		var homePath = prot + '://'+ $location.host() + ':' + $location.port();
		console.log('BakBakService.getHomePath : returns :',homePath);
		return homePath;
	}
	
	this.msgSendService = function(message,data=""){
		//sendMsg(message,data);
		console.log("sending message : "  + message);
		$rootScope.$broadcast('loginEvent', {event: message,payload:data});
	};
}]);

	
BlogModule.service('HomeService', ['$http','BakBakService',function($http, BakBakService){
	var sleep = function(miliseconds) {
	   var currentTime = new Date().getTime();

	   while (currentTime + miliseconds >= new Date().getTime()) {
	   }
	};
	
	this.register = function(rData) {
		var retVal = false;
		var promise = $http.post(BakBakService.getHomePath() + '/api/user/registeration',rData)
		.success(function(response){
			setlogin_session(response);
			BakBakService.msgSendService('loggedIn');
		})
		.error(function(response) {
			console.log("register ERROR: " + response.responseText);
			BakBakService.msgSendService('loginFailed');
		});
		return retVal;
	};
	this.login = function(lData) {
		var retVal = false;
		var promise = $http.post(BakBakService.getHomePath() + '/api/user/login',lData)
		.success(function(response){
			setlogin_session(response);
			BakBakService.msgSendService('loggedIn');
		})
		.error(function(response) {
			alert("Username of password invalid");
			BakBakService.msgSendService('loginFailed');
		});
		return true;
	}


	this.clearlogin_session = function() {
		// Check browser support
		if (typeof(Storage) !== "undefined") {
		    // Store
			localStorage.removeItem("id"); 
			localStorage.removeItem("tok");
			console.log("login session cleared");
		} else {
			console.log("clearlogin_session : error:Sorry, your browser does not support Web Storage...");
		}
	};

	this.isValidLogin = function() {
		/*should change this to the server query to validate the token later*/
//		if("id" in localStorage){
		console.log(localStorage.getItem("id"));
		if((null != localStorage.getItem("tok")) && ("undefined" != localStorage.getItem("tok")) &&
		   (null != localStorage.getItem("id")) && ("undefined" != localStorage.getItem("id"))){
			console.log("isvalid login : TRUE");
			return true;
		}
		else {
			console.log("isvalid login : FALSE");
			return false;
		}
	};
	this.getpass = function(str){
		var stringpass= 'pwd' + CryptoJS.SHA256(str);
		console.log("passed : " + str + ", Returned : " + stringpass);
		return stringpass;
	};

	this.getlogin_session = function() {
		return {id:localStorage.getItem("id"),
				tok:localStorage.getItem("tok")};
	};

	var setlogin_session = function(response){ 
		var ssnData = JSON.parse(window.atob(response));
		console.log("decoded : " + ssnData);
		// Check browser support
		if (typeof(Storage) !== "undefined") {
		    // Store
			localStorage.setItem("id", ssnData.name);
			localStorage.setItem("tok", ssnData.tok);
			console.log("login session stored for \""+ ssnData.name + "\"");
		} else {
			alert ("error:Sorry, your browser does not support Web Storage...");
		}
	};

}]);

BlogModule.controller("HomeController", ['$scope','HomeService','$location','BakBakService',function($scope, HomeService, $location,BakBakService) {
	$scope.logstat='loggedout';
	$scope.profile_login = function($lDat){
		$lDat.pwd = HomeService.getpass($lDat.pwd);
		console.log("profile_login: called with " + $lDat.pwd + " username : " + $lDat.username);
		var ret = HomeService.login($lDat);
		if(ret != true){
			console.log("login failed");
		}
	}
	$scope.$on('loginEvent', function(event, data) {
		if(data.event == 'loggedIn') {
			load_profile();
		}
		else if(data.event == 'loginFailed' || 'authFailed' == data.event) {
			console.log(data.event + ": event recived");
			unload_profile();
			$location.url('');
		}
		else if('profileLoaded' == data.event || data.event == 'blogPosted'){
			console.log("profile.loaded event recievd");
			$location.url('blog/get/latest');
			
		}
		else {
			console.log('loginEvent recieved : ' + data.event);
		}
    });
	$scope.profile_register = function($rDat){
		$rDat.pwd = HomeService.getpass($rDat.pwd);
		console.log("profile_register: called with " + $rDat);
		var ret = HomeService.register($rDat);
		if(ret == true) {
			load_profile();
		} 
		else {
			console.log("Registration failed");
		}
	};

	$scope.profile_logout = function(){
		console.log("Logging out");
		unload_profile();
		$location.url('');
	};
	
	$scope.load_if_loggedin = function() {
		load_profile();
	}
	
	var load_profile = function(){
		if(true == HomeService.isValidLogin()) {
			console.log("Logged in: loading profile");
			$scope.logstat='loggedin';
			$("#loginstat").text(HomeService.getlogin_session().id);
			$("#loginstat").prepend('<i class="fa fa-user fa-lg"></i> &nbsp;');
			$("#loginstat").append('<span class="caret"></span>');
			console.log("loading profile complete");
			BakBakService.msgSendService("profileLoaded");
			return true;
		}
		else {
			console.log("load_profile: session invalid");
			$scope.logstat='loggedout';
			return false;
		}
	};

	var unload_profile = function() {
		console.log("Unloading profile");
		HomeService.clearlogin_session();
		$scope.logstat ='loggedout';
		$("#loginstat").text('');
		$("#loginstat").prepend('<i class="fa fa-user-times fa-lg"></i>');
		$("#loginstat").append('<span class="caret"></span>');	
	};
	
	load_profile();
}]);


BlogModule.config(function($routeProvider,$locationProvider) {
	$routeProvider.when('/blog/list', {
		templateUrl : 'section-list.html',
		controller : 'ListController'
	}).when('/blog/get/:blogId', {
		templateUrl : 'section-blog.html',
		controller : 'BlogController'
	}).when('/blog/new', {
		templateUrl : 'new-post.html',
		controller : 'PostController'
	}).when('/user/update', {
		templateUrl : 'update-user.html',
		controller : 'UserController'
	}).when('/blog/search', {
		templateUrl : 'section-list.html'//,
		//controller : 'SearchController'
	}).otherwise({
		templateUrl : 'login.html'
	});
	//$locationProvider.html5Mode(true);
});

BlogModule.factory('ChatData','$websocket', '$location', function($websocket,$location) {
    // Open a WebSocket connection
	var chatpath  = 'ws://' + $location.host() + '/chat';
	console.log(chatpath);
    var dataStream = $websocket(chatpath);

    var collection = [];

    dataStream.onMessage(function(message) {
      collection.push(JSON.parse(message.data));
    });

    var methods = {
      collection: collection,
      get: function() {
        dataStream.send(JSON.stringify({ action: 'get' }));
      }
    };

    return methods;
});