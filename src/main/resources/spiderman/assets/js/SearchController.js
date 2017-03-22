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
			BakBakService.msgSendService('newSearchRequested');
		}
	}

}]);
BlogModule.controller('ListController', ['$scope', 'SearchService', function($scope, SearchService) {
	var blogLoadStatus = "NOT_LOADED";
	$scope.$on('loginEvent', function(event, data) {
		if(data.event == 'newSearchRequested') {
			console.log('searchResultsFetched event recieved ; getting the results');
			if(blogLoadStatus == "LOADED") {
				$scope.resultBlogs = {};
				blogLoadStatus = "RESET";
			}
		}
		else if(data.event == 'searchResultsFetched') {
			console.log('searchResultsFetched event recieved ; swithing the blog list view');
			if(blogLoadStatus == "RESET") {
				loadResultBLogs();
			}
		}	
	});
	var loadResultBLogs = function() {
		var blogList = [];
		var blogi = SearchService.getResults();
		blogi.forEach(function(item, index){
			var item_local = {link:"", title:"",content:""};
			item_local.link = "#/blog/get/" + item.blog_id;
			item_local.title = item.blogTitle;
			item_local.content = item.blogContent;
			console.log("blog entry : " + item_local.link + " TITLE: " + item_local.title);
			blogList.push(item_local);
		});
		$scope.resultBlogs = blogList;
		blogLoadStatus = "LOADED";
	};
	loadResultBLogs();
}]);