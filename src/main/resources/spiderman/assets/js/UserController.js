/**
 * 
 */
BlogModule.service('UserService', function($http){
	var result = "HCD: not found";
		
	this.get = function(url){
		var promise = $http.post(url,null).success( function(response) {
			result = response;
			console.log(response);
		   });
		return promise;
	};
	
	this.getResult = function(){
		return result;
	};
	
});
BlogModule.controller('UserController', function($scope, UserService) {
	$scope.searchMe = function() {
		var url = "/api/dictionary/find/" + $scope.word;
		UserService.get(url).then(function() {
			$scope.result = UserService.getResult(); 
		});
	}
});