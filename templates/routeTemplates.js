var util = require('util'),
url = require('url'),
fs = require('fs'),
_ = require('underscore'),
randomstring = require("randomstring"),
dateformat = require('dateformat');

var filename = __filename.slice(__filename.lastIndexOf(path.sep)+1);

//Update the tags for a response
app.post('/topics', function(req, res) {
	
	console.log(filename+":"+req.method+':' + req.url);
	
	var uri = url.parse(req.url);
	var returnObj = {};
	
	var responseId = req.params.responseId;
	
	var mainText = req.body.mainText,
		description = req.body.description;
		tags = req.body.tags;
	
	if(env.phase==='prototype'){
		
		var userId = ''+env.DEMOUSERID || 100;
		var dynamicDir = env.DYNAMIC_RESP_DIR;
		
		var userInfoFilePath = [rootDir,'data',userId,'user.json'].join(path.sep);
	
		if(!userInfo){
			var userInfo = JSON.parse(fs.readFileSync(userInfoFilePath));
			req.session.userInfo = userInfo;
		}
		
		var staticResponsesFilePath = [rootDir,'data',userId,'responses.json'].join(path.sep);
		var dynamicResponsesFilePath = [rootDir,'data',userId,dynamicDir,'responses.json'].join(path.sep);
		
		var staticResponses = JSON.parse(fs.readFileSync(staticResponsesFilePath));
		var dynamicResponses = [];
		
		if (fs.existsSync(dynamicResponsesFilePath)) {
			console.log('Dynamic responses exist');
			dynamicResponses = JSON.parse(fs.readFileSync(dynamicResponsesFilePath));
		}else{
			console.log('No dynamic responses found for user:'+userId);
		}
		
		var allResponses = dynamicResponses.concat(staticResponses);
		var currentResponse = _.findWhere(allResponses, {"id": responseId});
		
		currentResponse.tags=newTags;
		
		//At the moment, only supports updating tags for dynamic responses
		fs.writeFileSync(dynamicResponsesFilePath, JSON.stringify(dynamicResponses));
		
		res.json(currentResponse);
		
	}else{
	
		res.json(returnObj);
		
	}
	
});
