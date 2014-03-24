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
			console.log(topics);
			
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

