var filename = __filename.slice(__filename.lastIndexOf(path.sep)+1),
fs = require('fs');

module.exports = {
	
	initSession : function (req, res, next) {
		
		if(!req.session.userInfo){
			//The user session does not exist
			console.log('User session does not exist');
			
			if(env.phase==='prototype'){
				var userId = ''+env.DEMOUSERID || 100; //Default userId 100
				var userInfoFilePath = [rootDir,'data',userId,'user.json'].join(path.sep);
				var userInfo = JSON.parse(fs.readFileSync(userInfoFilePath));
				req.session.userInfo = userInfo;
			}else{
				//Setup a 'guest' read only user
			}
			console.log("Current user:"+req.session.userInfo.login);
		}
		
		next();
	},
	requestLogger:function (req, res, next) {
		console.log(filename+':'+req.method+':' + req.url);
		next();
	}
	
}