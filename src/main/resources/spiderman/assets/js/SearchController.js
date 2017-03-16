BlogModule.service('SearchService', function($http){
	var result = "HCD: not found";
	var sendMsg = function(message) {
		$rootScope.$broadcast('loginEvent', {event: message});
	}
	this.msgSendService = function(message){
		sendMsg(message);
	};
	
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
BlogModule.controller('SearchController', function($scope, SearchService) {
	$scope.$on('loginEvent', function(event, data) {
		if(data.event == 'searchCalled') {
			console.log('searchCalled event recieved with : ' + data.payload);
			var url = "/api/blog/searchblogs/" + data.payload;
			SearchService.get(url).then(function() {
				$scope.result = SearchService.getResult(); 
			});
		}
    });

});