var util = require('util'),
url = require('url'),
fs = require('fs'),
_ = require('underscore'),
randomstring = require("randomstring"),
dateformat = require('dateformat');

//Returns all the responses for a given topic
app.get('/projects/members/:projectId', function(req, res) {

	console.log(req.method+':' + req.url);
	
	var uri = url.parse(req.url);
	var returnObj = {};
	
	var userId = req.session.userInfo;
	var projectId = req.params.projectId;
	
	if(uri.hostname===null){
				
		var userId = ''+env.DEMOUSERID || 100;
		var dynamicDir = env.DYNAMIC_RESP_DIR;
		
		var allUsersFilePath = [rootDir,'data','allUsers.json'].join(path.sep);
		
		var allUsers = JSON.parse(fs.readFileSync(allUsersFilePath));
		
		var projectMembers = [];
		_.each(allUsers, function(user, index, list){
			if(user.projects.indexOf(projectId)>0){
				projectMembers.push(user);
			}
		});
		
		returnObj = {
			count:projectMembers.length,
			members:projectMembers
		};
		
		res.json(returnObj);
		
	}else{
	
		res.json(returnObj);
		
	}
	
});