/**
 * 
 */
BlogModule.service('BlogService', function($http,$rootScope){
	var s_sleep = function(miliseconds) {
		   var currentTime = new Date().getTime();

		   while (currentTime + miliseconds >= new Date().getTime()) {
		   }
		};
	this.sleep= function(milli) {
		s_sleep(milli);
	}
	var sendMsg = function(message) {
		$rootScope.$broadcast('loginEvent', {event: message});
	}
	this.msgSendService = function(message){
		sendMsg(message);
	};
	
	var myBlog;
	this.fetch_recent_blog = function() {
		$http({
			  method: 'POST',
			  url: 'http://localhost:8080/api/blog/recent',
			  data: null,
			  headers: { "id":localStorage.getItem("id"),
				   "tok":localStorage.getItem("tok"),
				   'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
				   
			})
			.success(function(response){
			myBlog = response;
			console.log(response)
			sendMsg('blogFetched');
			})
			.error(function(response,status){
				alert(response.responseText);
				console.log('response erro code is ' + status + "; and the erro text is :\""+ response.responseText + "\"");
				if(401 == status) {
					sendMsg('loginFailed');
				}
			});
//		var promise = $http.post('http://localhost:8080/api/blog/recent',null,{
//	        headers: { "id":localStorage.getItem("id"),
//					   "tok":localStorage.getItem("tok"),
//					   "contentType": "application/json;charset=utf-8"}})
//		.success(function(response){
//			myBlog = response;
//			console.log(response)
//			sendMsg('blogFetched');
//		})
//		.error(function(response,status){
//			alert(response.responseText);
//			console.log('response erro code is ' + status + "; and the erro text is :\""+ response.responseText + "\"");
//			if(401 == status) {
//				sendMsg('loginFailed');
//			}
//		});
	};
	this.getRecentBlog = function() {
		console.log("this is from the return function " + myBlog);
		return myBlog;
	};
});

BlogModule.controller("BlogController", function($scope, BlogService) {
	
	$scope.$on('loginEvent', function(event, data) {
		if(data.event == 'profileLoaded') {
			console.log('profileLoaded event recieved');
			fetch_recent_blog();
		}
		else if('blogFetched' == data.event) {
			console.log('blogFetched event recieved : ' + data.event);
			show_latest();
		}
		else {
			console.log('loginEvent recieved : ' + data.event);
		}
    });
	
	
	
	
	$scope.new_post = function() {
		console.log("new post request");
	}
	var load_last = function(){
		BlogService.fetch_recent_blog();	
	}
	
	var show_latest = function() {
		var rec_blog = BlogService.getRecentBlog();
		var paralist = [];
		console.log("blog : "+ rec_blog);
		//var rec_blog = JSON.parse(resp);
		console.log("rec_blog.blogTitle : " + rec_blog.blogTitle + " : blog_author : " + rec_blog.blogAuthorUsername);
		$scope.blog_title= rec_blog.blogTitle;
		$scope.blog_author = rec_blog.blogAuthorUsername;
		var timestamp = parseInt(rec_blog.blogTimestamp);
		var d = new Date();
		d.setTime(timestamp);
		
		$scope.blog_posted = "Posted on " +  d.toString();
		$("#blog-posted").prepend("<span class=\"glyphicon glyphicon-time\"></span>");
		var bodydata = rec_blog.blogContent.split("\n");
		if(bodydata.length > 0 ) {
			//$("#section-blog-content").empty();
			console.log("length : "+ bodydata.length);
			bodydata.forEach(function(item, index){
			//add the para div
				console.log("[para] : " + item);
				//$("#section-blog-content").append("<p " + ((index == 0)?" class=\"lead\" ":"") + ">" + item + "</p>");
				if(0 == index){
					$scope.first_para = item;
				}else {
					paralist.push(item);
				}
			});
			console.log("paralist = " + paralist);
			$scope.paras= paralist;
			var myEl = angular.element( document.querySelector( "#section-blog-content" ) );
			myEl.addClass('alpha');
		}	

	};
	load_last();
});