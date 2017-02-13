function get_recent_blog() {
	$.ajax({
		type : 'post',
		url : 'http://localhost:8080/api/blog/recent',
		headers: {
			"id":localStorage.getItem("id"),
			"tok":localStorage.getItem("tok")
		},
		contentType: "application/json;charset=utf-8",
		success: function(output, status, xhr) {
			console.log("success in the respomse : "+ output);
			//alert( "output: " +output);
			fill_blog(output);
		},
		error : function(xhr, ajaxOptions, thrownError) {
			console.log("error in the respomse : "+ xhr.responseText);
			if(401 == xhr.status) {
				if("not_logged_in" == xhr.getResponseHeader('userstat')) {
					relogin();
				}
				
			}
		}
	});
}
function get_blogform_data(){
	return JSON.stringify({
		blogTitle:$('#blog-title').val(),
		blogContent:$('#blog-content').val(),
		blogAuthorUsername:localStorage.getItem("id"),
		//blogAreaOfInterest:$('#blog-tags').tagsinput('items')
		blogAreaOfInterest:$('#blog-tags').val()
	});
}
function save_blog() {
	console.log("save_blog called");
	daaaa = get_blogform_data();
	console.log("form data being sent : " +daaaa);
	$.ajax({
		type : 'post',
		url : 'http://localhost:8080/api/blog/',
		data: get_blogform_data(),
		headers: {"id":localStorage.getItem("id"),
				  "tok":localStorage.getItem("tok")},
		contentType: "application/json;charset=utf-8",

		success: function(output, status, xhr) {
			console.log( "output: " +output);
			console.log( "status:" +status);
			console.log( "xhr.responseText: " + xhr.responseText);
			//window.location="home.html";
		},
		error : function(xhr, ajaxOptions, thrownError) {
			alert(xhr.responseText);
			if(401 == xhr.status) {
				if("not_logged_in" == xhr.getResponseHeader('userstat')) {
					relogin();
				}
				
			}
		}
	});
}

function fav_blogs() {
	console.log("fav_blogs called");
	$.getJSON( "http://localhost:8080/api/blog/favorites/", function( data ) {
		console.log( "output: " +data);
	}).fail(function(jqXHR) {
		alert(jqXHR.responseText);
		if(401 == jqXHR.status) {
			if("not_logged_in" == jqXHR.getResponseHeader('userstat')) {
				relogin();
			}
		}
	});
	
//	$.ajax({
//		type : 'get',
//		url : 'http://localhost:8080/api/blog/favorites/',
//		headers: {"id":localStorage.getItem("id"),
//				  "tok":localStorage.getItem("tok")},
//		contentType: "application/json;charset=utf-8",
//
//		success: function(output, status, xhr) {
//			console.log( "output: " +output);
//			console.log( "status:" +status);
//			console.log( "xhr.responseText: " + xhr.responseText);
//			//window.location="home.html";
//		},
//		error : function(xhr, ajaxOptions, thrownError) {
//			alert(xhr.responseText);
//			if(401 == xhr.status) {
//				if("not_logged_in" == xhr.getResponseHeader('userstat')) {
//					relogin();
//				}
//				
//			}
//		}
//	});
}

// 	$('#save-blog').click(function() {
// 		$.ajax({
// 			type : 'post',
// 			url : 'http://localhost:8080/api/blog/',
// 			data: '{"blogTitle": "' + $('#blogtitle').val() +
// 				  '","blogContent":"' + $('#blogcontent').val() +
// 				  '","blogAuthorUsername":"' + localStorage.getItem("ls-username") +
// 				  '","blogAreaOfInterest":"' +$('#areaofinterest').val()+
// 				  '"}',
// 			headers: {
// 				"id":localStorage.getItem("ls-id"),
// 				"token":localStorage.getItem("ls-token")
// 				},
// 			contentType: "application/json;charset=utf-8",
//
// 			success: function(output, status, xhr) {
// 				alert( "output: " +output);
// 				alert( "status:" +status);
// 				alert( "xhr.responseText: " +xhr.responseText);
// //				var a = JSON.parse(xhr.responseText);
// //				alert("After parse:"+a.id)
// //				localStorage.setItem("ls-id", a.id);
// //				alert("From local storage: "+localStorage.getItem("ls-id"))
// 				window.location="home.html";
// 			},
// 			error : function(xhr, ajaxOptions, thrownError) {
// 				alert(xhr.responseText);
// 			}
// 		});
// 	});
	
//$('#logout').click(function() {
//
//	$.ajax({
//		type : 'post',
//		url : 'http://localhost:8080/api/user/logout',
//		data: '{"id": "' + localStorage.getItem("ls-id") + '","token":"' + localStorage.getItem("ls-token") + '"}',
//		contentType: "application/json;charset=utf-8",
//		success: function(output, status, xhr) {
//			var a = JSON.parse(xhr.responseText);
//			localStorage.setItem("ls-id", "");
//			localStorage.setItem("ls-username", "");
//			localStorage.setItem("ls-fullName", "");
//			localStorage.setItem("ls-phno", "");
//			localStorage.setItem("ls-areaofinterest", "");
//			localStorage.setItem("ls-token", "");
//			window.location="index.html";
//		},
//		error : function(xhr, ajaxOptions, thrownError) {
//			localStorage.setItem("ls-id", "");
//			localStorage.setItem("ls-username", "");
//			localStorage.setItem("ls-fullName", "");
//			localStorage.setItem("ls-phno", "");
//			localStorage.setItem("ls-areaofinterest", "");
//			localStorage.setItem("ls-token", "");
//			window.location="index.html";
//		}
//	});
//});
