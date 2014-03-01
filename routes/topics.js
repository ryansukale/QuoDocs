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

app.get('/topics/:topicId', function(req, res) {
	
	var uri = url.parse(req.url);
	var topicId = +(req.params.topicId);
	
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
				//console.log(responses);
				
				//console.log('req.params.topicId',req.params.topicId);
				var responseObj = {};
				responseObj.topicInfo = _.findWhere(topics, {id: topicId});
				responseObj.responseInfo = _.where(responses, {"topic_id": topicId});
				
				res.json(responseObj);
				
			});
			
		});
		
	}
	else{
		
	}
	
});