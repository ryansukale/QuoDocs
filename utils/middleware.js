var filename = __filename.slice(__filename.lastIndexOf(path.sep)+1);

module.exports = {
	
	initSession : function (req, res, next) {
		
		if(!req.session.userInfo){
			//The user session does not exist
			console.log('User session does not exist');
			
		}
		
		next();
	},
	requestLogger:function (req, res, next) {
		console.log(filename+':'+req.method+':' + req.url);
		next();
	}
	
}