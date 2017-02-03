$(document).ready(function() {

	$("#header").load("header.html"); 
	$("#footer").load("footer.html"); 
	$("#section-list").load("section-list.html");
	
	$("#section_blog_post").hide();
	$("#section-list").hide();

	$('#s-list').click(function() {
		$('[id^="section"]').hide();
		$("#section-list").show();

	});
	$("#s-latest").click(function() {
		$('[id^="section"]').hide();
		$("#section_blog_post").show();
	});
});

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
	

