$(function(){

	if (!String.prototype.trim) {
  
		String.prototype.trim=function(){return this.replace(/^\s+|\s+$/g, '');};
		String.prototype.ltrim=function(){return this.replace(/^\s+/,'');};
		String.prototype.rtrim=function(){return this.replace(/\s+$/,'');};
		String.prototype.fulltrim=function(){return this.replace(/(?:(?:^|\n)\s+|\s+(?:$|\n))/g,'').replace(/\s+/g,' ');};
		
	}

	var urls = {
		allRepos : '/projects',
		parentRepos : '/getParentRepos',
		userInfo : '/userinfo',
		topics : '/topics',
		allUsers : '/users',
		topicsWhere : '/topics/criteria',
		membersForProject:'/projects/members',
		inviteesForProject:'/projects/:projectId/invitees',
		sendProjectInvitation:'/projects/invitees'
	};
	
	var tmpl = {
		repoLI : _.template($('#_tmplRepoLI').html()),
		convoLI : _.template($('#_tmplConvoLI').html()),
		projectSelectorLI : _.template($('#_tmplProjectSelectorLI').html()),
		inviteeLI : _.template($('#_tmplInviteeLI').html()),
		memberLI : _.template($('#_tmplMemberLI').html())
	};
	
	var pageData = {
		selectedProjectId:'',
		projectMembers:{},
		allInvitees:{}
	};
	
	function getAllUsers(callback){
		
		$.ajax(urls.allUsers)
		.done(function( data, textStatus, jqXHR ) {
			pageData.allUsers=data.users;
			if(callback) callback(data);
		});
		
	};
	
	function getUserInfo(callback){
		
		$.ajax(urls.userInfo)
		.done(function( data, textStatus, jqXHR ) {
			userInfo=data;
			pageData.userInfo=data;
			if(callback) callback(pageData.userInfo);
		});
		
	};
	
	getUserInfo();
	getAllUsers();
		
	function init(){
	
		$.ajax(urls.allRepos)
			.done(function( data, textStatus, jqXHR ) {
				pageData.allProjects = data;
				
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
			updateCurrentProject();

	}
	
	watch(pageData, "selectedProjectId", function(prop, action, newvalue, oldvalue){
		updateCurrentProject();

		if(pageData.selectedProjectId){
			//TODO: Change the column format to 3 columns
			$('.project-dashboard').parents('.col.col-md-12')
				.removeClass('col-md-12').addClass('col-md-9');

			if(pageData.projectMembers[pageData.selectedProjectId]){
				renderProjectMembers();
			}else{
				getProjectMembers(renderProjectMembers);
			}
			showInvitees(pageData.selectedProjectId);
		}else{
			//Change the column format to 2 columns since there is no current project

			$('.project-dashboard').parents('.col.col-md-9')
			.removeClass('col-md-9').addClass('col-md-12');

			console.log('updating to 2 column layout');
			$('.team-members').parents('.col').addClass('hidden');
		}

	});

	function renderProjectMembers() {
		//Show the list of project members
		var memberItems = [];
		_.each(pageData.projectMembers[pageData.selectedProjectId], 
			function(memberDetails, index, list){
			memberItems.push(tmpl.memberLI(memberDetails));
		});
		
		$('.member-list').empty();
		$('.member-list').append(memberItems.join(''));
		$('.team-members').parents('.col').removeClass('hidden');
	}


	function showInvitees(projectId){
	
		$.ajax(urls.inviteesForProject.replace(':projectId',projectId))
			.done(function( data, textStatus, jqXHR ) {
				pageData.allInvitees=data.invitees;
				
				var inviteeItems = [];
					_.each(pageData.allInvitees, function(inviteeDetails, index, list){
						inviteeItems.push(tmpl.inviteeLI(inviteeDetails));
					});
					
					$('.invitee-list').html(inviteeItems.join(''));
					
			});
			
	}
	
	function updateCurrentProject(){
		var currentProjectName = '';
		if(pageData.selectedProjectId){
			var currentProject = _.findWhere(pageData.allProjects,{id:''+pageData.selectedProjectId});
			currentProjectName = currentProject.name;
			$('.show-all-topics').removeClass('hidden');
			$('.project-dashboard').removeClass('hidden');
			
		}else{
			currentProjectName="All Projects";
			$('.show-all-topics').addClass('hidden');
			$('.project-dashboard').addClass('hidden');
			$('.no-topics').addClass('hidden');
			$('.repo-list .repo-details').removeClass('selected');
			$('.repo-list-filter').val('').trigger('keyup');
			filterTopicStream({});
		}
		$('.current-project-name').text(currentProjectName);
		
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
				//console.log(pageData);
				
				if(!pageData.allUsers){
					watch(pageData, "allUsers", renderAskers);
				}else{
					renderAskers();
				}
				
				
			});
	}
	

	function getProjectMembers(callback){
			
		var projectId = pageData.selectedProjectId;
		
		$.ajax([urls.membersForProject,projectId].join('/'))
			.done(function( data, textStatus, jqXHR ) {
				pageData.projectMembers[pageData.selectedProjectId] =data.members;
				
				callback(data);
				//var memberItems = [];
				//_.each(pageData.projectMembers, function(memberDetails, index, list){
				//	memberItems.push(tmpl.memberLI(memberDetails));
				//});
				//
				//$('.member-list').append(memberItems.join(''));
				//
				//pageData.mentionsData = [];
				//_.each(pageData.projectMembers, function(member, index, list){
				//	pageData.mentionsData.push(member.username);
				//});
				//
				//$('[name="responseTags"],[name="recTags"]').triggeredAutocomplete({
				//	hidden: '#hidden_inputbox',
				//	source: pageData.mentionsData,
				//		 trigger: "@" ,
				//		 allowDuplicates: false
				//	});
				//	
				//$('[name="responseTags"],[name="recTags"]').on('keypress',function(e){
				//	
				//	var $this = $(this);
				//	var $parentResponse = $this.parents('.response');
				//	
				//	if(e.which===13){
				//		e.preventDefault();
				//		$parentResponse.find('.save').click();
				//	}
				//	
				//});
					
			});
	}

	function renderAskers(prop, action, newvalue, oldvalue){
		_.each($('.convo-list .convo-details'),function(element, index, value){
			var askerId = $('.asker-id',element).text();
			var asker = _.findWhere(pageData.allUsers,{id:''+askerId});
			$('.asker-name',element).text(asker.fname);
			
			if(prop){
				unwatch(pageData, "allUsers", renderAskers);
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
		
		if(_.isEmpty(criteria)){
			$('.convo-list .convo-details').removeClass('hidden');
		}else{
			
		}
		
		if(criteria.projectId){
			
			//For now, just filter the stream
			var visibleTopicCount = 0;
			_.each($('.convo-list .convo-details'),function(element, index, list){
				var $element = $(element);
				if($element.data('projectid')!==criteria.projectId){
					$element.addClass('hidden');
				}else{
					visibleTopicCount++;
					$element.removeClass('hidden');
				}
			});
			
			var $topicCountContainer = $('.project-dashboard .topic-count .summary-item-value');
			//if no topics are visible, display the filler prompt
			if(visibleTopicCount===0){
				$('.no-topics').removeClass('hidden');
				$topicCountContainer.text(0);
			}else{
				$('.no-topics').addClass('hidden');
				$topicCountContainer.text(visibleTopicCount);
			}
			
		}else{
			if(criteria.userName){
			
				$('.convo-list .convo-details').addClass('hidden');
				//For now, just filter the stream
				_.each($('.convo-list .convo-details .convo-tags .tag'),function(element, index, list){
					var $element = $(element);
					var $parentTopic = $element.parents('.convo-details');
					if($parentTopic.hasClass('hidden')){
						if($element.text()===criteria.userName){
							$parentTopic.removeClass('hidden');
						}
					}
				});
				
				$('.current-project-name').text(criteria.userName);
				$('.show-all-topics').removeClass('hidden');
				
			}
		}
	}
	
	function bindEventHandlers(){
		
		$('.show-all-topics').on('click',function(e){
			if(pageData.selectedProjectId!==''){
				pageData.selectedProjectId = '';
			}else{
				updateCurrentProject();
			}
		});
		
		$('.new-topic').on('click',function(e){
			
			if(pageData.selectedProjectId){
				window.location = 'newTopic.html?projectId='+pageData.selectedProjectId;
			}else{
				$('.launch-project-selector').trigger('click');
			}
			
			e.preventDefault();
			
		});
		
		
		$('.convo-list').on('click',function(e){
			var $this = $(this);
			var $target = $(e.target);
			
			if($target.hasClass('highlighted-tag')){
				filterTopicStream({userName:$target.text()});
			}
			
		});
		
		$('.repo-list-filter').on('keyup',function(e){
			var $this = $(this);
			var value = $this.val();
			console.log(e.which);
			console.log(value);
			if(!value || value.trim==='' || value===null){
				//Show the entire project list
				$('.repo-list .repo-details').removeClass('hidden');
			}else{
				//filter the project list
				_.each($('.repo-list .repo-details .project-name'),function(element, index, list){
					var $element = $(element);
					$element.parents('.repo-details').addClass('hidden');
					var projectName = $element.text();
					if(projectName.toLowerCase().indexOf(value.toLowerCase())>-1){
						$element.parents('.repo-details').removeClass('hidden');
					}else{
					}
				});
				
			}
			
		});

		$('.action-invite').on('click',function(e){

			var $this = $(this);
			var projectId = pageData.selectedProjectId;
			
			$.ajax({
				url:urls.sendProjectInvitation,
				type: "POST",
				data :{
					emailId:$('.invitee-email').val(),
					projectId:projectId
				}
				})
				.done(function( data, textStatus, jqXHR ) {
					if(!pageData.allInvitees[pageData.selectedProjectId]){
						pageData.allInvitees[pageData.selectedProjectId]=[];
					}

					pageData.allInvitees[pageData.selectedProjectId].unshift(data);
					
					var inviteeItems = [];
						_.each(pageData.allInvitees[pageData.selectedProjectId], function(inviteeDetails, index, list){
							inviteeItems.push(tmpl.inviteeLI(inviteeDetails));
						});
						
						$('.invitee-list').html(inviteeItems.join(''));
						
				});
				
				$this.parents('.modal').find('.close').trigger('click');
				$this.parents('.modal').find('.invitee-email').val('');
			
		});
		
	};
		
	init();
	bindEventHandlers();
	
});