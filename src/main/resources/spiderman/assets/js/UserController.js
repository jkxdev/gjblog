/**
 * 
 */
BlogModule.service('UserService', function($http,$rootScope){
	var result = "HCD: not found";
	var myBlogList;
	var sendMsg = function(message) {
		$rootScope.$broadcast('loginEvent', {event: message});
	}
	this.msgSendService = function(message){
		sendMsg(message);
	};	
	
	this.get = function(thisurl){
		$http({
			  method: 'POST',
			  url: thisurl,
			  data: null,
			  headers: { "id":localStorage.getItem("id"),
				   "tok":localStorage.getItem("tok"),
				   'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
				   
			})
			.success(function(response){
			myBlogList = response;
			console.log(response)
			sendMsg('favsFetched');
			})
			.error(function(response,status){
				alert(response.responseText);
				console.log('response erro code is ' + status + "; and the erro text is :\""+ response.responseText + "\"");
				if(401 == status) {
					sendMsg('loginFailed');
				}
			});
	};
	
	this.getBlogList = function(){
		return myBlogList;
	};
	
});
BlogModule.controller('UserController', ['$scope','HomeService','UserService','$location',
										function($scope, HomeService, UserService,$location) {
	$scope.$on('loginEvent', function(event, data) {
		var favList = [];
		var item_local = {link:"", title:""};
		if(data.event == 'favsFetched') {
			var favi = UserService.getBlogList();
			favi.forEach(function(item, index){
				console.log("blog entry : " + item);
				item_local.link = "\"" + item.blog_id + "\"";
				console.log("blog entr: ID : " + item_local); 
				item_local.title = item.blogTitle;
				favList.push(item_local);
			});
			$scope.Favs = favList;
		}
    });
	$scope.get_blog = function(blogid) {
		console.log("get blog called for " + blogid);
		$location.url("api/blog/" + blogid);
	}
	var load = function() {
		if(true == HomeService.isValidLogin()) {
			$('#blog-tags').tagsinput();
			console.log("UserController : blog-tags called to loag tags-input");
			UserService.get("api/blog/favorites/" + localStorage.getItem("id"));
		}
		else {
			UserService.msgSendService('authFailed');
			//$location.url('#');
		}
	}
	load();
}]);