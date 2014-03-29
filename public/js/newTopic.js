$(function(){
	
	var urls={
		createTopic:'/topics',
		userInfo:'/userinfo',
		membersForProject:'/projects/members',
		projectInfo:'/projects'
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
		
		fetchProjectMembers();
		fetchProjectInfo();
		
	}
	
	function fetchProjectInfo(){
		
		$.ajax([urls.projectInfo,projectId].join('/'))
			.done(function( data, textStatus, jqXHR ) {
				pageData.projectDetails=data;
				
				$('.current-project-name').text(pageData.projectDetails.name);
				
			});
		
	}
	
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
	
		$('.submit').on('click',function(){
		
			var rawTagString =$('textarea[name="topicTags"]').val();
			
			var correctedTagsArr = getPrefixedTagArr(rawTagString);
			
			$.ajax({
				url:[urls.createTopic],
				type:'POST',
				data:{
					projectId:projectId,
					mainText:$('.main-text').val(),
					description:$('.description').val(),
					tags:correctedTagsArr
				}
			})
			.done(function(newTopic){
			
				window.location = 'http://localhost:5000/topic.html?id='+newTopic.id;
					
			});
			
		});
		//bindRecordControls();
		
	}
	
	bindHandlers();
	
});