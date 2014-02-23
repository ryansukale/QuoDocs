var github = require('octonode'),
	_ = require('underscore');
	
app.get('/getRepos', function(req, res) {
	
	//Get all the repos of the user
	var requestURL = '/user/repos';
	var requestParams = {};
	
	var token = req.session.gitToken,
	userInfo = req.session.userInfo,
	client = github.client(token);

	client.get(requestURL, requestParams, function (err, status, body, headers) {
		res.send(body);
	});
	
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