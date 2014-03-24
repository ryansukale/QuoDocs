var github = require('octonode'),
	url = require('url'),
	fs = require('fs'),
	_ = require('underscore');
	
app.get('/topics', function(req, res) {
	
	var uri = url.parse(req.url);
	
	if(uri.hostname===null){
	
		var userId = env.DEMOUSERID;
		var file = [rootDir,'data',userId,'topics.json'].join(path.sep);
		
		fs.readFile(file, 'utf8', function (err, data) {
		
			if (err) {
				console.log('Error: reading file' + file);
				return {};
			}
			
			topics = JSON.parse(data);
			res.json(topics);
			
		});
		
	}
	else{
		
	}
	
});

//Get the details for a topic
app.get('/topics/:topicId', function(req, res) {
	
	console.log(req.method+':' + req.url);
	
	var uri = url.parse(req.url);
	var topicId = req.params.topicId;
	
	var returnObj = {};
	
	if(uri.hostname===null){
	
		var userId = env.DEMOUSERID;
		var topicsFile = [rootDir,'data',userId,'topics.json'].join(path.sep);
		
		fs.readFile(topicsFile, 'utf8', function (err, data) {
		
			if (err) {
				console.log('Error: reading file' + topicsFile);return {};
			}
			
			topics = JSON.parse(data);
			//console.log(topics);
			
			var responsesFile = [rootDir,'data',userId,'responses.json'].join(path.sep);
		
			fs.readFile(responsesFile, 'utf8', function (err, data) {
			
				if (err) {
					console.log('Error: reading file' + responsesFile);return {};
				}
				
				responses = JSON.parse(data);
				
				returnObj = _.findWhere(topics, {id: topicId});
				
				res.json(returnObj);
				
			});
			
		});
		
	}
	else{
		res.json(returnObj);
	}
	
});


//Update the tags for a response
//app.post('/topics', function(req, res) {
//	
//	console.log(req.method+':' + req.url);
//	
//	var uri = url.parse(req.url);
//	var returnObj = {};
//	
//	var responseId = req.params.responseId;
//	
//	var mainText = req.body.mainText,
//		description = req.body.description;
//		tags = req.body.tags;
//	
//	if(uri.hostname===null){
//		
//		var userId = ''+env.DEMOUSERID || 100;
//		var dynamicDir = env.DYNAMIC_RESP_DIR;
//		
//		var userInfoFilePath = [rootDir,'data',userId,'user.json'].join(path.sep);
//	
//		if(!userInfo){
//			var userInfo = JSON.parse(fs.readFileSync(userInfoFilePath));
//			req.session.userInfo = userInfo;
//		}
//		
//		var staticTopicsFilePath = [rootDir,'data',userId,'topics.json'].join(path.sep);
//		var dynamicTopicsFilePath = [rootDir,'data',userId,dynamicDir,'topics.json'].join(path.sep);
//		
//		var staticTopics = JSON.parse(fs.readFileSync(staticTopicsFilePath));
//		var dynamicTopics = [];
//		
//		if (fs.existsSync(dynamicTopicsFilePath)) {
//			console.log('Dynamic responses exist');
//			dynamicTopics = JSON.parse(fs.readFileSync(dynamicTopicsFilePath));
//		}else{
//			console.log('No dynamic responses found for user:'+userId);
//		}
//		
//		var topicId = randomstring.generate();
//		
//		var newTopic = {
//			"id":topicId,
//			"topic_id":itemId,
//			"user_id":userId,
//			"type" : "audio",
//			"response_details":{
//				"file_name":fileName,
//				"posted_on" : "mm/dd/yyyy",
//				"up_count":0,
//				"down_count":0
//			},
//			"tags":tags
//		};
//		
//		dynamicTopics.unshift(newTopic);
//		
//		fs.writeFileSync(dynamicTopicsFilePath, JSON.stringify(dynamicTopics));
//		
//		res.json(newTopic);
//		
//	}else{
//	
//		res.json(returnObj);
//		
//	}
//	
//});
