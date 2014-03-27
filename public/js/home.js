$(function(){

	var urls = {
		allRepos : '/projects',
		parentRepos : '/getParentRepos',
		userInfo : '/userinfo',
		topics : '/topics',
		topicsWhere : '/topics/criteria'
	};
	
	var tmpl = {
		repoLI : _.template($('#_tmplRepoLI').html()),
		convoLI : _.template($('#_tmplConvoLI').html()),
		projectSelectorLI : _.template($('#_tmplProjectSelectorLI').html())
	};
	
	pageData={};
	
	function getUserInfo(callback){
		
		$.ajax(urls.userInfo)
		.done(function( data, textStatus, jqXHR ) {
			userInfo=data;
			pageData.userInfo=data;
			if(callback) callback(pageData.userInfo);
		});
		
	};
	
	getUserInfo();
	
	var pageData = {
		selectedProjectId:''
	};
		
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
				
				_.each($('.repo-list .repo-details'),function(element, index, list){
					bindProjectListListeners(element);
				});
				
			});
			
			getTopics();

	}
	
	function getTopics(){
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
				
				if(!pageData.userInfo){
					getUserInfo(highlightMyTags);
				}else{
					highlightMyTags(pageData.userInfo);
				}
				
			});
	}
	
	function highlightMyTags(userInfo){
		_.each($('.convo-details .tag'), function(element, index, list){
			var $currentTag = $(element);
			if($currentTag.html()==='@'+userInfo.login){
				$currentTag.addClass('highlighted-tag');
			}
		});
	}
	
	function bindProjectListListeners(element){
		
		var $project = $(element);
		
		$project.on('click',function(element, index, value){
			var projectId = $project.data('projectid');
			pageData.selectedProjectId = projectId;
			
			var criteria = {
				projectId : pageData.selectedProjectId
			};
			filterTopicStream(criteria);
			
			$project.addClass('selected')
				.siblings().removeClass('selected');
			
		});
		
	}
	
	function bindProjectSelection(selector){
		var $element = $(selector);
		$element.on('click',function(e){
			var projectId = $element.data('projectid');
			window.location = 'newTopic.html?projectId='+projectId;
		})
	}
	
	function filterTopicStream(criteria){
	
		//In the real sytems make an ajax call using the criteria
		//and render the stream.
		//$.ajax(urls.topicsWhere, {data:criteria});
			
		if(criteria.projectId){
			
			//For now, just filter the stream
			_.each($('.convo-list .convo-details'),function(element, index, list){
				var $element = $(element);
				if($element.data('projectid')!==criteria.projectId){
					$element.addClass('hidden');
				}else{
					$element.removeClass('hidden');
				}
			});
			
			//if no topics are visible, display the filler prompt
			
		}else{
			//Render the entire stream
		}
	}
	
	function bindEventHandlers(){
		
		$('.new-topic').on('click',function(e){
			
			if(pageData.selectedProjectId){
				window.location = 'newTopic.html?projectId='+pageData.selectedProjectId;
			}else{
				$('.launch-project-selector').trigger('click');
			}
			
		});
		
	};
		
	init();
	bindEventHandlers();
	
});