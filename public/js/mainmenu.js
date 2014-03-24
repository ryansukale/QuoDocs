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
			$('.navbar .total-points').html(pageData.userInfo.points);
			$('.navbar .updated-points').html(pageData.userInfo.points);
			
		});
	
});