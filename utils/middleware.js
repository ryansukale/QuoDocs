var filename = __filename.slice(__filename.lastIndexOf(path.sep)+1),
fs = require('fs');

module.exports = {
	
	initSession : function (req, res, next) {
		
			if(env.phase==='prototype'){
				var userId = '';
				if(req.query.loginAsUserId){
					userId = req.query.loginAsUserId;
					env.DEMOUSERID = userId;
					userInfoFilePath = [rootDir,'data',userId,'user.json'].join(path.sep);
					console.log(userInfoFilePath);
					var userInfo = JSON.parse(fs.readFileSync(userInfoFilePath));
					req.session.userInfo = userInfo;
					console.log("Current user:"+req.session.userInfo.login);
				}
				
			}else{
				//Setup a 'guest' read only user
			}
		
		next();
	},
	requestLogger:function (req, res, next) {
		console.log(filename+':'+req.method+':' + req.url);
		next();
	}
	
}