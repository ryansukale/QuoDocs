$(function(){
	
	var urls={
		uploads:'./responses/upload',
		topicsDetailsFor:'/topics',
		recordings:'recordings',
		userInfo:'/userinfo',
		saveTags:'./responses/tags/',
		saveTagsForResponse:'./responses/tags',
		responsesFor:'/responses',
		membersForProject:'/projects/members'
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
		memberLI : _.template($('#_tmplMemberLI').html())
	}
	
	function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
	}
	
	var projectId = getParameterByName('projectId');
	
	//If the user is selecting a particular topic, render the topic details interface
	if(projectId){
		
		function fetchProjectMembers(){
			
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
					
					$('.topic-tags').triggeredAutocomplete({
						hidden: '#hidden_inputbox',
						source: pageData.mentionsData,
							 trigger: "@" ,
							 allowDuplicates: false
						});
						
				});
		}
		
		fetchProjectMembers();
		
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
						$responseItem.find('.topic-tags')
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
			$responseItem.find('.topic-tags').triggeredAutocomplete({
				hidden: '#hidden_inputbox',
				source: pageData.mentionsData,
					 trigger: "@" ,
					 allowDuplicates: false
				});
		}
		
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
	
	
	
	function bindHandlers(){
	
		//bindRecordControls();
		
	}
	
});