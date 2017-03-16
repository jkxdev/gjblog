var BlogModule = angular.module('Blog-App', ['ngRoute','ngWebSocket']);
BlogModule.service('HomeService', function($http,$rootScope){
	var sleep = function(miliseconds) {
	   var currentTime = new Date().getTime();

	   while (currentTime + miliseconds >= new Date().getTime()) {
	   }
	};
	var sendMsg = function(message,data="") {
		console.log("sending message : ",message);
		$rootScope.$broadcast('loginEvent', {event: message,payload:data});
	}
	this.msgSendService = function(message,data=""){
		sendMsg(message,data);
	};
	
	this.register = function(rData) {
		var retVal = false;
		var promise = $http.post('http://localhost:8080/api/user/registeration',rData)
		.success(function(response){
			setlogin_session(response);
			sendMsg('loggedIn');
		})
		.error(function(response) {
			alert(response.responseText);
			sendMsg('loginFailed');
		});
		return retVal;
	};
	this.login = function(lData) {
		var retVal = false;
		var promise = $http.post('http://localhost:8080/api/user/login',lData)
		.success(function(response){
			setlogin_session(response);
			sendMsg('loggedIn');
		})
		.error(function(response) {
			alert("Username of password invalid");
			sendMsg('loginFailed');
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
			alert ("error:Sorry, your browser does not support Web Storage...");
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

});

BlogModule.controller("HomeController", ['$scope','HomeService','$location',function($scope, HomeService, $location) {
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
			$location.url('api/blog/latest');
			
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
	};
	
	$scope.search_blogs = function() {
		console.log("search_blogs called with : " + $scope.searchText);
		if(HomeService.isValidLogin() == true) {
			$location.url('blog/search');
			HomeService.msgSendService("searchCalled", $scope.searchText);
		}
	}
	
	var load_profile = function(){
		if(true == HomeService.isValidLogin()) {
			console.log("Logged in: loading profile");
			$scope.logstat='loggedin';
			$("#loginstat").text(HomeService.getlogin_session().id);
			$("#loginstat").prepend('<i class="fa fa-user fa-lg"></i> &nbsp;');
			$("#loginstat").append('<span class="caret"></span>');
			console.log("loading profile complete");
			HomeService.msgSendService("profileLoaded");
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
//		$("#profile-drop").empty();
//		$("#profile-drop").append('<li id="in-out"><a href="#"><span class="glyphicon glyphicon-user"></span>&nbsp; &nbsp; Login/Register</span></a></li>');
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
		//controller : 'ListController'
	}).when('/api/blog/latest', {
		templateUrl : 'section-blog.html',
		controller : 'BlogController'
	}).when('/blog/new-post', {
		templateUrl : 'new-post.html',
		controller : 'PostController'
	}).when('/user/update', {
		templateUrl : 'update-user.html',
		controller : 'UserController'
	}).when('/blog/search', {
		templateUrl : 'section-list.html',
		controller : 'SearchController'
	}).otherwise({
		templateUrl : 'login.html'
	});
	$locationProvider.html5Mode(true);
});