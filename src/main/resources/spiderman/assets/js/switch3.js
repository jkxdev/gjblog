$(document).ready(function() {
	$("#header").load("header.html",function() {
	    load_profile();
	});
	$("#footer").load("footer.html"); 

	$("#section-blog").hide();
	$("#section-list").hide();
	$("#section-form").hide();
	
	console.log("document .ready loaded the contents and hid the divs");
	
	console.log("session logged in status " + getlogin_session());
	
});

function setlogin_session(stringvar){ 
	
	// Check browser support
	if (typeof(Storage) !== "undefined") {
	    // Store
	    localStorage.setItem("loggedin", stringvar);
	} else {
		alert ("error:Sorry, your browser does not support Web Storage...");
	}
}

function getlogin_session() {
	return localStorage.getItem("loggedin");
}

function profile_login() {
    $.ajax({
      type : 'post',
      url : 'http://localhost:8080/api/login/',
      data: '{"username": "' + $('#uname').val() + '","pwd":"' + CryptoJS.SHA256($('#pwd').val()) + '"}',
      contentType: "application/json;charset=utf-8",
      success : function(response) {
        //alert( "Data Loaded: " + response );
//        $("#section_blog_post").show();
//        $('#section_blog_post [id^="section"]').hide();
        //window.location="home.html";
  		console.log("setting loggedin" + loggedin);
    	setlogin_session("true");
    	load_profile();
		show_latest();
      },
      error: function(response){
    	  setlogin_session("true"); //REMOVE
        //alert ("error " + response.responseText );
        load_profile();
      }
    });
//    e.preventDefault();
}
function profile_register() {
	var badadata = '{"fullName": "' + $('#fullname').val() + 
      '","pwd":"' +$('#pwd').val() + 
      '","username":"' +$('#email').val() +
      '","phno":"' +$('#phno').val() +
      '"}';
	console.log(badadata);
    $.ajax({
      type : 'post',
      url : 'http://localhost:8080/api/user/registeration/',
      data: badadata,
      contentType: "application/json;charset=utf-8",
      success : function(response) {
        //alert( "Data Loaded: " + response );
        $("#section_blog_post").show();
        $('#section_blog_post [id^="section"]').hide();
        //window.location="home.html";
      },
	error : function(xhr, ajaxOptions, thrownError) {
		alert(xhr.responseText);
//		alert(xhr.status+);
//		alert(thrownError);
//		window.location="home.html";
      }
    });
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
	if('true' == getlogin_session()) {
		console.log("Logged in: loading profile");
		$("#profile-drop").empty();
		$("#profile-drop").append('<li><a id="s-new" onclick="update_user()"><span class="glyphicon glyphicon-pencil"></span> Update User</a></li>');
		$("#profile-drop").append('<li><a id="s-list" onclick="show_list()">Recent Blogs</a></li>');
		$("#profile-drop").append('<li id="in-out"><a onclick="profile_logout()"><span class="glyphicon glyphicon-log-out"></span>&nbsp; &nbsp; Logout</span></a></li>');
		$("#loginstat").text('Josie');
		$("#loginstat").prepend('<i class="fa fa-user fa-lg"></i> &nbsp;');
		$("#loginstat").append('<span class="caret"></span>');
		console.log("loading profile complete");
//		sleep(4000);
//		console.log("sleep over");
	}
}

function unload_profile() {
	console.log("Unloading profile");
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
	$("#section-list").empty();
	$("#section-form").empty();
	$("#section-update-user").empty();
	$("#section-blog").load("section-blog.html");
	$('[id^="section"]').hide();
	$("#section-blog").show();
}
function show_form() {
	console.log("section-form is clicked");
	$("#section-list").empty();
	$("#section-blog").empty();
	$("#section-update-user").empty();
	$("#section-form").load("new-post.html");
	$('[id^="section"]').hide();
	$("#section-form").show();
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
	

