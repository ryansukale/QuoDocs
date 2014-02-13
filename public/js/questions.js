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
			
			//$.ajax({
			//	url: urls.streams,
			//	data:{'file':'ryan2'},
			//	type: 'POST',
			//	success: function(data){
			//		console.log(data);
			//	}
			//});
			
			
			//console.log(recordRTC.getBlob());
			//$.ajax({
			//	url:urls.streams,
			//	type:'post',
			//	data:{
			//		file:recordRTC.getBlob(),
			//		name:'Random'+(1000*Math.floor(Math.random()))
			//	}
			//});
			//recordRTC.save();
			
			//I could possibly also use this
			var fd = new FormData();    
			fd.append( 'file', recordRTC.getBlob() );
			
			var request = new XMLHttpRequest();
			request.onload = function(){};

			request.open("POST", urls.streams);
			request.send(fd);
      
			//$.ajax({
			//	url: urls.streams,
			//	data: fd,
			//	type: 'POST',
			//	contentType: false,
      //  processData: false,
			//	success: function(data){
			//		//alert(data);
			//	}
			//});
			
			//xhr('./streams/',{yo:'all'},function(response){
			//	console.log(response);
			//})
			
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
