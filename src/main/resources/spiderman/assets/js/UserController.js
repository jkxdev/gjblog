/**
 * 
 */
BlogModule.service('UserService', ['$http','BakBakService',function($http, BakBakService){
	var result = "HCD: not found";
	var myBlogList;
//	var sendMsg = function(message) {
//		$rootScope.$broadcast('loginEvent', {event: message});
//	}
//	this.msgSendService = function(message){
//		sendMsg(message);
//	};	
	
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
			BakBakService.msgSendService('favsFetched');
			})
			.error(function(response,status){
				console.log('response erro code is ' + status + "; and the erro text is :\""+ response.responseText + "\"");
				if(401 == status) {
					BakBakService.msgSendService('loginFailed');
				}
			});
	};
	
	this.getBlogList = function(){
		var transData = $.map(Object , function (value, key) {
		    return [[key, value]];
		});
		console.log(myBlogList);
		return myBlogList;
	};
	
}]);
BlogModule.controller('UserController', ['$scope','HomeService','UserService','$location','BakBakService',
										function($scope, HomeService, UserService,$location,BakBakService) {
	
	
//	BlogModule.controller('UserController', ['$scope','HomeService','UserService','$location','ChatData',
//		function($scope, HomeService, UserService,$location) {
	$scope.MyChat = [];
	//var collection = [];
	var ws;
	$scope.$on('loginEvent', function(event, data) {
		var favList = [];
		if(data.event == 'favsFetched') {
			var favi = UserService.getBlogList();
			favi.forEach(function(item, index){
				var item_local = {link:"", title:""};
				item_local.link = "#/blog/get/" + item.blog_id;
				item_local.title = item.blogTitle;
				console.log("blog entry : " + item_local.link + " TITLE: " + item_local.title);
				favList.push(item_local);
			});
			$scope.Favs = favList;
		}
    });
	
	$scope.connectToChatserver = function()
    {
        if ("WebSocket" in window)
        {
           // Let us open a web socket
           ws = new WebSocket(BakBakService.getHomePath("ws") + "/chat");
			
           ws.onopen = function()
           {
              // Web Socket is connected, send data using send()
              ws.send("Message to send");
              console.log("Message is sent...");
           };
           
           ws.onmessage = function (evt) 
           { 
              var received_msg = evt.data; 
              console.log(received_msg);
              $scope.MyChat.push(received_msg);
              $scope.$digest();
              //$scope.MyChat = collection;
           };
			
           ws.onclose = function()
           { 
        	   console("Connection is closed..."); 
           };
        }
        
        else
        {
           // The browser doesn't support WebSocket
        	console("WebSocket NOT supported by your Browser!");
        }
    }
	
	$scope.$watch(function(scope) { return scope.MyChat },
			function(newValue, oldValue) {
				$scope.myMsg=null;
			}
			);
	
	$scope.get_blog = function(blogid) {
		console.log("get blog called for " + blogid);
		$location.url("api/blog/" + blogid);
	}
	var load = function() {
		if(true == HomeService.isValidLogin()) {
			$('#blog-tags').tagsinput();
			console.log("UserController : blog-tags called to loag tags-input");
			UserService.get("api/blog/favorites/" + localStorage.getItem("id"));
			$scope.connectToChatserver();
			//$scope.MyChat = ChatData;
			//$location.url($location.path());
		}
		else {
			BakBakService.msgSendService('authFailed');
			//$location.url('#');
		}
	}

	$scope.sendchat = function()	{
		var user = localStorage.getItem("id");
		console.log($scope.myMsg);
		console.log(user);
		
		if ($scope.myMsg != "") {
			ws.send("user: "+user+" message: "+$scope.myMsg);   
		} 
	}
	

	load();
	
	
}]);