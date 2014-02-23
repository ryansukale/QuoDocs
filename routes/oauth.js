var github = require('octonode'),
	url = require('url'),
	_ = require('underscore'),
  qs = require('querystring');

var githubOauthURL = github.auth.config({id: env.CLIENT_ID,secret: env.CLIENT_SECRET}).login(['user:email']);
	
var authUrls = {
	'GITHUB': githubOauthURL
};

var state = authUrls['GITHUB'].match(/&state=([0-9a-z]{32})/i);//process.env.GITHUBSTATE;

//OAUTH Callback URL
app.get('/oauth/:service', function(req, res) {

	var requestAuthURL = authUrls[req.params.service];
	res.writeHead(301, {'Content-Type': 'text/plain', 'Location': requestAuthURL})
	res.end('Redirecting to ' + requestAuthURL);
		
});

//OAUTH Callback URL
app.get('/oauthcallback', function(req, res) {

		console.log('req.session'+req.session);

		var uri = url.parse(req.url);
		var values = qs.parse(uri.query);
   
    if (!state || state[1] != values.state) {
      res.writeHead(403, {'Content-Type': 'text/plain'});
      res.end('Liar Liar, Pants on fire!');
    } else {
      github.auth.login(values.code, function (err, token) {
        //res.writeHead(200, {'Content-Type': 'text/plain'});
        //res.end('Your Token : ' + token);
				
				var client = github.client(token);
				req.session.gitToken = token;
				
				client.get('/user', {}, function (err, status, body, headers) {
					//res.send(client.me());
					res.redirect('/home.html');
					req.session.userInfo = body;
				});
				
				
      });
    }
		
});

//A generic test method that delegates to the GITHUB api
//to get data for an authenticated user based upon the URL's passed
app.get('/testAPI/*', function(req, res) {

	var token = req.session.gitToken,
	userInfo = req.session.userInfo,
	client = github.client(token);
	
	var uri = url.parse(req.url);
	
	var requestURL = "/"+uri.path.split('/').slice(2).join('/');//'/user/repos';
	if(!requestURL || requestURL.length===0){
		requestURL = '/user/repos';
	}
	var requestParams = {};

	client.get(requestURL, requestParams, function (err, status, body, headers) {
		res.send(body);
	});
	
});