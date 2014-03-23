$(function(){
	
	var urls={
		uploads:'./responses/upload',
		topicsDetailsFor:'/topics',
		recordings:'recordings',
		userInfo:'./userinfo',
		saveTags:'./responses/tags/',
		saveTagsForResponse:'./responses/tags',
		responsesFor:'/responses'
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
			//console.log('userInfo',userInfo);
		});
	
	var tmpl = {
		topic : _.template($('#_tmplTopic').html()),
		textResponse : _.template($('#_tmplTextResponse').html()),
		audioResponse : _.template($('#_tmplAudioResponse').html()),
		recPanelDefault : _.template($('#_tmplRecPanel_Default').html()),
		responseTags : _.template($('#_tmplResponseTags').html())
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
				
				$otherResponsesContainer = $('.response-details .other-responses');
				
				$otherResponsesContainer.append(responsesArray.join(""));
				
				_.each($otherResponsesContainer.children(), function(responseItem, index, list){
					bindResponseHandlers(responseItem);
				});
				
				//bindHandlers();
				
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
			
			return false;
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
	
	function bindRecordControls(){
	
		bindActionable('.actionable');
	
		$('.record-prompt').on('click',function(event){
			var $this = $(this);
			var $target = $(event.target);
			
			$this.parents('.actionable').find('.rec-panel').removeClass('hidden');
			
		});
		
		
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
							clearInterval(intervalId);
						}
						
						
					},intervalTime);

				});
				
			}else{
				
				if($this.hasClass('stop-rec')){
				
					clearInterval(intervalId);
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
								
								//Toggle height/close the rec panel
								
						});
						
					});
					
				}
				
			}

		});
		
	}
	
	function resetRecPanel(){
		var recPanelDefault = tmpl.recPanelDefault();
		
		$('.rec-panel').children().remove();
		$('.rec-panel').append(recPanelDefault);
		bindRecordControls();
		
	}
	
	function bindHandlers(){
	
		//bindRecordControls();
		
	}

	
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