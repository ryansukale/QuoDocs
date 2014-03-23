$(function (){
	var urls={
		userInfo:'./userinfo'
	};
	
	var pageData={};
	
	//Fetch the userInfo
	$.ajax(urls.userInfo)
		.done(function( data, textStatus, jqXHR ) {
			pageData.userInfo=data;
			
			//Update the points in the main menu block
			$('.navbar .totalPoints').html(pageData.userInfo.points);
			
		});
	
});