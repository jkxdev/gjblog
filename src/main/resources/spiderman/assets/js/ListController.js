
BlogModule.controller('ListController', ['$scope', 'SearchService', function($scope, SearchService) {
//	$scope.$on('loginEvent', function(event, data) {
//		if(data.event == 'searchResultsFetched') {
//			console.log('searchResultsFetched event recieved ; getting the results');
//			$scope.resultBlogs = SearchService.getResult(); 
//		}
//    });
	$scope.resultBlogs = SearchService.getResults(); 


}]);