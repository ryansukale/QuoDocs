$(function(){

	var urls = {
		allRepos : '/getRepos',
		parentRepos : '/getParentRepos'
	};
	
	var tmpl = {
		repoLI : _.template($('#_tmplRepoLI').html())
	};
	
	function init(){
	
		$.ajax(urls.allRepos)
			.done(function( data, textStatus, jqXHR ) {
				//console.log(data);
				var htmlElems = [];
				_.each(data, function(element, index, list){
					//console.log(tmpl.repoLI(element));
					htmlElems.push(tmpl.repoLI(element));
				});
				
				//console.log(htmlElems.join(''));
				$('.repo-list ul').append(htmlElems.join(''));
				
			});

	}
	
	function bindEventHandlers(){
	};
		
	init();
	bindEventHandlers();
	
});