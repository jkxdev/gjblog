$(document).ready(function() {
  
  
  $("cancel").click(function () {
        location.href = "index.html";
    });
	$("#header").load("header.html"); 
	$("#footer").load("footer.html"); 
//	$("#section-list").load("section-list.html").hide();
//	$("#section-blog").load("section-blog.html").hide();

	$("#section-blog").hide();
	$("#section-list").hide();
	console.log("document .ready loaded the contents and hid the divs");

});
function login() {
    $.ajax({
      type : 'post',
      url : 'http://localhost:8080/api/login/',
      data: '{"username": "' + $('#uname').val() + '","pwd":"' + CryptoJS.SHA256($('#pwd').val()) + '"}',
      contentType: "application/json;charset=utf-8",
      success : function(response) {
        //alert( "Data Loaded: " + response );
        $("#section_blog_post").show();
        $('#section_blog_post [id^="section"]').hide();
        //window.location="home.html";
      },
      error: function(response){
        alert ("error " + response );
      }
    });
}
function register() {
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
      error: function(response){
    	  alert ("error " + response );
      }
    });
 }
function show_list() {
	console.log("s-list is clicked");
	$("#section-blog").empty();
	$("#section-list").load("section-list.html");
	$('[id^="section"]').hide();
	$("#section-list").show();
}

function show_latest() {
	console.log("s-latest is clicked");
	$("#section-list").empty();
	$("#section-blog").load("section-blog.html");
	$('[id^="section"]').hide();
	$("#section-blog").show();
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
	

