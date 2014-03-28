var github = require('octonode'),
	url = require('url'),
	fs = require('fs'),
	_ = require('underscore');
	
/*
 * Get the current logged in user's information
 */
app.get('/userinfo', function(req, res) {
	
	console.log(req.method+':' + req.url);
	
	var uri = url.parse(req.url);
	var returnObj = {};
	
	if(uri.hostname===null){
	
		var userId = ''+env.DEMOUSERID || 100;
		
		if(req.session.userInfo){
			returnObj = req.session.userInfo;
			res.json(returnObj);
		}else{
			var userInfoFilePath = [rootDir,'data',userId,'user.json'].join(path.sep);
			var userInfo = JSON.parse(fs.readFileSync(userInfoFilePath));
			req.session.userInfo = userInfo;
			
			returnObj = userInfo;
			
			res.json(returnObj);
		}
		
	}else{
		res.json(returnObj);
	}
	
});	

/*
 * Get information for all the users
 */
app.get('/users', function(req, res) {
	
	console.log(req.method+':' + req.url);
	
	var uri = url.parse(req.url);
	var returnObj = {};
	
	//Set a default parameter that returns users 0 - 99
	//from the request parameters
	var startIndex = req.params.startIndex || 0,
		endIndex = req.params.endIndex || 99;
	
	if(env.phase==='prototype'){
	
		var userId = ''+env.DEMOUSERID || 100;
		
		if(req.session.userInfo){
			returnObj = req.session.userInfo;
			res.json(returnObj);
		}else{
			var userInfoFilePath = [rootDir,'data',userId,'user.json'].join(path.sep);
			var userInfo = JSON.parse(fs.readFileSync(userInfoFilePath));
			req.session.userInfo = userInfo;
			
			var allUsersFilePath = [rootDir,'data','allUsers.json'].join(path.sep);
		
			var allUsers = JSON.parse(fs.readFileSync(allUsersFilePath));
			
			returnObj = {
				count:allUsers.length,
				users:allUsers
			};
			
			res.json(returnObj);
		}
		
	}else{
		res.json(returnObj);
	}
	
});