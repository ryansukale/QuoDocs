var	url = require('url'),
	fs = require('fs');

app.get('/login', function(req, res) {
	
	var uri = url.parse(req.url);
	
	if(uri.hostname===null){
		
		var userId = env.DEMOUSERID;
		
		var file = [rootDir,'data',userId,'user.json'].join(path.sep);
		
		fs.readFile(file, 'utf8', function (err, data) {
			if (err) {
				console.log('Error: ' + err);
				return {};
			}
			
			//req.session.userInfo = body;
			req.session.userInfo = JSON.parse(data);
			res.redirect('/home.html');
			
		});
		
	}
	else{
		
	}
	
});