var util = require('util'),
url = require('url'),
fs = require('fs'),
_ = require('underscore'),
randomstring = require("randomstring"),
dateformat = require('dateformat');

var filename = __filename.slice(__filename.lastIndexOf(path.sep)+1);

//Returns all the responses for a given topic
app.get('/projects/members/:projectId', function(req, res) {
	console.log(filename+":");
	
	var uri = url.parse(req.url);
	var returnObj = {};
	
	var userId = req.session.userInfo;
	var projectId = req.params.projectId;
	
	if(env.phase==='prototype'){
		
		var userId = ''+env.DEMOUSERID || 100;
		var dynamicDir = env.DYNAMIC_RESP_DIR;
		
		var allUsersFilePath = [rootDir,'data','allUsers.json'].join(path.sep);
		
		var allUsers = JSON.parse(fs.readFileSync(allUsersFilePath));
		
		var projectMembers = [];
		_.each(allUsers, function(user, index, list){
			if(user.projects.indexOf(projectId)>-1){
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

//Returns the details for a given project
app.get('/projects/:projectId', function(req, res) {
	
	console.log(filename+":");
	
	var uri = url.parse(req.url);
	var returnObj = {};
	
	var projectId = req.params.projectId;

	if(env.phase==='prototype'){
		
		var userId = ''+env.DEMOUSERID || 100;
		var dynamicDir = env.DYNAMIC_RESP_DIR;
		
		var userInfoFilePath = [rootDir,'data',userId,'user.json'].join(path.sep);
	
		if(!userInfo){
			var userInfo = JSON.parse(fs.readFileSync(userInfoFilePath));
			req.session.userInfo = userInfo;
		}
		
		var projectsFilePath = [rootDir,'data',userId,'projects.json'].join(path.sep);
		var allProjects = JSON.parse(fs.readFileSync(projectsFilePath));
		
		var projectDetails = _.findWhere(allProjects,{id:projectId});
		
		returnObj = projectDetails;
		
		res.json(returnObj);
		
	}else{
	
		res.json(returnObj);
		
	}
	
});


//Returns all the invitees for a given project
app.get('/projects/invitees/:projectId', function(req, res) {
	console.log(filename+":");
	
	var uri = url.parse(req.url);
	var returnObj = {};
	
	var userId = req.session.userInfo;
	var projectId = req.params.projectId;
	
	if(env.phase==='prototype'){
		
		var userId = ''+env.DEMOUSERID || 100;
		var dynamicDir = env.DYNAMIC_RESP_DIR;
		
		var allInviteesFilePath = [rootDir,'data','allInvitees.json'].join(path.sep);
		
		var allInvitees = JSON.parse(fs.readFileSync(allInviteesFilePath));
		
		var projectInvitees = _.where(allInvitees,{"projectId":projectId});
		
		
		returnObj = {
			count:projectInvitees.length,
			invitees:projectInvitees
		};
		
		res.json(returnObj);
		
	}else{
	
		res.json(returnObj);
		
	}
	
});

//Creates an invitee for a project
app.post('/projects/invitees', function(req, res) {

	console.log(filename+":");
	
	var uri = url.parse(req.url);
	var returnObj = {};
	
	if(env.phase==='prototype'){
		
		var userId = ''+env.DEMOUSERID || 100;
		var dynamicDir = env.DYNAMIC_RESP_DIR;
		
		var allInviteesFilePath = [rootDir,'data','allInvitees.json'].join(path.sep);
		
		var allInvitees = JSON.parse(fs.readFileSync(allInviteesFilePath));
		
		//var projectInvitees = _.where(allInvitees,{"projectId":projectId});
		console.log(req.body);
		
		var newInvitee = {
			emailId:req.body.emailId,
			projectId:req.body.projectId
		};
		
		console.log(newInvitee);
		allInvitees.unshift(newInvitee);
		
		fs.writeFileSync(allInviteesFilePath, JSON.stringify(allInvitees));
		
		returnObj = newInvitee;
		
		res.json(returnObj);
		
	}else{
	
		res.json(returnObj);
		
	}
	
});