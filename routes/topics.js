var github = require('octonode'),
	url = require('url'),
	fs = require('fs'),
	randomstring = require("randomstring"),
	_ = require('underscore');
	
app.get('/topics', function(req, res) {
	
	console.log(req.method+':' + req.url);
	var uri = url.parse(req.url);
	
	var returnObj = {};
	
	if(uri.hostname===null){
	
		var userId = ''+env.DEMOUSERID || 100;
		var dynamicDir = env.DYNAMIC_RESP_DIR;
		
		var staticTopicsFilePath = [rootDir,'data',userId,'topics.json'].join(path.sep);
		var dynamicTopicsFilePath = [rootDir,'data',userId,dynamicDir,'topics.json'].join(path.sep);
		
		var staticTopics = JSON.parse(fs.readFileSync(staticTopicsFilePath));
		var dynamicTopics = [];
		
		if (fs.existsSync(dynamicTopicsFilePath)) {
			console.log('Dynamic topics exist');
			dynamicTopics = JSON.parse(fs.readFileSync(dynamicTopicsFilePath));
		}else{
			console.log('No dynamic topics found ');
		}
		
		var allTopics = dynamicTopics.concat(staticTopics);
		
		returnObj = allTopics;
		
		res.json(returnObj);
		
	}
	else{
		res.json(returnObj);
	}
	
});

//Get the details for a topic
app.get('/topics/:topicId', function(req, res) {
	
	console.log(req.method+':' + req.url);
	
	var uri = url.parse(req.url);
	var topicId = req.params.topicId;
	
	var returnObj = {};
	
	if(uri.hostname===null){
	
		var userId = ''+env.DEMOUSERID || 100;		
		var dynamicDir = env.DYNAMIC_RESP_DIR;
		
		var staticTopicsFilePath = [rootDir,'data',userId,'topics.json'].join(path.sep);
		var dynamicTopicsFilePath = [rootDir,'data',userId,dynamicDir,'topics.json'].join(path.sep);
		
		var staticTopics = JSON.parse(fs.readFileSync(staticTopicsFilePath));
		var dynamicTopics = [];
		
		if (fs.existsSync(dynamicTopicsFilePath)) {
			console.log('Dynamic topics exist');
			dynamicTopics = JSON.parse(fs.readFileSync(dynamicTopicsFilePath));
			console.log('dynamicTopics:',dynamicTopics);
		}else{
			console.log('No dynamic topics found ');
		}
		
		var topicsFile = [rootDir,'data',userId,'topics.json'].join(path.sep);
		
		var allTopics = dynamicTopics.concat(staticTopics);
		
		returnObj = _.findWhere(allTopics, {id: topicId});
		//returnObj = allTopics;
				
		res.json(returnObj);
		
	}
	else{
		res.json(returnObj);
	}
	
});


//Update the tags for a response
app.post('/topics', function(req, res) {
	
	console.log(req.method+':' + req.url);
	
	var uri = url.parse(req.url);
	var returnObj = {};
	
	var responseId = req.params.responseId;
	
	var mainText = req.body.mainText,
		projectId = req.body.projectId,
		description = req.body.description;
		tags = req.body.tags;
	
	if(uri.hostname===null){
		
		var userId = ''+env.DEMOUSERID || 100;
		var dynamicDir = env.DYNAMIC_RESP_DIR;
		
		var userInfoFilePath = [rootDir,'data',userId,'user.json'].join(path.sep);
	
		if(!userInfo){
			var userInfo = JSON.parse(fs.readFileSync(userInfoFilePath));
			req.session.userInfo = userInfo;
		}
		
		var dynamicTopicsFilePath = [rootDir,'data',userId,dynamicDir,'topics.json'].join(path.sep);
		
		var dynamicTopics = [];
		
		if (fs.existsSync(dynamicTopicsFilePath)) {
			console.log('Dynamic topics exist');
			dynamicTopics = JSON.parse(fs.readFileSync(dynamicTopicsFilePath));
		}else{
			console.log('No dynamic topics found ');
		}
		
		var topicId = randomstring.generate();
		
		var newTopic = {
			"id":topicId,
			"project_id":projectId,
			"owner_id":userId,
			"main_text" : mainText || '',
			"description" : description||'',
			"up_count" : "0",
			"down_count" : "0",
			"is_anwered" : "0",
			"answer_count" : "0",
			"posted_on" : "10/03/2014",
			"tags": tags||[]
		}
		
		dynamicTopics.unshift(newTopic);
		
		fs.writeFileSync(dynamicTopicsFilePath, JSON.stringify(dynamicTopics));
		
		res.json(newTopic);
		
	}else{
	
		res.json(returnObj);
		
	}
	
});
