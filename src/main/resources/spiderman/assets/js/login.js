$(document).ready(function() {
  $('#login').click(function() {
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
  });
  $('#register').click(function() {
	 var badadata = '{"fullName": "' + $('#fullname').val() + 
          '","pwd":"' +$('#pwd').val() + 
          '","username":"' +$('#email').val() +
          '","phno":"' +$('#phno').val() +
          '"}';
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
  });
  
  $("cancel").click(function () {
        location.href = "index.html";
    });
});