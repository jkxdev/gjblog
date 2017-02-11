$(document).ready(function() {
	$("#header").load("header.html",function() {
	    load_profile();
	});
	$("#footer").load("footer.html"); 

	$("#section-blog").hide();
	$("#section-list").hide();
	$("#section-form").hide();
	
	console.log("document .ready loaded the contents and hid the divs");
	
	console.log("session logged in status " + isValidLogin());
	
});

function setlogin_session(ssnData){ 
	// Check browser support
	if (typeof(Storage) !== "undefined") {
	    // Store
		localStorage.setItem("id", ssnData.name);
		localStorage.setItem("tok", ssnData.tok);
		console.log("login session stored for \""+ ssnData.name + "\"");
	} else {
		alert ("error:Sorry, your browser does not support Web Storage...");
	}
}
function relogin() {
	unload_profile();
	$('#loginModal').modal('toggle');
}
function getlogin_session() {
	return {id:localStorage.getItem("id"),
			tok:localStorage.getItem("tok")};
}

function clearlogin_session() {
	// Check browser support
	if (typeof(Storage) !== "undefined") {
	    // Store
		localStorage.removeItem("id"); 
		localStorage.removeItem("tok");
		console.log("login session cleared");
	} else {
		alert ("error:Sorry, your browser does not support Web Storage...");
	}
}

function isValidLogin() {
	/*should change this to the server query to validate the token later*/
//	if("id" in localStorage){
	console.log(localStorage.getItem("id"));
	if((null != localStorage.getItem("tok")) && ("undefined" != localStorage.getItem("tok")) &&
	   (null != localStorage.getItem("id")) && ("undefined" != localStorage.getItem("id"))){
		console.log("isvalid login : TRUE");
		return true;
	}
	else {
		console.log("isvalid login : FALSE");
		return false;
	}
}

function getpass(str){
	var stringpass= 'pwd' + CryptoJS.SHA256(str);
	console.log("passed : " + str + ", Returned : " + stringpass);
	return stringpass;
}

function get_loginData() {
	return JSON.stringify({username:$('#uname').val(),
		 pwd: getpass($('#logpwd').val())
		 });
}
function profile_login() {
	$.post('http://localhost:8080/api/user/login',get_loginData())
	.done(function(data){
		console.log("success" + data);
		var resp = window.atob(data);
		console.log("decoded : " + resp);
		setlogin_session(JSON.parse(resp));
		$('#loginModal').modal('toggle');
		load_profile();
	}) 
	.fail(function(data){
		alert("Error" + data);
	});
	
}
function get_registerData() {
	return JSON.stringify(
		{fullName: $('#fullname').val(),
		 pwd: getpass($('#regpwd').val()),
		 username:$('#email').val(),
		 phno:$('#phno').val()
		 });
}

function profile_register() {
	var badadata = get_registerData();
	console.log(badadata);
    $.ajax({
      type : 'post',
      url : 'http://localhost:8080/api/user/registeration/',
      data: badadata,
      contentType: "application/json;charset=utf-8",
      success : function(output, status, response) {
    	  var resp = JSON.parse(response.responseText);
          alert( "Data Loaded: " + resp);   
      },
	error : function(response, ajaxOptions, thrownError) {
		alert(response.responseText);
      }
    });
    return false;
}

function sleep(miliseconds) {
	   var currentTime = new Date().getTime();

	   while (currentTime + miliseconds >= new Date().getTime()) {
	   }
	}
