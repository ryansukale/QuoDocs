$(function(){
	
	var urls={
		uploads:'./responses/upload',
		topics:'topics',
		recordings:'recordings',
		userInfo:'./userinfo',
		saveTags:'./responses/tags/'
	},
	rtcOptions = {
   'buffer-size': 16384,
	};
	
	var itemId='',
	recordingId='',
	itemType='',
	userInfo={},
	pageData={};
	
	var countdownTime = 2000, // Max duration for audio recording
	intervalTime = 1000, // Max duration for audio recording
	intervalId  = '';
	
	//Fetch the userInfo
	$.ajax(urls.userInfo)
		.done(function( data, textStatus, jqXHR ) {
			userInfo=data;
			//console.log('userInfo',userInfo);
		});
	
	var tmpl = {
		topic : _.template($('#_tmplTopic').html()),
		textResponse : _.template($('#_tmplTextResponse').html())
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
		
		$.ajax([urls.topics,topicId].join('/'))
			.done(function( data, textStatus, jqXHR ) {
				
				//Save all the data that is used to render the contents of this page.
				pageData = data;
				
				var itemInfo = {
					itemId:data.topicInfo.id,
					projectId:data.topicInfo.project_id,
					itemType:'topic'
					};
				
				$('.topic-details .topic')
					.html(tmpl.topic(data.topicInfo));
					
				$('.topic-details')
					.attr('data-itemInfo',JSON.stringify(itemInfo));
				
				var responsesArray = [];
				
				_.each(data.responseInfo, function(responseDtls, index, list){
					
					if(responseDtls.type==="text"){
						responsesArray.push(tmpl.textResponse(responseDtls));
					}
					
				});
				
				$('.response-details .other-responses').append(responsesArray.join());
				
				bindHandlers();
				
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
					
					console.log(pageData.responseInfo);
					
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
								pageData.responseInfo.push(response.responseDtls);
								
								//Render a new block of the response on the page //TODO
								
								$this.text('Done');
								
								var $parentRecPanel = $this.parents('.rec-panel');
								
								$parentRecPanel.find('.response-id').val(response.responseDtls.id);
								
								$parentRecPanel.find('.rec-details').removeClass('hidden').find('.rec-link').attr('href',audioURL);
								//$this.toggleClass('start-rec stop-rec');
								$this.removeClass('start-rec stop-rec rec-control btn btn-primary');
								$this.addClass('alert alert-info');
								
								$parentRecPanel.find('.final-actions').removeClass('hidden');
								$parentRecPanel.find('.control-feedback .info.processing').addClass('hidden');
								
								
						});
						
					});
					
				}
				
			}

		});
		
	}
	
	function bindHandlers(){
	
		bindRecordControls();
		
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