$(function(){

	var baseURL = 'localhost:3000/';
	
	var urls={
		streams:'./streams/'
	}
	
	$('.btn-start-rec').on('click',function(event){
		var $this = $(this);
		var $target = $(event.target);
		
		navigator.getUserMedia({audio: true}, function(mediaStream) {
			 window.recordRTC = RecordRTC(mediaStream);
			 recordRTC.startRecording();
		});

	});

	$('.btn-stop-rec').on('click',function(event){
		var $this = $(this);
		var $target = $(event.target);
		
		recordRTC.stopRecording(function(audioURL) {
			//window.open(audioURL);
			console.log(audioURL);
			recordRTC.save();
		});
		
	});
	
	
	
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