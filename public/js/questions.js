$(function(){

	var baseURL = 'localhost:3000/';
	
	var urls={
		streams:'./streams/'
	},
	rtcOptions = {
   'buffer-size': 16384,
	};

	$('.btn-start-rec').on('click',function(event){
		var $this = $(this);
		var $target = $(event.target);
		
		navigator.getUserMedia({audio: true}, function(mediaStream) {
			
			 window.recordRTC = RecordRTC(mediaStream,rtcOptions);
			 recordRTC.startRecording();
		});

	});

	$('.btn-stop-rec').on('click',function(event){
		var $this = $(this);
		var $target = $(event.target);
		
		recordRTC.stopRecording(function(audioURL) {
			//window.open(audioURL);
			console.log(audioURL);
			//recordRTC.save();
			
			var formData = new FormData();
			formData.append('recording', recordRTC.getBlob());

			xhr('./uploads/', formData, function (response) {
					console.log(response);
			});
			
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