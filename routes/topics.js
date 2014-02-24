var github = require('octonode'),
	url = require('url'),
	fs = require('fs'),
	_ = require('underscore');
	
app.get('/topics', function(req, res) {
	
	var uri = url.parse(req.url);
	
	if(uri.hostname===null){
	
		var file = rootDir + '/data/static/topics.json';
		fs.readFile(file, 'utf8', function (err, data) {
			if (err) {
				console.log('Error: ' + err);
				return {};
			}
			repos = JSON.parse(data);
			res.json(repos);
		});
		
	}
	else{
		
	}
	
});

app.get('/topics/:topicId', function(req, res) {
	
	var uri = url.parse(req.url);
	
	if(uri.hostname===null){
	
		var file = rootDir + '/data/static/topics.json';
		fs.readFile(file, 'utf8', function (err, data) {
			if (err) {
				console.log('Error: ' + err);
				return {};
			}
			repos = JSON.parse(data);
			res.json(repos);
		});
		
	}
	else{
		
	}
	
});