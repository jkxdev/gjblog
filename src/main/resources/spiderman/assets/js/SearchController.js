BlogModule.service('SearchService', ['$http','BakBakService',function($http, BakBakService){
	var result = "HCD: not found";
	var myBlogs;
//	var sendMsg = function(message) {
//		$rootScope.$broadcast('loginEvent', {event: message});
//	}
//	this.msgSendService = function(message){
//		sendMsg(message);
//	};
	this.get = function(qUrl) {
		$http({
			  method: 'POST',
			  url: qUrl,
			  data: null,
			  headers: { "id":localStorage.getItem("id"),
				   "tok":localStorage.getItem("tok"),
				   'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
				   
			})
			.success(function(response){
				myBlogs = response;
				console.log(response)
				BakBakService.msgSendService('searchResultsFetched');
			})
			.error(function(response,status){
				console.log('response erro code is ' + status + "; and the erro text is :\""+ response.responseText + "\"");
				if(401 == status) {
					BakBakService.msgSendService('loginFailed');
				}
			});
	};

	
	this.getResults = function(){
		return myBlogs;
	};
}]);
BlogModule.controller('SearchController', ['$scope', 'SearchService', 'HomeService','$location','BakBakService', function($scope, SearchService, HomeService,$location,BakBakService) {
	$scope.$on('loginEvent', function(event, data) {
		if(data.event == 'searchResultsFetched') {
			console.log('searchResultsFetched event recieved ; swithing the blog list view');
			$location.url('blog/list');
		}
    });
	
	
	$scope.search_blogs = function() {
		console.log("search_blogs called with : " + $scope.searchText);
		if(HomeService.isValidLogin() == true) {
			var url = BakBakService.getHomePath() + '/api/blog/searchblogs/' + $scope.searchText;
			SearchService.get(url);
		}
	}

}]);