function profile_logout(){
	console.log("Logging out");
	unload_profile();
	setlogin_session("false");
}
function load_profile(){
	if(true == isValidLogin()) {
		console.log("Logged in: loading profile");
		$("#profile-drop").empty();
		$("#profile-drop").append('<li><a id="s-new" onclick="update_user()"><span class="glyphicon glyphicon-pencil"></span> Update User</a></li>');
		$("#profile-drop").append('<li><a id="s-list" onclick="show_list()">Recent Blogs</a></li>');
		$("#profile-drop").append('<li id="in-out"><a onclick="profile_logout()"><span class="glyphicon glyphicon-log-out"></span>&nbsp; &nbsp; Logout</span></a></li>');
		$("#loginstat").text(getlogin_session().id);
		$("#loginstat").prepend('<i class="fa fa-user fa-lg"></i> &nbsp;');
		$("#loginstat").append('<span class="caret"></span>');
		console.log("loading profile complete");
		show_latest();
	}
	else {
		console.log("load_profile: session invalid");
	}
}

function unload_profile() {
	console.log("Unloading profile");
	clearlogin_session();
	$("#profile-drop").empty();
	$("#profile-drop").append('<li id="in-out"><a href="#" data-toggle="modal" data-target="#loginModal"><span class="glyphicon glyphicon-user"></span>&nbsp; &nbsp; Login</span></a></li>');
	$("#loginstat").text('');
	$("#loginstat").prepend('<i class="fa fa-user-times fa-lg"></i>');
	$("#loginstat").append('<span class="caret"></span>');	
}
function show_list() {
	console.log("s-list is clicked");
	$("#section-blog").empty();
	$("#section-form").empty();
	$("#section-update-user").empty();
	$("#section-list").load("section-list.html");
	$('[id^="section"]').hide();
	$("#section-list").show();
}

function show_latest() {
	console.log("s-latest is clicked");
	get_recent_blog();
	
	$("#section-list").empty();
	$("#section-form").empty();
	$("#section-update-user").empty();
	$("#section-blog").load("section-blog.html");
	$('[id^="section"]').hide();
	$("#section-blog").show();
}


function fill_blog(resp) {
	var rec_blog = null;
	try{
		var rec_blog = JSON.parse(resp);
		console.log("rec blog: " + rec_blog);
	}catch(e) {
		rec_blog = { blogTitle:'No recent Blogs',
				blogContent: 'There is no latest blog in your favourite list'};		
	}
	//addd header
	$("#blog-title").text(rec_blog.blogTitle);
	$("#blog-author").text(rec_blog.blogAuthorUsername);
	var timestamp = parseInt(rec_blog.blogTimestamp);
	var d = new Date();
	d.setTime(timestamp);
	
	$("#blog-posted").text("Posted on " +  d.toString());
	$("#blog-posted").prepend("<span class=\"glyphicon glyphicon-time\"></span>");
	var bodydata = rec_blog.blogContent.split("\n");
	if(bodydata.length > 0 ) {
		$("#section-blog-content").empty();
		console.log("length : "+ bodydata.length);
		bodydata.forEach(function(item, index){
		//add the para div
			console.log("[para] : " + item);
			$("#section-blog-content").append("<p " + ((index == 0)?" class=\"lead\" ":"") + ">" + item + "</p>");
		});
	}	
}

function show_form() {
	console.log("section-form is clicked");
	$("#section-list").empty();
	$("#section-blog").empty();
	$("#section-update-user").empty();
	$("#section-form").load("new-post.html");
	$('[id^="section"]').hide();
	$("#section-form").show("fast",function(){
		$('#blog-tags').tagsinput();
	});
}
function update_user() {
	console.log("update-user is clicked");
	$("#section-list").empty();
	$("#section-blog").empty();
	$("#section-form").empty();
	$("#section-update-user").load("update-user.html");
	$('[id^="section"]').hide();
	$("#section-update-user").show();
}

// // Select elems where 'attribute' ends with 'Dialog'
// $("[attribute$='Dialog']"); 

// // Selects all divs where attribute is NOT equal to value    
// $("div[attribute!='value']"); 

// // Select all elements that have an attribute whose value is like
// $("[attribute*='value']"); 

// // Select all elements that have an attribute whose value has the word foobar
// $("[attribute~='foobar']"); 

// // Select all elements that have an attribute whose value starts with 'foo' and ends
// //  with 'bar'
// $("[attribute^='foo'][attribute$='bar']");
	

