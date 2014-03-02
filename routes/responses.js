var multiparty = require('multiparty'),
util = require('util'),
url = require('url'),
fs = require('fs'),
_ = require('underscore'),
randomstring = require("randomstring"),
dateformat = require('dateformat'),
fileExtension = '.wav';

//Creating a new response
app.post('/responses/upload', function(req, res) {

	console.log('Request' + req.url);
	
	var uri = url.parse(req.url);
	var respObject = {};
	
	var form = new multiparty.Form();
	
	var userId = req.session.userInfo;
	
	form.parse(req, function(err, fields, files) {
		if (err) {
			res.writeHead(400, {'content-type': 'text/plain'});
			res.end("invalid request: " + err.message);
			return;
		}
		
		var itemId = fields['itemId'],
		itemType = fields['itemType'],
		projectId = fields['projectId'];
	
		var audioUploadDir = [rootDir,config.uploads.base,config.uploads.type['audio']].join(path.sep);
		
		var fileNameBase = [itemType,projectId,itemId].join('_');
		
		var audioFiles = fs.readdirSync(audioUploadDir); // Get the list of existing files
		console.log(audioFiles);
		
		var audioCount = 0;
		
		for(var i=0;i<audioFiles.length;i++){
			if(audioFiles[i].indexOf(fileNameBase)!==-1){
				audioCount++;
			}
		}
		
		audioCount++;
		var fileName = [fileNameBase,audioCount].join('_')+fileExtension;
		console.log('proposedFileName',fileName);
		
		fs.readFile(files.recording[0].path, function (err, data) {
		
			var newPath = [audioUploadDir,fileName].join(path.sep)+fileExtension;
			
			fs.writeFile(newPath, data, function (err) {
				
				fs.unlink(files.recording[0].path, function (err) {
					if (err) throw err;
					console.log('successfully deleted temp file' + files.recording[0].path);
				});
				
				if(uri.hostname===null){
				
					var userId = env.DEMOUSERID || 100;
					var dynamicDir = env.DYNAMIC_RESP_DIR;
					
					var responsesFilePath = [rootDir,'data',userId,dynamicDir,'responses.json'].join(path.sep);
					
					var topicResponseDtls = {};
					
					if (fs.existsSync(responsesFilePath)) {
							console.log('file Exists');
							//Read the responses from that file
							
					}else{
						//Create a new file in that path
						console.log('file does not exist');
					}

		
					var responseId = randomstring.generate();
				
					//Create a new response using the generatedId
					//var topicResponse = {
					//	"id":responseId,
					//	"topic_id":itemId,
					//	"user_id":userId,
					//	"type" : "audio",
					//	"response_details":{
					//		"file_name":"",
					//		"posted_on" : "mm/dd/yyyy",
					//		"up_count":0,
					//		"down_count":0,
					//		"tags":[
					//		]
					//	}
					//};
					//Append the response to the list of responses
					
					//Write the responses to dynamic responses file
					
					respObject.responseId = responseId;
					respObject.fileName = fileName;
					
					res.send(respObject);
				
				}
				
				
				
				
			});
			
		});
		
	});
	
	
	
	
	
});


//Update the tags for a response
app.post('/responses/tags/:responseId', function(req, res) {

	var requestAuthURL = authUrls[req.params.responseId];
	
	res.writeHead(301, {'Content-Type': 'text/plain', 'Location': requestAuthURL})
	res.end('Redirecting to ' + requestAuthURL);
	
});