/**
 * 
 */
BlogModule.service('PostService', function($http,$rootScope){
	var result = "HCD: not found";
	var myBlog;
	var sendMsg = function(message) {
		$rootScope.$broadcast('loginEvent', {event: message});
	}
	this.msgSendService = function(message){
		sendMsg(message);
	};
	
	this.save_entry= function(blogform) {
		console.log("save_blog called" + blogform);
		$http({
			method: 'POST',
			url : 'http://localhost:8080/api/blog/',
			data: blogform,
			headers: {'id':localStorage.getItem("id"),
					  'tok':localStorage.getItem("tok"),
					  'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
		})
		.success(function(response) {
			myBlog = response;
			console.log(response)
			sendMsg('blogPosted');
		})
		.error(function(response,status){
			alert(response.responseText);
			console.log('response erro code is ' + status + "; and the erro text is :\""+ response.responseText + "\"");
			if(401 == status) {
				sendMsg('authFailed');
			}
		});
	};
});
BlogModule.controller('PostController', ['$scope','HomeService','PostService','$location',
										function($scope, HomeService, PostService,$location) {
	
	var load = function() {
		if(true == HomeService.isValidLogin()) {
			$('#blog-tags').tagsinput();
		}
		else {
			PostService.msgSendService('authFailed');
			//$location.url('#');
		}
	}
	$scope.save_blog = function(){
		$scope.postData.blogAuthorUsername = localStorage.getItem("id");
		$scope.postData.blogAreaOfInterest = $('#blog-tags').val();
		PostService.save_entry($scope.postData);
	}
	load();
}]);
