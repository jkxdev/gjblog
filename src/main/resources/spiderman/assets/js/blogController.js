/**
 * 
 */
BlogModule.service('BlogService', ['$http','BakBakService',function($http,BakBakService){
	var s_sleep = function(miliseconds) {
	   var currentTime = new Date().getTime();

	   while (currentTime + miliseconds >= new Date().getTime()) {
	   }
	};
	this.sleep= function(milli) {
		s_sleep(milli);
	}

	var favBlogList;
	this.fetchFavsBlogList = function(thisurl){
		$http({
			  method: 'POST',
			  url: thisurl,
			  data: null,
			  headers: { "id":localStorage.getItem("id"),
				   "tok":localStorage.getItem("tok"),
				   'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
				   
			})
			.success(function(response){
				favBlogList = response;
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
	
	this.getFavsBlogList = function(){
		console.log(favBlogList);
		return favBlogList;
	};
	
	var myBlog;
	this.fetch_blog = function(searchBlogId) {
		$http({
			  method: 'POST',
			  url:  BakBakService.getHomePath() + '/api/blog/' + searchBlogId,
			  data: null,
			  headers: { "id":localStorage.getItem("id"),
				   "tok":localStorage.getItem("tok"),
				   'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
				   
			})
			.success(function(response){
				myBlog = response;
				console.log(response)
				BakBakService.msgSendService('blogFetched');
			})
			.error(function(response,status){
				console.log('response erro code is ' + status + "; and the erro text is :\""+ response.responseText + "\"");
				if(401 == status) {
					BakBakService.msgSendService('loginFailed');
				}
			});
	};
	this.post_new_comment = function(blog_id,blogCommentPosted) {
		$http({
			  method: 'POST',
			  url:  BakBakService.getHomePath() + '/api/blog/comment/' + blog_id,
			  data: blogCommentPosted,
			  headers: { "id":localStorage.getItem("id"),
				   "tok":localStorage.getItem("tok"),
				   'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
				   
			})
			.success(function(response){
				myBlog = response;
				console.log(response)
				BakBakService.msgSendService('blogFetched');
			})
			.error(function(response,status){
				console.log('response erro code is ' + status + "; and the erro text is :\""+ response.responseText + "\"");
				if(401 == status) {
					BakBakService.msgSendService('loginFailed');
				}
			});
	};
	this.getRecentBlog = function() {
		console.log("this is from the return function " + myBlog);
		return myBlog;
	};
}]);

BlogModule.controller("BlogController", function($scope, $routeParams, BlogService) {
	
	$scope.$on('loginEvent', function(event, data) {
		if(data.event == 'profileLoaded' || data.event == 'blogPosted') {
			console.log('profileLoaded event recieved');
			BlogService.fetch_blog("latest");
		}
		else if('blogFetched' == data.event) {
			console.log('blogFetched event recieved : ' + data.event);
			show_blog();
		}
		else {
			console.log('loginEvent recieved : ' + data.event);
		}
    });
	
	$scope.new_post = function() {
		console.log("new post request");
	}
	var load_blog = function(){
		console.log("load_blog: blogid is : " + $routeParams.blogId);
		BlogService.fetch_blog($routeParams.blogId);	
	}
	var rec_blog;
	var show_blog = function() {
		rec_blog = BlogService.getRecentBlog();
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
		//update the content
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
		//update comments
//		if(rec_blog.comments.length >0) {
//			rec_blog.comments.foreach(comment, index){
//				
//			}
//		}
		$scope.commentData=rec_blog.comments;
	};
	$scope.PostComment = function(){
		blogCommentPosted = "{\"commentAuthorUsername\":\""+ localStorage.getItem("id") +
							"\",\"commentText\":\"" + $scope.nCommentText + "\"}";
	
		BlogService.post_new_comment(rec_blog.blog_id,blogCommentPosted);
	}
	load_blog();
});

BlogModule.controller('favsController', ['$scope','$location','BakBakService','BlogService','HomeService', function($scope,$location,BakBakService,BlogService,HomeService) {

	$scope.$on('loginEvent', function(event, data) {
		var favList = [];
		if(data.event == 'favsFetched') {
			var favi = BlogService.getFavsBlogList();
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
	$scope.get_blog = function(blogid) {
		console.log("get blog called for " + blogid);
		$location.url("api/blog/" + blogid);
	}
	var load_favourites = function() {
		if(true == HomeService.isValidLogin()) {
			BlogService.fetchFavsBlogList("api/blog/favorites/" + localStorage.getItem("id"));
		}
		else {
			BakBakService.msgSendService('authFailed');
			// $location.url('#');
		}
	}
	load_favourites();
}]);
	