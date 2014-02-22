//var GitHubApi = require("github");
var github = require('octonode'),
	url = require('url'),
  qs = require('querystring');

var githubOauthURL = github.auth.config({id: process.env.CLIENT_ID,secret: process.env.CLIENT_SECRET}).login(['user:email']);
	
var authUrls = {
	'GITHUB': githubOauthURL
};

var state = authUrls['GITHUB'].match(/&state=([0-9a-z]{32})/i);//process.env.GITHUBSTATE;

//OAUTH Callback URL
app.get('/oauthcallback', function(req, res) {

		var uri = url.parse(req.url);
		var values = qs.parse(uri.query);
   
    if (!state || state[1] != values.state) {
      res.writeHead(403, {'Content-Type': 'text/plain'});
      res.end('Liar Liar, Pants on fire!');
    } else {
      github.auth.login(values.code, function (err, token) {
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end('Your Token : ' + token);
      });
    }
		
		//First get the accesstoken by posting code you get from the response
		
		//var client = github.client('someaccesstoken');
		//res.send("respond with a resource");
});


//OAUTH Callback URL
app.get('/oauth/:service', function(req, res) {

	var requestAuthURL = authUrls[req.params.service];
	res.writeHead(301, {'Content-Type': 'text/plain', 'Location': requestAuthURL})
	res.end('Redirecting to ' + requestAuthURL);
		
});

app.get('/githubapitest', function(req, res) {

	var client = github.client();

	client.get('/users/pksunkara', {}, function (err, status, body, headers) {
		console.log(body); //json object
		res.json(body);
	});
	
});