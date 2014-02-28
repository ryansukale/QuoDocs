$(function(){
	
	var urls={
		uploads:'./uploads/',
		topics:'topics'
	},
	rtcOptions = {
   'buffer-size': 16384,
	};
	
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
				
				$('.topic-details .topic').html(tmpl.topic(data.topicInfo));
				
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
			
			//Check if the action is from the recording panel
			if($target.parents('.rec-panel').length>0){
				
				if($target.hasClass('submit')){
					console.log('Yahoo!');
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
			
			if($this.hasClass('start-rec')){
			
				navigator.getUserMedia({audio: true}, function(mediaStream) {

					window.recordRTC = RecordRTC(mediaStream,rtcOptions);
					recordRTC.startRecording();
					
					$this.text('Stop');
					$this.toggleClass('start-rec stop-rec');

				});
				
			}else{
				
				if($this.hasClass('stop-rec')){
				
					recordRTC.stopRecording(function(audioURL) {
					//window.open(audioURL);
					console.log(audioURL);
					//recordRTC.save();
					
					var formData = new FormData();
					formData.append('recording', recordRTC.getBlob());

						xhr('./uploads/', formData, function (response) {
								console.log(response);
								$this.text('Done');
								
								$this.parents('.rec-panel').find('.rec-details').removeClass('hidden').find('.rec-link').attr('href',audioURL);
								//$this.toggleClass('start-rec stop-rec');
								$this.removeClass('start-rec stop-rec rec-control btn btn-primary');
								$this.addClass('alert alert-info');
								
						});
						
					});
					
				}
				
			}

		});
		
	}
	
	function bindHandlers(){
	
		bindRecordControls();
		
	}

	/*
	$('.recording-control').on('click',function(event){
			var $this = $(this);
			var $target = $(event.target);
			
			if($this.hasClass('btn-start-rec')){
			
				navigator.getUserMedia({audio: true}, function(mediaStream) {

					window.recordRTC = RecordRTC(mediaStream,rtcOptions);
					recordRTC.startRecording();
					
					$this.text('Stop');

				});
				
			}else{
				
				recordRTC.stopRecording(function(audioURL) {
				//window.open(audioURL);
				console.log(audioURL);
				//recordRTC.save();
				
				var formData = new FormData();
				formData.append('recording', recordRTC.getBlob());

					xhr('./uploads/', formData, function (response) {
							console.log(response);
							$this.text('Start');
							
							$this.siblings('.rec-link').removeClass('hidden').attr('href',audioURL);
					});
					
				});
				
			}
			
			$this.toggleClass('btn-start-rec btn-stop-rec');

		});
	*/
	
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