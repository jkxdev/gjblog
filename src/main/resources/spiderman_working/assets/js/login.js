
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

//$(document).ready(function() {
//	$('#login').click(function() {
function profile_login(){ 
	
//	var xmlhttp = new XMLHttpRequest();   // new HttpRequest instance 
//	xmlhttp.onreadystatechange = function() {
//		console.log("response" + this.responseText + "readystate : "+ this.readyState+"status :" +this.status );
//	    if (this.readyState == 4 && this.status == 200) {
//	      alert(this.responseText);
//	    }
//	    if (this.readyState == 4 && this.status == 404) {
//	    	alert("error " + this.responseText);
//	    }
//	  };
//	xmlhttp.open("POST", 'http://localhost:8080/api/user/login',true);
//	xmlhttp.setRequestHeader("Content-Type", "application/json");
//	xmlhttp.send(get_loginData());
//	
	
	
		$.post('http://localhost:8080/api/user/login',get_loginData())
		.done(function(data){
			console.log("success" + data);
			var a = window.atob(data);
			console.log("decoded : " + a);
		}) 
		.fail(function(data){
			alert("Error" + data);
		});
	
	
//		$.ajax({
//			type : 'post',
//			url : 'http://localhost:8080/api/user/login',
//			data: get_loginData(),
//			contentType: "application/json;charset=utf-8",
////			success : function(response) {
////				var data = jQuery.parseJSON(response)
////				if(response.data.isJSON())	{
////					alert( "Data Loaded: user found ");
////				}else	{
////					alert( "Data Loaded: no user found ");
////				}
////				alert( "Data Loaded: "+response);
////			}
//			success: function(output, status, xhr) {
//				alert( "output: " +output);
//				alert( "status:" +status);
//				alert( "xhr.responseText: " +xhr.responseText);
//				var a = window.btoa(output);
//				console.log(a);
//				var a = JSON.parse(xhr.responseText);
////				alert("After parse:"+a.id)
////				alert("From local storage: "+localStorage.getItem("ls-id"))
//				//alert("From local storage: "+localStorage.getItem("ls-token"))
//				window.location="home.html";
//			},
//			error: function(xhr,textStatus,err)
//			{
//			    console.log("readyState: " + xhr.readyState);
//			    console.log("responseText: "+ xhr.responseText);
//			    console.log("status: " + xhr.status);
//			    console.log("text status: " + textStatus);
//			    console.log("error: " + err);
//			}
//		});
	}
//);
//	
//});