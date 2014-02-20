//var GitHubApi = require("github");
var github = require('octonode');
//Project Home!
//app.get('/', function(req, res) {
//		res.send("respond with a resource");
//});


//OAUTH Callback URL
app.get('/oauthcallback', function(req, res) {
		
		console.log(res);
		
		//First get the accesstoken by posting code you get from the response
		
		//var client = github.client('someaccesstoken');
		res.send("respond with a resource");
});


//OAUTH Callback URL
app.get('/oauth/:service', function(req, res) {

	var responseObj={};
	
	if(req.params.service==='GITHUB'){
		console.log('here!');
		responseObj.CLIENT_ID = process.env.CLIENT_ID || 0;
	}
	
	res.json(responseObj);
	
});


//app.get('/githubapitest', function(req, res) {
//
//	var github = new GitHubApi({
//		// required
//		version: "3.0.0",
//		// optional
//		debug: true,
//		protocol: "https",
//		host: "quodocs.com",
//		pathPrefix: "/api/v3", // for some GHEs
//		timeout: 5000
//	});
//	github.user.getFollowingFromUser({
//		user: "mikedeboer"
//	}, function(err, data) {
//		res.json(data);
//	});
//	
//});

app.get('/githubapitest', function(req, res) {

	var client = github.client();

	client.get('/users/pksunkara', {}, function (err, status, body, headers) {
		console.log(body); //json object
		res.json(body);
	});
	
});
