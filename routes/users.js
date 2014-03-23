var github = require('octonode'),
	url = require('url'),
	fs = require('fs'),
	_ = require('underscore');
	
/*
 * users api.
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