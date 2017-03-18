/**
 * 
 */
BlogModule.service('UserService', ['$http','BakBakService',function($http, BakBakService){
	var result = "HCD: not found";

	var userData;
	this.fetchUserData = function(){
		$http({
			  method: 'POST',
			  url: "/api/user/getinfo",
			  data: null,
			  headers: { "id":localStorage.getItem("id"),
				   "tok":localStorage.getItem("tok"),
				   'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
				   
			})
			.success(function(response){
				userData = response;
				console.log(response)
				BakBakService.msgSendService('userDataFetched');
			})
			.error(function(response,status){
				console.log('response erro code is ' + status + "; and the erro text is :\""+ response.responseText + "\"");
				if(401 == status) {
					BakBakService.msgSendService('loginFailed');
				}
			});
	};
	this.UpdateUserData = function(user){
		$http({
			  method: 'POST',
			  url: "/api/user/profileupdate",
			  data: user,
			  headers: { "id":localStorage.getItem("id"),
				   "tok":localStorage.getItem("tok"),
				   'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
				   
			})
			.success(function(response){
				userData = response;
				console.log(response)
				BakBakService.msgSendService('userDataFetched');
			})
			.error(function(response,status){
				console.log('response erro code is ' + status + "; and the erro text is :\""+ response.responseText + "\"");
				if(401 == status) {
					BakBakService.msgSendService('loginFailed');
				}
			});
	};
	
	this.getUserData = function() {
		return userData;
	};
	
}]);

BlogModule.controller('UserController', ['$scope','HomeService','UserService','BakBakService',
										function($scope, HomeService, UserService,BakBakService) {
	
	var ws;
	$scope.$on('loginEvent', function(event, data) {
		if(data.event == 'userDataFetched') {
			$scope.regData = UserService.getUserData();
			//$("#blog-tags").attr("value", $scope.regData.areaofinterest);
			$("#blog-tags").val($scope.regData.areaofinterest);
			console.log($scope.regData.areaofinterest);
			$('#blog-tags').tagsinput();
		}
    });
	var load = function() {
		if(true == HomeService.isValidLogin()) {
			UserService.fetchUserData();
		}
		else {
			BakBakService.msgSendService('authFailed');
			//$location.url('#');
		}
	}
	$scope.UpdateProfile = function(){
		UserService.UpdateUserData($scope.regData);
	}
	load();
	
	
}]);