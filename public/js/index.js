$(function(){

	var githubOauth = {};

	$.getJSON('/oauth/GITHUB').done(function(data){
		githubOauth=data;
		console.log(githubOauth);
	});

});
