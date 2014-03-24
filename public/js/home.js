$(function(){

	var urls = {
		allRepos : '/projects',
		parentRepos : '/getParentRepos',
		topics : '/topics'
	};
	
	var tmpl = {
		repoLI : _.template($('#_tmplRepoLI').html()),
		convoLI : _.template($('#_tmplConvoLI').html()),
		projectSelectorLI : _.template($('#_tmplProjectSelectorLI').html())
	};
	
	var selectedProjectId='';
		
	function init(){
	
		$.ajax(urls.allRepos)
			.done(function( data, textStatus, jqXHR ) {
				//console.log(data);
				var htmlElems = [];
				var modalhtmlElems = [];
				_.each(data, function(element, index, list){
					//console.log(tmpl.repoLI(element));
					htmlElems.push(tmpl.repoLI(element));
					modalhtmlElems.push(tmpl.projectSelectorLI(element));
				});
				
				//console.log(htmlElems.join(''));
				$('.repo-list ul').append(htmlElems.join(''));
				
				$('.project-list-selection').append(modalhtmlElems.join(''));
				
				_.each($('.project-list-selection').children(),function(element, index, list){
					bindProjectSelection(element);
				});
				
			});
			
		$.ajax(urls.topics)
			.done(function( data, textStatus, jqXHR ) {
				//console.log(data);
				var htmlElems = [];
				_.each(data, function(element, index, list){
					//console.log(tmpl.repoLI(element));
					htmlElems.push(tmpl.convoLI(element));
				});
				
				//console.log(htmlElems.join(''));
				$('.convo-list ul').append(htmlElems.join(''));
				
			});

	}
	
	function bindProjectSelection(selector){
		var $element = $(selector);
		$element.on('click',function(e){
			var projectId = $element.data('projectid');
			window.location = 'newTopic.html?projectId='+projectId;
		})
	}
	
	function bindEventHandlers(){
		
		$('.new-topic').on('click',function(e){
			
			if(selectedProjectId){
				window.location = 'newTopic.html?projectId='+selectedProjectId;
			}else{
				$('.launch-project-selector').trigger('click');
			}
			
		});
		
	};
		
	init();
	bindEventHandlers();
	
});