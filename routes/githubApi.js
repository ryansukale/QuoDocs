var github = require('octonode'),
	url = require('url'),
	fs = require('fs'),
	_ = require('underscore');
	
app.get('/projects', function(req, res) {
	
	var uri = url.parse(req.url);
	
	if(uri.hostname===null){
		console.log('local invocation');
		
		var userId = env.DEMOUSERID;
		var file = [rootDir,'data',userId,'projects.json'].join(path.sep);
		
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
	
		//Get all the repos of the user
		var requestURL = '/user/repos';
		var requestParams = {};
		
		var token = req.session.gitToken,
		userInfo = req.session.userInfo,
		client = github.client(token);

		client.get(requestURL, requestParams, function (err, status, body, headers) {
			res.send(body);
		});
		
	}
	
});

app.post('/getParentRepos', function(req, res) {

	//Get the parent repos of the given repos
	var requestURL = '/user/repos'; //TODO
	var requestParams = {};
	
	var token = req.session.gitToken,
	userInfo = req.session.userInfo,
	client = github.client(token);
	
	client.get(requestURL, requestParams, function (err, status, body, headers) {
		res.send(body);
	});
	
});

app.get('/repos/:repoId/contributors', function(req, res) {
	
	var uri = url.parse(req.url);
	
	if(uri.hostname===null){
		console.log('local invocation');
		
		var file = [rootDir,'data/static/contributors',req.params.repoId+'.json'].join(path.sep);
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