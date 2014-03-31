$(function(){
	
	var urls={
		uploads:'./responses/upload',
		topicsDetailsFor:'/topics',
		recordings:'recordings',
		userInfo:'/userinfo',
		allUsers:'/users',
		saveTags:'./responses/tags/',
		saveTagsForResponse:'./responses/tags',
		responsesFor:'/responses',
		membersForProject:'/projects/members',
		projectDetails:'/projects',
		inviteesForProject:'/projects/:projectId/invitees',
		sendProjectInvitation:'/projects/invitees'
	},
	rtcOptions = {
		'buffer-size': 16384,
	};
	
	var itemId='',
	recordingId='',
	itemType='',
	userInfo={},
	pageData={};
	
	var countdownTime = 5000, // Max duration for audio recording
	intervalTime = 1000, // Countdown for recording
	intervalId  = '';
	
	//Fetch the userInfo
	
	$.ajax(urls.userInfo)
		.done(function( data, textStatus, jqXHR ) {
			userInfo=data;
			pageData.userInfo=data;
			//console.log('userInfo',userInfo);
		});
	
	function getAllUsers(callback){
		
		$.ajax(urls.allUsers)
			.done(function( data, textStatus, jqXHR ) {
				pageData.allUsers=data;
				console.log(pageData.allUsers);
				
				if(callback&&typeof(callback)==='function'){
					callback(data);
				}
				
			});
			
	}
	
	function getInvitees(projectId){
	
		$.ajax(urls.inviteesForProject.replace(':projectId',projectId))
			.done(function( data, textStatus, jqXHR ) {
				pageData.allInvitees=data.invitees;
				
				var inviteeItems = [];
					_.each(pageData.allInvitees, function(inviteeDetails, index, list){
						inviteeItems.push(tmpl.inviteeLI(inviteeDetails));
					});
					
					$('.invitee-list').append(inviteeItems.join(''));
					
			});
			
	}
	
	function updateUserInfo(){
		$.ajax(urls.userInfo)
			.done(function( data, textStatus, jqXHR ) {
				pageData.userInfo=data;
				console.log(pageData.userInfo);
				$('.navbar .total-points').html(pageData.userInfo.points).addClass('hidden');
				$('.navbar .updated-points').html(pageData.userInfo.points).removeClass('hidden');
				
				$('.navbar .updated-points').animate({
					opacity:0
				},
				6000,
				function(){
					$(this).addClass('hidden').css({opacity:1});
					$('.navbar .total-points').removeClass('hidden');
				});
				
			});
	}
	
	var tmpl = {
		topic : _.template($('#_tmplTopic').html()),
		textResponse : _.template($('#_tmplTextResponse').html()),
		audioResponse : _.template($('#_tmplAudioResponse').html()),
		recPanelDefault : _.template($('#_tmplRecPanel_Default').html()),
		responseTags : _.template($('#_tmplResponseTags').html()),
		inviteeLI : _.template($('#_tmplInviteeLI').html()),
		memberLI : _.template($('#_tmplMemberLI').html())
	}
	
	function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
	}
	
	var topicId = getParameterByName('id');
	
	//If the user is selecting a particular topic, render the topic details interface
	if(topicId){
		
		$('.status .topic-id').text(topicId);
		
		$.ajax([urls.topicsDetailsFor,topicId].join('/'))
			.done(function( data, textStatus, jqXHR ) {
				
				//Save all the data that is used to render the contents of this page.
				pageData.topicInfo = data;
				
				var itemInfo = {
					itemId:pageData.topicInfo.id,
					projectId:pageData.topicInfo.project_id,
					itemType:'topic'
				};
				
				$('.topic-details .topic')
					.html(tmpl.topic(pageData.topicInfo));
					
				$('.topic-details')
					.attr('data-itemInfo',JSON.stringify(itemInfo));
					
				bindRecordControls();
				bindRecordPrompt();
				getProjectDetails();
				getProjectMembers();
				getInvitees(pageData.topicInfo.project_id);
				
			});
	
		$.ajax([urls.responsesFor,topicId].join('/'))
			.done(function( data, textStatus, jqXHR ) {
				
				//Save all the data that is used to render the contents of this page.
				pageData.responses = data.responses;
				
				var responsesArray = [];
				
				_.each(pageData.responses, function(responseDtls, index, list){
					
					if(responseDtls.type==="text"){
						responsesArray.push(tmpl.textResponse(responseDtls));
					}else{
						if(responseDtls.type==="audio"){
							responsesArray.push(tmpl.audioResponse(responseDtls));
						}
					}
					
				});
				
				var $otherResponsesContainer = $('.response-details .other-responses');
				
				$otherResponsesContainer.append(responsesArray.join(""));
				
				_.each($otherResponsesContainer.children(), function(responseItem, index, list){
					bindResponseHandlers(responseItem);
				});
				
				updateTopicMessages();
				
				if(!pageData.allUsers){
					getAllUsers(updateResponseMetadata);
				}else{
					updateResponseMetadata();
				}
				
				//bindHandlers();
				
			});
	
	
		function getProjectDetails(){
			
			var projectId = pageData.topicInfo.project_id;
			
			$.ajax([urls.projectDetails,projectId].join('/'))
				.done(function( data, textStatus, jqXHR ) {
					pageData.projectDetails=data;
					
					$('.status .current-project-name').text(pageData.projectDetails.name);
						
				});
		}
	
		function getProjectMembers(){
			
			var projectId = pageData.topicInfo.project_id;
			
			$.ajax([urls.membersForProject,projectId].join('/'))
				.done(function( data, textStatus, jqXHR ) {
					pageData.projectMembers=data.members;
					
					var memberItems = [];
					_.each(pageData.projectMembers, function(memberDetails, index, list){
						memberItems.push(tmpl.memberLI(memberDetails));
					});
					
					$('.member-list').append(memberItems.join(''));
					
					pageData.mentionsData = [];
					_.each(pageData.projectMembers, function(member, index, list){
						pageData.mentionsData.push(member.username);
					});
					
					$('textarea[name="responseTags"],textarea[name="recTags"]').triggeredAutocomplete({
						hidden: '#hidden_inputbox',
						source: pageData.mentionsData,
							 trigger: "@" ,
							 allowDuplicates: false
						});
						
				});
		};
		
	}
	
	function updateResponseMetadata(data,selector){
	
		if(!selector){
			var $otherResponsesContainer = $('.response-details .other-responses');

			if(!pageData.allUsers){
				watch(pageData, "allUsers", function(prop, action, newvalue, oldvalue){
					if(!oldvalue){
						_.each($otherResponsesContainer.children(), function(responseItem, index, list){
							var $responseItem = $(responseItem);
							var userId = $responseItem.find('.meta .user').data('userid');
							var member = _.findWhere(pageData.allUsers.users, {id:''+userId});
							$responseItem.find('.meta .user').text(member.fname);
						});
					}
				});
			}else{
				_.each($otherResponsesContainer.children(), function(responseItem, index, list){
					var $responseItem = $(responseItem);
					var userId = $responseItem.find('.meta .user').data('userid');
					var member = _.findWhere(pageData.allUsers.users, {id:''+userId});
					$responseItem.find('.meta .user').text(member.fname);
				});
			}
		}else{
			var $responseItem = $(selector);
			var userId = $responseItem.find('.meta .user').data('userid');
			var member = _.findWhere(pageData.allUsers.users, {id:''+userId});
			$responseItem.find('.meta .user').text(member.fname);
		}
	
		
		
	}
	
	function bindResponseHandlers(selector){
		var $responseItem = $(selector);
		//console.log('here');
		$responseItem.find('.add-tags a').on('click',function(e){
			
			var responseId = $responseItem.find('[name="responseId"]').val(),
				currentResponse = _.findWhere(pageData.responses, {"id": responseId});
		
			$responseItem.find('.prompts').addClass('hidden')
				.children('.add-tags').addClass('hidden');
			
			//Get the current tags for the response
			var currentTagsArr = [];
			_.each(currentResponse.tags,function(element, index, value){
				currentTagsArr.push(element);
			});
			
			$responseItem.find('textarea[name="responseTags"]')
					.val(currentTagsArr.join(' '))
					.removeClass('hidden');
			
			$responseItem.find('.tag-update-actions')
				.removeClass('hidden');
				
			$responseItem.find('.tag-list').addClass('hidden');
			
			e.preventDefault();
		});
		
		$responseItem.find('.tag-update-actions').on('click',function(e){
			var $this = $(this),
				$target = $(e.target);
			
			var responseId = $responseItem.find('[name="responseId"]').val();
			
			if($target.hasClass('cancel')){
			
				//Fetch the existing values
				var currentResponse = _.findWhere(pageData.responses, {"id": responseId});
				
				//Show/hide the appropriate elements
				if(currentResponse.tags.length===0){
				
					//Show the prompts to add tags
					$responseItem.find('.prompts').removeClass('hidden')
					.children('.add-tags').removeClass('hidden');
					
				}else{
					var tagListItems = tmpl.responseTags({tags:currentResponse.tags});
					$responseItem.find('.tag-list').html(tagListItems)
						.removeClass('hidden');
				}
				
				//Clear the textarea				
				$responseItem.find('textarea[name="responseTags"]')
					.val('')
					.addClass('hidden');
				
				//Hide the tag update actions
				$responseItem.find('.tag-update-actions')
					.addClass('hidden');
				
			}else{
				if($target.hasClass('save')){
					var rawTagString = $responseItem.find('textarea[name="responseTags"]').val();
					
					var correctedTagsArr = getPrefixedTagArr(rawTagString);
					
					console.log(correctedTagsArr);
					
					$.ajax({
						url:[urls.saveTagsForResponse,responseId].join('/'),
						type:'POST',
						data:{
							tags:correctedTagsArr
						}
					})
					.done(function(data){
					
						var currentResponse = _.findWhere(pageData.responses, {"id": responseId});
						currentResponse.tags = data.tags;
						
						var tagListItems = tmpl.responseTags({tags:currentResponse.tags});
						$responseItem.find('.tag-list').html(tagListItems)
							.removeClass('hidden');
						
						//Clear the textarea				
						$responseItem.find('textarea[name="responseTags"]')
							.val('')
							.addClass('hidden');
						
						//Hide the tag update actions
						$responseItem.find('.tag-update-actions')
							.addClass('hidden');
							
					});
					
				}
			}
			
		});
		
		$responseItem.find('.edit').on('click',function(e){
			$responseItem.find('.add-tags a').trigger('click');
		});
		
		//console.log(pageData.mentionsData);
		if(pageData.mentionsData){
			$responseItem.find('textarea[name="responseTags"],textarea[name="responseTags"]').triggeredAutocomplete({
				hidden: '#hidden_inputbox',
				source: pageData.mentionsData,
					 trigger: "@" ,
					 allowDuplicates: false
				});
		}
		
	}
	
	function bindActionable(selector){
		
		$(selector).on('click',function(event){
			var $this = $(this);
			var $target = $(event.target);
			
			var $parentRecPanel = $target.parents('.rec-panel');
			
			//Check if the action is from the recording panel
			if($parentRecPanel.length>0){
				
				if($target.hasClass('submit')){
					//console.log('submitting!');
					
					var itemInfo = JSON.parse($target.parents('.actionable').attr('data-itemInfo'));
					
					var $parentRecPanel = $target.parents('.rec-panel');
					
					var rawTagString = $parentRecPanel.find('textarea[name="recTags"]').val();
					
					var rawTextArr = _.without(rawTagString.split(' '),''); //get all the tags and clear the spaces

					var correctedTagsArr = _.map(rawTextArr, function(tagText){
					
							var finalText;
							var firstChar = tagText.charAt(0);
							if(firstChar === '@' || firstChar === '#'){
								finalText=tagText;
							}else{
								finalText='#'+tagText;
							}
							
							return finalText; 
					});
					
					console.log(pageData.responses);
					
					var responseId = $parentRecPanel.find('.response-id').val();
					
					console.log('tags',correctedTagsArr);
					$.ajax({
						url:urls.saveTags+responseId,
						type:'POST',
						data:{
							tags:correctedTagsArr
						}
					})
					.done(function(data){
						console.log(data);
					});
					
					event.preventDefault();
					
				}
				
			}
			
		});
		
	}
	
	function getPrefixedTagArr(rawTagString){
	
		var rawTextArr = _.without(rawTagString.split(' '),''); //get all the tags and clear the spaces
		var correctedTagsArr = _.map(rawTextArr, function(tagText){
					
				var finalText;
				var firstChar = tagText.charAt(0);
				if(firstChar === '@' || firstChar === '#'){
					finalText=tagText;
				}else{
					finalText='#'+tagText;
				}
				
				return finalText;
		});
		
		return correctedTagsArr;
	}
	
	function bindRecordPrompt(){
		$('.record-prompt').on('click',function(event){
			var $this = $(this);
			var $target = $(event.target);
			
			var $recPanel = $this.parents('.actionable').find('.rec-panel');
			if($recPanel.is(':visible') && intervalId ===''){
				$recPanel.addClass('hidden');
			}else{
				$recPanel.removeClass('hidden');
			}
			
		});
	}
	
	function bindRecordControls(){
	
		bindActionable('.actionable');
		
		$('.rec-control').on('click',function(event){
			var $this = $(this);
			var $target = $(event.target);
			
			var $parentRecPanel = $this.parents('.rec-panel');
			
			if($this.hasClass('start-rec')){
			
				navigator.getUserMedia({audio: true}, function(mediaStream) {

					window.recordRTC = RecordRTC(mediaStream,rtcOptions);
					recordRTC.startRecording();
					
					$this.text('Stop');
					$this.toggleClass('start-rec stop-rec');
					
					$parentRecPanel.find('.control-feedback .info.recording').removeClass('hidden');
					
					var $countdown = $parentRecPanel.find('.countdown');
					$countdown.html(countdownTime/1000);

					intervalId = setInterval(function(){
						
						
						var countdownValue = +($countdown.html());
						
						countdownValue=countdownValue-1;
						
						$countdown.html(countdownValue);
						
						if(countdownValue==0){
							$parentRecPanel.find('.stop-rec').click();
						}
						
						
					},intervalTime);

				});
				
			}else{
				
				if($this.hasClass('stop-rec')){
				
					clearInterval(intervalId);
					intervalId = '';
					$parentRecPanel.find('.control-feedback .info.recording').addClass('hidden');
					$parentRecPanel.find('.control-feedback .info.processing').removeClass('hidden');
					
					recordRTC.stopRecording(function(audioURL) {
					//window.open(audioURL);
					console.log(audioURL);
					//recordRTC.save();
					
					var itemInfo = JSON.parse($this.parents('.actionable').attr('data-itemInfo'));
					//console.log('itemInfo',itemInfo);
					
					var formData = new FormData();
					formData.append('recording', recordRTC.getBlob());
					formData.append('itemId', itemInfo.itemId);
					formData.append('itemType', itemInfo.itemType);
					formData.append('projectId', itemInfo.projectId);
					
						xhr(urls.uploads, formData, function (response) {
								//console.log(response);
								
								response = JSON.parse(response);
								//Add the response details to the existing responses to on the page
								pageData.responses.push(response.responseDtls);
								
								//Render a new block of the response on the page //TODO
								console.log(response.responseDtls);
								$('.response-details .other-responses')
									.prepend(tmpl.audioResponse(response.responseDtls));
								var $newResponse = $('.response-details .other-responses').children().eq(0);
								
								bindResponseHandlers($newResponse);
								
								$newResponse.find('.notifications').removeClass('hidden')
									.children('.new').removeClass('hidden');
								
								$this.text('Done');
								
								var $parentRecPanel = $this.parents('.rec-panel');
								
								$parentRecPanel.find('.response-id').val(response.responseDtls.id);
								
								$parentRecPanel.find('.rec-details').removeClass('hidden').find('.rec-link').attr('href',audioURL);
								//$this.toggleClass('start-rec stop-rec');
								$this.removeClass('start-rec stop-rec rec-control btn btn-primary');
								$this.addClass('alert alert-info');
								
								$parentRecPanel.find('.final-actions').removeClass('hidden');
								$parentRecPanel.find('.control-feedback .info.processing').addClass('hidden');
								
								//Transfer tags if any to the new response, and display appropriate response status
								
								//Reset the recording panel to its original state
								resetRecPanel();
								updateUserInfo();
								updateTopicMessages();
								updateResponseMetadata(pageData.allUsers,$newResponse);
								//Toggle height/close the rec panel
								
						});
						
					});
					
				}
				
			}

		});
		
	}
	
	function updateTopicMessages(){
		if(pageData.responses.length>0){
			$('.topic-details .messages .prompt-first').addClass('hidden');
		}
	}
	
	function resetRecPanel(){
		var recPanelDefault = tmpl.recPanelDefault();
		
		$('.rec-panel').children().remove();
		$('.rec-panel').append(recPanelDefault);
		bindRecordControls();
		
		$('textarea[name="recTags"]').triggeredAutocomplete({
			hidden: '#hidden_inputbox',
			source: pageData.mentionsData,
				 trigger: "@" ,
				 allowDuplicates: false
			});
		
	}
	
	function bindHandlers(){
	
		//bindRecordControls();
		
		$('.action-invite').on('click',function(e){

			var $this = $(this);
			var projectId = pageData.topicInfo.project_id;
			
			$.ajax({
				url:urls.sendProjectInvitation,
				type: "POST",
				data :{
					emailId:$('.invitee-email').val(),
					projectId:projectId
				}
				})
				.done(function( data, textStatus, jqXHR ) {
					pageData.allInvitees.unshift(data);
					
					var inviteeItems = [];
						_.each(pageData.allInvitees, function(inviteeDetails, index, list){
							inviteeItems.push(tmpl.inviteeLI(inviteeDetails));
						});
						
						$('.invitee-list').html(inviteeItems.join(''));
						
				});
				
				$this.parents('.modal').find('.close').trigger('click');
				$this.parents('.modal').find('.invitee-email').val('');
			
		});
		
	}

	bindHandlers();
	
	function xhr(url, data, callback) {
		var request = new XMLHttpRequest();
		request.onreadystatechange = function() {
			if (request.readyState == 4 && request.status == 200) {
				callback(request.responseText);
			}
		};
		request.open('POST', url);
		request.send(data);
	}
	
	
	
});